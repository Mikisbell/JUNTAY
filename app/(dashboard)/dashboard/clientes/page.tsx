import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { getClientes, getClientesStats } from "@/lib/api/clientes"
import { ClientesSearch } from "@/components/clientes-search"
import { ClienteActions } from "@/components/cliente-actions"

export const dynamic = 'force-dynamic'

export default async function ClientesPage() {
  const clientes = await getClientes()
  const stats = await getClientesStats()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-600">Gestión de clientes y prestatarios</p>
        </div>
        <Link href="/dashboard/clientes/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Con Mora</p>
            <p className="text-2xl font-bold text-red-600">{stats.conMora}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Nuevos (mes)</p>
            <p className="text-2xl font-bold text-blue-600">{stats.nuevos}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search */}
      <ClientesSearch />
      
      {/* Table */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-900">Listado de Clientes</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Vista consolidada de todos los clientes y prestatarios.
          </p>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay clientes registrados</p>
              <p className="text-sm mt-2">Crea tu primer cliente haciendo click en "Nuevo Cliente"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      DNI / RUC
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Cliente
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Contacto
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-left">
                      Calificación
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-right">
                      Créditos
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-right">
                      Monto Total
                    </th>
                    <th className="px-4 py-2 text-[11px] font-medium text-gray-500 tracking-wide uppercase text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="border-b hover:bg-gray-50 text-sm">
                      <td className="px-4 py-3 text-gray-900">
                        {cliente.numero_documento}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {cliente.tipo_persona === 'natural'
                            ? `${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno || ''}`
                            : cliente.razon_social}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{cliente.telefono_secundario || cliente.telefono_principal || '-'}</p>
                        <p className="text-xs text-gray-500">{cliente.email || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        {cliente.calificacion_crediticia ? (
                          <Badge 
                            variant={
                              cliente.calificacion_crediticia === 'excelente' ? 'default' : 
                              cliente.calificacion_crediticia === 'bueno' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {cliente.calificacion_crediticia}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-medium text-gray-900">0</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-medium text-gray-900">S/ 0</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ClienteActions clienteId={cliente.id!} />
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
