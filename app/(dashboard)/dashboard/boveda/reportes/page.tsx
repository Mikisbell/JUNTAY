import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCajaGeneral, getMovimientosCajaGeneral } from '@/lib/api/cajas'
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, Eye, PieChart } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BovedaReportesPage() {
  const cajaGeneral = await getCajaGeneral()
  const movimientos = await getMovimientosCajaGeneral(100)

  // Calcular métricas
  const hoy = new Date()
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  
  const movimientosMes = movimientos.filter(mov => {
    const fechaMov = new Date(mov.fecha || mov.created_at)
    return fechaMov >= inicioMes
  })

  const prestamosOtorgados = movimientosMes.filter(mov => mov.tipo_movimiento === 'prestamo_otorgado')
  const interesesCobrados = movimientosMes.filter(mov => mov.tipo_movimiento === 'pago_interes')
  const ventasRemate = movimientosMes.filter(mov => mov.tipo_movimiento === 'venta_remate')

  const totalPrestamos = prestamosOtorgados.reduce((sum, mov) => sum + mov.monto, 0)
  const totalIntereses = interesesCobrados.reduce((sum, mov) => sum + mov.monto, 0)
  const totalVentas = ventasRemate.reduce((sum, mov) => sum + mov.monto, 0)

  const reportes = [
    {
      titulo: 'Reporte Diario de Operaciones',
      descripcion: 'Resumen completo de todas las transacciones del día',
      icono: <Calendar className="h-5 w-5" />,
      color: 'blue',
      datos: `${movimientos.filter(mov => {
        const fechaMov = new Date(mov.fecha || mov.created_at)
        return fechaMov.toDateString() === hoy.toDateString()
      }).length} operaciones hoy`
    },
    {
      titulo: 'Análisis de Rentabilidad Mensual',
      descripcion: 'ROI, márgenes y tendencias de crecimiento',
      icono: <TrendingUp className="h-5 w-5" />,
      color: 'green',
      datos: `S/ ${totalIntereses.toLocaleString('es-PE')} en intereses`
    },
    {
      titulo: 'Estado de Liquidez',
      descripcion: 'Disponibilidad de efectivo y proyecciones',
      icono: <BarChart3 className="h-5 w-5" />,
      color: 'purple',
      datos: `${cajaGeneral ? ((cajaGeneral.saldo_disponible / cajaGeneral.saldo_total) * 100).toFixed(1) : 0}% disponible`
    },
    {
      titulo: 'Reporte de Préstamos Activos',
      descripcion: 'Cartera vigente, vencimientos y riesgos',
      icono: <PieChart className="h-5 w-5" />,
      color: 'orange',
      datos: `${prestamosOtorgados.length} préstamos este mes`
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes Gerenciales</h1>
            <p className="text-gray-600">Análisis financiero y operativo de la bóveda</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Todo
        </Button>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Capital Activo</p>
                <p className="text-2xl font-bold text-blue-800">
                  S/ {cajaGeneral ? cajaGeneral.saldo_total.toLocaleString('es-PE', { minimumFractionDigits: 2 }) : '0.00'}
                </p>
                <p className="text-xs text-blue-600">Total en bóveda</p>
              </div>
              <div className="p-2 bg-blue-200 rounded-lg">
                💰
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-green-800">
                  S/ {(totalIntereses + totalVentas).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-green-600">Intereses + Ventas</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Préstamos Otorgados</p>
                <p className="text-2xl font-bold text-orange-800">
                  S/ {totalPrestamos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-orange-600">{prestamosOtorgados.length} operaciones</p>
              </div>
              <div className="p-2 bg-orange-200 rounded-lg">
                🏪
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">ROI Mensual</p>
                <p className="text-2xl font-bold text-purple-800">
                  {totalPrestamos > 0 ? ((totalIntereses / totalPrestamos) * 100).toFixed(1) : '0.0'}%
                </p>
                <p className="text-xs text-purple-600">Retorno sobre inversión</p>
              </div>
              <div className="p-2 bg-purple-200 rounded-lg">
                📈
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Reportes Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reportes Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportes.map((reporte, index) => (
              <Card key={index} className={`border-2 border-${reporte.color}-200 hover:shadow-lg transition-shadow cursor-pointer`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-${reporte.color}-100 rounded-lg`}>
                      {reporte.icono}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Disponible
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{reporte.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-3">{reporte.descripcion}</p>
                  <p className="text-xs font-medium text-gray-500 mb-4">{reporte.datos}</p>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Operaciones (Últimos 7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 7 }, (_, i) => {
                const fecha = new Date()
                fecha.setDate(fecha.getDate() - i)
                const movimientosDia = movimientos.filter(mov => {
                  const fechaMov = new Date(mov.fecha || mov.created_at)
                  return fechaMov.toDateString() === fecha.toDateString()
                })
                
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {fecha.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-sm text-gray-600">{movimientosDia.length} operaciones</p>
                    </div>
                    <div className="text-right">
                      <div className={`w-16 h-2 rounded-full ${
                        movimientosDia.length > 5 ? 'bg-green-500' : 
                        movimientosDia.length > 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo de Operación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Préstamos Otorgados</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{prestamosOtorgados.length}</p>
                  <p className="text-xs text-gray-500">
                    S/ {totalPrestamos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Intereses Cobrados</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{interesesCobrados.length}</p>
                  <p className="text-xs text-gray-500">
                    S/ {totalIntereses.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Ventas de Remate</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{ventasRemate.length}</p>
                  <p className="text-xs text-gray-500">
                    S/ {totalVentas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
