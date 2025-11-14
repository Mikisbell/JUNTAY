import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCajaGeneral, getMovimientosCajaGeneral } from '@/lib/api/cajas'
import { Vault, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BovedaSaldosPage() {
  const cajaGeneral = await getCajaGeneral()
  const movimientosRecientes = await getMovimientosCajaGeneral(10)

  if (!cajaGeneral) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bóveda Central No Inicializada</h2>
          <p className="text-gray-600">Contacte al administrador para configurar la bóveda central.</p>
        </div>
      </div>
    )
  }

  const porcentajeDisponible = (cajaGeneral.saldo_disponible / cajaGeneral.saldo_total) * 100
  const porcentajeAsignado = (cajaGeneral.saldo_asignado / cajaGeneral.saldo_total) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Vault className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bóveda Central - Saldos</h1>
          <p className="text-gray-600">Control y monitoreo de efectivo centralizado</p>
        </div>
      </div>

      {/* Estado General */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Vault className="h-5 w-5" />
              {cajaGeneral.nombre}
            </CardTitle>
            <Badge className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Operativa
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Saldo Total */}
            <div className="bg-white/80 p-6 rounded-xl border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">💰 Saldo Total</h3>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-3xl font-bold text-green-700 mb-1">
                S/ {cajaGeneral.saldo_total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">Efectivo total en bóveda</p>
            </div>

            {/* Saldo Disponible */}
            <div className="bg-white/80 p-6 rounded-xl border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">✅ Disponible</h3>
                <div className={`w-3 h-3 rounded-full ${
                  porcentajeDisponible > 50 ? 'bg-green-500' : 
                  porcentajeDisponible > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
              <p className="text-3xl font-bold text-blue-700 mb-1">
                S/ {cajaGeneral.saldo_disponible.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                {porcentajeDisponible.toFixed(1)}% del total
              </p>
            </div>

            {/* Saldo Asignado */}
            <div className="bg-white/80 p-6 rounded-xl border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">📤 Asignado</h3>
                <div className={`w-3 h-3 rounded-full ${
                  porcentajeAsignado < 50 ? 'bg-green-500' : 
                  porcentajeAsignado < 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
              <p className="text-3xl font-bold text-orange-700 mb-1">
                S/ {cajaGeneral.saldo_asignado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                {porcentajeAsignado.toFixed(1)}% del total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Límites y Configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Límites Configurados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Límite por Asignación</span>
              <span className="font-bold text-gray-900">
                S/ {cajaGeneral.limite_asignacion_individual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Límite Total Asignaciones</span>
              <span className="font-bold text-gray-900">
                S/ {cajaGeneral.limite_total_asignaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado Operativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Estado Bóveda</span>
              <Badge className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Activa
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Código</span>
              <span className="font-bold text-blue-700">{cajaGeneral.codigo}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Última Actualización</span>
              <span className="text-sm text-gray-600">
                {new Date(cajaGeneral.updated_at).toLocaleString('es-PE')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movimientos Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Últimos Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movimientosRecientes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay movimientos registrados</p>
          ) : (
            <div className="space-y-3">
              {movimientosRecientes.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
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
                      <p className="font-semibold text-gray-900">{mov.concepto}</p>
                      <p className="text-sm text-gray-600">{mov.descripcion}</p>
                      <p className="text-xs text-gray-500">
                        {mov.fecha ? new Date(mov.fecha).toLocaleString('es-PE') : 'Sin fecha'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
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
