'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Eye, 
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Database,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface RegistroAuditoria {
  id?: string
  usuario_id: string
  usuario_nombre: string
  usuario_rol: string
  accion: string
  modulo: string
  descripcion: string
  ip_address: string
  user_agent: string
  resultado: 'exitoso' | 'fallido' | 'bloqueado'
  detalles?: any
  fecha_hora: string
  duracion_ms?: number
}

interface EstadisticasAuditoria {
  totalRegistros: number
  registrosHoy: number
  accionesExitosas: number
  accionesFallidas: number
  usuariosActivos: number
  moduloMasUsado: string
}

export default function AuditoriaPage() {
  const [registros, setRegistros] = useState<RegistroAuditoria[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasAuditoria | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroModulo, setFiltroModulo] = useState<string>('todos')
  const [filtroResultado, setFiltroResultado] = useState<string>('todos')
  const [filtroFecha, setFiltroFecha] = useState<string>('hoy')

  useEffect(() => {
    loadRegistrosAuditoria()
  }, [])

  const loadRegistrosAuditoria = async () => {
    try {
      setLoading(true)
      
      // Generar registros de auditoría de ejemplo
      const registrosEjemplo = generarRegistrosAuditoria()
      setRegistros(registrosEjemplo)
      
      // Calcular estadísticas
      const stats = calcularEstadisticas(registrosEjemplo)
      setEstadisticas(stats)
      
    } catch (error) {
      console.error('Error cargando registros de auditoría:', error)
      toast.error('Error al cargar los registros de auditoría')
    } finally {
      setLoading(false)
    }
  }

  const generarRegistrosAuditoria = (): RegistroAuditoria[] => {
    const usuarios = [
      { id: 'user-1', nombre: 'Juan Pérez', rol: 'Administrador' },
      { id: 'user-2', nombre: 'María García', rol: 'Gerente' },
      { id: 'user-3', nombre: 'Carlos López', rol: 'Cajero' },
      { id: 'user-4', nombre: 'Ana Martín', rol: 'Evaluador' }
    ]
    
    const acciones = [
      { accion: 'login', modulo: 'Autenticación', descripcion: 'Inicio de sesión en el sistema' },
      { accion: 'logout', modulo: 'Autenticación', descripcion: 'Cierre de sesión' },
      { accion: 'crear_cliente', modulo: 'Clientes', descripcion: 'Registro de nuevo cliente' },
      { accion: 'editar_cliente', modulo: 'Clientes', descripcion: 'Modificación de datos de cliente' },
      { accion: 'crear_credito', modulo: 'Créditos', descripcion: 'Otorgamiento de nuevo crédito' },
      { accion: 'aprobar_credito', modulo: 'Créditos', descripcion: 'Aprobación de solicitud de crédito' },
      { accion: 'registrar_pago', modulo: 'Pagos', descripcion: 'Registro de pago de cuota' },
      { accion: 'abrir_caja', modulo: 'Caja', descripcion: 'Apertura de sesión de caja' },
      { accion: 'cerrar_caja', modulo: 'Caja', descripcion: 'Cierre de sesión de caja' },
      { accion: 'crear_remate', modulo: 'Remates', descripcion: 'Creación de nuevo remate' },
      { accion: 'enviar_notificacion', modulo: 'Notificaciones', descripcion: 'Envío de notificación a cliente' },
      { accion: 'generar_reporte', modulo: 'Reportes', descripcion: 'Generación de reporte' },
      { accion: 'cambiar_password', modulo: 'Usuarios', descripcion: 'Cambio de contraseña' },
      { accion: 'crear_usuario', modulo: 'Usuarios', descripcion: 'Creación de nuevo usuario' },
      { accion: 'modificar_configuracion', modulo: 'Configuración', descripcion: 'Modificación de configuración del sistema' }
    ]
    
    const resultados = ['exitoso', 'fallido', 'bloqueado'] as const
    const ips = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '10.0.0.50']
    
    const registros = []
    
    for (let i = 0; i < 50; i++) {
      const usuario = usuarios[Math.floor(Math.random() * usuarios.length)]
      const accionData = acciones[Math.floor(Math.random() * acciones.length)]
      const resultado = resultados[Math.floor(Math.random() * resultados.length)]
      
      // Más probabilidad de éxito
      const resultadoFinal = Math.random() < 0.85 ? 'exitoso' as const : 
                           Math.random() < 0.9 ? 'fallido' as const : 'bloqueado' as const
      
      const fechaHora = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      
      registros.push({
        id: `audit-${i}`,
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        usuario_rol: usuario.rol,
        accion: accionData.accion,
        modulo: accionData.modulo,
        descripcion: accionData.descripcion,
        ip_address: ips[Math.floor(Math.random() * ips.length)],
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        resultado: resultadoFinal,
        fecha_hora: fechaHora.toISOString(),
        duracion_ms: Math.floor(Math.random() * 2000) + 100,
        detalles: {
          session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
          request_id: `req_${Math.random().toString(36).substr(2, 9)}`
        }
      })
    }
    
    return registros.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime())
  }

  const calcularEstadisticas = (registros: RegistroAuditoria[]): EstadisticasAuditoria => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    const registrosHoy = registros.filter(r => new Date(r.fecha_hora) >= hoy)
    const exitosos = registros.filter(r => r.resultado === 'exitoso')
    const fallidos = registros.filter(r => r.resultado === 'fallido')
    
    const usuariosUnicos = new Set(registros.map(r => r.usuario_id))
    
    const modulosCount = registros.reduce((acc, r) => {
      acc[r.modulo] = (acc[r.modulo] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    const moduloMasUsado = Object.entries(modulosCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
    
    return {
      totalRegistros: registros.length,
      registrosHoy: registrosHoy.length,
      accionesExitosas: exitosos.length,
      accionesFallidas: fallidos.length,
      usuariosActivos: usuariosUnicos.size,
      moduloMasUsado
    }
  }

  const filtrarRegistros = () => {
    return registros.filter(registro => {
      const matchesSearch = registro.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           registro.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           registro.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           registro.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesModulo = filtroModulo === 'todos' || registro.modulo === filtroModulo
      const matchesResultado = filtroResultado === 'todos' || registro.resultado === filtroResultado
      
      let matchesFecha = true
      if (filtroFecha !== 'todos') {
        const fechaRegistro = new Date(registro.fecha_hora)
        const ahora = new Date()
        
        switch (filtroFecha) {
          case 'hoy':
            const hoy = new Date()
            hoy.setHours(0, 0, 0, 0)
            matchesFecha = fechaRegistro >= hoy
            break
          case 'semana':
            const semanaAtras = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesFecha = fechaRegistro >= semanaAtras
            break
          case 'mes':
            const mesAtras = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
            matchesFecha = fechaRegistro >= mesAtras
            break
        }
      }
      
      return matchesSearch && matchesModulo && matchesResultado && matchesFecha
    })
  }

  const exportarRegistros = () => {
    const registrosFiltrados = filtrarRegistros()
    const csv = [
      ['Fecha/Hora', 'Usuario', 'Rol', 'Módulo', 'Acción', 'Descripción', 'Resultado', 'IP', 'Duración (ms)'],
      ...registrosFiltrados.map(r => [
        new Date(r.fecha_hora).toLocaleString('es-PE'),
        r.usuario_nombre,
        r.usuario_rol,
        r.modulo,
        r.accion,
        r.descripcion,
        r.resultado,
        r.ip_address,
        r.duracion_ms?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Registros exportados exitosamente')
  }

  const getResultadoBadge = (resultado: string) => {
    const variants = {
      'exitoso': 'default',
      'fallido': 'destructive',
      'bloqueado': 'secondary'
    }
    return variants[resultado as keyof typeof variants] || 'secondary'
  }

  const getResultadoIcon = (resultado: string) => {
    const icons = {
      'exitoso': <CheckCircle className="h-4 w-4 text-green-600" />,
      'fallido': <XCircle className="h-4 w-4 text-red-600" />,
      'bloqueado': <Shield className="h-4 w-4 text-orange-600" />
    }
    return icons[resultado as keyof typeof icons] || <Clock className="h-4 w-4 text-gray-600" />
  }

  const formatFechaHora = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getModulosUnicos = () => {
    const modulos = Array.from(new Set(registros.map(r => r.modulo)))
    return modulos.sort()
  }

  const registrosFiltrados = filtrarRegistros()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Auditoría del Sistema</h1>
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
          <Link href="/dashboard/roles-permisos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Auditoría del Sistema</h1>
            <p className="text-gray-600">Registro de actividades y acciones de usuarios</p>
          </div>
        </div>
        <Button onClick={exportarRegistros}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Registros Hoy</p>
                  <p className="text-2xl font-bold text-blue-600">{estadisticas.registrosHoy}</p>
                  <p className="text-xs text-gray-500">de {estadisticas.totalRegistros} total</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa de Éxito</p>
                  <p className="text-2xl font-bold text-green-600">
                    {((estadisticas.accionesExitosas / estadisticas.totalRegistros) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">{estadisticas.accionesExitosas} exitosas</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-purple-600">{estadisticas.usuariosActivos}</p>
                  <p className="text-xs text-gray-500">Módulo más usado: {estadisticas.moduloMasUsado}</p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
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
            placeholder="Buscar por usuario, acción o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Módulos</option>
            {getModulosUnicos().map(modulo => (
              <option key={modulo} value={modulo}>{modulo}</option>
            ))}
          </select>
          
          <select
            value={filtroResultado}
            onChange={(e) => setFiltroResultado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Resultados</option>
            <option value="exitoso">Exitosos</option>
            <option value="fallido">Fallidos</option>
            <option value="bloqueado">Bloqueados</option>
          </select>
          
          <select
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las Fechas</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Última Semana</option>
            <option value="mes">Último Mes</option>
          </select>
        </div>
      </div>

      {/* Registros de Auditoría */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Auditoría ({registrosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {registrosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
              <p className="text-gray-600">
                {searchTerm || filtroModulo !== 'todos' || filtroResultado !== 'todos' || filtroFecha !== 'todos'
                  ? 'No se encontraron registros con los filtros aplicados'
                  : 'Aún no hay registros de auditoría'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {registrosFiltrados.map((registro) => (
                <div key={registro.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getResultadoIcon(registro.resultado)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{registro.descripcion}</h4>
                          <Badge variant={getResultadoBadge(registro.resultado) as "default" | "secondary" | "destructive"}>
                            {registro.resultado}
                          </Badge>
                          <Badge variant="outline">{registro.modulo}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Usuario:</strong> {registro.usuario_nombre}</p>
                            <p><strong>Rol:</strong> {registro.usuario_rol}</p>
                          </div>
                          <div>
                            <p><strong>Acción:</strong> {registro.accion}</p>
                            <p><strong>IP:</strong> {registro.ip_address}</p>
                          </div>
                          <div>
                            <p><strong>Fecha:</strong> {formatFechaHora(registro.fecha_hora)}</p>
                            <p><strong>Duración:</strong> {registro.duracion_ms}ms</p>
                          </div>
                          <div>
                            {registro.detalles && (
                              <>
                                <p><strong>Session:</strong> {registro.detalles.session_id}</p>
                                <p><strong>Request:</strong> {registro.detalles.request_id}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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
