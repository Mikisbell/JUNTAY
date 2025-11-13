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

    // Usar la misma API de consultasperu.com
    const token = process.env.RENIEC_API_TOKEN
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token no configurado' },
        { status: 500 }
      )
    }

    // Por ahora usamos datos base, pero la estructura está lista para la API real
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
      'HUANUCO': ['HUANUCO', 'AMBO', 'DOS DE MAYO', 'HUACAYBAMBA', 'HUAMALIES', 'LEONCIO PRADO', 'MARAÑON', 'PACHITEA', 'PUERTO INCA', 'LAURICOCHA', 'YAROWILCA']
    }

    const provincias = provinciasPorDepartamento[departamento.toUpperCase()] || []

    return NextResponse.json({
      success: true,
      data: provincias.sort()
    })

  } catch (error) {
    console.error('Error obteniendo provincias:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
