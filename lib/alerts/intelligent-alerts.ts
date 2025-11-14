import { createClient } from '@/lib/supabase/client'

export interface AlertRule {
  id: string
  name: string
  description: string
  type: 'threshold' | 'pattern' | 'anomaly' | 'schedule'
  category: 'security' | 'financial' | 'operational' | 'compliance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  conditions: AlertCondition[]
  actions: AlertAction[]
  cooldown_minutes: number
  created_at: Date
  last_triggered?: Date
}

export interface AlertCondition {
  field: string
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'contains' | 'between' | 'pattern'
  value: any
  timeframe?: string // '1h', '24h', '7d', etc.
}

export interface AlertAction {
  type: 'email' | 'sms' | 'whatsapp' | 'push' | 'webhook' | 'log'
  target: string
  template?: string
  priority: number
}

export interface Alert {
  id: string
  rule_id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  status: 'active' | 'acknowledged' | 'resolved'
  triggered_at: Date
  acknowledged_at?: Date
  resolved_at?: Date
  data: Record<string, any>
  actions_taken: string[]
}

export class IntelligentAlerts {
  private static supabase = createClient()

  /**
   * Reglas de alertas predefinidas para casa de empeño
   */
  private static readonly DEFAULT_RULES: Omit<AlertRule, 'id' | 'created_at'>[] = [
    {
      name: 'Saldo Bajo en Caja General',
      description: 'Alerta cuando el saldo disponible en caja general es menor al 20%',
      type: 'threshold',
      category: 'financial',
      severity: 'high',
      enabled: true,
      conditions: [
        {
          field: 'caja_general.saldo_disponible_percentage',
          operator: 'lt',
          value: 20
        }
      ],
      actions: [
        {
          type: 'whatsapp',
          target: 'gerente',
          template: 'saldo_bajo_caja',
          priority: 1
        },
        {
          type: 'email',
          target: 'admin',
          template: 'saldo_bajo_caja',
          priority: 2
        }
      ],
      cooldown_minutes: 60
    },
    {
      name: 'Vencimientos Próximos',
      description: 'Alerta de contratos que vencen en los próximos 3 días',
      type: 'schedule',
      category: 'operational',
      severity: 'medium',
      enabled: true,
      conditions: [
        {
          field: 'creditos.fecha_vencimiento',
          operator: 'between',
          value: ['now', '3d'],
          timeframe: '24h'
        }
      ],
      actions: [
        {
          type: 'whatsapp',
          target: 'cajero',
          template: 'vencimientos_proximos',
          priority: 1
        }
      ],
      cooldown_minutes: 1440 // 24 horas
    },
    {
      name: 'Transacción Inusual',
      description: 'Detecta transacciones por montos superiores al promedio diario',
      type: 'anomaly',
      category: 'security',
      severity: 'medium',
      enabled: true,
      conditions: [
        {
          field: 'creditos.monto',
          operator: 'gt',
          value: 'avg_daily_amount * 3',
          timeframe: '1h'
        }
      ],
      actions: [
        {
          type: 'log',
          target: 'security',
          priority: 1
        },
        {
          type: 'whatsapp',
          target: 'supervisor',
          template: 'transaccion_inusual',
          priority: 2
        }
      ],
      cooldown_minutes: 30
    },
    {
      name: 'Intentos de Acceso Fallidos',
      description: 'Múltiples intentos de login fallidos desde la misma IP',
      type: 'pattern',
      category: 'security',
      severity: 'high',
      enabled: true,
      conditions: [
        {
          field: 'logs_seguridad.evento',
          operator: 'eq',
          value: 'login_failed',
          timeframe: '15m'
        },
        {
          field: 'count',
          operator: 'gt',
          value: 5
        }
      ],
      actions: [
        {
          type: 'email',
          target: 'admin',
          template: 'intentos_acceso_fallidos',
          priority: 1
        },
        {
          type: 'log',
          target: 'security',
          priority: 1
        }
      ],
      cooldown_minutes: 60
    },
    {
      name: 'Backup Fallido',
      description: 'Alerta cuando falla un backup programado',
      type: 'pattern',
      category: 'compliance',
      severity: 'critical',
      enabled: true,
      conditions: [
        {
          field: 'backup_jobs.status',
          operator: 'eq',
          value: 'failed'
        }
      ],
      actions: [
        {
          type: 'email',
          target: 'admin',
          template: 'backup_fallido',
          priority: 1
        },
        {
          type: 'sms',
          target: 'admin',
          template: 'backup_fallido_sms',
          priority: 1
        }
      ],
      cooldown_minutes: 30
    },
    {
      name: 'Contratos en Mora Crítica',
      description: 'Contratos con más de 30 días de mora',
      type: 'threshold',
      category: 'financial',
      severity: 'high',
      enabled: true,
      conditions: [
        {
          field: 'creditos.dias_mora',
          operator: 'gt',
          value: 30
        }
      ],
      actions: [
        {
          type: 'whatsapp',
          target: 'gerente',
          template: 'mora_critica',
          priority: 1
        },
        {
          type: 'email',
          target: 'cobranzas',
          template: 'mora_critica',
          priority: 2
        }
      ],
      cooldown_minutes: 720 // 12 horas
    }
  ]

