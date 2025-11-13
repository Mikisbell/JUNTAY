// SISTEMA COMPLETO DE UBIGEOS - DATOS OFICIALES DEL REPOSITORIO
// Fuente: https://github.com/joseluisq/ubigeos-peru
// Datos JSON y SQL sobre departamentos, provincias y distritos del Perú

interface UbigeoData {
  id_ubigeo: string
  nombre_ubigeo: string
  codigo_ubigeo: string
  etiqueta_ubigeo: string
  buscador_ubigeo: string
  numero_hijos_ubigeo: string
  nivel_ubigeo: string
  id_padre_ubigeo: string
}

// MAPA DE RELACIONES JERÁRQUICAS
const MAPA_PROVINCIAS_POR_DEPARTAMENTO: { [key: string]: string[] } = {
  "2534": ["Chachapoyas", "Bagua", "Bongara", "Condorcanqui", "Luya", "Rodriguez de Mendoza", "Utcubamba"],
  "2625": ["Huaraz", "Aija", "Antonio Raymondi", "Asuncion", "Bolognesi", "Carhuaz", "Carlos Fermin Fitzcarrald", "Casma", "Corongo", "Huari", "Huarmey", "Huaylas", "Mariscal Luzuriaga", "Ocros", "Pallasca", "Pomabamba", "Recuay", "Santa", "Sihuas", "Yungay"],
  "2812": ["Abancay", "Andahuaylas", "Antabamba", "Aymaraes", "Cotabambas", "Chincheros", "Grau"],
  "2900": ["Arequipa", "Camana", "Caraveli", "Castilla", "Caylloma", "Condesuyos", "Islay", "La Union"],
  "3020": ["Huamanga", "Cangallo", "Huanca Sancos", "Huanta", "La Mar", "Lucanas", "Parinacochas", "Paucar del Sara Sara", "Sucre", "Victor Fajardo", "Vilcas Huaman"],
  "3143": ["Cajamarca", "Cajabamba", "Celendin", "Chota", "Contumaza", "Cutervo", "Hualgayoc", "Jaen", "San Ignacio", "San Marcos", "San Miguel", "San Pablo", "Santa Cruz"],
  "3292": ["Cusco", "Acomayo", "Anta", "Calca", "Canas", "Canchis", "Chumbivilcas", "Espinar", "La Convencion", "Paruro", "Paucartambo", "Quispicanchi", "Urubamba"],
  "3414": ["Huancavelica", "Acobamba", "Angaraes", "Castrovirreyna", "Churcampa", "Huaytara", "Tayacaja"],
  "3518": ["Huanuco", "Ambo", "Dos de Mayo", "Huacaybamba", "Huamalies", "Leoncio Prado", "Maraqon", "Pachitea", "Puerto Inca", "Lauricocha", "Yarowilca"],
  "3606": ["Ica", "Chincha", "Nazca", "Palpa", "Pisco"],
  "3655": ["Huancayo", "Concepcion", "Chanchamayo", "Jauja", "Junin", "Satipo", "Tarma", "Yauli", "Chupaca"],
  "3788": ["Trujillo", "Ascope", "Bolivar", "Chepen", "Julcan", "Otuzco", "Pacasmayo", "Pataz", "Sanchez Carrion", "Santiago de Chuco", "Gran Chimu", "Viru"],
  "3884": ["Chiclayo", "Ferreqafe", "Lambayeque"],
  "3926": ["Lima", "Barranca", "Cajatambo", "Callao", "Cañete", "Canta", "Huaral", "Huarochiri", "Huaura", "Oyon", "Yauyos"],
  "4108": ["Maynas", "Alto Amazonas", "Loreto", "Mariscal Ramon Castilla", "Requena", "Ucayali"],
  "4165": ["Tambopata", "Manu", "Tahuamanu"],
  "4180": ["Mariscal Nieto", "General Sanchez Cerro", "Ilo"],
  "4204": ["Pasco", "Daniel Alcides Carrion", "Oxapampa"],
  "4236": ["Piura", "Ayabaca", "Huancabamba", "Morropon", "Paita", "Sullana", "Talara", "Sechura"],
  "4309": ["Puno", "Azangaro", "Carabaya", "Chucuito", "El Collao", "Huancane", "Lampa", "Melgar", "Moho", "San Antonio de Putina", "San Roman", "Sandia", "Yunguyo"],
  "4431": ["Moyobamba", "Bellavista", "El Dorado", "Huallaga", "Lamas", "Mariscal Caceres", "Picota", "Rioja", "San Martin", "Tocache"],
  "4519": ["Tacna", "Candarave", "Jorge Basadre", "Tarata"],
  "4551": ["Tumbes", "Contralmirante Villar", "Zarumilla"],
  "4567": ["Coronel Portillo", "Atalaya", "Padre Abad", "Purus"]
}

