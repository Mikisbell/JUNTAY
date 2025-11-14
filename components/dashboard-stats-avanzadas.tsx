'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Bell,
  Gavel,
  Star,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react'

interface StatsAvanzadas {
  garantias: {
    total: number
    disponibles: number
    en_prenda: number
    liberadas: number
    vendidas: number
    valor_total: number
  }
  clientes: {
    total: number
    activos: number
    score_promedio: number
    documentos_completos: number
  }
  creditos: {
    total: number
    vigentes: number
    en_mora: number
    pagados: number
    cartera_total: number
    mora_total: number
  }
  notificaciones: {
    pendientes: number
    enviadas_hoy: number
    tasa_entrega: number
  }
  remates: {
    programados: number
    vendidos_mes: number
    ingresos_remates: number
  }
  evaluaciones: {
    realizadas_mes: number
    aprobadas: number
    tasa_aprobacion: number
  }
}

export function DashboardStatsAvanzadas() {
  const [stats, setStats] = useState<StatsAvanzadas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarStats()
  }, [])

  const cargarStats = async () => {
    try {
      // Simulación de datos - en producción vendría de APIs
      const statsData: StatsAvanzadas = {
        garantias: {
          total: 156,
          disponibles: 45,
          en_prenda: 89,
          liberadas: 15,
          vendidas: 7,
          valor_total: 450000
        },
        clientes: {
          total: 234,
          activos: 189,
          score_promedio: 625,
          documentos_completos: 156
        },
        creditos: {
          total: 312,
          vigentes: 89,
          en_mora: 12,
          pagados: 211,
          cartera_total: 285000,
          mora_total: 15600
        },
        notificaciones: {
          pendientes: 8,
          enviadas_hoy: 23,
          tasa_entrega: 94.5
        },
        remates: {
          programados: 3,
          vendidos_mes: 5,
          ingresos_remates: 12500
        },
        evaluaciones: {
          realizadas_mes: 18,
          aprobadas: 14,
          tasa_aprobacion: 77.8
        }
      }
      
      setStats(statsData)
      setLoading(false)
    } catch (error) {
      console.error('Error cargando stats:', error)
      setLoading(false)
    }
  }

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(valor)
  }

  const formatearPorcentaje = (valor: number) => {
    return `${valor.toFixed(1)}%`
  }

  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600'
    if (score >= 600) return 'text-blue-600'
    if (score >= 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Fila 1: Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Garantías */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garantías</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.garantias.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-green-600 border-green-300">
                {stats.garantias.disponibles} disponibles
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor total: {formatearMoneda(stats.garantias.valor_total)}
            </p>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clientes.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm font-medium ${getScoreColor(stats.clientes.score_promedio)}`}>
                Score: {stats.clientes.score_promedio}
              </span>
              <TrendingUp className="h-3 w-3 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.clientes.documentos_completos} con docs completos
            </p>
          </CardContent>
        </Card>

        {/* Cartera */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartera Activa</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatearMoneda(stats.creditos.cartera_total)}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                {stats.creditos.vigentes} vigentes
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.creditos.en_mora} créditos en mora
            </p>
          </CardContent>
        </Card>

        {/* Mora */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mora Total</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatearMoneda(stats.creditos.mora_total)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-sm text-red-600">
                {formatearPorcentaje((stats.creditos.mora_total / stats.creditos.cartera_total) * 100)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de la cartera total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fila 2: Resumen Operativo (compacto) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              Resumen operativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Notificaciones</p>
                <p className="font-semibold">{stats.notificaciones.pendientes} pendientes</p>
                <p className="text-xs text-gray-500">
                  {formatearPorcentaje(stats.notificaciones.tasa_entrega)} entrega
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Remates</p>
                <p className="font-semibold">{stats.remates.programados} programados</p>
                <p className="text-xs text-gray-500">
                  Ingresos {formatearMoneda(stats.remates.ingresos_remates)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Evaluaciones</p>
                <p className="font-semibold">{stats.evaluaciones.realizadas_mes} este mes</p>
                <p className="text-xs text-gray-500">
                  {formatearPorcentaje(stats.evaluaciones.tasa_aprobacion)} aprobadas
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Actividad hoy</p>
                <p className="font-semibold">47 transacciones</p>
              </div>
            </div>
            <div className="mt-3 text-xs">
              <Link
                href="/dashboard/reportes-gerenciales/dashboard"
                className="text-blue-600 hover:underline"
              >
                Ver más métricas
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Recordatorios (compacto) */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-yellow-700" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                5 créditos vencen hoy
              </p>
              <p className="text-xs text-yellow-700">
                Requieren seguimiento inmediato
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/notificaciones/historial"
            className="text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
          >
            Ver todas las alertas
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
