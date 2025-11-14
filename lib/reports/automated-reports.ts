import { createClient } from '@/lib/supabase/client'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'

export interface ReportConfig {
  id: string
  name: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  recipients: string[]
  format: 'pdf' | 'excel' | 'csv' | 'json'
  enabled: boolean
  last_generated?: Date
  next_scheduled?: Date
}

export interface ReportData {
  title: string
  period: string
  generated_at: Date
  data: Record<string, any>
  summary: Record<string, number>
  charts?: Array<{
    type: 'line' | 'bar' | 'pie' | 'area'
    title: string
    data: any[]
  }>
}

export class AutomatedReports {
  private static supabase = createClient()

  /**
   * Genera reporte diario de operaciones
   */
  static async generateDailyOperationsReport(date: Date = new Date()): Promise<ReportData> {
    const startDate = startOfDay(date)
    const endDate = endOfDay(date)
    
    // Obtener datos de operaciones del día
    const [
      movimientosCaja,
      prestamosOtorgados,
      pagosRecibidos,
      desempenos,
      ventasRemate
    ] = await Promise.all([
      this.getMovimientosCaja(startDate, endDate),
      this.getPrestamosOtorgados(startDate, endDate),
      this.getPagosRecibidos(startDate, endDate),
      this.getDesempenos(startDate, endDate),
      this.getVentasRemate(startDate, endDate)
    ])

    const summary = {
      total_operaciones: prestamosOtorgados.length + pagosRecibidos.length + desempenos.length + ventasRemate.length,
      prestamos_otorgados: prestamosOtorgados.length,
      monto_prestamos: prestamosOtorgados.reduce((sum, p) => sum + p.monto, 0),
      pagos_recibidos: pagosRecibidos.length,
      monto_pagos: pagosRecibidos.reduce((sum, p) => sum + p.monto, 0),
      desempenos: desempenos.length,
      monto_desempenos: desempenos.reduce((sum, d) => sum + d.monto, 0),
      ventas_remate: ventasRemate.length,
      monto_ventas: ventasRemate.reduce((sum, v) => sum + v.monto, 0),
      ingresos_totales: pagosRecibidos.reduce((sum, p) => sum + p.monto, 0) + 
                       desempenos.reduce((sum, d) => sum + d.monto, 0) + 
                       ventasRemate.reduce((sum, v) => sum + v.monto, 0),
      egresos_totales: prestamosOtorgados.reduce((sum, p) => sum + p.monto, 0)
    }

    return {
      title: 'Reporte Diario de Operaciones',
      period: format(date, 'dd/MM/yyyy', { locale: es }),
      generated_at: new Date(),
      data: {
        movimientos_caja: movimientosCaja,
        prestamos_otorgados: prestamosOtorgados,
        pagos_recibidos: pagosRecibidos,
        desempenos: desempenos,
        ventas_remate: ventasRemate
      },
      summary,
      charts: [
        {
          type: 'bar',
          title: 'Operaciones por Tipo',
          data: [
            { name: 'Préstamos', value: prestamosOtorgados.length },
            { name: 'Pagos', value: pagosRecibidos.length },
            { name: 'Desempeños', value: desempenos.length },
            { name: 'Ventas', value: ventasRemate.length }
          ]
        },
        {
          type: 'pie',
          title: 'Distribución de Ingresos',
          data: [
            { name: 'Intereses', value: pagosRecibidos.reduce((sum, p) => sum + p.monto, 0) },
            { name: 'Desempeños', value: desempenos.reduce((sum, d) => sum + d.monto, 0) },
            { name: 'Ventas', value: ventasRemate.reduce((sum, v) => sum + v.monto, 0) }
          ]
        }
      ]
    }
  }

  /**
   * Genera reporte semanal de cobranzas
   */
  static async generateWeeklyCollectionReport(date: Date = new Date()): Promise<ReportData> {
    const startDate = startOfWeek(date, { weekStartsOn: 1 }) // Lunes
    const endDate = endOfWeek(date, { weekStartsOn: 1 }) // Domingo

    // Obtener datos de cobranzas de la semana
    const [
      vencimientosProximos,
      pagosRecibidos,
      contratosMora,
      estadisticasCobranza
    ] = await Promise.all([
      this.getVencimientosProximos(startDate, endDate),
      this.getPagosRecibidos(startDate, endDate),
      this.getContratosMora(endDate),
      this.getEstadisticasCobranza(startDate, endDate)
    ])

    const summary = {
      vencimientos_semana: vencimientosProximos.length,
      monto_vencimientos: vencimientosProximos.reduce((sum, v) => sum + v.monto_adeudado, 0),
      pagos_recibidos: pagosRecibidos.length,
      monto_cobrado: pagosRecibidos.reduce((sum, p) => sum + p.monto, 0),
      contratos_mora: contratosMora.length,
      monto_mora: contratosMora.reduce((sum, c) => sum + c.monto_mora, 0),
      efectividad_cobranza: pagosRecibidos.length > 0 ? 
        (pagosRecibidos.length / (pagosRecibidos.length + contratosMora.length)) * 100 : 0
    }

    return {
      title: 'Reporte Semanal de Cobranzas',
      period: `${format(startDate, 'dd/MM/yyyy', { locale: es })} - ${format(endDate, 'dd/MM/yyyy', { locale: es })}`,
      generated_at: new Date(),
      data: {
        vencimientos_proximos: vencimientosProximos,
        pagos_recibidos: pagosRecibidos,
        contratos_mora: contratosMora,
        estadisticas: estadisticasCobranza
      },
      summary,
      charts: [
        {
          type: 'line',
          title: 'Evolución de Cobranzas (Semana)',
          data: estadisticasCobranza.daily_collections || []
        },
        {
          type: 'bar',
          title: 'Estado de Contratos',
          data: [
            { name: 'Al día', value: estadisticasCobranza.contratos_al_dia || 0 },
            { name: 'Próximos a vencer', value: vencimientosProximos.length },
            { name: 'En mora', value: contratosMora.length }
          ]
        }
      ]
    }
  }