// DEPARTAMENTOS OFICIALES CON SUS IDs
const DEPARTAMENTOS_OFICIALES: UbigeoData[] = [
  {id_ubigeo:"2534",nombre_ubigeo:"Amazonas",codigo_ubigeo:"01",etiqueta_ubigeo:"Amazonas, Perú",buscador_ubigeo:"amazonas perú",numero_hijos_ubigeo:"7",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"2625",nombre_ubigeo:"Ancash",codigo_ubigeo:"02",etiqueta_ubigeo:"Ancash, Perú",buscador_ubigeo:"ancash perú",numero_hijos_ubigeo:"20",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"2812",nombre_ubigeo:"Apurimac",codigo_ubigeo:"03",etiqueta_ubigeo:"Apurimac, Perú",buscador_ubigeo:"apurimac perú",numero_hijos_ubigeo:"7",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"2900",nombre_ubigeo:"Arequipa",codigo_ubigeo:"04",etiqueta_ubigeo:"Arequipa, Perú",buscador_ubigeo:"arequipa perú",numero_hijos_ubigeo:"8",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3020",nombre_ubigeo:"Ayacucho",codigo_ubigeo:"05",etiqueta_ubigeo:"Ayacucho, Perú",buscador_ubigeo:"ayacucho perú",numero_hijos_ubigeo:"11",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3143",nombre_ubigeo:"Cajamarca",codigo_ubigeo:"06",etiqueta_ubigeo:"Cajamarca, Perú",buscador_ubigeo:"cajamarca perú",numero_hijos_ubigeo:"13",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3292",nombre_ubigeo:"Cusco",codigo_ubigeo:"08",etiqueta_ubigeo:"Cusco, Perú",buscador_ubigeo:"cusco perú",numero_hijos_ubigeo:"13",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3414",nombre_ubigeo:"Huancavelica",codigo_ubigeo:"09",etiqueta_ubigeo:"Huancavelica, Perú",buscador_ubigeo:"huancavelica perú",numero_hijos_ubigeo:"7",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3518",nombre_ubigeo:"Huanuco",codigo_ubigeo:"10",etiqueta_ubigeo:"Huanuco, Perú",buscador_ubigeo:"huanuco perú",numero_hijos_ubigeo:"11",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3606",nombre_ubigeo:"Ica",codigo_ubigeo:"11",etiqueta_ubigeo:"Ica, Perú",buscador_ubigeo:"ica perú",numero_hijos_ubigeo:"5",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3655",nombre_ubigeo:"Junin",codigo_ubigeo:"12",etiqueta_ubigeo:"Junin, Perú",buscador_ubigeo:"junin perú",numero_hijos_ubigeo:"9",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3788",nombre_ubigeo:"La Libertad",codigo_ubigeo:"13",etiqueta_ubigeo:"La Libertad, Perú",buscador_ubigeo:"la libertad perú",numero_hijos_ubigeo:"12",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3884",nombre_ubigeo:"Lambayeque",codigo_ubigeo:"14",etiqueta_ubigeo:"Lambayeque, Perú",buscador_ubigeo:"lambayeque perú",numero_hijos_ubigeo:"3",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"3926",nombre_ubigeo:"Lima",codigo_ubigeo:"15",etiqueta_ubigeo:"Lima, Perú",buscador_ubigeo:"lima perú",numero_hijos_ubigeo:"10",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4108",nombre_ubigeo:"Loreto",codigo_ubigeo:"16",etiqueta_ubigeo:"Loreto, Perú",buscador_ubigeo:"loreto perú",numero_hijos_ubigeo:"6",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4165",nombre_ubigeo:"Madre de Dios",codigo_ubigeo:"17",etiqueta_ubigeo:"Madre de Dios, Perú",buscador_ubigeo:"madre de dios perú",numero_hijos_ubigeo:"3",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4180",nombre_ubigeo:"Moquegua",codigo_ubigeo:"18",etiqueta_ubigeo:"Moquegua, Perú",buscador_ubigeo:"moquegua perú",numero_hijos_ubigeo:"3",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4204",nombre_ubigeo:"Pasco",codigo_ubigeo:"19",etiqueta_ubigeo:"Pasco, Perú",buscador_ubigeo:"pasco perú",numero_hijos_ubigeo:"3",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4236",nombre_ubigeo:"Piura",codigo_ubigeo:"20",etiqueta_ubigeo:"Piura, Perú",buscador_ubigeo:"piura perú",numero_hijos_ubigeo:"8",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4309",nombre_ubigeo:"Puno",codigo_ubigeo:"21",etiqueta_ubigeo:"Puno, Perú",buscador_ubigeo:"puno perú",numero_hijos_ubigeo:"13",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4431",nombre_ubigeo:"San Martin",codigo_ubigeo:"22",etiqueta_ubigeo:"San Martin, Perú",buscador_ubigeo:"san martin perú",numero_hijos_ubigeo:"10",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4519",nombre_ubigeo:"Tacna",codigo_ubigeo:"23",etiqueta_ubigeo:"Tacna, Perú",buscador_ubigeo:"tacna perú",numero_hijos_ubigeo:"4",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4551",nombre_ubigeo:"Tumbes",codigo_ubigeo:"24",etiqueta_ubigeo:"Tumbes, Perú",buscador_ubigeo:"tumbes perú",numero_hijos_ubigeo:"3",nivel_ubigeo:"1",id_padre_ubigeo:"2533"},
  {id_ubigeo:"4567",nombre_ubigeo:"Ucayali",codigo_ubigeo:"25",etiqueta_ubigeo:"Ucayali, Perú",buscador_ubigeo:"ucayali perú",numero_hijos_ubigeo:"4",nivel_ubigeo:"1",id_padre_ubigeo:"2533"}
]

