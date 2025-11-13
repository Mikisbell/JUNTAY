'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, DollarSign, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { BilleteraDesglose } from '@/lib/api/cajas'

export default function AbrirCajaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [billetes, setBilletes] = useState<BilleteraDesglose>({
    billetes_200: 0,
    billetes_100: 0,
    billetes_50: 0,
    billetes_20: 0,
    billetes_10: 0,
    monedas_5: 0,
    monedas_2: 0,
    monedas_1: 0,
    monedas_050: 0,
    monedas_020: 0,
    monedas_010: 0,
  })
  
  const [observaciones, setObservaciones] = useState('')

  const calcularTotal = () => {
    return (
      billetes.billetes_200 * 200 +
      billetes.billetes_100 * 100 +
      billetes.billetes_50 * 50 +
      billetes.billetes_20 * 20 +
      billetes.billetes_10 * 10 +
      billetes.monedas_5 * 5 +
      billetes.monedas_2 * 2 +
      billetes.monedas_1 * 1 +
      billetes.monedas_050 * 0.50 +
      billetes.monedas_020 * 0.20 +
      billetes.monedas_010 * 0.10
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const total = calcularTotal()
      
      if (total <= 0) {
        throw new Error('El monto inicial debe ser mayor a 0')
      }

      // Obtener último número de sesión
      const { data: ultimaSesion } = await supabase
        .from('sesiones_caja')
        .select('numero_sesion')
        .eq('caja_id', params.id)
        .order('numero_sesion', { ascending: false })
        .limit(1)
        .single()
      
      const numeroSesion = (ultimaSesion?.numero_sesion || 0) + 1

      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      
      // Crear sesión
      const { data: sesion, error: sesionError } = await supabase
        .from('sesiones_caja')
        .insert([{
          caja_id: params.id,
          numero_sesion: numeroSesion,
          fecha_apertura: new Date().toISOString(),
          usuario_apertura_id: user?.id || null,
          monto_inicial: total,
          billetes_apertura: billetes,
          observaciones_apertura: observaciones || null,
          estado: 'abierta',
          total_ingresos: 0,
          total_egresos: 0,
          total_movimientos: 0
        }])
        .select()
        .single()

      if (sesionError) {
        console.error('Error al crear sesión:', sesionError)
        throw new Error(`Error al crear sesión: ${sesionError.message}`)
      }

      // Actualizar estado de caja
      const { error: cajaError } = await supabase
        .from('cajas')
        .update({
          estado: 'abierta',
          fecha_ultima_apertura: new Date().toISOString(),
          responsable_actual_id: user?.id || null
        })
        .eq('id', params.id)

      if (cajaError) {
        console.error('Error al actualizar caja:', cajaError)
        throw new Error(`Error al actualizar caja: ${cajaError.message}`)
      }

      // Registrar movimiento de apertura
      const { error: movError } = await supabase
        .from('movimientos_caja')
        .insert([{
          sesion_id: sesion.id,
          caja_id: params.id,
          tipo: 'apertura',
          concepto: 'apertura_caja',
          monto: total,
          saldo_anterior: 0,
          saldo_nuevo: total,
          descripcion: 'Apertura de caja',
          usuario_id: user?.id || null,
          fecha: new Date().toISOString()
        }])

      if (movError) {
        console.error('Error al crear movimiento:', movError)
        throw new Error(`Error al crear movimiento: ${movError.message}`)
      }

      // Crear arqueo de apertura
      const { error: arqueoError } = await supabase
        .from('arqueos_caja')
        .insert([{
          sesion_id: sesion.id,
          caja_id: params.id,
          tipo: 'apertura',
          monto_sistema: total,
          monto_contado: total,
          diferencia: 0,
          ...billetes,
          detalle_efectivo: billetes,
          realizado_por: user?.id || null,
          fecha: new Date().toISOString()
        }])

      if (arqueoError) {
        console.error('Error al crear arqueo:', arqueoError)
        throw new Error(`Error al crear arqueo: ${arqueoError.message}`)
      }

      // Esperar un momento antes de redirigir para asegurar que la transacción se complete
      console.log('Sesión creada exitosamente:', sesion)
      
      // Verificar que la sesión se creó correctamente
      const { data: verificacion } = await supabase
        .from('sesiones_caja')
        .select('*')
        .eq('id', sesion.id)
        .single()
      
      console.log('Verificación de sesión:', verificacion)
      
      // Esperar 1 segundo antes de redirigir
      setTimeout(() => {
        router.push(`/dashboard/caja/${params.id}`)
        router.refresh()
      }, 1000)
    } catch (err: any) {
      console.error('Error al abrir caja:', err)
      setError(err.message || 'Error al abrir la caja')
    } finally {
      setLoading(false)
    }
  }

  const total = calcularTotal()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/caja">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Abrir Caja</h1>
          <p className="text-gray-600 mt-1">Registra el efectivo inicial de la caja</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Total Calculado */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium mb-2">MONTO INICIAL DE CAJA</p>
              <p className="text-5xl font-bold text-green-800">
                S/ {total.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Desglose de Billetes */}
        <Card>
          <CardHeader>
            <CardTitle>Desglose de Efectivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Billetes */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                💵 Billetes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'S/ 200', key: 'billetes_200', valor: 200 },
                  { label: 'S/ 100', key: 'billetes_100', valor: 100 },
                  { label: 'S/ 50', key: 'billetes_50', valor: 50 },
                  { label: 'S/ 20', key: 'billetes_20', valor: 20 },
                  { label: 'S/ 10', key: 'billetes_10', valor: 10 },
                ].map(({ label, key, valor }) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={billetes[key as keyof BilleteraDesglose]}
                      onChange={(e) => setBilletes({
                        ...billetes,
                        [key]: parseInt(e.target.value) || 0
                      })}
                      className="text-right"
                    />
                    <p className="text-xs text-gray-600 text-right">
                      = S/ {(billetes[key as keyof BilleteraDesglose] * valor).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monedas */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                🪙 Monedas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'S/ 5', key: 'monedas_5', valor: 5 },
                  { label: 'S/ 2', key: 'monedas_2', valor: 2 },
                  { label: 'S/ 1', key: 'monedas_1', valor: 1 },
                  { label: 'S/ 0.50', key: 'monedas_050', valor: 0.50 },
                  { label: 'S/ 0.20', key: 'monedas_020', valor: 0.20 },
                  { label: 'S/ 0.10', key: 'monedas_010', valor: 0.10 },
                ].map(({ label, key, valor }) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={billetes[key as keyof BilleteraDesglose]}
                      onChange={(e) => setBilletes({
                        ...billetes,
                        [key]: parseInt(e.target.value) || 0
                      })}
                      className="text-right"
                    />
                    <p className="text-xs text-gray-600 text-right">
                      = S/ {(billetes[key as keyof BilleteraDesglose] * valor).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Observaciones (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[100px] p-3 border rounded-lg"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas adicionales sobre la apertura de caja..."
            />
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Link href="/dashboard/caja" className="flex-1">
            <Button type="button" variant="outline" className="w-full" disabled={loading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="flex-1" disabled={loading || total <= 0}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Abriendo Caja...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Abrir Caja
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
