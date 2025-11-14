import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, FileText, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

const contratosEjemplo = [
  {
    id: 'PRES-2024-001',
    cliente: 'María García Rodríguez',
    documento: '12345678',
    prenda: 'Anillo de oro 18k',
    estado: 'vigente' as const,
    fecha: '2024-10-14',
    monto: 800,
    saldo: 520
  },
  {
    id: 'PRES-2024-003',
    cliente: 'Ana Rodríguez Silva',
    documento: '11223344',
    prenda: 'Laptop HP Pavilion i5',
    estado: 'en_mora' as const,
    fecha: '2024-09-15',
    monto: 1500,
    saldo: 900
  }
]

export default function ConsultasOperacionesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Search className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Consultas de Contratos</h1>
            <p className="text-sm text-gray-600">Búsqueda rápida de contratos para operaciones en ventanilla</p>
          </div>
        </div>
      </div>

      {/* Filtros de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-gray-900">
            <Search className="h-4 w-4" />
            Buscar contrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block text-gray-700 mb-1">Número de contrato</label>
              <input
                type="text"
                placeholder="PRES-2024-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">DNI / documento</label>
              <input
                type="text"
                placeholder="12345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Nombre del cliente</label>
              <input
                type="text"
                placeholder="Nombre y apellidos"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resultados de la búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contratosEjemplo.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-600">
              No se encontraron contratos con los criterios ingresados.
            </div>
          ) : (
            <div className="space-y-3">
              {contratosEjemplo.map((contrato) => (
                <div
                  key={contrato.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg px-4 py-3 text-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{contrato.id}</p>
                      <Badge
                        variant={
                          contrato.estado === 'vigente'
                            ? 'default'
                            : contrato.estado === 'en_mora'
                            ? 'destructive'
                            : 'outline'
                        }
                        className="text-[11px] capitalize"
                      >
                        {contrato.estado.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-800 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {contrato.cliente}
                    </p>
                    <p className="text-xs text-gray-600">Documento: {contrato.documento}</p>
                    <p className="text-xs text-gray-600">Prenda: {contrato.prenda}</p>
                    <p className="text-xs text-gray-500">
                      Fecha: {new Date(contrato.fecha).toLocaleDateString('es-PE')}
                    </p>
                  </div>

                  <div className="mt-3 md:mt-0 flex flex-col items-end gap-2">
                    <div className="text-xs text-gray-600 text-right">
                      <p>Monto: <span className="font-semibold">S/ {contrato.monto.toFixed(2)}</span></p>
                      <p>Saldo: <span className="font-semibold text-orange-700">S/ {contrato.saldo.toFixed(2)}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver detalle
                      </Button>
                      <Button variant="outline" size="sm">
                        Ir al contrato
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
