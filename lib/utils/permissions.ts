import { supabase } from '@/lib/supabase/client'

/**
 * Verifica si el usuario actual tiene un permiso específico
 */
export async function verificarPermiso(modulo: string, accion: string): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return false

    const { data, error } = await supabase.rpc('verificar_permiso', {
      usuario_uuid: user.user.id,
      modulo_param: modulo,
      accion_param: accion
    })

    if (error) {
      console.error('Error verificando permiso:', error)
      return false
    }

    return data === true
  } catch (error) {
    console.error('Error en verificarPermiso:', error)
    return false
  }
}

/**
 * Obtiene todos los permisos del usuario actual
 */
export async function obtenerPermisosUsuario(): Promise<{modulo: string, accion: string, descripcion: string}[]> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return []

    const { data, error } = await supabase.rpc('obtener_permisos_usuario', {
      usuario_uuid: user.user.id
    })

    if (error) {
      console.error('Error obteniendo permisos:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerPermisosUsuario:', error)
    return []
  }
}

/**
 * Verifica si el usuario puede crear créditos
 */
export async function puedeCrearCreditos(): Promise<boolean> {
  return await verificarPermiso('creditos', 'crear')
}

/**
 * Verifica si el usuario puede aprobar créditos
 */
export async function puedeAprobarCreditos(): Promise<boolean> {
  return await verificarPermiso('creditos', 'aprobar')
}

/**
 * Verifica si el usuario puede crear garantías
 */
export async function puedeCrearGarantias(): Promise<boolean> {
  return await verificarPermiso('garantias', 'crear')
}

/**
 * Verifica si el usuario puede registrar clientes
 */
export async function puedeCrearClientes(): Promise<boolean> {
  return await verificarPermiso('clientes', 'crear')
}

/**
 * Obtiene los límites de crédito del usuario
 */
export async function obtenerLimitesUsuario(): Promise<{
  limite_credito_diario: number
  limite_credito_individual: number
  requiere_aprobacion_creditos: boolean
  puede_aprobar_creditos: boolean
} | null> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return null

    const { data, error } = await supabase
      .from('usuarios')
      .select('limite_credito_diario, limite_credito_individual, requiere_aprobacion_creditos, puede_aprobar_creditos')
      .eq('id', user.user.id)
      .single()

    if (error) {
      console.error('Error obteniendo límites:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error en obtenerLimitesUsuario:', error)
    return null
  }
}

/**
 * Verifica si un monto de crédito requiere aprobación
 */
export async function requiereAprobacion(monto: number): Promise<boolean> {
  const limites = await obtenerLimitesUsuario()
  if (!limites) return true

  // Si el usuario requiere aprobación para todos los créditos
  if (limites.requiere_aprobacion_creditos) return true

  // Si excede el límite individual
  if (monto > limites.limite_credito_individual) return true

  return false
}

/**
 * Hook personalizado para permisos (para usar en componentes)
 */
export interface PermisosUsuario {
  puedeCrearCreditos: boolean
  puedeAprobarCreditos: boolean
  puedeCrearGarantias: boolean
  puedeCrearClientes: boolean
  limites: {
    limite_credito_diario: number
    limite_credito_individual: number
    requiere_aprobacion_creditos: boolean
    puede_aprobar_creditos: boolean
  } | null
}

export async function obtenerPermisosCompletos(): Promise<PermisosUsuario> {
  const [
    puedeCrearCreditos,
    puedeAprobarCreditos, 
    puedeCrearGarantias,
    puedeCrearClientes,
    limites
  ] = await Promise.all([
    verificarPermiso('creditos', 'crear'),
    verificarPermiso('creditos', 'aprobar'),
    verificarPermiso('garantias', 'crear'),
    verificarPermiso('clientes', 'crear'),
    obtenerLimitesUsuario()
  ])

  return {
    puedeCrearCreditos,
    puedeAprobarCreditos,
    puedeCrearGarantias,
    puedeCrearClientes,
    limites
  }
}
