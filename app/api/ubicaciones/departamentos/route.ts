import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const token = process.env.RENIEC_API_TOKEN
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token no configurado' },
        { status: 500 }
      )
    }

    console.log('🔄 Consultando múltiples RUCs para departamentos...')

    // Lista de RUCs de empresas grandes en diferentes departamentos
    const rucsEmpresasGrandes = [
      '20100070970', // Supermercados Peruanos - Lima
      '20131312955', // Saga Falabella - Lima/Nacional
      '20100047218', // Banco de Crédito BCP - Nacional  
      '20325117835', // Corporación Lindley - Lima
      '20159473148', // Plaza Vea - Nacional
      '20546618671', // Ripley Peru - Nacional
      '20100255771', // Telefónica del Perú - Lima
      '20131380021', // Cineplanet - Nacional
      '20100017491', // Cervecería San Juan - Nacional
      '20100128056'  // Tiendas EFE - Nacional
    ]

    const departamentos = new Set<string>()

    // Consultar cada RUC para obtener su ubicación
    for (const ruc of rucsEmpresasGrandes) {
      try {
        const response = await fetch('https://api.consultasperu.com/api/v1/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            type_document: 'ruc',
            document_number: ruc
          })
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data?.department) {
            const dept = result.data.department.toUpperCase().trim()
            departamentos.add(dept)
            console.log(`📍 ${ruc}: ${dept}`)
          }
        }
      } catch (error) {
        console.log(`❌ Error RUC ${ruc}:`, error)
        continue
      }
    }

    const departamentosArray = Array.from(departamentos).sort()
    console.log(`🎉 Total departamentos encontrados: ${departamentosArray.length}`)

    return NextResponse.json({
      success: true,
      data: departamentosArray,
      total: departamentosArray.length,
      source: 'API consultasperu.com'
    })

  } catch (error) {
    console.error('Error obteniendo departamentos:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}
