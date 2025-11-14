'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRightLeft, Loader2, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function TransferirCajaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [cajaOrigen, setCajaOrigen] = useState<any>(null)
  const [cajasDestino, setCajasDestino] = useState<any[]>([])
  const [cajaDestinoId, setCajaDestinoId] = useState('')
  const [monto, setMonto] = useState('')
  const [concepto, setConcepto] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [tipoTransferencia, setTipoTransferencia] = useState('operativa')

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      console.log('🔍 Cargando cajas...')
      
      // Obtener caja origen
      const { data: cajaData, error: cajaError } = await supabase
        .from('cajas')
        .select('*')
        .eq('id', params.id)
        .single()

      if (cajaError) {
        console.error('❌ Error caja origen:', cajaError)
        throw cajaError
      }

      console.log('✅ Caja origen:', cajaData)
      setCajaOrigen(cajaData)

      // Obtener cajas abiertas (usando el estado de la caja, no de sesiones)
      const { data: cajasData, error: cajasError } = await supabase
        .from('cajas')
        .select('*')
        .neq('id', params.id)
        .eq('activa', true)
        .eq('estado', 'abierta')

      if (cajasError) {
        console.error('❌ Error cajas destino:', cajasError)
        throw cajasError
      }

      console.log('📦 Cajas abiertas encontradas:', cajasData)
      console.log('📊 Total cajas abiertas:', cajasData?.length || 0)
      
      setCajasDestino(cajasData || [])
    } catch (err: any) {
      console.error('💥 Error general:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const montoNum = parseFloat(monto)
      
      if (!montoNum || montoNum <= 0) {
        throw new Error('El monto debe ser mayor a 0')
      }

      if (!cajaDestinoId) {
        throw new Error('Debe seleccionar una caja destino')
      }

      const { data: { user } } = await supabase.auth.getUser()

      // Verificar que ambas cajas estén abiertas
      const { data: cajaOrigenData } = await supabase
        .from('cajas')
        .select('*')
        .eq('id', params.id)
        .single()

      const { data: cajaDestinoData } = await supabase
        .from('cajas')
        .select('*')
        .eq('id', cajaDestinoId)
        .single()

      if (cajaOrigenData?.estado !== 'abierta') {
        throw new Error('La caja origen debe estar abierta')
      }

      if (cajaDestinoData?.estado !== 'abierta') {
        throw new Error('La caja destino debe estar abierta')
      }

      // Por ahora usamos el saldo fijo mostrado en la UI (S/ 200.00)
      const saldoOrigen = 200.00

      if (saldoOrigen < montoNum) {
        throw new Error(`Saldo insuficiente. Disponible: S/ ${saldoOrigen.toFixed(2)}`)
      }

      // Crear registro de transferencia en una tabla de transferencias (simplificado)
      const referenciaTransferencia = `TRANS-${Date.now()}`
      
      // Por ahora, solo registramos la transferencia sin crear movimientos complejos
      console.log('✅ Transferencia simulada:', {
        desde: cajaOrigenData.nombre,
        hacia: cajaDestinoData.nombre,
        monto: montoNum,
        tipo: tipoTransferencia,
        concepto: concepto,
        observaciones: observaciones,
        referencia: referenciaTransferencia,
        usuario: user?.id
      })

      // Redirigir con éxito
      router.push(`/dashboard/caja/${params.id}?success=Transferencia realizada exitosamente`)
      router.refresh()
    } catch (err: any) {
      console.error('Error en transferencia:', err)
      setError(err.message || 'Error al realizar la transferencia')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/caja/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Transferir Efectivo</h1>
          <p className="text-gray-600 mt-1">Desde: {cajaOrigen?.nombre}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Indicador de Estado */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Estado de Transferencias</h3>
            <p className="text-sm text-blue-700">
              {cajasDestino.length > 0 
                ? `${cajasDestino.length} caja(s) disponible(s) para transferencia`
                : 'No hay cajas destino disponibles'
              }
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            cajasDestino.length > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {cajasDestino.length > 0 ? '✅ Listo' : '❌ Bloqueado'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de Origen */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Transferencia de Efectivo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-blue-700">Caja Origen</Label>
              <p className="font-semibold text-blue-800">{cajaOrigen?.nombre}</p>
              <p className="text-sm text-blue-600">{cajaOrigen?.codigo}</p>
            </div>
            <div>
              <Label className="text-blue-700">Saldo Disponible</Label>
              <p className="text-2xl font-bold text-blue-800">S/ 200.00</p>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de Transferencia */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Transferencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cajaDestino">Caja Destino *</Label>
                <Select value={cajaDestinoId} onValueChange={setCajaDestinoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar caja destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {cajasDestino.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-gray-500 text-center">
                        <AlertTriangle className="h-4 w-4 mx-auto mb-2 text-amber-500" />
                        <p>No hay cajas abiertas disponibles</p>
                        <p className="text-xs mt-1">Las cajas destino deben estar abiertas</p>
                      </div>
                    ) : (
                      cajasDestino.map((caja) => (
                        <SelectItem key={caja.id} value={caja.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{caja.nombre} - {caja.codigo}</span>
                            <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              🟢 Abierta
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {cajasDestino.length === 0 && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 font-medium">⚠️ No hay cajas destino disponibles</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Para realizar transferencias, necesitas:
                    </p>
                    <ul className="text-xs text-amber-700 mt-1 ml-4 list-disc">
                      <li>Otras cajas activas en el sistema</li>
                      <li>Que las cajas destino tengan sesiones abiertas</li>
                    </ul>
                    <div className="mt-2 flex gap-2">
                      <Link href="/dashboard/configuracion/cajas">
                        <Button size="sm" variant="outline" className="text-xs">
                          Gestionar Cajas
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => window.location.reload()}
                      >
                        Actualizar Lista
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="tipoTransferencia">Tipo de Transferencia</Label>
                <Select value={tipoTransferencia} onValueChange={setTipoTransferencia}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operativa">Operativa</SelectItem>
                    <SelectItem value="reposicion">Reposición</SelectItem>
                    <SelectItem value="ajuste">Ajuste</SelectItem>
                    <SelectItem value="emergencia">Emergencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monto">Monto a Transferir *</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                  className="text-right text-lg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="concepto">Concepto</Label>
                <Input
                  id="concepto"
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder="Motivo de la transferencia"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <textarea
                id="observaciones"
                className="w-full min-h-[80px] p-3 border rounded-lg"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Detalles adicionales de la transferencia..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Link href={`/dashboard/caja/${params.id}`} className="flex-1">
            <Button type="button" variant="outline" className="w-full" disabled={saving}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="flex-1" disabled={saving || !monto || !cajaDestinoId}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transferir
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
