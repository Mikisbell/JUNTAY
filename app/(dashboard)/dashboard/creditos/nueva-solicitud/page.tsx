'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { calcularCronograma } from '@/lib/utils/calculos'
import type { Cliente } from '@/lib/api/clientes'
import type { Garantia } from '@/lib/api/garantias'

export default function NuevaSolicitudPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [garantias, setGarantias] = useState<Garantia[]>([])
  const [garantiasDisponibles, setGarantiasDisponibles] = useState<Garantia[]>([])
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    garantia_id: '',
    monto_prestado: '',
    tasa_interes_mensual: '5',
    numero_cuotas: '4',
    frecuencia_pago: 'semanal' as 'diario' | 'semanal' | 'quincenal' | 'mensual',
    fecha_desembolso: new Date().toISOString().split('T')[0],
    observaciones: ''
  })

  const [preview, setPreview] = useState<{
    montoCuota: number
    montoInteres: number
    montoTotal: number
  } | null>(null)

  useEffect(() => {
    loadClientes()
    loadGarantias()
  }, [])

  useEffect(() => {
    if (formData.monto_prestado && formData.numero_cuotas) {
      calcularPreview()
    }
  }, [formData.monto_prestado, formData.tasa_interes_mensual, formData.numero_cuotas, formData.frecuencia_pago])

  const loadClientes = async () => {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })
    
    if (data) setClientes(data)
  }

  const loadGarantias = async () => {
    const { data } = await supabase
      .from('garantias')
      .select('*')
      .eq('estado', 'en_garantia')
      .is('credito_id', null)
      .order('created_at', { ascending: false })
    
    if (data) {
      setGarantias(data)
      setGarantiasDisponibles(data)
    }
  }

  const calcularPreview = () => {
    const monto = parseFloat(formData.monto_prestado)
    const tasa = parseFloat(formData.tasa_interes_mensual)
    const cuotas = parseInt(formData.numero_cuotas)
    
    if (!monto || !tasa || !cuotas) return
    
    const cronograma = calcularCronograma(
      monto,
      tasa,
      cuotas,
      formData.frecuencia_pago,
      new Date(formData.fecha_desembolso)
    )
    
    const montoTotal = cronograma.reduce((sum, c) => sum + c.monto_total, 0)
    const montoInteres = montoTotal - monto
    
    setPreview({
      montoCuota: cronograma[0]?.monto_total || 0,
      montoInteres: montoInteres,
      montoTotal: montoTotal
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.cliente_id || !formData.monto_prestado) {
      setError('Complete los campos requeridos')
      return
    }

    setLoading(true)

    try {
      const monto = parseFloat(formData.monto_prestado)
      const tasa = parseFloat(formData.tasa_interes_mensual)
      const cuotas = parseInt(formData.numero_cuotas)
      
      // Calcular cronograma
      const cronograma = calcularCronograma(
        monto,
        tasa,
        cuotas,
        formData.frecuencia_pago,
        new Date(formData.fecha_desembolso)
      )
      
      const montoTotal = cronograma.reduce((sum, c) => sum + c.monto_total, 0)
      const montoInteres = montoTotal - monto
      
      // Generar código único
      const codigo = `CRE-${Date.now().toString().slice(-8)}`
      
      // Datos del crédito
      const creditoData = {
        codigo,
        cliente_id: formData.cliente_id,
        monto_prestado: monto,
        monto_interes: montoInteres,
        monto_total: montoTotal,
        monto_pagado: 0,
        saldo_pendiente: montoTotal,
        numero_cuotas: cuotas,
        cuotas_pagadas: 0,
        frecuencia_pago: formData.frecuencia_pago,
        monto_cuota: cronograma[0].monto_total,
        tasa_interes_mensual: tasa,
        tasa_mora_diaria: 0.5,
        fecha_desembolso: formData.fecha_desembolso,
        fecha_primer_vencimiento: cronograma[0].fecha_vencimiento,
        fecha_ultimo_vencimiento: cronograma[cronograma.length - 1].fecha_vencimiento,
        estado: 'vigente',
        dias_mora: 0,
        observaciones: formData.observaciones || null,
        empresa_id: null,        // Por ahora NULL - TODO: obtener de contexto
        solicitud_id: null,      // Por ahora NULL - crear solicitud es opcional
        tipo_credito_id: null,   // Por ahora NULL - TODO: agregar selector de tipo
        desembolsado_por: null   // Por ahora NULL - TODO: obtener usuario actual
      }
      
      // Insertar crédito
      const { data: credito, error: creditoError } = await supabase
        .from('creditos')
        .insert([creditoData])
        .select()
        .single()
      
      if (creditoError) throw creditoError
      
      // Insertar cronograma
      const cronogramaData = cronograma.map(cuota => ({
        credito_id: credito.id,
        ...cuota,
        monto_pagado: 0,
        estado: 'pendiente'
      }))
      
      const { error: cronogramaError } = await supabase
        .from('cronograma_pagos')
        .insert(cronogramaData)
      
      if (cronogramaError) throw cronogramaError
      
      // Actualizar garantía si se seleccionó
      if (formData.garantia_id) {
        await supabase
          .from('garantias')
          .update({ credito_id: credito.id })
          .eq('id', formData.garantia_id)
      }
      
      router.push(`/dashboard/creditos/${credito.id}?success=Crédito creado exitosamente`)
      router.refresh()
    } catch (err: any) {
      console.error('Error al crear crédito:', err)
      setError(err.message || 'Error al crear el crédito')
      setLoading(false)
    }
  }

  const clienteSeleccionado = clientes.find(c => c.id === formData.cliente_id)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/creditos">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Solicitud de Crédito</h1>
          <p className="text-gray-600">Registra un nuevo préstamo</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="cliente_id">Seleccionar Cliente *</Label>
              <select
                id="cliente_id"
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                required
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.tipo_persona === 'natural'
                      ? `${cliente.nombres} ${cliente.apellido_paterno} - ${cliente.numero_documento}`
                      : `${cliente.razon_social} - ${cliente.numero_documento}`}
                  </option>
                ))}
              </select>
              {clienteSeleccionado && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md text-sm">
                  <p className="font-medium">
                    {clienteSeleccionado.tipo_persona === 'natural'
                      ? `${clienteSeleccionado.nombres} ${clienteSeleccionado.apellido_paterno}`
                      : clienteSeleccionado.razon_social}
                  </p>
                  <p className="text-gray-600">{clienteSeleccionado.telefono_secundario || clienteSeleccionado.telefono_principal}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Datos del Crédito */}
          <Card>
            <CardHeader>
              <CardTitle>Datos del Crédito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monto_prestado">Monto a Prestar (S/) *</Label>
                  <Input
                    id="monto_prestado"
                    name="monto_prestado"
                    type="number"
                    value={formData.monto_prestado}
                    onChange={handleInputChange}
                    placeholder="1000.00"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tasa_interes_mensual">Tasa de Interés Mensual (%)</Label>
                  <Input
                    id="tasa_interes_mensual"
                    name="tasa_interes_mensual"
                    type="number"
                    value={formData.tasa_interes_mensual}
                    onChange={handleInputChange}
                    placeholder="5.00"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="numero_cuotas">Número de Cuotas *</Label>
                  <Input
                    id="numero_cuotas"
                    name="numero_cuotas"
                    type="number"
                    value={formData.numero_cuotas}
                    onChange={handleInputChange}
                    placeholder="4"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="frecuencia_pago">Frecuencia de Pago *</Label>
                  <select
                    id="frecuencia_pago"
                    name="frecuencia_pago"
                    value={formData.frecuencia_pago}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="fecha_desembolso">Fecha de Desembolso *</Label>
                  <Input
                    id="fecha_desembolso"
                    name="fecha_desembolso"
                    type="date"
                    value={formData.fecha_desembolso}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Garantía */}
          <Card>
            <CardHeader>
              <CardTitle>Garantía (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="garantia_id">Seleccionar Garantía</Label>
              <select
                id="garantia_id"
                name="garantia_id"
                value={formData.garantia_id}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Sin garantía específica</option>
                {garantiasDisponibles.map((garantia) => (
                  <option key={garantia.id} value={garantia.id}>
                    {garantia.nombre} - S/ {garantia.valor_tasacion.toFixed(2)}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                placeholder="Notas adicionales..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview del Crédito */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Resumen del Crédito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {preview ? (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Monto a Prestar</p>
                    <p className="text-2xl font-bold text-blue-600">
                      S/ {parseFloat(formData.monto_prestado).toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Interés Total:</span>
                      <span className="font-medium">S/ {preview.montoInteres.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total a Pagar:</span>
                      <span className="font-medium text-lg">S/ {preview.montoTotal.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cuota {formData.frecuencia_pago}:</span>
                        <span className="font-bold text-green-600 text-lg">
                          S/ {preview.montoCuota.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.numero_cuotas} cuotas
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t text-xs text-gray-600 space-y-1">
                    <p>• Tasa: {formData.tasa_interes_mensual}% mensual</p>
                    <p>• Mora: 0.5% diario</p>
                    <p>• Frecuencia: {formData.frecuencia_pago}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Ingresa el monto y plazo para calcular</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pb-8">
        <Link href="/dashboard/creditos">
          <Button type="button" variant="outline" disabled={loading}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={loading || !preview}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Crear Crédito
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
