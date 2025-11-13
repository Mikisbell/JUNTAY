'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Shield,
  Key,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Usuario {
  id?: string
  nombre: string
  apellidos: string
  email: string
  telefono?: string
  dni: string
  rol_id: string
  rol_nombre: string
  estado: 'activo' | 'inactivo' | 'bloqueado'
  fecha_creacion: string
  ultimo_acceso?: string
  intentos_fallidos: number
  permisos_especiales: string[]
  configuracion: {
    cambiar_password: boolean
    acceso_remoto: boolean
    notificaciones_email: boolean
    sesion_multiple: boolean
  }
}

interface Rol {
  id: string
  nombre: string
  descripcion: string
  nivel: number
  color: string
}

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroRol, setFiltroRol] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [showModal, setShowModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState<Partial<Usuario>>({})

  useEffect(() => {
    loadUsuarios()
    loadRoles()
  }, [])

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      
      // Generar usuarios de ejemplo
      const usuariosEjemplo = generarUsuarios()
      setUsuarios(usuariosEjemplo)
      
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      toast.error('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    const rolesEjemplo = [
      { id: 'rol-1', nombre: 'Administrador', descripcion: 'Acceso completo', nivel: 1, color: 'bg-red-100 text-red-800' },
      { id: 'rol-2', nombre: 'Gerente', descripcion: 'Gestión operativa', nivel: 2, color: 'bg-blue-100 text-blue-800' },
      { id: 'rol-3', nombre: 'Cajero', descripcion: 'Operaciones de caja', nivel: 3, color: 'bg-green-100 text-green-800' },
      { id: 'rol-4', nombre: 'Evaluador', descripcion: 'Tasación de garantías', nivel: 3, color: 'bg-purple-100 text-purple-800' }
    ]
    setRoles(rolesEjemplo)
  }

  const generarUsuarios = (): Usuario[] => {
    return [
      {
        id: 'user-1',
        nombre: 'Juan Carlos',
        apellidos: 'Pérez García',
        email: 'admin@juntay.com',
        telefono: '987654321',
        dni: '12345678',
        rol_id: 'rol-1',
        rol_nombre: 'Administrador',
        estado: 'activo',
        fecha_creacion: '2025-01-01T00:00:00Z',
        ultimo_acceso: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        intentos_fallidos: 0,
        permisos_especiales: ['super_admin', 'backup_db'],
        configuracion: {
          cambiar_password: true,
          acceso_remoto: true,
          notificaciones_email: true,
          sesion_multiple: false
        }
      },
      {
        id: 'user-2',
        nombre: 'María Elena',
        apellidos: 'García López',
        email: 'maria.garcia@juntay.com',
        telefono: '987654322',
        dni: '87654321',
        rol_id: 'rol-2',
        rol_nombre: 'Gerente',
        estado: 'activo',
        fecha_creacion: '2025-01-15T00:00:00Z',
        ultimo_acceso: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        intentos_fallidos: 0,
        permisos_especiales: ['reportes_avanzados'],
        configuracion: {
          cambiar_password: true,
          acceso_remoto: true,
          notificaciones_email: true,
          sesion_multiple: true
        }
      },
      {
        id: 'user-3',
        nombre: 'Carlos Alberto',
        apellidos: 'López Silva',
        email: 'carlos.lopez@juntay.com',
        telefono: '987654323',
        dni: '11223344',
        rol_id: 'rol-3',
        rol_nombre: 'Cajero',
        estado: 'activo',
        fecha_creacion: '2025-02-01T00:00:00Z',
        ultimo_acceso: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        intentos_fallidos: 1,
        permisos_especiales: [],
        configuracion: {
          cambiar_password: false,
          acceso_remoto: false,
          notificaciones_email: true,
          sesion_multiple: false
        }
      },
      {
        id: 'user-4',
        nombre: 'Ana Patricia',
        apellidos: 'Martín Ruiz',
        email: 'ana.martin@juntay.com',
        telefono: '987654324',
        dni: '44332211',
        rol_id: 'rol-4',
        rol_nombre: 'Evaluador',
        estado: 'inactivo',
        fecha_creacion: '2025-02-10T00:00:00Z',
        ultimo_acceso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        intentos_fallidos: 0,
        permisos_especiales: ['valuacion_avanzada'],
        configuracion: {
          cambiar_password: true,
          acceso_remoto: false,
          notificaciones_email: false,
          sesion_multiple: false
        }
      }
    ]
  }

  const filtrarUsuarios = () => {
    return usuarios.filter(usuario => {
      const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           usuario.dni.includes(searchTerm)
      
      const matchesRol = filtroRol === 'todos' || usuario.rol_id === filtroRol
      const matchesEstado = filtroEstado === 'todos' || usuario.estado === filtroEstado
      
      return matchesSearch && matchesRol && matchesEstado
    })
  }

  const abrirModalUsuario = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEditando(usuario)
      setFormData(usuario)
    } else {
      setUsuarioEditando(null)
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        dni: '',
        rol_id: roles[0]?.id || '',
        estado: 'activo',
        permisos_especiales: [],
        configuracion: {
          cambiar_password: true,
          acceso_remoto: false,
          notificaciones_email: true,
          sesion_multiple: false
        }
      })
    }
    setShowModal(true)
  }

  const guardarUsuario = async () => {
    try {
      if (!formData.nombre || !formData.apellidos || !formData.email || !formData.dni) {
        toast.error('Todos los campos obligatorios deben estar completos')
        return
      }

      const rolSeleccionado = roles.find(r => r.id === formData.rol_id)
      
      if (usuarioEditando) {
        // Editar usuario existente
        setUsuarios(prev => prev.map(u => 
          u.id === usuarioEditando.id 
            ? { 
                ...u, 
                ...formData,
                rol_nombre: rolSeleccionado?.nombre || u.rol_nombre
              } as Usuario
            : u
        ))
        toast.success('Usuario actualizado exitosamente')
      } else {
        // Crear nuevo usuario
        const nuevoUsuario: Usuario = {
          id: `user-${Date.now()}`,
          ...formData,
          rol_nombre: rolSeleccionado?.nombre || '',
          fecha_creacion: new Date().toISOString(),
          intentos_fallidos: 0
        } as Usuario
        
        setUsuarios(prev => [...prev, nuevoUsuario])
        toast.success('Usuario creado exitosamente')
      }
      
      setShowModal(false)
      setUsuarioEditando(null)
      setFormData({})
      
    } catch (error) {
      toast.error('Error al guardar el usuario')
    }
  }

  const toggleEstadoUsuario = async (usuarioId: string) => {
    setUsuarios(prev => prev.map(u => 
      u.id === usuarioId 
        ? { 
            ...u, 
            estado: u.estado === 'activo' ? 'inactivo' : 
                   u.estado === 'inactivo' ? 'activo' : 'activo' as const
          }
        : u
    ))
    toast.success('Estado del usuario actualizado')
  }

  const eliminarUsuario = async (usuarioId: string) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return
    
    setUsuarios(prev => prev.filter(u => u.id !== usuarioId))
    toast.success('Usuario eliminado exitosamente')
  }

  const resetearPassword = async (usuarioId: string) => {
    if (!confirm('¿Está seguro de resetear la contraseña de este usuario?')) return
    
    toast.success('Contraseña reseteada. Se ha enviado un email al usuario.')
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activo': 'default',
      'inactivo': 'secondary',
      'bloqueado': 'destructive'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatUltimoAcceso = (fecha?: string) => {
    if (!fecha) return 'Nunca'
    
    const ahora = new Date()
    const fechaAcceso = new Date(fecha)
    const diffMs = ahora.getTime() - fechaAcceso.getTime()
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHoras < 1) return 'Hace menos de 1 hora'
    if (diffHoras < 24) return `Hace ${diffHoras} horas`
    return `Hace ${Math.floor(diffHoras / 24)} días`
  }

  const usuariosFiltrados = filtrarUsuarios()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
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
          <Link href="/dashboard/roles-permisos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administrar usuarios del sistema</p>
          </div>
        </div>
        <Button onClick={() => abrirModalUsuario()}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold">{usuarios.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {usuarios.filter(u => u.estado === 'activo').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactivos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {usuarios.filter(u => u.estado === 'inactivo').length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bloqueados</p>
                <p className="text-2xl font-bold text-red-600">
                  {usuarios.filter(u => u.estado === 'bloqueado').length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, email o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Roles</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
          
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
      </div>

      {/* Lista de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema ({usuariosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filtroRol !== 'todos' || filtroEstado !== 'todos'
                  ? 'No se encontraron usuarios con los filtros aplicados'
                  : 'Aún no hay usuarios registrados'
                }
              </p>
              <Button onClick={() => abrirModalUsuario()}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Usuario
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {usuariosFiltrados.map((usuario) => (
                <div key={usuario.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {usuario.nombre[0]}{usuario.apellidos[0]}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">
                            {usuario.nombre} {usuario.apellidos}
                          </h4>
                          <Badge variant={getEstadoBadge(usuario.estado) as "default" | "secondary" | "destructive"}>
                            {usuario.estado}
                          </Badge>
                          <Badge variant="outline" className={roles.find(r => r.id === usuario.rol_id)?.color}>
                            {usuario.rol_nombre}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {usuario.email}
                            </p>
                            <p className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {usuario.telefono || 'No registrado'}
                            </p>
                          </div>
                          <div>
                            <p><strong>DNI:</strong> {usuario.dni}</p>
                            <p><strong>Creado:</strong> {formatFecha(usuario.fecha_creacion)}</p>
                          </div>
                          <div>
                            <p><strong>Último acceso:</strong> {formatUltimoAcceso(usuario.ultimo_acceso)}</p>
                            <p><strong>Intentos fallidos:</strong> {usuario.intentos_fallidos}</p>
                          </div>
                        </div>
                        
                        {usuario.permisos_especiales.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Permisos especiales:</p>
                            <div className="flex gap-1 flex-wrap">
                              {usuario.permisos_especiales.map((permiso, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permiso}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetearPassword(usuario.id!)}
                        title="Resetear contraseña"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEstadoUsuario(usuario.id!)}
                        title={usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      >
                        {usuario.estado === 'activo' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirModalUsuario(usuario)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarUsuario(usuario.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear/Editar Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre del usuario"
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                    placeholder="Apellidos del usuario"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    placeholder="987654321"
                  />
                </div>
                <div>
                  <Label htmlFor="dni">DNI *</Label>
                  <Input
                    id="dni"
                    value={formData.dni || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                    placeholder="12345678"
                    maxLength={8}
                  />
                </div>
                <div>
                  <Label htmlFor="rol">Rol *</Label>
                  <select
                    id="rol"
                    value={formData.rol_id || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, rol_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Configuración de Acceso</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cambiar_password">Puede cambiar contraseña</Label>
                    <Switch
                      id="cambiar_password"
                      checked={formData.configuracion?.cambiar_password || false}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({
                        ...prev,
                        configuracion: { ...prev.configuracion, cambiar_password: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="acceso_remoto">Acceso remoto</Label>
                    <Switch
                      id="acceso_remoto"
                      checked={formData.configuracion?.acceso_remoto || false}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({
                        ...prev,
                        configuracion: { ...prev.configuracion, acceso_remoto: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notificaciones_email">Notificaciones por email</Label>
                    <Switch
                      id="notificaciones_email"
                      checked={formData.configuracion?.notificaciones_email || false}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({
                        ...prev,
                        configuracion: { ...prev.configuracion, notificaciones_email: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sesion_multiple">Sesiones múltiples</Label>
                    <Switch
                      id="sesion_multiple"
                      checked={formData.configuracion?.sesion_multiple || false}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({
                        ...prev,
                        configuracion: { ...prev.configuracion, sesion_multiple: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarUsuario}>
                  <Save className="h-4 w-4 mr-2" />
                  {usuarioEditando ? 'Actualizar' : 'Crear'} Usuario
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
