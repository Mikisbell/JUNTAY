import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Usar el endpoint que obtiene ubicaciones reales desde la API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ubicaciones/obtener-desde-api`, {
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
    console.error('Error obteniendo departamentos:', error)
    
    // Fallback a departamentos base si la API falla
    const departamentosFallback = [
      'AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA',
      'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN',
      'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS',
      'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA',
      'TUMBES', 'UCAYALI'
    ]

    return NextResponse.json({
      success: true,
      data: departamentosFallback.sort(),
      source: 'fallback'
    })
  }
}
