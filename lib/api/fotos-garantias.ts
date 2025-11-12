// Funciones para interactuar con API de fotos desde el cliente

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
  try {
    const response = await fetch(`/api/fotos-garantias/${garantiaId}`)
    const result = await response.json()
    
    if (result.success) {
      return result.data || []
    } else {
      console.error('Error al obtener fotos:', result.error)
      return []
    }
  } catch (error) {
    console.error('Error al obtener fotos:', error)
    return []
  }
}

// Subir una foto a Storage y registrar en BD
export async function subirFotoGarantia(
  garantiaId: string,
  file: File,
  tipoFoto: 'principal' | 'detalle' | 'estado' = 'detalle',
  descripcion?: string,
  orden?: number
): Promise<UploadFotoResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('garantiaId', garantiaId)
    formData.append('tipoFoto', tipoFoto)
    if (descripcion) formData.append('descripcion', descripcion)
    if (orden) formData.append('orden', orden.toString())

    const response = await fetch('/api/fotos-garantias/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    return result

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error}`
    }
  }
}

// Eliminar foto (Storage + BD)
export async function eliminarFotoGarantia(fotoId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/fotos-garantias/delete/${fotoId}`, {
      method: 'DELETE'
    })

    const result = await response.json()
    return result

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error}`
    }
  }
}

// Marcar foto como principal (solo una por garantía)
export async function marcarFotoPrincipal(fotoId: string, garantiaId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/fotos-garantias/marcar-principal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fotoId, garantiaId })
    })

    const result = await response.json()
    return result

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error}`
    }
  }
}
