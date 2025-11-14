import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/client'

export interface User2FA {
  id: string
  email: string
  two_factor_enabled: boolean
  two_factor_secret?: string
  backup_codes?: string[]
  role: 'admin' | 'gerente' | 'supervisor' | 'cajero'
  last_login?: Date
  failed_attempts?: number
  locked_until?: Date
}

export interface TwoFactorSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export class TwoFactorAuth {
  private static readonly APP_NAME = 'JUNTAY Casa de Empeño'
  
  /**
   * Genera un nuevo secreto 2FA para el usuario
   */
  static generateSecret(): string {
    return authenticator.generateSecret()
  }

  /**
   * Genera códigos de backup para emergencias
   */
  static generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase())
    }
    return codes
  }

  /**
   * Configura 2FA para un usuario
   */
  static async setupTwoFactor(userId: string, email: string): Promise<TwoFactorSetup> {
    const secret = this.generateSecret()
    const backupCodes = this.generateBackupCodes()
    
    // Generar URL para QR code
    const otpAuthUrl = authenticator.keyuri(email, this.APP_NAME, secret)
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl)

    // Guardar en base de datos (sin activar aún)
    const supabase = createClient()
    await supabase
      .from('usuarios_2fa')
      .upsert({
        user_id: userId,
        secret_temp: secret, // Temporal hasta confirmar
        backup_codes: backupCodes,
        setup_completed: false,
        created_at: new Date().toISOString()
      })

    return {
      secret,
      qrCodeUrl,
      backupCodes
    }
  }

  /**
   * Verifica un token 2FA
   */
  static verifyToken(secret: string, token: string): boolean {
    try {
      return authenticator.verify({ token, secret })
    } catch (error) {
      console.error('Error verificando token 2FA:', error)
      return false
    }
  }

  /**
   * Confirma la configuración 2FA con un token válido
   */
  static async confirmTwoFactor(userId: string, token: string): Promise<boolean> {
    const supabase = createClient()
    
    // Obtener configuración temporal
    const { data: setup } = await supabase
      .from('usuarios_2fa')
      .select('secret_temp, backup_codes')
      .eq('user_id', userId)
      .eq('setup_completed', false)
      .single()

    if (!setup?.secret_temp) {
      throw new Error('No hay configuración 2FA pendiente')
    }

    // Verificar token
    if (!this.verifyToken(setup.secret_temp, token)) {
      return false
    }

    // Activar 2FA
    await supabase
      .from('usuarios_2fa')
      .update({
        secret: setup.secret_temp,
        secret_temp: null,
        setup_completed: true,
        activated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    // Actualizar usuario principal
    await supabase.auth.updateUser({
      data: { two_factor_enabled: true }
    })

    return true
  }

  /**
   * Verifica 2FA durante el login
   */
  static async verifyLogin(userId: string, token: string): Promise<boolean> {
    const supabase = createClient()
    
    // Obtener configuración del usuario
    const { data: user2fa } = await supabase
      .from('usuarios_2fa')
      .select('secret, backup_codes, failed_attempts, locked_until')
      .eq('user_id', userId)
      .eq('setup_completed', true)
      .single()

    if (!user2fa) {
      throw new Error('Usuario no tiene 2FA configurado')
    }

    // Verificar si está bloqueado
    if (user2fa.locked_until && new Date(user2fa.locked_until) > new Date()) {
      throw new Error('Usuario bloqueado por intentos fallidos')
    }

    // Verificar token normal
    if (user2fa.secret && this.verifyToken(user2fa.secret, token)) {
      // Reset intentos fallidos
      await supabase
        .from('usuarios_2fa')
        .update({ 
          failed_attempts: 0, 
          locked_until: null,
          last_used: new Date().toISOString()
        })
        .eq('user_id', userId)
      
      return true
    }

    // Verificar código de backup
    if (user2fa.backup_codes && user2fa.backup_codes.includes(token)) {
      // Remover código usado
      const updatedCodes = user2fa.backup_codes.filter(code => code !== token)
      
      await supabase
        .from('usuarios_2fa')
        .update({ 
          backup_codes: updatedCodes,
          failed_attempts: 0,
          locked_until: null,
          last_used: new Date().toISOString()
        })
        .eq('user_id', userId)
      
      return true
    }

    // Incrementar intentos fallidos
    const failedAttempts = (user2fa.failed_attempts || 0) + 1
    const updates: any = { failed_attempts: failedAttempts }
    
    // Bloquear después de 5 intentos
    if (failedAttempts >= 5) {
      updates.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min
    }

    await supabase
      .from('usuarios_2fa')
      .update(updates)
      .eq('user_id', userId)

    return false
  }

  /**
   * Desactiva 2FA para un usuario
   */
  static async disableTwoFactor(userId: string): Promise<void> {
    const supabase = createClient()
    
    await supabase
      .from('usuarios_2fa')
      .delete()
      .eq('user_id', userId)

    await supabase.auth.updateUser({
      data: { two_factor_enabled: false }
    })
  }

  /**
   * Regenera códigos de backup
   */
  static async regenerateBackupCodes(userId: string): Promise<string[]> {
    const newCodes = this.generateBackupCodes()
    const supabase = createClient()
    
    await supabase
      .from('usuarios_2fa')
      .update({ backup_codes: newCodes })
      .eq('user_id', userId)
    
    return newCodes
  }

  /**
   * Verifica si un usuario requiere 2FA basado en su rol
   */
  static requiresTwoFactor(role: string): boolean {
    return ['admin', 'gerente', 'supervisor'].includes(role)
  }

  /**
   * Obtiene estadísticas de 2FA
   */
  static async getStats(): Promise<{
    total_users: number
    users_with_2fa: number
    percentage: number
    by_role: Record<string, { total: number; with_2fa: number }>
  }> {
    const supabase = createClient()
    
    const { data: allUsers } = await supabase
      .from('profiles')
      .select('role, two_factor_enabled')
    
    if (!allUsers) return { total_users: 0, users_with_2fa: 0, percentage: 0, by_role: {} }

    const total = allUsers.length
    const with2FA = allUsers.filter(u => u.two_factor_enabled).length
    
    const byRole: Record<string, { total: number; with_2fa: number }> = {}
    
    for (const user of allUsers) {
      if (!byRole[user.role]) {
        byRole[user.role] = { total: 0, with_2fa: 0 }
      }
      byRole[user.role].total++
      if (user.two_factor_enabled) {
        byRole[user.role].with_2fa++
      }
    }

    return {
      total_users: total,
      users_with_2fa: with2FA,
      percentage: total > 0 ? (with2FA / total) * 100 : 0,
      by_role: byRole
    }
  }
}

// Tipos para la base de datos
export interface Usuario2FA {
  id: string
  user_id: string
  secret?: string
  secret_temp?: string
  backup_codes?: string[]
  setup_completed: boolean
  failed_attempts: number
  locked_until?: string
  last_used?: string
  created_at: string
  activated_at?: string
}