  /**
   * Genera reporte mensual financiero
   */
  static async generateMonthlyFinancialReport(date: Date = new Date()): Promise<ReportData> {
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(date)

    // Obtener datos financieros del mes
    const [
      estadoResultados,
      balanceGeneral,
      flujoEfectivo,
      indicadoresRentabilidad
    ] = await Promise.all([
      this.getEstadoResultados(startDate, endDate),
      this.getBalanceGeneral(endDate),
      this.getFlujoEfectivo(startDate, endDate),
      this.getIndicadoresRentabilidad(startDate, endDate)
    ])

    const summary = {
      ingresos_totales: estadoResultados.ingresos_totales,
      gastos_totales: estadoResultados.gastos_totales,
      utilidad_neta: estadoResultados.utilidad_neta,
      roi_mensual: indicadoresRentabilidad.roi_mensual,
      margen_utilidad: indicadoresRentabilidad.margen_utilidad,
      cartera_activa: balanceGeneral.cartera_activa,
      efectivo_disponible: balanceGeneral.efectivo_disponible,
      total_activos: balanceGeneral.total_activos
    }

    return {
      title: 'Reporte Mensual Financiero',
      period: format(date, 'MMMM yyyy', { locale: es }),
      generated_at: new Date(),
      data: {
        estado_resultados: estadoResultados,
        balance_general: balanceGeneral,
        flujo_efectivo: flujoEfectivo,
        indicadores: indicadoresRentabilidad
      },
      summary,
      charts: [
        {
          type: 'area',
          title: 'Flujo de Efectivo Mensual',
          data: flujoEfectivo.daily_flow || []
        },
        {
          type: 'pie',
          title: 'Composición de Ingresos',
          data: [
            { name: 'Intereses', value: estadoResultados.ingresos_intereses },
            { name: 'Comisiones', value: estadoResultados.ingresos_comisiones },
            { name: 'Ventas Remate', value: estadoResultados.ingresos_ventas }
          ]
        }
      ]
    }
  }

  /**
   * Programa la generación automática de reportes
   */
  static async scheduleReports(): Promise<void> {
    const configs = await this.getReportConfigs()
    
    for (const config of configs) {
      if (!config.enabled) continue
      
      const shouldGenerate = await this.shouldGenerateReport(config)
      
      if (shouldGenerate) {
        try {
          let report: ReportData
          
          switch (config.id) {
            case 'daily_operations':
              report = await this.generateDailyOperationsReport()
              break
            case 'weekly_collections':
              report = await this.generateWeeklyCollectionReport()
              break
            case 'monthly_financial':
              report = await this.generateMonthlyFinancialReport()
              break
            default:
              continue
          }
          
          await this.saveReport(config.id, report)
          await this.sendReport(config, report)
          await this.updateReportConfig(config.id, { last_generated: new Date() })
          
        } catch (error) {
          console.error(`Error generando reporte ${config.id}:`, error)
          await this.logReportError(config.id, error)
        }
      }
    }
  }

  /**
   * Obtiene configuraciones de reportes
   */
  private static async getReportConfigs(): Promise<ReportConfig[]> {
    const { data, error } = await this.supabase
      .from('report_configs')
      .select('*')
      .eq('enabled', true)

    if (error) {
      console.error('Error obteniendo configuraciones de reportes:', error)
      return []
    }

    return data || []
  }

  /**
   * Determina si debe generar un reporte basado en su frecuencia
   */
  private static async shouldGenerateReport(config: ReportConfig): Promise<boolean> {
    if (!config.last_generated) return true
    
    const now = new Date()
    const lastGenerated = new Date(config.last_generated)
    
    switch (config.frequency) {
      case 'daily':
        return format(now, 'yyyy-MM-dd') !== format(lastGenerated, 'yyyy-MM-dd')
      case 'weekly':
        const weeksDiff = Math.floor((now.getTime() - lastGenerated.getTime()) / (7 * 24 * 60 * 60 * 1000))
        return weeksDiff >= 1
      case 'monthly':
        return format(now, 'yyyy-MM') !== format(lastGenerated, 'yyyy-MM')
      default:
        return false
    }
  }

