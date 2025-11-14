import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCajas, getSaldoActualCaja, getCajaGeneral, getMovimientosCajaGeneral } from '@/lib/api/cajas'
import { DollarSign, TrendingUp, TrendingDown, Clock, Vault, Building2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CajaPage() {
  const cajas = await getCajas()
  const cajaGeneral = await getCajaGeneral()
  const movimientosCajaGeneral = await getMovimientosCajaGeneral(5)
  
  // Obtener saldo actual de cada caja y determinar estado real
  const cajasConSaldo = await Promise.all(
    cajas.map(async (caja) => {
      const saldo = await getSaldoActualCaja(caja.id!)
      // Estado real basado en si tiene sesión activa
      const estadoReal = saldo.tiene_sesion_abierta ? 'abierta' : 'cerrada'
      return { 
        ...caja, 
        ...saldo,
        estado: estadoReal // Sobrescribir estado con el real
      }
    })
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Control de Caja</h1>
          <p className="text-gray-600 mt-1">Gestión de cajas y movimientos diarios</p>
        </div>
      </div>

      {/* Caja General (Bóveda Central) */}
      {cajaGeneral && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Vault className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">{cajaGeneral.codigo}</p>
                <CardTitle className="text-xl text-blue-800">{cajaGeneral.nombre}</CardTitle>
                <p className="text-xs text-blue-600">🏪 Bóveda Central - Casa de Empeño</p>
              </div>
            </div>
            <Badge variant="default" className="bg-blue-600">
              <Building2 className="h-3 w-3 mr-1" />
              Activa
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Saldos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/70 p-4 rounded-lg border">
                <p className="text-sm text-gray-600 font-medium">💰 Saldo Total</p>
                <p className="text-2xl font-bold text-green-600">
                  S/ {cajaGeneral.saldo_total.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border">
                <p className="text-sm text-gray-600 font-medium">✅ Disponible</p>
                <p className="text-2xl font-bold text-blue-600">
                  S/ {cajaGeneral.saldo_disponible.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border">
                <p className="text-sm text-gray-600 font-medium">📤 Asignado</p>
                <p className="text-2xl font-bold text-orange-600">
                  S/ {cajaGeneral.saldo_asignado.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Últimos Movimientos */}
            {movimientosCajaGeneral.length > 0 && (
              <div className="bg-white/70 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Últimos Movimientos
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {movimientosCajaGeneral.slice(0, 3).map((mov) => (
                    <div key={mov.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{mov.concepto}</span>
                        <p className="text-xs text-gray-500">{mov.descripcion?.slice(0, 50)}...</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${
                          mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto') 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto') ? '-' : '+'}
                          S/ {mov.monto.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500">
                          {mov.fecha ? new Date(mov.fecha).toLocaleDateString() : 'Sin fecha'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2">
              <Link href="/dashboard/caja-general" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                  <Vault className="h-4 w-4 mr-2" />
                  Ver Caja General
                </Button>
              </Link>
              <Link href="/dashboard/caja-general/operaciones" className="flex-1">
                <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50" size="sm">
                  🏪 Operaciones de Empeño
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de Cajas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cajasConSaldo.map((caja) => (
          <Card key={caja.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <p className="text-sm text-gray-600">{caja.codigo}</p>
                <CardTitle className="text-xl">{caja.nombre}</CardTitle>
              </div>
              <Badge
                variant={
                  caja.estado === 'abierta'
                    ? 'default'
                    : caja.estado === 'cerrada'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {caja.estado === 'abierta' ? '🟢 Abierta' : '🔴 Cerrada'}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Saldo Actual */}
              <div>
                <p className="text-sm text-gray-600">Saldo Actual</p>
                <p className="text-3xl font-bold text-green-600">
                  S/ {caja.saldo.toFixed(2)}
                </p>
              </div>

              {/* Información adicional si está abierta */}
              {caja.tiene_sesion_abierta && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Ingresos
                    </p>
                    <p className="font-semibold text-green-600">
                      S/ {caja.total_ingresos.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Egresos
                    </p>
                    <p className="font-semibold text-red-600">
                      S/ {caja.total_egresos.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* Ubicación */}
              {caja.ubicacion && (
                <p className="text-sm text-gray-600">📍 {caja.ubicacion}</p>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-2">
                {caja.estado === 'cerrada' ? (
                  <Link href={`/dashboard/caja/${caja.id}/abrir`} className="flex-1">
                    <Button className="w-full" size="sm">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Abrir Caja
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href={`/dashboard/caja/${caja.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        Ver Movimientos
                      </Button>
                    </Link>
                    <Link href={`/dashboard/caja/${caja.id}/cerrar`} className="flex-1">
                      <Button variant="destructive" className="w-full" size="sm">
                        Cerrar Caja
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen del Día */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total en Cajas</p>
              <p className="text-2xl font-bold text-blue-700">
                S/ {cajasConSaldo.reduce((sum, c) => sum + c.saldo, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Ingresos del Día</p>
              <p className="text-2xl font-bold text-green-700">
                S/ {cajasConSaldo.reduce((sum, c) => sum + (c.total_ingresos || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Egresos del Día</p>
              <p className="text-2xl font-bold text-red-700">
                S/ {cajasConSaldo.reduce((sum, c) => sum + (c.total_egresos || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Cajas Abiertas</p>
              <p className="text-2xl font-bold text-purple-700">
                {cajasConSaldo.filter(c => c.estado === 'abierta').length} / {cajasConSaldo.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
