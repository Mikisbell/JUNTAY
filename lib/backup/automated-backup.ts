import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

export interface BackupConfig {
  id: string
  name: string
  type: 'incremental' | 'full' | 'differential'
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  retention_days: number
  tables: string[]
  enabled: boolean
  storage_location: 'supabase' | 'external' | 'both'
  encryption_enabled: boolean
  compression_enabled: boolean
}

export interface BackupJob {
  id: string
  config_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  started_at: Date
  completed_at?: Date
  file_size?: number
  file_path?: string
  error_message?: string
  records_backed_up: number
  checksum?: string
}

export interface BackupMetrics {
  total_backups: number
  successful_backups: number
  failed_backups: number
  total_size_mb: number
  avg_backup_time_minutes: number
  last_successful_backup: Date | null
  retention_compliance: number // percentage
}

export class AutomatedBackup {
  private static supabase = createClient()
  
  /**
   * Configuraciones predefinidas de backup
   */
  private static readonly DEFAULT_CONFIGS: BackupConfig[] = [
    {
      id: 'incremental_4h',
      name: 'Backup Incremental cada 4 horas',
      type: 'incremental',
      frequency: 'hourly', // Se ejecuta cada hora, pero solo hace backup si hay cambios
      retention_days: 7,
      tables: ['creditos', 'clientes', 'garantias', 'pagos', 'movimientos_caja'],
      enabled: true,
      storage_location: 'both',
      encryption_enabled: true,
      compression_enabled: true
    },
    {
      id: 'full_daily',
      name: 'Backup Completo Diario',
      type: 'full',
      frequency: 'daily',
      retention_days: 30,
      tables: ['*'], // Todas las tablas
      enabled: true,
      storage_location: 'both',
      encryption_enabled: true,
      compression_enabled: true
    },
    {
      id: 'full_weekly',
      name: 'Backup Completo Semanal',
      type: 'full',
      frequency: 'weekly',
      retention_days: 365,
      tables: ['*'],
      enabled: true,
      storage_location: 'external',
      encryption_enabled: true,
      compression_enabled: true
    }
  ]

  /**
   * Inicializa el sistema de backup
   */
  static async initializeBackupSystem(): Promise<void> {
    // Crear tablas de configuración si no existen
    await this.createBackupTables()
    
    // Insertar configuraciones por defecto
    for (const config of this.DEFAULT_CONFIGS) {
      await this.upsertBackupConfig(config)
    }
    
    console.log('✅ Sistema de backup inicializado')
  }

  /**
   * Ejecuta backups programados
   */
  static async runScheduledBackups(): Promise<BackupJob[]> {
    const configs = await this.getActiveBackupConfigs()
    const jobs: BackupJob[] = []
    
    for (const config of configs) {
      const shouldRun = await this.shouldRunBackup(config)
      
      if (shouldRun) {
        try {
          const job = await this.executeBackup(config)
          jobs.push(job)
        } catch (error) {
          console.error(`Error ejecutando backup ${config.id}:`, error)
          await this.logBackupError(config.id, error)
        }
      }
    }
    
    // Limpiar backups antiguos
    await this.cleanupOldBackups()
    
    return jobs
  }

  /**
   * Ejecuta un backup específico
   */
  static async executeBackup(config: BackupConfig): Promise<BackupJob> {
    const jobId = this.generateJobId()
    const startTime = new Date()
    
    // Crear registro del job
    const job: BackupJob = {
      id: jobId,
      config_id: config.id,
      status: 'running',
      started_at: startTime,
      records_backed_up: 0
    }
    
    await this.saveBackupJob(job)
    
    try {
      // Obtener datos para backup
      const backupData = await this.collectBackupData(config)
      
      // Procesar datos (comprimir, encriptar si está habilitado)
      const processedData = await this.processBackupData(backupData, config)
      
      // Guardar backup
      const filePath = await this.saveBackupFile(processedData, config, jobId)
      
      // Calcular checksum para verificación de integridad
      const checksum = await this.calculateChecksum(processedData)
      
      // Actualizar job como completado
      job.status = 'completed'
      job.completed_at = new Date()
      job.file_path = filePath
      job.file_size = processedData.length
      job.checksum = checksum
      job.records_backed_up = backupData.totalRecords
      
      await this.saveBackupJob(job)
      
      // Log de éxito
      await this.logBackupSuccess(config.id, job)
      
      return job
      
    } catch (error) {
      // Actualizar job como fallido
      job.status = 'failed'
      job.completed_at = new Date()
      job.error_message = error instanceof Error ? error.message : 'Error desconocido'
      
      await this.saveBackupJob(job)
      throw error
    }
  }

