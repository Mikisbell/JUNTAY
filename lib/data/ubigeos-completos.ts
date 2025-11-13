// Sistema completo de ubigeos del Perú con datos oficiales
// Fuente: https://github.com/joseluisq/ubigeos-peru
// INEI - Instituto Nacional de Estadística e Informática

export interface UbigeoOficial {
  id_ubigeo: string
  nombre_ubigeo: string
  codigo_ubigeo: string
  etiqueta_ubigeo: string
  buscador_ubigeo: string
  numero_hijos_ubigeo: string
  nivel_ubigeo: string // 1=departamento, 2=provincia, 3=distrito
  id_padre_ubigeo: string
}

export interface DepartamentoCompleto {
  id: string
  codigo: string
  nombre: string
}

export interface ProvinciaCompleta {
  id: string
  codigo: string
  nombre: string
  departamento_id: string
}

export interface DistritoCompleto {
  id: string
  codigo: string
  nombre: string
  provincia_id: string
  departamento_id: string
}

// Departamentos completos del Perú
export const DEPARTAMENTOS_COMPLETOS: DepartamentoCompleto[] = [
  { id: '2534', codigo: '01', nombre: 'AMAZONAS' },
  { id: '2625', codigo: '02', nombre: 'ANCASH' },
  { id: '2812', codigo: '03', nombre: 'APURIMAC' },
  { id: '2900', codigo: '04', nombre: 'AREQUIPA' },
  { id: '3020', codigo: '05', nombre: 'AYACUCHO' },
  { id: '3143', codigo: '06', nombre: 'CAJAMARCA' },
  { id: '3285', codigo: '07', nombre: 'CALLAO' },
  { id: '3292', codigo: '08', nombre: 'CUSCO' },
  { id: '3414', codigo: '09', nombre: 'HUANCAVELICA' },
  { id: '3518', codigo: '10', nombre: 'HUANUCO' },
  { id: '3606', codigo: '11', nombre: 'ICA' },
  { id: '3655', codigo: '12', nombre: 'JUNIN' },
  { id: '3788', codigo: '13', nombre: 'LA LIBERTAD' },
  { id: '3884', codigo: '14', nombre: 'LAMBAYEQUE' },
  { id: '3926', codigo: '15', nombre: 'LIMA' },
  { id: '4108', codigo: '16', nombre: 'LORETO' },
  { id: '4165', codigo: '17', nombre: 'MADRE DE DIOS' },
  { id: '4180', codigo: '18', nombre: 'MOQUEGUA' },
  { id: '4204', codigo: '19', nombre: 'PASCO' },
  { id: '4236', codigo: '20', nombre: 'PIURA' },
  { id: '4309', codigo: '21', nombre: 'PUNO' },
  { id: '4431', codigo: '22', nombre: 'SAN MARTIN' },
  { id: '4519', codigo: '23', nombre: 'TACNA' },
  { id: '4551', codigo: '24', nombre: 'TUMBES' },
  { id: '4567', codigo: '25', nombre: 'UCAYALI' }
]

// Provincias del departamento de Junín (para ejemplo completo)
export const PROVINCIAS_JUNIN: ProvinciaCompleta[] = [
  { id: '3656', codigo: '01', nombre: 'HUANCAYO', departamento_id: '3655' },
  { id: '3685', codigo: '02', nombre: 'CONCEPCION', departamento_id: '3655' },
  { id: '3701', codigo: '03', nombre: 'CHANCHAMAYO', departamento_id: '3655' },
  { id: '3708', codigo: '04', nombre: 'JAUJA', departamento_id: '3655' },
  { id: '3743', codigo: '05', nombre: 'JUNIN', departamento_id: '3655' },
  { id: '3748', codigo: '06', nombre: 'SATIPO', departamento_id: '3655' },
  { id: '3757', codigo: '07', nombre: 'TARMA', departamento_id: '3655' },
  { id: '3767', codigo: '08', nombre: 'YAULI', departamento_id: '3655' },
  { id: '3778', codigo: '09', nombre: 'CHUPACA', departamento_id: '3655' }
]

