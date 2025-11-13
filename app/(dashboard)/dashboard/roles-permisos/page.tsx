'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Users, 
  Key, 
  Eye,
  Settings,
  Plus,
  Search,
  UserCheck,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Usuario {
  id?: string
  nombre: string
  email: string
  rol: string
  estado: 'activo' | 'inactivo' | 'bloqueado'
  ultimo_acceso?: string
  permisos_especiales: string[]
  created_at?: string
}

interface Rol {
  id?: string
  nombre: string
  descripcion: string
  nivel: number
  permisos: string[]
  usuarios_asignados: number
  color: string
  activo: boolean
}

interface EstadisticasSeguridad {
  totalUsuarios: number
  usuariosActivos: number
  totalRoles: number
  sesionesActivas: number
  intentosFallidos: number
  ultimaAuditoria: string
}

export default function RolesPermisosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasSeguridad | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')

  useEffect(() => {
    loadDatosSeguridad()
  }, [])

  const loadDatosSeguridad = async () => {
    try {
      setLoading(true)
      
      // Generar datos de ejemplo
      const usuariosEjemplo = generarUsuarios()
      const rolesEjemplo = generarRoles()
      const statsEjemplo = calcularEstadisticas(usuariosEjemplo, rolesEjemplo)
      
      setUsuarios(usuariosEjemplo)
      setRoles(rolesEjemplo)
      setEstadisticas(statsEjemplo)
      
    } catch (error) {
      console.error('Error cargando datos de seguridad:', error)
      toast.error('Error al cargar los datos de seguridad')
    } finally {
      setLoading(false)
    }
  }

  const generarUsuarios = (): Usuario[] => {
    const ejemplos = [
      {
        id: 'user-1',
        nombre: 'Admin Principal',
        email: 'admin@juntay.com',
        rol: 'Administrador',
        estado: 'activo' as const,
        ultimo_acceso: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        permisos_especiales: ['super_admin', 'backup_db'],
        created_at: new Date('2025-01-01').toISOString()
      },
      {
        id: 'user-2',
        nombre: 'María García',
        email: 'maria.garcia@juntay.com',
        rol: 'Gerente',
        estado: 'activo' as const,
        ultimo_acceso: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        permisos_especiales: ['reportes_avanzados'],
        created_at: new Date('2025-01-15').toISOString()
      },
      {
        id: 'user-3',
        nombre: 'Carlos López',
        email: 'carlos.lopez@juntay.com',
        rol: 'Cajero',
        estado: 'activo' as const,
        ultimo_acceso: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        permisos_especiales: [],
        created_at: new Date('2025-02-01').toISOString()
      },
      {
        id: 'user-4',
        nombre: 'Ana Martín',
        email: 'ana.martin@juntay.com',
        rol: 'Evaluador',
        estado: 'activo' as const,
        ultimo_acceso: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        permisos_especiales: ['valuacion_avanzada'],
        created_at: new Date('2025-02-10').toISOString()
      },
      {
        id: 'user-5',
        nombre: 'Luis Rodríguez',
        email: 'luis.rodriguez@juntay.com',
        rol: 'Cajero',
        estado: 'inactivo' as const,
        ultimo_acceso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        permisos_especiales: [],
        created_at: new Date('2025-01-20').toISOString()
      }
    ]
    
    return ejemplos
  }

  const generarRoles = (): Rol[] => {
    return [
      {
        id: 'rol-1',
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema',
        nivel: 1,
        permisos: ['*'],
        usuarios_asignados: 1,
        color: 'bg-red-100 text-red-800',
        activo: true
      },
      {
        id: 'rol-2',
        nombre: 'Gerente',
        descripcion: 'Gestión operativa y reportes',
        nivel: 2,
        permisos: ['clientes.*', 'creditos.*', 'reportes.*', 'vencimientos.*', 'remates.*'],
        usuarios_asignados: 1,
        color: 'bg-blue-100 text-blue-800',
        activo: true
      },
      {
        id: 'rol-3',
        nombre: 'Cajero',
        descripcion: 'Operaciones de caja y pagos',
        nivel: 3,
        permisos: ['caja.*', 'pagos.crear', 'clientes.ver', 'creditos.ver'],
        usuarios_asignados: 2,
        color: 'bg-green-100 text-green-800',
        activo: true
      },
      {
        id: 'rol-4',
        nombre: 'Evaluador',
        descripcion: 'Tasación y evaluación de garantías',
        nivel: 3,
        permisos: ['garantias.*', 'valuacion.*', 'clientes.ver'],
        usuarios_asignados: 1,
        color: 'bg-purple-100 text-purple-800',
        activo: true
      }
    ]
  }

  const calcularEstadisticas = (usuarios: Usuario[], roles: Rol[]): EstadisticasSeguridad => {
    return {
      totalUsuarios: usuarios.length,
      usuariosActivos: usuarios.filter(u => u.estado === 'activo').length,
      totalRoles: roles.filter(r => r.activo).length,
      sesionesActivas: usuarios.filter(u => u.estado === 'activo' && u.ultimo_acceso && 
        new Date(u.ultimo_acceso) > new Date(Date.now() - 8 * 60 * 60 * 1000)).length,
      intentosFallidos: Math.floor(Math.random() * 5),
      ultimaAuditoria: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  }

  const filtrarUsuarios = () => {
    return usuarios.filter(usuario => {
      const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesEstado = filtroEstado === 'todos' || usuario.estado === filtroEstado
      
      return matchesSearch && matchesEstado
    })
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activo': 'default',
      'inactivo': 'secondary',
      'bloqueado': 'destructive'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const formatFechaAcceso = (fecha?: string) => {
    if (!fecha) return 'Nunca'
    
    const ahora = new Date()
    const fechaAcceso = new Date(fecha)
    const diffMs = ahora.getTime() - fechaAcceso.getTime()
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffHoras / 24)
    
    if (diffHoras < 1) return 'Hace menos de 1 hora'
    if (diffHoras < 24) return `Hace ${diffHoras} horas`
    if (diffDias < 7) return `Hace ${diffDias} días`
    return fechaAcceso.toLocaleDateString('es-PE')
  }

  const toggleEstadoUsuario = async (usuarioId: string) => {
    setUsuarios(prev => prev.map(u => 
      u.id === usuarioId 
        ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' as const }
        : u
    ))
    toast.success('Estado del usuario actualizado')
  }

  const usuariosFiltrados = filtrarUsuarios()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Roles y Permisos</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Roles y Permisos</h1>
          <p className="text-gray-600">Control de acceso y seguridad del sistema</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/roles-permisos/usuarios">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Gestionar Usuarios
            </Button>
          </Link>
          <Link href="/dashboard/roles-permisos/roles">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas de Seguridad */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {estadisticas.usuariosActivos}/{estadisticas.totalUsuarios}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sesiones Activas</p>
                  <p className="text-2xl font-bold text-blue-600">{estadisticas.sesionesActivas}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Intentos Fallidos</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.intentosFallidos}</p>
                  <p className="text-xs text-gray-500">Últimas 24h</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/roles-permisos/usuarios">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Gestión de Usuarios</h3>
                  <p className="text-sm text-gray-600">Crear, editar y administrar usuarios</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{estadisticas?.totalUsuarios || 0}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/roles-permisos/roles">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Gestión de Roles</h3>
                  <p className="text-sm text-gray-600">Configurar roles y permisos</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">{estadisticas?.totalRoles || 0}</p>
                </div>
                <Shield className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/roles-permisos/auditoria">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Auditoría</h3>
                  <p className="text-sm text-gray-600">Registro de actividades</p>
                  <p className="text-sm font-medium text-orange-600 mt-2">
                    {estadisticas ? formatFechaAcceso(estadisticas.ultimaAuditoria) : 'N/A'}
                  </p>
                </div>
                <Eye className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Roles Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((rol) => (
              <div key={rol.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={rol.color}>
                    {rol.nombre}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {rol.usuarios_asignados} usuarios
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rol.descripcion}</p>
                <div className="text-xs text-gray-500">
                  <p>Nivel: {rol.nivel}</p>
                  <p>Permisos: {rol.permisos.length}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar usuarios por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos los Estados</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
          <option value="bloqueado">Bloqueados</option>
        </select>
      </div>

      {/* Lista de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
              <p className="text-gray-600">
                {searchTerm || filtroEstado !== 'todos'
                  ? 'No se encontraron usuarios con los filtros aplicados'
                  : 'Aún no hay usuarios registrados'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {usuariosFiltrados.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {usuario.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{usuario.nombre}</h4>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{usuario.rol}</Badge>
                        <Badge variant={getEstadoBadge(usuario.estado) as "default" | "secondary" | "destructive"}>
                          {usuario.estado}
                        </Badge>
                        {usuario.permisos_especiales.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            +{usuario.permisos_especiales.length} permisos
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm text-gray-500">
                      <p>Último acceso:</p>
                      <p>{formatFechaAcceso(usuario.ultimo_acceso)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleEstadoUsuario(usuario.id!)}
                    >
                      {usuario.estado === 'activo' ? <Lock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
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
