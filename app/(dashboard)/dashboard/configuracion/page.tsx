import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Users, CreditCard, Building, Percent, Bell, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Configuración del sistema y parámetros de negocio</p>
        </div>
      </div>

      {/* Secciones de Configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Configuración de Empresa */}
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

        {/* Gestión de Usuarios */}
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
              Configurar tasas de interés mensual, diario, semanal y moratorio.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              <Percent className="h-4 w-4 mr-1" />
              Configurar Tasas
            </Button>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-yellow-600" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Configurar alertas, recordatorios y notificaciones WhatsApp.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              <Bell className="h-4 w-4 mr-1" />
              Configurar Alertas
            </Button>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-600" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Configurar políticas de seguridad, backup y auditoría.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-1" />
              Configurar Seguridad
            </Button>
          </CardContent>
        </Card>
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
              <span className="text-sm text-gray-600">12 Nov 2025</span>
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