  /**
   * Guarda el reporte generado
   */
  private static async saveReport(configId: string, report: ReportData): Promise<void> {
    const { error } = await this.supabase
      .from('generated_reports')
      .insert({
        config_id: configId,
        title: report.title,
        period: report.period,
        data: report.data,
        summary: report.summary,
        charts: report.charts,
        generated_at: report.generated_at
      })

    if (error) {
      throw new Error(`Error guardando reporte: ${error.message}`)
    }
  }

  /**
   * Envía el reporte a los destinatarios configurados
   */
  private static async sendReport(config: ReportConfig, report: ReportData): Promise<void> {
    // Aquí implementarías el envío por email, WhatsApp, etc.
    // Por ahora solo registramos el evento
    console.log(`Enviando reporte ${config.name} a:`, config.recipients)
    
    // Registrar evento de envío
    await this.supabase
      .from('logs_seguridad')
      .insert({
        evento: 'report_sent',
        descripcion: `Reporte ${config.name} enviado automáticamente`,
        nivel: 'info',
        metadata: {
          report_id: config.id,
          recipients: config.recipients,
          period: report.period
        }
      })
  }

  // Métodos auxiliares para obtener datos específicos
  private static async getMovimientosCaja(startDate: Date, endDate: Date) {
    const { data } = await this.supabase
      .from('movimientos_caja')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
    
    return data || []
  }

  private static async getPrestamosOtorgados(startDate: Date, endDate: Date) {
    const { data } = await this.supabase
      .from('creditos')
      .select('*')
      .eq('estado', 'activo')
      .gte('fecha_desembolso', startDate.toISOString())
      .lte('fecha_desembolso', endDate.toISOString())
    
    return data || []
  }

  private static async getPagosRecibidos(startDate: Date, endDate: Date) {
    const { data } = await this.supabase
      .from('pagos')
      .select('*')
      .gte('fecha_pago', startDate.toISOString())
      .lte('fecha_pago', endDate.toISOString())
    
    return data || []
  }

  private static async getDesempenos(startDate: Date, endDate: Date) {
    const { data } = await this.supabase
      .from('creditos')
      .select('*')
      .eq('estado', 'liquidado')
      .gte('fecha_liquidacion', startDate.toISOString())
      .lte('fecha_liquidacion', endDate.toISOString())
    
    return data || []
  }

  private static async getVentasRemate(startDate: Date, endDate: Date) {
    const { data } = await this.supabase
      .from('remates')
      .select('*')
      .eq('estado', 'vendido')
      .gte('fecha_venta', startDate.toISOString())
      .lte('fecha_venta', endDate.toISOString())
    
    return data || []
  }

  private static async getVencimientosProximos(startDate: Date, endDate: Date) {
    const { data } = await this.supabase
      .from('creditos')
      .select('*, clientes(*)')
      .eq('estado', 'activo')
      .gte('fecha_vencimiento', startDate.toISOString())
      .lte('fecha_vencimiento', endDate.toISOString())
    
    return data || []
  }

  private static async getContratosMora(date: Date) {
    const { data } = await this.supabase
      .from('creditos')
      .select('*, clientes(*)')
      .eq('estado', 'activo')
      .lt('fecha_vencimiento', date.toISOString())
    
    return data || []
  }

  private static async getEstadisticasCobranza(startDate: Date, endDate: Date) {
    // Implementar lógica para estadísticas de cobranza
    return {
      contratos_al_dia: 0,
      daily_collections: []
    }
  }

  private static async getEstadoResultados(startDate: Date, endDate: Date) {
    // Implementar cálculo de estado de resultados
    return {
      ingresos_totales: 0,
      ingresos_intereses: 0,
      ingresos_comisiones: 0,
      ingresos_ventas: 0,
      gastos_totales: 0,
      utilidad_neta: 0
    }
  }

  private static async getBalanceGeneral(date: Date) {
    // Implementar cálculo de balance general
    return {
      cartera_activa: 0,
      efectivo_disponible: 0,
      total_activos: 0
    }
  }

  private static async getFlujoEfectivo(startDate: Date, endDate: Date) {
    // Implementar cálculo de flujo de efectivo
    return {
      daily_flow: []
    }
  }

  private static async getIndicadoresRentabilidad(startDate: Date, endDate: Date) {
    // Implementar cálculo de indicadores
    return {
      roi_mensual: 0,
      margen_utilidad: 0
    }
  }

  private static async updateReportConfig(configId: string, updates: Partial<ReportConfig>) {
    await this.supabase
      .from('report_configs')
      .update(updates)
      .eq('id', configId)
  }

  private static async logReportError(configId: string, error: any) {
    await this.supabase
      .from('logs_seguridad')
      .insert({
        evento: 'report_error',
        descripcion: `Error generando reporte ${configId}: ${error.message}`,
        nivel: 'error',
        metadata: { config_id: configId, error: error.toString() }
      })
  }
}
