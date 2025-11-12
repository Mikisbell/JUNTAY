'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function RegistrarPagoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credito, setCredito] = useState<any>(null)
  const [cuotas, setCuotas] = useState<any[]>([])

  const [formData, setFormData] = useState({
    monto_pago: '',
    fecha_pago: new Date().toISOString().split('T')[0],
    metodo_pago: 'efectivo',
    numero_recibo: '',
    observaciones: ''
  })

  useEffect(() => {
    loadCredito()
  }, [params.id])

  const loadCredito = async () => {
    try {
      const { data: creditoData, error: creditoError } = await supabase
        .from('creditos')
        .select('*, clientes(*), cronograma_pagos(*)')
        .eq('id', params.id)
        .single()

      if (creditoError) throw creditoError

      setCredito(creditoData)
      
      // Ordenar cuotas y obtener la primera pendiente
      const cuotasOrdenadas = creditoData.cronograma_pagos.sort((a: any, b: any) => 
        a.numero_cuota - b.numero_cuota
      )
      setCuotas(cuotasOrdenadas)

      // Sugerir el monto de la próxima cuota pendiente
      const cuotaPendiente = cuotasOrdenadas.find((c: any) => c.estado === 'pendiente')
      if (cuotaPendiente) {
        setFormData(prev => ({
          ...prev,
          monto_pago: cuotaPendiente.monto_total.toString()
        }))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
    setSaving(true)

    try {
      const montoPago = parseFloat(formData.monto_pago)
      if (!montoPago || montoPago <= 0) {
        throw new Error('Ingrese un monto válido')
      }

      // Generar código único para el pago
      const codigoPago = `PAG-${Date.now().toString().slice(-8)}`

      // Registrar el pago
      const { data: pagoData, error: pagoError } = await supabase
        .from('pagos')
        .insert([{
          codigo: codigoPago,
          credito_id: params.id,
          tipo_pago: 'cuota',
          metodo_pago: formData.metodo_pago,
          monto_total: montoPago,
          monto_capital: 0, // Se calculará al aplicar a cuotas
          monto_interes: 0, // Se calculará al aplicar a cuotas
          monto_mora: 0,
          fecha_pago: formData.fecha_pago,
          numero_operacion: formData.numero_recibo || null,
          observaciones: formData.observaciones || null,
          cronograma_id: null,     // Por ahora NULL - TODO: vincular a cuota específica
          caja_id: null,           // Por ahora NULL - TODO: agregar selector de caja
          cuenta_bancaria_id: null, // Por ahora NULL - solo si es transferencia
          registrado_por: null     // Por ahora NULL - TODO: obtener usuario actual
        }])
        .select()
        .single()

      if (pagoError) throw pagoError

      // Aplicar el pago a las cuotas pendientes
      let montoRestante = montoPago
      for (const cuota of cuotas) {
        if (montoRestante <= 0) break
        if (cuota.estado === 'pagado') continue

        const saldoCuota = cuota.monto_total - (cuota.monto_pagado || 0)
        const montoAAplicar = Math.min(montoRestante, saldoCuota)
        const nuevoMontoPagado = (cuota.monto_pagado || 0) + montoAAplicar

        // Actualizar cuota
        await supabase
          .from('cronograma_pagos')
          .update({
            monto_pagado: nuevoMontoPagado,
            estado: nuevoMontoPagado >= cuota.monto_total ? 'pagado' : 'parcial',
            fecha_pago: nuevoMontoPagado >= cuota.monto_total ? formData.fecha_pago : null
          })
          .eq('id', cuota.id)

        montoRestante -= montoAAplicar
      }

      // Actualizar el crédito
      const nuevoMontoPagado = (credito.monto_pagado || 0) + montoPago
      const nuevoSaldo = credito.monto_total - nuevoMontoPagado
      const cuotasPagadas = cuotas.filter(c => 
        c.estado === 'pagado' || (c.monto_pagado || 0) >= c.monto_total
      ).length

      await supabase
        .from('creditos')
        .update({
          monto_pagado: nuevoMontoPagado,
          saldo_pendiente: nuevoSaldo,
          cuotas_pagadas: cuotasPagadas,
          fecha_ultimo_pago: formData.fecha_pago,
          estado: nuevoSaldo <= 0 ? 'pagado' : credito.estado
        })
        .eq('id', params.id)

      router.push(`/dashboard/creditos/${params.id}?success=Pago registrado exitosamente`)
      router.refresh()
    } catch (err: any) {
      console.error('Error al registrar pago:', err)
      setError(err.message || 'Error al registrar el pago')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!credito) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Crédito no encontrado</p>
      </div>
    )
  }

  const nombreCliente = credito.clientes?.tipo_persona === 'natural'
    ? `${credito.clientes?.nombres} ${credito.clientes?.apellido_paterno}`
    : credito.clientes?.razon_social

  const cuotasPendientes = cuotas.filter(c => c.estado === 'pendiente' || c.estado === 'parcial')

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/creditos/${params.id}`}>
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registrar Pago</h1>
          <p className="text-gray-600">{credito.codigo} - {nombreCliente}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monto_pago">Monto a Pagar (S/) *</Label>
                  <Input
                    id="monto_pago"
                    name="monto_pago"
                    type="number"
                    value={formData.monto_pago}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fecha_pago">Fecha de Pago *</Label>
                  <Input
                    id="fecha_pago"
                    name="fecha_pago"
                    type="date"
                    value={formData.fecha_pago}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="metodo_pago">Método de Pago *</Label>
                  <select
                    id="metodo_pago"
                    name="metodo_pago"
                    value={formData.metodo_pago}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="deposito">Depósito</option>
                    <option value="yape">Yape</option>
                    <option value="plin">Plin</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="numero_recibo">Número de Recibo</Label>
                  <Input
                    id="numero_recibo"
                    name="numero_recibo"
                    value={formData.numero_recibo}
                    onChange={handleInputChange}
                    placeholder="REC-001"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
                  placeholder="Notas adicionales..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Cuotas Pendientes */}
          <Card>
            <CardHeader>
              <CardTitle>Cuotas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              {cuotasPendientes.length > 0 ? (
                <div className="space-y-2">
                  {cuotasPendientes.map((cuota) => {
                    const saldo = cuota.monto_total - (cuota.monto_pagado || 0)
                    return (
                      <div key={cuota.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">Cuota #{cuota.numero_cuota}</p>
                          <p className="text-sm text-gray-600">
                            Vence: {new Date(cuota.fecha_vencimiento).toLocaleDateString('es-PE')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">S/ {saldo.toFixed(2)}</p>
                          {cuota.estado === 'parcial' && (
                            <p className="text-xs text-orange-600">
                              Pagado: S/ {cuota.monto_pagado.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-green-600">
                  <p>✅ Todas las cuotas están pagadas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto Total:</span>
                  <span className="font-medium">S/ {credito.monto_total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pagado:</span>
                  <span className="font-medium text-green-600">
                    S/ {(credito.monto_pagado || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">Saldo:</span>
                  <span className="font-bold text-orange-600 text-lg">
                    S/ {credito.saldo_pendiente.toFixed(2)}
                  </span>
                </div>
              </div>

              {formData.monto_pago && parseFloat(formData.monto_pago) > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Después del pago:</p>
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-gray-600">Nuevo Saldo</p>
                    <p className="text-2xl font-bold text-blue-600">
                      S/ {Math.max(0, credito.saldo_pendiente - parseFloat(formData.monto_pago)).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-xs text-gray-600 space-y-1">
                <p>• Cuota: S/ {credito.monto_cuota.toFixed(2)}</p>
                <p>• Frecuencia: {credito.frecuencia_pago}</p>
                <p>• Cuotas: {credito.cuotas_pagadas || 0}/{credito.numero_cuotas}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pb-8">
        <Link href={`/dashboard/creditos/${params.id}`}>
          <Button type="button" variant="outline" disabled={saving}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={saving || !formData.monto_pago}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Registrar Pago
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
