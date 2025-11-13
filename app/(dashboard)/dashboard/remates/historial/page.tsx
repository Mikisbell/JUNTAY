'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
  DollarSign, 
  Eye, 
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Package,
  Trophy,
  Clock,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface RemateHistorial {
  id?: string
  numero_remate: string
  estado: 'vendido' | 'no_vendido' | 'cancelado'
  precio_base: number
  precio_final?: number
  fecha_inicio_remate: string
  fecha_fin_remate?: string
  ganador_nombre?: string
  created_at?: string
  garantias?: {
    nombre?: string
    valor_tasacion: number
  }
  ofertas_count?: number
  mejor_oferta?: number
}

interface EstadisticasHistorial {
  totalRemates: number
  rematesVendidos: number
  rematesNoVendidos: number
  rematesCancelados: number
  ingresosTotales: number
  promedioVenta: number
  tasaExito: number
  mejorVenta: number
}

export default function HistorialRematesPage() {
  const [remates, setRemates] = useState<RemateHistorial[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasHistorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroFecha, setFiltroFecha] = useState<string>('todos')

  useEffect(() => {
    loadHistorialRemates()
  }, [])

  const loadHistorialRemates = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Cargar remates finalizados
      const { data: rematesData, error: rematesError } = await supabase
        .from('remates')
        .select(`
          *,
          garantias (
            nombre,
            valor_tasacion
          )
        `)
        .in('estado', ['vendido', 'no_vendido', 'cancelado'])
        .order('fecha_fin_remate', { ascending: false })
        
      if (rematesError) throw rematesError
      
      // Para cada remate, obtener estadísticas de ofertas
      const rematesConOfertas = await Promise.all(
        (rematesData || []).map(async (remate) => {
          const { data: ofertasData } = await supabase
            .from('ofertas_remate')
            .select('monto_oferta')
            .eq('remate_id', remate.id)
            
          const ofertas = ofertasData || []
          const mejorOferta = ofertas.length > 0 
            ? Math.max(...ofertas.map(o => o.monto_oferta))
            : 0
            
          return {
            ...remate,
            ofertas_count: ofertas.length,
            mejor_oferta: mejorOferta
          }
        })
      )
      
      setRemates(rematesConOfertas)
      
      // Calcular estadísticas
      const stats = calcularEstadisticas(rematesConOfertas)
      setEstadisticas(stats)
      
    } catch (error) {
      console.error('Error cargando historial:', error)
      toast.error('Error al cargar el historial de remates')
    } finally {
      setLoading(false)
    }
  }

  const calcularEstadisticas = (remates: RemateHistorial[]): EstadisticasHistorial => {
    const totalRemates = remates.length
    const rematesVendidos = remates.filter(r => r.estado === 'vendido').length
    const rematesNoVendidos = remates.filter(r => r.estado === 'no_vendido').length
    const rematesCancelados = remates.filter(r => r.estado === 'cancelado').length
    
    const ventasExitosas = remates.filter(r => r.estado === 'vendido' && r.precio_final)
    const ingresosTotales = ventasExitosas.reduce((sum, r) => sum + (r.precio_final || 0), 0)
    const promedioVenta = ventasExitosas.length > 0 ? ingresosTotales / ventasExitosas.length : 0
    const tasaExito = totalRemates > 0 ? (rematesVendidos / totalRemates) * 100 : 0
    const mejorVenta = ventasExitosas.length > 0 
      ? Math.max(...ventasExitosas.map(r => r.precio_final || 0))
      : 0
    
    return {
      totalRemates,
      rematesVendidos,
      rematesNoVendidos,
      rematesCancelados,
      ingresosTotales,
      promedioVenta,
      tasaExito,
      mejorVenta
    }
  }

  const filtrarRemates = () => {
    return remates.filter(remate => {
      const matchesSearch = remate.numero_remate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           remate.garantias?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           remate.ganador_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesEstado = filtroEstado === 'todos' || remate.estado === filtroEstado
      
      let matchesFecha = true
      if (filtroFecha !== 'todos') {
        const fechaRemate = new Date(remate.fecha_fin_remate || remate.created_at || '')
        const ahora = new Date()
        
        switch (filtroFecha) {
          case 'ultima_semana':
            matchesFecha = fechaRemate >= new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'ultimo_mes':
            matchesFecha = fechaRemate >= new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case 'ultimos_3_meses':
            matchesFecha = fechaRemate >= new Date(ahora.getTime() - 90 * 24 * 60 * 60 * 1000)
            break
        }
      }
      
      return matchesSearch && matchesEstado && matchesFecha
    })
  }

  const exportarHistorial = () => {
    const rematesFiltrados = filtrarRemates()
    const csvContent = [
      ['Número', 'Garantía', 'Estado', 'Precio Base', 'Precio Final', 'Ganador', 'Fecha Fin', 'Ofertas'],
      ...rematesFiltrados.map(r => [
        r.numero_remate,
        r.garantias?.nombre || '',
        r.estado,
        r.precio_base.toFixed(2),
        (r.precio_final || 0).toFixed(2),
        r.ganador_nombre || '',
        r.fecha_fin_remate ? new Date(r.fecha_fin_remate).toLocaleDateString('es-PE') : '',
        r.ofertas_count?.toString() || '0'
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial_remates_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Historial exportado exitosamente')
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'vendido': 'success',
      'no_vendido': 'secondary',
      'cancelado': 'destructive'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const rematesFiltrados = filtrarRemates()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Historial de Remates</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
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
          <h1 className="text-3xl font-bold text-gray-900">Historial de Remates</h1>
          <p className="text-gray-600">Análisis completo de remates finalizados</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportarHistorial} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Link href="/dashboard/remates">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Remates Activos
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Remates</p>
                  <p className="text-2xl font-bold">{estadisticas.totalRemates}</p>
                  <p className="text-xs text-gray-500">Finalizados</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa de Éxito</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.tasaExito.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{estadisticas.rematesVendidos} vendidos</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-purple-600">S/ {estadisticas.ingresosTotales.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Promedio: S/ {estadisticas.promedioVenta.toFixed(0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mejor Venta</p>
                  <p className="text-2xl font-bold text-orange-600">S/ {estadisticas.mejorVenta.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Récord histórico</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por número, garantía o ganador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Estados</option>
            <option value="vendido">Vendidos</option>
            <option value="no_vendido">No Vendidos</option>
            <option value="cancelado">Cancelados</option>
          </select>
          
          <select
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las Fechas</option>
            <option value="ultima_semana">Última Semana</option>
            <option value="ultimo_mes">Último Mes</option>
            <option value="ultimos_3_meses">Últimos 3 Meses</option>
          </select>
        </div>
      </div>

      {/* Lista de Remates */}
      {rematesFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay remates en el historial</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroEstado !== 'todos' || filtroFecha !== 'todos'
                ? 'No se encontraron remates con los filtros aplicados'
                : 'Aún no hay remates finalizados'
              }
            </p>
            <Link href="/dashboard/remates/nuevo">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Programar Primer Remate
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rematesFiltrados.map((remate) => (
            <Card key={remate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{remate.numero_remate}</h3>
                      <Badge variant={getEstadoBadge(remate.estado) as any}>
                        {remate.estado.replace('_', ' ')}
                      </Badge>
                      {remate.ofertas_count && remate.ofertas_count > 0 && (
                        <Badge variant="outline">
                          {remate.ofertas_count} ofertas
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-1">{remate.garantias?.nombre}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Precio base: S/ {remate.precio_base.toFixed(2)}</span>
                      {remate.mejor_oferta && remate.mejor_oferta > 0 && (
                        <span>Mejor oferta: S/ {remate.mejor_oferta.toFixed(2)}</span>
                      )}
                      {remate.fecha_fin_remate && (
                        <span>Finalizado: {formatFecha(remate.fecha_fin_remate)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {remate.precio_final ? (
                        <>
                          <p className="text-2xl font-bold text-green-600">
                            S/ {remate.precio_final.toFixed(2)}
                          </p>
                          {remate.ganador_nombre && (
                            <p className="text-sm text-gray-600">
                              Ganador: {remate.ganador_nombre}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-lg font-semibold text-gray-500">
                          Sin venta
                        </p>
                      )}
                    </div>
                    
                    <Link href={`/dashboard/remates/${remate.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resumen de Filtros */}
      {rematesFiltrados.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Mostrando {rematesFiltrados.length} de {remates.length} remates
              </span>
              <span>
                Ingresos filtrados: S/ {rematesFiltrados
                  .filter(r => r.precio_final)
                  .reduce((sum, r) => sum + (r.precio_final || 0), 0)
                  .toFixed(2)
                }
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
