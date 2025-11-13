import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provincia = searchParams.get('provincia')
    const provincia_id = searchParams.get('provincia_id')
    const departamento = searchParams.get('departamento')

    if (!provincia && !provincia_id) {
      return NextResponse.json(
        { success: false, error: 'Provincia o provincia_id requerido' },
        { status: 400 }
      )
    }

    console.log(`🏘️ Consultando distritos Supabase para: ${provincia || provincia_id}`)

    let query = supabase
      .from('distritos')
      .select(`
        id,
        codigo,
        nombre,
        nombre_completo,
        provincias (
          id,
          codigo,
          nombre,
          departamentos (
            id,
            nombre
          )
        )
      `)
      .eq('activo', true)

    // Buscar por ID de provincia (más rápido)
    if (provincia_id) {
      query = query.eq('provincia_id', parseInt(provincia_id))
    }
    // Buscar por nombre de provincia
    else if (provincia) {
      // Construir query para buscar provincia
      let provinciaQuery = supabase
        .from('provincias')
        .select('id')
        .ilike('nombre', provincia.trim())
        .eq('activo', true)

      // Si también se proporciona departamento, filtrar por él
      if (departamento) {
        const { data: deptData } = await supabase
          .from('departamentos')
          .select('id')
          .ilike('nombre', departamento.trim())
          .eq('activo', true)
          .single()

        if (deptData) {
          provinciaQuery = provinciaQuery.eq('departamento_id', deptData.id)
        }
      }

      const { data: provData, error: provError } = await provinciaQuery.single()

      if (provError || !provData) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Provincia "${provincia}" no encontrada${departamento ? ` en ${departamento}` : ''}`,
            suggestion: 'Verificar el nombre de la provincia y departamento'
          },
          { status: 404 }
        )
      }

      query = query.eq('provincia_id', provData.id)
    }

    query = query.order('nombre', { ascending: true })

    const { data: distritos, error } = await query

    if (error) {
      console.error('❌ Error Supabase:', error)
      return NextResponse.json(
        { success: false, error: 'Error consultando base de datos' },
        { status: 500 }
      )
    }

    console.log(`✅ ${distritos?.length || 0} distritos obtenidos INSTANTÁNEAMENTE`)

    // Formatear respuesta para compatibilidad
    const distritosFormateados = distritos?.map((d: any) => ({
      id: d.id,
      codigo: d.codigo,
      nombre: d.nombre,
      nombre_completo: d.nombre_completo,
      provincia: d.provincias?.nombre,
      departamento: d.provincias?.departamentos?.nombre
    })) || []

    return NextResponse.json({
      success: true,
      data: distritosFormateados,
      total: distritosFormateados.length,
      provincia: provincia || provincia_id,
      departamento: departamento,
      source: 'Supabase - Base de Datos Local',
      performance: 'ULTRA RÁPIDO - Query SQL con JOINs optimizados',
      query_time: 'Instantánea'
    })

  } catch (error) {
    console.error('❌ Error obteniendo distritos:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para búsqueda avanzada y autocompletado
export async function POST(request: NextRequest) {
  try {
    const { 
      search, 
      provincia_id, 
      departamento_id, 
      limit = 100,
      include_details = false 
    } = await request.json()

    let selectFields = 'id, codigo, nombre'
    
    if (include_details) {
      selectFields = `
        id,
        codigo,
        nombre,
        nombre_completo,
        provincias (
          id,
          nombre,
          departamentos (
            id,
            nombre
          )
        )
      `
    }

    let query = supabase
      .from('distritos')
      .select(selectFields)
      .eq('activo', true)

    if (provincia_id) {
      query = query.eq('provincia_id', provincia_id)
    }

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
      search_term: search,
      performance: 'BÚSQUEDA INSTANTÁNEA'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
