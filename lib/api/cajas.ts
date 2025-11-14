import { createClient } from '@/lib/supabase/server'

// =====================================================
// INTERFACES Y TIPOS
// =====================================================

export interface Caja {
  id?: string
  empresa_id?: string
  codigo: string
  nombre: string
  descripcion?: string
  ubicacion?: string
  estado: 'abierta' | 'cerrada' | 'en_arqueo' | 'bloqueada'
  activa?: boolean
  responsable_actual_id?: string
  fecha_ultima_apertura?: string
  fecha_ultimo_cierre?: string
  saldo_actual?: number
  created_at?: string
  updated_at?: string
}

export interface SesionCaja {
  id?: string
  caja_id: string
  numero_sesion?: number
  
  // Apertura
  fecha_apertura: string
  usuario_apertura_id?: string
  monto_inicial: number
  billetes_apertura?: BilleteraDesglose
  observaciones_apertura?: string
  
  // Cierre
  fecha_cierre?: string
  usuario_cierre_id?: string
  monto_sistema?: number
  monto_contado?: number
  diferencia?: number
  billetes_cierre?: BilleteraDesglose
  observaciones_cierre?: string
  
  // Resumen
  total_ingresos?: number
  total_egresos?: number
  total_movimientos?: number
  
  estado: 'abierta' | 'cerrada' | 'cuadrada' | 'con_diferencia'
  created_at?: string
  updated_at?: string
  
  // Relaciones
  caja?: Caja
  usuario_apertura?: any
  usuario_cierre?: any
}

export interface MovimientoCaja {
  id?: string
  sesion_id: string
  caja_id: string
  
  tipo: 'ingreso' | 'egreso' | 'apertura' | 'cierre' | 'ajuste'
  concepto: string
  
  referencia_tipo?: string
  referencia_id?: string
  referencia_codigo?: string
  
  monto: number
  saldo_anterior: number
  saldo_nuevo: number
  
  descripcion?: string
  comprobante_numero?: string
  metodo_pago?: string
  
  usuario_id?: string
  fecha: string
  
  anulado?: boolean
  fecha_anulacion?: string
  usuario_anulacion_id?: string
  motivo_anulacion?: string
  
  created_at?: string
}

export interface ArqueoCaja {
  id?: string
  sesion_id: string
  caja_id: string
  
  tipo: 'apertura' | 'intermedio' | 'cierre'
  
  monto_sistema: number
  monto_contado: number
  diferencia: number
  
  // Desglose
  billetes_200?: number
  billetes_100?: number
  billetes_50?: number
  billetes_20?: number
  billetes_10?: number
  monedas_5?: number
  monedas_2?: number
  monedas_1?: number
  monedas_050?: number
  monedas_020?: number
  monedas_010?: number
  
  detalle_efectivo?: BilleteraDesglose
  
  observaciones?: string
  justificacion_diferencia?: string
  
  realizado_por?: string
  supervisado_por?: string
  fecha: string
  created_at?: string
}

// NUEVAS INTERFACES PARA SISTEMA BANCARIO

export interface CajaGeneral {
  id?: string
  empresa_id?: string
  codigo: string
  nombre: string
  descripcion?: string
  
  // Saldos
  saldo_total: number
  saldo_disponible: number
  saldo_asignado: number
  
  // Límites
  limite_asignacion_individual?: number
  limite_total_asignaciones?: number
  
  // Control
  activa?: boolean
  responsable_id?: string
  
