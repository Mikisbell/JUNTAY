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
    
    // Usar el MISMO endpoint que DNI/RUC - sabemos que funciona
    const response = await fetch('https://api.consultasperu.com/api/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        type_document: 'ruc',
        document_number: '20100070970' // Supermercados Peruanos
      })
    })

    console.log(`📡 Response status: ${response.status}`)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const result = await response.json()
    console.log('📊 API Result:', result.success, result.data?.length || 0, 'establecimientos')

    // Extraer departamento del RUC consultado
    const departamentos = new Set<string>()
    
    if (result.success && result.data) {
      const data = result.data
      if (data.department) {
        departamentos.add(data.department.toUpperCase().trim())
        console.log(`📍 Departamento encontrado: ${data.department}`)
        console.log(`📍 Provincia encontrada: ${data.province}`)
        console.log(`📍 Distrito encontrado: ${data.district}`)
      }
      
      // Agregar más departamentos consultando otros RUCs conocidos
      const otrosRucs = ['20131312955', '20100047218'] // Saga Falabella, BCP
      
      for (const ruc of otrosRucs) {
        try {
          const respuesta = await fetch('https://api.consultasperu.com/api/v1/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, type_document: 'ruc', document_number: ruc })
          })
          
          if (respuesta.ok) {
            const resultado = await respuesta.json()
            if (resultado.success && resultado.data?.department) {
              departamentos.add(resultado.data.department.toUpperCase().trim())
              console.log(`📍 Departamento adicional: ${resultado.data.department}`)
            }
          }
        } catch (e) {
          console.log(`❌ Error con RUC ${ruc}:`, e)
        }
      }
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
