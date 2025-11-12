import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { dni } = await request.json()

    if (!dni) {
      return NextResponse.json(
        { existe: false, error: 'DNI requerido' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Buscar cliente existente con este DNI
    const { data: clienteExistente, error } = await supabase
      .from('clientes')
      .select('id, nombres, apellido_paterno, apellido_materno, numero_documento')
      .eq('numero_documento', dni)
      .eq('tipo_documento', 'dni')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error verificando DNI:', error)
      return NextResponse.json(
        { existe: false, error: 'Error al verificar DNI' },
        { status: 500 }
      )
    }

    if (clienteExistente) {
      const nombreCompleto = `${clienteExistente.nombres} ${clienteExistente.apellido_paterno} ${clienteExistente.apellido_materno || ''}`.trim()
      
      return NextResponse.json({
        existe: true,
        cliente_id: clienteExistente.id,
        nombre_completo: nombreCompleto,
        mensaje: `Cliente ya registrado: ${nombreCompleto}`
      })
    } else {
      return NextResponse.json({
        existe: false,
        mensaje: 'DNI no registrado en el sistema'
      })
    }

  } catch (error) {
    console.error('Error en verificación DNI:', error)
    return NextResponse.json(
      { existe: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
