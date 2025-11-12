// Sistema completo de ubicaciones del Perú para formularios
// Departamentos → Provincias → Distritos

export interface Departamento {
  codigo: string
  nombre: string
}

export interface Provincia {
  codigo: string
  nombre: string
  departamento_codigo: string
}

export interface Distrito {
  codigo: string
  nombre: string
  provincia_codigo: string
  departamento_codigo: string
}

// Departamentos del Perú
export const DEPARTAMENTOS: Departamento[] = [
  { codigo: '01', nombre: 'AMAZONAS' },
  { codigo: '02', nombre: 'ANCASH' },
  { codigo: '03', nombre: 'APURIMAC' },
  { codigo: '04', nombre: 'AREQUIPA' },
  { codigo: '05', nombre: 'AYACUCHO' },
  { codigo: '06', nombre: 'CAJAMARCA' },
  { codigo: '07', nombre: 'CALLAO' },
  { codigo: '08', nombre: 'CUSCO' },
  { codigo: '09', nombre: 'HUANCAVELICA' },
  { codigo: '10', nombre: 'HUANUCO' },
  { codigo: '11', nombre: 'ICA' },
  { codigo: '12', nombre: 'JUNIN' },
  { codigo: '13', nombre: 'LA LIBERTAD' },
  { codigo: '14', nombre: 'LAMBAYEQUE' },
  { codigo: '15', nombre: 'LIMA' },
  { codigo: '16', nombre: 'LORETO' },
  { codigo: '17', nombre: 'MADRE DE DIOS' },
  { codigo: '18', nombre: 'MOQUEGUA' },
  { codigo: '19', nombre: 'PASCO' },
  { codigo: '20', nombre: 'PIURA' },
  { codigo: '21', nombre: 'PUNO' },
  { codigo: '22', nombre: 'SAN MARTIN' },
  { codigo: '23', nombre: 'TACNA' },
  { codigo: '24', nombre: 'TUMBES' },
  { codigo: '25', nombre: 'UCAYALI' }
]

// Provincias principales por departamento
export const PROVINCIAS: Provincia[] = [
  // LIMA
  { codigo: '01', nombre: 'LIMA', departamento_codigo: '15' },
  { codigo: '02', nombre: 'BARRANCA', departamento_codigo: '15' },
  { codigo: '03', nombre: 'CAJATAMBO', departamento_codigo: '15' },
  { codigo: '04', nombre: 'CANTA', departamento_codigo: '15' },
  { codigo: '05', nombre: 'CAÑETE', departamento_codigo: '15' },
  { codigo: '06', nombre: 'HUARAL', departamento_codigo: '15' },
  { codigo: '07', nombre: 'HUAROCHIRI', departamento_codigo: '15' },
  { codigo: '08', nombre: 'HUAURA', departamento_codigo: '15' },
  { codigo: '09', nombre: 'OYON', departamento_codigo: '15' },
  { codigo: '10', nombre: 'YAUYOS', departamento_codigo: '15' },
  
  // CALLAO
  { codigo: '01', nombre: 'CALLAO', departamento_codigo: '07' },
  
  // AREQUIPA
  { codigo: '01', nombre: 'AREQUIPA', departamento_codigo: '04' },
  { codigo: '02', nombre: 'CAMANA', departamento_codigo: '04' },
  { codigo: '03', nombre: 'CARAVELI', departamento_codigo: '04' },
  { codigo: '04', nombre: 'CASTILLA', departamento_codigo: '04' },
  { codigo: '05', nombre: 'CAYLLOMA', departamento_codigo: '04' },
  { codigo: '06', nombre: 'CONDESUYOS', departamento_codigo: '04' },
  { codigo: '07', nombre: 'ISLAY', departamento_codigo: '04' },
  { codigo: '08', nombre: 'LA UNION', departamento_codigo: '04' },
  
  // JUNIN
  { codigo: '01', nombre: 'HUANCAYO', departamento_codigo: '12' },
  { codigo: '02', nombre: 'CONCEPCION', departamento_codigo: '12' },
  { codigo: '03', nombre: 'CHANCHAMAYO', departamento_codigo: '12' },
  { codigo: '04', nombre: 'JAUJA', departamento_codigo: '12' },
  { codigo: '05', nombre: 'JUNIN', departamento_codigo: '12' },
  { codigo: '06', nombre: 'SATIPO', departamento_codigo: '12' },
  { codigo: '07', nombre: 'TARMA', departamento_codigo: '12' },
  { codigo: '08', nombre: 'YAULI', departamento_codigo: '12' },
  { codigo: '09', nombre: 'CHUPACA', departamento_codigo: '12' },
  
  // CUSCO  
  { codigo: '01', nombre: 'CUSCO', departamento_codigo: '08' },
  { codigo: '02', nombre: 'ACOMAYO', departamento_codigo: '08' },
  { codigo: '03', nombre: 'ANTA', departamento_codigo: '08' },
  { codigo: '04', nombre: 'CALCA', departamento_codigo: '08' },
  { codigo: '05', nombre: 'CANAS', departamento_codigo: '08' },
  
  // Agregar más provincias según necesidad...
]

