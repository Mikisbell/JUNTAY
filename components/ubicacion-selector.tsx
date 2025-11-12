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
import { 
  obtenerDepartamentos,
  obtenerProvinciasPorDepartamento,
  obtenerDistritosPorProvincia,
  buscarDepartamentoPorNombre,
  buscarProvinciaPorNombre,
  buscarDistritoPorNombre,
  type Departamento,
  type Provincia,
  type Distrito
} from '@/lib/data/ubicaciones-peru'

interface UbicacionSelectorProps {
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

export function UbicacionSelector({
  departamentoInicial = '',
  provinciaInicial = '',
  distritoInicial = '',
  onUbicacionChange,
  getCampoStyle,
  disabled = false
}: UbicacionSelectorProps) {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('')
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('')
  const [distritoSeleccionado, setDistritoSeleccionado] = useState('')
  
  const [departamentos] = useState<Departamento[]>(obtenerDepartamentos())
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [distritos, setDistritos] = useState<Distrito[]>([])

  // Inicializar con valores iniciales
  useEffect(() => {
    if (departamentoInicial) {
      const dept = buscarDepartamentoPorNombre(departamentoInicial)
      if (dept) {
        setDepartamentoSeleccionado(dept.codigo)
        const provinciasDisponibles = obtenerProvinciasPorDepartamento(dept.codigo)
        setProvincias(provinciasDisponibles)
        
        if (provinciaInicial) {
          const prov = buscarProvinciaPorNombre(provinciaInicial, dept.codigo)
          if (prov) {
            setProvinciaSeleccionada(prov.codigo)
            const distritosDisponibles = obtenerDistritosPorProvincia(prov.codigo, dept.codigo)
            setDistritos(distritosDisponibles)
            
            if (distritoInicial) {
              const dist = buscarDistritoPorNombre(distritoInicial, prov.codigo, dept.codigo)
              if (dist) {
                setDistritoSeleccionado(dist.codigo)
              }
            }
          }
        }
      }
    }
  }, [departamentoInicial, provinciaInicial, distritoInicial])

  const handleDepartamentoChange = (codigoDepartamento: string) => {
    setDepartamentoSeleccionado(codigoDepartamento)
    setProvinciaSeleccionada('')
    setDistritoSeleccionado('')
    
    // Cargar provincias del departamento seleccionado
    const provinciasDisponibles = obtenerProvinciasPorDepartamento(codigoDepartamento)
    setProvincias(provinciasDisponibles)
    setDistritos([])
    
    // Obtener nombre del departamento
    const departamento = departamentos.find(d => d.codigo === codigoDepartamento)
    
    onUbicacionChange({
      departamento: departamento?.nombre || '',
      provincia: '',
      distrito: ''
    })
  }

  const handleProvinciaChange = (codigoProvincia: string) => {
    setProvinciaSeleccionada(codigoProvincia)
    setDistritoSeleccionado('')
    
    // Cargar distritos de la provincia seleccionada
    const distritosDisponibles = obtenerDistritosPorProvincia(codigoProvincia, departamentoSeleccionado)
    setDistritos(distritosDisponibles)
    
    // Obtener nombres
    const departamento = departamentos.find(d => d.codigo === departamentoSeleccionado)
    const provincia = provincias.find(p => p.codigo === codigoProvincia)
    
    onUbicacionChange({
      departamento: departamento?.nombre || '',
      provincia: provincia?.nombre || '',
      distrito: ''
    })
  }

  const handleDistritoChange = (codigoDistrito: string) => {
    setDistritoSeleccionado(codigoDistrito)
    
    // Obtener nombres completos
    const departamento = departamentos.find(d => d.codigo === departamentoSeleccionado)
    const provincia = provincias.find(p => p.codigo === provinciaSeleccionada)
    const distrito = distritos.find(d => d.codigo === codigoDistrito)
    
    onUbicacionChange({
      departamento: departamento?.nombre || '',
      provincia: provincia?.nombre || '',
      distrito: distrito?.nombre || ''
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
            className={getCampoStyle ? getCampoStyle('departamento', 
              departamentos.find(d => d.codigo === departamentoSeleccionado)?.nombre || '') : ''}
          >
            <SelectValue placeholder="Seleccionar departamento" />
          </SelectTrigger>
          <SelectContent>
            {departamentos.map((departamento) => (
              <SelectItem key={departamento.codigo} value={departamento.codigo}>
                {departamento.nombre}
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
            className={getCampoStyle ? getCampoStyle('provincia',
              provincias.find(p => p.codigo === provinciaSeleccionada)?.nombre || '') : ''}
          >
            <SelectValue placeholder="Seleccionar provincia" />
          </SelectTrigger>
          <SelectContent>
            {provincias.map((provincia) => (
              <SelectItem key={provincia.codigo} value={provincia.codigo}>
                {provincia.nombre}
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
            className={getCampoStyle ? getCampoStyle('distrito',
              distritos.find(d => d.codigo === distritoSeleccionado)?.nombre || '') : ''}
          >
            <SelectValue placeholder="Seleccionar distrito" />
          </SelectTrigger>
          <SelectContent>
            {distritos.map((distrito) => (
              <SelectItem key={distrito.codigo} value={distrito.codigo}>
                {distrito.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