  // Auditoría
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export interface AsignacionCaja {
  id?: string
  
  // Relaciones
  caja_general_id: string
  caja_individual_id: string
  sesion_caja_id: string
  
  // Datos de asignación
  tipo_operacion: 'asignacion' | 'devolucion'
  monto_asignado: number
  monto_devuelto?: number
  diferencia?: number
  
  // Saldos antes/después
  saldo_caja_general_antes: number
  saldo_caja_general_despues: number
  
  // Control y auditoría
  estado?: 'activa' | 'devuelta' | 'pendiente_devolucion'
  observaciones?: string
  autorizado_por?: string
  cajero_responsable: string
  
  // Fechas
  fecha_asignacion?: string
  fecha_devolucion?: string
  
  // Auditoría
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export interface MovimientoCajaGeneral {
  id?: string
  
  // Relaciones
  caja_general_id: string
  asignacion_id?: string
  
  // Datos del movimiento
  tipo_movimiento: 'asignacion_cajero' | 'devolucion_cajero' | 'ingreso_efectivo' | 
                   'retiro_efectivo' | 'transferencia_entrada' | 'transferencia_salida' |
                   'ajuste_inventario' | 'deposito_banco' | 'aporte_socio' |
                   'transferencia_bancaria' | 'cobranza_directa' | 'venta_activo' |
                   'pago_proveedor' | 'retiro_socio' | 'dividendo_socio'
  
  monto: number
  saldo_anterior: number
  saldo_nuevo: number
  
  // Detalles
  concepto: string
  descripcion?: string
  referencia_externa?: string
  
  // Responsables
  usuario_operacion: string
  autorizado_por?: string
  
  // Auditoría
  fecha?: string
  created_at?: string
  created_by?: string
}

export interface BilleteraDesglose {
  billetes_200: number
  billetes_100: number
  billetes_50: number
  billetes_20: number
  billetes_10: number
  monedas_5: number
  monedas_2: number
  monedas_1: number
  monedas_050: number
  monedas_020: number
  monedas_010: number
}

export interface Gasto {
  id?: string
  empresa_id?: string
  caja_id?: string
  sesion_id?: string
  movimiento_id?: string
  
  codigo: string
  
  categoria: string
  subcategoria?: string
  
  descripcion: string
  monto: number
  
  tipo_comprobante?: string
  numero_comprobante?: string
  proveedor_nombre?: string
  proveedor_ruc?: string
  
  fecha_gasto: string
  fecha_pago?: string
  
  estado: 'pendiente' | 'pagado' | 'anulado'
  metodo_pago?: string
  
  registrado_por?: string
  aprobado_por?: string
  fecha_aprobacion?: string
  
  observaciones?: string
  created_at?: string
  updated_at?: string
}

// =====================================================
// FUNCIONES DE CAJAS
// =====================================================

export async function getCajas() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('cajas')
    .select('*')
    .eq('activa', true)
    .order('codigo')
  
  if (error) {
    console.error('Error fetching cajas:', error)
    return []
  }
  
  return data as Caja[]
}

export async function getCajaById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('cajas')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching caja:', error)
    return null
  }
  
  return data as Caja
}

export async function getSaldoActualCaja(cajaId: string) {
  const supabase = createClient()
  
  // Obtener sesión abierta
  const { data: sesion } = await supabase
    .from('sesiones_caja')
    .select('*')
    .eq('caja_id', cajaId)
    .eq('estado', 'abierta')
    .single()
  
  if (!sesion) {
    return {
      tiene_sesion_abierta: false,
      saldo: 0
    }
  }
  
  const saldo = sesion.monto_inicial + (sesion.total_ingresos || 0) - (sesion.total_egresos || 0)
  
  return {
    tiene_sesion_abierta: true,
    sesion_id: sesion.id,
    saldo: saldo,
    monto_inicial: sesion.monto_inicial,
    total_ingresos: sesion.total_ingresos || 0,
    total_egresos: sesion.total_egresos || 0,
    fecha_apertura: sesion.fecha_apertura
  }
}

// =====================================================
// FUNCIONES DE SESIONES
// =====================================================

