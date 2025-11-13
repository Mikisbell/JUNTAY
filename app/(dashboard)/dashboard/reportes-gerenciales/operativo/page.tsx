'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Activity, 
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  Brain,
  Package,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface MetricaOperativa {
  nombre: string
  valor: number
  unidad: string
  objetivo: number
  cumplimiento: number
  tendencia: 'up' | 'down' | 'stable'
  categoria: 'eficiencia' | 'calidad' | 'productividad' | 'automatizacion'
}

interface ProcesoOperativo {
  proceso: string
  tiempo_promedio: number
  objetivo_tiempo: number
  volumen_diario: number
  tasa_exito: number
  automatizado: boolean
  mejora_mes: number
}

interface RendimientoPersonal {
  empleado: string
  rol: string
  creditos_procesados: number
  tiempo_promedio: number
  calificacion: number
  eficiencia: number
}

export default function ReportesOperativosPage() {
  const [metricas, setMetricas] = useState<MetricaOperativa[]>([])
  const [procesos, setProcesos] = useState<ProcesoOperativo[]>([])
  const [personal, setPersonal] = useState<RendimientoPersonal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReportesOperativos()
  }, [])

  const loadReportesOperativos = async () => {
    try {
      setLoading(true)
      
      const metricasEjemplo = generarMetricasOperativas()
      const procesosEjemplo = generarProcesosOperativos()
      const personalEjemplo = generarRendimientoPersonal()
      
      setMetricas(metricasEjemplo)
      setProcesos(procesosEjemplo)
      setPersonal(personalEjemplo)
      
    } catch (error) {
      console.error('Error cargando reportes operativos:', error)
      toast.error('Error al cargar los reportes operativos')
    } finally {
      setLoading(false)
    }
  }

  const generarMetricasOperativas = (): MetricaOperativa[] => {
    return [
      {
        nombre: 'Tiempo Prom. Aprobación',
        valor: 15.3,
        unidad: 'min',
        objetivo: 20.0,
        cumplimiento: 123.5,
        tendencia: 'down',
        categoria: 'eficiencia'
      },
      {
        nombre: 'Tasa de Aprobación',
        valor: 87.5,
        unidad: '%',
        objetivo: 85.0,
        cumplimiento: 102.9,
        tendencia: 'up',
        categoria: 'calidad'
      },
      {
        nombre: 'Créditos por Día',
        valor: 45,
        unidad: 'créditos',
        objetivo: 40,
        cumplimiento: 112.5,
        tendencia: 'up',
        categoria: 'productividad'
      },
      {
        nombre: 'Satisfacción Cliente',
        valor: 4.6,
        unidad: '/5',
        objetivo: 4.5,
        cumplimiento: 102.2,
        tendencia: 'up',
        categoria: 'calidad'
      },
      {
        nombre: 'Procesos Automatizados',
        valor: 78,
        unidad: '%',
        objetivo: 75,
        cumplimiento: 104.0,
        tendencia: 'up',
        categoria: 'automatizacion'
      },
      {
        nombre: 'Tiempo Prom. Tasación',
        valor: 12.3,
        unidad: 'min',
        objetivo: 15.0,
        cumplimiento: 122.0,
        tendencia: 'down',
        categoria: 'eficiencia'
      },
      {
        nombre: 'Precisión IA',
        valor: 94.2,
        unidad: '%',
        objetivo: 90.0,
        cumplimiento: 104.7,
        tendencia: 'up',
        categoria: 'automatizacion'
      },
      {
        nombre: 'Utilización Personal',
        valor: 92.1,
        unidad: '%',
        objetivo: 85.0,
        cumplimiento: 108.4,
        tendencia: 'up',
        categoria: 'productividad'
      }
    ]
  }

  const generarProcesosOperativos = (): ProcesoOperativo[] => {
    return [
      {
        proceso: 'Solicitud de Crédito',
        tiempo_promedio: 15.3,
        objetivo_tiempo: 20.0,
        volumen_diario: 45,
        tasa_exito: 87.5,
        automatizado: true,
        mejora_mes: -22.1
      },
      {
        proceso: 'Tasación de Garantías',
        tiempo_promedio: 12.3,
        objetivo_tiempo: 15.0,
        volumen_diario: 38,
        tasa_exito: 94.2,
        automatizado: true,
        mejora_mes: -25.4
      },
      {
        proceso: 'Verificación RENIEC',
        tiempo_promedio: 2.1,
        objetivo_tiempo: 3.0,
        volumen_diario: 52,
        tasa_exito: 98.7,
        automatizado: true,
        mejora_mes: -15.3
      },
      {
        proceso: 'Generación Contratos',
        tiempo_promedio: 3.5,
        objetivo_tiempo: 5.0,
        volumen_diario: 42,
        tasa_exito: 99.1,
        automatizado: true,
        mejora_mes: -18.7
      },
      {
        proceso: 'Control de Caja',
        tiempo_promedio: 8.2,
        objetivo_tiempo: 10.0,
        volumen_diario: 25,
        tasa_exito: 96.3,
        automatizado: false,
        mejora_mes: -5.2
      },
      {
        proceso: 'Proceso Vencimientos',
        tiempo_promedio: 1.8,
        objetivo_tiempo: 5.0,
        volumen_diario: 15,
        tasa_exito: 92.8,
        automatizado: true,
        mejora_mes: -45.2
      }
    ]
  }

  const generarRendimientoPersonal = (): RendimientoPersonal[] => {
    return [
      {
        empleado: 'María García',
        rol: 'Gerente',
        creditos_procesados: 156,
        tiempo_promedio: 14.2,
        calificacion: 4.8,
        eficiencia: 95.3
      },
      {
        empleado: 'Carlos López',
        rol: 'Cajero',
        creditos_procesados: 234,
        tiempo_promedio: 16.1,
        calificacion: 4.6,
        eficiencia: 92.1
      },
      {
        empleado: 'Ana Martín',
        rol: 'Evaluador',
        creditos_procesados: 189,
        tiempo_promedio: 11.8,
        calificacion: 4.7,
        eficiencia: 96.8
      },
      {
        empleado: 'Luis Rodríguez',
        rol: 'Cajero',
        creditos_procesados: 198,
        tiempo_promedio: 17.3,
        calificacion: 4.4,
        eficiencia: 88.7
      }
    ]
  }

  const exportarReporte = () => {
    toast.success('Reporte operativo exportado exitosamente')
  }

  const actualizarDatos = async () => {
    setLoading(true)
    await loadReportesOperativos()
    toast.success('Datos actualizados')
  }

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      'eficiencia': 'border-blue-200 bg-blue-50',
      'calidad': 'border-green-200 bg-green-50',
      'productividad': 'border-purple-200 bg-purple-50',
      'automatizacion': 'border-orange-200 bg-orange-50'
    }
    return colors[categoria as keyof typeof colors] || 'border-gray-200 bg-gray-50'
  }

  const getCumplimientoColor = (cumplimiento: number) => {
    if (cumplimiento >= 100) return 'text-green-600'
    if (cumplimiento >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTendenciaIcon = (tendencia: string) => {
    if (tendencia === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (tendencia === 'down') return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    return <Activity className="h-4 w-4 text-blue-600" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reportes Operativos</h1>
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
            <h1 className="text-3xl font-bold text-gray-900">Reportes Operativos</h1>
            <p className="text-gray-600">Análisis de eficiencia y productividad operacional</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={actualizarDatos} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={exportarReporte}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Operativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => (
          <Card key={index} className={`hover:shadow-md transition-shadow ${getCategoriaColor(metrica.categoria)}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{metrica.nombre}</p>
                  <p className="text-2xl font-bold mb-2">
                    {metrica.valor} {metrica.unidad}
                  </p>
                </div>
                {getTendenciaIcon(metrica.tendencia)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Objetivo:</span>
                  <span className="text-xs font-medium">
                    {metrica.objetivo} {metrica.unidad}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Cumplimiento:</span>
                  <span className={`text-xs font-medium ${getCumplimientoColor(metrica.cumplimiento)}`}>
                    {metrica.cumplimiento.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${metrica.cumplimiento >= 100 ? 'bg-green-600' : 'bg-yellow-600'}`}
                    style={{ width: `${Math.min(metrica.cumplimiento, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Análisis de Procesos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Análisis de Procesos Operativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Proceso</th>
                  <th className="text-center p-3">Tiempo Prom.</th>
                  <th className="text-center p-3">Objetivo</th>
                  <th className="text-center p-3">Volumen/Día</th>
                  <th className="text-center p-3">Tasa Éxito</th>
                  <th className="text-center p-3">Automatizado</th>
                  <th className="text-center p-3">Mejora Mes</th>
                </tr>
              </thead>
              <tbody>
                {procesos.map((proceso, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{proceso.proceso}</td>
                    <td className="p-3 text-center">
                      <Badge variant={proceso.tiempo_promedio <= proceso.objetivo_tiempo ? 'default' : 'secondary'}>
                        {proceso.tiempo_promedio} min
                      </Badge>
                    </td>
                    <td className="p-3 text-center text-gray-600">
                      {proceso.objetivo_tiempo} min
                    </td>
                    <td className="p-3 text-center font-semibold">
                      {proceso.volumen_diario}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={proceso.tasa_exito >= 95 ? 'default' : 'secondary'}>
                        {proceso.tasa_exito}%
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {proceso.automatizado ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Sí
                        </Badge>
                      ) : (
                        <Badge variant="outline">Manual</Badge>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-semibold ${proceso.mejora_mes < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {proceso.mejora_mes > 0 ? '+' : ''}{proceso.mejora_mes}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Rendimiento del Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Rendimiento del Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personal.map((empleado, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {empleado.empleado.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{empleado.empleado}</h4>
                    <p className="text-sm text-gray-600">{empleado.rol}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Créditos procesados:</span>
                    <span className="font-semibold">{empleado.creditos_procesados}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiempo promedio:</span>
                    <span className="font-semibold">{empleado.tiempo_promedio} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calificación:</span>
                    <Badge variant="outline">{empleado.calificacion}/5</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Eficiencia:</span>
                    <Badge variant={empleado.eficiencia >= 95 ? 'default' : 'secondary'}>
                      {empleado.eficiencia}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Automatización */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Logros Operativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tiempo aprobación mejorado</span>
                <Badge className="bg-green-100 text-green-800">-22.1%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Precisión IA superó objetivo</span>
                <Badge className="bg-green-100 text-green-800">94.2%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Automatización avanzada</span>
                <Badge className="bg-green-100 text-green-800">78%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Satisfacción cliente alta</span>
                <Badge className="bg-green-100 text-green-800">4.6/5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Target className="h-5 w-5" />
              Oportunidades de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Automatizar Control de Caja</p>
                <p className="text-xs text-gray-600">Único proceso manual restante</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Capacitación Personal</p>
                <p className="text-xs text-gray-600">Mejorar eficiencia promedio a 95%</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Optimizar Flujo Vencimientos</p>
                <p className="text-xs text-gray-600">Ya mejoró 45%, continuar optimización</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Integrar más procesos IA</p>
                <p className="text-xs text-gray-600">Expandir automatización inteligente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
