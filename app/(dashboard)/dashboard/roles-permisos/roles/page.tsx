'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowLeft, 
  Shield, 
  Plus, 
  Edit,
  Trash2,
  Users,
  Key,
  Settings,
  Save,
  X,
  Copy,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Permiso {
  id: string
  modulo: string
  accion: string
  descripcion: string
  nivel_requerido: number
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
  es_sistema: boolean
  created_at?: string
}

export default function GestionRolesPage() {
  const [roles, setRoles] = useState<Rol[]>([])
  const [permisos, setPermisos] = useState<Permiso[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [rolEditando, setRolEditando] = useState<Rol | null>(null)
  const [formData, setFormData] = useState<Partial<Rol>>({})
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([])

  useEffect(() => {
    loadRoles()
    loadPermisos()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      
      const rolesEjemplo = generarRoles()
      setRoles(rolesEjemplo)
      
    } catch (error) {
      console.error('Error cargando roles:', error)
      toast.error('Error al cargar los roles')
    } finally {
      setLoading(false)
    }
  }

  const loadPermisos = async () => {
    const permisosEjemplo = generarPermisos()
    setPermisos(permisosEjemplo)
  }

  const generarRoles = (): Rol[] => {
    return [
      {
        id: 'rol-1',
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema, puede gestionar usuarios, configuraciones y realizar todas las operaciones',
        nivel: 1,
        permisos: ['*'],
        usuarios_asignados: 1,
        color: 'bg-red-100 text-red-800',
        activo: true,
        es_sistema: true,
        created_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'rol-2',
        nombre: 'Gerente',
        descripcion: 'Gestión operativa completa, acceso a reportes y supervisión de procesos críticos',
        nivel: 2,
        permisos: [
          'clientes.ver', 'clientes.crear', 'clientes.editar',
          'creditos.ver', 'creditos.crear', 'creditos.editar', 'creditos.aprobar',
          'garantias.ver', 'garantias.crear', 'garantias.editar',
          'remates.ver', 'remates.crear', 'remates.gestionar',
          'vencimientos.ver', 'vencimientos.gestionar',
          'reportes.ver', 'reportes.exportar',
          'notificaciones.ver', 'notificaciones.enviar'
        ],
        usuarios_asignados: 1,
        color: 'bg-blue-100 text-blue-800',
        activo: true,
        es_sistema: false,
        created_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'rol-3',
        nombre: 'Cajero',
        descripcion: 'Operaciones de caja, registro de pagos y consulta de información básica',
        nivel: 3,
        permisos: [
          'caja.ver', 'caja.abrir', 'caja.cerrar', 'caja.movimientos',
          'pagos.crear', 'pagos.ver',
          'clientes.ver', 'clientes.buscar',
          'creditos.ver', 'creditos.consultar'
        ],
        usuarios_asignados: 2,
        color: 'bg-green-100 text-green-800',
        activo: true,
        es_sistema: false,
        created_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'rol-4',
        nombre: 'Evaluador',
        descripcion: 'Especialista en tasación y evaluación de garantías, gestión de valuaciones',
        nivel: 3,
        permisos: [
          'garantias.ver', 'garantias.crear', 'garantias.editar', 'garantias.tasar',
          'valuacion.ver', 'valuacion.crear', 'valuacion.ia',
          'clientes.ver', 'clientes.buscar',
          'creditos.ver'
        ],
        usuarios_asignados: 1,
        color: 'bg-purple-100 text-purple-800',
        activo: true,
        es_sistema: false,
        created_at: '2025-01-01T00:00:00Z'
      }
    ]
  }

  const generarPermisos = (): Permiso[] => {
    return [
      // Clientes
      { id: 'clientes.ver', modulo: 'Clientes', accion: 'Ver', descripcion: 'Ver información de clientes', nivel_requerido: 3 },
      { id: 'clientes.crear', modulo: 'Clientes', accion: 'Crear', descripcion: 'Registrar nuevos clientes', nivel_requerido: 3 },
      { id: 'clientes.editar', modulo: 'Clientes', accion: 'Editar', descripcion: 'Modificar información de clientes', nivel_requerido: 2 },
      { id: 'clientes.eliminar', modulo: 'Clientes', accion: 'Eliminar', descripcion: 'Eliminar clientes del sistema', nivel_requerido: 1 },
      
      // Créditos
      { id: 'creditos.ver', modulo: 'Créditos', accion: 'Ver', descripcion: 'Consultar información de créditos', nivel_requerido: 3 },
      { id: 'creditos.crear', modulo: 'Créditos', accion: 'Crear', descripcion: 'Otorgar nuevos créditos', nivel_requerido: 2 },
      { id: 'creditos.editar', modulo: 'Créditos', accion: 'Editar', descripcion: 'Modificar términos de créditos', nivel_requerido: 2 },
      { id: 'creditos.aprobar', modulo: 'Créditos', accion: 'Aprobar', descripcion: 'Aprobar solicitudes de crédito', nivel_requerido: 2 },
      
      // Garantías
      { id: 'garantias.ver', modulo: 'Garantías', accion: 'Ver', descripcion: 'Ver información de garantías', nivel_requerido: 3 },
      { id: 'garantias.crear', modulo: 'Garantías', accion: 'Crear', descripcion: 'Registrar nuevas garantías', nivel_requerido: 3 },
      { id: 'garantias.editar', modulo: 'Garantías', accion: 'Editar', descripcion: 'Modificar garantías existentes', nivel_requerido: 2 },
      { id: 'garantias.tasar', modulo: 'Garantías', accion: 'Tasar', descripcion: 'Realizar tasaciones de garantías', nivel_requerido: 3 },
      
      // Caja
      { id: 'caja.ver', modulo: 'Caja', accion: 'Ver', descripcion: 'Consultar estado de caja', nivel_requerido: 3 },
      { id: 'caja.abrir', modulo: 'Caja', accion: 'Abrir', descripcion: 'Abrir sesión de caja', nivel_requerido: 3 },
      { id: 'caja.cerrar', modulo: 'Caja', accion: 'Cerrar', descripcion: 'Cerrar sesión de caja', nivel_requerido: 3 },
      { id: 'caja.movimientos', modulo: 'Caja', accion: 'Movimientos', descripcion: 'Registrar movimientos de caja', nivel_requerido: 3 },
      
      // Remates
      { id: 'remates.ver', modulo: 'Remates', accion: 'Ver', descripcion: 'Ver información de remates', nivel_requerido: 2 },
      { id: 'remates.crear', modulo: 'Remates', accion: 'Crear', descripcion: 'Crear nuevos remates', nivel_requerido: 2 },
      { id: 'remates.gestionar', modulo: 'Remates', accion: 'Gestionar', descripcion: 'Gestionar proceso de remates', nivel_requerido: 2 },
      
      // Vencimientos
      { id: 'vencimientos.ver', modulo: 'Vencimientos', accion: 'Ver', descripcion: 'Ver créditos vencidos', nivel_requerido: 2 },
      { id: 'vencimientos.gestionar', modulo: 'Vencimientos', accion: 'Gestionar', descripcion: 'Gestionar proceso de vencimientos', nivel_requerido: 2 },
      
      // Reportes
      { id: 'reportes.ver', modulo: 'Reportes', accion: 'Ver', descripcion: 'Ver reportes del sistema', nivel_requerido: 2 },
      { id: 'reportes.exportar', modulo: 'Reportes', accion: 'Exportar', descripcion: 'Exportar reportes', nivel_requerido: 2 },
      
      // Notificaciones
      { id: 'notificaciones.ver', modulo: 'Notificaciones', accion: 'Ver', descripcion: 'Ver notificaciones', nivel_requerido: 2 },
      { id: 'notificaciones.enviar', modulo: 'Notificaciones', accion: 'Enviar', descripcion: 'Enviar notificaciones', nivel_requerido: 2 },
      
      // Valuación IA
      { id: 'valuacion.ver', modulo: 'Valuación IA', accion: 'Ver', descripcion: 'Ver valuaciones automáticas', nivel_requerido: 3 },
      { id: 'valuacion.crear', modulo: 'Valuación IA', accion: 'Crear', descripcion: 'Crear valuaciones con IA', nivel_requerido: 3 },
      { id: 'valuacion.ia', modulo: 'Valuación IA', accion: 'IA Avanzada', descripcion: 'Usar funciones avanzadas de IA', nivel_requerido: 2 },
      
      // Administración
      { id: 'usuarios.ver', modulo: 'Usuarios', accion: 'Ver', descripcion: 'Ver usuarios del sistema', nivel_requerido: 1 },
      { id: 'usuarios.crear', modulo: 'Usuarios', accion: 'Crear', descripcion: 'Crear nuevos usuarios', nivel_requerido: 1 },
      { id: 'usuarios.editar', modulo: 'Usuarios', accion: 'Editar', descripcion: 'Modificar usuarios', nivel_requerido: 1 },
      { id: 'configuracion.ver', modulo: 'Configuración', accion: 'Ver', descripcion: 'Ver configuración del sistema', nivel_requerido: 1 },
      { id: 'configuracion.editar', modulo: 'Configuración', accion: 'Editar', descripcion: 'Modificar configuración', nivel_requerido: 1 }
    ]
  }

  const abrirModalRol = (rol?: Rol) => {
    if (rol) {
      setRolEditando(rol)
      setFormData(rol)
      setPermisosSeleccionados(rol.permisos.includes('*') ? ['*'] : rol.permisos)
    } else {
      setRolEditando(null)
      setFormData({
        nombre: '',
        descripcion: '',
        nivel: 3,
        permisos: [],
        usuarios_asignados: 0,
        color: 'bg-gray-100 text-gray-800',
        activo: true,
        es_sistema: false
      })
      setPermisosSeleccionados([])
    }
    setShowModal(true)
  }

  const guardarRol = async () => {
    try {
      if (!formData.nombre || !formData.descripcion) {
        toast.error('Nombre y descripción son obligatorios')
        return
      }

      const rolData = {
        ...formData,
        permisos: permisosSeleccionados
      }

      if (rolEditando) {
        setRoles(prev => prev.map(r => 
          r.id === rolEditando.id ? { ...r, ...rolData } as Rol : r
        ))
        toast.success('Rol actualizado exitosamente')
      } else {
        const nuevoRol: Rol = {
          id: `rol-${Date.now()}`,
          ...rolData,
          created_at: new Date().toISOString()
        } as Rol
        
        setRoles(prev => [...prev, nuevoRol])
        toast.success('Rol creado exitosamente')
      }
      
      setShowModal(false)
      setRolEditando(null)
      setFormData({})
      setPermisosSeleccionados([])
      
    } catch (error) {
      toast.error('Error al guardar el rol')
    }
  }

  const duplicarRol = (rol: Rol) => {
    const rolDuplicado = {
      ...rol,
      id: undefined,
      nombre: `${rol.nombre} (Copia)`,
      usuarios_asignados: 0,
      es_sistema: false
    }
    abrirModalRol(rolDuplicado)
  }

  const eliminarRol = async (rolId: string) => {
    const rol = roles.find(r => r.id === rolId)
    
    if (rol?.es_sistema) {
      toast.error('No se pueden eliminar roles del sistema')
      return
    }
    
    if (rol?.usuarios_asignados && rol.usuarios_asignados > 0) {
      toast.error('No se puede eliminar un rol que tiene usuarios asignados')
      return
    }
    
    if (!confirm('¿Está seguro de eliminar este rol?')) return
    
    setRoles(prev => prev.filter(r => r.id !== rolId))
    toast.success('Rol eliminado exitosamente')
  }

  const togglePermisoSeleccionado = (permisoId: string) => {
    if (permisoId === '*') {
      setPermisosSeleccionados(prev => 
        prev.includes('*') ? [] : ['*']
      )
    } else {
      setPermisosSeleccionados(prev => {
        const sinAsterisco = prev.filter(p => p !== '*')
        return prev.includes(permisoId)
          ? sinAsterisco.filter(p => p !== permisoId)
          : [...sinAsterisco, permisoId]
      })
    }
  }

  const agruparPermisosPorModulo = () => {
    const grupos: { [key: string]: Permiso[] } = {}
    permisos.forEach(permiso => {
      if (!grupos[permiso.modulo]) {
        grupos[permiso.modulo] = []
      }
      grupos[permiso.modulo].push(permiso)
    })
    return grupos
  }

  const getNivelColor = (nivel: number) => {
    const colors = {
      1: 'text-red-600',
      2: 'text-blue-600',
      3: 'text-green-600'
    }
    return colors[nivel as keyof typeof colors] || 'text-gray-600'
  }

  const getNivelTexto = (nivel: number) => {
    const textos = {
      1: 'Administrador',
      2: 'Supervisor',
      3: 'Operativo'
    }
    return textos[nivel as keyof typeof textos] || 'Desconocido'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Roles</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles</h1>
            <p className="text-gray-600">Configurar roles y permisos del sistema</p>
          </div>
        </div>
        <Button onClick={() => abrirModalRol()}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Rol
        </Button>
      </div>

      {/* Lista de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((rol) => (
          <Card key={rol.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className={rol.color}>
                      {rol.nombre}
                    </Badge>
                    {rol.es_sistema && (
                      <Badge variant="outline" className="text-xs">
                        Sistema
                      </Badge>
                    )}
                  </CardTitle>
                  <p className={`text-sm font-medium ${getNivelColor(rol.nivel)}`}>
                    Nivel {rol.nivel} - {getNivelTexto(rol.nivel)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicarRol(rol)}
                    title="Duplicar rol"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {!rol.es_sistema && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirModalRol(rol)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarRol(rol.id!)}
                        className="text-red-600 hover:text-red-700"
                        disabled={rol.usuarios_asignados > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{rol.descripcion}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Usuarios asignados:</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{rol.usuarios_asignados}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Permisos:</span>
                  <div className="flex items-center gap-1">
                    <Key className="h-3 w-3" />
                    <span className="font-medium">
                      {rol.permisos.includes('*') ? 'Todos' : rol.permisos.length}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <Badge variant={rol.activo ? 'default' : 'secondary'}>
                    {rol.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              
              {rol.permisos.includes('*') && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Acceso completo al sistema
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Crear/Editar Rol */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {rolEditando ? 'Editar Rol' : 'Nuevo Rol'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del Rol *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Supervisor de Caja"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <textarea
                      id="descripcion"
                      value={formData.descripcion || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      placeholder="Describe las responsabilidades de este rol..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nivel">Nivel de Acceso</Label>
                    <select
                      id="nivel"
                      value={formData.nivel || 3}
                      onChange={(e) => setFormData(prev => ({ ...prev, nivel: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={1}>Nivel 1 - Administrador</option>
                      <option value={2}>Nivel 2 - Supervisor</option>
                      <option value={3}>Nivel 3 - Operativo</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="color">Color del Badge</Label>
                    <select
                      id="color"
                      value={formData.color || 'bg-gray-100 text-gray-800'}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="bg-red-100 text-red-800">Rojo</option>
                      <option value="bg-blue-100 text-blue-800">Azul</option>
                      <option value="bg-green-100 text-green-800">Verde</option>
                      <option value="bg-purple-100 text-purple-800">Morado</option>
                      <option value="bg-orange-100 text-orange-800">Naranja</option>
                      <option value="bg-gray-100 text-gray-800">Gris</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-semibold mb-3 block">Permisos del Rol</Label>
                  
                  {/* Acceso Completo */}
                  <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="permiso-all"
                        checked={permisosSeleccionados.includes('*')}
                        onCheckedChange={() => togglePermisoSeleccionado('*')}
                      />
                      <Label htmlFor="permiso-all" className="text-red-700 font-medium">
                        Acceso Completo (Administrador)
                      </Label>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Otorga todos los permisos del sistema, incluyendo futuros módulos
                    </p>
                  </div>
                  
                  {/* Permisos por Módulo */}
                  {!permisosSeleccionados.includes('*') && (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(agruparPermisosPorModulo()).map(([modulo, permisosModulo]) => (
                        <div key={modulo} className="border rounded-lg p-3">
                          <h4 className="font-medium text-sm mb-2">{modulo}</h4>
                          <div className="space-y-2">
                            {permisosModulo.map((permiso) => (
                              <div key={permiso.id} className="flex items-start space-x-2">
                                <Checkbox
                                  id={`permiso-${permiso.id}`}
                                  checked={permisosSeleccionados.includes(permiso.id)}
                                  onCheckedChange={() => togglePermisoSeleccionado(permiso.id)}
                                  disabled={permiso.nivel_requerido < (formData.nivel || 3)}
                                />
                                <div className="flex-1">
                                  <Label 
                                    htmlFor={`permiso-${permiso.id}`} 
                                    className={`text-sm ${permiso.nivel_requerido < (formData.nivel || 3) ? 'text-gray-400' : ''}`}
                                  >
                                    {permiso.accion}
                                  </Label>
                                  <p className="text-xs text-gray-500">{permiso.descripcion}</p>
                                  {permiso.nivel_requerido < (formData.nivel || 3) && (
                                    <p className="text-xs text-red-500">
                                      Requiere nivel {permiso.nivel_requerido} o superior
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarRol}>
                  <Save className="h-4 w-4 mr-2" />
                  {rolEditando ? 'Actualizar' : 'Crear'} Rol
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
