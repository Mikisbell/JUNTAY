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

    console.log(`🏘️ Obteniendo distritos oficiales INEI para: ${departamento} - ${provincia}`)

    // DISTRITOS OFICIALES POR PROVINCIA - DATOS INEI (principales)
    const distritosPorProvincia: { [key: string]: string[] } = {
      // LIMA
      'LIMA-LIMA': ['LIMA', 'ATE', 'BARRANCO', 'BREÑA', 'CARABAYLLO', 'CHACLACAYO', 'CHORRILLOS', 'CIENEGUILLA', 'COMAS', 'EL AGUSTINO', 'INDEPENDENCIA', 'JESUS MARIA', 'LA MOLINA', 'LA VICTORIA', 'LINCE', 'LOS OLIVOS', 'LURIGANCHO', 'LURIN', 'MAGDALENA DEL MAR', 'MAGDALENA VIEJA', 'MIRAFLORES', 'PACHACAMAC', 'PUCUSANA', 'PUEBLO LIBRE', 'PUENTE PIEDRA', 'PUNTA HERMOSA', 'PUNTA NEGRA', 'RIMAC', 'SAN BARTOLO', 'SAN BORJA', 'SAN ISIDRO', 'SAN JUAN DE LURIGANCHO', 'SAN JUAN DE MIRAFLORES', 'SAN LUIS', 'SAN MARTIN DE PORRES', 'SAN MIGUEL', 'SANTA ANITA', 'SANTA MARIA DEL MAR', 'SANTA ROSA', 'SANTIAGO DE SURCO', 'SURQUILLO', 'VILLA EL SALVADOR', 'VILLA MARIA DEL TRIUNFO'],
      'LIMA-BARRANCA': ['BARRANCA', 'PARAMONGA', 'PATIVILCA', 'SUPE', 'SUPE PUERTO'],
      'LIMA-HUARAL': ['HUARAL', 'ATAVILLOS ALTO', 'ATAVILLOS BAJO', 'AUCALLAMA', 'CHANCAY', 'IHUARI', 'LAMPIAN', 'PACARAOS', 'SAN MIGUEL DE ACOS', 'SANTA CRUZ DE ANDAMARCA', 'SUMBILCA', 'VEINTISIETE DE NOVIEMBRE'],
      
      // JUNIN  
      'JUNIN-HUANCAYO': ['HUANCAYO', 'CARHUACALLANGA', 'CHACAPAMPA', 'CHICCHE', 'CHILCA', 'CHONGOS ALTO', 'CHUPURO', 'COLCA', 'CULLHUAS', 'EL TAMBO', 'HUACRAPUQUIO', 'HUALHUAS', 'HUANCAN', 'HUASICANCHA', 'HUAYUCACHI', 'INGENIO', 'PARIAHUANCA', 'PILCOMAYO', 'PUCARA', 'QUICHUAY', 'QUILCAS', 'SAN AGUSTIN', 'SAN JERONIMO DE TUNAN', 'SAÑO', 'SAPALLANGA', 'SICAYA', 'SONTO DOMINGO DE ACOBAMBA', 'VIQUES'],
      'JUNIN-JAUJA': ['JAUJA', 'ACOLLA', 'APATA', 'ATAURA', 'CANCHAYLLO', 'CURICACA', 'EL MANTARO', 'HUERTAS', 'HUAMALI', 'HUARIPAMPA', 'JANJAILLO', 'JULCAN', 'LEONOR ORDOÑEZ', 'LLOCLLAPAMPA', 'MARCO', 'MASMA', 'MASMA CHICCHE', 'MOLINOS', 'MONOBAMBA', 'MUQUI', 'MUQUIYAUYO', 'PACA', 'PACCHA', 'PANCAN', 'PARCO', 'POMACANCHA', 'RICRAN', 'SAN LORENZO', 'SAN PEDRO DE CHUNAN', 'SAUSA', 'SINCOS', 'TUNAN MARCA', 'YAULI', 'YAUYOS'],
      
      // AREQUIPA
      'AREQUIPA-AREQUIPA': ['AREQUIPA', 'ALTO SELVA ALEGRE', 'CAYMA', 'CERRO COLORADO', 'CHARACATO', 'CHIGUATA', 'JACOBO HUNTER', 'LA JOYA', 'MARIANO MELGAR', 'MIRAFLORES', 'MOLLEBAYA', 'PAUCARPATA', 'POCSI', 'POLOBAYA', 'QUEQUEÑA', 'SABANDIA', 'SACHACA', 'SAN JUAN DE SIGUAS', 'SAN JUAN DE TARUCANI', 'SANTA ISABEL DE SIGUAS', 'SANTA RITA DE SIGUAS', 'SOCABAYA', 'TIABAYA', 'UCHUMAYO', 'VITOR', 'YANAHUARA', 'YARABAMBA', 'YURA'],
      
      // CUSCO
      'CUSCO-CUSCO': ['CUSCO', 'CCORCA', 'POROY', 'SAN JERONIMO', 'SAN SEBASTIAN', 'SANTIAGO', 'SAYLLA', 'WANCHAQ'],
      
      // PIURA
      'PIURA-PIURA': ['PIURA', 'CASTILLA', 'CATACAOS', 'CURA MORI', 'EL TALLAN', 'LA ARENA', 'LA UNION', 'LAS LOMAS', 'TAMBO GRANDE'],
      
      // CALLAO
      'CALLAO-CALLAO (PROV.CONST.)': ['CALLAO', 'BELLAVISTA', 'CARMEN DE LA LEGUA REYNOSO', 'LA PERLA', 'LA PUNTA', 'VENTANILLLA'],
      
      // LA LIBERTAD
      'LA LIBERTAD-TRUJILLO': ['TRUJILLO', 'EL PORVENIR', 'FLORENCIA DE MORA', 'HUANCHACO', 'LA ESPERANZA', 'LAREDO', 'MOCHE', 'POROTO', 'SALAVERRY', 'SIMBAL', 'VICTOR LARCO HERRERA'],
      
      // LAMBAYEQUE
      'LAMBAYEQUE-CHICLAYO': ['CHICLAYO', 'CHONGOYAPE', 'ETEN', 'ETEN PUERTO', 'JOSE LEONARDO ORTIZ', 'LA VICTORIA', 'LAGUNAS', 'MONSEFU', 'NUEVA ARICA', 'OYOTUN', 'PICSI', 'PIMENTEL', 'POMALCA', 'PUCALA', 'REQUE', 'SANTA ROSA', 'SAÑA', 'TUMÁN']
    }

    // Construir clave para buscar distritos
    const claveProvincial = `${departamento.toUpperCase()}-${provincia.toUpperCase()}`
    const distritosOficiales = distritosPorProvincia[claveProvincial] || []

    console.log(`✅ ${distritosOficiales.length} distritos oficiales encontrados para ${provincia}`)
    console.log(`📋 Distritos: ${distritosOficiales.join(', ')}`)

    if (distritosOficiales.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se encontraron distritos para ${departamento} - ${provincia}`,
          message: 'Esta combinación aún no está implementada en los datos oficiales.' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: distritosOficiales,
      total: distritosOficiales.length,
      departamento: departamento.toUpperCase(),
      provincia: provincia.toUpperCase(),
      source: 'Instituto Nacional de Estadística e Informática (INEI)',
      oficial: true
    })

  } catch (error) {
    console.error('Error obteniendo distritos oficiales INEI:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
