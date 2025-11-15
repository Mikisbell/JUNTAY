import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, CheckCircle, XCircle, DollarSign } from "lucide-react"
import { getGarantias, getGarantiasStats } from "@/lib/api/garantias"

export const dynamic = 'force-dynamic'

export default async function GarantiasPage() {
  const garantias = await getGarantias()
  const stats = await getGarantiasStats()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Garantías</h1>
          <p className="text-sm text-gray-600">Gestión de bienes empeñados</p>
        </div>
        <Link href="/dashboard/garantias/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Garantía
          </Button>
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Garantías</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Garantía</p>
                <p className="text-2xl font-bold text-orange-600">{stats.enGarantia}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recuperadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.recuperadas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendidas</p>
                <p className="text-2xl font-bold text-purple-600">{stats.vendidas}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabla de Garantías */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-900">Listado de Garantías</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Bienes empeñados, su estado y valor de tasación.
          </p>
        </CardHeader>
        <CardContent>
          {garantias.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay garantías registradas</p>
              <Link href="/dashboard/garantias/nueva">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primera Garantía
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Código
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Bien
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Categoría
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Valor Tasación
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Estado
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Conservación
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {garantias.map((garantia) => (
                    <tr key={garantia.id} className="border-b hover:bg-gray-50 text-sm">
                      <td className="px-4 py-3 font-mono text-sm text-gray-900">{garantia.codigo}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{garantia.nombre}</p>
                        {garantia.marca && (
                          <p className="text-xs text-gray-500">{garantia.marca} {garantia.modelo}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {garantia.categoria?.nombre || 'Sin categoría'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">S/ {garantia.valor_tasacion.toFixed(2)}</p>
                        {garantia.valor_comercial !== garantia.valor_tasacion && (
                          <p className="text-xs text-gray-500">
                            Comercial: S/ {garantia.valor_comercial.toFixed(2)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={
                            garantia.estado === 'disponible' ? 'default' : 
                            garantia.estado === 'liberado' ? 'secondary' : 
                            garantia.estado === 'vendido' ? 'default' :
                            garantia.estado === 'en_prenda' ? 'outline' :
                            'destructive'
                          }
                        >
                          {garantia.estado.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {garantia.estado_conservacion && (
                          <Badge variant="outline">
                            {garantia.estado_conservacion.replace('_', ' ')}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/dashboard/garantias/${garantia.id}`}>
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
