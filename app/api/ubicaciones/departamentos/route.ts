import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🇵🇪 DATOS OFICIALES INEI - Lista completa de 1,812 distritos')

    // 24 DEPARTAMENTOS OFICIALES + CALLAO según INEI
    const departamentosINEI = [
      'AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA',
      'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN', 
      'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS',
      'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA', 
      'TUMBES', 'UCAYALI'
    ]

    console.log(`✅ ${departamentosINEI.length} departamentos oficiales INEI disponibles`)
    console.log(`📋 Fuente: https://proyectos.inei.gob.pe/web/biblioineipub/bancopub/Est/Lib0361/anexo.htm`)

    return NextResponse.json({
      success: true,
      data: departamentosINEI,
      total: departamentosINEI.length,
      source: 'Instituto Nacional de Estadística e Informática (INEI)',
      oficial: true,
      distritos_totales: 1812,
      url_fuente: 'https://proyectos.inei.gob.pe/web/biblioineipub/bancopub/Est/Lib0361/anexo.htm'
    })

  } catch (error) {
    console.error('Error obteniendo departamentos oficiales INEI:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
