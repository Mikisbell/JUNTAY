import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Por ahora retornamos los departamentos base
    // Cuando consultasperu.com tenga endpoint de ubicaciones, lo cambiaremos
    const departamentos = [
      'AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA',
      'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN',
      'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS',
      'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA',
      'TUMBES', 'UCAYALI'
    ]

    return NextResponse.json({
      success: true,
      data: departamentos.sort()
    })
  } catch (error) {
    console.error('Error obteniendo departamentos:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
