import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Usar el endpoint que obtiene ubicaciones reales desde la API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ubicaciones/obtener-ubicaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'departamentos'
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
      throw new Error(result.error || 'Error obteniendo departamentos desde API')
    }
  } catch (error) {
    console.error('Error obteniendo departamentos desde API:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error obteniendo departamentos desde API consultasperu.com',
        message: 'No se pudieron cargar los departamentos. Intente nuevamente.' 
      },
      { status: 500 }
    )
  }
}
