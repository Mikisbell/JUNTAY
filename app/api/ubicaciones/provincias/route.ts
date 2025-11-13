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

    const token = process.env.RENIEC_API_TOKEN
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token no configurado' },
        { status: 500 }
      )
    }

    console.log(`🏙️ Buscando provincias para: ${departamento}`)

    // RUCs de empresas con presencia nacional para consultar establecimientos
    const rucsNacionales = [
      '20100070970', // Supermercados Peruanos
      '20131312955', // Saga Falabella  
      '20100047218', // Banco de Crédito BCP
      '20159473148', // Plaza Vea
      '20546618671'  // Ripley Peru
    ]

    const provincias = new Set<string>()

    // Buscar provincias en establecimientos anexos
    for (const ruc of rucsNacionales) {
      try {
        const response = await fetch('https://api.consultasperu.com/api/v1/query/ruc-anexos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            ruc: ruc
          })
        })

        if (response.ok) {
          const result = await response.json()
          
          if (result.success && result.data && Array.isArray(result.data)) {
            result.data.forEach((establecimiento: any) => {
              const { departamento: dept, provincia } = establecimiento
              
              if (dept && provincia && dept.toUpperCase().trim() === departamento.toUpperCase()) {
                provincias.add(provincia.toUpperCase().trim())
                console.log(`📍 Provincia encontrada: ${provincia}`)
              }
            })
          }
        }
      } catch (error) {
        console.log(`❌ Error con RUC ${ruc}:`, error)
        continue
      }
    }

    const provinciasArray = Array.from(provincias).sort()
    console.log(`✅ ${provinciasArray.length} provincias encontradas para ${departamento}`)

    if (provinciasArray.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se encontraron provincias para ${departamento}`,
          message: 'Este departamento podría no tener establecimientos registrados en la API.' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: provinciasArray,
      total: provinciasArray.length,
      source: 'API ESTABLECIMIENTOS ANEXOS'
    })

  } catch (error) {
    console.error('Error obteniendo provincias:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
