import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departamento = searchParams.get('departamento')
    const departamento_id = searchParams.get('departamento_id')

    if (!departamento && !departamento_id) {
      return NextResponse.json(
        { success: false, error: 'Departamento o departamento_id requerido' },
        { status: 400 }
      )
    }

    console.log(`🏛️ Consultando provincias Supabase para: ${departamento || departamento_id}`)

    let query = supabase
      .from('provincias')
      .select(`
        id,
        codigo,
        nombre,
        nombre_completo,
        departamentos (
          id,
          codigo,
          nombre
        )
      `)
      .eq('activo', true)

    // Buscar por ID del departamento (más rápido)
    if (departamento_id) {
      query = query.eq('departamento_id', parseInt(departamento_id))
    } 
    // Buscar por nombre del departamento
    else if (departamento) {
      // Primero buscar el ID del departamento
      const { data: deptData, error: deptError } = await supabase
        .from('departamentos')
        .select('id')
        .ilike('nombre', departamento.trim())
        .eq('activo', true)
        .single()

      if (deptError || !deptData) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Departamento "${departamento}" no encontrado`,
            suggestion: 'Verificar el nombre del departamento'
          },
          { status: 404 }
        )
      }

      query = query.eq('departamento_id', deptData.id)
    }

    query = query.order('nombre', { ascending: true })

    const { data: provincias, error } = await query

    if (error) {
      console.error('❌ Error Supabase:', error)
      return NextResponse.json(
        { success: false, error: 'Error consultando base de datos' },
        { status: 500 }
      )
    }

    console.log(`✅ ${provincias?.length || 0} provincias obtenidas INSTANTÁNEAMENTE`)

    // Formatear respuesta para compatibilidad
    const provinciasFormateadas = provincias?.map((p: any) => ({
      id: p.id,
      codigo: p.codigo,
      nombre: p.nombre,
      nombre_completo: p.nombre_completo,
      departamento: p.departamentos?.nombre
    })) || []

    return NextResponse.json({
      success: true,
      data: provinciasFormateadas,
      total: provinciasFormateadas.length,
      departamento: departamento || departamento_id,
      source: 'Supabase - Base de Datos Local',
      performance: 'ULTRA RÁPIDO - Query SQL optimizada',
      query_time: 'Instantánea'
    })

  } catch (error) {
    console.error('❌ Error obteniendo provincias:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para búsqueda avanzada de provincias
export async function POST(request: NextRequest) {
  try {
    const { search, departamento_id, limit = 50 } = await request.json()

    let query = supabase
      .from('provincias')
      .select(`
        id,
        codigo, 
        nombre,
        nombre_completo,
        departamentos (
          id,
          nombre
        )
      `)
      .eq('activo', true)

    if (departamento_id) {
      query = query.eq('departamento_id', departamento_id)
    }

    if (search) {
      query = query.ilike('nombre', `%${search}%`)
    }

    query = query
      .order('nombre', { ascending: true })
      .limit(limit)

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: data?.length || 0,
      search_term: search
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
