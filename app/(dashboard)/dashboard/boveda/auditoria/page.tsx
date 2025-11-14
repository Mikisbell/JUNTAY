import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMovimientosCajaGeneral } from '@/lib/api/cajas'
import { Shield, AlertTriangle, CheckCircle, Clock, User, Search, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BovedaAuditoriaPage() {
  const movimientos = await getMovimientosCajaGeneral(100)

  // Simulamos algunos eventos de auditoría
  const eventosAuditoria = [
    {
      id: '1',
      tipo: 'acceso_boveda',
      usuario: 'admin@juntay.com',
      accion: 'Consulta de saldos',
      timestamp: new Date('2024-11-14T10:30:00'),
      ip: '192.168.1.100',
      resultado: 'exitoso',
      detalles: 'Acceso autorizado a módulo de bóveda'
    },
    {
      id: '2',
      tipo: 'modificacion_limite',
      usuario: 'gerente@juntay.com',
      accion: 'Cambio de límite de asignación',
      timestamp: new Date('2024-11-14T09:15:00'),
      ip: '192.168.1.101',
      resultado: 'exitoso',
      detalles: 'Límite actualizado de S/ 20,000 a S/ 25,000'
    },
    {
      id: '3',
      tipo: 'intento_acceso',
      usuario: 'cajero@juntay.com',
      accion: 'Intento de acceso a bóveda',
      timestamp: new Date('2024-11-14T08:45:00'),
      ip: '192.168.1.102',
      resultado: 'denegado',
      detalles: 'Permisos insuficientes para acceder a bóveda'
    }
  ]

  const alertasSeguridad = [
    {
      id: '1',
      nivel: 'alto',
      tipo: 'Transacción inusual',
      descripcion: 'Préstamo por monto superior al promedio diario',
      timestamp: new Date('2024-11-14T11:00:00'),
      estado: 'pendiente'
    },
    {
      id: '2',
      nivel: 'medio',
      tipo: 'Acceso fuera de horario',
      descripcion: 'Consulta de reportes realizada después del horario laboral',
      timestamp: new Date('2024-11-13T22:30:00'),
      estado: 'revisado'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auditoría y Control</h1>
            <p className="text-gray-600">Monitoreo de seguridad y trazabilidad completa</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Alertas de Seguridad */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alertasSeguridad.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Sin alertas activas</p>
              <p className="text-green-600 text-sm">Todos los sistemas funcionan normalmente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertasSeguridad.map((alerta) => (
                <div key={alerta.id} className={`p-4 rounded-lg border-l-4 ${
                  alerta.nivel === 'alto' ? 'border-red-500 bg-red-50' :
                  alerta.nivel === 'medio' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        alerta.nivel === 'alto' ? 'destructive' :
                        alerta.nivel === 'medio' ? 'default' : 'secondary'
                      }>
                        {alerta.nivel.toUpperCase()}
                      </Badge>
                      <h4 className="font-semibold text-gray-900">{alerta.tipo}</h4>
                    </div>
                    <Badge variant={alerta.estado === 'pendiente' ? 'destructive' : 'secondary'}>
                      {alerta.estado}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alerta.descripcion}</p>
                  <p className="text-xs text-gray-500">
                    {alerta.timestamp.toLocaleString('es-PE')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas de Auditoría */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Eventos Hoy</p>
                <p className="text-2xl font-bold text-blue-800">{eventosAuditoria.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Accesos Exitosos</p>
                <p className="text-2xl font-bold text-green-800">
                  {eventosAuditoria.filter(e => e.resultado === 'exitoso').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Accesos Denegados</p>
                <p className="text-2xl font-bold text-red-800">
                  {eventosAuditoria.filter(e => e.resultado === 'denegado').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Usuarios Activos</p>
                <p className="text-2xl font-bold text-purple-800">
                  {new Set(eventosAuditoria.map(e => e.usuario)).size}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log de Auditoría */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Registro de Auditoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eventosAuditoria.map((evento) => (
              <div key={evento.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    evento.resultado === 'exitoso' ? 'bg-green-100 text-green-600' :
                    evento.resultado === 'denegado' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {evento.resultado === 'exitoso' ? <CheckCircle className="h-5 w-5" /> :
                     evento.resultado === 'denegado' ? <AlertTriangle className="h-5 w-5" /> :
                     <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{evento.accion}</h4>
                      <Badge variant={
                        evento.tipo === 'acceso_boveda' ? 'default' :
                        evento.tipo === 'modificacion_limite' ? 'secondary' :
                        'destructive'
                      }>
                        {evento.tipo.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{evento.detalles}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👤 {evento.usuario}</span>
                      <span>🌐 {evento.ip}</span>
                      <span>📅 {evento.timestamp.toLocaleString('es-PE')}</span>
                    </div>
                  </div>
                </div>
                
                <Badge variant={
                  evento.resultado === 'exitoso' ? 'default' :
                  evento.resultado === 'denegado' ? 'destructive' : 'secondary'
                }>
                  {evento.resultado}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trazabilidad de Movimientos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Trazabilidad de Movimientos Críticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movimientos.slice(0, 10).map((mov) => (
              <div key={mov.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mov.concepto}</p>
                    <p className="text-sm text-gray-600">{mov.descripcion}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>ID: {mov.id.slice(0, 8)}...</span>
                      <span>Usuario: {mov.usuario_operacion.slice(0, 8)}...</span>
                      <span>{mov.fecha ? new Date(mov.fecha).toLocaleString('es-PE') : 'Sin fecha'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    S/ {mov.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Verificado
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