  /**
   * Inicializa el sistema de alertas
   */
  static async initializeAlertSystem(): Promise<void> {
    await this.createAlertTables()
    
    for (const rule of this.DEFAULT_RULES) {
      await this.upsertAlertRule({
        ...rule,
        id: this.generateRuleId(rule.name),
        created_at: new Date()
      })
    }
    
    console.log('✅ Sistema de alertas inteligentes inicializado')
  }

  /**
   * Ejecuta el motor de alertas
   */
  static async runAlertEngine(): Promise<Alert[]> {
    const rules = await this.getActiveAlertRules()
    const triggeredAlerts: Alert[] = []
    
    for (const rule of rules) {
      try {
        const shouldTrigger = await this.evaluateRule(rule)
        
        if (shouldTrigger.triggered) {
          const alert = await this.createAlert(rule, shouldTrigger.data)
          await this.executeAlertActions(rule, alert)
          triggeredAlerts.push(alert)
        }
      } catch (error) {
        console.error(`Error evaluando regla ${rule.id}:`, error)
        await this.logAlertError(rule.id, error)
      }
    }
    
    return triggeredAlerts
  }

  /**
   * Evalúa una regla específica
   */
  static async evaluateRule(rule: AlertRule): Promise<{
    triggered: boolean
    data: Record<string, any>
  }> {
    // Verificar cooldown
    if (rule.last_triggered) {
      const cooldownEnd = new Date(rule.last_triggered.getTime() + rule.cooldown_minutes * 60 * 1000)
      if (new Date() < cooldownEnd) {
        return { triggered: false, data: {} }
      }
    }

    switch (rule.type) {
      case 'threshold':
        return await this.evaluateThresholdRule(rule)
      case 'pattern':
        return await this.evaluatePatternRule(rule)
      case 'anomaly':
        return await this.evaluateAnomalyRule(rule)
      case 'schedule':
        return await this.evaluateScheduleRule(rule)
      default:
        return { triggered: false, data: {} }
    }
  }

  /**
   * Evalúa reglas de umbral
   */
  private static async evaluateThresholdRule(rule: AlertRule): Promise<{
    triggered: boolean
    data: Record<string, any>
  }> {
    for (const condition of rule.conditions) {
      const currentValue = await this.getCurrentValue(condition.field)
      const triggered = this.compareValues(currentValue, condition.operator, condition.value)
      
      if (triggered) {
        return {
          triggered: true,
          data: {
            field: condition.field,
            current_value: currentValue,
            threshold_value: condition.value,
            operator: condition.operator
          }
        }
      }
    }
    
    return { triggered: false, data: {} }
  }

  /**
   * Evalúa reglas de patrón
   */
  private static async evaluatePatternRule(rule: AlertRule): Promise<{
    triggered: boolean
    data: Record<string, any>
  }> {
    // Implementar lógica de detección de patrones
    const patternData = await this.analyzePattern(rule.conditions)
    
    return {
      triggered: patternData.matches_pattern,
      data: patternData
    }
  }

  /**
   * Evalúa reglas de anomalía
   */
  private static async evaluateAnomalyRule(rule: AlertRule): Promise<{
    triggered: boolean
    data: Record<string, any>
  }> {
    // Implementar detección de anomalías usando estadísticas
    const anomalyData = await this.detectAnomaly(rule.conditions)
    
    return {
      triggered: anomalyData.is_anomaly,
      data: anomalyData
    }
  }

  /**
   * Evalúa reglas programadas
   */
  private static async evaluateScheduleRule(rule: AlertRule): Promise<{
    triggered: boolean
    data: Record<string, any>
  }> {
    // Implementar evaluación de reglas basadas en tiempo
    const scheduleData = await this.checkScheduleConditions(rule.conditions)
    
    return {
      triggered: scheduleData.should_trigger,
      data: scheduleData
    }
  }

