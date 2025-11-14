import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getMovimientosCajaGeneral } from '@/lib/api/cajas'
import { TrendingUp, TrendingDown, Clock, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function BovedaMovimientosPage() {
  const movimientos = await getMovimientosCajaGeneral(50)

  const movimientosHoy = movimientos.filter(mov => {
    const fechaMov = new Date(mov.fecha || mov.created_at)
    const hoy = new Date()
    return fechaMov.toDateString() === hoy.toDateString()
  })

  const totalIngresos = movimientos
    .filter(mov => !mov.tipo_movimiento.includes('prestamo') && !mov.tipo_movimiento.includes('gasto'))
    .reduce((sum, mov) => sum + mov.monto, 0)

  const totalEgresos = movimientos
    .filter(mov => mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto'))
    .reduce((sum, mov) => sum + mov.monto, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Movimientos de Bóveda</h1>
            <p className="text-gray-600">Historial completo de transacciones</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Resumen del Día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Movimientos Hoy</p>
                <p className="text-2xl font-bold text-blue-800">{movimientosHoy.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-800">
                  S/ {totalIngresos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Egresos</p>
                <p className="text-2xl font-bold text-red-800">
                  S/ {totalEgresos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Balance Neto</p>
                <p className={`text-2xl font-bold ${
                  totalIngresos - totalEgresos >= 0 ? 'text-green-800' : 'text-red-800'
                }`}>
                  S/ {(totalIngresos - totalEgresos).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                totalIngresos - totalEgresos >= 0 ? 'bg-green-200' : 'bg-red-200'
              }`}>
                {totalIngresos - totalEgresos >= 0 ? '📈' : '📉'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Movimientos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial Completo de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movimientos.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin movimientos</h3>
              <p className="text-gray-600">No se han registrado movimientos en la bóveda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {movimientos.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto')
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto') 
                        ? <TrendingDown className="h-5 w-5" />
                        : <TrendingUp className="h-5 w-5" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">{mov.concepto}</h4>
                        <Badge variant={
                          mov.tipo_movimiento.includes('prestamo') ? 'destructive' :
                          mov.tipo_movimiento.includes('pago') ? 'default' :
                          mov.tipo_movimiento.includes('venta') ? 'secondary' : 'outline'
                        }>
                          {mov.tipo_movimiento.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{mov.descripcion}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          📅 {mov.fecha ? new Date(mov.fecha).toLocaleString('es-PE') : 'Sin fecha'}
                        </span>
                        {mov.referencia_externa && (
                          <span>📄 Ref: {mov.referencia_externa.slice(0, 8)}...</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto')
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {mov.tipo_movimiento.includes('prestamo') || mov.tipo_movimiento.includes('gasto') ? '-' : '+'}
                      S/ {mov.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Saldo: S/ {mov.saldo_nuevo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400">
                      Anterior: S/ {mov.saldo_anterior.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
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
