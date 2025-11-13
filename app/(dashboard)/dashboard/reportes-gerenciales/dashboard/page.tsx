'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  DollarSign,
  Users,
  CreditCard,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface MetricaEjecutiva {
  id: string
  titulo: string
  valor: number
  unidad: string
  cambio: number
  tendencia: 'up' | 'down' | 'stable'
  objetivo?: number
  categoria: 'financiero' | 'operativo' | 'cliente' | 'riesgo'
  descripcion: string
}

interface GraficoData {
  periodo: string
  ingresos: number
  gastos: number
  utilidad: number
  creditos: number
  clientes: number
}

export default function DashboardEjecutivoPage() {
  const [metricas, setMetricas] = useState<MetricaEjecutiva[]>([])
  const [datosGrafico, setDatosGrafico] = useState<GraficoData[]>([])
  const [loading, setLoading] = useState(true)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('')

  useEffect(() => {
    loadDashboardEjecutivo()
  }, [])

  const loadDashboardEjecutivo = async () => {
    try {
      setLoading(true)
      
      const metricasEjemplo = generarMetricasEjecutivas()
      const graficosEjemplo = generarDatosGraficos()
      
      setMetricas(metricasEjemplo)
      setDatosGrafico(graficosEjemplo)
      setUltimaActualizacion(new Date().toISOString())
      
    } catch (error) {
      console.error('Error cargando dashboard ejecutivo:', error)
      toast.error('Error al cargar el dashboard ejecutivo')
    } finally {
      setLoading(false)
    }
  }

  const generarMetricasEjecutivas = (): MetricaEjecutiva[] => {
    return [
      {
        id: 'ingresos-totales',
        titulo: 'Ingresos Totales',
        valor: 125000,
        unidad: 'S/',
        cambio: 12.5,
        tendencia: 'up',
        objetivo: 120000,
        categoria: 'financiero',
        descripcion: 'Ingresos totales del período incluyendo intereses y comisiones'
      },
      {
        id: 'utilidad-neta',
        titulo: 'Utilidad Neta',
        valor: 45000,
        unidad: 'S/',
        cambio: 18.3,
        tendencia: 'up',
        objetivo: 40000,
        categoria: 'financiero',
        descripcion: 'Utilidad neta después de gastos operativos y financieros'
      },
      {
        id: 'roi-promedio',
        titulo: 'ROI Promedio',
        valor: 18.5,
        unidad: '%',
        cambio: 2.3,
        tendencia: 'up',
        objetivo: 15.0,
        categoria: 'financiero',
        descripcion: 'Retorno sobre inversión promedio de la cartera'
      },
      {
        id: 'creditos-activos',
        titulo: 'Créditos Activos',
        valor: 342,
        unidad: 'créditos',
        cambio: 8.3,
        tendencia: 'up',
        objetivo: 350,
        categoria: 'operativo',
        descripcion: 'Número total de créditos vigentes'
      },
      {
        id: 'tasa-morosidad',
        titulo: 'Tasa de Morosidad',
        valor: 3.2,
        unidad: '%',
        cambio: -1.1,
        tendencia: 'down',
        objetivo: 5.0,
        categoria: 'riesgo',
        descripcion: 'Porcentaje de créditos en mora mayor a 30 días'
      },
      {
        id: 'clientes-activos',
        titulo: 'Clientes Activos',
        valor: 287,
        unidad: 'clientes',
        cambio: 5.7,
        tendencia: 'up',
        objetivo: 300,
        categoria: 'cliente',
        descripcion: 'Clientes con al menos un crédito activo'
      },
      {
        id: 'tiempo-aprobacion',
        titulo: 'Tiempo Prom. Aprobación',
        valor: 15.3,
        unidad: 'min',
        cambio: -22.1,
        tendencia: 'down',
        objetivo: 20.0,
        categoria: 'operativo',
        descripcion: 'Tiempo promedio desde solicitud hasta aprobación'
      },
      {
        id: 'satisfaccion-cliente',
        titulo: 'Satisfacción Cliente',
        valor: 4.6,
        unidad: '/5',
        cambio: 0.3,
        tendencia: 'up',
        objetivo: 4.5,
        categoria: 'cliente',
        descripcion: 'Calificación promedio de satisfacción del cliente'
      }
    ]
  }

  const generarDatosGraficos = (): GraficoData[] => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    return meses.map(mes => ({
      periodo: mes,
      ingresos: Math.floor(Math.random() * 50000) + 80000,
      gastos: Math.floor(Math.random() * 30000) + 40000,
      utilidad: Math.floor(Math.random() * 20000) + 30000,
      creditos: Math.floor(Math.random() * 100) + 250,
      clientes: Math.floor(Math.random() * 50) + 200
    }))
  }

  const actualizarDatos = async () => {
    setLoading(true)
    await loadDashboardEjecutivo()
    toast.success('Dashboard actualizado')
  }

  const exportarDashboard = () => {
    // Simular exportación
    toast.success('Dashboard exportado exitosamente')
  }

  const getMetricaColor = (categoria: string) => {
    const colors = {
      'financiero': 'border-green-200 bg-green-50',
      'operativo': 'border-blue-200 bg-blue-50',
      'cliente': 'border-purple-200 bg-purple-50',
      'riesgo': 'border-red-200 bg-red-50'
    }
    return colors[categoria as keyof typeof colors] || 'border-gray-200 bg-gray-50'
  }

  const getTendenciaIcon = (tendencia: string, cambio: number) => {
    if (tendencia === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (tendencia === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Activity className="h-4 w-4 text-blue-600" />
  }

  const getCambioColor = (cambio: number, categoria: string) => {
    if (categoria === 'riesgo') {
      // Para métricas de riesgo, negativo es bueno
      return cambio < 0 ? 'text-green-600' : 'text-red-600'
    }
    return cambio > 0 ? 'text-green-600' : 'text-red-600'
  }

  const formatNumero = (numero: number, unidad: string) => {
    if (unidad === 'S/') {
      return `S/ ${numero.toLocaleString('es-PE')}`
    }
    return `${numero.toLocaleString('es-PE')} ${unidad}`
  }

  const calcularCumplimientoObjetivo = (valor: number, objetivo?: number) => {
    if (!objetivo) return null
    return ((valor / objetivo) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Ejecutivo</h1>
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reportes-gerenciales">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
            <p className="text-gray-600">Vista consolidada de métricas clave del negocio</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={actualizarDatos} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={exportarDashboard}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Información de Actualización */}
      {ultimaActualizacion && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Última actualización: {new Date(ultimaActualizacion).toLocaleString('es-PE')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Ejecutivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica) => (
          <Card key={metrica.id} className={`hover:shadow-md transition-shadow ${getMetricaColor(metrica.categoria)}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{metrica.titulo}</p>
                  <p className="text-2xl font-bold mb-2">
                    {formatNumero(metrica.valor, metrica.unidad)}
                  </p>
                </div>
                {getTendenciaIcon(metrica.tendencia, metrica.cambio)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Cambio:</span>
                  <span className={`text-xs font-medium ${getCambioColor(metrica.cambio, metrica.categoria)}`}>
                    {metrica.cambio > 0 ? '+' : ''}{metrica.cambio}%
                  </span>
                </div>
                
                {metrica.objetivo && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">vs Objetivo:</span>
                    <span className="text-xs font-medium text-blue-600">
                      {calcularCumplimientoObjetivo(metrica.valor, metrica.objetivo)}%
                    </span>
                  </div>
                )}
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">{metrica.descripcion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ingresos vs Gastos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Evolución Financiera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {datosGrafico.map((dato, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dato.periodo}</span>
                    <span className="text-green-600">S/ {dato.utilidad.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(dato.ingresos / 130000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 min-w-[60px]">
                        S/ {(dato.ingresos / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(dato.gastos / 130000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 min-w-[60px]">
                        S/ {(dato.gastos / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-xs">Ingresos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span className="text-xs">Gastos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Créditos y Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Evolución Operativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {datosGrafico.map((dato, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dato.periodo}</span>
                    <span className="text-blue-600">{dato.creditos} / {dato.clientes}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(dato.creditos / 350) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 min-w-[60px]">
                        {dato.creditos} créditos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(dato.clientes / 300) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 min-w-[60px]">
                        {dato.clientes} clientes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-xs">Créditos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded"></div>
                <span className="text-xs">Clientes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Ejecutivas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Objetivos Cumplidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ingresos Totales</span>
                <Badge className="bg-green-100 text-green-800">104.2%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ROI Promedio</span>
                <Badge className="bg-green-100 text-green-800">123.3%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Utilidad Neta</span>
                <Badge className="bg-green-100 text-green-800">112.5%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              En Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Créditos Activos</span>
                <Badge className="bg-yellow-100 text-yellow-800">97.7%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Clientes Activos</span>
                <Badge className="bg-yellow-100 text-yellow-800">95.7%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Target className="h-5 w-5" />
              Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium">Eficiencia Operativa</p>
                <p className="text-xs text-gray-600">Tiempo de aprobación mejoró 22%</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Satisfacción Cliente</p>
                <p className="text-xs text-gray-600">Superó objetivo en 2.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
