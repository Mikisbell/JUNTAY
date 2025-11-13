import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departamento = searchParams.get('departamento')
    const provincia = searchParams.get('provincia')

    if (!departamento || !provincia) {
      return NextResponse.json(
        { success: false, error: 'Departamento y provincia requeridos' },
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

    console.log(`🏘️ Buscando distritos para: ${departamento} - ${provincia}`)

    // RUCs de empresas con presencia nacional
    const rucsNacionales = [
      '20100070970', // Supermercados Peruanos
      '20131312955', // Saga Falabella  
      '20100047218', // Banco de Crédito BCP
      '20159473148', // Plaza Vea
      '20546618671'  // Ripley Peru
    ]

    const distritos = new Set<string>()

    // Buscar distritos en establecimientos anexos
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
              const { departamento: dept, provincia: prov, distrito } = establecimiento
              
              if (dept && prov && distrito && 
                  dept.toUpperCase().trim() === departamento.toUpperCase() &&
                  prov.toUpperCase().trim() === provincia.toUpperCase()) {
                distritos.add(distrito.toUpperCase().trim())
                console.log(`📍 Distrito encontrado: ${distrito}`)
              }
            })
          }
        }
      } catch (error) {
        console.log(`❌ Error con RUC ${ruc}:`, error)
        continue
      }
    }

    const distritosArray = Array.from(distritos).sort()
    console.log(`✅ ${distritosArray.length} distritos encontrados para ${departamento} - ${provincia}`)

    if (distritosArray.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se encontraron distritos para ${departamento} - ${provincia}`,
          message: 'Esta provincia podría no tener establecimientos registrados en la API.' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: distritosArray,
      total: distritosArray.length,
      source: 'API ESTABLECIMIENTOS ANEXOS'
    })

  } catch (error) {
    console.error('Error obteniendo distritos:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
