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

interface UbicacionSelectorAPIProps {
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

export function UbicacionSelectorAPI({
  departamentoInicial = '',
  provinciaInicial = '',
  distritoInicial = '',
  onUbicacionChange,
  getCampoStyle,
  disabled = false
}: UbicacionSelectorAPIProps) {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(departamentoInicial)
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(provinciaInicial)
  const [distritoSeleccionado, setDistritoSeleccionado] = useState(distritoInicial)
  
  const [departamentos, setDepartamentos] = useState<string[]>([])
  const [provincias, setProvincias] = useState<string[]>([])
  const [distritos, setDistritos] = useState<string[]>([])
  
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false)
  const [loadingProvincias, setLoadingProvincias] = useState(false)
  const [loadingDistritos, setLoadingDistritos] = useState(false)

  // Cargar departamentos al inicio
  useEffect(() => {
    const cargarDepartamentos = async () => {
      setLoadingDepartamentos(true)
      try {
        const response = await fetch('/api/ubicaciones/departamentos')
        const result = await response.json()
        
        if (result.success) {
          setDepartamentos(result.data)
          
          // Si hay departamento inicial, cargarlo
          if (departamentoInicial && result.data.includes(departamentoInicial)) {
            setDepartamentoSeleccionado(departamentoInicial)
            cargarProvincias(departamentoInicial)
          }
        } else {
          console.error('Error cargando departamentos:', result.error)
        }
      } catch (error) {
        console.error('Error cargando departamentos:', error)
      } finally {
        setLoadingDepartamentos(false)
      }
    }
    
    cargarDepartamentos()
  }, [])

  const cargarProvincias = async (departamento: string) => {
    if (!departamento) return
    
    setLoadingProvincias(true)
    try {
      const response = await fetch(`/api/ubicaciones/provincias?departamento=${encodeURIComponent(departamento)}`)
      const result = await response.json()
      
      if (result.success) {
        setProvincias(result.data)
        
        // Si hay provincia inicial, cargarla
        if (provinciaInicial && result.data.includes(provinciaInicial)) {
          setProvinciaSeleccionada(provinciaInicial)
          cargarDistritos(departamento, provinciaInicial)
        }
      } else {
        console.error('Error cargando provincias:', result.error)
        setProvincias([])
      }
    } catch (error) {
      console.error('Error cargando provincias:', error)
      setProvincias([])
    } finally {
      setLoadingProvincias(false)
    }
  }

  const cargarDistritos = async (departamento: string, provincia: string) => {
    if (!departamento || !provincia) return
    
    setLoadingDistritos(true)
    try {
      const response = await fetch(`/api/ubicaciones/distritos?departamento=${encodeURIComponent(departamento)}&provincia=${encodeURIComponent(provincia)}`)
      const result = await response.json()
      
      if (result.success) {
        setDistritos(result.data)
        
        // Si hay distrito inicial, cargarlo
        if (distritoInicial && result.data.includes(distritoInicial)) {
          setDistritoSeleccionado(distritoInicial)
        }
      } else {
        console.error('Error cargando distritos:', result.error)
        setDistritos([])
      }
    } catch (error) {
      console.error('Error cargando distritos:', error)
      setDistritos([])
    } finally {
      setLoadingDistritos(false)
    }
  }

  const handleDepartamentoChange = (departamento: string) => {
    setDepartamentoSeleccionado(departamento)
    setProvinciaSeleccionada('')
    setDistritoSeleccionado('')
    setProvincias([])
    setDistritos([])
    
    cargarProvincias(departamento)
    
    onUbicacionChange({
      departamento,
      provincia: '',
      distrito: ''
    })
  }

  const handleProvinciaChange = (provincia: string) => {
    setProvinciaSeleccionada(provincia)
    setDistritoSeleccionado('')
    setDistritos([])
    
    cargarDistritos(departamentoSeleccionado, provincia)
    
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
          disabled={disabled || loadingDepartamentos}
        >
          <SelectTrigger 
            className={getCampoStyle ? getCampoStyle('departamento', departamentoSeleccionado) : ''}
          >
            <SelectValue placeholder={
              loadingDepartamentos ? "Cargando..." : "Seleccionar departamento"
            } />
          </SelectTrigger>
          <SelectContent>
            {departamentos.map((departamento) => (
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
          disabled={disabled || !departamentoSeleccionado || loadingProvincias}
        >
          <SelectTrigger 
            className={getCampoStyle ? getCampoStyle('provincia', provinciaSeleccionada) : ''}
          >
            <SelectValue placeholder={
              loadingProvincias ? "Cargando..." : "Seleccionar provincia"
            } />
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
          disabled={disabled || !provinciaSeleccionada || loadingDistritos}
        >
          <SelectTrigger 
            className={getCampoStyle ? getCampoStyle('distrito', distritoSeleccionado) : ''}
          >
            <SelectValue placeholder={
              loadingDistritos ? "Cargando..." : "Seleccionar distrito"
            } />
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
