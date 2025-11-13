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

    // Usar el endpoint que obtiene ubicaciones reales desde la API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ubicaciones/obtener-desde-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'provincias',
        departamento: departamento
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

    // Fallback a datos base si la API no tiene datos para este departamento
    const provinciasPorDepartamento: Record<string, string[]> = {
      'LIMA': ['LIMA', 'BARRANCA', 'CAJATAMBO', 'CANTA', 'CAÑETE', 'HUARAL', 'HUAROCHIRI', 'HUAURA', 'OYON', 'YAUYOS'],
      'JUNIN': ['HUANCAYO', 'CONCEPCION', 'CHANCHAMAYO', 'JAUJA', 'JUNIN', 'SATIPO', 'TARMA', 'YAULI', 'CHUPACA'],
      'AREQUIPA': ['AREQUIPA', 'CAMANA', 'CARAVELI', 'CASTILLA', 'CAYLLOMA', 'CONDESUYOS', 'ISLAY', 'LA UNION'],
      'CUSCO': ['CUSCO', 'ACOMAYO', 'ANTA', 'CALCA', 'CANAS', 'CANCHIS', 'CHUMBIVILCAS', 'ESPINAR', 'LA CONVENCION', 'PARURO', 'PAUCARTAMBO', 'QUISPICANCHI', 'URUBAMBA'],
      'CALLAO': ['CALLAO'],
      'PIURA': ['PIURA', 'AYABACA', 'HUANCABAMBA', 'MORROPON', 'PAITA', 'SULLANA', 'TALARA', 'SECHURA'],
      'LA LIBERTAD': ['TRUJILLO', 'ASCOPE', 'BOLIVAR', 'CHEPEN', 'JULCAN', 'OTUZCO', 'PACASMAYO', 'PATAZ', 'SANCHEZ CARRION', 'SANTIAGO DE CHUCO', 'GRAN CHIMU', 'VIRU'],
      'LAMBAYEQUE': ['CHICLAYO', 'FERREQAFE', 'LAMBAYEQUE'],
      'ICA': ['ICA', 'CHINCHA', 'NAZCA', 'PALPA', 'PISCO'],
      'PUNO': ['PUNO', 'AZANGARO', 'CARABAYA', 'CHUCUITO', 'EL COLLAO', 'HUANCANE', 'LAMPA', 'MELGAR', 'MOHO', 'SAN ANTONIO DE PUTINA', 'SAN ROMAN', 'SANDIA', 'YUNGUYO'],
      'ANCASH': ['HUARAZ', 'AIJA', 'ANTONIO RAYMONDI', 'ASUNCION', 'BOLOGNESI', 'CARHUAZ', 'CARLOS FERMIN FITZCARRALD', 'CASMA', 'CORONGO', 'HUARI', 'HUARMEY', 'HUAYLAS', 'MARISCAL LUZURIAGA', 'OCROS', 'PALLASCA', 'POMABAMBA', 'RECUAY', 'SANTA', 'SIHUAS', 'YUNGAY'],
      'CAJAMARCA': ['CAJAMARCA', 'CAJABAMBA', 'CELENDIN', 'CHOTA', 'CONTUMAZA', 'CUTERVO', 'HUALGAYOC', 'JAEN', 'SAN IGNACIO', 'SAN MARCOS', 'SAN MIGUEL', 'SAN PABLO', 'SANTA CRUZ'],
      'HUANUCO': ['HUANUCO', 'AMBO', 'DOS DE MAYO', 'HUACAYBAMBA', 'HUAMALIES', 'LEONCIO PRADO', 'MARAÑON', 'PACHITEA', 'PUERTO INCA', 'LAURICOCHA', 'YAROWILCA'],
      'TACNA': ['TACNA', 'CANDARAVE', 'JORGE BASADRE', 'TARATA'],
      'TUMBES': ['TUMBES', 'CONTRALMIRANTE VILLAR', 'ZARUMILLA'],
      'UCAYALI': ['CORONEL PORTILLO', 'ATALAYA', 'PADRE ABAD', 'PURUS'],
      'AMAZONAS': ['CHACHAPOYAS', 'BAGUA', 'BONGARA', 'CONDORCANQUI', 'LUYA', 'RODRIGUEZ DE MENDOZA', 'UTCUBAMBA'],
      'APURIMAC': ['ABANCAY', 'ANDAHUAYLAS', 'ANTABAMBA', 'AYMARAES', 'COTABAMBAS', 'CHINCHEROS', 'GRAU'],
      'AYACUCHO': ['HUAMANGA', 'CANGALLO', 'HUANCA SANCOS', 'HUANTA', 'LA MAR', 'LUCANAS', 'PARINACOCHAS', 'PAUCAR DEL SARA SARA', 'SUCRE', 'VICTOR FAJARDO', 'VILCAS HUAMAN'],
      'HUANCAVELICA': ['HUANCAVELICA', 'ACOBAMBA', 'ANGARAES', 'CASTROVIRREYNA', 'CHURCAMPA', 'HUAYTARA', 'TAYACAJA'],
      'LORETO': ['MAYNAS', 'ALTO AMAZONAS', 'LORETO', 'MARISCAL RAMON CASTILLA', 'REQUENA', 'UCAYALI'],
      'MADRE DE DIOS': ['TAMBOPATA', 'MANU', 'TAHUAMANU'],
      'MOQUEGUA': ['MARISCAL NIETO', 'GENERAL SANCHEZ CERRO', 'ILO'],
      'PASCO': ['PASCO', 'DANIEL ALCIDES CARRION', 'OXAPAMPA'],
      'SAN MARTIN': ['MOYOBAMBA', 'BELLAVISTA', 'EL DORADO', 'HUALLAGA', 'LAMAS', 'MARISCAL CACERES', 'PICOTA', 'RIOJA', 'SAN MARTIN', 'TOCACHE']
    }

    const provincias = provinciasPorDepartamento[departamento.toUpperCase()] || []

    return NextResponse.json({
      success: true,
      data: provincias.sort(),
      source: 'fallback'
    })

  } catch (error) {
    console.error('Error obteniendo provincias:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
