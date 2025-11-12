import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { fotoId, garantiaId } = await request.json()

    if (!fotoId || !garantiaId) {
      return NextResponse.json(
        { success: false, error: 'fotoId y garantiaId requeridos' },
        { status: 400 }
      )
    }

    const supabase = createClient()

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
      return NextResponse.json(
        { success: false, error: `Error al marcar como principal: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error marcando foto principal:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
