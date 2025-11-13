'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, PlusCircle, Loader2, Banknote } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { BilleteraDesglose } from '@/lib/api/cajas'

export default function ReposicionCajaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [caja, setCaja] = useState<any>(null)
  const [tipoReposicion, setTipoReposicion] = useState('efectivo')
  const [origenFondos, setOrigenFondos] = useState('caja_principal')
  const [observaciones, setObservaciones] = useState('')
  
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

  useEffect(() => {
    cargarCaja()
  }, [])

  async function cargarCaja() {
    try {
      const { data: cajaData } = await supabase
        .from('cajas')
        .select('*')
        .eq('id', params.id)
        .single()

      setCaja(cajaData)
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
      const total = calcularTotal()
      
      if (total <= 0) {
        throw new Error('El monto de reposición debe ser mayor a 0')
      }

      const { data: { user } } = await supabase.auth.getUser()

      // Obtener sesión activa
      const { data: sesion } = await supabase
        .from('sesiones_caja')
        .select('*')
        .eq('caja_id', params.id)
        .eq('estado', 'abierta')
        .single()

      if (!sesion) {
        throw new Error('La caja debe estar abierta para realizar reposición')
      }

      const saldoAnterior = sesion.monto_inicial + 
                           (sesion.total_ingresos || 0) - 
                           (sesion.total_egresos || 0)

      // Registrar movimiento de reposición
      await supabase
        .from('movimientos_caja')
        .insert([{
          sesion_id: sesion.id,
          caja_id: params.id,
          tipo: 'reposicion_entrada',
          concepto: `reposicion_${origenFondos}`,
          monto: total,
          saldo_anterior: saldoAnterior,
          saldo_nuevo: saldoAnterior + total,
          descripcion: `Reposición de efectivo desde ${origenFondos.replace('_', ' ')}. ${observaciones}`,
          referencia_codigo: `REP-${Date.now()}`,
          usuario_id: user?.id,
          fecha: new Date().toISOString()
        }])

      // Actualizar totales de sesión
      await supabase
        .from('sesiones_caja')
        .update({
          total_ingresos: (sesion.total_ingresos || 0) + total,
          total_movimientos: (sesion.total_movimientos || 0) + 1
        })
        .eq('id', sesion.id)

      // Crear arqueo de reposición
      await supabase
        .from('arqueos_caja')
        .insert([{
          sesion_id: sesion.id,
          caja_id: params.id,
          tipo: 'intermedio',
          monto_sistema: saldoAnterior + total,
          monto_contado: saldoAnterior + total,
          diferencia: 0,
          ...billetes,
          detalle_efectivo: billetes,
          observaciones: `Reposición: ${observaciones}`,
          realizado_por: user?.id,
          fecha: new Date().toISOString()
        }])

      // Redirigir con éxito
      router.push(`/dashboard/caja/${params.id}?success=Reposición realizada exitosamente`)
      router.refresh()
    } catch (err: any) {
      console.error('Error en reposición:', err)
      setError(err.message || 'Error al realizar la reposición')
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

  const total = calcularTotal()

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
          <h1 className="text-3xl font-bold">Reposición de Efectivo</h1>
          <p className="text-gray-600 mt-1">{caja?.nombre} - {caja?.codigo}</p>
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
              <p className="text-sm text-green-700 font-medium mb-2">MONTO DE REPOSICIÓN</p>
              <p className="text-5xl font-bold text-green-800">
                S/ {total.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Reposición */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Configuración de Reposición
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipoReposicion">Tipo de Reposición</Label>
              <Select value={tipoReposicion} onValueChange={setTipoReposicion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="cambio_denominacion">Cambio de Denominación</SelectItem>
                  <SelectItem value="fondo_emergencia">Fondo de Emergencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="origenFondos">Origen de Fondos</Label>
              <Select value={origenFondos} onValueChange={setOrigenFondos}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caja_principal">Caja Principal</SelectItem>
                  <SelectItem value="cuenta_corriente">Cuenta Corriente Empresa</SelectItem>
                  <SelectItem value="boveda_banco">Bóveda del Banco</SelectItem>
                  <SelectItem value="transferencia_sucursal">Transferencia Sucursal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Desglose de Efectivo */}
        <Card>
          <CardHeader>
            <CardTitle>Desglose de Efectivo a Reponer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Billetes */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Billetes
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
              placeholder="Detalles de la reposición, autorización, etc..."
            />
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Link href={`/dashboard/caja/${params.id}`} className="flex-1">
            <Button type="button" variant="outline" className="w-full" disabled={saving}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="flex-1" disabled={saving || total <= 0}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Realizar Reposición
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
