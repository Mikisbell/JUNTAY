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
  obtenerDepartamentosCompletos,
  obtenerProvinciasPorDepartamento,
  obtenerDistritosPorProvincia,
  buscarDepartamentoPorNombre,
  type DepartamentoCompleto,
  type ProvinciaCompleta,
  type DistritoCompleto
} from '@/lib/data/ubigeos-completos'

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
  
  const [departamentos] = useState<DepartamentoCompleto[]>(obtenerDepartamentosCompletos())
  const [provincias, setProvincias] = useState<ProvinciaCompleta[]>([])
  const [distritos, setDistritos] = useState<DistritoCompleto[]>([])

  // Inicializar con valores iniciales
  useEffect(() => {
    if (departamentoInicial) {
      const dept = buscarDepartamentoPorNombre(departamentoInicial)
      if (dept) {
        setDepartamentoSeleccionado(dept.id)
        const provinciasDisponibles = obtenerProvinciasPorDepartamento(dept.id)
        setProvincias(provinciasDisponibles)
        
        if (provinciaInicial) {
          const prov = provinciasDisponibles.find(p => p.nombre.toLowerCase().includes(provinciaInicial.toLowerCase()))
          if (prov) {
            setProvinciaSeleccionada(prov.id)
            const distritosDisponibles = obtenerDistritosPorProvincia(prov.id)
            setDistritos(distritosDisponibles)
            
            if (distritoInicial) {
              const dist = distritosDisponibles.find(d => d.nombre.toLowerCase().includes(distritoInicial.toLowerCase()))
              if (dist) {
                setDistritoSeleccionado(dist.id)
              }
            }
          }
        }
      }
    }
  }, [departamentoInicial, provinciaInicial, distritoInicial])

  const handleDepartamentoChange = (departamentoId: string) => {
    setDepartamentoSeleccionado(departamentoId)
    setProvinciaSeleccionada('')
    setDistritoSeleccionado('')
    
    // Cargar provincias del departamento seleccionado
    const provinciasDisponibles = obtenerProvinciasPorDepartamento(departamentoId)
    setProvincias(provinciasDisponibles)
    setDistritos([])
    
    // Obtener nombre del departamento
    const departamento = departamentos.find(d => d.id === departamentoId)
    
    onUbicacionChange({
      departamento: departamento?.nombre || '',
      provincia: '',
      distrito: ''
    })
  }

  const handleProvinciaChange = (provinciaId: string) => {
    setProvinciaSeleccionada(provinciaId)
    setDistritoSeleccionado('')
    
    // Cargar distritos de la provincia seleccionada
    const distritosDisponibles = obtenerDistritosPorProvincia(provinciaId)
    setDistritos(distritosDisponibles)
    
    // Obtener nombres
    const departamento = departamentos.find(d => d.id === departamentoSeleccionado)
    const provincia = provincias.find(p => p.id === provinciaId)
    
    onUbicacionChange({
      departamento: departamento?.nombre || '',
      provincia: provincia?.nombre || '',
      distrito: ''
    })
  }

  const handleDistritoChange = (distritoId: string) => {
    setDistritoSeleccionado(distritoId)
    
    // Obtener nombres completos
    const departamento = departamentos.find(d => d.id === departamentoSeleccionado)
    const provincia = provincias.find(p => p.id === provinciaSeleccionada)
    const distrito = distritos.find(d => d.id === distritoId)
    
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
              departamentos.find(d => d.id === departamentoSeleccionado)?.nombre || '') : ''}
          >
            <SelectValue placeholder="Seleccionar departamento" />
          </SelectTrigger>
          <SelectContent>
            {departamentos.map((departamento) => (
              <SelectItem key={departamento.id} value={departamento.id}>
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
              provincias.find(p => p.id === provinciaSeleccionada)?.nombre || '') : ''}
          >
            <SelectValue placeholder="Seleccionar provincia" />
          </SelectTrigger>
          <SelectContent>
            {provincias.map((provincia) => (
              <SelectItem key={provincia.id} value={provincia.id}>
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
              distritos.find(d => d.id === distritoSeleccionado)?.nombre || '') : ''}
          >
            <SelectValue placeholder="Seleccionar distrito" />
          </SelectTrigger>
          <SelectContent>
            {distritos.map((distrito) => (
              <SelectItem key={distrito.id} value={distrito.id}>
                {distrito.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