export async function abrirCaja(data: {
  caja_id: string
  monto_inicial: number
  billetes_apertura?: BilleteraDesglose
  observaciones_apertura?: string
  usuario_apertura_id?: string
}) {
  const supabase = createClient()
  
  // Verificar que no haya sesión abierta
  const { data: sesionAbierta } = await supabase
    .from('sesiones_caja')
    .select('id')
    .eq('caja_id', data.caja_id)
    .eq('estado', 'abierta')
    .single()
  
  if (sesionAbierta) {
    throw new Error('Ya existe una sesión abierta para esta caja')
  }
  
  // Obtener último número de sesión
  const { data: ultimaSesion } = await supabase
    .from('sesiones_caja')
    .select('numero_sesion')
    .eq('caja_id', data.caja_id)
    .order('numero_sesion', { ascending: false })
    .limit(1)
    .single()
  
  const numeroSesion = (ultimaSesion?.numero_sesion || 0) + 1
  
  // Crear sesión
  const { data: sesion, error } = await supabase
    .from('sesiones_caja')
    .insert([{
      caja_id: data.caja_id,
      numero_sesion: numeroSesion,
      fecha_apertura: new Date().toISOString(),
      usuario_apertura_id: data.usuario_apertura_id || null,
      monto_inicial: data.monto_inicial,
      billetes_apertura: data.billetes_apertura || null,
      observaciones_apertura: data.observaciones_apertura || null,
      estado: 'abierta',
      total_ingresos: 0,
      total_egresos: 0,
      total_movimientos: 0
    }])
    .select()
    .single()
  
  if (error) throw error
  
  // Actualizar estado de caja
  await supabase
    .from('cajas')
    .update({
      estado: 'abierta',
      responsable_actual_id: data.usuario_apertura_id || null,
      fecha_ultima_apertura: new Date().toISOString()
    })
    .eq('id', data.caja_id)
  
  // Registrar movimiento de apertura
  await supabase
    .from('movimientos_caja')
    .insert([{
      sesion_id: sesion.id,
      caja_id: data.caja_id,
      tipo: 'apertura',
      concepto: 'apertura_caja',
      monto: data.monto_inicial,
      saldo_anterior: 0,
      saldo_nuevo: data.monto_inicial,
      descripcion: 'Apertura de caja',
      usuario_id: data.usuario_apertura_id || null,
      fecha: new Date().toISOString()
    }])
  
  // Crear arqueo de apertura
  if (data.billetes_apertura) {
    await supabase
      .from('arqueos_caja')
      .insert([{
        sesion_id: sesion.id,
        caja_id: data.caja_id,
        tipo: 'apertura',
        monto_sistema: data.monto_inicial,
        monto_contado: data.monto_inicial,
        diferencia: 0,
        ...data.billetes_apertura,
        detalle_efectivo: data.billetes_apertura,
        realizado_por: data.usuario_apertura_id || null,
        fecha: new Date().toISOString()
      }])
  }
  
  return sesion as SesionCaja
}

