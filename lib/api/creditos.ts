import { createClient } from '@/lib/supabase/server'

export interface Credito {
  id?: string
  codigo?: string
  cliente_id: string
  monto_prestado: number
  monto_interes: number
  monto_total: number
  monto_pagado?: number
  monto_mora?: number
  saldo_pendiente: number
  numero_cuotas: number
  cuotas_pagadas?: number
  frecuencia_pago: 'diario' | 'semanal' | 'quincenal' | 'mensual'
  monto_cuota: number
  tasa_interes_mensual: number
  tasa_mora_diaria: number
  fecha_desembolso: string
  fecha_primer_vencimiento: string
  fecha_ultimo_vencimiento: string
  fecha_ultimo_pago?: string
  estado: 'vigente' | 'vencido' | 'en_mora' | 'pagado' | 'refinanciado' | 'castigado'
  dias_mora?: number
  observaciones?: string
  created_at?: string
  updated_at?: string
  
  // Relaciones
  cliente?: any
  garantias?: any[]
  cronograma?: CuotaCredito[]
}

export interface CuotaCredito {
  id?: string
  credito_id?: string
  numero_cuota: number
  monto_capital: number
  monto_interes: number
  monto_total: number
  monto_pagado?: number
  monto_mora?: number
  fecha_vencimiento: string
  fecha_pago?: string
  estado: 'pendiente' | 'pagado' | 'vencido' | 'parcial'
  dias_atraso?: number
}

export async function getCreditos() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('creditos')
    .select('*, clientes(numero_documento, nombres, apellido_paterno, razon_social)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching creditos:', error)
    return []
  }
  
  return data as Credito[]
}

export async function getCreditoById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('creditos')
    .select('*, clientes(*), garantias(*), cronograma_pagos(*)')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching credito:', error)
    return null
  }
  
  return data as Credito
}

export async function getCreditosStats() {
  const supabase = createClient()
  
  const [total, vigentes, enMora, pagados] = await Promise.all([
    supabase.from('creditos').select('id', { count: 'exact', head: true }),
    supabase.from('creditos').select('id', { count: 'exact', head: true }).eq('estado', 'vigente'),
    supabase.from('creditos').select('id', { count: 'exact', head: true }).eq('estado', 'en_mora'),
    supabase.from('creditos').select('id', { count: 'exact', head: true }).eq('estado', 'pagado')
  ])
  
  // Sumar monto total de cartera activa
  const { data: carteraData } = await supabase
    .from('creditos')
    .select('saldo_pendiente')
    .in('estado', ['vigente', 'en_mora', 'vencido'])
  
  const montoCartera = carteraData?.reduce((sum, c) => sum + parseFloat(c.saldo_pendiente.toString()), 0) || 0
  
  return {
    total: total.count || 0,
    vigentes: vigentes.count || 0,
    enMora: enMora.count || 0,
    pagados: pagados.count || 0,
    montoCartera: montoCartera
  }
}

// Función para calcular cronograma de pagos
export function calcularCronograma(
  montoPrestado: number,
  tasaMensual: number,
  numeroCuotas: number,
  frecuenciaPago: 'diario' | 'semanal' | 'quincenal' | 'mensual',
  fechaDesembolso: Date
): CuotaCredito[] {
  const cronograma: CuotaCredito[] = []
  
  // Calcular tasa por período
  let tasaPeriodo = tasaMensual / 100
  if (frecuenciaPago === 'quincenal') tasaPeriodo = tasaPeriodo / 2
  if (frecuenciaPago === 'semanal') tasaPeriodo = tasaPeriodo / 4
  if (frecuenciaPago === 'diario') tasaPeriodo = tasaPeriodo / 30
  
  // Calcular monto de cuota (método francés)
  const montoCuota = (montoPrestado * tasaPeriodo * Math.pow(1 + tasaPeriodo, numeroCuotas)) / 
                     (Math.pow(1 + tasaPeriodo, numeroCuotas) - 1)
  
  let saldoCapital = montoPrestado
  let fechaActual = new Date(fechaDesembolso)
  
  // Días entre cuotas según frecuencia
  const diasEntreCuotas = {
    diario: 1,
    semanal: 7,
    quincenal: 15,
    mensual: 30
  }
  
  for (let i = 1; i <= numeroCuotas; i++) {
    // Calcular fecha de vencimiento
    fechaActual = new Date(fechaActual)
    fechaActual.setDate(fechaActual.getDate() + diasEntreCuotas[frecuenciaPago])
    
    // Calcular interés y capital
    const montoInteres = saldoCapital * tasaPeriodo
    const montoCapital = montoCuota - montoInteres
    
    cronograma.push({
      numero_cuota: i,
      monto_capital: parseFloat(montoCapital.toFixed(2)),
      monto_interes: parseFloat(montoInteres.toFixed(2)),
      monto_total: parseFloat(montoCuota.toFixed(2)),
      monto_pagado: 0,
      fecha_vencimiento: fechaActual.toISOString().split('T')[0],
      estado: 'pendiente'
    })
    
    saldoCapital -= montoCapital
  }
  
  return cronograma
}
