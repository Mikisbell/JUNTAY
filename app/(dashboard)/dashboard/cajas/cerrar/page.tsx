import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCajas, getSaldoActualCaja } from '@/lib/api/cajas'
import { Lock, Calculator, AlertTriangle, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CerrarTurnoPage() {
  const cajas = await getCajas()
  const miCaja = cajas[0] // Simulamos que es la caja del usuario
  const saldoCaja = await getSaldoActualCaja(miCaja.id!)

  // Simulamos datos del turno
  const datosTurno = {
    hora_apertura: '08:00:00',
    monto_inicial: 15000.00,
    total_ingresos: 8500.00,
    total_egresos: 12300.00,
    saldo_teorico: 11200.00,
    operaciones_realizadas: 47,
    prestamos_otorgados: 12,
    intereses_cobrados: 23,
    desempenos: 8,
    ventas_remate: 4
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-100 rounded-xl">
          <Lock className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cerrar Turno de Trabajo</h1>
          <p className="text-gray-600">Arqueo final y devolución de efectivo a bóveda</p>
        </div>
      </div>

      {/* Resumen del Turno */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <DollarSign className="h-5 w-5" />
            Resumen del Turno - {miCaja.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Hora Apertura</p>
              <p className="text-lg font-bold text-blue-800">{datosTurno.hora_apertura}</p>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Monto Inicial</p>
              <p className="text-lg font-bold text-blue-800">
                S/ {datosTurno.monto_inicial.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Operaciones</p>
              <p className="text-lg font-bold text-blue-800">{datosTurno.operaciones_realizadas}</p>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Duración</p>
              <p className="text-lg font-bold text-blue-800">8h 30m</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movimientos del Día */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              Ingresos del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Intereses cobrados ({datosTurno.intereses_cobrados})</span>
                <span className="font-semibold text-green-800">S/ 4,200.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Ventas de remate ({datosTurno.ventas_remate})</span>
                <span className="font-semibold text-green-800">S/ 3,100.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Desempeños ({datosTurno.desempenos})</span>
                <span className="font-semibold text-green-800">S/ 1,200.00</span>
              </div>
              <div className="border-t border-green-300 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Total Ingresos</span>
                  <span className="text-xl font-bold text-green-800">
                    S/ {datosTurno.total_ingresos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <TrendingDown className="h-5 w-5" />
              Egresos del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Préstamos otorgados ({datosTurno.prestamos_otorgados})</span>
                <span className="font-semibold text-red-800">S/ 11,800.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Gastos operativos</span>
                <span className="font-semibold text-red-800">S/ 500.00</span>
              </div>
              <div className="border-t border-red-300 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-red-800">Total Egresos</span>
                  <span className="text-xl font-bold text-red-800">
                    S/ {datosTurno.total_egresos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Arqueo de Caja */}
      <Card className="border-2 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Calculator className="h-5 w-5" />
            Arqueo Final de Caja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Saldo Teórico vs Real */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-orange-700">Saldo Teórico</p>
                <p className="text-2xl font-bold text-orange-800">
                  S/ {datosTurno.saldo_teorico.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-orange-600">Según sistema</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Saldo Real Contado</p>
                <input
                  type="number"
                  placeholder="0.00"
                  className="text-2xl font-bold text-center w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  step="0.01"
                />
                <p className="text-xs text-gray-600">Contar efectivo físico</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-purple-700">Diferencia</p>
                <p className="text-2xl font-bold text-purple-800">S/ 0.00</p>
                <p className="text-xs text-purple-600">Sobrante/Faltante</p>
              </div>
            </div>
          </div>

          {/* Desglose de Billetes */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Desglose de Efectivo Físico</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { denominacion: 'S/ 200', cantidad: 0, subtotal: 0 },
                { denominacion: 'S/ 100', cantidad: 0, subtotal: 0 },
                { denominacion: 'S/ 50', cantidad: 0, subtotal: 0 },
                { denominacion: 'S/ 20', cantidad: 0, subtotal: 0 },
                { denominacion: 'S/ 10', cantidad: 0, subtotal: 0 },
                { denominacion: 'S/ 5', cantidad: 0, subtotal: 0 },
                { denominacion: 'S/ 2', cantidad: 0, subtotal: 0 },
                { denominacion: 'S/ 1', cantidad: 0, subtotal: 0 }
              ].map((billete) => (
                <div key={billete.denominacion} className="bg-gray-50 p-3 rounded-lg">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {billete.denominacion}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 mb-1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">= S/ 0.00</p>
                </div>
              ))}
            </div>
          </div>

          {/* Observaciones del Cierre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Cierre
            </label>
            <textarea
              placeholder="Registra cualquier incidencia, diferencia o comentario sobre el turno..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Validaciones Finales */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Verificaciones de Cierre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium text-red-800">Arqueo Completado</p>
                <p className="text-sm text-red-700">He contado todo el efectivo físico y registrado las cantidades</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium text-red-800">Diferencias Justificadas</p>
                <p className="text-sm text-red-700">Cualquier diferencia ha sido explicada en observaciones</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium text-red-800">Documentos Organizados</p>
                <p className="text-sm text-red-700">Todos los contratos y comprobantes están ordenados</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium text-red-800">Caja Asegurada</p>
                <p className="text-sm text-red-700">La caja física está cerrada y asegurada</p>
              </div>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Importante</h4>
                  <p className="text-sm text-yellow-700">
                    Al cerrar el turno, todo el efectivo será devuelto a la Bóveda Central y 
                    no podrás realizar más operaciones hasta abrir un nuevo turno.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones de Cierre */}
      <div className="flex justify-between">
        <Button variant="outline">
          Cancelar Cierre
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">
            Guardar Borrador
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Lock className="h-4 w-4 mr-2" />
            Cerrar Turno y Devolver Efectivo
          </Button>
        </div>
      </div>
    </div>
  )
}