export async function cerrarCaja(data: {
  sesion_id: string
  caja_id: string
  monto_contado: number
  billetes_cierre?: BilleteraDesglose
  observaciones_cierre?: string
  usuario_cierre_id?: string
}) {
  const supabase = createClient()
  
  // Obtener sesión
  const { data: sesion } = await supabase
    .from('sesiones_caja')
    .select('*')
    .eq('id', data.sesion_id)
    .single()
  
  if (!sesion) {
    throw new Error('Sesión no encontrada')
  }
  
  // Calcular monto según sistema
  const montoSistema = sesion.monto_inicial + (sesion.total_ingresos || 0) - (sesion.total_egresos || 0)
  const diferencia = data.monto_contado - montoSistema
  
  // Determinar estado
  let estadoCierre: 'cerrada' | 'cuadrada' | 'con_diferencia' = 'cerrada'
  if (Math.abs(diferencia) < 0.01) {
    estadoCierre = 'cuadrada'
  } else if (diferencia !== 0) {
    estadoCierre = 'con_diferencia'
  }
  
  // Actualizar sesión
  const { error } = await supabase
    .from('sesiones_caja')
    .update({
      fecha_cierre: new Date().toISOString(),
      usuario_cierre_id: data.usuario_cierre_id || null,
      monto_sistema: montoSistema,
      monto_contado: data.monto_contado,
      diferencia: diferencia,
      billetes_cierre: data.billetes_cierre || null,
      observaciones_cierre: data.observaciones_cierre || null,
      estado: estadoCierre,
      updated_at: new Date().toISOString()
    })
    .eq('id', data.sesion_id)
  
  if (error) throw error
  
  // Actualizar estado de caja
  await supabase
    .from('cajas')
    .update({
      estado: 'cerrada',
      fecha_ultimo_cierre: new Date().toISOString()
    })
    .eq('id', data.caja_id)
  
  // Registrar movimiento de cierre
  await supabase
    .from('movimientos_caja')
    .insert([{
      sesion_id: data.sesion_id,
      caja_id: data.caja_id,
      tipo: 'cierre',
      concepto: 'cierre_caja',
      monto: 0,
      saldo_anterior: montoSistema,
      saldo_nuevo: 0,
      descripcion: `Cierre de caja. Diferencia: S/ ${diferencia.toFixed(2)}`,
      usuario_id: data.usuario_cierre_id || null,
      fecha: new Date().toISOString()
    }])
  
  // Crear arqueo de cierre
  if (data.billetes_cierre) {
    await supabase
      .from('arqueos_caja')
      .insert([{
        sesion_id: data.sesion_id,
        caja_id: data.caja_id,
        tipo: 'cierre',
        monto_sistema: montoSistema,
        monto_contado: data.monto_contado,
        diferencia: diferencia,
        ...data.billetes_cierre,
        detalle_efectivo: data.billetes_cierre,
        observaciones: data.observaciones_cierre,
        realizado_por: data.usuario_cierre_id || null,
        fecha: new Date().toISOString()
      }])
  }
  
  return {
    success: true,
    monto_sistema: montoSistema,
    monto_contado: data.monto_contado,
    diferencia: diferencia,
    estado: estadoCierre
  }
}

export async function getSesionActual(cajaId: string, retry = 0): Promise<SesionCaja | null> {
  const supabase = createClient()
  
  console.log(`Buscando sesión actual para caja: ${cajaId} (intento ${retry + 1})`)
  
  const { data, error } = await supabase
    .from('sesiones_caja')
    .select('*, caja:cajas(*)')
    .eq('caja_id', cajaId)
    .eq('estado', 'abierta')
    .single()
  
  if (error) {
    console.error('Error fetching sesión:', error)
    
    // Buscar todas las sesiones para debug
    const { data: todasSesiones } = await supabase
      .from('sesiones_caja')
      .select('*')
      .eq('caja_id', cajaId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    console.log('Últimas 5 sesiones para esta caja:', todasSesiones)
    
    // Si no encontró sesión y es el primer intento, esperar y reintentar
    if (error.code === 'PGRST116' && retry < 2) {
      console.log('No se encontró sesión, reintentando en 1 segundo...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      return getSesionActual(cajaId, retry + 1)
    }
    
    return null
  }
  
  console.log('Sesión encontrada:', data)
  return data as SesionCaja
}

export async function getMovimientosSesion(sesionId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('movimientos_caja')
    .select('*')
    .eq('sesion_id', sesionId)
    .eq('anulado', false)
    .order('fecha', { ascending: false })
  
  if (error) {
    console.error('Error fetching movimientos:', error)
    return []
  }
  
  return data as MovimientoCaja[]
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

export function calcularTotalBilletes(billetes: BilleteraDesglose): number {
  return (
    billetes.billetes_200 * 200 +
    billetes.billetes_100 * 100 +
    billetes.billetes_50 * 50 +
    billetes.billetes_20 * 20 +
    billetes.billetes_10 * 10 +
    billetes.monedas_5 * 5 +
    billetes.monedas_2 * 2 +
    billetes.monedas_1 * 1 +
    billetes.monedas_050 * 0.50 +
    billetes.monedas_020 * 0.20 +
    billetes.monedas_010 * 0.10
  )
}
