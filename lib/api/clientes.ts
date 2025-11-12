import { createClient } from '@/lib/supabase/server'

export interface Cliente {
  id?: string
  empresa_id?: string
  tipo_persona: 'natural' | 'juridica'
  tipo_documento: 'DNI' | 'RUC' | 'CE' | 'PASAPORTE'
  numero_documento: string
  
  // Para persona natural
  nombres?: string
  apellido_paterno?: string
  apellido_materno?: string
  fecha_nacimiento?: string
  genero?: string
  estado_civil?: string
  
  // Para persona jurídica
  razon_social?: string
  representante_legal?: string
  
  // Contacto
  email?: string
  telefono_principal?: string
  telefono_secundario?: string
  direccion?: string
  distrito?: string
  provincia?: string
  departamento?: string
  referencia?: string
  
  // Datos laborales
  ocupacion?: string
  empresa_trabaja?: string
  ingreso_mensual?: number
  
  // Estado
  calificacion_crediticia?: string // 'excelente', 'bueno', 'regular', 'malo'
  activo?: boolean
  observaciones?: string
  foto_url?: string
  
  created_by?: string
  created_at?: string
  updated_at?: string
}

export async function getClientes() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching clientes:', error)
    return []
  }
  
  return data as Cliente[]
}

export async function getClienteById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching cliente:', error)
    return null
  }
  
  return data as Cliente
}

export async function searchClientes(query: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .or(`numero_documento.ilike.%${query}%,nombres.ilike.%${query}%,apellido_paterno.ilike.%${query}%,razon_social.ilike.%${query}%`)
    .limit(10)
  
  if (error) {
    console.error('Error searching clientes:', error)
    return []
  }
  
  return data as Cliente[]
}

export async function createCliente(cliente: Cliente) {
  const supabase = createClient()
  
  const { data, error} = await supabase
    .from('clientes')
    .insert([cliente])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating cliente:', error)
    throw error
  }
  
  return data as Cliente
}

export async function updateCliente(id: string, cliente: Partial<Cliente>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating cliente:', error)
    throw error
  }
  
  return data as Cliente
}

export async function deleteCliente(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting cliente:', error)
    throw error
  }
  
  return true
}

export async function getClientesStats() {
  const supabase = createClient()
  
  const [total, activos, conMora, nuevos] = await Promise.all([
    supabase.from('clientes').select('id', { count: 'exact', head: true }),
    supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('clientes').select('id', { count: 'exact', head: true }).in('calificacion_crediticia', ['regular', 'malo']),
    supabase.from('clientes').select('id', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setDate(1)).toISOString())
  ])
  
  return {
    total: total.count || 0,
    activos: activos.count || 0,
    conMora: conMora.count || 0,
    nuevos: nuevos.count || 0
  }
}
