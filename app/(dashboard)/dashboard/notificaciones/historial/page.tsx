'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Mail,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Users,
  Target,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface NotificacionHistorial {
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
  cliente_id?: string
  error_mensaje?: string
  created_at?: string
}

interface EstadisticasHistorial {
  totalNotificaciones: number
  enviadas: number
  entregadas: number
  fallidas: number
  tasaEntrega: number
  tasaExito: number
  whatsappCount: number
  smsCount: number
  emailCount: number
  promedioMensual: number
}

export default function HistorialNotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<NotificacionHistorial[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasHistorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroFecha, setFiltroFecha] = useState<string>('todos')

  useEffect(() => {
    loadHistorialNotificaciones()
  }, [])

  const loadHistorialNotificaciones = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Cargar todas las notificaciones
      const { data: notificacionesData, error } = await supabase
        .from('notificaciones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500) // Limitar para performance
        
      if (error) {
        // Si la tabla no existe, usar datos de ejemplo
        console.log('Usando datos de ejemplo para historial')
        const ejemploNotificaciones = generarDatosEjemplo()
        setNotificaciones(ejemploNotificaciones)
        const stats = calcularEstadisticas(ejemploNotificaciones)
        setEstadisticas(stats)
        return
      }
      
      setNotificaciones(notificacionesData || [])
      
      // Calcular estadísticas
      const stats = calcularEstadisticas(notificacionesData || [])
      setEstadisticas(stats)
      
    } catch (error) {
      console.error('Error cargando historial:', error)
      toast.error('Error al cargar el historial de notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const generarDatosEjemplo = (): NotificacionHistorial[] => {
    const ejemplos = []
    const tipos = ['whatsapp', 'sms', 'email'] as const
    const estados = ['entregada', 'enviada', 'fallida'] as const
    const nombres = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martín', 'Luis Rodríguez']
    
    for (let i = 0; i < 50; i++) {
      const tipo = tipos[Math.floor(Math.random() * tipos.length)]
      const estado = estados[Math.floor(Math.random() * estados.length)]
      const nombre = nombres[Math.floor(Math.random() * nombres.length)]
      const fechaBase = new Date()
      fechaBase.setDate(fechaBase.getDate() - Math.floor(Math.random() * 30))
      
      ejemplos.push({
        id: `ejemplo-${i}`,
        tipo,
        destinatario_nombre: nombre,
        destinatario_contacto: tipo === 'email' ? `${nombre.toLowerCase().replace(' ', '.')}@email.com` : `99${Math.floor(Math.random() * 9000000) + 1000000}`,
        asunto: tipo === 'email' ? 'Recordatorio de Pago' : undefined,
        mensaje: tipo === 'whatsapp' 
          ? `Hola ${nombre}, te recordamos que tienes un pago pendiente por S/ ${(Math.random() * 1000 + 100).toFixed(2)}.`
          : tipo === 'email'
          ? `Estimado/a ${nombre}, le recordamos su pago pendiente.`
          : `${nombre}, pago pendiente S/ ${(Math.random() * 1000 + 100).toFixed(2)}`,
        estado,
        fecha_enviada: fechaBase.toISOString(),
        created_at: fechaBase.toISOString(),
        error_mensaje: estado === 'fallida' ? 'Número no válido' : undefined
      })
    }
    
    return ejemplos
  }

  const calcularEstadisticas = (notificaciones: NotificacionHistorial[]): EstadisticasHistorial => {
    const totalNotificaciones = notificaciones.length
    const enviadas = notificaciones.filter(n => ['enviada', 'entregada'].includes(n.estado)).length
    const entregadas = notificaciones.filter(n => n.estado === 'entregada').length
    const fallidas = notificaciones.filter(n => n.estado === 'fallida').length
    
    const tasaEntrega = enviadas > 0 ? (entregadas / enviadas) * 100 : 0
    const tasaExito = totalNotificaciones > 0 ? ((enviadas - fallidas) / totalNotificaciones) * 100 : 0
    
    const whatsappCount = notificaciones.filter(n => n.tipo === 'whatsapp').length
    const smsCount = notificaciones.filter(n => n.tipo === 'sms').length
    const emailCount = notificaciones.filter(n => n.tipo === 'email').length
    
    // Calcular promedio mensual (últimos 30 días)
    const hace30Dias = new Date()
    hace30Dias.setDate(hace30Dias.getDate() - 30)
    const ultimoMes = notificaciones.filter(n => 
      n.created_at && new Date(n.created_at) >= hace30Dias
    ).length
    const promedioMensual = ultimoMes
    
    return {
      totalNotificaciones,
      enviadas,
      entregadas,
      fallidas,
      tasaEntrega,
      tasaExito,
      whatsappCount,
      smsCount,
      emailCount,
      promedioMensual
    }
  }

  const filtrarNotificaciones = () => {
    return notificaciones.filter(notificacion => {
      const matchesSearch = notificacion.destinatario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notificacion.destinatario_contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notificacion.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTipo = filtroTipo === 'todos' || notificacion.tipo === filtroTipo
      const matchesEstado = filtroEstado === 'todos' || notificacion.estado === filtroEstado
      
      let matchesFecha = true
      if (filtroFecha !== 'todos') {
        const fechaNotificacion = new Date(notificacion.created_at || '')
        const ahora = new Date()
        
        switch (filtroFecha) {
          case 'hoy':
            matchesFecha = fechaNotificacion.toDateString() === ahora.toDateString()
            break
          case 'ultima_semana':
            matchesFecha = fechaNotificacion >= new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'ultimo_mes':
            matchesFecha = fechaNotificacion >= new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case 'ultimos_3_meses':
            matchesFecha = fechaNotificacion >= new Date(ahora.getTime() - 90 * 24 * 60 * 60 * 1000)
            break
        }
      }
      
      return matchesSearch && matchesTipo && matchesEstado && matchesFecha
    })
  }

  const exportarHistorial = () => {
    const notificacionesFiltradas = filtrarNotificaciones()
    const csvContent = [
      ['Fecha', 'Tipo', 'Destinatario', 'Contacto', 'Estado', 'Mensaje', 'Error'],
      ...notificacionesFiltradas.map(n => [
        n.created_at ? new Date(n.created_at).toLocaleDateString('es-PE') : '',
        n.tipo,
        n.destinatario_nombre,
        n.destinatario_contacto,
        n.estado,
        n.mensaje.substring(0, 100) + (n.mensaje.length > 100 ? '...' : ''),
        n.error_mensaje || ''
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial_notificaciones_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Historial exportado exitosamente')
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
      default: return <Send className="h-4 w-4" />
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
      default: return <Send className="h-4 w-4" />
    }
  }

  const notificacionesFiltradas = filtrarNotificaciones()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Historial de Notificaciones</h1>
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/notificaciones">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historial de Notificaciones</h1>
            <p className="text-gray-600">Análisis completo de notificaciones enviadas</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportarHistorial} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Link href="/dashboard/notificaciones/programar">
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Nueva Notificación
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
                  <p className="text-sm text-gray-600">Total Enviadas</p>
                  <p className="text-2xl font-bold">{estadisticas.totalNotificaciones}</p>
                  <p className="text-xs text-gray-500">Notificaciones</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
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
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa de Éxito</p>
                  <p className="text-2xl font-bold text-purple-600">{estadisticas.tasaExito.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Sin errores</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Promedio Mensual</p>
                  <p className="text-2xl font-bold text-orange-600">{estadisticas.promedioMensual}</p>
                  <p className="text-xs text-gray-500">Últimos 30 días</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estadísticas por Tipo */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="text-xl font-bold text-green-600">{estadisticas.whatsappCount}</p>
                  <p className="text-xs text-gray-500">
                    {((estadisticas.whatsappCount / estadisticas.totalNotificaciones) * 100).toFixed(1)}%
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">SMS</p>
                  <p className="text-xl font-bold text-blue-600">{estadisticas.smsCount}</p>
                  <p className="text-xs text-gray-500">
                    {((estadisticas.smsCount / estadisticas.totalNotificaciones) * 100).toFixed(1)}%
                  </p>
                </div>
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-xl font-bold text-purple-600">{estadisticas.emailCount}</p>
                  <p className="text-xs text-gray-500">
                    {((estadisticas.emailCount / estadisticas.totalNotificaciones) * 100).toFixed(1)}%
                  </p>
                </div>
                <Mail className="h-8 w-8 text-purple-600" />
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
            <option value="entregada">Entregadas</option>
            <option value="enviada">Enviadas</option>
            <option value="fallida">Fallidas</option>
            <option value="programada">Programadas</option>
          </select>
          
          <select
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las Fechas</option>
            <option value="hoy">Hoy</option>
            <option value="ultima_semana">Última Semana</option>
            <option value="ultimo_mes">Último Mes</option>
            <option value="ultimos_3_meses">Últimos 3 Meses</option>
          </select>
        </div>
      </div>

      {/* Lista de Notificaciones */}
      {notificacionesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones en el historial</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroTipo !== 'todos' || filtroEstado !== 'todos' || filtroFecha !== 'todos'
                ? 'No se encontraron notificaciones con los filtros aplicados'
                : 'Aún no hay notificaciones enviadas'
              }
            </p>
            <Link href="/dashboard/notificaciones/programar">
              <Button>
                <Send className="h-4 w-4 mr-2" />
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
                      {notificacion.created_at && (
                        <span className="text-xs text-gray-500">
                          {formatFecha(notificacion.created_at)}
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900">{notificacion.destinatario_nombre}</h4>
                      <p className="text-sm text-gray-600">{notificacion.destinatario_contacto}</p>
                    </div>
                    
                    {notificacion.asunto && (
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        Asunto: {notificacion.asunto}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {notificacion.mensaje}
                    </p>
                    
                    {notificacion.error_mensaje && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Error: {notificacion.error_mensaje}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      {notificacion.fecha_enviada && (
                        <span className="text-xs text-gray-500">
                          Enviada: {formatFecha(notificacion.fecha_enviada)}
                        </span>
                      )}
                      <div className="text-sm font-medium">
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
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resumen de Filtros */}
      {notificacionesFiltradas.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Mostrando {notificacionesFiltradas.length} de {notificaciones.length} notificaciones
              </span>
              <span>
                Tasa de éxito filtrada: {
                  notificacionesFiltradas.length > 0 
                    ? ((notificacionesFiltradas.filter(n => n.estado === 'entregada').length / notificacionesFiltradas.length) * 100).toFixed(1)
                    : 0
                }%
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
