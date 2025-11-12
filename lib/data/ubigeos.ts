// Ubigeos más comunes del Perú
// Fuente: INEI - Instituto Nacional de Estadística e Informática

export interface UbigeoData {
  codigo: string
  departamento: string
  provincia: string
  distrito: string
}

export const ubigeosComunes: UbigeoData[] = [
  // LIMA
  { codigo: '150101', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LIMA' },
  { codigo: '150103', departamento: 'LIMA', provincia: 'LIMA', distrito: 'BREÑA' },
  { codigo: '150104', departamento: 'LIMA', provincia: 'LIMA', distrito: 'CARABAYLLO' },
  { codigo: '150105', departamento: 'LIMA', provincia: 'LIMA', distrito: 'CHACLACAYO' },
  { codigo: '150106', departamento: 'LIMA', provincia: 'LIMA', distrito: 'CHORRILLOS' },
  { codigo: '150107', departamento: 'LIMA', provincia: 'LIMA', distrito: 'CIENEGUILLA' },
  { codigo: '150108', departamento: 'LIMA', provincia: 'LIMA', distrito: 'COMAS' },
  { codigo: '150109', departamento: 'LIMA', provincia: 'LIMA', distrito: 'EL AGUSTINO' },
  { codigo: '150110', departamento: 'LIMA', provincia: 'LIMA', distrito: 'INDEPENDENCIA' },
  { codigo: '150111', departamento: 'LIMA', provincia: 'LIMA', distrito: 'JESÚS MARÍA' },
  { codigo: '150112', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LA MOLINA' },
  { codigo: '150113', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LA VICTORIA' },
  { codigo: '150114', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LINCE' },
  { codigo: '150115', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LOS OLIVOS' },
  { codigo: '150116', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LURIGANCHO' },
  { codigo: '150117', departamento: 'LIMA', provincia: 'LIMA', distrito: 'LURÍN' },
  { codigo: '150118', departamento: 'LIMA', provincia: 'LIMA', distrito: 'MAGDALENA DEL MAR' },
  { codigo: '150119', departamento: 'LIMA', provincia: 'LIMA', distrito: 'PUEBLO LIBRE' },
  { codigo: '150120', departamento: 'LIMA', provincia: 'LIMA', distrito: 'MIRAFLORES' },
  { codigo: '150121', departamento: 'LIMA', provincia: 'LIMA', distrito: 'PACHACAMAC' },
  { codigo: '150122', departamento: 'LIMA', provincia: 'LIMA', distrito: 'PUCUSANA' },
  { codigo: '150123', departamento: 'LIMA', provincia: 'LIMA', distrito: 'PUENTE PIEDRA' },
  { codigo: '150124', departamento: 'LIMA', provincia: 'LIMA', distrito: 'PUNTA HERMOSA' },
  { codigo: '150125', departamento: 'LIMA', provincia: 'LIMA', distrito: 'PUNTA NEGRA' },
  { codigo: '150126', departamento: 'LIMA', provincia: 'LIMA', distrito: 'RÍMAC' },
  { codigo: '150127', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN BARTOLO' },
  { codigo: '150128', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN BORJA' },
  { codigo: '150129', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN ISIDRO' },
  { codigo: '150130', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN JUAN DE MIRAFLORES' },
  { codigo: '150131', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN LUIS' },
  { codigo: '150132', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN MARTÍN DE PORRES' },
  { codigo: '150133', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN MIGUEL' },
  { codigo: '150134', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SANTA ANITA' },
  { codigo: '150135', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SANTA MARÍA DEL MAR' },
  { codigo: '150136', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SANTA ROSA' },
  { codigo: '150137', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SANTIAGO DE SURCO' },
  { codigo: '150138', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SURQUILLO' },
  { codigo: '150139', departamento: 'LIMA', provincia: 'LIMA', distrito: 'VILLA EL SALVADOR' },
  { codigo: '150140', departamento: 'LIMA', provincia: 'LIMA', distrito: 'VILLA MARÍA DEL TRIUNFO' },
  
  // SAN JUAN DE LURIGANCHO (Código especial)
  { codigo: '110113', departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN JUAN DE LURIGANCHO' },
  
  // CALLAO
  { codigo: '070101', departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'CALLAO' },
  { codigo: '070102', departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'BELLAVISTA' },
  { codigo: '070103', departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'CARMEN DE LA LEGUA REYNOSO' },
  { codigo: '070104', departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'LA PERLA' },
  { codigo: '070105', departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'LA PUNTA' },
  { codigo: '070106', departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'VENTANILLA' },
  
  // JUNÍN (Huancayo)
  { codigo: '120101', departamento: 'JUNIN', provincia: 'HUANCAYO', distrito: 'HUANCAYO' },
  { codigo: '120114', departamento: 'JUNIN', provincia: 'HUANCAYO', distrito: 'EL TAMBO' },
  { codigo: '120104', departamento: 'JUNIN', provincia: 'HUANCAYO', distrito: 'CHILCA' },
  
  // AREQUIPA
  { codigo: '040101', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'AREQUIPA' },
  { codigo: '040102', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'ALTO SELVA ALEGRE' },
  { codigo: '040103', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'CAYMA' },
  { codigo: '040104', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'CERRO COLORADO' },
  { codigo: '040105', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'CHARACATO' },
  { codigo: '040106', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'CHIGUATA' },
  { codigo: '040107', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'JACOBO HUNTER' },
  { codigo: '040108', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'LA JOYA' },
  { codigo: '040109', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'MARIANO MELGAR' },
  { codigo: '040110', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'MIRAFLORES' },
  { codigo: '040111', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'MOLLEBAYA' },
  { codigo: '040112', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'PAUCARPATA' },
  { codigo: '040113', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'POCSI' },
  { codigo: '040114', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'POLOBAYA' },
  { codigo: '040115', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'QUEQUEÑA' },
  { codigo: '040116', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'SABANDIA' },
  { codigo: '040117', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'SACHACA' },
  { codigo: '040118', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'SAN JUAN DE SIGUAS' },
  { codigo: '040119', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'SAN JUAN DE TARUCANI' },
  { codigo: '040120', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'SANTA ISABEL DE SIGUAS' },
  { codigo: '040121', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'SANTA RITA DE SIGUAS' },
  { codigo: '040122', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'SOCABAYA' },
  { codigo: '040123', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'TIABAYA' },
  { codigo: '040124', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'UCHUMAYO' },
  { codigo: '040125', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'VITOR' },
  { codigo: '040126', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'YANAHUARA' },
  { codigo: '040127', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'YARABAMBA' },
  { codigo: '040128', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'YURA' },
  { codigo: '040129', departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'JOSE LUIS BUSTAMANTE Y RIVERO' },
  
  // CUSCO
  { codigo: '080101', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'CUSCO' },
  { codigo: '080102', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'CCORCA' },
  { codigo: '080103', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'POROY' },
  { codigo: '080104', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'SAN JERÓNIMO' },
  { codigo: '080105', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'SAN SEBASTIÁN' },
  { codigo: '080106', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'SANTIAGO' },
  { codigo: '080107', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'SAYLLA' },
  { codigo: '080108', departamento: 'CUSCO', provincia: 'CUSCO', distrito: 'WANCHAQ' }
]

// Función para buscar ubigeo por código
export function buscarUbigeoPorCodigo(codigo: string): UbigeoData | null {
  return ubigeosComunes.find(ubigeo => ubigeo.codigo === codigo) || null
}

// Función para buscar ubigeos por departamento
export function buscarUbigeosPorDepartamento(departamento: string): UbigeoData[] {
  return ubigeosComunes.filter(ubigeo => 
    ubigeo.departamento.toLowerCase().includes(departamento.toLowerCase())
  )
}

// Función para buscar ubigeos por distrito
export function buscarUbigeosPorDistrito(distrito: string): UbigeoData[] {
  return ubigeosComunes.filter(ubigeo => 
    ubigeo.distrito.toLowerCase().includes(distrito.toLowerCase())
  )
}

// Función para obtener todos los departamentos únicos
export function obtenerDepartamentos(): string[] {
  const departamentos = Array.from(new Set(ubigeosComunes.map(ubigeo => ubigeo.departamento)))
  return departamentos.sort()
}

// Función para obtener provincias por departamento
export function obtenerProvinciasPorDepartamento(departamento: string): string[] {
  const provincias = Array.from(new Set(
    ubigeosComunes
      .filter(ubigeo => ubigeo.departamento === departamento)
      .map(ubigeo => ubigeo.provincia)
  ))
  return provincias.sort()
}

// Función para obtener distritos por departamento y provincia
export function obtenerDistritosPorProvincia(departamento: string, provincia: string): string[] {
  const distritos = Array.from(new Set(
    ubigeosComunes
      .filter(ubigeo => ubigeo.departamento === departamento && ubigeo.provincia === provincia)
      .map(ubigeo => ubigeo.distrito)
  ))
  return distritos.sort()
}
