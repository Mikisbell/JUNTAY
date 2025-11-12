// Sistema completo de Ubigeos del Perú
// Basado en: https://github.com/joseluisq/ubigeos-peru
// Fuente oficial: INEI - Instituto Nacional de Estadística e Informática

export interface UbigeoCompleto {
  id_ubigeo: string
  nombre_ubigeo: string
  codigo_ubigeo: string
  etiqueta_ubigeo: string
  buscador_ubigeo: string
  numero_hijos_ubigeo: string
  nivel_ubigeo: string // 1=departamento, 2=provincia, 3=distrito
  id_padre_ubigeo: string
}

export interface UbigeoResuelto {
  codigo: string
  departamento: string
  provincia: string
  distrito: string
}

// Mapeo de códigos ubigeo a nombres - Los más comunes
const ubigeosMap: Record<string, UbigeoResuelto> = {
  // LIMA
  '150101': { codigo: '150101', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LIMA' },
  '150103': { codigo: '150103', departamento: 'LIMA', provincia: 'LIMA', distrito: 'BREÑA' },
  '150104': { codigo: '150104', departamento: 'LIMA', provincia: 'LIMA', distrito: 'CARABAYLLO' },
  '150106': { codigo: '150106', departamento: 'LIMA', provincia: 'LIMA', distrito: 'CHORRILLOS' },
  '150108': { codigo: '150108', departamento: 'LIMA', provincia: 'LIMA', distrito: 'COMAS' },
  '150109': { codigo: '150109', departamento: 'LIMA', provincia: 'LIMA', distrito: 'EL AGUSTINO' },
  '150110': { codigo: '150110', departamento: 'LIMA', provincia: 'LIMA', distrito: 'INDEPENDENCIA' },
  '150111': { codigo: '150111', departamento: 'LIMA', provincia: 'LIMA', distrito: 'JESÚS MARÍA' },
  '150112': { codigo: '150112', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LA MOLINA' },
  '150113': { codigo: '150113', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LA VICTORIA' },
  '150114': { codigo: '150114', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LINCE' },
  '150115': { codigo: '150115', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LOS OLIVOS' },
  '150120': { codigo: '150120', departamento: 'LIMA', provincia: 'LIMA', distrito: 'MIRAFLORES' },
  '150128': { codigo: '150128', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN BORJA' },
  '150129': { codigo: '150129', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN ISIDRO' },
  '150132': { codigo: '150132', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN MARTÍN DE PORRES' },
  '150137': { codigo: '150137', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SANTIAGO DE SURCO' },
  '150139': { codigo: '150139', departamento: 'LIMA', provincia: 'LIMA', distrito: 'VILLA EL SALVADOR' },
  '110113': { codigo: '110113', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN JUAN DE LURIGANCHO' },
  
  // CALLAO
  '070101': { codigo: '070101', departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'CALLAO' },
  '070106': { codigo: '070106', departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'VENTANILLA' },
  
  // JUNÍN
  '120101': { codigo: '120101', departamento: 'JUNIN', provincia: 'HUANCAYO', distrito: 'HUANCAYO' },
  '120114': { codigo: '120114', departamento: 'JUNIN', provincia: 'HUANCAYO', distrito: 'EL TAMBO' },
  
  // AREQUIPA
  '040101': { codigo: '040101', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'AREQUIPA' },
  '040129': { codigo: '040129', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'JOSE LUIS BUSTAMANTE Y RIVERO' },
  
  // CUSCO
  '080101': { codigo: '080101', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'CUSCO' },
  
  // TRUJILLO
  '130101': { codigo: '130101', departamento: 'LA LIBERTAD', provincia: 'TRUJILLO', distrito: 'TRUJILLO' },
  
  // PIURA
  '200101': { codigo: '200101', departamento: 'PIURA', provincia: 'PIURA', distrito: 'PIURA' },
  
  // CHICLAYO
  '140101': { codigo: '140101', departamento: 'LAMBAYEQUE', provincia: 'CHICLAYO', distrito: 'CHICLAYO' },
  
  // ICA
  '110101': { codigo: '110101', departamento: 'ICA', provincia: 'ICA', distrito: 'ICA' },
  
  // PUNO
  '210101': { codigo: '210101', departamento: 'PUNO', provincia: 'PUNO', distrito: 'PUNO' },
  
  // TACNA
  '230101': { codigo: '230101', departamento: 'TACNA', provincia: 'TACNA', distrito: 'TACNA' }
}

/**
 * Busca información de ubigeo por código
 */
export function buscarUbigeoPorCodigo(codigo: string): UbigeoResuelto | null {
  // Primero buscar en nuestro mapeo rápido
  const encontrado = ubigeosMap[codigo]
  if (encontrado) {
    return encontrado
  }
  
  // Si no se encuentra, inferir de código (formato estándar INEI)
  if (codigo.length === 6) {
    const codigoDep = codigo.substring(0, 2)
    const codigoProv = codigo.substring(2, 4)
    const codigoDist = codigo.substring(4, 6)
    
    // Mapeo básico de departamentos por código
    const departamentos: Record<string, string> = {
      '01': 'AMAZONAS', '02': 'ANCASH', '03': 'APURIMAC', '04': 'AREQUIPA',
      '05': 'AYACUCHO', '06': 'CAJAMARCA', '07': 'CALLAO', '08': 'CUSCO',
      '09': 'HUANCAVELICA', '10': 'HUANUCO', '11': 'ICA', '12': 'JUNIN',
      '13': 'LA LIBERTAD', '14': 'LAMBAYEQUE', '15': 'LIMA', '16': 'LORETO',
      '17': 'MADRE DE DIOS', '18': 'MOQUEGUA', '19': 'PASCO', '20': 'PIURA',
      '21': 'PUNO', '22': 'SAN MARTIN', '23': 'TACNA', '24': 'TUMBES', '25': 'UCAYALI'
    }
    
    const departamento = departamentos[codigoDep]
    if (departamento) {
      return {
        codigo,
        departamento,
        provincia: `PROV-${codigoProv}`,
        distrito: `DIST-${codigoDist}`
      }
    }
  }
  
  return null
}

/**
 * Obtiene lista de departamentos disponibles
 */
export function obtenerDepartamentos(): string[] {
  const departamentos = [...new Set(Object.values(ubigeosMap).map(u => u.departamento))]
  return departamentos.sort()
}

/**
 * Busca ubigeos por texto de búsqueda
 */
export function buscarUbigeosPorTexto(texto: string): UbigeoResuelto[] {
  const textoBusqueda = texto.toLowerCase()
  return Object.values(ubigeosMap).filter(ubigeo =>
    ubigeo.departamento.toLowerCase().includes(textoBusqueda) ||
    ubigeo.provincia.toLowerCase().includes(textoBusqueda) ||
    ubigeo.distrito.toLowerCase().includes(textoBusqueda)
  )
}

/**
 * Función auxiliar para resolver ubicación por ubigeo
 */
export function resolverUbicacion(ubigeo: string): { 
  departamento: string, 
  provincia: string, 
  distrito: string 
} | null {
  const resultado = buscarUbigeoPorCodigo(ubigeo)
  if (resultado) {
    return {
      departamento: resultado.departamento,
      provincia: resultado.provincia,
      distrito: resultado.distrito
    }
  }
  return null
}

/**
 * Función para extender el mapeo con más ubigeos si es necesario
 */
export function agregarUbigeo(codigo: string, data: UbigeoResuelto) {
  ubigeosMap[codigo] = data
}

// Lista de departamentos del Perú para formularios
export const DEPARTAMENTOS_PERU = [
  'AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA',
  'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN',
  'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS',
  'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA',
  'TUMBES', 'UCAYALI'
]