// LOS 28 DISTRITOS COMPLETOS DE HUANCAYO - JUNÍN (datos oficiales)
export const DISTRITOS_HUANCAYO: DistritoCompleto[] = [
  { id: '3657', codigo: '01', nombre: 'HUANCAYO', provincia_id: '3656', departamento_id: '3655' },
  { id: '3658', codigo: '02', nombre: 'CARHUACALLANGA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3659', codigo: '04', nombre: 'CHACAPAMPA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3660', codigo: '05', nombre: 'CHICCHE', provincia_id: '3656', departamento_id: '3655' },
  { id: '3661', codigo: '06', nombre: 'CHILCA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3662', codigo: '07', nombre: 'CHONGOS ALTO', provincia_id: '3656', departamento_id: '3655' },
  { id: '3663', codigo: '08', nombre: 'CHUPURO', provincia_id: '3656', departamento_id: '3655' },
  { id: '3664', codigo: '09', nombre: 'COLCA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3665', codigo: '10', nombre: 'CULLHUAS', provincia_id: '3656', departamento_id: '3655' },
  { id: '3666', codigo: '11', nombre: 'EL TAMBO', provincia_id: '3656', departamento_id: '3655' },
  { id: '3667', codigo: '12', nombre: 'HUACRAPUQUIO', provincia_id: '3656', departamento_id: '3655' },
  { id: '3668', codigo: '13', nombre: 'HUALHUAS', provincia_id: '3656', departamento_id: '3655' },
  { id: '3669', codigo: '14', nombre: 'HUANCAN', provincia_id: '3656', departamento_id: '3655' },
  { id: '3670', codigo: '16', nombre: 'HUAYUCACHI', provincia_id: '3656', departamento_id: '3655' },
  { id: '3671', codigo: '17', nombre: 'INGENIO', provincia_id: '3656', departamento_id: '3655' },
  { id: '3672', codigo: '18', nombre: 'PARIAHUANCA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3673', codigo: '19', nombre: 'PILCOMAYO', provincia_id: '3656', departamento_id: '3655' },
  { id: '3674', codigo: '20', nombre: 'PUCARA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3675', codigo: '21', nombre: 'QUICHUAY', provincia_id: '3656', departamento_id: '3655' },
  { id: '3676', codigo: '22', nombre: 'QUILCAS', provincia_id: '3656', departamento_id: '3655' },
  { id: '3677', codigo: '23', nombre: 'SAN AGUSTIN', provincia_id: '3656', departamento_id: '3655' },
  { id: '3678', codigo: '24', nombre: 'SAN JERONIMO DE TUNAN', provincia_id: '3656', departamento_id: '3655' },
  { id: '3679', codigo: '25', nombre: 'SAÑO', provincia_id: '3656', departamento_id: '3655' },
  { id: '3680', codigo: '26', nombre: 'SAPALLANGA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3681', codigo: '27', nombre: 'SICAYA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3682', codigo: '28', nombre: 'SANTO DOMINGO DE ACOBAMBA', provincia_id: '3656', departamento_id: '3655' },
  { id: '3683', codigo: '29', nombre: 'VIQUES', provincia_id: '3656', departamento_id: '3655' },
  { id: '3684', codigo: '15', nombre: 'HUACHAC', provincia_id: '3656', departamento_id: '3655' }
]

// Provincias de Lima (para ejemplo completo)
export const PROVINCIAS_LIMA: ProvinciaCompleta[] = [
  { id: '3927', codigo: '01', nombre: 'LIMA', departamento_id: '3926' },
  { id: '3971', codigo: '02', nombre: 'BARRANCA', departamento_id: '3926' },
  { id: '3977', codigo: '03', nombre: 'CAJATAMBO', departamento_id: '3926' },
  { id: '3983', codigo: '04', nombre: 'CANTA', departamento_id: '3926' },
  { id: '3991', codigo: '05', nombre: 'CAÑETE', departamento_id: '3926' },
  { id: '4008', codigo: '06', nombre: 'HUARAL', departamento_id: '3926' },
  { id: '4021', codigo: '07', nombre: 'HUAROCHIRI', departamento_id: '3926' },
  { id: '4054', codigo: '08', nombre: 'HUAURA', departamento_id: '3926' },
  { id: '4067', codigo: '09', nombre: 'OYON', departamento_id: '3926' },
  { id: '4074', codigo: '10', nombre: 'YAUYOS', departamento_id: '3926' }
]

// Funciones principales para obtener datos
export function obtenerDepartamentosCompletos(): DepartamentoCompleto[] {
  return DEPARTAMENTOS_COMPLETOS
}

export function obtenerProvinciasPorDepartamento(departamentoId: string): ProvinciaCompleta[] {
  // Por ahora tenemos datos completos para Junín y Lima
  if (departamentoId === '3655') return PROVINCIAS_JUNIN
  if (departamentoId === '3926') return PROVINCIAS_LIMA
  
  // Para otros departamentos, devolver array vacío (se puede expandir)
  return []
}

export function obtenerDistritosPorProvincia(provinciaId: string): DistritoCompleto[] {
  // Por ahora tenemos datos completos para Huancayo
  if (provinciaId === '3656') return DISTRITOS_HUANCAYO
  
  // Para otras provincias, devolver array vacío (se puede expandir)
  return []
}

// Función para buscar departamento por nombre
export function buscarDepartamentoPorNombre(nombre: string): DepartamentoCompleto | undefined {
  return DEPARTAMENTOS_COMPLETOS.find(dept => 
    dept.nombre.toLowerCase().includes(nombre.toLowerCase())
  )
}

// Función para obtener departamento por código
export function obtenerDepartamentoPorCodigo(codigo: string): DepartamentoCompleto | undefined {
  return DEPARTAMENTOS_COMPLETOS.find(dept => dept.codigo === codigo)
}

// Función para resolver ubicación completa
export function resolverUbicacionCompleta(departamento: string, provincia: string, distrito: string) {
  const dept = buscarDepartamentoPorNombre(departamento)
  if (!dept) return null
  
  const provincias = obtenerProvinciasPorDepartamento(dept.id)
  const prov = provincias.find(p => p.nombre.toLowerCase().includes(provincia.toLowerCase()))
  if (!prov) return { departamento: dept.nombre, provincia: '', distrito: '' }
  
  const distritos = obtenerDistritosPorProvincia(prov.id)
  const dist = distritos.find(d => d.nombre.toLowerCase().includes(distrito.toLowerCase()))
  
  return {
    departamento: dept.nombre,
    provincia: prov.nombre,
    distrito: dist?.nombre || ''
  }
}
