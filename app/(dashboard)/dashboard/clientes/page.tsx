"use client"

import { useState } from "react"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Datos de ejemplo
  const clientes = [
    {
      id: "1",
      numero_documento: "12345678",
      nombres: "Juan",
      apellidos: "Pérez López",
      telefono: "987654321",
      email: "juan.perez@email.com",
      calificacion: "excelente",
      creditos_activos: 2,
      monto_total: 15000
    },
    {
      id: "2",
      numero_documento: "87654321",
      nombres: "María",
      apellidos: "García Ruiz",
      telefono: "912345678",
      email: "maria.garcia@email.com",
      calificacion: "bueno",
      creditos_activos: 1,
      monto_total: 8000
    },
    {
      id: "3",
      numero_documento: "45678912",
      nombres: "Carlos",
      apellidos: "Sánchez Torres",
      telefono: "998877665",
      email: "carlos.sanchez@email.com",
      calificacion: "regular",
      creditos_activos: 0,
      monto_total: 0
    },
  ]
  
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
            <p className="text-2xl font-bold">128</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600">45</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Con Mora</p>
            <p className="text-2xl font-bold text-red-600">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Nuevos (mes)</p>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por DNI, nombre, teléfono o email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>Buscar</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
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
                      <p className="font-medium">{cliente.nombres} {cliente.apellidos}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{cliente.telefono}</p>
                      <p className="text-xs text-gray-600">{cliente.email}</p>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          cliente.calificacion === 'excelente' ? 'success' : 
                          cliente.calificacion === 'bueno' ? 'default' : 
                          'warning' as any
                        }
                      >
                        {cliente.calificacion}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{cliente.creditos_activos}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">S/ {cliente.monto_total.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
