import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const token = '6d189ad58ba715e8198161a3cce4f26290a0d795fe8a72fae046801764a6d6d8'
    const rucTest = '20100070970' // Supermercados Peruanos

    console.log('🧪 TEST: Consultando RUC-ANEXOS directamente...')

    const response = await fetch('https://api.consultasperu.com/api/v1/query/ruc-anexos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        ruc: rucTest
      })
    })

    console.log(`🧪 Response status: ${response.status}`)
    console.log(`🧪 Response ok: ${response.ok}`)

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}`,
        message: 'Error en la respuesta HTTP'
      })
    }

    const result = await response.json()
    
    console.log('🧪 Result:', JSON.stringify(result, null, 2))

    // Extraer ubicaciones si existen
    let ubicaciones = []
    if (result.success && result.data && Array.isArray(result.data)) {
      ubicaciones = result.data.map((item: any) => ({
        departamento: item.departamento,
        provincia: item.provincia,
        distrito: item.distrito,
        direccion: item.direccion
      }))
    }

    return NextResponse.json({
      success: true,
      test: 'RUC-ANEXOS API Test',
      ruc: rucTest,
      apiResponse: result,
      ubicacionesEncontradas: ubicaciones,
      totalUbicaciones: ubicaciones.length
    })

  } catch (error) {
    console.error('🧪 ERROR en test:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Error en el test de API'
    }, { status: 500 })
  }
}
