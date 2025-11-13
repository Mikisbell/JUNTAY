'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Eye, 
  Camera, 
  Upload,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Brain,
  Image as ImageIcon,
  Zap,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface TasacionDetallada {
  id?: string
  garantia_id: string
  garantia_descripcion: string
  categoria: string
  subcategoria: string
  marca?: string
  modelo?: string
  imagenes: {
    url: string
    analizada: boolean
    confianza?: number
  }[]
  valor_estimado_ia: number
  valor_manual?: number
  valor_final?: number
  confianza_general: number
  tiempo_procesamiento: number
  estado: 'procesando' | 'completado' | 'revision_requerida' | 'aprobado' | 'rechazado'
  fecha_analisis: string
  evaluador?: string
  notas_evaluador?: string
  caracteristicas_ia: {
    material: string
    estado_conservacion: string
    autenticidad: number
    rareza: number
    demanda_mercado: number
  }
  comparaciones_mercado: {
    precio_promedio: number
    precio_minimo: number
    precio_maximo: number
    fuentes: string[]
  }
  historial_cambios: {
    fecha: string
    usuario: string
    accion: string
    valor_anterior?: number
    valor_nuevo?: number
  }[]
}

export default function TasacionesIAPage() {
  const [tasaciones, setTasaciones] = useState<TasacionDetallada[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [showModal, setShowModal] = useState(false)
  const [tasacionSeleccionada, setTasacionSeleccionada] = useState<TasacionDetallada | null>(null)

  useEffect(() => {
    loadTasaciones()
  }, [])

  const loadTasaciones = async () => {
    try {
      setLoading(true)
      
      const tasacionesEjemplo = generarTasacionesDetalladas()
      setTasaciones(tasacionesEjemplo)
      
    } catch (error) {
      console.error('Error cargando tasaciones:', error)
      toast.error('Error al cargar las tasaciones')
    } finally {
      setLoading(false)
    }
  }

  const generarTasacionesDetalladas = (): TasacionDetallada[] => {
    const categorias = [
      { categoria: 'Joyas', subcategorias: ['Anillos', 'Cadenas', 'Relojes', 'Aretes'] },
      { categoria: 'Electrónicos', subcategorias: ['Smartphones', 'Laptops', 'Tablets', 'Consolas'] },
      { categoria: 'Vehículos', subcategorias: ['Motos', 'Autos', 'Bicicletas'] }
    ]
    
    const estados = ['completado', 'revision_requerida', 'aprobado', 'procesando'] as const
    const evaluadores = ['Ana Martín', 'Carlos López', 'María García']
    
    const ejemplos = []
    
    for (let i = 0; i < 20; i++) {
      const catData = categorias[Math.floor(Math.random() * categorias.length)]
      const subcategoria = catData.subcategorias[Math.floor(Math.random() * catData.subcategorias.length)]
      const estado = estados[Math.floor(Math.random() * estados.length)]
      const valorIA = Math.floor(Math.random() * 5000) + 500
      const confianza = 60 + Math.random() * 35
      
      ejemplos.push({
        id: `tasacion-${i}`,
        garantia_id: `GAR-${String(i + 2000).padStart(6, '0')}`,
        garantia_descripcion: `${subcategoria} ${catData.categoria.toLowerCase()}`,
        categoria: catData.categoria,
        subcategoria,
        marca: Math.random() > 0.5 ? 'Samsung' : 'Apple',
        modelo: `Modelo ${Math.floor(Math.random() * 100)}`,
        imagenes: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, idx) => ({
          url: `/images/garantia-${i}-${idx}.jpg`,
          analizada: true,
          confianza: 80 + Math.random() * 15
        })),
        valor_estimado_ia: valorIA,
        valor_manual: estado === 'aprobado' ? valorIA + (Math.random() - 0.5) * 300 : undefined,
        valor_final: estado === 'aprobado' ? valorIA + (Math.random() - 0.5) * 200 : undefined,
        confianza_general: Math.round(confianza * 10) / 10,
        tiempo_procesamiento: Math.floor(Math.random() * 4000) + 1000,
        estado,
        fecha_analisis: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        evaluador: estado === 'aprobado' ? evaluadores[Math.floor(Math.random() * evaluadores.length)] : undefined,
        notas_evaluador: estado === 'aprobado' ? 'Valuación aprobada según análisis de mercado' : undefined,
        caracteristicas_ia: {
          material: 'Oro 18k',
          estado_conservacion: 'Bueno',
          autenticidad: 85 + Math.random() * 10,
          rareza: Math.random() * 100,
          demanda_mercado: 70 + Math.random() * 25
        },
        comparaciones_mercado: {
          precio_promedio: valorIA,
          precio_minimo: valorIA * 0.8,
          precio_maximo: valorIA * 1.3,
          fuentes: ['MercadoLibre', 'OLX', 'Joyerías Lima']
        },
        historial_cambios: [
          {
            fecha: new Date().toISOString(),
            usuario: 'Sistema IA',
            accion: 'Análisis inicial completado',
            valor_nuevo: valorIA
          }
        ]
      })
    }
    
    return ejemplos.sort((a, b) => new Date(b.fecha_analisis).getTime() - new Date(a.fecha_analisis).getTime())
  }

  const verDetalleTasacion = (tasacion: TasacionDetallada) => {
    setTasacionSeleccionada(tasacion)
    setShowModal(true)
  }

  const aprobarTasacion = async (tasacionId: string) => {
    setTasaciones(prev => prev.map(t => 
      t.id === tasacionId 
        ? { ...t, estado: 'aprobado' as const, evaluador: 'Usuario Actual' }
        : t
    ))
    toast.success('Tasación aprobada exitosamente')
  }

  const rechazarTasacion = async (tasacionId: string) => {
    setTasaciones(prev => prev.map(t => 
      t.id === tasacionId 
        ? { ...t, estado: 'rechazado' as const, evaluador: 'Usuario Actual' }
        : t
    ))
    toast.success('Tasación rechazada')
  }

  const filtrarTasaciones = () => {
    return tasaciones.filter(tasacion => {
      const matchesSearch = tasacion.garantia_descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tasacion.garantia_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tasacion.marca?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategoria = filtroCategoria === 'todos' || tasacion.categoria === filtroCategoria
      const matchesEstado = filtroEstado === 'todos' || tasacion.estado === filtroEstado
      
      return matchesSearch && matchesCategoria && matchesEstado
    })
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'procesando': 'secondary',
      'completado': 'default',
      'revision_requerida': 'destructive',
      'aprobado': 'default',
      'rechazado': 'destructive'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
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
    const categorias = [...new Set(tasaciones.map(t => t.categoria))]
    return categorias.sort()
  }

  const tasacionesFiltradas = filtrarTasaciones()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tasaciones IA</h1>
        </div>
        <div className="grid grid-cols-1 gap-6">
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ia-valuacion">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasaciones IA</h1>
            <p className="text-gray-600">Historial detallado de valuaciones automáticas</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Camera className="h-4 w-4 mr-2" />
            Nueva Tasación
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasaciones</p>
                <p className="text-2xl font-bold">{tasaciones.length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasaciones.filter(t => t.estado === 'aprobado').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Revisión</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tasaciones.filter(t => t.estado === 'revision_requerida').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  S/ {tasaciones.reduce((sum, t) => sum + t.valor_estimado_ia, 0).toFixed(0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por descripción, ID o marca..."
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
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Lista de Tasaciones */}
      <div className="space-y-4">
        {tasacionesFiltradas.map((tasacion) => (
          <Card key={tasacion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold">{tasacion.garantia_descripcion}</h4>
                      <Badge variant={getEstadoBadge(tasacion.estado) as "default" | "secondary" | "destructive"}>
                        {tasacion.estado.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{tasacion.categoria}</Badge>
                      {tasacion.marca && (
                        <Badge variant="outline">{tasacion.marca}</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">ID Garantía</p>
                        <p className="font-semibold">{tasacion.garantia_id}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Valor IA</p>
                        <p className="font-semibold text-green-600">S/ {tasacion.valor_estimado_ia.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confianza</p>
                        <p className={`font-semibold ${getConfianzaColor(tasacion.confianza_general)}`}>
                          {tasacion.confianza_general}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Imágenes</p>
                        <p className="font-semibold">{tasacion.imagenes.length} analizadas</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fecha</p>
                        <p className="font-semibold">{formatFecha(tasacion.fecha_analisis)}</p>
                      </div>
                    </div>
                    
                    {tasacion.valor_manual && (
                      <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                        <p><strong>Valor Manual:</strong> S/ {tasacion.valor_manual.toFixed(2)}</p>
                        {tasacion.evaluador && <p><strong>Evaluador:</strong> {tasacion.evaluador}</p>}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Material: {tasacion.caracteristicas_ia.material}</span>
                      <span>Estado: {tasacion.caracteristicas_ia.estado_conservacion}</span>
                      <span>Procesamiento: {(tasacion.tiempo_procesamiento / 1000).toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => verDetalleTasacion(tasacion)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalle
                  </Button>
                  
                  {tasacion.estado === 'completado' && (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => aprobarTasacion(tasacion.id!)}
                        className="text-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rechazarTasacion(tasacion.id!)}
                        className="text-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Detalle */}
      {showModal && tasacionSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Detalle de Tasación - {tasacionSeleccionada.garantia_descripcion}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Información General</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {tasacionSeleccionada.garantia_id}</p>
                    <p><strong>Categoría:</strong> {tasacionSeleccionada.categoria}</p>
                    <p><strong>Subcategoría:</strong> {tasacionSeleccionada.subcategoria}</p>
                    <p><strong>Marca:</strong> {tasacionSeleccionada.marca || 'No especificada'}</p>
                    <p><strong>Modelo:</strong> {tasacionSeleccionada.modelo || 'No especificado'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Análisis de Mercado</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Precio Promedio:</strong> S/ {tasacionSeleccionada.comparaciones_mercado.precio_promedio.toFixed(2)}</p>
                    <p><strong>Rango:</strong> S/ {tasacionSeleccionada.comparaciones_mercado.precio_minimo.toFixed(2)} - S/ {tasacionSeleccionada.comparaciones_mercado.precio_maximo.toFixed(2)}</p>
                    <p><strong>Fuentes:</strong> {tasacionSeleccionada.comparaciones_mercado.fuentes.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
