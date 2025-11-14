import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, Users, CreditCard, Building, Percent, Bell, Shield,
  Landmark, Package, Plug, Database, Activity, FileText, Archive,
  Smartphone, Globe, Coins, BarChart3, AlertTriangle, Clock,
  Zap, Lock, Eye, TrendingUp, Server, Wifi, CheckCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ConfiguracionPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">⚙️ Panel de Control y Configuración</h1>
          <p className="text-gray-600 mt-2 text-lg">Centro de Administración del Sistema JUNTAY</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          v1.0.0 • Producción
        </Badge>
      </div>

      {/* Métricas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Uptime</p>
                <p className="text-2xl font-bold text-blue-900">99.9%</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">BD Status</p>
                <p className="text-2xl font-bold text-green-900">Activa</p>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Usuarios</p>
                <p className="text-2xl font-bold text-purple-900">5</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Último Backup</p>
                <p className="text-2xl font-bold text-orange-900">Hoy</p>
              </div>
              <Archive className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN 1: ADMINISTRACIÓN OPERATIVA */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Landmark className="h-6 w-6 mr-3 text-blue-600" />
          Administración Operativa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Gestión de Cajas - IMPLEMENTADO */}
          <Link href="/dashboard/configuracion/cajas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Landmark className="h-5 w-5 mr-2 text-green-600" />
                    Gestión de Cajas
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Crear, editar y administrar cajas del sistema. Asignar responsables y ver historial.
                </p>
                <Badge className="bg-green-100 text-green-800">
                  ✅ Implementado
                </Badge>
              </CardContent>
            </Card>
          </Link>

          {/* Datos de Empresa */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Datos de Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar información de la empresa, sucursales y datos legales.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-1" />
                Configurar
              </Button>
            </CardContent>
          </Card>

          {/* Usuarios y Roles */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Usuarios y Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gestionar usuarios, roles y permisos del sistema.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-1" />
                Gestionar Usuarios
              </Button>
            </CardContent>
          </Card>

          {/* Tipos de Crédito */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                Tipos de Crédito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar tipos de crédito, plazos y condiciones.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-1" />
                Configurar Créditos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN 2: CONFIGURACIÓN FINANCIERA */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Coins className="h-6 w-6 mr-3 text-green-600" />
          Configuración Financiera
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tasas de Interés */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2 text-orange-600" />
                Tasas de Interés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar tasas mensual, semanal, quincenal y moratorio.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Percent className="h-4 w-4 mr-1" />
                Configurar Tasas
              </Button>
            </CardContent>
          </Card>

          {/* Modalidades de Pago */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Modalidades de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar formas de pago: efectivo, YAPE, transferencias.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-1" />
                Configurar Pagos
              </Button>
            </CardContent>
          </Card>

          {/* Plazos y Períodos */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Plazos y Períodos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar plazos de crédito y períodos de gracia.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-1" />
                Configurar Plazos
              </Button>
            </CardContent>
          </Card>

          {/* Políticas de Mora */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Políticas de Mora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar políticas de mora y vencimientos.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Configurar Mora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN 3: INTEGRACIONES Y APIS */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Plug className="h-6 w-6 mr-3 text-purple-600" />
          Integraciones y APIs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* RENIEC API */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-yellow-600" />
                  RENIEC API
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">90%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar integración con RENIEC para validación de DNI.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-1" />
                Configurar Token
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Business - IMPLEMENTADO */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                  WhatsApp Business
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar notificaciones automáticas por WhatsApp.
              </p>
              <Badge className="bg-green-100 text-green-800">
                ✅ Funcionando
              </Badge>
            </CardContent>
          </Card>

          {/* Sistema YAPE - IMPLEMENTADO */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                  Sistema YAPE
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar pagos automáticos con YAPE.
              </p>
              <Badge className="bg-green-100 text-green-800">
                ✅ Funcionando
              </Badge>
            </CardContent>
          </Card>

          {/* SUNAT RUC */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-green-600" />
                  SUNAT RUC
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Validación automática de RUC empresarial.
              </p>
              <Badge className="bg-green-100 text-green-800">
                ✅ Funcionando
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN 4: NOTIFICACIONES Y ALERTAS */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Bell className="h-6 w-6 mr-3 text-yellow-600" />
          Notificaciones y Alertas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Plantillas */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Plantillas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar plantillas de mensajes y notificaciones.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-1" />
                Gestionar Plantillas
              </Button>
            </CardContent>
          </Card>

          {/* Recordatorios */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Recordatorios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar recordatorios automáticos de vencimientos.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-1" />
                Configurar Alertas
              </Button>
            </CardContent>
          </Card>

          {/* Alertas del Sistema */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Alertas del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar alertas críticas del sistema.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Configurar Alertas
              </Button>
            </CardContent>
          </Card>

          {/* Logs de Notificaciones */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-purple-600" />
                Logs de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ver historial de notificaciones enviadas.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-1" />
                Ver Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN 5: SEGURIDAD Y AUDITORÍA */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-3 text-red-600" />
          Seguridad y Auditoría
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Políticas de Seguridad */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-600" />
                Políticas de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar políticas de contraseñas y acceso.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Lock className="h-4 w-4 mr-1" />
                Configurar Seguridad
              </Button>
            </CardContent>
          </Card>

          {/* Logs de Actividad */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Logs de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ver registros de actividad del sistema.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Activity className="h-4 w-4 mr-1" />
                Ver Logs
              </Button>
            </CardContent>
          </Card>

          {/* Backup y Restauración */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Archive className="h-5 w-5 mr-2 text-green-600" />
                Backup y Restauración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar copias de seguridad automáticas.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Archive className="h-4 w-4 mr-1" />
                Configurar Backup
              </Button>
            </CardContent>
          </Card>

          {/* Permisos Avanzados */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Permisos Avanzados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar permisos granulares por módulo.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-1" />
                Configurar Permisos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN 6: MANTENIMIENTO */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-yellow-600" />
          Mantenimiento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Estado del Sistema */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2 text-green-600" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitorear estado y salud del sistema.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Server className="h-4 w-4 mr-1" />
                Ver Estado
              </Button>
            </CardContent>
          </Card>

          {/* Base de Datos */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                Base de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Mantenimiento y optimización de BD.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-1" />
                Optimizar BD
              </Button>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitorear rendimiento y métricas.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                Ver Métricas
              </Button>
            </CardContent>
          </Card>

          {/* Actualizaciones */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-600" />
                Actualizaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gestionar actualizaciones del sistema.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Package className="h-4 w-4 mr-1" />
                Verificar Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Configuraciones Actuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración Actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tasa Mensual:</span>
              <span className="text-sm text-gray-600">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tasa Semanal:</span>
              <span className="text-sm text-gray-600">5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tasa Quincenal:</span>
              <span className="text-sm text-gray-600">10%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tasa Mora Diaria:</span>
              <span className="text-sm text-gray-600">0.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Plazo Gracia:</span>
              <span className="text-sm text-gray-600">30 días</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Versión:</span>
              <span className="text-sm text-gray-600">JUNTAY v1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Última Actualización:</span>
              <span className="text-sm text-gray-600">13 Nov 2025</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Base de Datos:</span>
              <span className="text-sm text-green-600">Conectada</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Storage:</span>
              <span className="text-sm text-green-600">Operativo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Backup:</span>
              <span className="text-sm text-green-600">Automático</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
