import { supabase } from '@/lib/supabase/client'

/**
 * Obtiene el usuario autenticado actual (para componentes client)
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Obtiene el ID del usuario actual
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.id || null
}

/**
 * Obtiene la primera empresa activa (empresa por defecto)
 */
export async function getDefaultEmpresaId(): Promise<string | null> {
  const { data } = await supabase
    .from('empresas')
    .select('id')
    .eq('activo', true)
    .limit(1)
    .single()
  
  return data?.id || null
}
