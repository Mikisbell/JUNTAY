'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, Plus, Edit, Trash2, Eye, Settings, 
  Search, Filter, MoreHorizontal, CheckCircle, XCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Caja {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  ubicacion?: string
  estado: 'abierta' | 'cerrada' | 'en_arqueo' | 'bloqueada'
  activa: boolean
  responsable_actual_id?: string
  fecha_ultima_apertura?: string
  fecha_ultimo_cierre?: string
  created_at: string
}

export default function GestionCajasPage() {
  const [cajas, setCajas] = useState<Caja[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('todos')

  useEffect(() => {
    cargarCajas()
  }, [])

  async function cargarCajas() {
    try {
      const { data, error } = await supabase
        .from('cajas')
        .select('*')
        .order('codigo')

      if (error) throw error
      setCajas(data || [])
    } catch (error) {
      console.error('Error cargando cajas:', error)
    } finally {
      setLoading(false)
    }
  }

  const cajasFiltradas = cajas.filter(caja => {
    const matchSearch = caja.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       caja.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = filterEstado === 'todos' || caja.estado === filterEstado
    return matchSearch && matchFilter
  })

  const toggleActiva = async (cajaId: string, activa: boolean) => {
    try {
      const { error } = await supabase
        .from('cajas')
        .update({ activa: !activa })
        .eq('id', cajaId)

      if (error) throw error
      await cargarCajas()
    } catch (error) {
      console.error('Error actualizando caja:', error)
    }
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'abierta': 'bg-green-100 text-green-800',
      'cerrada': 'bg-gray-100 text-gray-800', 
      'en_arqueo': 'bg-yellow-100 text-yellow-800',
      'bloqueada': 'bg-red-100 text-red-800'
    }
    return variants[estado as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/configuracion">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏦 Gestión de Cajas</h1>
            <p className="text-gray-600 mt-1">Administrar cajas del sistema</p>
          </div>
        </div>
        <Link href="/dashboard/configuracion/cajas/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Caja
          </Button>
        </Link>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cajas</p>
                <p className="text-2xl font-bold">{cajas.length}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cajas Abiertas</p>
                <p className="text-2xl font-bold text-green-600">
                  {cajas.filter(c => c.estado === 'abierta').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cajas Activas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {cajas.filter(c => c.activa).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bloqueadas</p>
                <p className="text-2xl font-bold text-red-600">
                  {cajas.filter(c => c.estado === 'bloqueada').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="todos">Todos los estados</option>
                <option value="abierta">Abiertas</option>
                <option value="cerrada">Cerradas</option>
                <option value="en_arqueo">En Arqueo</option>
                <option value="bloqueada">Bloqueadas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cajas */}
      <Card>
        <CardHeader>
          <CardTitle>Cajas Registradas ({cajasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Código</th>
                  <th className="text-left py-3 px-4 font-medium">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium">Ubicación</th>
                  <th className="text-left py-3 px-4 font-medium">Estado</th>
                  <th className="text-left py-3 px-4 font-medium">Activa</th>
                  <th className="text-left py-3 px-4 font-medium">Última Apertura</th>
                  <th className="text-right py-3 px-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cajasFiltradas.map((caja) => (
                  <tr key={caja.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {caja.codigo}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{caja.nombre}</p>
                        {caja.descripcion && (
                          <p className="text-sm text-gray-600">{caja.descripcion}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {caja.ubicacion || 'No especificada'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getEstadoBadge(caja.estado)}>
                        {caja.estado.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleActiva(caja.id, caja.activa)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          caja.activa ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          caja.activa ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {caja.fecha_ultima_apertura 
                        ? new Date(caja.fecha_ultima_apertura).toLocaleDateString()
                        : 'Nunca'
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/caja/${caja.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/configuracion/cajas/${caja.id}/editar`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/configuracion/cajas/${caja.id}/historial`}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {cajasFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron cajas con los filtros aplicados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
