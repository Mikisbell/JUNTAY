'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Brain, 
  Database, 
  Upload,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Cpu,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  FileText,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ModeloEntrenamiento {
  id?: string
  nombre: string
  categoria: string
  version: string
  estado: 'entrenando' | 'completado' | 'pausado' | 'error' | 'pendiente'
  progreso: number
  precision_actual: number
  precision_objetivo: number
  datos_entrenamiento: number
  datos_validacion: number
  epoca_actual: number
  epocas_totales: number
  tiempo_estimado: number
  tiempo_transcurrido: number
  fecha_inicio?: string
  fecha_fin?: string
  metricas: {
    loss: number
    accuracy: number
    val_loss: number
    val_accuracy: number
  }
  configuracion: {
    learning_rate: number
    batch_size: number
    arquitectura: string
    optimizador: string
  }
}

interface DatasetInfo {
  id: string
  nombre: string
  categoria: string
  total_imagenes: number
  imagenes_etiquetadas: number
  calidad_promedio: number
  ultima_actualizacion: string
  estado: 'activo' | 'procesando' | 'error'
}

export default function EntrenamientoIAPage() {
  const [modelos, setModelos] = useState<ModeloEntrenamiento[]>([])
  const [datasets, setDatasets] = useState<DatasetInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [entrenamientoActivo, setEntrenamientoActivo] = useState(false)

  useEffect(() => {
    loadDatosEntrenamiento()
  }, [])

  const loadDatosEntrenamiento = async () => {
    try {
      setLoading(true)
      
      const modelosEjemplo = generarModelosEntrenamiento()
      const datasetsEjemplo = generarDatasets()
      
      setModelos(modelosEjemplo)
      setDatasets(datasetsEjemplo)
      
    } catch (error) {
      console.error('Error cargando datos de entrenamiento:', error)
      toast.error('Error al cargar los datos de entrenamiento')
    } finally {
      setLoading(false)
    }
  }

  const generarModelosEntrenamiento = (): ModeloEntrenamiento[] => {
    return [
      {
        id: 'modelo-1',
        nombre: 'JoyasNet v4.0',
        categoria: 'Joyas',
        version: '4.0.0',
        estado: 'entrenando',
        progreso: 65,
        precision_actual: 91.2,
        precision_objetivo: 95.0,
        datos_entrenamiento: 15000,
        datos_validacion: 3000,
        epoca_actual: 65,
        epocas_totales: 100,
        tiempo_estimado: 120, // minutos
        tiempo_transcurrido: 78,
        fecha_inicio: new Date(Date.now() - 78 * 60 * 1000).toISOString(),
        metricas: {
          loss: 0.234,
          accuracy: 91.2,
          val_loss: 0.287,
          val_accuracy: 89.8
        },
        configuracion: {
          learning_rate: 0.001,
          batch_size: 32,
          arquitectura: 'ResNet50',
          optimizador: 'Adam'
        }
      },
      {
        id: 'modelo-2',
        nombre: 'TechVision v3.0',
        categoria: 'Electrónicos',
        version: '3.0.0',
        estado: 'completado',
        progreso: 100,
        precision_actual: 93.7,
        precision_objetivo: 92.0,
        datos_entrenamiento: 22000,
        datos_validacion: 4400,
        epoca_actual: 80,
        epocas_totales: 80,
        tiempo_estimado: 180,
        tiempo_transcurrido: 175,
        fecha_inicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        fecha_fin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        metricas: {
          loss: 0.156,
          accuracy: 93.7,
          val_loss: 0.198,
          val_accuracy: 92.1
        },
        configuracion: {
          learning_rate: 0.0005,
          batch_size: 64,
          arquitectura: 'EfficientNet-B3',
          optimizador: 'AdamW'
        }
      },
      {
        id: 'modelo-3',
        nombre: 'AutoDetect v2.0',
        categoria: 'Vehículos',
        version: '2.0.0',
        estado: 'pausado',
        progreso: 45,
        precision_actual: 87.3,
        precision_objetivo: 90.0,
        datos_entrenamiento: 8500,
        datos_validacion: 1700,
        epoca_actual: 45,
        epocas_totales: 100,
        tiempo_estimado: 200,
        tiempo_transcurrido: 90,
        fecha_inicio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        metricas: {
          loss: 0.312,
          accuracy: 87.3,
          val_loss: 0.345,
          val_accuracy: 85.9
        },
        configuracion: {
          learning_rate: 0.002,
          batch_size: 16,
          arquitectura: 'YOLOv8',
          optimizador: 'SGD'
        }
      }
    ]
  }

  const generarDatasets = (): DatasetInfo[] => {
    return [
      {
        id: 'dataset-joyas',
        nombre: 'Dataset Joyas Premium',
        categoria: 'Joyas',
        total_imagenes: 18000,
        imagenes_etiquetadas: 17500,
        calidad_promedio: 94.2,
        ultima_actualizacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estado: 'activo'
      },
      {
        id: 'dataset-electronicos',
        nombre: 'Dataset Electrónicos 2025',
        categoria: 'Electrónicos',
        total_imagenes: 26400,
        imagenes_etiquetadas: 25800,
        calidad_promedio: 96.1,
        ultima_actualizacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        estado: 'activo'
      },
      {
        id: 'dataset-vehiculos',
        nombre: 'Dataset Vehículos Lima',
        categoria: 'Vehículos',
        total_imagenes: 10200,
        imagenes_etiquetadas: 9800,
        calidad_promedio: 89.7,
        ultima_actualizacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        estado: 'procesando'
      },
      {
        id: 'dataset-general',
        nombre: 'Dataset General Mix',
        categoria: 'General',
        total_imagenes: 45000,
        imagenes_etiquetadas: 42000,
        calidad_promedio: 91.5,
        ultima_actualizacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        estado: 'activo'
      }
    ]
  }

  const iniciarEntrenamiento = async (modeloId: string) => {
    setEntrenamientoActivo(true)
    
    setModelos(prev => prev.map(m => 
      m.id === modeloId 
        ? { ...m, estado: 'entrenando' as const, fecha_inicio: new Date().toISOString() }
        : m
    ))
    
    toast.success('Entrenamiento iniciado')
    
    // Simular progreso
    const interval = setInterval(() => {
      setModelos(prev => prev.map(m => {
        if (m.id === modeloId && m.estado === 'entrenando') {
          const nuevoProgreso = Math.min(m.progreso + Math.random() * 5, 100)
          const nuevaEpoca = Math.floor((nuevoProgreso / 100) * m.epocas_totales)
          
          return {
            ...m,
            progreso: nuevoProgreso,
            epoca_actual: nuevaEpoca,
            tiempo_transcurrido: m.tiempo_transcurrido + 1,
            precision_actual: m.precision_actual + Math.random() * 0.5,
            metricas: {
              ...m.metricas,
              accuracy: m.precision_actual + Math.random() * 0.5,
              loss: Math.max(0.1, m.metricas.loss - Math.random() * 0.01)
            }
          }
        }
        return m
      }))
    }, 2000)
    
    setTimeout(() => {
      clearInterval(interval)
      setEntrenamientoActivo(false)
    }, 30000)
  }

  const pausarEntrenamiento = async (modeloId: string) => {
    setModelos(prev => prev.map(m => 
      m.id === modeloId 
        ? { ...m, estado: 'pausado' as const }
        : m
    ))
    
    toast.success('Entrenamiento pausado')
  }

  const reiniciarEntrenamiento = async (modeloId: string) => {
    setModelos(prev => prev.map(m => 
      m.id === modeloId 
        ? { 
            ...m, 
            estado: 'pendiente' as const, 
            progreso: 0, 
            epoca_actual: 0,
            tiempo_transcurrido: 0,
            fecha_inicio: undefined,
            fecha_fin: undefined
          }
        : m
    ))
    
    toast.success('Entrenamiento reiniciado')
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'entrenando': 'default',
      'completado': 'default',
      'pausado': 'secondary',
      'error': 'destructive',
      'pendiente': 'outline'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      'entrenando': 'text-blue-600',
      'completado': 'text-green-600',
      'pausado': 'text-orange-600',
      'error': 'text-red-600',
      'pendiente': 'text-gray-600'
    }
    return colors[estado as keyof typeof colors] || 'text-gray-600'
  }

  const formatTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`
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
          <h1 className="text-3xl font-bold">Entrenamiento de Modelos IA</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ia-valuacion">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Entrenamiento de Modelos IA</h1>
            <p className="text-gray-600">Mejorar la precisión de los modelos de valuación</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Subir Dataset
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Nuevo Modelo
          </Button>
        </div>
      </div>

      {/* Estadísticas de Entrenamiento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Modelos Activos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {modelos.filter(m => m.estado === 'entrenando' || m.estado === 'completado').length}
                </p>
              </div>
              <Cpu className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Precisión Promedio</p>
                <p className="text-2xl font-bold text-green-600">
                  {(modelos.reduce((sum, m) => sum + m.precision_actual, 0) / modelos.length).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Datos de Entrenamiento</p>
                <p className="text-2xl font-bold text-purple-600">
                  {datasets.reduce((sum, d) => sum + d.imagenes_etiquetadas, 0).toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entrenando Ahora</p>
                <p className="text-2xl font-bold text-orange-600">
                  {modelos.filter(m => m.estado === 'entrenando').length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modelos en Entrenamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Modelos de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {modelos.map((modelo) => (
              <div key={modelo.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{modelo.nombre}</h3>
                      <Badge variant={getEstadoBadge(modelo.estado) as "default" | "secondary" | "destructive" | "outline"}>
                        {modelo.estado}
                      </Badge>
                      <Badge variant="outline">{modelo.categoria}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Versión {modelo.version} • {modelo.configuracion.arquitectura} • {modelo.configuracion.optimizador}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {modelo.estado === 'pendiente' && (
                      <Button
                        size="sm"
                        onClick={() => iniciarEntrenamiento(modelo.id!)}
                        disabled={entrenamientoActivo}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar
                      </Button>
                    )}
                    {modelo.estado === 'entrenando' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => pausarEntrenamiento(modelo.id!)}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </Button>
                    )}
                    {(modelo.estado === 'pausado' || modelo.estado === 'completado') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reiniciarEntrenamiento(modelo.id!)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reiniciar
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Barra de Progreso */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso: {modelo.progreso.toFixed(1)}%</span>
                    <span>Época {modelo.epoca_actual}/{modelo.epocas_totales}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        modelo.estado === 'entrenando' ? 'bg-blue-600' :
                        modelo.estado === 'completado' ? 'bg-green-600' :
                        modelo.estado === 'pausado' ? 'bg-orange-600' : 'bg-gray-400'
                      }`}
                      style={{ width: `${modelo.progreso}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Precisión</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Actual:</strong> {modelo.precision_actual.toFixed(1)}%</p>
                      <p><strong>Objetivo:</strong> {modelo.precision_objetivo.toFixed(1)}%</p>
                      <p><strong>Validación:</strong> {modelo.metricas.val_accuracy.toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Datos</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Entrenamiento:</strong> {modelo.datos_entrenamiento.toLocaleString()}</p>
                      <p><strong>Validación:</strong> {modelo.datos_validacion.toLocaleString()}</p>
                      <p><strong>Loss:</strong> {modelo.metricas.loss.toFixed(3)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Tiempo</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Transcurrido:</strong> {formatTiempo(modelo.tiempo_transcurrido)}</p>
                      <p><strong>Estimado:</strong> {formatTiempo(modelo.tiempo_estimado)}</p>
                      <p><strong>Restante:</strong> {formatTiempo(Math.max(0, modelo.tiempo_estimado - modelo.tiempo_transcurrido))}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Configuración</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Learning Rate:</strong> {modelo.configuracion.learning_rate}</p>
                      <p><strong>Batch Size:</strong> {modelo.configuracion.batch_size}</p>
                      {modelo.fecha_inicio && (
                        <p><strong>Iniciado:</strong> {formatFecha(modelo.fecha_inicio)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Datasets Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Datasets de Entrenamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{dataset.nombre}</h4>
                  <Badge variant={dataset.estado === 'activo' ? 'default' : 'secondary'}>
                    {dataset.estado}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Categoría:</span>
                    <span className="font-medium">{dataset.categoria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Imágenes totales:</span>
                    <span className="font-medium">{dataset.total_imagenes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Etiquetadas:</span>
                    <span className="font-medium">{dataset.imagenes_etiquetadas.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calidad promedio:</span>
                    <span className="font-medium text-green-600">{dataset.calidad_promedio}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actualizado:</span>
                    <span className="font-medium">{formatFecha(dataset.ultima_actualizacion)}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${(dataset.imagenes_etiquetadas / dataset.total_imagenes) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((dataset.imagenes_etiquetadas / dataset.total_imagenes) * 100).toFixed(1)}% etiquetado
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
