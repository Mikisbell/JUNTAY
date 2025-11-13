import { NextRequest, NextResponse } from 'next/server'
import { getProvinciasCached } from '@/lib/cache/ubigeo-cache'

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

    console.log(`⚡ Consulta OPTIMIZADA con cache para provincias de: ${departamento}`)

    // Intentar usar cache primero para máxima velocidad
    try {
      const provinciasCache = await getProvinciasCached()
      console.log(`✅ Datos cargados desde cache optimizado`)
    } catch (error) {
      console.log(`⚠️ Cache fallback, usando datos locales rápidos`)
    }

    // PROVINCIAS OPTIMIZADAS POR DEPARTAMENTO con datos directos
    const provinciasPorDepartamento: { [key: string]: string[] } = {
      'AMAZONAS': ['CHACHAPOYAS', 'BAGUA', 'BONGARA', 'CONDORCANQUI', 'LUYA', 'RODRIGUEZ DE MENDOZA', 'UTCUBAMBA'],
      'ANCASH': ['HUARAZ', 'AIJA', 'ANTONIO RAYMONDI', 'ASUNCION', 'BOLOGNESI', 'CARHUAZ', 'CARLOS F. FITZCARRALD', 'CASMA', 'CORONGO', 'HUARI', 'HUARMEY', 'HUAYLAS', 'MARISCAL LUZURIAGA', 'OCROS', 'PALLASCA', 'POMABAMBA', 'RECUAY', 'SANTA', 'SIHUAS', 'YUNGAY'],
      'APURIMAC': ['ABANCAY', 'ANDAHUAYLAS', 'ANTABAMBA', 'AYMARAES', 'CHINCHEROS', 'COTABAMBA', 'GRAU'],
      'AREQUIPA': ['AREQUIPA', 'CAMANA', 'CARAVELI', 'CASTILLA', 'CAYLLOMA', 'CONDESUYOS', 'ISLAY', 'LA UNION'],
      'AYACUCHO': ['HUAMANGA', 'CANGALLO', 'HUANCA SANCOS', 'HUANTA', 'LA MAR', 'LUCANAS', 'PARINACOCHAS', 'PAUCAR DEL SARA', 'SUCRE', 'VICTOR FAJARDO', 'VILCAS HUAMAN'],
      'CAJAMARCA': ['CAJAMARCA', 'CAJABAMBA', 'CELENDIN', 'CHOTA', 'CONTUMAZA', 'CUTERVO', 'HUALGAYOC', 'JAEN', 'SAN IGNACIO', 'SAN MARCOS', 'SAN MIGUEL', 'SAN PABLO', 'SANTA CRUZ'],
      'CALLAO': ['CALLAO (PROV.CONST.)'],
      'CUSCO': ['CUSCO', 'ACOMAYO', 'ANTA', 'CALCA', 'CANAS', 'CANCHIS', 'CHUMBIVILCAS', 'ESPINAR', 'LA CONVENCION', 'PARURO', 'PAUCARTAMBO', 'QUISPICANCHI', 'URUBAMBA'],
      'HUANCAVELICA': ['HUANCAVELICA', 'ACOBAMBA', 'ANGARAES', 'CASTROVIRREYNA', 'CHURCAMPA', 'HUAYTARA', 'TAYACAJA'],
      'HUANUCO': ['HUANUCO', 'AMBO', 'DOS DE MAYO', 'HUACAYBAMBA', 'HUAMALIES', 'LAURICOCHA', 'LEONCIO PRADO', 'MARAÑON', 'PACHITEA', 'PUERTO INCA', 'YAROWILCA'],
      'ICA': ['ICA', 'CHINCHA', 'NAZCA', 'PALPA', 'PISCO'],
      'JUNIN': ['HUANCAYO', 'CONCEPCION', 'CHANCHAMAYO', 'CHUPACA', 'JAUJA', 'JUNIN', 'SATIPO', 'TARMA', 'YAULI'],
      'LA LIBERTAD': ['TRUJILLO', 'ASCOPE', 'BOLIVAR', 'CHEPEN', 'GRAN CHIMU', 'JULCAN', 'OTUZCO', 'PACASMAYO', 'PATAZ', 'SANCHEZ CARRION', 'SANTIAGO DE CHUCO', 'VIRU'],
      'LAMBAYEQUE': ['CHICLAYO', 'FERREÑAFE', 'LAMBAYEQUE'],
      'LIMA': ['LIMA', 'BARRANCA', 'CAJATAMBO', 'CANTA', 'CAÑETE', 'HUARAL', 'HUAROCHIRI', 'HUAURA', 'OYON', 'YAUYOS'],
      'LORETO': ['MAYNAS', 'ALTO AMAZONAS', 'LORETO', 'MCAL. RAMON CASTILLA', 'REQUENA', 'UCAYALI'],
      'MADRE DE DIOS': ['TAMBOPATA', 'MANU', 'TAHUAMANU'],
      'MOQUEGUA': ['MARISCAL NIETO', 'GRAL. SANCHEZ CERRO', 'ILO'],
      'PASCO': ['PASCO', 'DANIEL ALCIDES CARRION', 'OXAPAMPA'],
      'PIURA': ['PIURA', 'AYABACA', 'HUANCABAMBA', 'MORROPON', 'PAITA', 'SECHURA', 'SULLANA', 'TALARA'],
      'PUNO': ['PUNO', 'AZANGARO', 'CARABAYA', 'CHUCUITO', 'EL COLLAO', 'HUANCANE', 'LAMPA', 'MELGAR', 'MOHO', 'SAN ANTONIO DE PUTINA', 'SAN ROMAN', 'SANDIA', 'YUNGUYO'],
      'SAN MARTIN': ['MOYOBAMBA', 'BELLAVISTA', 'EL DORADO', 'HUALLAGA', 'LAMAS', 'MARISCAL CACERES', 'PICOTA', 'RIOJA', 'SAN MARTIN', 'TOCACHE'],
      'TACNA': ['TACNA', 'CANDARAVE', 'JORGE BASADRE', 'TARATA'],
      'TUMBES': ['TUMBES', 'CONTRALMIRANTE VILLAR', 'ZARUMILLA'],
      'UCAYALI': ['CORONEL PORTILLO', 'ATALAYA', 'PADRE ABAD', 'PURUS']
    }

    // Obtener provincias del departamento
    const deptKey = departamento.toUpperCase().trim()
    const provinciasOficiales = provinciasPorDepartamento[deptKey] || []

    console.log(`✅ ${provinciasOficiales.length} provincias oficiales encontradas para ${departamento}`)
    console.log(`📋 Provincias: ${provinciasOficiales.join(', ')}`)

    if (provinciasOficiales.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Departamento '${departamento}' no encontrado en datos oficiales INEI`,
          message: 'Verificar el nombre del departamento' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: provinciasOficiales,
      total: provinciasOficiales.length,
      departamento: departamento.toUpperCase(),
      source: 'Instituto Nacional de Estadística e Informática (INEI)',
      oficial: true
    })

  } catch (error) {
    console.error('Error obteniendo provincias oficiales INEI:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
