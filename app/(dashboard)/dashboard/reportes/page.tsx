import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Reportes</h1>
          <p className="text-sm text-gray-600">Análisis y reportes del negocio</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar Datos
        </Button>
      </div>

      {/* Reportes Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Reporte de Créditos */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Créditos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Listado completo de todos los créditos vigentes y su estado actual.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">125 registros</span>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                Ver Reporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reporte de Cobranzas */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Cobranzas del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Análisis de pagos recibidos y pendientes del mes actual.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">S/ 45,230 cobrado</span>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                Ver Reporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reporte de Mora */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
              Cartera Vencida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Clientes en mora y análisis de recuperación de cartera.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">18 clientes</span>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                Ver Reporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reporte de Garantías */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Inventario de Garantías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Estado del inventario de prendas en custodia y almacén.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">89 prendas</span>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                Ver Reporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reporte de Caja */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Movimientos de Caja
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Análisis de ingresos, egresos y flujo de efectivo.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Hoy: S/ 12,450</span>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                Ver Reporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reporte de Clientes */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
              Cartera de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Análisis de comportamiento y segmentación de clientes.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">234 clientes</span>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                Ver Reporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder para reportes futuros */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Más Reportes Próximamente
            </h3>
            <p className="text-gray-600">
              Estamos trabajando en reportes adicionales como análisis de rentabilidad, 
              proyecciones de flujo de caja y reportes personalizados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
