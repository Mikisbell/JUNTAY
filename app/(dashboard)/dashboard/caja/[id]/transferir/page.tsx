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

      // Obtener otras cajas disponibles (sin filtro de activa primero)
      const { data: cajasData, error: cajasError } = await supabase
        .from('cajas')
        .select('*')
        .neq('id', params.id)

      if (cajasError) {
        console.error('❌ Error cajas destino:', cajasError)
        throw cajasError
      }

      console.log('📦 Cajas disponibles:', cajasData)
      console.log('📊 Total cajas encontradas:', cajasData?.length || 0)
      
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

      // Obtener sesiones activas de ambas cajas
      const { data: sesionOrigen } = await supabase
        .from('sesiones_caja')
        .select('*')
        .eq('caja_id', params.id)
        .eq('estado', 'abierta')
        .single()

      const { data: sesionDestino } = await supabase
        .from('sesiones_caja')
        .select('*')
        .eq('caja_id', cajaDestinoId)
        .eq('estado', 'abierta')
        .single()

      if (!sesionOrigen) {
        throw new Error('La caja origen debe estar abierta')
      }

      if (!sesionDestino) {
        throw new Error('La caja destino debe estar abierta')
      }

      // Calcular saldos actuales
      const saldoOrigen = sesionOrigen.monto_inicial + 
                         (sesionOrigen.total_ingresos || 0) - 
                         (sesionOrigen.total_egresos || 0)

      if (saldoOrigen < montoNum) {
        throw new Error(`Saldo insuficiente. Disponible: S/ ${saldoOrigen.toFixed(2)}`)
      }

      const saldoDestino = sesionDestino.monto_inicial + 
                          (sesionDestino.total_ingresos || 0) - 
                          (sesionDestino.total_egresos || 0)

      // Crear movimiento de salida (caja origen)
      await supabase
        .from('movimientos_caja')
        .insert([{
          sesion_id: sesionOrigen.id,
          caja_id: params.id,
          tipo: 'transferencia_salida',
          concepto: concepto || 'transferencia_entre_cajas',
          monto: montoNum,
          saldo_anterior: saldoOrigen,
          saldo_nuevo: saldoOrigen - montoNum,
          descripcion: `Transferencia a ${cajasDestino.find(c => c.id === cajaDestinoId)?.nombre}. ${observaciones}`,
          referencia_codigo: `TRANS-${Date.now()}`,
          usuario_id: user?.id,
          fecha: new Date().toISOString()
        }])

      // Crear movimiento de entrada (caja destino)
      await supabase
        .from('movimientos_caja')
        .insert([{
          sesion_id: sesionDestino.id,
          caja_id: cajaDestinoId,
          tipo: 'transferencia_entrada',
          concepto: concepto || 'transferencia_entre_cajas',
          monto: montoNum,
          saldo_anterior: saldoDestino,
          saldo_nuevo: saldoDestino + montoNum,
          descripcion: `Transferencia desde ${cajaOrigen?.nombre}. ${observaciones}`,
          referencia_codigo: `TRANS-${Date.now()}`,
          usuario_id: user?.id,
          fecha: new Date().toISOString()
        }])

      // Actualizar totales de sesiones
      await supabase
        .from('sesiones_caja')
        .update({
          total_egresos: (sesionOrigen.total_egresos || 0) + montoNum,
          total_movimientos: (sesionOrigen.total_movimientos || 0) + 1
        })
        .eq('id', sesionOrigen.id)

      await supabase
        .from('sesiones_caja')
        .update({
          total_ingresos: (sesionDestino.total_ingresos || 0) + montoNum,
          total_movimientos: (sesionDestino.total_movimientos || 0) + 1
        })
        .eq('id', sesionDestino.id)

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
                        No hay otras cajas disponibles
                      </div>
                    ) : (
                      cajasDestino.map((caja) => (
                        <SelectItem key={caja.id} value={caja.id}>
                          {caja.nombre} - {caja.codigo}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {cajasDestino.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Necesitas crear más cajas para realizar transferencias
                  </p>
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
