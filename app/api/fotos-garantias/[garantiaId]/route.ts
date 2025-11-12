import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { garantiaId: string } }
) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('fotos_garantias')
      .select('*')
      .eq('garantia_id', params.garantiaId)
      .order('orden', { ascending: true })
    
    if (error) {
      console.error('Error al obtener fotos:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Error en API fotos garantía:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
