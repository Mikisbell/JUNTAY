import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    console.log('🏛️ Consultando departamentos desde Supabase (ULTRA RÁPIDO)')

    // Query optimizada con Supabase - INSTANTÁNEA
    const { data: departamentos, error } = await supabase
      .from('departamentos')
      .select('id, codigo, nombre, nombre_completo')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) {
      console.error('❌ Error Supabase:', error)
      return NextResponse.json(
        { success: false, error: 'Error consultando base de datos' },
        { status: 500 }
      )
    }

    console.log(`✅ ${departamentos?.length || 0} departamentos obtenidos INSTANTÁNEAMENTE`)

    return NextResponse.json({
      success: true,
      data: departamentos || [],
      total: departamentos?.length || 0,
      source: 'Supabase - Base de Datos Local',
      performance: 'ULTRA RÁPIDO - Sin dependencias externas',
      cache: 'Supabase automático'
    })

  } catch (error) {
    console.error('❌ Error obteniendo departamentos:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint adicional para obtener departamento específico
export async function POST(request: NextRequest) {
  try {
    const { codigo, nombre } = await request.json()

    let query = supabase
      .from('departamentos')
      .select('*')
      .eq('activo', true)

    if (codigo) {
      query = query.eq('codigo', codigo)
    } else if (nombre) {
      query = query.ilike('nombre', `%${nombre}%`)
    }

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
      total: data?.length || 0
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
