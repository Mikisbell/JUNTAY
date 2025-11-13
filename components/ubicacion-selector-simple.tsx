'use client'

import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface UbicacionSelectorSimpleProps {
  departamentoInicial?: string
  provinciaInicial?: string
  distritoInicial?: string
  onUbicacionChange: (ubicacion: {
    departamento: string
    provincia: string
    distrito: string
  }) => void
  getCampoStyle?: (nombre: string, valor: string) => string
  disabled?: boolean
}

// Datos base - funciona inmediatamente sin API
const DEPARTAMENTOS = [
  'AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA',
  'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN',
  'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS',
  'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA',
  'TUMBES', 'UCAYALI'
]

// Provincias por departamento
const PROVINCIAS_POR_DEPARTAMENTO: Record<string, string[]> = {
  'LIMA': ['LIMA', 'BARRANCA', 'CAJATAMBO', 'CANTA', 'CAÑETE', 'HUARAL', 'HUAROCHIRI', 'HUAURA', 'OYON', 'YAUYOS'],
  'JUNIN': ['HUANCAYO', 'CONCEPCION', 'CHANCHAMAYO', 'JAUJA', 'JUNIN', 'SATIPO', 'TARMA', 'YAULI', 'CHUPACA'],
  'AREQUIPA': ['AREQUIPA', 'CAMANA', 'CARAVELI', 'CASTILLA', 'CAYLLOMA', 'CONDESUYOS', 'ISLAY', 'LA UNION'],
  'CUSCO': ['CUSCO', 'ACOMAYO', 'ANTA', 'CALCA', 'CANAS', 'CANCHIS', 'CHUMBIVILCAS', 'ESPINAR', 'LA CONVENCION', 'PARURO', 'PAUCARTAMBO', 'QUISPICANCHI', 'URUBAMBA'],
  'CALLAO': ['CALLAO'],
  'PIURA': ['PIURA', 'AYABACA', 'HUANCABAMBA', 'MORROPON', 'PAITA', 'SULLANA', 'TALARA', 'SECHURA'],
  'LA LIBERTAD': ['TRUJILLO', 'ASCOPE', 'BOLIVAR', 'CHEPEN', 'JULCAN', 'OTUZCO', 'PACASMAYO', 'PATAZ', 'SANCHEZ CARRION', 'SANTIAGO DE CHUCO', 'GRAN CHIMU', 'VIRU'],
  'LAMBAYEQUE': ['CHICLAYO', 'FERREQAFE', 'LAMBAYEQUE'],
  'ICA': ['ICA', 'CHINCHA', 'NAZCA', 'PALPA', 'PISCO'],
  'PUNO': ['PUNO', 'AZANGARO', 'CARABAYA', 'CHUCUITO', 'EL COLLAO', 'HUANCANE', 'LAMPA', 'MELGAR', 'MOHO', 'SAN ANTONIO DE PUTINA', 'SAN ROMAN', 'SANDIA', 'YUNGUYO']
}

// Distritos por provincia (los más importantes)
const DISTRITOS_POR_PROVINCIA: Record<string, string[]> = {
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
  ],
  'CUSCO-CUSCO': ['CUSCO', 'CCORCA', 'POROY', 'SAN JERONIMO', 'SAN SEBASTIAN', 'SANTIAGO', 'SAYLLA', 'WANCHAQ'],
  'PIURA-PIURA': ['PIURA', 'CASTILLA', 'CATACAOS', 'CURA MORI', 'EL TALLAN', 'LA ARENA', 'LA UNION', 'LAS LOMAS', 'TAMBO GRANDE'],
  'LA LIBERTAD-TRUJILLO': ['TRUJILLO', 'EL PORVENIR', 'FLORENCIA DE MORA', 'HUANCHACO', 'LA ESPERANZA', 'LAREDO', 'MOCHE', 'POROTO', 'SALAVERRY', 'SIMBAL', 'VICTOR LARCO HERRERA'],
  'LAMBAYEQUE-CHICLAYO': ['CHICLAYO', 'CHONGOYAPE', 'ETEN', 'ETEN PUERTO', 'JOSE LEONARDO ORTIZ', 'LA VICTORIA', 'LAGUNAS', 'MONSEFU', 'NUEVA ARICA', 'OYOTUN', 'PICSI', 'PIMENTEL', 'REQUE', 'SANTA ROSA', 'SAÑA', 'CAYALTI', 'PATAPO', 'POMALCA', 'PUCALA', 'TUMAN']
}

