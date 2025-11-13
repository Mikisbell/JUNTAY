'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Brain, 
  Camera, 
  Zap, 
  TrendingUp,
  Eye,
  Upload,
  Search,
  Settings,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Cpu,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ValuacionIA {
  id?: string
  garantia_id: string
  garantia_descripcion: string
  categoria: string
  imagenes_analizadas: number
  valor_estimado_ia: number
  valor_manual?: number
  confianza: number
  tiempo_procesamiento: number
  estado: 'procesando' | 'completado' | 'revision_requerida' | 'aprobado'
  fecha_analisis: string
  evaluador?: string
  notas_ia: string[]
  caracteristicas_detectadas: string[]
}

interface EstadisticasIA {
  totalValuaciones: number
  valuacionesHoy: number
  tiempoPromedioMs: number
  confianzaPromedio: number
  precisionIA: number
  ahorroTiempo: number
  valorTotalAnalizado: number
}

interface ModeloIA {
  id: string
  nombre: string
  categoria: string
  version: string
  precision: number
  estado: 'activo' | 'entrenando' | 'inactivo'
  ultima_actualizacion: string
}

export default function IAValuacionPage() {
  const [valuaciones, setValuaciones] = useState<ValuacionIA[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasIA | null>(null)
  const [modelos, setModelos] = useState<ModeloIA[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [procesandoImagen, setProcesandoImagen] = useState(false)

  useEffect(() => {
    loadDatosIA()
  }, [])

  const loadDatosIA = async () => {
    try {
      setLoading(true)
      
      // Generar datos de ejemplo
      const valuacionesEjemplo = generarValuaciones()
      const modelosEjemplo = generarModelos()
      const statsEjemplo = calcularEstadisticas(valuacionesEjemplo)
      
      setValuaciones(valuacionesEjemplo)
      setModelos(modelosEjemplo)
      setEstadisticas(statsEjemplo)
      
    } catch (error) {
      console.error('Error cargando datos de IA:', error)
      toast.error('Error al cargar los datos de IA')
    } finally {
      setLoading(false)
    }
  }

  const generarValuaciones = (): ValuacionIA[] => {
    const categorias = ['Joyas', 'Electrónicos', 'Vehículos', 'Electrodomésticos', 'Herramientas', 'Otros']
    const estados = ['completado', 'revision_requerida', 'aprobado', 'procesando'] as const
    const evaluadores = ['Ana Martín', 'Carlos López', 'María García']
    
    const ejemplos = []
    
    for (let i = 0; i < 15; i++) {
      const categoria = categorias[Math.floor(Math.random() * categorias.length)]
      const estado = estados[Math.floor(Math.random() * estados.length)]
      const valorEstimado = Math.floor(Math.random() * 5000) + 500
      const confianza = 60 + Math.random() * 35 // 60-95%
      
      const garantias = {
        'Joyas': ['Anillo de oro 18k', 'Cadena de plata 925', 'Reloj Rolex', 'Aretes de diamante'],
        'Electrónicos': ['iPhone 15 Pro', 'Laptop Dell XPS', 'Smart TV Samsung', 'PlayStation 5'],
        'Vehículos': ['Moto Honda CB600F', 'Auto Toyota Corolla', 'Bicicleta Trek'],
        'Electrodomésticos': ['Refrigeradora LG', 'Lavadora Samsung', 'Microondas Panasonic'],
        'Herramientas': ['Taladro Bosch', 'Sierra Circular', 'Soldadora Lincoln'],
        'Otros': ['Guitarra Fender', 'Cámara Canon', 'Mueble de madera']
      }
      
      const descripcionesCategoria = garantias[categoria as keyof typeof garantias] || garantias['Otros']
      const descripcion = descripcionesCategoria[Math.floor(Math.random() * descripcionesCategoria.length)]
      
      ejemplos.push({
        id: `valuacion-${i}`,
        garantia_id: `GAR-${String(i + 1000).padStart(6, '0')}`,
        garantia_descripcion: descripcion,
        categoria,
        imagenes_analizadas: Math.floor(Math.random() * 5) + 1,
        valor_estimado_ia: valorEstimado,
        valor_manual: estado === 'aprobado' ? valorEstimado + (Math.random() - 0.5) * 200 : undefined,
        confianza: Math.round(confianza * 10) / 10,
        tiempo_procesamiento: Math.floor(Math.random() * 3000) + 500,
        estado,
        fecha_analisis: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        evaluador: estado === 'aprobado' ? evaluadores[Math.floor(Math.random() * evaluadores.length)] : undefined,
        notas_ia: [
          'Material detectado con alta confianza',
          'Estado de conservación: Bueno',
          'Marca reconocida en base de datos'
        ],
        caracteristicas_detectadas: [
          'Material: Oro 18k',
          'Peso estimado: 15g',
          'Marca: Reconocida',
          'Estado: Usado - Bueno'
        ]
      })
    }
    
    return ejemplos.sort((a, b) => new Date(b.fecha_analisis).getTime() - new Date(a.fecha_analisis).getTime())
  }

  const generarModelos = (): ModeloIA[] => {
    return [
      {
        id: 'modelo-joyas',
        nombre: 'JoyasNet v3.2',
        categoria: 'Joyas',
        version: '3.2.1',
        precision: 94.5,
        estado: 'activo',
        ultima_actualizacion: '2025-11-10T00:00:00Z'
      },
      {
        id: 'modelo-electronicos',
        nombre: 'TechVision v2.8',
        categoria: 'Electrónicos',
        version: '2.8.3',
        precision: 91.2,
        estado: 'activo',
        ultima_actualizacion: '2025-11-08T00:00:00Z'
      },
      {
        id: 'modelo-vehiculos',
        nombre: 'AutoDetect v1.5',
        categoria: 'Vehículos',
        version: '1.5.2',
        precision: 88.7,
        estado: 'entrenando',
        ultima_actualizacion: '2025-11-05T00:00:00Z'
      },
      {
        id: 'modelo-general',
        nombre: 'GeneralAI v4.1',
        categoria: 'General',
        version: '4.1.0',
        precision: 85.3,
        estado: 'activo',
        ultima_actualizacion: '2025-11-12T00:00:00Z'
      }
    ]
  }

  const calcularEstadisticas = (valuaciones: ValuacionIA[]): EstadisticasIA => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    const valuacionesHoy = valuaciones.filter(v => new Date(v.fecha_analisis) >= hoy)
    const completadas = valuaciones.filter(v => v.estado === 'completado' || v.estado === 'aprobado')
    
    const tiempoPromedio = valuaciones.reduce((sum, v) => sum + v.tiempo_procesamiento, 0) / valuaciones.length
    const confianzaPromedio = valuaciones.reduce((sum, v) => sum + v.confianza, 0) / valuaciones.length
    
    // Simular precisión basada en valuaciones aprobadas vs revisadas
    const aprobadas = valuaciones.filter(v => v.estado === 'aprobado').length
    const revisadas = valuaciones.filter(v => v.estado === 'revision_requerida').length
    const precision = aprobadas / (aprobadas + revisadas) * 100
    
    const valorTotal = valuaciones.reduce((sum, v) => sum + v.valor_estimado_ia, 0)
    
    return {
      totalValuaciones: valuaciones.length,
      valuacionesHoy: valuacionesHoy.length,
      tiempoPromedioMs: Math.round(tiempoPromedio),
      confianzaPromedio: Math.round(confianzaPromedio * 10) / 10,
      precisionIA: Math.round(precision * 10) / 10,
      ahorroTiempo: 85, // Porcentaje de ahorro vs tasación manual
      valorTotalAnalizado: valorTotal
    }
  }

  const procesarImagenIA = async () => {
    setProcesandoImagen(true)
    
    try {
      // Simular procesamiento de IA
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generar nueva valuación
      const nuevaValuacion: ValuacionIA = {
        id: `valuacion-${Date.now()}`,
        garantia_id: `GAR-${String(Date.now()).slice(-6)}`,
        garantia_descripcion: 'Anillo de oro procesado por IA',
        categoria: 'Joyas',
        imagenes_analizadas: 3,
        valor_estimado_ia: Math.floor(Math.random() * 2000) + 800,
        confianza: 85 + Math.random() * 10,
        tiempo_procesamiento: 1200 + Math.random() * 800,
        estado: 'completado',
        fecha_analisis: new Date().toISOString(),
        notas_ia: [
          'Análisis completado exitosamente',
          'Material: Oro 18k detectado',
          'Calidad: Buena'
        ],
        caracteristicas_detectadas: [
          'Material: Oro 18k',
          'Peso estimado: 12g',
          'Estado: Usado - Excelente'
        ]
      }
      
      setValuaciones(prev => [nuevaValuacion, ...prev])
      toast.success('Imagen procesada exitosamente por IA')
      
    } catch (error) {
      toast.error('Error al procesar la imagen')
    } finally {
      setProcesandoImagen(false)
    }
  }

  const filtrarValuaciones = () => {
    return valuaciones.filter(valuacion => {
      const matchesSearch = valuacion.garantia_descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           valuacion.garantia_id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategoria = filtroCategoria === 'todos' || valuacion.categoria === filtroCategoria
      const matchesEstado = filtroEstado === 'todos' || valuacion.estado === filtroEstado
      
      return matchesSearch && matchesCategoria && matchesEstado
    })
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'procesando': 'secondary',
      'completado': 'default',
      'revision_requerida': 'destructive',
      'aprobado': 'default'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      'procesando': 'text-blue-600',
      'completado': 'text-green-600',
      'revision_requerida': 'text-red-600',
      'aprobado': 'text-purple-600'
    }
    return colors[estado as keyof typeof colors] || 'text-gray-600'
  }

  const getConfianzaColor = (confianza: number) => {
    if (confianza >= 90) return 'text-green-600'
    if (confianza >= 75) return 'text-blue-600'
    if (confianza >= 60) return 'text-orange-600'
    return 'text-red-600'
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

  const getCategorias = () => {
    const categorias = [...new Set(valuaciones.map(v => v.categoria))]
    return categorias.sort()
  }

  const valuacionesFiltradas = filtrarValuaciones()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">IA Valuación</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">IA Valuación</h1>
          <p className="text-gray-600">Sistema inteligente de tasación automática</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/ia-valuacion/configuracion">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </Link>
          <Button 
            onClick={procesarImagenIA}
            disabled={procesandoImagen}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {procesandoImagen ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            {procesandoImagen ? 'Procesando...' : 'Analizar Imagen'}
          </Button>
        </div>
      </div>

      {/* Estadísticas de IA */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valuaciones Hoy</p>
                  <p className="text-2xl font-bold text-blue-600">{estadisticas.valuacionesHoy}</p>
                  <p className="text-xs text-gray-500">de {estadisticas.totalValuaciones} total</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Precisión IA</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.precisionIA}%</p>
                  <p className="text-xs text-gray-500">Confianza: {estadisticas.confianzaPromedio}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-purple-600">{(estadisticas.tiempoPromedioMs / 1000).toFixed(1)}s</p>
                  <p className="text-xs text-gray-500">{estadisticas.ahorroTiempo}% más rápido</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Analizado</p>
                  <p className="text-2xl font-bold text-orange-600">S/ {estadisticas.valorTotalAnalizado.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Total procesado</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modelos de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Modelos de IA Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modelos.map((modelo) => (
              <div key={modelo.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={modelo.estado === 'activo' ? 'default' : 
                            modelo.estado === 'entrenando' ? 'secondary' : 'outline'}
                  >
                    {modelo.estado}
                  </Badge>
                  <span className="text-sm font-medium text-green-600">
                    {modelo.precision}%
                  </span>
                </div>
                <h4 className="font-semibold mb-1">{modelo.nombre}</h4>
                <p className="text-sm text-gray-600 mb-2">{modelo.categoria}</p>
                <div className="text-xs text-gray-500">
                  <p>Versión: {modelo.version}</p>
                  <p>Actualizado: {formatFecha(modelo.ultima_actualizacion)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/ia-valuacion/tasaciones">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Tasaciones IA</h3>
                  <p className="text-sm text-gray-600">Historial de valuaciones automáticas</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{estadisticas?.totalValuaciones || 0}</p>
                </div>
                <Eye className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ia-valuacion/entrenamiento">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Entrenamiento</h3>
                  <p className="text-sm text-gray-600">Mejorar modelos de IA</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">{modelos.filter(m => m.estado === 'activo').length}</p>
                </div>
                <Database className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ia-valuacion/configuracion">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Configuración</h3>
                  <p className="text-sm text-gray-600">Ajustar parámetros de IA</p>
                  <p className="text-sm font-medium text-green-600 mt-2">
                    {estadisticas ? `${estadisticas.precisionIA}% precisión` : 'N/A'}
                  </p>
                </div>
                <Settings className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por descripción o ID de garantía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las Categorías</option>
            {getCategorias().map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
          
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Estados</option>
            <option value="procesando">Procesando</option>
            <option value="completado">Completado</option>
            <option value="revision_requerida">Revisión Requerida</option>
            <option value="aprobado">Aprobado</option>
          </select>
        </div>
      </div>

      {/* Lista de Valuaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Valuaciones Recientes ({valuacionesFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {valuacionesFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay valuaciones</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filtroCategoria !== 'todos' || filtroEstado !== 'todos'
                  ? 'No se encontraron valuaciones con los filtros aplicados'
                  : 'Aún no hay valuaciones procesadas por IA'
                }
              </p>
              <Button onClick={procesarImagenIA} disabled={procesandoImagen}>
                <Camera className="h-4 w-4 mr-2" />
                Procesar Primera Imagen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {valuacionesFiltradas.map((valuacion) => (
                <div key={valuacion.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{valuacion.garantia_descripcion}</h4>
                          <Badge variant={getEstadoBadge(valuacion.estado) as "default" | "secondary" | "destructive"}>
                            {valuacion.estado.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{valuacion.categoria}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">ID Garantía</p>
                            <p className="font-semibold">{valuacion.garantia_id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Valor Estimado IA</p>
                            <p className="font-semibold text-green-600">S/ {valuacion.valor_estimado_ia.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Confianza</p>
                            <p className={`font-semibold ${getConfianzaColor(valuacion.confianza)}`}>
                              {valuacion.confianza}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Tiempo Procesamiento</p>
                            <p className="font-semibold">{(valuacion.tiempo_procesamiento / 1000).toFixed(1)}s</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Características Detectadas:</p>
                            <div className="flex gap-1 flex-wrap">
                              {valuacion.caracteristicas_detectadas.slice(0, 2).map((caracteristica, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {caracteristica}
                                </Badge>
                              ))}
                              {valuacion.caracteristicas_detectadas.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{valuacion.caracteristicas_detectadas.length - 2} más
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Análisis:</p>
                            <p className="text-xs text-gray-500">
                              {valuacion.imagenes_analizadas} imágenes • {formatFecha(valuacion.fecha_analisis)}
                              {valuacion.evaluador && ` • Evaluado por ${valuacion.evaluador}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
