import { NextRequest, NextResponse } from 'next/server'
import { obtenerProvinciasPorDepartamento, existeDepartamento } from '@/lib/data/ubicaciones-inei-estructura'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departamento = searchParams.get('departamento')

    if (!departamento) {
      return NextResponse.json(
        { success: false, error: 'Departamento requerido' },
        { status: 400 }
      )
    }

    console.log(`🏙️ Obteniendo provincias oficiales INEI para: ${departamento}`)

    // Verificar si el departamento existe en los datos oficiales INEI
    if (!existeDepartamento(departamento)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Departamento '${departamento}' no encontrado en datos oficiales INEI`,
          message: 'Verificar el nombre del departamento' 
        },
        { status: 404 }
      )
    }

    // Obtener provincias oficiales del departamento
    const provinciasOficiales = obtenerProvinciasPorDepartamento(departamento)
    
    console.log(`✅ ${provinciasOficiales.length} provincias oficiales encontradas para ${departamento}`)
    console.log(`📋 Provincias: ${provinciasOficiales.join(', ')}`)

    return NextResponse.json({
      success: true,
      data: provinciasOficiales,
      total: provinciasOficiales.length,
      departamento: departamento.toUpperCase(),
      source: 'Instituto Nacional de Estadística e Informática (INEI)',
      oficial: true,
      url_fuente: 'https://proyectos.inei.gob.pe/web/biblioineipub/bancopub/Est/Lib0361/anexo.htm'
    })

  } catch (error) {
    console.error('Error obteniendo provincias oficiales INEI:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