  /**
   * Restaura un backup específico
   */
  static async restoreBackup(jobId: string, targetTables?: string[]): Promise<{
    success: boolean
    records_restored: number
    errors: string[]
  }> {
    const job = await this.getBackupJob(jobId)
    if (!job || job.status !== 'completed') {
      throw new Error('Backup job no válido o no completado')
    }
    
    try {
      // Cargar datos del backup
      const backupData = await this.loadBackupFile(job.file_path!)
      
      // Verificar integridad
      const currentChecksum = await this.calculateChecksum(backupData)
      if (currentChecksum !== job.checksum) {
        throw new Error('Checksum no coincide - archivo corrupto')
      }
      
      // Procesar y restaurar datos
      const result = await this.restoreBackupData(backupData, targetTables)
      
      // Log de restauración
      await this.logBackupRestore(jobId, result)
      
      return result
      
    } catch (error) {
      await this.logBackupError(jobId, error, 'restore')
      throw error
    }
  }

  /**
   * Obtiene métricas de backup
   */
  static async getBackupMetrics(days: number = 30): Promise<BackupMetrics> {
    const { data: jobs } = await this.supabase
      .from('backup_jobs')
      .select('*')
      .gte('started_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('started_at', { ascending: false })
    
    if (!jobs || jobs.length === 0) {
      return {
        total_backups: 0,
        successful_backups: 0,
        failed_backups: 0,
        total_size_mb: 0,
        avg_backup_time_minutes: 0,
        last_successful_backup: null,
        retention_compliance: 100
      }
    }
    
    const successful = jobs.filter(j => j.status === 'completed')
    const failed = jobs.filter(j => j.status === 'failed')
    const totalSize = successful.reduce((sum, j) => sum + (j.file_size || 0), 0)
    
    const avgTime = successful.length > 0 ? 
      successful.reduce((sum, j) => {
        const duration = new Date(j.completed_at).getTime() - new Date(j.started_at).getTime()
        return sum + duration
      }, 0) / successful.length / (1000 * 60) : 0
    
    const lastSuccessful = successful.length > 0 ? 
      new Date(successful[0].completed_at) : null
    
    return {
      total_backups: jobs.length,
      successful_backups: successful.length,
      failed_backups: failed.length,
      total_size_mb: totalSize / (1024 * 1024),
      avg_backup_time_minutes: avgTime,
      last_successful_backup: lastSuccessful,
      retention_compliance: this.calculateRetentionCompliance(jobs)
    }
  }

  /**
   * Verifica la integridad de backups existentes
   */
  static async verifyBackupIntegrity(): Promise<{
    total_checked: number
    valid_backups: number
    corrupted_backups: string[]
    missing_files: string[]
  }> {
    const { data: jobs } = await this.supabase
      .from('backup_jobs')
      .select('*')
      .eq('status', 'completed')
      .not('file_path', 'is', null)
      .not('checksum', 'is', null)
    
    const result = {
      total_checked: jobs?.length || 0,
      valid_backups: 0,
      corrupted_backups: [] as string[],
      missing_files: [] as string[]
    }
    
    if (!jobs) return result
    
    for (const job of jobs) {
      try {
        const exists = await this.checkFileExists(job.file_path)
        if (!exists) {
          result.missing_files.push(job.id)
          continue
        }
        
        const data = await this.loadBackupFile(job.file_path)
        const checksum = await this.calculateChecksum(data)
        
        if (checksum === job.checksum) {
          result.valid_backups++
        } else {
          result.corrupted_backups.push(job.id)
        }
      } catch (error) {
        result.corrupted_backups.push(job.id)
      }
    }
    
    return result
  }

  // Métodos privados de implementación
  private static async createBackupTables(): Promise<void> {
    // Crear tablas necesarias para el sistema de backup
    const queries = [
      `
      CREATE TABLE IF NOT EXISTS backup_configs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT CHECK (type IN ('incremental', 'full', 'differential')),
        frequency TEXT CHECK (frequency IN ('hourly', 'daily', 'weekly', 'monthly')),
        retention_days INTEGER DEFAULT 30,
        tables TEXT[] DEFAULT '{}',
        enabled BOOLEAN DEFAULT true,
        storage_location TEXT DEFAULT 'supabase',
        encryption_enabled BOOLEAN DEFAULT true,
        compression_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS backup_jobs (
        id TEXT PRIMARY KEY,
        config_id TEXT REFERENCES backup_configs(id),
        status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')),
        started_at TIMESTAMPTZ NOT NULL,
        completed_at TIMESTAMPTZ,
        file_size BIGINT,
        file_path TEXT,
        error_message TEXT,
        records_backed_up INTEGER DEFAULT 0,
        checksum TEXT,
        metadata JSONB DEFAULT '{}'
      )
      `,
      `
      CREATE INDEX IF NOT EXISTS idx_backup_jobs_config_id ON backup_jobs(config_id);
      CREATE INDEX IF NOT EXISTS idx_backup_jobs_status ON backup_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_backup_jobs_started_at ON backup_jobs(started_at);
      `
    ]
    
    for (const query of queries) {
      await this.supabase.rpc('execute_sql', { query })
    }
  }

  private static async shouldRunBackup(config: BackupConfig): Promise<boolean> {
    const { data: lastJob } = await this.supabase
      .from('backup_jobs')
      .select('started_at')
      .eq('config_id', config.id)
      .eq('status', 'completed')
      .order('started_at', { ascending: false })
      .limit(1)
      .single()
    
    if (!lastJob) return true
    
    const now = new Date()
    const lastBackup = new Date(lastJob.started_at)
    const hoursDiff = (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60)
    
    switch (config.frequency) {
      case 'hourly': return hoursDiff >= 4 // Cada 4 horas para incrementales
      case 'daily': return hoursDiff >= 24
      case 'weekly': return hoursDiff >= 168 // 7 días
      case 'monthly': return hoursDiff >= 720 // 30 días
      default: return false
    }
  }

  private static async collectBackupData(config: BackupConfig): Promise<{
    data: Record<string, any[]>
    totalRecords: number
  }> {
    const data: Record<string, any[]> = {}
    let totalRecords = 0
    
    const tables = config.tables.includes('*') ? 
      await this.getAllTableNames() : config.tables
    
    for (const table of tables) {
      const { data: tableData } = await this.supabase
        .from(table)
        .select('*')
      
      if (tableData) {
        data[table] = tableData
        totalRecords += tableData.length
      }
    }
    
    return { data, totalRecords }
  }

  private static async processBackupData(
    backupData: { data: Record<string, any[]>; totalRecords: number },
    config: BackupConfig
  ): Promise<Buffer> {
    let processed = JSON.stringify(backupData)
    
    if (config.compression_enabled) {
      // Implementar compresión (gzip, etc.)
      processed = this.compress(processed)
    }
    
    if (config.encryption_enabled) {
      // Implementar encriptación
      processed = await this.encrypt(processed)
    }
    
    return Buffer.from(processed)
  }

  private static generateJobId(): string {
    return `backup_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  private static async saveBackupJob(job: BackupJob): Promise<void> {
    await this.supabase
      .from('backup_jobs')
      .upsert(job)
  }

  private static async getBackupJob(jobId: string): Promise<BackupJob | null> {
    const { data } = await this.supabase
      .from('backup_jobs')
      .select('*')
      .eq('id', jobId)
      .single()
    
    return data
  }

  private static async saveBackupFile(data: Buffer, config: BackupConfig, jobId: string): Promise<string> {
    const fileName = `backup_${config.id}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}_${jobId}.bak`
    
    // Guardar en Supabase Storage
    const { data: uploadData, error } = await this.supabase.storage
      .from('backups')
      .upload(fileName, data)
    
    if (error) {
      throw new Error(`Error subiendo backup: ${error.message}`)
    }
    
    return fileName
  }

  private static async loadBackupFile(filePath: string): Promise<Buffer> {
    const { data, error } = await this.supabase.storage
      .from('backups')
      .download(filePath)
    
    if (error) {
      throw new Error(`Error descargando backup: ${error.message}`)
    }
    
    return Buffer.from(await data.arrayBuffer())
  }

  private static async calculateChecksum(data: Buffer): Promise<string> {
    // Implementar cálculo de checksum (MD5, SHA256, etc.)
    const crypto = require('crypto')
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  private static compress(data: string): string {
    // Implementar compresión
    return data // Placeholder
  }

  private static async encrypt(data: string): Promise<string> {
    // Implementar encriptación
    return data // Placeholder
  }

  private static async getAllTableNames(): Promise<string[]> {
    // Obtener nombres de todas las tablas
    return ['clientes', 'creditos', 'garantias', 'pagos', 'movimientos_caja', 'remates', 'notificaciones']
  }

  private static calculateRetentionCompliance(jobs: any[]): number {
    // Calcular compliance de retención
    return 100 // Placeholder
  }

  private static async checkFileExists(filePath: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.storage
        .from('backups')
        .list('', { search: filePath })
      
      return !error && data && data.length > 0
    } catch {
      return false
    }
  }

  private static async restoreBackupData(data: Buffer, targetTables?: string[]): Promise<{
    success: boolean
    records_restored: number
    errors: string[]
  }> {
    // Implementar lógica de restauración
    return {
      success: true,
      records_restored: 0,
      errors: []
    }
  }

  private static async getActiveBackupConfigs(): Promise<BackupConfig[]> {
    const { data } = await this.supabase
      .from('backup_configs')
      .select('*')
      .eq('enabled', true)
    
    return data || []
  }

  private static async upsertBackupConfig(config: BackupConfig): Promise<void> {
    await this.supabase
      .from('backup_configs')
      .upsert(config)
  }

  private static async cleanupOldBackups(): Promise<void> {
    // Implementar limpieza de backups antiguos
    console.log('Limpiando backups antiguos...')
  }

  private static async logBackupSuccess(configId: string, job: BackupJob): Promise<void> {
    await this.supabase
      .from('logs_seguridad')
      .insert({
        evento: 'backup_completed',
        descripcion: `Backup ${configId} completado exitosamente`,
        nivel: 'info',
        metadata: {
          job_id: job.id,
          records_backed_up: job.records_backed_up,
          file_size: job.file_size
        }
      })
  }

  private static async logBackupError(configId: string, error: any, operation: string = 'backup'): Promise<void> {
    await this.supabase
      .from('logs_seguridad')
      .insert({
        evento: `${operation}_error`,
        descripcion: `Error en ${operation} ${configId}: ${error.message}`,
        nivel: 'error',
        metadata: {
          config_id: configId,
          error: error.toString()
        }
      })
  }

  private static async logBackupRestore(jobId: string, result: any): Promise<void> {
    await this.supabase
      .from('logs_seguridad')
      .insert({
        evento: 'backup_restored',
        descripcion: `Backup ${jobId} restaurado`,
        nivel: 'warning',
        metadata: result
      })
  }
}
