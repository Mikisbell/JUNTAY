import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🇵🇪 División territorial oficial según INEI...')

    // DIVISIÓN TERRITORIAL OFICIAL DEL PERÚ - INEI
    // 24 departamentos + 1 Provincia Constitucional del Callao
    // Total: 196 provincias y 1,874 distritos
    
    const departamentosOficiales = [
      'AMAZONAS',
      'ANCASH', 
      'APURIMAC',
      'AREQUIPA',
      'AYACUCHO',
      'CAJAMARCA',
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

    // Provincia Constitucional del Callao (tratamiento administrativo especial)
    const provinciaConstitucional = ['CALLAO']
    
    // Combinar departamentos + Provincia Constitucional para selección
    const todasLasUbicaciones = [...departamentosOficiales, ...provinciaConstitucional]

    console.log(`✅ 24 departamentos + 1 Provincia Constitucional = ${todasLasUbicaciones.length} ubicaciones`)
    console.log(`📊 Total según INEI: 196 provincias y 1,874 distritos`)

    return NextResponse.json({
      success: true,
      data: todasLasUbicaciones,
      total: todasLasUbicaciones.length,
      departamentos: departamentosOficiales.length,
      provincia_constitucional: provinciaConstitucional.length,
      source: 'División territorial oficial INEI',
      info: '24 departamentos + Provincia Constitucional del Callao'
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
