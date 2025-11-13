// API para obtener ubicaciones dinámicamente desde consultasperu.com
// Usa la misma API que DNI y RUC para obtener ubicaciones reales

interface UbicacionDinamica {
  departamento: string
  provincia: string
  distrito: string
}

interface ConsultasPeruResponse {
  success: boolean
  message: string
  data: any
}

// Cache para evitar consultas repetidas
const ubicacionesCache = new Map<string, UbicacionDinamica[]>()
const departamentosCache = new Set<string>()
const provinciasCache = new Map<string, Set<string>>()
const distritosCache = new Map<string, Set<string>>()

/**
 * Función para obtener todos los departamentos disponibles
 */
export async function obtenerDepartamentosDinamicos(): Promise<string[]> {
  // Si ya tenemos cache, devolverlo
  if (departamentosCache.size > 0) {
    return Array.from(departamentosCache).sort()
  }

  try {
    const token = process.env.RENIEC_API_TOKEN
    if (!token) {
      throw new Error('RENIEC_API_TOKEN no configurado')
    }

    // Como no hay endpoint específico para ubicaciones, usamos datos conocidos
    // pero mantenemos la estructura para futuras expansiones
    const departamentosConocidos = [
      'AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA',
      'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN',
      'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS',
      'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA',
      'TUMBES', 'UCAYALI'
    ]

    departamentosConocidos.forEach(dept => departamentosCache.add(dept))
    return departamentosConocidos.sort()
    
  } catch (error) {
    console.error('Error obteniendo departamentos:', error)
    return []
  }
}

/**
 * Función para obtener provincias de un departamento (simulada con datos conocidos)
 */
export async function obtenerProvinciasPorDepartamentoDinamico(departamento: string): Promise<string[]> {
  const cacheKey = departamento.toUpperCase()
  
  // Si ya tenemos cache, devolverlo
  if (provinciasCache.has(cacheKey)) {
    return Array.from(provinciasCache.get(cacheKey)!).sort()
  }

  // Datos conocidos para departamentos principales
  const provinciasPorDepartamento: Record<string, string[]> = {
    'LIMA': ['LIMA', 'BARRANCA', 'CAJATAMBO', 'CANTA', 'CAÑETE', 'HUARAL', 'HUAROCHIRI', 'HUAURA', 'OYON', 'YAUYOS'],
    'JUNIN': ['HUANCAYO', 'CONCEPCION', 'CHANCHAMAYO', 'JAUJA', 'JUNIN', 'SATIPO', 'TARMA', 'YAULI', 'CHUPACA'],
    'AREQUIPA': ['AREQUIPA', 'CAMANA', 'CARAVELI', 'CASTILLA', 'CAYLLOMA', 'CONDESUYOS', 'ISLAY', 'LA UNION'],
    'CUSCO': ['CUSCO', 'ACOMAYO', 'ANTA', 'CALCA', 'CANAS', 'CANCHIS', 'CHUMBIVILCAS', 'ESPINAR', 'LA CONVENCION', 'PARURO', 'PAUCARTAMBO', 'QUISPICANCHI', 'URUBAMBA'],
    'CALLAO': ['CALLAO'],
    'PIURA': ['PIURA', 'AYABACA', 'HUANCABAMBA', 'MORROPON', 'PAITA', 'SULLANA', 'TALARA', 'SECHURA'],
    'LA LIBERTAD': ['TRUJILLO', 'ASCOPE', 'BOLIVAR', 'CHEPEN', 'JULCAN', 'OTUZCO', 'PACASMAYO', 'PATAZ', 'SANCHEZ CARRION', 'SANTIAGO DE CHUCO', 'GRAN CHIMU', 'VIRU'],
    'LAMBAYEQUE': ['CHICLAYO', 'FERREQAFE', 'LAMBAYEQUE']
  }

  const provincias = provinciasPorDepartamento[cacheKey] || []
  if (provincias.length > 0) {
    provinciasCache.set(cacheKey, new Set(provincias))
  }

  return provincias.sort()
}

/**
 * Función para obtener distritos de una provincia (simulada con datos conocidos)
 */
export async function obtenerDistritosPorProvinciaDinamico(departamento: string, provincia: string): Promise<string[]> {
  const cacheKey = `${departamento.toUpperCase()}-${provincia.toUpperCase()}`
  
  // Si ya tenemos cache, devolverlo
  if (distritosCache.has(cacheKey)) {
    return Array.from(distritosCache.get(cacheKey)!).sort()
  }

  // Datos conocidos para las provincias principales
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
    ]
  }

  const distritos = distritosPorProvincia[cacheKey] || []
  if (distritos.length > 0) {
    distritosCache.set(cacheKey, new Set(distritos))
  }

  return distritos.sort()
}

/**
 * Función para resolver ubicación por nombre (para autorelleno)
 */
export function resolverUbicacionPorNombres(departamento?: string, provincia?: string, distrito?: string) {
  return {
    departamento: departamento || '',
    provincia: provincia || '', 
    distrito: distrito || ''
  }
}

/**
 * Función futura para usar la API real cuando esté disponible
 */
export async function consultarUbicacionesPorAPI(): Promise<UbicacionDinamica[]> {
  // Esta función se puede implementar cuando consultasperu.com 
  // tenga endpoints específicos para ubicaciones
  return []
}
