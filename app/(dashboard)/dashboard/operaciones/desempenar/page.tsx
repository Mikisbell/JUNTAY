import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, Search, DollarSign, Package, AlertTriangle, CheckCircle, Calculator } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function DesempenarPage() {
  // Simulamos contratos disponibles para desempeño
  const contratosDesempeno = [
    {
      id: 'PRES-2024-001',
      cliente: 'María García Rodríguez',
      dni: '12345678',
      fecha_prestamo: '2024-10-14',
      fecha_vencimiento: '2024-11-14',
      monto_prestamo: 800.00,
      interes_acumulado: 160.00, // 2 meses
      mora: 24.00,
      gastos_administrativos: 15.00,
      total_desempeno: 999.00,
      prenda: {
        descripcion: 'Anillo de oro 18k con diamante',
        peso: '5.2g',
        pureza: '18k',
        estado: 'Excelente'
      },
      dias_vencido: 5,
      estado: 'vencido'
    },
    {
      id: 'PRES-2024-002',
      cliente: 'Carlos López Mendoza',
      dni: '87654321',
      fecha_prestamo: '2024-10-20',
      fecha_vencimiento: '2024-11-20',
      monto_prestamo: 1200.00,
      interes_acumulado: 120.00,
      mora: 0.00,
      gastos_administrativos: 20.00,
      total_desempeno: 1340.00,
      prenda: {
        descripcion: 'Cadena de plata 925',
        peso: '25.8g',
        pureza: '925',
        estado: 'Muy bueno'
      },
      dias_vencido: 0,
      estado: 'vigente'
    },
    {
      id: 'PRES-2024-003',
      cliente: 'Ana Rodríguez Silva',
      dni: '11223344',
      fecha_prestamo: '2024-09-15',
      fecha_vencimiento: '2024-10-15',
      monto_prestamo: 1500.00,
      interes_acumulado: 450.00, // 3 meses
      mora: 101.25,
      gastos_administrativos: 25.00,
      total_desempeno: 2076.25,
      prenda: {
        descripcion: 'Laptop HP Pavilion i5',
        modelo: 'HP-15-eh1001la',
        serie: 'CND1234567',
        estado: 'Bueno'
      },
      dias_vencido: 30,
      estado: 'vencido'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-xl">
          <RotateCcw className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Desempeño de Prendas</h1>
          <p className="text-sm text-gray-600">Recuperación de prendas mediante pago total</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Contratos Activos</p>
                <p className="text-2xl font-bold text-blue-800">{contratosDesempeno.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Vigentes</p>
                <p className="text-2xl font-bold text-green-800">
                  {contratosDesempeno.filter(c => c.estado === 'vigente').length}
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
                <p className="text-sm font-medium text-red-700">Vencidos</p>
                <p className="text-2xl font-bold text-red-800">
                  {contratosDesempeno.filter(c => c.estado === 'vencido').length}
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
                <p className="text-sm font-medium text-purple-700">Valor Total</p>
                <p className="text-2xl font-bold text-purple-800">
                  S/ {contratosDesempeno.reduce((sum, c) => sum + c.total_desempeno, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Contrato para Desempeño
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI del Cliente
              </label>
              <input
                type="text"
                placeholder="12345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Lista de Contratos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Contratos Disponibles para Desempeño
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contratosDesempeno.map((contrato) => (
              <Card key={contrato.id} className={`border-2 ${
                contrato.estado === 'vencido' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
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
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Vencimiento</p>
                      <p className="font-semibold">{new Date(contrato.fecha_vencimiento).toLocaleDateString('es-PE')}</p>
                    </div>
                  </div>

                  {/* Información de la Prenda */}
                  <div className="bg-white/70 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Información de la Prenda
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Descripción</p>
                        <p className="font-medium text-gray-900">{contrato.prenda.descripcion}</p>
                      </div>
                      {contrato.prenda.peso && (
                        <div>
                          <p className="text-sm text-gray-600">Peso</p>
                          <p className="font-medium text-gray-900">{contrato.prenda.peso}</p>
                        </div>
                      )}
                      {contrato.prenda.pureza && (
                        <div>
                          <p className="text-sm text-gray-600">Pureza</p>
                          <p className="font-medium text-gray-900">{contrato.prenda.pureza}</p>
                        </div>
                      )}
                      {contrato.prenda.modelo && (
                        <div>
                          <p className="text-sm text-gray-600">Modelo</p>
                          <p className="font-medium text-gray-900">{contrato.prenda.modelo}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Estado</p>
                        <p className="font-medium text-gray-900">{contrato.prenda.estado}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cálculo de Desempeño */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Cálculo de Desempeño
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-blue-700">Monto Préstamo</p>
                        <p className="font-bold text-blue-900">
                          S/ {contrato.monto_prestamo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Intereses</p>
                        <p className="font-bold text-orange-700">
                          + S/ {contrato.interes_acumulado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Mora</p>
                        <p className="font-bold text-red-700">
                          + S/ {contrato.mora.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Gastos Admin.</p>
                        <p className="font-bold text-purple-700">
                          + S/ {contrato.gastos_administrativos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-blue-200 mt-3 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-900">Total para Desempeño:</span>
                        <span className="text-2xl font-bold text-blue-900">
                          S/ {contrato.total_desempeno.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Historial
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Prenda
                      </Button>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Procesar Desempeño
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Desempeño */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <RotateCcw className="h-5 w-5" />
            Procesar Desempeño
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">
              Selecciona un contrato de la lista superior para procesar el desempeño
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Contrato Seleccionado</p>
                <p className="font-semibold text-gray-900">Ninguno</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total a Cobrar</p>
                <p className="font-semibold text-blue-700">S/ 0.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Método de Pago</p>
                <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>Efectivo</option>
                  <option>Transferencia</option>
                  <option>Yape/Plin</option>
                  <option>Mixto</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Desempeño
            </label>
            <textarea
              placeholder="Estado de la prenda al momento de entrega, observaciones del cliente, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Importante</h4>
                <p className="text-sm text-yellow-700">
                  Al procesar el desempeño, la prenda será entregada al cliente y el contrato se cerrará definitivamente.
                  Asegúrate de que el pago esté completo antes de confirmar.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline">
              Cancelar
            </Button>
            <Button disabled className="bg-gray-400">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Desempeño (Selecciona contrato)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
