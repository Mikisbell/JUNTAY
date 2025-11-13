'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Gavel, 
  Calendar, 
  DollarSign, 
  Eye, 
  Plus, 
  Search,
  Filter,
  Clock,
  TrendingUp,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Remate {
  id?: string
  numero_remate: string
  estado: 'programado' | 'en_proceso' | 'vendido' | 'no_vendido' | 'cancelado'
  precio_base: number
  precio_final?: number
  fecha_inicio_remate: string
  fecha_fin_remate?: string
  incremento_minimo?: number
  ganador_nombre?: string
  created_at?: string
  updated_at?: string
  garantias?: {
    nombre?: string
  }
}

export default function RematesPage() {
  const [remates, setRemates] = useState<Remate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')

  useEffect(() => {
    loadRemates()
  }, [])

  const loadRemates = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('remates')
        .select(`
          *,
          garantias (
            nombre
          )
        `)
        .order('created_at', { ascending: false })
        
      if (error) throw error
      setRemates(data || [])
    } catch (error) {
      console.error('Error cargando remates:', error)
    } finally {
      setLoading(false)
    }
  }

  const rematesFiltrados = remates.filter(remate => {
    const matchesSearch = remate.numero_remate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remate.garantias?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === 'todos' || remate.estado === filtroEstado
    return matchesSearch && matchesEstado
  })

  const estadosRemate = [
    { value: 'todos', label: 'Todos los Estados', count: remates.length },
    { value: 'programado', label: 'Programados', count: remates.filter(r => r.estado === 'programado').length },
    { value: 'en_proceso', label: 'En Proceso', count: remates.filter(r => r.estado === 'en_proceso').length },
    { value: 'vendido', label: 'Vendidos', count: remates.filter(r => r.estado === 'vendido').length },
    { value: 'cancelado', label: 'Cancelados', count: remates.filter(r => r.estado === 'cancelado').length }
  ]

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'programado': 'secondary',
      'en_proceso': 'default',
      'vendido': 'success',
      'no_vendido': 'outline',
      'cancelado': 'destructive'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Remates</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Remates</h1>
          <p className="text-gray-600">Gestión de subastas de garantías vencidas</p>
        </div>
        <Link href="/dashboard/remates/nuevo">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Programar Remate
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Remates</p>
                <p className="text-2xl font-bold">{remates.length}</p>
              </div>
              <Gavel className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-green-600">
                  {remates.filter(r => r.estado === 'en_proceso').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Programados</p>
                <p className="text-2xl font-bold text-orange-600">
                  {remates.filter(r => r.estado === 'programado').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  S/ {remates
                    .filter(r => r.estado === 'vendido' && r.precio_final)
                    .reduce((sum, r) => sum + (r.precio_final || 0), 0)
                    .toFixed(0)
                  }
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por número de remate o garantía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {estadosRemate.map(estado => (
            <Button
              key={estado.value}
              variant={filtroEstado === estado.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroEstado(estado.value)}
              className="flex items-center gap-1"
            >
              <Filter className="h-3 w-3" />
              {estado.label} ({estado.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Remates Grid */}
      {rematesFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay remates</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroEstado !== 'todos' 
                ? 'No se encontraron remates con los filtros aplicados'
                : 'Aún no hay remates programados'
              }
            </p>
            <Link href="/dashboard/remates/nuevo">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Programar Primer Remate
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rematesFiltrados.map((remate) => (
            <Card key={remate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{remate.numero_remate}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {remate.garantias?.nombre || 'Garantía no especificada'}
                    </p>
                  </div>
                  <Badge variant={getEstadoBadge(remate.estado) as any}>
                    {remate.estado}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Precio Base</p>
                    <p className="font-semibold">S/ {remate.precio_base.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Precio Final</p>
                    <p className="font-semibold">
                      {remate.precio_final ? `S/ ${remate.precio_final.toFixed(2)}` : '-'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Inicio: {formatFecha(remate.fecha_inicio_remate)}</span>
                  </div>
                  {remate.fecha_fin_remate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Fin: {formatFecha(remate.fecha_fin_remate)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/dashboard/remates/${remate.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Button>
                  </Link>
                  {remate.estado === 'en_proceso' && (
                    <Link href={`/dashboard/remates/${remate.id}/ofertas`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <Gavel className="h-4 w-4 mr-2" />
                        Ofertas
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/remates/nuevo">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Plus className="h-5 w-5" />
                Nuevo Remate
              </Button>
            </Link>
            <Link href="/dashboard/remates/historial">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                Historial
              </Button>
            </Link>
            <Link href="/dashboard/garantias?estado=vencido">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Package className="h-5 w-5" />
                Garantías Vencidas
              </Button>
            </Link>
            <Link href="/dashboard/reportes/remates">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <TrendingUp className="h-5 w-5" />
                Reportes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