// FUNCIONES DE UTILIDAD
export function obtenerTodosLosDepartamentos(): string[] {
  return DEPARTAMENTOS_OFICIALES.map(dept => dept.nombre_ubigeo.toUpperCase())
}

export function buscarIdDepartamento(nombreDepartamento: string): string | null {
  const dept = DEPARTAMENTOS_OFICIALES.find(d => 
    d.nombre_ubigeo.toUpperCase() === nombreDepartamento.toUpperCase().trim()
  )
  return dept ? dept.id_ubigeo : null
}

export function obtenerProvinciasPorDepartamento(nombreDepartamento: string): string[] {
  const deptId = buscarIdDepartamento(nombreDepartamento)
  if (!deptId) return []
  
  return MAPA_PROVINCIAS_POR_DEPARTAMENTO[deptId] || []
}

export function existeDepartamento(nombreDepartamento: string): boolean {
  return buscarIdDepartamento(nombreDepartamento) !== null
}

export function obtenerEstadisticasCompletas() {
  const totalDepartamentos = DEPARTAMENTOS_OFICIALES.length
  const totalProvincias = Object.values(MAPA_PROVINCIAS_POR_DEPARTAMENTO)
    .reduce((acc, provincias) => acc + provincias.length, 0)
  
  return {
    departamentos: totalDepartamentos,
    provincias: totalProvincias,
    departamentos_con_provincias: Object.keys(MAPA_PROVINCIAS_POR_DEPARTAMENTO).length,
    fuente: "Repositorio Oficial GitHub - joseluisq/ubigeos-peru"
  }
}