  /**
   * Crea una nueva alerta
   */
  private static async createAlert(rule: AlertRule, data: Record<string, any>): Promise<Alert> {
    const alert: Alert = {
      id: this.generateAlertId(),
      rule_id: rule.id,
      title: rule.name,
      message: this.generateAlertMessage(rule, data),
      severity: rule.severity,
      category: rule.category,
      status: 'active',
      triggered_at: new Date(),
      data,
      actions_taken: []
    }
    
    await this.saveAlert(alert)
    
    // Actualizar última activación de la regla
    await this.updateRuleLastTriggered(rule.id, new Date())
    
    return alert
  }

  /**
   * Ejecuta las acciones de una alerta
   */
  private static async executeAlertActions(rule: AlertRule, alert: Alert): Promise<void> {
    const sortedActions = rule.actions.sort((a, b) => a.priority - b.priority)
    
    for (const action of sortedActions) {
      try {
        await this.executeAction(action, alert)
        alert.actions_taken.push(`${action.type}:${action.target}`)
      } catch (error) {
        console.error(`Error ejecutando acción ${action.type}:`, error)
        await this.logActionError(alert.id, action, error)
      }
    }
    
    await this.saveAlert(alert)
  }

  /**
   * Ejecuta una acción específica
   */
  private static async executeAction(action: AlertAction, alert: Alert): Promise<void> {
    switch (action.type) {
      case 'whatsapp':
        await this.sendWhatsAppAlert(action.target, alert, action.template)
        break
      case 'email':
        await this.sendEmailAlert(action.target, alert, action.template)
        break
      case 'sms':
        await this.sendSMSAlert(action.target, alert, action.template)
        break
      case 'push':
        await this.sendPushNotification(action.target, alert)
        break
      case 'webhook':
        await this.callWebhook(action.target, alert)
        break
      case 'log':
        await this.logAlert(action.target, alert)
        break
    }
  }

  /**
   * Obtiene el valor actual de un campo
   */
  private static async getCurrentValue(field: string): Promise<any> {
    const [table, column] = field.split('.')
    
    switch (field) {
      case 'caja_general.saldo_disponible_percentage':
        return await this.getCajaGeneralPercentage()
      case 'creditos.dias_mora':
        return await this.getContractsInMora()
      default:
        // Implementar obtención genérica de valores
        return 0
    }
  }

  /**
   * Compara valores según el operador
   */
  private static compareValues(current: any, operator: string, threshold: any): boolean {
    switch (operator) {
      case 'gt': return current > threshold
      case 'lt': return current < threshold
      case 'eq': return current === threshold
      case 'ne': return current !== threshold
      case 'contains': return String(current).includes(String(threshold))
      case 'between':
        return Array.isArray(threshold) && current >= threshold[0] && current <= threshold[1]
      default: return false
    }
  }

  /**
   * Genera mensaje de alerta personalizado
   */
  private static generateAlertMessage(rule: AlertRule, data: Record<string, any>): string {
    let message = rule.description
    
    // Personalizar mensaje según los datos
    if (data.current_value !== undefined) {
      message += ` Valor actual: ${data.current_value}`
    }
    
    if (data.threshold_value !== undefined) {
      message += ` Umbral: ${data.threshold_value}`
    }
    
    return message
  }

  // Métodos de comunicación
  private static async sendWhatsAppAlert(target: string, alert: Alert, template?: string): Promise<void> {
    // Implementar envío por WhatsApp
    console.log(`Enviando alerta WhatsApp a ${target}:`, alert.title)
  }

  private static async sendEmailAlert(target: string, alert: Alert, template?: string): Promise<void> {
    // Implementar envío por email
    console.log(`Enviando alerta email a ${target}:`, alert.title)
  }

  private static async sendSMSAlert(target: string, alert: Alert, template?: string): Promise<void> {
    // Implementar envío por SMS
    console.log(`Enviando alerta SMS a ${target}:`, alert.title)
  }

  private static async sendPushNotification(target: string, alert: Alert): Promise<void> {
    // Implementar push notification
    console.log(`Enviando push notification a ${target}:`, alert.title)
  }

  private static async callWebhook(url: string, alert: Alert): Promise<void> {
    // Implementar llamada a webhook
    console.log(`Llamando webhook ${url} para alerta:`, alert.title)
  }

