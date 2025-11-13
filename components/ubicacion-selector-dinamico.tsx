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
  obtenerDepartamentosDinamicos,
  obtenerProvinciasPorDepartamentoDinamico,
  obtenerDistritosPorProvinciaDinamico
} from '@/lib/api/ubicaciones-dinamicas'

interface UbicacionSelectorDinamicoProps {
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

export function UbicacionSelectorDinamico({
  departamentoInicial = '',
  provinciaInicial = '',
  distritoInicial = '',
  onUbicacionChange,
  getCampoStyle,
  disabled = false
}: UbicacionSelectorDinamicoProps) {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('')
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('')
  const [distritoSeleccionado, setDistritoSeleccionado] = useState('')
  
  const [departamentos, setDepartamentos] = useState<string[]>([])
  const [provincias, setProvincias] = useState<string[]>([])
  const [distritos, setDistritos] = useState<string[]>([])
  
  const [loadingProvincias, setLoadingProvincias] = useState(false)
  const [loadingDistritos, setLoadingDistritos] = useState(false)

  // Cargar departamentos al inicio
  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        const departamentosData = await obtenerDepartamentosDinamicos()
        setDepartamentos(departamentosData)
      } catch (error) {
        console.error('Error cargando departamentos:', error)
      }
    }
    
    cargarDepartamentos()
  }, [])

  // Inicializar con valores iniciales si existen
  useEffect(() => {
    if (departamentoInicial && departamentos.length > 0) {
      const deptEncontrado = departamentos.find(d => 
        d.toLowerCase().includes(departamentoInicial.toLowerCase())
      )
      if (deptEncontrado) {
        setDepartamentoSeleccionado(deptEncontrado)
        cargarProvincias(deptEncontrado)
      }
    }
  }, [departamentoInicial, departamentos])

  const cargarProvincias = async (departamento: string) => {
    if (!departamento) return
    
    setLoadingProvincias(true)
    try {
      const provinciasData = await obtenerProvinciasPorDepartamentoDinamico(departamento)
      setProvincias(provinciasData)
      
      // Si hay provincia inicial, seleccionarla
      if (provinciaInicial) {
        const provEncontrada = provinciasData.find(p => 
          p.toLowerCase().includes(provinciaInicial.toLowerCase())
        )
        if (provEncontrada) {
          setProvinciaSeleccionada(provEncontrada)
          cargarDistritos(departamento, provEncontrada)
        }
      }
    } catch (error) {
      console.error('Error cargando provincias:', error)
    } finally {
      setLoadingProvincias(false)
    }
  }

  const cargarDistritos = async (departamento: string, provincia: string) => {
    if (!departamento || !provincia) return
    
    setLoadingDistritos(true)
    try {
      const distritosData = await obtenerDistritosPorProvinciaDinamico(departamento, provincia)
      setDistritos(distritosData)
      
      // Si hay distrito inicial, seleccionarlo
      if (distritoInicial) {
        const distEncontrado = distritosData.find(d => 
          d.toLowerCase().includes(distritoInicial.toLowerCase())
        )
        if (distEncontrado) {
          setDistritoSeleccionado(distEncontrado)
        }
      }
    } catch (error) {
      console.error('Error cargando distritos:', error)
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
          disabled={disabled}
        >
          <SelectTrigger 
            className={getCampoStyle ? getCampoStyle('departamento', departamentoSeleccionado) : ''}
          >
            <SelectValue placeholder="Seleccionar departamento" />
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
