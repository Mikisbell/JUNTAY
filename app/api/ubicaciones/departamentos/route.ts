import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🇵🇪 Retornando TODOS los 25 departamentos oficiales del Perú...')

    // TODOS los 25 departamentos oficiales del Perú - para libre elección
    const departamentosOficiales = [
      'AMAZONAS',
      'ANCASH', 
      'APURIMAC',
      'AREQUIPA',
      'AYACUCHO',
      'CAJAMARCA',
      'CALLAO',
      'CUSCO',
      'HUANCAVELICA',
      'HUANUCO',
      'ICA',
      'JUNIN',
      'LA LIBERTAD',
      'LAMBAYEQUE', 
      'LIMA',
      'LORETO',
      'MADRE DE DIOS',
      'MOQUEGUA',
      'PASCO',
      'PIURA',
      'PUNO',
      'SAN MARTIN',
      'TACNA',
      'TUMBES',
      'UCAYALI'
    ]

    console.log(`✅ ${departamentosOficiales.length} departamentos disponibles para selección`)

    return NextResponse.json({
      success: true,
      data: departamentosOficiales,
      total: departamentosOficiales.length,
      source: 'Departamentos oficiales del Perú'
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
