import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Search, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function PagarInteresPage() {
  // Simulamos contratos con intereses pendientes
  const contratosPendientes = [
    {
      id: 'PRES-2024-001',
      cliente: 'María García Rodríguez',
      dni: '12345678',
      fecha_prestamo: '2024-10-14',
      monto_prestamo: 800.00,
      tasa_mensual: 10,
      interes_mensual: 80.00,
      dias_vencido: 5,
      interes_pendiente: 80.00,
      mora: 12.00,
      total_pagar: 92.00,
      prenda: 'Anillo de oro 18k',
      estado: 'vencido'
    },
    {
      id: 'PRES-2024-002',
      cliente: 'Carlos López Mendoza',
      dni: '87654321',
      fecha_prestamo: '2024-10-20',
      monto_prestamo: 1200.00,
      tasa_mensual: 10,
      interes_mensual: 120.00,
      dias_vencido: 0,
      interes_pendiente: 120.00,
      mora: 0.00,
      total_pagar: 120.00,
      prenda: 'Cadena de plata',
      estado: 'vigente'
    },
    {
      id: 'PRES-2024-003',
      cliente: 'Ana Rodríguez Silva',
      dni: '11223344',
      fecha_prestamo: '2024-09-15',
      monto_prestamo: 1500.00,
      tasa_mensual: 10,
      interes_mensual: 150.00,
      dias_vencido: 15,
      interes_pendiente: 300.00, // 2 meses
      mora: 67.50,
      total_pagar: 367.50,
      prenda: 'Laptop HP',
      estado: 'vencido'
    }
  ]

  const totalInteresesPendientes = contratosPendientes.reduce((sum, c) => sum + c.total_pagar, 0)
  const contratosVencidos = contratosPendientes.filter(c => c.estado === 'vencido').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-xl">
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pago de Intereses</h1>
          <p className="text-gray-600">Cobro de intereses mensuales y mora</p>
        </div>
      </div>

      {/* Resumen de Intereses */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Pendiente</p>
                <p className="text-2xl font-bold text-green-800">
                  S/ {totalInteresesPendientes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Contratos Activos</p>
                <p className="text-2xl font-bold text-blue-800">{contratosPendientes.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Contratos Vencidos</p>
                <p className="text-2xl font-bold text-red-800">{contratosVencidos}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Tasa Promedio</p>
                <p className="text-2xl font-bold text-purple-800">10.0%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda de Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Contrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Contrato
              </label>
              <input
                type="text"
                placeholder="PRES-2024-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI del Cliente
              </label>
              <input
                type="text"
                placeholder="12345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={8}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Contratos Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Contratos con Intereses Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contratosPendientes.map((contrato) => (
              <Card key={contrato.id} className={`border-2 ${
                contrato.estado === 'vencido' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{contrato.id}</h3>
                        <Badge variant={contrato.estado === 'vencido' ? 'destructive' : 'default'}>
                          {contrato.estado === 'vencido' ? `VENCIDO (${contrato.dias_vencido} días)` : 'VIGENTE'}
                        </Badge>
                      </div>
                      <p className="text-gray-700 font-medium">{contrato.cliente}</p>
                      <p className="text-sm text-gray-600">DNI: {contrato.dni}</p>
                      <p className="text-sm text-gray-600">Prenda: {contrato.prenda}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Fecha Préstamo</p>
                      <p className="font-semibold">{new Date(contrato.fecha_prestamo).toLocaleDateString('es-PE')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-white/70 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Monto Préstamo</p>
                      <p className="font-bold text-gray-900">
                        S/ {contrato.monto_prestamo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Interés Mensual</p>
                      <p className="font-bold text-green-700">
                        S/ {contrato.interes_mensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Interés Pendiente</p>
                      <p className="font-bold text-orange-700">
                        S/ {contrato.interes_pendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Mora</p>
                      <p className="font-bold text-red-700">
                        S/ {contrato.mora.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Total a Pagar</p>
                      <p className="font-bold text-purple-700 text-lg">
                        S/ {contrato.total_pagar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Historial
                      </Button>
                      <Button variant="outline" size="sm">
                        Imprimir Recibo
                      </Button>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Cobrar Interés
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Pago */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <DollarSign className="h-5 w-5" />
            Procesar Pago de Interés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 mb-2">
              Selecciona un contrato de la lista superior para procesar el pago
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Contrato Seleccionado</p>
                <p className="font-semibold text-gray-900">Ninguno</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Monto a Cobrar</p>
                <p className="font-semibold text-green-700">S/ 0.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Método de Pago</p>
                <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>Efectivo</option>
                  <option>Transferencia</option>
                  <option>Yape/Plin</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Pago
            </label>
            <textarea
              placeholder="Registra cualquier observación sobre el pago..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline">
              Cancelar
            </Button>
            <Button disabled className="bg-gray-400">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Pago (Selecciona contrato)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