export function UbicacionSelectorSimple({
  departamentoInicial = '',
  provinciaInicial = '',
  distritoInicial = '',
  onUbicacionChange,
  getCampoStyle,
  disabled = false
}: UbicacionSelectorSimpleProps) {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(departamentoInicial)
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(provinciaInicial)
  const [distritoSeleccionado, setDistritoSeleccionado] = useState(distritoInicial)
  
  const [provincias, setProvincias] = useState<string[]>([])
  const [distritos, setDistritos] = useState<string[]>([])

  // Inicializar con valores iniciales
  useEffect(() => {
    if (departamentoInicial) {
      setDepartamentoSeleccionado(departamentoInicial)
      const provinciasDisponibles = PROVINCIAS_POR_DEPARTAMENTO[departamentoInicial] || []
      setProvincias(provinciasDisponibles)
      
      if (provinciaInicial && provinciasDisponibles.includes(provinciaInicial)) {
        setProvinciaSeleccionada(provinciaInicial)
        const clave = `${departamentoInicial}-${provinciaInicial}`
        const distritosDisponibles = DISTRITOS_POR_PROVINCIA[clave] || []
        setDistritos(distritosDisponibles)
        
        if (distritoInicial && distritosDisponibles.includes(distritoInicial)) {
          setDistritoSeleccionado(distritoInicial)
        }
      }
    }
  }, [departamentoInicial, provinciaInicial, distritoInicial])

  const handleDepartamentoChange = (departamento: string) => {
    setDepartamentoSeleccionado(departamento)
    setProvinciaSeleccionada('')
    setDistritoSeleccionado('')
    
    const provinciasDisponibles = PROVINCIAS_POR_DEPARTAMENTO[departamento] || []
    setProvincias(provinciasDisponibles)
    setDistritos([])
    
    onUbicacionChange({
      departamento,
      provincia: '',
      distrito: ''
    })
  }

  const handleProvinciaChange = (provincia: string) => {
    setProvinciaSeleccionada(provincia)
    setDistritoSeleccionado('')
    
    const clave = `${departamentoSeleccionado}-${provincia}`
    const distritosDisponibles = DISTRITOS_POR_PROVINCIA[clave] || []
    setDistritos(distritosDisponibles)
    
    onUbicacionChange({
      departamento: departamentoSeleccionado,
      provincia,
      distrito: ''
    })
  }

  const handleDistritoChange = (distrito: string) => {
    setDistritoSeleccionado(distrito)
    
    onUbicacionChange({
      departamento: departamentoSeleccionado,
      provincia: provinciaSeleccionada,
      distrito
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Departamento */}
      <div>
        <Label htmlFor="departamento">Departamento</Label>
        <Select
          value={departamentoSeleccionado}
          onValueChange={handleDepartamentoChange}
          disabled={disabled}
        >
          <SelectTrigger 
            className={getCampoStyle ? getCampoStyle('departamento', departamentoSeleccionado) : ''}
          >
            <SelectValue placeholder="Seleccionar departamento" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTAMENTOS.map((departamento) => (
              <SelectItem key={departamento} value={departamento}>
                {departamento}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Provincia */}
      <div>
        <Label htmlFor="provincia">Provincia</Label>
        <Select
          value={provinciaSeleccionada}
          onValueChange={handleProvinciaChange}
          disabled={disabled || !departamentoSeleccionado}
        >
          <SelectTrigger 
            className={getCampoStyle ? getCampoStyle('provincia', provinciaSeleccionada) : ''}
          >
            <SelectValue placeholder="Seleccionar provincia" />
          </SelectTrigger>
          <SelectContent>
            {provincias.map((provincia) => (
              <SelectItem key={provincia} value={provincia}>
                {provincia}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Distrito */}
      <div>
        <Label htmlFor="distrito">Distrito</Label>
        <Select
          value={distritoSeleccionado}
          onValueChange={handleDistritoChange}
          disabled={disabled || !provinciaSeleccionada}
        >
          <SelectTrigger 
            className={getCampoStyle ? getCampoStyle('distrito', distritoSeleccionado) : ''}
          >
            <SelectValue placeholder="Seleccionar distrito" />
          </SelectTrigger>
          <SelectContent>
            {distritos.map((distrito) => (
              <SelectItem key={distrito} value={distrito}>
                {distrito}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
