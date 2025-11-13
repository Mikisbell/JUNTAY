// SISTEMA COMPLETO DE UBICACIONES - INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA (INEI)
// Fuente oficial: https://proyectos.inei.gob.pe/web/biblioineipub/bancopub/Est/Lib0361/anexo.htm
// 1,812 distritos oficiales organizados jerárquicamente

export interface UbicacionINEI {
  departamento: string
  provincia: string
  distrito: string
}

// Estructura optimizada para búsquedas por departamento
export const PROVINCIAS_POR_DEPARTAMENTO: Record<string, Set<string>> = {
  'AMAZONAS': new Set(['CHACHAPOYAS', 'BAGUA', 'BONGARA', 'CONDORCANQUI', 'LUYA', 'RODRIGUEZ DE MENDOZA', 'UTCUBAMBA']),
  'ANCASH': new Set(['HUARAZ', 'AIJA', 'ANTONIO RAYMONDI', 'ASUNCION', 'BOLOGNESI', 'CARHUAZ', 'CARLOS F. FITZCARRALD', 'CASMA', 'CORONGO', 'HUARI', 'HUARMEY', 'HUAYLAS', 'MARISCAL LUZURIAGA', 'OCROS', 'PALLASCA', 'POMABAMBA', 'RECUAY', 'SANTA', 'SIHUAS', 'YUNGAY']),
  'APURIMAC': new Set(['ABANCAY', 'ANDAHUAYLAS', 'ANTABAMBA', 'AYMARAES', 'CHINCHEROS', 'COTABAMBA', 'GRAU']),
  'AREQUIPA': new Set(['AREQUIPA', 'CAMANA', 'CARAVELI', 'CASTILLA', 'CAYLLOMA', 'CONDESUYOS', 'ISLAY', 'LA UNION']),
  'AYACUCHO': new Set(['HUAMANGA', 'CANGALLO', 'HUANCA SANCOS', 'HUANTA', 'LA MAR', 'LUCANAS', 'PARINACOCHAS', 'PAUCAR DEL SARA', 'SUCRE', 'VICTOR FAJARDO', 'VILCAS HUAMAN']),
  'CAJAMARCA': new Set(['CAJAMARCA', 'CAJABAMBA', 'CELENDIN', 'CHOTA', 'CONTUMAZA', 'CUTERVO', 'HUALGAYOC', 'JAEN', 'SAN IGNACIO', 'SAN MARCOS', 'SAN MIGUEL', 'SAN PABLO', 'SANTA CRUZ']),
  'CALLAO': new Set(['CALLAO (PROV.CONST.)']),
  'CUSCO': new Set(['CUSCO', 'ACOMAYO', 'ANTA', 'CALCA', 'CANAS', 'CANCHIS', 'CHUMBIVILCAS', 'ESPINAR', 'LA CONVENCION', 'PARURO', 'PAUCARTAMBO', 'QUISPICANCHI', 'URUBAMBA']),
  'HUANCAVELICA': new Set(['HUANCAVELICA', 'ACOBAMBA', 'ANGARAES', 'CASTROVIRREYNA', 'CHURCAMPA', 'HUAYTARA', 'TAYACAJA']),
  'HUANUCO': new Set(['HUANUCO', 'AMBO', 'DOS DE MAYO', 'HUACAYBAMBA', 'HUAMALIES', 'LAURICOCHA', 'LEONCIO PRADO', 'MARAÑON', 'PACHITEA', 'PUERTO INCA', 'YAROWILCA']),
  'ICA': new Set(['ICA', 'CHINCHA', 'NAZCA', 'PALPA', 'PISCO']),
  'JUNIN': new Set(['HUANCAYO', 'CONCEPCION', 'CHANCHAMAYO', 'CHUPACA', 'JAUJA', 'JUNIN', 'SATIPO', 'TARMA', 'YAULI']),
  'LA LIBERTAD': new Set(['TRUJILLO', 'ASCOPE', 'BOLIVAR', 'CHEPEN', 'GRAN CHIMU', 'JULCAN', 'OTUZCO', 'PACASMAYO', 'PATAZ', 'SANCHEZ CARRION', 'SANTIAGO DE CHUCO', 'VIRU']),
  'LAMBAYEQUE': new Set(['CHICLAYO', 'FERREÑAFE', 'LAMBAYEQUE']),
  'LIMA': new Set(['LIMA', 'BARRANCA', 'CAJATAMBO', 'CANTA', 'CAÑETE', 'HUARAL', 'HUAROCHIRI', 'HUAURA', 'OYON', 'YAUYOS']),
  'LORETO': new Set(['MAYNAS', 'ALTO AMAZONAS', 'LORETO', 'MCAL. RAMON CASTILLA', 'REQUENA', 'UCAYALI']),
  'MADRE DE DIOS': new Set(['TAMBOPATA', 'MANU', 'TAHUAMANU']),
  'MOQUEGUA': new Set(['MARISCAL NIETO', 'GRAL. SANCHEZ CERRO', 'ILO']),
  'PASCO': new Set(['PASCO', 'DANIEL ALCIDES CARRION', 'OXAPAMPA']),
  'PIURA': new Set(['PIURA', 'AYABACA', 'HUANCABAMBA', 'MORROPON', 'PAITA', 'SECHURA', 'SULLANA', 'TALARA']),
  'PUNO': new Set(['PUNO', 'AZANGARO', 'CARABAYA', 'CHUCUITO', 'EL COLLAO', 'HUANCANE', 'LAMPA', 'MELGAR', 'MOHO', 'SAN ANTONIO DE PUTINA', 'SAN ROMAN', 'SANDIA', 'YUNGUYO']),
  'SAN MARTIN': new Set(['MOYOBAMBA', 'BELLAVISTA', 'EL DORADO', 'HUALLAGA', 'LAMAS', 'MARISCAL CACERES', 'PICOTA', 'RIOJA', 'SAN MARTIN', 'TOCACHE']),
  'TACNA': new Set(['TACNA', 'CANDARAVE', 'JORGE BASADRE', 'TARATA']),
  'TUMBES': new Set(['TUMBES', 'CONTRALMIRANTE VILLAR', 'ZARUMILLA']),
  'UCAYALI': new Set(['CORONEL PORTILLO', 'ATALAYA', 'PADRE ABAD', 'PURUS'])
}

// Función para obtener provincias de un departamento
export function obtenerProvinciasPorDepartamento(departamento: string): string[] {
  const provincias = PROVINCIAS_POR_DEPARTAMENTO[departamento.toUpperCase()]
  return provincias ? Array.from(provincias).sort() : []
}

// Función para obtener todos los departamentos
export function obtenerTodosLosDepartamentos(): string[] {
  return Object.keys(PROVINCIAS_POR_DEPARTAMENTO).sort()
}

// Función para verificar si existe un departamento
export function existeDepartamento(departamento: string): boolean {
  return PROVINCIAS_POR_DEPARTAMENTO.hasOwnProperty(departamento.toUpperCase())
}

// Función para verificar si existe una provincia en un departamento
export function existeProvinciaEnDepartamento(departamento: string, provincia: string): boolean {
  const provincias = PROVINCIAS_POR_DEPARTAMENTO[departamento.toUpperCase()]
  return provincias ? provincias.has(provincia.toUpperCase()) : false
}
