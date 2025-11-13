import { NextRequest, NextResponse } from 'next/server'

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

    // Usar el endpoint que obtiene ubicaciones reales desde la API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ubicaciones/obtener-desde-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'provincias',
        departamento: departamento
      })
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        source: 'API consultasperu.com'
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se encontraron provincias para ${departamento} en API consultasperu.com`,
          message: 'Este departamento podría no tener establecimientos registrados en la API.' 
        },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Error obteniendo provincias:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
