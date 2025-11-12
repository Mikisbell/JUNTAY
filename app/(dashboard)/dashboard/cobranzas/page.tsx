import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, Clock, AlertTriangle, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function CobranzasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cobranzas</h1>
          <p className="text-gray-600">Gestión de pagos y recuperación de créditos</p>
        </div>
        <Button>
          <Calculator className="h-4 w-4 mr-2" />
          Registrar Pago
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vencimientos Hoy
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-muted-foreground">
              S/ 15,420.00 por cobrar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos Vencimientos
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">28</div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 días
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cobrado Hoy
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">S/ 8,350</div>
            <p className="text-xs text-muted-foreground">
              23 pagos recibidos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mora Acumulada
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">S/ 2,890</div>
            <p className="text-xs text-muted-foreground">
              Intereses moratorios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Content */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cobranzas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Módulo de Cobranzas
            </h3>
            <p className="text-gray-600 mb-4">
              Este módulo estará disponible próximamente con funcionalidades completas de cobranza.
            </p>
            <Button variant="outline">
              Ir a Créditos Existentes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
