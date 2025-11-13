'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Package, 
  Eye,
  Clock,
  Gavel,
  User,
  MapPin,
  Edit,
  Trash2,
  Play,
  Square,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Remate {
  id?: string
  numero_remate: string
  estado: string
  precio_base: number
  precio_final?: number
  fecha_inicio_remate: string
  fecha_fin_remate?: string
  incremento_minimo?: number
  ganador_nombre?: string
  descripcion?: string
  condiciones_especiales?: string
  created_at?: string
  updated_at?: string
  garantias?: {
    id?: string
    nombre?: string
    marca?: string
    modelo?: string
    numero_serie?: string
    estado_conservacion?: string
    valor_tasacion: number
    valor_comercial: number
    descripcion?: string
  }
}
import { toast } from 'sonner'

export default function RemateDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [remate, setRemate] = useState<Remate | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadRemate(params.id as string)
    }
  }, [params.id])

  const loadRemate = async (id: string) => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('remates')
        .select(`
          *,
          garantias (
            id,
            nombre,
            marca,
            modelo,
            numero_serie,
            estado_conservacion,
            valor_tasacion,
            valor_comercial,
            descripcion
          )
        `)
        .eq('id', id)
        .single()
        
      if (error) throw error
      setRemate(data)
    } catch (error) {
      console.error('Error cargando remate:', error)
      toast.error('Error al cargar el remate')
    } finally {
      setLoading(false)
    }
  }

  const handleEstadoChange = async (nuevoEstado: string) => {
    if (!remate) return

    try {
      setActionLoading(true)
      const supabase = createClient()
      const { error } = await supabase
        .from('remates')
        .update({ estado: nuevoEstado })
        .eq('id', remate.id!)
        
      if (error) throw error
      setRemate(prev => prev ? { ...prev, estado: nuevoEstado } : null)
      toast.success(`Remate ${nuevoEstado} exitosamente`)
    } catch (error) {
      console.error('Error actualizando estado:', error)
      toast.error('Error al actualizar el estado del remate')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEliminar = async () => {
    if (!remate) return
    
    if (!confirm('¿Está seguro de eliminar este remate? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setActionLoading(true)
      const supabase = createClient()
      const { error } = await supabase
        .from('remates')
        .delete()
        .eq('id', remate.id!)
        
      if (error) throw error
      toast.success('Remate eliminado exitosamente')
      router.push('/dashboard/remates')
    } catch (error) {
      console.error('Error eliminando remate:', error)
      toast.error('Error al eliminar el remate')
    } finally {
      setActionLoading(false)
    }
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'programado': 'secondary',
      'activo': 'default',
      'finalizado': 'success',
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

  const calcularTiempoRestante = () => {
    if (!remate || remate.estado !== 'activo') return null
    
    const ahora = new Date()
    const fechaFin = new Date(remate.fecha_fin_remate || remate.fecha_inicio_remate)
    const diferencia = fechaFin.getTime() - ahora.getTime()
    
    if (diferencia <= 0) return 'Finalizado'
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
    
    if (dias > 0) return `${dias}d ${horas}h ${minutos}m`
    if (horas > 0) return `${horas}h ${minutos}m`
    return `${minutos}m`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!remate) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Remate no encontrado</h2>
        <p className="text-gray-600 mb-4">El remate que busca no existe o ha sido eliminado</p>
        <Link href="/dashboard/remates">
          <Button>Volver a Remates</Button>
        </Link>
      </div>
    )
  }

  const tiempoRestante = calcularTiempoRestante()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/remates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{remate.numero_remate}</h1>
            <p className="text-gray-600">Detalle del remate</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={getEstadoBadge(remate.estado) as any} className="text-sm px-3 py-1">
            {remate.estado.toUpperCase()}
          </Badge>
          {tiempoRestante && remate.estado === 'activo' && (
            <Badge variant="outline" className="text-sm px-3 py-1">
              <Clock className="h-3 w-3 mr-1" />
              {tiempoRestante}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalles del Remate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Información del Remate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Número de Remate</p>
                  <p className="font-semibold">{remate.numero_remate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <Badge variant={getEstadoBadge(remate.estado) as any}>
                    {remate.estado}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fecha de Inicio</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatFecha(remate.fecha_inicio_remate)}
                  </p>
                </div>
                {remate.fecha_fin_remate && (
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Fin</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatFecha(remate.fecha_fin_remate)}
                    </p>
                  </div>
                )}
              </div>

              {remate.descripcion && (
                <div>
                  <p className="text-sm text-gray-600">Descripción</p>
                  <p className="text-gray-900">{remate.descripcion}</p>
                </div>
              )}

              {remate.condiciones_especiales && (
                <div>
                  <p className="text-sm text-gray-600">Condiciones Especiales</p>
                  <p className="text-gray-900">{remate.condiciones_especiales}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información de la Garantía */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Garantía en Remate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {remate.garantias ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombre del Artículo</p>
                      <p className="font-semibold">{remate.garantias.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Marca y Modelo</p>
                      <p className="font-semibold">{remate.garantias.marca} {remate.garantias.modelo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Número de Serie</p>
                      <p className="font-semibold">{remate.garantias.numero_serie || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado de Conservación</p>
                      <Badge variant="outline">
                        {remate.garantias.estado_conservacion || 'No especificado'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Valor de Tasación</p>
                      <p className="font-semibold text-lg">S/ {remate.garantias.valor_tasacion.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor Comercial</p>
                      <p className="font-semibold text-lg">S/ {remate.garantias.valor_comercial.toFixed(2)}</p>
                    </div>
                  </div>

                  {remate.garantias.descripcion && (
                    <div>
                      <p className="text-sm text-gray-600">Descripción de la Garantía</p>
                      <p className="text-gray-900">{remate.garantias.descripcion}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/dashboard/garantias/${remate.garantias.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Garantía Completa
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Información de garantía no disponible</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Información de Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información de Precios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Precio Base</p>
                <p className="text-2xl font-bold text-blue-600">S/ {remate.precio_base.toFixed(2)}</p>
              </div>

              {remate.precio_final && (
                <div>
                  <p className="text-sm text-gray-600">Precio Final</p>
                  <p className="text-2xl font-bold text-green-600">S/ {remate.precio_final.toFixed(2)}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Incremento Mínimo</p>
                <p className="font-semibold">S/ {remate.incremento_minimo?.toFixed(2) || '0.00'}</p>
              </div>

              {remate.ganador_nombre && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">Ganador</p>
                  <p className="font-semibold text-green-900 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {remate.ganador_nombre}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {remate.estado === 'programado' && (
                <>
                  <Button
                    onClick={() => handleEstadoChange('activo')}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Remate
                  </Button>
                  <Button
                    onClick={() => handleEstadoChange('cancelado')}
                    disabled={actionLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Cancelar Remate
                  </Button>
                </>
              )}

              {remate.estado === 'activo' && (
                <>
                  <Link href={`/dashboard/remates/${remate.id}/ofertas`} className="block">
                    <Button className="w-full">
                      <Gavel className="h-4 w-4 mr-2" />
                      Gestionar Ofertas
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleEstadoChange('finalizado')}
                    disabled={actionLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Remate
                  </Button>
                </>
              )}

              {['programado', 'cancelado'].includes(remate.estado) && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={actionLoading}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Remate
                  </Button>
                  <Button
                    onClick={handleEliminar}
                    disabled={actionLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Remate
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Creado</p>
                <p className="font-medium">{formatFecha(remate.created_at || '')}</p>
              </div>
              {remate.updated_at && (
                <div>
                  <p className="text-gray-600">Última Actualización</p>
                  <p className="font-medium">{formatFecha(remate.updated_at)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
