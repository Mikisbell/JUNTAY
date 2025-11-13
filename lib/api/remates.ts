import { createClient } from '@/lib/supabase/server'

export interface Remate {
  id?: string
  garantia_id: string
  credito_id: string
  numero_remate: string
  fecha_inicio_remate: string
  fecha_fin_remate?: string
  precio_base: number
  precio_venta?: number
  estado: 'programado' | 'en_proceso' | 'vendido' | 'no_vendido' | 'cancelado'
  comprador_nombre?: string
  comprador_documento?: string
  comprador_telefono?: string
  metodo_pago?: string
  observaciones?: string
  realizado_por?: string
  created_at?: string
  updated_at?: string

  // Relaciones
  garantia?: any
  credito?: any
  usuario?: any
}

export async function getRemates() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('remates')
    .select(`
      *, 
      garantias(codigo, nombre, valor_tasacion),
      creditos(codigo, monto_prestado),
      usuarios(nombres, apellidos)
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching remates:', error)
    return []
  }
  
  return data as Remate[]
}

export async function getRemateById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('remates')
    .select(`
      *, 
      garantias(*),
      creditos(*),
      usuarios(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching remate:', error)
    return null
  }
  
  return data as Remate
}

export async function crearRemate(remateData: Partial<Remate>) {
  const supabase = createClient()
  
  // Generar número de remate único
  const numeroRemate = `REM-${Date.now().toString().slice(-8)}`
  
  const { data, error } = await supabase
    .from('remates')
    .insert([{
      ...remateData,
      numero_remate: numeroRemate
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creando remate:', error)
    throw error
  }
  
  return data as Remate
}

export async function actualizarRemate(id: string, updates: Partial<Remate>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('remates')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error actualizando remate:', error)
    throw error
  }
  
  return data as Remate
}

export async function getRematesStats() {
  const supabase = createClient()
  
  const [total, programados, vendidos, noVendidos] = await Promise.all([
    supabase.from('remates').select('id', { count: 'exact', head: true }),
    supabase.from('remates').select('id', { count: 'exact', head: true }).eq('estado', 'programado'),
    supabase.from('remates').select('id', { count: 'exact', head: true }).eq('estado', 'vendido'),
    supabase.from('remates').select('id', { count: 'exact', head: true }).eq('estado', 'no_vendido')
  ])
  
  // Calcular ingresos por remates
  const { data: ventasData } = await supabase
    .from('remates')
    .select('precio_venta')
    .eq('estado', 'vendido')
  
  const totalIngresos = ventasData?.reduce((sum, r) => sum + (r.precio_venta || 0), 0) || 0
  
  return {
    total: total.count || 0,
    programados: programados.count || 0,
    vendidos: vendidos.count || 0,
    noVendidos: noVendidos.count || 0,
    totalIngresos
  }
}
