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

    // Usar el endpoint que obtiene ubicaciones reales desde la API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ubicaciones/obtener-desde-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'distritos',
        departamento: departamento,
        provincia: provincia
      })
    })

    const result = await response.json()

    if (result.success && result.data.length > 0) {
      return NextResponse.json({
        success: true,
        data: result.data,
        source: 'API consultasperu.com'
      })
    }

    // Fallback a datos base si la API no tiene datos
    const distritosPorProvincia: Record<string, string[]> = {
      'LIMA-LIMA': [
        'LIMA', 'ANCON', 'ATE', 'BARRANCO', 'BREÑA', 'CARABAYLLO', 'CHACLACAYO',
        'CHORRILLOS', 'CIENEGUILLA', 'COMAS', 'EL AGUSTINO', 'INDEPENDENCIA',
        'JESUS MARIA', 'LA MOLINA', 'LA VICTORIA', 'LINCE', 'LOS OLIVOS',
        'LURIGANCHO', 'LURIN', 'MAGDALENA DEL MAR', 'MIRAFLORES', 'PACHACAMAC',
        'PUCUSANA', 'PUEBLO LIBRE', 'PUENTE PIEDRA', 'PUNTA HERMOSA', 'PUNTA NEGRA',
        'RIMAC', 'SAN BARTOLO', 'SAN BORJA', 'SAN ISIDRO', 'SAN JUAN DE LURIGANCHO',
        'SAN JUAN DE MIRAFLORES', 'SAN LUIS', 'SAN MARTIN DE PORRES', 'SAN MIGUEL',
        'SANTA ANITA', 'SANTA MARIA DEL MAR', 'SANTA ROSA', 'SANTIAGO DE SURCO',
        'SURQUILLO', 'VILLA EL SALVADOR', 'VILLA MARIA DEL TRIUNFO'
      ],
      'JUNIN-HUANCAYO': [
        'HUANCAYO', 'CARHUACALLANGA', 'CHACAPAMPA', 'CHICCHE', 'CHILCA',
        'CHONGOS ALTO', 'CHUPURO', 'COLCA', 'CULLHUAS', 'EL TAMBO',
        'HUACRAPUQUIO', 'HUALHUAS', 'HUANCAN', 'HUAYUCACHI', 'INGENIO',
        'PARIAHUANCA', 'PILCOMAYO', 'PUCARA', 'QUICHUAY', 'QUILCAS',
        'SAN AGUSTIN', 'SAN JERONIMO DE TUNAN', 'SAÑO', 'SAPALLANGA',
        'SICAYA', 'SANTO DOMINGO DE ACOBAMBA', 'VIQUES', 'HUACHAC'
      ],
      'CALLAO-CALLAO': ['CALLAO', 'BELLAVISTA', 'CARMEN DE LA LEGUA REYNOSO', 'LA PERLA', 'LA PUNTA', 'VENTANILLA'],
      'AREQUIPA-AREQUIPA': [
        'AREQUIPA', 'ALTO SELVA ALEGRE', 'CAYMA', 'CERRO COLORADO', 'CHARACATO', 
        'CHIGUATA', 'JACOBO HUNTER', 'LA JOYA', 'MARIANO MELGAR', 'MIRAFLORES', 
        'MOLLEBAYA', 'PAUCARPATA', 'POCSI', 'POLOBAYA', 'QUEQUEÑA', 'SABANDIA', 
        'SACHACA', 'SAN JUAN DE SIGUAS', 'SAN JUAN DE TARUCANI', 'SANTA ISABEL DE SIGUAS', 
        'SANTA RITA DE SIGUAS', 'SOCABAYA', 'TIABAYA', 'UCHUMAYO', 'VITOR', 
        'YANAHUARA', 'YARABAMBA', 'YURA', 'JOSE LUIS BUSTAMANTE Y RIVERO'
      ],
      'CUSCO-CUSCO': ['CUSCO', 'CCORCA', 'POROY', 'SAN JERONIMO', 'SAN SEBASTIAN', 'SANTIAGO', 'SAYLLA', 'WANCHAQ'],
      'PIURA-PIURA': ['PIURA', 'CASTILLA', 'CATACAOS', 'CURA MORI', 'EL TALLAN', 'LA ARENA', 'LA UNION', 'LAS LOMAS', 'TAMBO GRANDE'],
      'LA LIBERTAD-TRUJILLO': ['TRUJILLO', 'EL PORVENIR', 'FLORENCIA DE MORA', 'HUANCHACO', 'LA ESPERANZA', 'LAREDO', 'MOCHE', 'POROTO', 'SALAVERRY', 'SIMBAL', 'VICTOR LARCO HERRERA'],
      'LAMBAYEQUE-CHICLAYO': ['CHICLAYO', 'CHONGOYAPE', 'ETEN', 'ETEN PUERTO', 'JOSE LEONARDO ORTIZ', 'LA VICTORIA', 'LAGUNAS', 'MONSEFU', 'NUEVA ARICA', 'OYOTUN', 'PICSI', 'PIMENTEL', 'REQUE', 'SANTA ROSA', 'SAÑA', 'CAYALTI', 'PATAPO', 'POMALCA', 'PUCALA', 'TUMAN'],
      'ICA-ICA': ['ICA', 'LA TINGUIÑA', 'LOS AQUIJES', 'OCUCAJE', 'PACHACUTEC', 'PARCONA', 'PUEBLO NUEVO', 'SALAS', 'SAN JOSE DE LOS MOLINOS', 'SAN JUAN BAUTISTA', 'SANTIAGO', 'SUBTANJALLA', 'TATE', 'YAUCA DEL ROSARIO'],
      'PUNO-PUNO': ['PUNO', 'ACORA', 'AMANTANI', 'ATUNCOLLA', 'CAPACHICA', 'CHUCUITO', 'COATA', 'HUATA', 'MAÑAZO', 'PAUCARCOLLA', 'PICHACANI', 'PLATERIA', 'SAN ANTONIO', 'TIQUILLACA', 'VILQUE'],
      'TACNA-TACNA': ['TACNA', 'ALTO DE LA ALIANZA', 'CALANA', 'CIUDAD NUEVA', 'INCLAN', 'PACHIA', 'PALCA', 'POCOLLAY', 'SAMA', 'CORONEL GREGORIO ALBARRACIN LANCHIPA'],
      'TACNA-CANDARAVE': ['CANDARAVE', 'CAIRANI', 'CAMILACA', 'CURIBAYA', 'HUANUARA', 'QUILAHUANI'],
      'TACNA-JORGE BASADRE': ['LOCUMBA', 'ILABAYA', 'ITE'],
      'TACNA-TARATA': ['TARATA', 'CHUCATAMANI', 'ESTIQUE', 'ESTIQUE-PAMPA', 'SITAJARA', 'SUSAPAYA', 'TARUCACHI', 'TICACO']
    }

    const clave = `${departamento.toUpperCase()}-${provincia.toUpperCase()}`
    const distritos = distritosPorProvincia[clave] || []

    return NextResponse.json({
      success: true,
      data: distritos.sort(),
      source: 'fallback'
    })

  } catch (error) {
    console.error('Error obteniendo distritos:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
