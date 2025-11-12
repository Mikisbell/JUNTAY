import { createClient } from '@/lib/supabase/server'

export interface FotoGarantia {
  id?: string
  garantia_id: string
  archivo_url: string
  archivo_path: string
  nombre_archivo: string
  tipo_foto?: 'principal' | 'detalle' | 'estado'
  descripcion?: string
  orden?: number
  mime_type?: string
  tamano_bytes?: number
  ancho?: number
  alto?: number
  subido_por?: string
  created_at?: string
  updated_at?: string
}

export interface UploadFotoResult {
  success: boolean
  foto?: FotoGarantia
  error?: string
  url?: string
}

// Obtener todas las fotos de una garantía
export async function getFotosGarantia(garantiaId: string): Promise<FotoGarantia[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('fotos_garantias')
    .select('*')
    .eq('garantia_id', garantiaId)
    .order('orden', { ascending: true })
  
  if (error) {
    console.error('Error al obtener fotos:', error)
    return []
  }
  
  return data || []
}

// Subir una foto a Storage y registrar en BD
export async function subirFotoGarantia(
  garantiaId: string,
  file: File,
  tipoFoto: 'principal' | 'detalle' | 'estado' = 'detalle',
  descripcion?: string,
  orden?: number
): Promise<UploadFotoResult> {
  const supabase = createClient()
  
  try {
    // Generar nombre único del archivo
    const timestamp = new Date().getTime()
    const extension = file.name.split('.').pop()
    const fileName = `${garantiaId}/${timestamp}_${tipoFoto}.${extension}`
    
    // Subir archivo a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('garantias-fotos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      return {
        success: false,
        error: `Error al subir archivo: ${uploadError.message}`
      }
    }
    
    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('garantias-fotos')
      .getPublicUrl(fileName)
    
    // Obtener usuario actual (si está disponible)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Registrar en base de datos
    const fotoData: Omit<FotoGarantia, 'id' | 'created_at' | 'updated_at'> = {
      garantia_id: garantiaId,
      archivo_url: urlData.publicUrl,
      archivo_path: fileName,
      nombre_archivo: file.name,
      tipo_foto: tipoFoto,
      descripcion,
      orden: orden || await getProximoOrden(garantiaId),
      mime_type: file.type,
      tamano_bytes: file.size,
      subido_por: user?.id
    }
    
    const { data: fotoRegistrada, error: dbError } = await supabase
      .from('fotos_garantias')
      .insert(fotoData)
      .select()
      .single()
    
    if (dbError) {
      // Si hay error en BD, eliminar archivo subido
      await supabase.storage
        .from('garantias-fotos')
        .remove([fileName])
      
      return {
        success: false,
        error: `Error al registrar foto: ${dbError.message}`
      }
    }
    
    return {
      success: true,
      foto: fotoRegistrada,
      url: urlData.publicUrl
    }
    
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error}`
    }
  }
}

// Eliminar foto (Storage + BD)
export async function eliminarFotoGarantia(fotoId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Obtener datos de la foto primero
    const { data: foto, error: fetchError } = await supabase
      .from('fotos_garantias')
      .select('archivo_path')
      .eq('id', fotoId)
      .single()
    
    if (fetchError || !foto) {
      return {
        success: false,
        error: 'Foto no encontrada'
      }
    }
    
    // Eliminar archivo de Storage
    const { error: storageError } = await supabase.storage
      .from('garantias-fotos')
      .remove([foto.archivo_path])
    
    if (storageError) {
      console.error('Error al eliminar archivo:', storageError)
      // Continuar con eliminación de BD aunque falle Storage
    }
    
    // Eliminar registro de BD
    const { error: dbError } = await supabase
      .from('fotos_garantias')
      .delete()
      .eq('id', fotoId)
    
    if (dbError) {
      return {
        success: false,
        error: `Error al eliminar registro: ${dbError.message}`
      }
    }
    
    return { success: true }
    
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error}`
    }
  }
}

// Actualizar orden de las fotos
export async function actualizarOrdenFotos(
  garantiaId: string,
  fotosOrdenadas: { id: string; orden: number }[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    for (const foto of fotosOrdenadas) {
      const { error } = await supabase
        .from('fotos_garantias')
        .update({ orden: foto.orden })
        .eq('id', foto.id)
        .eq('garantia_id', garantiaId) // Seguridad adicional
      
      if (error) {
        return {
          success: false,
          error: `Error al actualizar orden: ${error.message}`
        }
      }
    }
    
    return { success: true }
    
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error}`
    }
  }
}

// Actualizar foto (descripción, tipo)
export async function actualizarFotoGarantia(
  fotoId: string,
  updates: Partial<Pick<FotoGarantia, 'descripcion' | 'tipo_foto' | 'orden'>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('fotos_garantias')
      .update(updates)
      .eq('id', fotoId)
    
    if (error) {
      return {
        success: false,
        error: `Error al actualizar foto: ${error.message}`
      }
    }
    
    return { success: true }
    
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error}`
    }
  }
}

// Función helper para obtener el próximo orden disponible
async function getProximoOrden(garantiaId: string): Promise<number> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('fotos_garantias')
    .select('orden')
    .eq('garantia_id', garantiaId)
    .order('orden', { ascending: false })
    .limit(1)
  
  if (error || !data || data.length === 0) {
    return 1
  }
  
  return (data[0].orden || 0) + 1
}

// Marcar foto como principal (solo una por garantía)
export async function marcarFotoPrincipal(fotoId: string, garantiaId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Primero, quitar 'principal' de todas las fotos de esta garantía
    await supabase
      .from('fotos_garantias')
      .update({ tipo_foto: 'detalle' })
      .eq('garantia_id', garantiaId)
      .eq('tipo_foto', 'principal')
    
    // Luego, marcar la foto seleccionada como principal
    const { error } = await supabase
      .from('fotos_garantias')
      .update({ tipo_foto: 'principal' })
      .eq('id', fotoId)
    
    if (error) {
      return {
        success: false,
        error: `Error al marcar como principal: ${error.message}`
      }
    }
    
    return { success: true }
    
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error}`
    }
  }
}
