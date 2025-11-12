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
    try {
      return new Date(fecha).toLocaleDateString('es-PE')
    } catch {
      return fecha
    }
  }

  return (
    <div className="space-y-4">
      {/* Input y botones */}
      <div>
        <Label htmlFor="ruc_input">RUC *</Label>
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

      {/* Resultados */}
      {consulta.estado === 'completado' && consulta.datos && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-800">
                  Datos SUNAT Obtenidos
                </h4>
                <div className="mt-2 text-sm text-green-700 space-y-1">
                  <p><strong>Razón Social:</strong> {consulta.datos.razon_social}</p>
                  <p><strong>RUC:</strong> {consulta.datos.ruc}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`ml-1 px-2 py-0.5 rounded text-xs ${
                      consulta.datos.estado === 'ACTIVO' 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {consulta.datos.estado}
                    </span>
                  </p>
                  {consulta.datos.direccion && (
                    <p><strong>Dirección:</strong> {consulta.datos.direccion}</p>
                  )}
                  {consulta.datos.distrito && (
                    <p><strong>Ubicación:</strong> {consulta.datos.distrito}, {consulta.datos.provincia}, {consulta.datos.departamento}</p>
                  )}
                  {consulta.datos.actividad_economica && (
                    <p><strong>Actividad:</strong> {consulta.datos.actividad_economica}</p>
                  )}
                  {consulta.datos.representante_legal && (
                    <div className="mt-3 pt-2 border-t border-green-200">
                      <p className="font-medium">Representante Legal:</p>
                      <p><strong>Nombre:</strong> {consulta.datos.representante_legal.nombres}</p>
                      <p><strong>DNI:</strong> {consulta.datos.representante_legal.dni}</p>
                      <p><strong>Cargo:</strong> {consulta.datos.representante_legal.cargo}</p>
                      {consulta.datos.representante_legal.fecha_desde && (
                        <p><strong>Desde:</strong> {formatearFecha(consulta.datos.representante_legal.fecha_desde)}</p>
                      )}
                    </div>
                  )}
                  {consulta.datos.fecha_inscripcion && (
                    <p><strong>Fecha Inscripción:</strong> {formatearFecha(consulta.datos.fecha_inscripcion)}</p>
                  )}
                  {consulta.datos.ubigeo && (
                    <p><strong>Ubigeo:</strong> {consulta.datos.ubigeo}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empresa existente */}
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
