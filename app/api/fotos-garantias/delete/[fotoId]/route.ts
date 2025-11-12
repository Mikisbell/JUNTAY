import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: Request,
  { params }: { params: { fotoId: string } }
) {
  try {
    const supabase = createClient()
    
    // Obtener datos de la foto primero
    const { data: foto, error: fetchError } = await supabase
      .from('fotos_garantias')
      .select('archivo_path')
      .eq('id', params.fotoId)
      .single()
    
    if (fetchError || !foto) {
      return NextResponse.json(
        { success: false, error: 'Foto no encontrada' },
        { status: 404 }
      )
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
      .eq('id', params.fotoId)
    
    if (dbError) {
      return NextResponse.json(
        { success: false, error: `Error al eliminar registro: ${dbError.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error eliminando foto:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
