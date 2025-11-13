import { NextRequest, NextResponse } from 'next/server'

// Llamada directa a la API - sin fetch interno
export async function GET() {
  try {
    const token = process.env.RENIEC_API_TOKEN
    if (!token) {
      throw new Error('RENIEC_API_TOKEN no configurado')
    }
    
    console.log('🔄 Obteniendo departamentos directamente desde consultasperu.com...')
    console.log('🔑 Token length:', token.length)
    
    // Consultar 1 RUC para obtener ubicaciones
    const response = await fetch('https://api.consultasperu.com/api/v1/query/ruc-anexos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        ruc: '20100070970' // Supermercados Peruanos
      })
    })

    console.log(`📡 Response status: ${response.status}`)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const result = await response.json()
    console.log('📊 API Result:', result.success, result.data?.length || 0, 'establecimientos')

    // Extraer departamentos únicos
    const departamentos = new Set<string>()
    
    if (result.success && result.data && Array.isArray(result.data)) {
      result.data.forEach((establecimiento: any) => {
        if (establecimiento.departamento) {
          departamentos.add(establecimiento.departamento.toUpperCase().trim())
          console.log(`📍 Departamento encontrado: ${establecimiento.departamento}`)
        }
      })
    }

    const departamentosArray = Array.from(departamentos).sort()
    console.log(`🎉 Departamentos finales: ${departamentosArray.length}`, departamentosArray)

    return NextResponse.json({
      success: true,
      data: departamentosArray,
      source: 'API consultasperu.com directo',
      total: departamentosArray.length
    })

  } catch (error) {
    console.error('❌ Error obteniendo departamentos:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        message: 'Error consultando API de ubicaciones' 
      },
      { status: 500 }
    )
  }
}
