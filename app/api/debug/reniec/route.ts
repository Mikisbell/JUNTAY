import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { dni } = await request.json()
    const token = process.env.RENIEC_API_TOKEN

    if (!token) {
      return NextResponse.json({ error: 'Token no configurado' }, { status: 500 })
    }

    console.log('🔍 DEBUG: Consultando DNI:', dni)

    const response = await fetch('https://api.consultasperu.com/api/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        type_document: 'dni',
        document_number: dni
      })
    })

    const result = await response.json()
    
    console.log('🔍 DEBUG: Respuesta completa de la API:', JSON.stringify(result, null, 2))

    return NextResponse.json({
      rawResponse: result,
      hasDateOfBirth: !!result?.data?.date_of_birth,
      dateOfBirth: result?.data?.date_of_birth || null
    })

  } catch (error) {
    console.error('Error en debug:', error)
    return NextResponse.json({ error: 'Error en debug' }, { status: 500 })
  }
}
