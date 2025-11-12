import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { ruc } = await request.json()

    if (!ruc) {
      return NextResponse.json(
        { success: false, error: 'RUC requerido' },
        { status: 400 }
      )
    }

    // Buscar empresa existente por RUC
    const { data: empresa, error } = await supabase
      .from('clientes')
      .select('id, razon_social, numero_documento')
      .eq('numero_documento', ruc)
      .eq('tipo_persona', 'juridica')
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Error verificando RUC:', error)
      return NextResponse.json(
        { success: false, error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    if (empresa) {
      return NextResponse.json({
        existe: true,
        empresa_id: empresa.id,
        razon_social: empresa.razon_social,
        mensaje: `Empresa ya registrada: ${empresa.razon_social || 'Sin nombre'}`
      })
    } else {
      return NextResponse.json({
        existe: false
      })
    }

  } catch (error) {
    console.error('Error en verificación de RUC:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
