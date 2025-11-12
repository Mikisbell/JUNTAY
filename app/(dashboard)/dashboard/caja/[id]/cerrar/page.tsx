'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Lock, Loader2, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { BilleteraDesglose } from '@/lib/api/cajas'

export default function CerrarCajaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [sesion, setSesion] = useState<any>(null)
  const [montoSistema, setMontoSistema] = useState(0)
  
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

  useEffect(() => {
    cargarSesion()
  }, [])

  async function cargarSesion() {
    try {
      // Obtener sesión abierta
      const { data: sesionData, error: sesionError } = await supabase
        .from('sesiones_caja')
        .select('*')
        .eq('caja_id', params.id)
        .eq('estado', 'abierta')
        .single()

      if (sesionError) throw new Error('No hay sesión abierta para esta caja')

      setSesion(sesionData)
      
      // Calcular monto según sistema
      const monto = sesionData.monto_inicial + 
                    (sesionData.total_ingresos || 0) - 
                    (sesionData.total_egresos || 0)
      setMontoSistema(monto)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
    setSaving(true)

    try {
      const montoContado = calcularTotal()
      const diferencia = montoContado - montoSistema
      
      // Determinar estado
      let estadoCierre: 'cerrada' | 'cuadrada' | 'con_diferencia' = 'cerrada'
      if (Math.abs(diferencia) < 0.01) {
        estadoCierre = 'cuadrada'
      } else if (diferencia !== 0) {
        estadoCierre = 'con_diferencia'
      }

      // Actualizar sesión
      const { error: sesionError } = await supabase
        .from('sesiones_caja')
        .update({
          fecha_cierre: new Date().toISOString(),
          monto_sistema: montoSistema,
          monto_contado: montoContado,
          diferencia: diferencia,
          billetes_cierre: billetes,
          observaciones_cierre: observaciones || null,
          estado: estadoCierre,
          updated_at: new Date().toISOString()
        })
        .eq('id', sesion.id)

      if (sesionError) throw sesionError

      // Actualizar estado de caja
      await supabase
        .from('cajas')
        .update({
          estado: 'cerrada',
          fecha_ultimo_cierre: new Date().toISOString()
        })
        .eq('id', params.id)

      // Registrar movimiento de cierre
      await supabase
        .from('movimientos_caja')
        .insert([{
          sesion_id: sesion.id,
          caja_id: params.id,
          tipo: 'cierre',
          concepto: 'cierre_caja',
          monto: 0,
          saldo_anterior: montoSistema,
          saldo_nuevo: 0,
          descripcion: `Cierre de caja. Diferencia: S/ ${diferencia.toFixed(2)}`,
          fecha: new Date().toISOString()
        }])

      // Crear arqueo de cierre
      await supabase
        .from('arqueos_caja')
        .insert([{
          sesion_id: sesion.id,
          caja_id: params.id,
          tipo: 'cierre',
          monto_sistema: montoSistema,
          monto_contado: montoContado,
          diferencia: diferencia,
          ...billetes,
          detalle_efectivo: billetes,
          observaciones: observaciones,
          fecha: new Date().toISOString()
        }])

      // Redirigir con mensaje de éxito
      router.push(`/dashboard/caja?success=Caja cerrada exitosamente. ${estadoCierre === 'cuadrada' ? 'Cuadre perfecto!' : `Diferencia: S/ ${diferencia.toFixed(2)}`}`)
      router.refresh()
    } catch (err: any) {
      console.error('Error al cerrar caja:', err)
      setError(err.message || 'Error al cerrar la caja')
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

  if (error && !sesion) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
              <p className="text-red-700 mb-4">{error}</p>
              <Link href="/dashboard/caja">
                <Button>Volver a Cajas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const montoContado = calcularTotal()
  const diferencia = montoContado - montoSistema
  const esCuadrada = Math.abs(diferencia) < 0.01

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
          <h1 className="text-3xl font-bold">Cerrar Caja</h1>
          <p className="text-gray-600 mt-1">Sesión #{sesion?.numero_sesion} - Conteo final</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Comparación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-700 font-medium mb-2">Monto Inicial</p>
              <p className="text-2xl font-bold text-blue-800">
                S/ {sesion?.monto_inicial.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <p className="text-sm text-purple-700 font-medium mb-2">Según Sistema</p>
              <p className="text-2xl font-bold text-purple-800">
                S/ {montoSistema.toFixed(2)}
              </p>
              <div className="mt-2 text-xs text-purple-600">
                <p>Ingresos: +S/ {(sesion?.total_ingresos || 0).toFixed(2)}</p>
                <p>Egresos: -S/ {(sesion?.total_egresos || 0).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`${esCuadrada ? 'bg-green-50 border-green-200' : diferencia > 0 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
            <CardContent className="pt-6">
              <p className="text-sm font-medium mb-2">Contado Físico</p>
              <p className="text-2xl font-bold">
                S/ {montoContado.toFixed(2)}
              </p>
              {montoContado > 0 && (
                <div className="mt-2">
                  <p className={`text-sm font-semibold ${esCuadrada ? 'text-green-700' : diferencia > 0 ? 'text-orange-700' : 'text-red-700'}`}>
                    {esCuadrada ? '✓ Cuadrada' : diferencia > 0 ? `↑ Sobrante: S/ ${diferencia.toFixed(2)}` : `↓ Faltante: S/ ${Math.abs(diferencia).toFixed(2)}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Desglose de Billetes */}
        <Card>
          <CardHeader>
            <CardTitle>Conteo de Efectivo</CardTitle>
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
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[100px] p-3 border rounded-lg"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder={diferencia !== 0 ? "Explica la razón de la diferencia..." : "Observaciones del cierre (opcional)..."}
            />
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Link href="/dashboard/caja" className="flex-1">
            <Button type="button" variant="outline" className="w-full" disabled={saving}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="flex-1" disabled={saving || montoContado === 0}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cerrando Caja...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Cerrar Caja
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
