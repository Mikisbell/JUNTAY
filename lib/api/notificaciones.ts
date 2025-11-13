import { createClient } from '@/lib/supabase/server'

export interface Notificacion {
  id?: string
  credito_id?: string
  cliente_id?: string
  tipo: 'vencimiento' | 'mora' | 'remate' | 'pago_recibido' | 'recordatorio'
  canal: 'whatsapp' | 'sms' | 'email' | 'llamada' | 'presencial'
  mensaje: string
  telefono_destino?: string
  email_destino?: string
  estado: 'pendiente' | 'enviado' | 'entregado' | 'fallido'
  fecha_programada?: string
  fecha_enviado?: string
  fecha_entregado?: string
  respuesta_cliente?: string
  costo_envio?: number
  proveedor?: string
  mensaje_id_externo?: string
  error_detalle?: string
  enviado_por?: string
  created_at?: string

  // Relaciones
  credito?: any
  cliente?: any
  usuario?: any
}

export async function getNotificaciones(filtros?: {
  credito_id?: string
  cliente_id?: string
  tipo?: string
  estado?: string
  fecha_desde?: string
  fecha_hasta?: string
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('notificaciones')
    .select(`
      *, 
      creditos(codigo, monto_prestado),
      clientes(nombres, apellido_paterno, telefono_principal),
      usuarios(nombres, apellidos)
    `)
    .order('created_at', { ascending: false })
  
  if (filtros?.credito_id) {
    query = query.eq('credito_id', filtros.credito_id)
  }
  
  if (filtros?.cliente_id) {
    query = query.eq('cliente_id', filtros.cliente_id)
  }
  
  if (filtros?.tipo) {
    query = query.eq('tipo', filtros.tipo)
  }
  
  if (filtros?.estado) {
    query = query.eq('estado', filtros.estado)
  }
  
  if (filtros?.fecha_desde) {
    query = query.gte('created_at', filtros.fecha_desde)
  }
  
  if (filtros?.fecha_hasta) {
    query = query.lte('created_at', filtros.fecha_hasta)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching notificaciones:', error)
    return []
  }
  
  return data as Notificacion[]
}

export async function crearNotificacion(notificacionData: Partial<Notificacion>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('notificaciones')
    .insert([notificacionData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creando notificación:', error)
    throw error
  }
  
  return data as Notificacion
}

export async function actualizarNotificacion(id: string, updates: Partial<Notificacion>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('notificaciones')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error actualizando notificación:', error)
    throw error
  }
  
  return data as Notificacion
}

export async function marcarComoEnviado(id: string, mensaje_id_externo?: string) {
  return actualizarNotificacion(id, {
    estado: 'enviado',
    fecha_enviado: new Date().toISOString(),
    mensaje_id_externo
  })
}

export async function marcarComoEntregado(id: string, respuesta_cliente?: string) {
  return actualizarNotificacion(id, {
    estado: 'entregado',
    fecha_entregado: new Date().toISOString(),
    respuesta_cliente
  })
}

export async function marcarComoFallido(id: string, error_detalle: string) {
  return actualizarNotificacion(id, {
    estado: 'fallido',
    error_detalle
  })
}

export async function getNotificacionesPendientes() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('notificaciones')
    .select(`
      *, 
      creditos(codigo, monto_prestado),
      clientes(nombres, apellido_paterno, telefono_principal)
    `)
    .eq('estado', 'pendiente')
    .lte('fecha_programada', new Date().toISOString())
    .order('fecha_programada', { ascending: true })
  
  if (error) {
    console.error('Error fetching notificaciones pendientes:', error)
    return []
  }
  
  return data as Notificacion[]
}

export async function getNotificacionesStats() {
  const supabase = createClient()
  
  const [total, pendientes, enviadas, entregadas, fallidas] = await Promise.all([
    supabase.from('notificaciones').select('id', { count: 'exact', head: true }),
    supabase.from('notificaciones').select('id', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    supabase.from('notificaciones').select('id', { count: 'exact', head: true }).eq('estado', 'enviado'),
    supabase.from('notificaciones').select('id', { count: 'exact', head: true }).eq('estado', 'entregado'),
    supabase.from('notificaciones').select('id', { count: 'exact', head: true }).eq('estado', 'fallido')
  ])
  
  // Calcular costo total
  const { data: costosData } = await supabase
    .from('notificaciones')
    .select('costo_envio')
    .not('costo_envio', 'is', null)
  
  const costoTotal = costosData?.reduce((sum, n) => sum + (n.costo_envio || 0), 0) || 0
  
  return {
    total: total.count || 0,
    pendientes: pendientes.count || 0,
    enviadas: enviadas.count || 0,
    entregadas: entregadas.count || 0,
    fallidas: fallidas.count || 0,
    costoTotal
  }
}

// Funciones para automatización
export async function programarRecordatorioVencimiento(credito_id: string, dias_anticipacion: number) {
  const supabase = createClient()
  
  // Obtener datos del crédito
  const { data: credito } = await supabase
    .from('creditos')
    .select('*, clientes(*)')
    .eq('id', credito_id)
    .single()
  
  if (!credito) return null
  
  const fechaVencimiento = new Date(credito.fecha_ultimo_vencimiento)
  const fechaNotificacion = new Date(fechaVencimiento)
  fechaNotificacion.setDate(fechaNotificacion.getDate() - dias_anticipacion)
  
  const mensaje = `🔔 Recordatorio: Su crédito ${credito.codigo} vence el ${fechaVencimiento.toLocaleDateString()}. Monto pendiente: S/ ${credito.saldo_pendiente}`
  
  return crearNotificacion({
    credito_id,
    cliente_id: credito.cliente_id,
    tipo: 'recordatorio',
    canal: 'whatsapp',
    mensaje,
    telefono_destino: credito.clientes?.telefono_principal,
    estado: 'pendiente',
    fecha_programada: fechaNotificacion.toISOString()
  })
}

export async function programarNotificacionMora(credito_id: string) {
  const supabase = createClient()
  
  // Obtener datos del crédito
  const { data: credito } = await supabase
    .from('creditos')
    .select('*, clientes(*)')
    .eq('id', credito_id)
    .single()
  
  if (!credito) return null
  
  const mensaje = `⚠️ Su crédito ${credito.codigo} está en mora. Días de atraso: ${credito.dias_mora}. Comuníquese para regularizar su situación.`
  
  return crearNotificacion({
    credito_id,
    cliente_id: credito.cliente_id,
    tipo: 'mora',
    canal: 'whatsapp',
    mensaje,
    telefono_destino: credito.clientes?.telefono_principal,
    estado: 'pendiente',
    fecha_programada: new Date().toISOString()
  })
}
