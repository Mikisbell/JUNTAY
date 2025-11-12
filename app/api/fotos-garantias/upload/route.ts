import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const garantiaId = formData.get('garantiaId') as string
    const tipoFoto = formData.get('tipoFoto') as string || 'detalle'
    const descripcion = formData.get('descripcion') as string
    const orden = formData.get('orden') as string

    if (!file || !garantiaId) {
      return NextResponse.json(
        { success: false, error: 'Archivo y garantiaId requeridos' },
        { status: 400 }
      )
    }

    const supabase = createClient()

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
      return NextResponse.json({
        success: false,
        error: `Error al subir archivo: ${uploadError.message}`
      }, { status: 500 })
    }
    
    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('garantias-fotos')
      .getPublicUrl(fileName)
    
    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    
    // Obtener próximo orden si no se especifica
    let ordenFinal = parseInt(orden) || await getProximoOrden(garantiaId, supabase)
    
    // Registrar en base de datos
    const fotoData = {
      garantia_id: garantiaId,
      archivo_url: urlData.publicUrl,
      archivo_path: fileName,
      nombre_archivo: file.name,
      tipo_foto: tipoFoto,
      descripcion: descripcion || null,
      orden: ordenFinal,
      mime_type: file.type,
      tamano_bytes: file.size,
      subido_por: user?.id || null
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
      
      return NextResponse.json({
        success: false,
        error: `Error al registrar foto: ${dbError.message}`
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      foto: fotoRegistrada,
      url: urlData.publicUrl
    })

  } catch (error) {
    console.error('Error en upload foto:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función helper para obtener el próximo orden
async function getProximoOrden(garantiaId: string, supabase: any): Promise<number> {
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
