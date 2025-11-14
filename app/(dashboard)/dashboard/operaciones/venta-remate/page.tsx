import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gavel, Search, DollarSign, Calendar, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

const rematesSimulados = [
  {
    id: 'REM-2024-001',
    contrato: 'PRES-2024-001',
    cliente: 'María García Rodríguez',
    prenda: 'Anillo de oro 18k',
    fechaProgramada: '2024-11-30',
    valorTasado: 1800,
    precioBase: 1200,
    mejorOferta: 1350,
    estado: 'programado' as const
  },
  {
    id: 'REM-2024-002',
    contrato: 'PRES-2024-003',
    cliente: 'Ana Rodríguez Silva',
    prenda: 'Laptop HP Pavilion i5',
    fechaProgramada: '2024-11-22',
    valorTasado: 2500,
    precioBase: 1700,
    mejorOferta: 0,
    estado: 'en_preparacion' as const
  }
]

export default function VentaRematePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Gavel className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Venta en Remate</h1>
            <p className="text-sm text-gray-600">Gestión de prendas que pasan a proceso de remate</p>
          </div>
        </div>
      </div>

      {/* Búsqueda / filtros simples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Search className="h-4 w-4" />
            Buscar remates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-gray-700 mb-1">Número de contrato</label>
              <input
                type="text"
                placeholder="PRES-2024-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Cliente / DNI</label>
              <input
                type="text"
                placeholder="Nombre o DNI"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de remates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            Prendas en proceso de remate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rematesSimulados.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-600">
              No hay prendas en proceso de remate actualmente.
            </div>
          ) : (
            <div className="space-y-4">
              {rematesSimulados.map((remate) => (
                <Card key={remate.id} className="border border-gray-200">
                  <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{remate.id}</p>
                        <Badge variant="outline" className="text-[11px] capitalize">
                          {remate.estado.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-800">{remate.prenda}</p>
                      <p className="text-xs text-gray-600">
                        Cliente: <span className="font-medium">{remate.cliente}</span> · Contrato: {remate.contrato}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Remate programado: {new Date(remate.fechaProgramada).toLocaleDateString('es-PE')}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs md:w-[360px]">
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-gray-500">Valor tasado</p>
                        <p className="font-semibold text-gray-900">
                          S/ {remate.valorTasado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-gray-500">Precio base</p>
                        <p className="font-semibold text-gray-900">
                          S/ {remate.precioBase.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-gray-500">Mejor oferta</p>
                        <p className="font-semibold text-gray-900">
                          {remate.mejorOferta > 0
                            ? `S/ ${remate.mejorOferta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                            : 'Sin ofertas'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-stretch md:items-end">
                      <Button size="sm" variant="outline" className="w-full md:w-auto">
                        Ver detalles del contrato
                      </Button>
                      <Button size="sm" className="w-full md:w-auto" disabled>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Registrar venta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nota informativa */}
      <Card className="border border-yellow-100 bg-yellow-50">
        <CardContent className="p-4 flex gap-3 text-xs">
          <AlertCircle className="h-4 w-4 text-yellow-700 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">Importante</p>
            <p className="text-yellow-700 mt-1">
              El proceso de remate debe respetar las reglas internas y legales: plazo de gracia, notificación al cliente y
              registro del precio de venta. Este módulo se conectará con el flujo de vencimientos y notificaciones.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
