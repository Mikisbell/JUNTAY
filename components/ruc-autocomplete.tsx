'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Search, CheckCircle, AlertCircle, X, Building } from 'lucide-react'

interface ConsultaSUNAT {
  estado: 'inicial' | 'consultando' | 'completado' | 'error' | 'existente'
  datos?: {
    ruc: string
    razon_social: string
    direccion: string
    departamento: string
    provincia: string
    distrito: string
    ubigeo: string
    estado: string
    condicion_domicilio: string
    actividad_economica: string
    fecha_inscripcion: string
    tipo_persona: string
    es_buen_contribuyente: boolean
    representante_legal?: {
      nombres: string
      dni: string
      cargo: string
      fecha_desde: string
    }
  }
  error?: string
  empresaExistente?: {
    id: string
    nombre: string
  }
}

interface RUCAutoCompleteProps {
  onDatosObtenidos: (datos: any) => void
  onEmpresaExistente: (empresaId: string, nombre: string) => void
  valorInicial?: string
  disabled?: boolean
}

export function RUCAutoComplete({
  onDatosObtenidos,
  onEmpresaExistente,
  valorInicial = '',
  disabled = false
}: RUCAutoCompleteProps) {
  const [ruc, setRuc] = useState(valorInicial)
  const [consulta, setConsulta] = useState<ConsultaSUNAT>({ estado: 'inicial' })

  useEffect(() => {
    if (valorInicial) {
      setRuc(valorInicial)
    }
  }, [valorInicial])

  const validarRUC = (ruc: string): boolean => {
    // RUC peruano: 11 dígitos numéricos
    return /^\d{11}$/.test(ruc)
  }

  const consultarRUC = async () => {
    if (!ruc || !validarRUC(ruc)) {
      setConsulta({
        estado: 'error',
        error: 'RUC debe tener 11 dígitos numéricos'
      })
      return
    }

    setConsulta({ estado: 'consultando' })

    try {
      // 1. Verificar si RUC ya existe en sistema
      const verificacion = await fetch('/api/empresas/verificar-ruc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruc })
      })

      if (verificacion.ok) {
        const resultado = await verificacion.json()
        if (resultado.existe) {
          setConsulta({
            estado: 'existente',
            empresaExistente: {
              id: resultado.empresa_id,
              nombre: resultado.razon_social || 'Empresa Existente'
            }
          })
          onEmpresaExistente(resultado.empresa_id, resultado.razon_social || 'Empresa Existente')
          return
        }
      }

      // 2. Consultar SUNAT
      const response = await fetch('/api/sunat/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruc })
      })

      const result = await response.json()

      if (result.success && result.data) {
        setConsulta({
          estado: 'completado',
          datos: result.data
        })
        onDatosObtenidos(result.data)
      } else {
        setConsulta({
          estado: 'error',
          error: result.error || 'RUC no encontrado en registros SUNAT'
        })
      }
    } catch (error) {
      setConsulta({
        estado: 'error',
        error: 'Error de conexión. Intente nuevamente.'
      })
    }
  }

  const limpiar = () => {
    setRuc('')
    setConsulta({ estado: 'inicial' })
  }

  const formatearFecha = (fecha: string): string => {
    if (!fecha) return ''
    
    // Si ya está en formato DD/MM/YYYY, devolverlo como está
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      return fecha
    }
    
    try {
      // Intentar parsear diferentes formatos
      let fechaObj: Date
      
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        // Formato YYYY-MM-DD
        fechaObj = new Date(fecha)
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
        // Formato DD/MM/YYYY
        const [dia, mes, año] = fecha.split('/')
        fechaObj = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia))
      } else {
        // Intentar parsearlo directamente
        fechaObj = new Date(fecha)
      }
      
      if (isNaN(fechaObj.getTime())) {
        return fecha // Devolver original si no se puede parsear
      }
      
      return fechaObj.toLocaleDateString('es-PE')
    } catch {
      return fecha
    }
  }

  return (
    <div className="space-y-4">
      {/* Input y botones */}
      <div>
        <Label htmlFor="ruc_input">RUC (SUNAT) *</Label>
        <p className="text-xs text-gray-500 mb-1">
          Se consultará SUNAT y el sistema JUNTAY para autocompletar los datos de la empresa. Solo RUC peruano de 11 dígitos.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="ruc_input"
              value={ruc}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, '').slice(0, 11)
                setRuc(valor)
                if (consulta.estado !== 'inicial') {
                  setConsulta({ estado: 'inicial' })
                }
              }}
              onBlur={() => {
                if (validarRUC(ruc) && consulta.estado === 'inicial') {
                  void consultarRUC()
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (validarRUC(ruc) && consulta.estado !== 'consultando') {
                    void consultarRUC()
                  }
                }
              }}
              placeholder="20123456789"
              maxLength={11}
              disabled={disabled || consulta.estado === 'consultando'}
              className={`${
                consulta.estado === 'completado'
                  ? 'border-green-300 bg-green-50'
                  : consulta.estado === 'error'
                  ? 'border-red-300 bg-red-50'
                  : consulta.estado === 'existente'
                  ? 'border-yellow-300 bg-yellow-50'
                  : ''
              }`}
            />
            {consulta.estado === 'completado' && (
              <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-600" />
            )}
            {consulta.estado === 'error' && (
              <AlertCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-600" />
            )}
          </div>
          
          <Button
            type="button"
            onClick={consultarRUC}
            disabled={disabled || !ruc || consulta.estado === 'consultando'}
            size="default"
          >
            {consulta.estado === 'consultando' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Consultando
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
              type="button"
              variant="outline"
              onClick={limpiar}
              disabled={disabled}
              size="default"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Error */}
      {consulta.estado === 'error' && consulta.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Error en Consulta</h4>
                <p className="text-sm text-red-700 mt-1">{consulta.error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje de éxito simple (datos desde SUNAT) */}
      {consulta.estado === 'completado' && consulta.datos && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          <Building className="h-4 w-4" />
          <span>
            Datos obtenidos de SUNAT para: <strong>{consulta.datos.razon_social}</strong>
          </span>
        </div>
      )}

      {/* Empresa existente en JUNTAY */}
      {consulta.estado === 'existente' && consulta.empresaExistente && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">
                  Empresa Ya Registrada
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  <strong>Empresa:</strong> {consulta.empresaExistente.nombre}
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  Serás redirigido al perfil de la empresa existente en unos segundos...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