  private static async logAlert(target: string, alert: Alert): Promise<void> {
    await this.supabase
      .from('logs_seguridad')
      .insert({
        evento: 'alert_triggered',
        descripcion: `Alerta activada: ${alert.title}`,
        nivel: alert.severity === 'critical' ? 'critical' : 
               alert.severity === 'high' ? 'error' : 'warning',
        metadata: {
          alert_id: alert.id,
          rule_id: alert.rule_id,
          category: alert.category,
          data: alert.data
        }
      })
  }

  // Métodos auxiliares
  private static async getCajaGeneralPercentage(): Promise<number> {
    const { data } = await this.supabase
      .from('caja_general')
      .select('saldo_total, saldo_disponible')
      .single()
    
    if (!data || data.saldo_total === 0) return 0
    return (data.saldo_disponible / data.saldo_total) * 100
  }

  private static async getContractsInMora(): Promise<number> {
    const { data } = await this.supabase
      .from('creditos')
      .select('id')
      .eq('estado', 'activo')
      .lt('fecha_vencimiento', new Date().toISOString())
    
    return data?.length || 0
  }

  private static async analyzePattern(conditions: AlertCondition[]): Promise<any> {
    // Implementar análisis de patrones
    return { matches_pattern: false }
  }

  private static async detectAnomaly(conditions: AlertCondition[]): Promise<any> {
    // Implementar detección de anomalías
    return { is_anomaly: false }
  }

  private static async checkScheduleConditions(conditions: AlertCondition[]): Promise<any> {
    // Implementar verificación de condiciones programadas
    return { should_trigger: false }
  }

  private static generateRuleId(name: string): string {
    return `rule_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
  }

  private static generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  private static async createAlertTables(): Promise<void> {
    // Crear tablas necesarias para alertas
    const queries = [
      `
      CREATE TABLE IF NOT EXISTS alert_rules (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT CHECK (type IN ('threshold', 'pattern', 'anomaly', 'schedule')),
        category TEXT CHECK (category IN ('security', 'financial', 'operational', 'compliance')),
        severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        enabled BOOLEAN DEFAULT true,
        conditions JSONB NOT NULL,
        actions JSONB NOT NULL,
        cooldown_minutes INTEGER DEFAULT 60,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_triggered TIMESTAMPTZ
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        rule_id TEXT REFERENCES alert_rules(id),
        title TEXT NOT NULL,
        message TEXT,
        severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        category TEXT,
        status TEXT CHECK (status IN ('active', 'acknowledged', 'resolved')) DEFAULT 'active',
        triggered_at TIMESTAMPTZ DEFAULT NOW(),
        acknowledged_at TIMESTAMPTZ,
        resolved_at TIMESTAMPTZ,
        data JSONB DEFAULT '{}',
        actions_taken TEXT[] DEFAULT '{}'
      )
      `
    ]
    
    for (const query of queries) {
      await this.supabase.rpc('execute_sql', { query })
    }
  }

  private static async getActiveAlertRules(): Promise<AlertRule[]> {
    const { data } = await this.supabase
      .from('alert_rules')
      .select('*')
      .eq('enabled', true)
    
    return data || []
  }

  private static async upsertAlertRule(rule: AlertRule): Promise<void> {
    await this.supabase
      .from('alert_rules')
      .upsert(rule)
  }

  private static async saveAlert(alert: Alert): Promise<void> {
    await this.supabase
      .from('alerts')
      .upsert(alert)
  }

  private static async updateRuleLastTriggered(ruleId: string, date: Date): Promise<void> {
    await this.supabase
      .from('alert_rules')
      .update({ last_triggered: date.toISOString() })
      .eq('id', ruleId)
  }

  private static async logAlertError(ruleId: string, error: any): Promise<void> {
    await this.supabase
      .from('logs_seguridad')
      .insert({
        evento: 'alert_error',
        descripcion: `Error evaluando regla ${ruleId}: ${error.message}`,
        nivel: 'error',
        metadata: { rule_id: ruleId, error: error.toString() }
      })
  }

  private static async logActionError(alertId: string, action: AlertAction, error: any): Promise<void> {
    await this.supabase
      .from('logs_seguridad')
      .insert({
        evento: 'alert_action_error',
        descripcion: `Error ejecutando acción ${action.type} para alerta ${alertId}`,
        nivel: 'error',
        metadata: { alert_id: alertId, action, error: error.toString() }
      })
  }
}
