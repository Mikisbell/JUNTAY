'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, Calendar, Clock, DollarSign, User, 
  TrendingUp, TrendingDown, Search, Filter, Eye,
  FileText, Download, BarChart3
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Caja {
  id: string
  codigo: string
  nombre: string
}

interface SesionHistorial {
  id: string
  numero_sesion: number
  fecha_apertura: string
  fecha_cierre?: string
  usuario_apertura_id?: string
  usuario_cierre_id?: string
  monto_inicial: number
  monto_sistema?: number
  monto_contado?: number
  diferencia?: number
  total_ingresos: number
  total_egresos: number
  total_movimientos: number
  estado: string
  observaciones_apertura?: string
  observaciones_cierre?: string
}

export default function HistorialCajaPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [caja, setCaja] = useState<Caja | null>(null)
  const [sesiones, setSesiones] = useState<SesionHistorial[]>([])
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [params.id])

  async function cargarDatos() {
    try {
      // Cargar información de la caja
      const { data: cajaData } = await supabase
        .from('cajas')
        .select('*')
        .eq('id', params.id)
        .single()

      setCaja(cajaData)

      // Cargar sesiones (simulado - en producción vendría de sesiones_caja)
      const sesionesMock: SesionHistorial[] = [
        {
          id: '1',
          numero_sesion: 1,
          fecha_apertura: '2025-11-13T08:00:00Z',
          fecha_cierre: '2025-11-13T18:00:00Z',
          usuario_apertura_id: 'user1',
          usuario_cierre_id: 'user1',
          monto_inicial: 500.00,
          monto_sistema: 1250.00,
          monto_contado: 1245.00,
          diferencia: -5.00,
          total_ingresos: 800.00,
          total_egresos: 50.00,
          total_movimientos: 15,
          estado: 'cerrada',
          observaciones_apertura: 'Apertura normal',
          observaciones_cierre: 'Diferencia menor por cambio'
        },
        {
          id: '2',
          numero_sesion: 2,
          fecha_apertura: '2025-11-12T08:30:00Z',
          fecha_cierre: '2025-11-12T17:45:00Z',
          usuario_apertura_id: 'user2',
          usuario_cierre_id: 'user2',
          monto_inicial: 500.00,
          monto_sistema: 980.00,
          monto_contado: 980.00,
          diferencia: 0.00,
          total_ingresos: 600.00,
          total_egresos: 120.00,
          total_movimientos: 12,
          estado: 'cerrada'
        },
        {
          id: '3',
          numero_sesion: 3,
          fecha_apertura: '2025-11-11T09:00:00Z',
          monto_inicial: 500.00,
          total_ingresos: 320.00,
          total_egresos: 80.00,
          total_movimientos: 8,
          estado: 'abierta',
          usuario_apertura_id: 'user1'
        }
      ]

      setSesiones(sesionesMock)

    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const sesionesFiltradas = sesiones.filter(sesion => {
    const matchSearch = sesion.numero_sesion.toString().includes(searchTerm) ||
                       (sesion.observaciones_apertura?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       (sesion.observaciones_cierre?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchEstado = filtroEstado === 'todos' || sesion.estado === filtroEstado
    
    const matchFecha = !filtroFecha || 
                      new Date(sesion.fecha_apertura).toISOString().split('T')[0] === filtroFecha
    
    return matchSearch && matchEstado && matchFecha
  })

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'abierta': 'bg-green-100 text-green-800',
      'cerrada': 'bg-gray-100 text-gray-800',
      'cuadrada': 'bg-blue-100 text-blue-800',
      'con_diferencia': 'bg-yellow-100 text-yellow-800'
    }
    return variants[estado as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const calcularEstadisticas = () => {
    const sesionesCompletas = sesiones.filter(s => s.estado === 'cerrada')
    const totalSesiones = sesionesCompletas.length
    const totalIngresos = sesionesCompletas.reduce((sum, s) => sum + s.total_ingresos, 0)
    const totalEgresos = sesionesCompletas.reduce((sum, s) => sum + s.total_egresos, 0)
    const totalDiferencias = sesionesCompletas.reduce((sum, s) => sum + (s.diferencia || 0), 0)
    const promedioMovimientos = totalSesiones > 0 ? 
      sesionesCompletas.reduce((sum, s) => sum + s.total_movimientos, 0) / totalSesiones : 0

    return {
      totalSesiones,
      totalIngresos,
      totalEgresos,
      totalDiferencias,
      promedioMovimientos: Math.round(promedioMovimientos)
    }
  }

  const stats = calcularEstadisticas()

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
          <Link href="/dashboard/configuracion/cajas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historial de Sesiones</h1>
            <p className="text-gray-600 mt-1">
              {caja?.codigo} - {caja?.nombre}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Reporte
          </Button>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sesiones</p>
                <p className="text-2xl font-bold">{stats.totalSesiones}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  S/ {stats.totalIngresos.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Egresos</p>
                <p className="text-2xl font-bold text-red-600">
                  S/ {stats.totalEgresos.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diferencias</p>
                <p className={`text-2xl font-bold ${
                  stats.totalDiferencias >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  S/ {stats.totalDiferencias.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prom. Movimientos</p>
                <p className="text-2xl font-bold">{stats.promedioMovimientos}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por sesión u observaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-40"
              />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="todos">Todos los estados</option>
                <option value="abierta">Abiertas</option>
                <option value="cerrada">Cerradas</option>
                <option value="cuadrada">Cuadradas</option>
                <option value="con_diferencia">Con Diferencia</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Sesiones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Sesiones ({sesionesFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sesionesFiltradas.map((sesion) => (
              <div key={sesion.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600">#{sesion.numero_sesion}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Sesión #{sesion.numero_sesion}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(sesion.fecha_apertura).toLocaleString()}
                        {sesion.fecha_cierre && (
                          <> - {new Date(sesion.fecha_cierre).toLocaleString()}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getEstadoBadge(sesion.estado)}>
                      {sesion.estado.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Monto Inicial:</span>
                    <p className="font-semibold">S/ {sesion.monto_inicial.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Ingresos:</span>
                    <p className="font-semibold text-green-600">S/ {sesion.total_ingresos.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Egresos:</span>
                    <p className="font-semibold text-red-600">S/ {sesion.total_egresos.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Movimientos:</span>
                    <p className="font-semibold">{sesion.total_movimientos}</p>
                  </div>
                </div>

                {sesion.estado === 'cerrada' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Sistema:</span>
                      <p className="font-semibold">S/ {sesion.monto_sistema?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Contado:</span>
                      <p className="font-semibold">S/ {sesion.monto_contado?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Diferencia:</span>
                      <p className={`font-semibold ${
                        (sesion.diferencia || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        S/ {sesion.diferencia?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {(sesion.observaciones_apertura || sesion.observaciones_cierre) && (
                  <div className="mt-3 pt-3 border-t">
                    {sesion.observaciones_apertura && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Apertura:</span> {sesion.observaciones_apertura}
                      </p>
                    )}
                    {sesion.observaciones_cierre && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cierre:</span> {sesion.observaciones_cierre}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {sesionesFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No se encontraron sesiones con los filtros aplicados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
