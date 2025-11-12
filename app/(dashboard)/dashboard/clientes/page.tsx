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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gestión de clientes y prestatarios</p>
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
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Con Mora</p>
            <p className="text-2xl font-bold text-red-600">{stats.conMora}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Nuevos (mes)</p>
            <p className="text-2xl font-bold text-blue-600">{stats.nuevos}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search */}
      <ClientesSearch />
      
      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes</CardTitle>
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
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-700">DNI/RUC</th>
                    <th className="text-left p-4 font-medium text-gray-700">Cliente</th>
                    <th className="text-left p-4 font-medium text-gray-700">Contacto</th>
                    <th className="text-left p-4 font-medium text-gray-700">Calificación</th>
                    <th className="text-left p-4 font-medium text-gray-700">Créditos</th>
                    <th className="text-left p-4 font-medium text-gray-700">Monto Total</th>
                    <th className="text-right p-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{cliente.numero_documento}</td>
                      <td className="p-4">
                        <p className="font-medium">
                          {cliente.tipo_persona === 'natural'
                            ? `${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno || ''}`
                            : cliente.razon_social}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{cliente.telefono_secundario || cliente.telefono_principal || '-'}</p>
                        <p className="text-xs text-gray-600">{cliente.email || '-'}</p>
                      </td>
                      <td className="p-4">
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
                      <td className="p-4">
                        <span className="font-medium">0</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">S/ 0</span>
                      </td>
                      <td className="p-4">
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
