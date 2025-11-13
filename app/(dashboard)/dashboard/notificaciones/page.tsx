'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Notificacion {
  id?: string
  tipo: 'whatsapp' | 'sms' | 'email'
  destinatario_nombre: string
  destinatario_contacto: string
  asunto?: string
  mensaje: string
  estado: 'programada' | 'enviada' | 'entregada' | 'fallida'
  fecha_programada?: string
  fecha_enviada?: string
  plantilla_id?: string
  credito_id?: string
  cliente_id?: string
  created_at?: string
  error_mensaje?: string
}

interface EstadisticasNotificaciones {
  totalEnviadas: number
  entregadas: number
  fallidas: number
  programadas: number
  tasaEntrega: number
  enviadosHoy: number
}

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasNotificaciones | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')

  useEffect(() => {
    loadNotificaciones()
  }, [])

  const loadNotificaciones = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Cargar notificaciones recientes
      const { data: notificacionesData, error } = await supabase
        .from('notificaciones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
        
      if (error) throw error
      
      setNotificaciones(notificacionesData || [])
      
      // Calcular estadísticas
      const stats = calcularEstadisticas(notificacionesData || [])
      setEstadisticas(stats)
      
    } catch (error) {
      console.error('Error cargando notificaciones:', error)
      toast.error('Error al cargar las notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const calcularEstadisticas = (notificaciones: Notificacion[]): EstadisticasNotificaciones => {
    const totalEnviadas = notificaciones.filter(n => n.estado !== 'programada').length
    const entregadas = notificaciones.filter(n => n.estado === 'entregada').length
    const fallidas = notificaciones.filter(n => n.estado === 'fallida').length
    const programadas = notificaciones.filter(n => n.estado === 'programada').length
    const tasaEntrega = totalEnviadas > 0 ? (entregadas / totalEnviadas) * 100 : 0
    
    const hoy = new Date().toDateString()
    const enviadosHoy = notificaciones.filter(n => 
      n.fecha_enviada && new Date(n.fecha_enviada).toDateString() === hoy
    ).length
    
    return {
      totalEnviadas,
      entregadas,
      fallidas,
      programadas,
      tasaEntrega,
      enviadosHoy
    }
  }

  const filtrarNotificaciones = () => {
    return notificaciones.filter(notificacion => {
      const matchesSearch = notificacion.destinatario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notificacion.destinatario_contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notificacion.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTipo = filtroTipo === 'todos' || notificacion.tipo === filtroTipo
      const matchesEstado = filtroEstado === 'todos' || notificacion.estado === filtroEstado
      
      return matchesSearch && matchesTipo && matchesEstado
    })
  }

  const reenviarNotificacion = async (notificacionId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('notificaciones')
        .update({ 
          estado: 'programada',
          fecha_programada: new Date().toISOString(),
          error_mensaje: null
        })
        .eq('id', notificacionId)
        
      if (error) throw error
      
      toast.success('Notificación reprogramada para reenvío')
      await loadNotificaciones()
      
    } catch (error) {
      console.error('Error reenviando notificación:', error)
      toast.error('Error al reprogramar la notificación')
    }
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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />
      case 'sms': return <Phone className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'programada': 'secondary',
      'enviada': 'default',
      'entregada': 'success',
      'fallida': 'destructive'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'programada': return <Clock className="h-4 w-4" />
      case 'enviada': return <Send className="h-4 w-4" />
      case 'entregada': return <CheckCircle className="h-4 w-4" />
      case 'fallida': return <XCircle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const notificacionesFiltradas = filtrarNotificaciones()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notificaciones</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
          <p className="text-gray-600">Gestión completa de WhatsApp, SMS y Email</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/notificaciones/programar">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Notificación
            </Button>
          </Link>
          <Link href="/dashboard/notificaciones/plantillas">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Plantillas
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
                  <p className="text-sm text-gray-600">Enviadas Hoy</p>
                  <p className="text-2xl font-bold text-blue-600">{estadisticas.enviadosHoy}</p>
                  <p className="text-xs text-gray-500">Notificaciones</p>
                </div>
                <Send className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa de Entrega</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.tasaEntrega.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{estadisticas.entregadas} entregadas</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Programadas</p>
                  <p className="text-2xl font-bold text-orange-600">{estadisticas.programadas}</p>
                  <p className="text-xs text-gray-500">Pendientes</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fallidas</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.fallidas}</p>
                  <p className="text-xs text-gray-500">Requieren atención</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
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
            placeholder="Buscar por destinatario, contacto o mensaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Tipos</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
          
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Estados</option>
            <option value="programada">Programadas</option>
            <option value="enviada">Enviadas</option>
            <option value="entregada">Entregadas</option>
            <option value="fallida">Fallidas</option>
          </select>
        </div>
      </div>

      {/* Lista de Notificaciones */}
      {notificacionesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroTipo !== 'todos' || filtroEstado !== 'todos'
                ? 'No se encontraron notificaciones con los filtros aplicados'
                : 'Aún no hay notificaciones enviadas'
              }
            </p>
            <Link href="/dashboard/notificaciones/programar">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Enviar Primera Notificación
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notificacionesFiltradas.map((notificacion) => (
            <Card key={notificacion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(notificacion.tipo)}
                        <span className="font-medium capitalize">{notificacion.tipo}</span>
                      </div>
                      <Badge variant={getEstadoBadge(notificacion.estado) as any}>
                        <div className="flex items-center gap-1">
                          {getEstadoIcon(notificacion.estado)}
                          {notificacion.estado}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900">{notificacion.destinatario_nombre}</h4>
                      <p className="text-sm text-gray-600">{notificacion.destinatario_contacto}</p>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {notificacion.asunto && (
                        <span className="font-medium">{notificacion.asunto}: </span>
                      )}
                      {notificacion.mensaje}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      {notificacion.fecha_programada && (
                        <span>Programada: {formatFecha(notificacion.fecha_programada)}</span>
                      )}
                      {notificacion.fecha_enviada && (
                        <span>Enviada: {formatFecha(notificacion.fecha_enviada)}</span>
                      )}
                      {notificacion.created_at && (
                        <span>Creada: {formatFecha(notificacion.created_at)}</span>
                      )}
                    </div>
                    
                    {notificacion.error_mensaje && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Error: {notificacion.error_mensaje}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {notificacion.estado === 'fallida' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reenviarNotificacion(notificacion.id!)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Reenviar
                      </Button>
                    )}
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {notificacion.estado === 'entregada' && (
                          <span className="text-green-600">✓ Entregada</span>
                        )}
                        {notificacion.estado === 'enviada' && (
                          <span className="text-blue-600">→ Enviada</span>
                        )}
                        {notificacion.estado === 'programada' && (
                          <span className="text-orange-600">⏰ Programada</span>
                        )}
                        {notificacion.estado === 'fallida' && (
                          <span className="text-red-600">✗ Fallida</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/notificaciones/programar">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Plus className="h-5 w-5" />
                Nueva Notificación
              </Button>
            </Link>
            <Link href="/dashboard/notificaciones/plantillas">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Settings className="h-5 w-5" />
                Gestionar Plantillas
              </Button>
            </Link>
            <Link href="/dashboard/notificaciones/historial">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                Ver Historial
              </Button>
            </Link>
            <Link href="/dashboard/clientes">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Users className="h-5 w-5" />
                Gestionar Contactos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      {notificacionesFiltradas.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Mostrando {notificacionesFiltradas.length} de {notificaciones.length} notificaciones
              </span>
              <span>
                Tasa de éxito: {estadisticas ? estadisticas.tasaEntrega.toFixed(1) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
