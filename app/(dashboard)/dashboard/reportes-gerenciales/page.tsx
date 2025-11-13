'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Calendar,
  Download,
  Filter,
  DollarSign,
  Users,
  CreditCard,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface KPIData {
  nombre: string
  valor: number
  unidad: string
  cambio: number
  periodo: string
  estado: 'positivo' | 'negativo' | 'neutral'
  icono: React.ReactNode
}

interface ReporteRapido {
  id: string
  titulo: string
  descripcion: string
  tipo: 'financiero' | 'operativo' | 'riesgo' | 'cliente'
  frecuencia: 'diario' | 'semanal' | 'mensual'
  ultima_actualizacion: string
  icono: React.ReactNode
}

export default function ReportesGerencialesPage() {
  const [kpis, setKpis] = useState<KPIData[]>([])
  const [reportes, setReportes] = useState<ReporteRapido[]>([])
  const [loading, setLoading] = useState(true)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes')

  useEffect(() => {
    loadDashboardData()
  }, [periodoSeleccionado])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const kpisEjemplo = generarKPIs()
      const reportesEjemplo = generarReportes()
      
      setKpis(kpisEjemplo)
      setReportes(reportesEjemplo)
      
    } catch (error) {
      console.error('Error cargando dashboard:', error)
      toast.error('Error al cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  const generarKPIs = (): KPIData[] => {
    return [
      {
        nombre: 'Ingresos Totales',
        valor: 125000,
        unidad: 'S/',
        cambio: 12.5,
        periodo: 'vs mes anterior',
        estado: 'positivo',
        icono: <DollarSign className="h-6 w-6" />
      },
      {
        nombre: 'Créditos Activos',
        valor: 342,
        unidad: 'créditos',
        cambio: 8.3,
        periodo: 'vs mes anterior',
        estado: 'positivo',
        icono: <CreditCard className="h-6 w-6" />
      },
      {
        nombre: 'Clientes Nuevos',
        valor: 89,
        unidad: 'clientes',
        cambio: -5.2,
        periodo: 'vs mes anterior',
        estado: 'negativo',
        icono: <Users className="h-6 w-6" />
      },
      {
        nombre: 'Tasa de Morosidad',
        valor: 3.2,
        unidad: '%',
        cambio: -1.1,
        periodo: 'vs mes anterior',
        estado: 'positivo',
        icono: <AlertTriangle className="h-6 w-6" />
      },
      {
        nombre: 'Garantías en Stock',
        valor: 156,
        unidad: 'items',
        cambio: 15.7,
        periodo: 'vs mes anterior',
        estado: 'neutral',
        icono: <Package className="h-6 w-6" />
      },
      {
        nombre: 'ROI Promedio',
        valor: 18.5,
        unidad: '%',
        cambio: 2.3,
        periodo: 'vs mes anterior',
        estado: 'positivo',
        icono: <Target className="h-6 w-6" />
      },
      {
        nombre: 'Tiempo Prom. Tasación',
        valor: 12.3,
        unidad: 'min',
        cambio: -25.4,
        periodo: 'vs mes anterior',
        estado: 'positivo',
        icono: <Clock className="h-6 w-6" />
      },
      {
        nombre: 'Remates Exitosos',
        valor: 23,
        unidad: 'remates',
        cambio: 43.8,
        periodo: 'vs mes anterior',
        estado: 'positivo',
        icono: <CheckCircle className="h-6 w-6" />
      }
    ]
  }

  const generarReportes = (): ReporteRapido[] => {
    return [
      {
        id: 'financiero-mensual',
        titulo: 'Reporte Financiero Mensual',
        descripcion: 'Análisis completo de ingresos, gastos y rentabilidad',
        tipo: 'financiero',
        frecuencia: 'mensual',
        ultima_actualizacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icono: <DollarSign className="h-8 w-8" />
      },
      {
        id: 'operativo-semanal',
        titulo: 'Reporte Operativo Semanal',
        descripcion: 'Métricas de operación, eficiencia y productividad',
        tipo: 'operativo',
        frecuencia: 'semanal',
        ultima_actualizacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        icono: <BarChart3 className="h-8 w-8" />
      },
      {
        id: 'riesgo-diario',
        titulo: 'Reporte de Riesgo Diario',
        descripcion: 'Análisis de cartera, morosidad y exposición al riesgo',
        tipo: 'riesgo',
        frecuencia: 'diario',
        ultima_actualizacion: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        icono: <AlertTriangle className="h-8 w-8" />
      },
      {
        id: 'cliente-mensual',
        titulo: 'Análisis de Clientes',
        descripcion: 'Segmentación, comportamiento y satisfacción de clientes',
        tipo: 'cliente',
        frecuencia: 'mensual',
        ultima_actualizacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        icono: <Users className="h-8 w-8" />
      },
      {
        id: 'ia-semanal',
        titulo: 'Reporte de IA y Automatización',
        descripcion: 'Performance de modelos IA y procesos automatizados',
        tipo: 'operativo',
        frecuencia: 'semanal',
        ultima_actualizacion: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        icono: <Zap className="h-8 w-8" />
      },
      {
        id: 'remates-mensual',
        titulo: 'Análisis de Remates',
        descripcion: 'Efectividad de remates y recuperación de cartera',
        tipo: 'financiero',
        frecuencia: 'mensual',
        ultima_actualizacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        icono: <TrendingUp className="h-8 w-8" />
      }
    ]
  }

  const getKPIColor = (estado: string) => {
    const colors = {
      'positivo': 'text-green-600',
      'negativo': 'text-red-600',
      'neutral': 'text-blue-600'
    }
    return colors[estado as keyof typeof colors] || 'text-gray-600'
  }

  const getKPIBgColor = (estado: string) => {
    const colors = {
      'positivo': 'bg-green-100',
      'negativo': 'bg-red-100',
      'neutral': 'bg-blue-100'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-100'
  }

  const getTipoColor = (tipo: string) => {
    const colors = {
      'financiero': 'bg-green-100 text-green-800',
      'operativo': 'bg-blue-100 text-blue-800',
      'riesgo': 'bg-red-100 text-red-800',
      'cliente': 'bg-purple-100 text-purple-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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

  const formatNumero = (numero: number, unidad: string) => {
    if (unidad === 'S/') {
      return `S/ ${numero.toLocaleString('es-PE')}`
    }
    return `${numero.toLocaleString('es-PE')} ${unidad}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reportes Gerenciales</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
          <h1 className="text-3xl font-bold text-gray-900">Reportes Gerenciales</h1>
          <p className="text-gray-600">Dashboard ejecutivo con métricas clave del negocio</p>
        </div>
        <div className="flex gap-2">
          <select
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
            <option value="trimestre">Este Trimestre</option>
            <option value="año">Este Año</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{kpi.nombre}</p>
                  <p className="text-2xl font-bold mb-1">
                    {formatNumero(kpi.valor, kpi.unidad)}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${getKPIColor(kpi.estado)}`}>
                      {kpi.cambio > 0 ? '+' : ''}{kpi.cambio}%
                    </span>
                    <span className="text-xs text-gray-500">{kpi.periodo}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${getKPIBgColor(kpi.estado)}`}>
                  <div className={getKPIColor(kpi.estado)}>
                    {kpi.icono}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accesos Rápidos a Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/reportes-gerenciales/dashboard">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Dashboard Ejecutivo</h3>
                  <p className="text-sm text-gray-600">Vista consolidada de métricas clave</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">En Vivo</p>
                </div>
                <BarChart3 className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reportes-gerenciales/financiero">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Reportes Financieros</h3>
                  <p className="text-sm text-gray-600">Análisis de rentabilidad y flujo de caja</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">S/ 125K</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reportes-gerenciales/operativo">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Reportes Operativos</h3>
                  <p className="text-sm text-gray-600">Eficiencia y productividad operacional</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">95.2%</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Reportes Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reportes Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportes.map((reporte) => (
              <div key={reporte.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getTipoColor(reporte.tipo)}`}>
                    {reporte.icono}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {reporte.frecuencia}
                  </Badge>
                </div>
                
                <h4 className="font-semibold mb-2">{reporte.titulo}</h4>
                <p className="text-sm text-gray-600 mb-3">{reporte.descripcion}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <p>Actualizado:</p>
                    <p>{formatFecha(reporte.ultima_actualizacion)}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Indicadores Positivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ingresos en crecimiento</span>
                <Badge className="bg-green-100 text-green-800">+12.5%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ROI por encima del objetivo</span>
                <Badge className="bg-green-100 text-green-800">18.5%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Eficiencia IA mejorada</span>
                <Badge className="bg-green-100 text-green-800">-25.4%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Remates exitosos aumentaron</span>
                <Badge className="bg-green-100 text-green-800">+43.8%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Áreas de Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Clientes nuevos en descenso</span>
                <Badge className="bg-red-100 text-red-800">-5.2%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Inventario de garantías alto</span>
                <Badge className="bg-yellow-100 text-yellow-800">156 items</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Revisar estrategia de marketing</span>
                <Badge className="bg-orange-100 text-orange-800">Acción</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Optimizar proceso de captación</span>
                <Badge className="bg-orange-100 text-orange-800">Acción</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
