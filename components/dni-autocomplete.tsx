'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader2, Search, User } from 'lucide-react'
import { consultarRENIEC, verificarDNIExistente, validarFormatoDNI, generarSugerenciasCorrecion } from '@/lib/api/reniec'
import { toast } from 'sonner'

interface DNIAutoCompleteProps {
  onDatosObtenidos?: (datos: any) => void
  onClienteExistente?: (clienteId: string, nombre: string) => void
  disabled?: boolean
  valorInicial?: string
  className?: string
}

interface EstadoConsulta {
  estado: 'inicial' | 'consultando' | 'completado' | 'error' | 'existente'
  datos?: any
  error?: string
  clienteExistente?: { id: string, nombre: string }
}

export function DNIAutoComplete({
  onDatosObtenidos,
  onClienteExistente, 
  disabled = false,
  valorInicial = '',
  className = ''
}: DNIAutoCompleteProps) {
  const [dni, setDni] = useState(valorInicial)
  const [consulta, setConsulta] = useState<EstadoConsulta>({ estado: 'inicial' })
  const [sugerencias, setSugerencias] = useState<string[]>([])

  useEffect(() => {
    if (dni.length > 0) {
      const nuevasSugerencias = generarSugerenciasCorrecion(dni)
      setSugerencias(nuevasSugerencias)
    } else {
      setSugerencias([])
    }
  }, [dni])

  const handleDNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 8) // Solo números, máx 8
    setDni(valor)
    
    // Reset estado si cambia DNI
    if (consulta.estado !== 'inicial') {
      setConsulta({ estado: 'inicial' })
    }
  }

  const consultarDNI = async () => {
    if (!validarFormatoDNI(dni)) {
      toast.error('DNI debe tener exactamente 8 dígitos')
      return
    }

    setConsulta({ estado: 'consultando' })

    try {
      // Primero verificar si ya existe en nuestro sistema
      const verificacion = await verificarDNIExistente(dni)
      
      if (verificacion.existe && verificacion.cliente_id) {
        setConsulta({
          estado: 'existente',
          clienteExistente: {
            id: verificacion.cliente_id,
            nombre: verificacion.nombre_completo || 'Cliente Existente'
          }
        })
        
        toast.warning(`Cliente ya registrado: ${verificacion.nombre_completo}`)
        onClienteExistente?.(verificacion.cliente_id, verificacion.nombre_completo || '')
        return
      }

      // Si no existe, consultar RENIEC
      const response = await consultarRENIEC(dni)
      
      if (response.success && response.data) {
        setConsulta({
          estado: 'completado',
          datos: response.data
        })
        
        toast.success(`Datos obtenidos: ${response.data.nombre_completo}`)
        onDatosObtenidos?.(response.data)
      } else {
        setConsulta({
          estado: 'error',
          error: response.error || 'No se encontraron datos para este DNI'
        })
        toast.error(response.error || 'DNI no encontrado en RENIEC')
      }

    } catch (error) {
      console.error('Error en consulta DNI:', error)
      setConsulta({
        estado: 'error',
        error: 'Error de conexión. Intente nuevamente.'
      })
      toast.error('Error de conexión con RENIEC')
    }
  }

  const limpiarConsulta = () => {
    setDni('')
    setConsulta({ estado: 'inicial' })
    setSugerencias([])
  }

  const obtenerColorEstado = () => {
    switch (consulta.estado) {
      case 'completado': return 'border-green-500 bg-green-50'
      case 'existente': return 'border-yellow-500 bg-yellow-50'
      case 'error': return 'border-red-500 bg-red-50'
      case 'consultando': return 'border-blue-500 bg-blue-50'
      default: return validarFormatoDNI(dni) ? 'border-green-300' : 'border-gray-300'
    }
  }

  const obtenerIconoEstado = () => {
    switch (consulta.estado) {
      case 'completado': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'existente': return <User className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'consultando': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      default: return validarFormatoDNI(dni) ? <CheckCircle className="h-4 w-4 text-green-600" /> : null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input DNI */}
      <div className="space-y-2">
        <Label htmlFor="dni">DNI</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="dni"
              value={dni}
              onChange={handleDNIChange}
              placeholder="Ingrese DNI (8 dígitos)"
              maxLength={8}
              disabled={disabled || consulta.estado === 'consultando'}
              className={`pr-10 ${obtenerColorEstado()}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {obtenerIconoEstado()}
            </div>
          </div>
          
          <Button
            onClick={consultarDNI}
            disabled={!validarFormatoDNI(dni) || disabled || consulta.estado === 'consultando'}
            variant="outline"
          >
            {consulta.estado === 'consultando' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Consultar
              </>
            )}
          </Button>

          {consulta.estado !== 'inicial' && (
            <Button
              onClick={limpiarConsulta}
              variant="ghost"
              size="sm"
            >
              Limpiar
            </Button>
          )}
        </div>

        {/* Sugerencias de corrección */}
        {sugerencias.length > 0 && (
          <div className="text-sm text-amber-600">
            💡 {sugerencias.join(', ')}
          </div>
        )}
      </div>

      {/* Mensaje de éxito simple */}
      {consulta.estado === 'completado' && consulta.datos && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          <CheckCircle className="h-4 w-4" />
          <span>Datos RENIEC obtenidos - Campos rellenados automáticamente</span>
        </div>
      )}

      {/* Cliente existente */}
      {consulta.estado === 'existente' && consulta.clienteExistente && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">
                  Cliente Ya Registrado
                </h4>
                <p className="mt-1 text-sm text-yellow-700">
                  <strong>{consulta.clienteExistente.nombre}</strong>
                </p>
                <p className="mt-1 text-xs text-yellow-600">
                  Este DNI ya está registrado en el sistema
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {consulta.estado === 'error' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">
                  Error en Consulta
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  {consulta.error}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
