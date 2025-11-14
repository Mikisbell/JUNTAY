import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCajas, getCajaGeneral } from '@/lib/api/cajas'
import { ArrowRight, Clock, DollarSign, User, CheckCircle, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BovedaAsignacionesPage() {
  const cajas = await getCajas()
  const cajaGeneral = await getCajaGeneral()

  // Simulamos algunas asignaciones activas
  const asignacionesActivas = [
    {
      id: '1',
      caja: cajas[0],
      monto_asignado: 15000,
      fecha_asignacion: new Date('2024-11-14T08:00:00'),
      responsable: 'Juan Pérez',
      estado: 'activa'
    },
    {
      id: '2', 
      caja: cajas[1],
      monto_asignado: 8000,
      fecha_asignacion: new Date('2024-11-14T08:30:00'),
      responsable: 'María García',
      estado: 'activa'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <ArrowRight className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asignaciones de Efectivo</h1>
            <p className="text-gray-600">Control de entregas a cajas operativas</p>
          </div>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          Nueva Asignación
        </Button>
      </div>

      {/* Resumen */}
      {cajaGeneral && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Disponible para Asignar</p>
                  <p className="text-2xl font-bold text-green-800">
                    S/ {cajaGeneral.saldo_disponible.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Total Asignado</p>
                  <p className="text-2xl font-bold text-orange-800">
                    S/ {cajaGeneral.saldo_asignado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <ArrowRight className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Cajas Activas</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {asignacionesActivas.length} / {cajas.length}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Asignaciones Activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Asignaciones Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {asignacionesActivas.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay asignaciones activas</h3>
              <p className="text-gray-600">Todas las cajas están cerradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {asignacionesActivas.map((asignacion) => (
                <div key={asignacion.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {asignacion.caja?.nombre} ({asignacion.caja?.codigo})
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {asignacion.responsable}
                      </p>
                      <p className="text-xs text-gray-500">
                        Asignado: {asignacion.fecha_asignacion.toLocaleString('es-PE')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-600">
                      S/ {asignacion.monto_asignado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                    <Badge className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activa
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de Asignaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Asignaciones (Últimas 7 días)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { fecha: '2024-11-13', caja: 'Caja Principal', monto: 12000, responsable: 'Juan Pérez', estado: 'devuelta' },
              { fecha: '2024-11-13', caja: 'Caja Secundaria', monto: 8000, responsable: 'María García', estado: 'devuelta' },
              { fecha: '2024-11-12', caja: 'Caja Auxiliar', monto: 5000, responsable: 'Carlos López', estado: 'devuelta' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.caja}</p>
                    <p className="text-sm text-gray-600">{item.responsable}</p>
                    <p className="text-xs text-gray-500">{item.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    S/ {item.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge variant="secondary">
                    Devuelta
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
