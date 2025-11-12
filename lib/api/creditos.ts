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
  clientes?: {
    numero_documento?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    razon_social?: string
    tipo_persona?: string
    telefono_principal?: string
    telefono_secundario?: string
    email?: string
  }
  cliente?: any // Mantener por compatibilidad
  garantias?: any[]
  cronograma_pagos?: CuotaCredito[]
  cronograma?: CuotaCredito[] // Alias
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
    .select('*, clientes(numero_documento, nombres, apellido_paterno, razon_social, tipo_persona)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching creditos:', error)
    return []
  }
  
  return data as Credito[]
}

export async function getCreditoById(id: string) {
  const supabase = createClient()
  
  // Obtener el crédito con sus relaciones
  const { data: credito, error: creditoError } = await supabase
    .from('creditos')
    .select('*, clientes(*), cronograma_pagos(*)')
    .eq('id', id)
    .single()
  
  if (creditoError) {
    console.error('Error fetching credito:', creditoError)
    return null
  }
  
  // Obtener garantías asociadas al crédito (relación inversa)
  const { data: garantias, error: garantiasError } = await supabase
    .from('garantias')
    .select('*')
    .eq('credito_id', id)
  
  if (garantiasError) {
    console.error('Error fetching garantias:', garantiasError)
  }
  
  // Combinar los datos
  return {
    ...credito,
    garantias: garantias || []
  } as Credito
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

// Re-exportar función de cálculo desde utils (para compatibilidad)
export { calcularCronograma } from '@/lib/utils/calculos'
