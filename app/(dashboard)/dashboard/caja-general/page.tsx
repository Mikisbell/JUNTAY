import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCajaGeneral, getMovimientosCajaGeneral } from '@/lib/api/cajas'
import { ArrowLeft, Vault, TrendingUp, TrendingDown, Clock, Building2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CajaGeneralPage() {
  const cajaGeneral = await getCajaGeneral()
  const movimientos = await getMovimientosCajaGeneral(20)

  if (!cajaGeneral) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/caja">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Caja General</h1>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No se encontró la Caja General. Contacte al administrador.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/caja">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Vault className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800">{cajaGeneral.nombre}</h1>
            <p className="text-gray-600">🏪 Bóveda Central - Casa de Empeño</p>
          </div>
        </div>
      </div>

      {/* Información Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700 flex items-center gap-2">
              💰 Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">
              S/ {cajaGeneral.saldo_total.toFixed(2)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Efectivo total en bóveda
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
              ✅ Disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">
              S/ {cajaGeneral.saldo_disponible.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Para préstamos y asignaciones
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700 flex items-center gap-2">
              📤 Asignado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-700">
              S/ {cajaGeneral.saldo_asignado.toFixed(2)}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              En cajas individuales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Operaciones de Casa de Empeño
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/caja-general/operaciones/prestamo">
              <Button className="w-full h-16 bg-red-600 hover:bg-red-700" variant="default">
                <div className="text-center">
                  <div className="text-lg">💰</div>
                  <div className="text-xs">Otorgar Préstamo</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/caja-general/operaciones/interes">
              <Button className="w-full h-16 bg-green-600 hover:bg-green-700" variant="default">
                <div className="text-center">
                  <div className="text-lg">📈</div>
                  <div className="text-xs">Cobrar Interés</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/caja-general/operaciones/desempeno">
              <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700" variant="default">
                <div className="text-center">
                  <div className="text-lg">🔄</div>
                  <div className="text-xs">Desempeño</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/caja-general/operaciones/remate">
              <Button className="w-full h-16 bg-purple-600 hover:bg-purple-700" variant="default">
                <div className="text-center">
                  <div className="text-lg">🏷️</div>
                  <div className="text-xs">Venta Remate</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Movimientos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movimientos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay movimientos registrados</p>
          ) : (
            <div className="space-y-3">
              {movimientos.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto')
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto') 
                          ? <TrendingDown className="h-4 w-4" />
                          : <TrendingUp className="h-4 w-4" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold">{mov.concepto}</p>
                        <p className="text-sm text-gray-600">{mov.descripcion}</p>
                        <p className="text-xs text-gray-500">
                          {mov.fecha ? new Date(mov.fecha).toLocaleString() : 'Sin fecha'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto')
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto') ? '-' : '+'}
                      S/ {mov.monto.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Saldo: S/ {mov.saldo_nuevo.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