// Distritos principales
export const DISTRITOS: Distrito[] = [
  // LIMA - LIMA
  { codigo: '01', nombre: 'LIMA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '02', nombre: 'ANCON', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '03', nombre: 'ATE', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '04', nombre: 'BARRANCO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '05', nombre: 'BREÑA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '06', nombre: 'CARABAYLLO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '07', nombre: 'CHACLACAYO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '08', nombre: 'CHORRILLOS', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '09', nombre: 'CIENEGUILLA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '10', nombre: 'COMAS', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '11', nombre: 'EL AGUSTINO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '12', nombre: 'INDEPENDENCIA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '13', nombre: 'JESUS MARIA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '14', nombre: 'LA MOLINA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '15', nombre: 'LA VICTORIA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '16', nombre: 'LINCE', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '17', nombre: 'LOS OLIVOS', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '18', nombre: 'LURIGANCHO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '19', nombre: 'LURIN', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '20', nombre: 'MAGDALENA DEL MAR', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '21', nombre: 'MIRAFLORES', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '22', nombre: 'PACHACAMAC', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '23', nombre: 'PUCUSANA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '24', nombre: 'PUEBLO LIBRE', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '25', nombre: 'PUENTE PIEDRA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '26', nombre: 'PUNTA HERMOSA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '27', nombre: 'PUNTA NEGRA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '28', nombre: 'RIMAC', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '29', nombre: 'SAN BARTOLO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '30', nombre: 'SAN BORJA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '31', nombre: 'SAN ISIDRO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '32', nombre: 'SAN JUAN DE LURIGANCHO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '33', nombre: 'SAN JUAN DE MIRAFLORES', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '34', nombre: 'SAN LUIS', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '35', nombre: 'SAN MARTIN DE PORRES', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '36', nombre: 'SAN MIGUEL', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '37', nombre: 'SANTA ANITA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '38', nombre: 'SANTA MARIA DEL MAR', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '39', nombre: 'SANTA ROSA', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '40', nombre: 'SANTIAGO DE SURCO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '41', nombre: 'SURQUILLO', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '42', nombre: 'VILLA EL SALVADOR', provincia_codigo: '01', departamento_codigo: '15' },
  { codigo: '43', nombre: 'VILLA MARIA DEL TRIUNFO', provincia_codigo: '01', departamento_codigo: '15' },
  
  // CALLAO - CALLAO
  { codigo: '01', nombre: 'CALLAO', provincia_codigo: '01', departamento_codigo: '07' },
  { codigo: '02', nombre: 'BELLAVISTA', provincia_codigo: '01', departamento_codigo: '07' },
  { codigo: '03', nombre: 'CARMEN DE LA LEGUA REYNOSO', provincia_codigo: '01', departamento_codigo: '07' },
  { codigo: '04', nombre: 'LA PERLA', provincia_codigo: '01', departamento_codigo: '07' },
  { codigo: '05', nombre: 'LA PUNTA', provincia_codigo: '01', departamento_codigo: '07' },
  { codigo: '06', nombre: 'VENTANILLA', provincia_codigo: '01', departamento_codigo: '07' },
  
  // JUNIN - HUANCAYO
  { codigo: '01', nombre: 'HUANCAYO', provincia_codigo: '01', departamento_codigo: '12' },
  { codigo: '14', nombre: 'EL TAMBO', provincia_codigo: '01', departamento_codigo: '12' },
  { codigo: '04', nombre: 'CHILCA', provincia_codigo: '01', departamento_codigo: '12' },
  
  // Agregar más distritos según necesidad...
]

// Funciones auxiliares
export function obtenerDepartamentos(): Departamento[] {
  return DEPARTAMENTOS
}

export function obtenerProvinciasPorDepartamento(departamentoCodigo: string): Provincia[] {
  return PROVINCIAS.filter(p => p.departamento_codigo === departamentoCodigo)
}

export function obtenerDistritosPorProvincia(provinciaCodigo: string, departamentoCodigo: string): Distrito[] {
  return DISTRITOS.filter(d => 
    d.provincia_codigo === provinciaCodigo && 
    d.departamento_codigo === departamentoCodigo
  )
}

export function buscarDepartamentoPorNombre(nombre: string): Departamento | undefined {
  return DEPARTAMENTOS.find(d => 
    d.nombre.toLowerCase() === nombre.toLowerCase()
  )
}

export function buscarProvinciaPorNombre(nombre: string, departamentoCodigo: string): Provincia | undefined {
  return PROVINCIAS.find(p => 
    p.nombre.toLowerCase() === nombre.toLowerCase() && 
    p.departamento_codigo === departamentoCodigo
  )
}

export function buscarDistritoPorNombre(nombre: string, provinciaCodigo: string, departamentoCodigo: string): Distrito | undefined {
  return DISTRITOS.find(d => 
    d.nombre.toLowerCase() === nombre.toLowerCase() && 
    d.provincia_codigo === provinciaCodigo &&
    d.departamento_codigo === departamentoCodigo
  )
}
