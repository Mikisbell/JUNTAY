import { createClient } from '@/lib/supabase/server'

export interface Garantia {
  id?: string
  codigo?: string
  numero_boleta?: string
  credito_id?: string
  categoria_id?: string
  nombre: string
  descripcion: string
  marca?: string
  modelo?: string
  numero_serie?: string
  valor_comercial: number
  valor_tasacion: number
  valor_prestamo_maximo?: number
  porcentaje_prestamo?: number
  estado: 'disponible' | 'en_prenda' | 'liberado' | 'vendido' | 'perdido' | 'evaluacion'
  estado_conservacion?: 'nuevo' | 'muy_bueno' | 'bueno' | 'regular' | 'malo'
  fecha_registro?: string
  fecha_recuperacion?: string
  fecha_venta?: string
  fecha_vencimiento_legal?: string
  fecha_tasacion?: string
  periodo_gracia_dias?: number
  ubicacion_fisica?: string
  ubicacion_estante?: string
  peso?: number
  dimensiones?: string
  material?: string
  color?: string
  requiere_evaluacion_especial?: boolean
  notas_tasador?: string
  observaciones?: string
  tasado_por?: string
  created_at?: string
  updated_at?: string
  
  // Relaciones
  categoria?: CategoriaGarantia
  credito?: any
}

export interface CategoriaGarantia {
  id?: string
  nombre: string
  descripcion?: string
  porcentaje_prestamo?: number
  activo?: boolean
}

export async function getGarantias() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('garantias')
    .select('*, categorias_garantia(*)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching garantias:', error)
    return []
  }
  
  return data as Garantia[]
}

export async function getGarantiaById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('garantias')
    .select('*, categorias_garantia(*), creditos(*)')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching garantia:', error)
    return null
  }
  
  return data as Garantia
}

export async function getCategorias() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('categorias_garantia')
    .select('*')
    .eq('activo', true)
    .order('nombre')
  
  if (error) {
    console.error('Error fetching categorias:', error)
    return []
  }
  
  return data as CategoriaGarantia[]
}

export async function getGarantiasStats() {
  const supabase = createClient()
  
  const [total, enGarantia, recuperadas, vendidas] = await Promise.all([
    supabase.from('garantias').select('id', { count: 'exact', head: true }),
    supabase.from('garantias').select('id', { count: 'exact', head: true }).eq('estado', 'en_prenda'),
    supabase.from('garantias').select('id', { count: 'exact', head: true }).eq('estado', 'liberado'),
    supabase.from('garantias').select('id', { count: 'exact', head: true }).eq('estado', 'vendido')
  ])
  
  return {
    total: total.count || 0,
    enGarantia: enGarantia.count || 0,
    recuperadas: recuperadas.count || 0,
    vendidas: vendidas.count || 0
  }
}
