import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { getCreditos, getCreditosStats } from "@/lib/api/creditos"

export const dynamic = 'force-dynamic'

export default async function CreditosPage() {
  const creditos = await getCreditos()
  const stats = await getCreditosStats()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Créditos</h1>
          <p className="text-sm text-gray-600">Gestión de préstamos y empeños</p>
        </div>
        <Link href="/dashboard/creditos/nueva-solicitud">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Solicitud
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Créditos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vigentes</p>
                <p className="text-2xl font-bold text-green-600">{stats.vigentes}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Mora</p>
                <p className="text-2xl font-bold text-red-600">{stats.enMora}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagados</p>
                <p className="text-2xl font-bold text-purple-600">{stats.pagados}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cartera Activa</p>
                <p className="text-2xl font-bold text-orange-600">
                  S/ {stats.montoCartera.toFixed(0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-900">Listado de Créditos</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Créditos otorgados, su estado y saldos pendientes.
          </p>
        </CardHeader>
        <CardContent>
          {creditos.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay créditos registrados</p>
              <Link href="/dashboard/creditos/nueva-solicitud">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Solicitud
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Código</th>
                    <th className="text-left p-4 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Cliente</th>
                    <th className="text-left p-4 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Monto</th>
                    <th className="text-left p-4 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Saldo</th>
                    <th className="text-left p-4 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Cuotas</th>
                    <th className="text-left p-4 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Estado</th>
                    <th className="text-left p-4 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Fecha</th>
                    <th className="text-right p-4 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {creditos.map((credito) => (
                    <tr key={credito.id} className="border-b hover:bg-gray-50 text-sm">
                      <td className="px-4 py-3 font-mono text-sm text-gray-900">{credito.codigo}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {credito.clientes?.tipo_persona === 'natural'
                            ? `${credito.clientes?.nombres} ${credito.clientes?.apellido_paterno}`
                            : credito.clientes?.razon_social}
                        </p>
                        <p className="text-xs text-gray-500">{credito.clientes?.numero_documento}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">S/ {credito.monto_prestado.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Total: S/ {credito.monto_total.toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-orange-600">S/ {credito.saldo_pendiente.toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p>{credito.cuotas_pagadas || 0} / {credito.numero_cuotas}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={
                            credito.estado === 'vigente' ? 'default' : 
                            credito.estado === 'en_mora' ? 'destructive' : 
                            credito.estado === 'pagado' ? 'secondary' :
                            'outline'
                          }
                        >
                          {credito.estado.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(credito.fecha_desembolso).toLocaleDateString('es-PE')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/dashboard/creditos/${credito.id}`}>
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
