'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Settings, 
  Plus, 
  Edit,
  Trash2,
  Save,
  X,
  Percent,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ModalidadPago {
  id?: string
  nombre: string
  tipo: 'semanal' | 'quincenal' | 'mensual'
  porcentaje_minimo: number
  porcentaje_maximo: number
  plazo_maximo_semanas: number
  interes_mora: number
  activa: boolean
  descripcion?: string
  color?: string
  created_at?: string
  updated_at?: string
}

interface ConfiguracionGlobal {
  dias_gracia: number
  interes_mora_global: number
  monto_minimo_cronograma: number
  monto_maximo_cronograma: number
  notificaciones_automaticas: boolean
  recordatorios_dias_antes: number
}

export default function ConfigurarPagosFlexiblesPage() {
  const [modalidades, setModalidades] = useState<ModalidadPago[]>([])
  const [configuracion, setConfiguracion] = useState<ConfiguracionGlobal>({
    dias_gracia: 3,
    interes_mora_global: 5,
    monto_minimo_cronograma: 100,
    monto_maximo_cronograma: 50000,
    notificaciones_automaticas: true,
    recordatorios_dias_antes: 2
  })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingModalidad, setEditingModalidad] = useState<ModalidadPago | null>(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'semanal' as 'semanal' | 'quincenal' | 'mensual',
    porcentaje_minimo: 5,
    porcentaje_maximo: 50,
    plazo_maximo_semanas: 20,
    interes_mora: 2,
    descripcion: '',
    activa: true,
    color: '#3B82F6'
  })

  useEffect(() => {
    loadConfiguracion()
  }, [])

  const loadConfiguracion = async () => {
    try {
      setLoading(true)
      
      // Cargar modalidades por defecto
      const modalidadesPorDefecto: ModalidadPago[] = [
        {
          id: '1',
          nombre: 'Pago Semanal Estándar',
          tipo: 'semanal',
          porcentaje_minimo: 5,
          porcentaje_maximo: 25,
          plazo_maximo_semanas: 20,
          interes_mora: 2,
          activa: true,
          descripcion: 'Modalidad de pago semanal con flexibilidad en porcentajes',
          color: '#10B981',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          nombre: 'Pago Quincenal Flexible',
          tipo: 'quincenal',
          porcentaje_minimo: 10,
          porcentaje_maximo: 40,
          plazo_maximo_semanas: 24,
          interes_mora: 3,
          activa: true,
          descripcion: 'Modalidad quincenal ideal para trabajadores dependientes',
          color: '#3B82F6',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          nombre: 'Pago Mensual Premium',
          tipo: 'mensual',
          porcentaje_minimo: 20,
          porcentaje_maximo: 60,
          plazo_maximo_semanas: 52,
          interes_mora: 5,
          activa: true,
          descripcion: 'Modalidad mensual para montos altos con mayor flexibilidad',
          color: '#8B5CF6',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          nombre: 'Pago Semanal Express',
          tipo: 'semanal',
          porcentaje_minimo: 15,
          porcentaje_maximo: 35,
          plazo_maximo_semanas: 12,
          interes_mora: 3,
          activa: false,
          descripcion: 'Modalidad semanal para pagos rápidos (desactivada)',
          color: '#EF4444',
          created_at: new Date().toISOString()
        }
      ]
      
      setModalidades(modalidadesPorDefecto)
      
    } catch (error) {
      console.error('Error cargando configuración:', error)
      toast.error('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (modalidad?: ModalidadPago) => {
    if (modalidad) {
      setEditingModalidad(modalidad)
      setFormData({
        nombre: modalidad.nombre,
        tipo: modalidad.tipo,
        porcentaje_minimo: modalidad.porcentaje_minimo,
        porcentaje_maximo: modalidad.porcentaje_maximo,
        plazo_maximo_semanas: modalidad.plazo_maximo_semanas,
        interes_mora: modalidad.interes_mora,
        descripcion: modalidad.descripcion || '',
        activa: modalidad.activa,
        color: modalidad.color || '#3B82F6'
      })
    } else {
      setEditingModalidad(null)
      setFormData({
        nombre: '',
        tipo: 'semanal',
        porcentaje_minimo: 5,
        porcentaje_maximo: 50,
        plazo_maximo_semanas: 20,
        interes_mora: 2,
        descripcion: '',
        activa: true,
        color: '#3B82F6'
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingModalidad(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido')
      return
    }
    
    if (formData.porcentaje_minimo >= formData.porcentaje_maximo) {
      toast.error('El porcentaje mínimo debe ser menor al máximo')
      return
    }

    try {
      const modalidadData: ModalidadPago = {
        ...formData,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        updated_at: new Date().toISOString()
      }
      
      if (editingModalidad) {
        // Actualizar modalidad existente
        const updatedModalidades = modalidades.map(m => 
          m.id === editingModalidad.id ? { ...modalidadData, id: editingModalidad.id } : m
        )
        setModalidades(updatedModalidades)
        toast.success('Modalidad actualizada exitosamente')
      } else {
        // Crear nueva modalidad
        const newModalidad = {
          ...modalidadData,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        }
        setModalidades([...modalidades, newModalidad])
        toast.success('Modalidad creada exitosamente')
      }
      
      closeModal()
      
    } catch (error) {
      console.error('Error guardando modalidad:', error)
      toast.error('Error al guardar la modalidad')
    }
  }

  const duplicarModalidad = (modalidad: ModalidadPago) => {
    const nuevaModalidad: ModalidadPago = {
      ...modalidad,
      id: Date.now().toString(),
      nombre: `${modalidad.nombre} (Copia)`,
      created_at: new Date().toISOString()
    }
    setModalidades([...modalidades, nuevaModalidad])
    toast.success('Modalidad duplicada exitosamente')
  }

  const eliminarModalidad = (modalidadId: string) => {
    if (!confirm('¿Está seguro de eliminar esta modalidad? Esta acción no se puede deshacer.')) {
      return
    }
    
    setModalidades(modalidades.filter(m => m.id !== modalidadId))
    toast.success('Modalidad eliminada exitosamente')
  }

  const toggleActiva = (modalidadId: string) => {
    setModalidades(modalidades.map(m => 
      m.id === modalidadId ? { ...m, activa: !m.activa } : m
    ))
    toast.success('Estado de modalidad actualizado')
  }

  const guardarConfiguracionGlobal = () => {
    toast.success('Configuración global guardada exitosamente')
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'semanal': return <Calendar className="h-4 w-4" />
      case 'quincenal': return <BarChart3 className="h-4 w-4" />
      case 'mensual': return <Clock className="h-4 w-4" />
      default: return <Percent className="h-4 w-4" />
    }
  }

  const getTipoBadge = (tipo: string) => {
    const colors = {
      'semanal': 'bg-green-100 text-green-800',
      'quincenal': 'bg-blue-100 text-blue-800',
      'mensual': 'bg-purple-100 text-purple-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Configurar Pagos Flexibles</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
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
          <Link href="/dashboard/pagos-flexibles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurar Pagos Flexibles</h1>
            <p className="text-gray-600">Gestionar modalidades y configuración global</p>
          </div>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Modalidad
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuración Global */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración Global
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dias_gracia">Días de Gracia</Label>
                <Input
                  id="dias_gracia"
                  type="number"
                  min="0"
                  max="30"
                  value={configuracion.dias_gracia}
                  onChange={(e) => setConfiguracion(prev => ({ 
                    ...prev, 
                    dias_gracia: parseInt(e.target.value) || 0 
                  }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Días adicionales antes de aplicar mora
                </p>
              </div>
              
              <div>
                <Label htmlFor="interes_mora">Interés de Mora Global (%)</Label>
                <Input
                  id="interes_mora"
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={configuracion.interes_mora_global}
                  onChange={(e) => setConfiguracion(prev => ({ 
                    ...prev, 
                    interes_mora_global: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="monto_minimo">Monto Mínimo (S/)</Label>
                <Input
                  id="monto_minimo"
                  type="number"
                  min="0"
                  value={configuracion.monto_minimo_cronograma}
                  onChange={(e) => setConfiguracion(prev => ({ 
                    ...prev, 
                    monto_minimo_cronograma: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="monto_maximo">Monto Máximo (S/)</Label>
                <Input
                  id="monto_maximo"
                  type="number"
                  min="0"
                  value={configuracion.monto_maximo_cronograma}
                  onChange={(e) => setConfiguracion(prev => ({ 
                    ...prev, 
                    monto_maximo_cronograma: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="recordatorios">Recordatorios (días antes)</Label>
                <Input
                  id="recordatorios"
                  type="number"
                  min="0"
                  max="30"
                  value={configuracion.recordatorios_dias_antes}
                  onChange={(e) => setConfiguracion(prev => ({ 
                    ...prev, 
                    recordatorios_dias_antes: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notificaciones"
                  checked={configuracion.notificaciones_automaticas}
                  onChange={(e) => setConfiguracion(prev => ({ 
                    ...prev, 
                    notificaciones_automaticas: e.target.checked 
                  }))}
                  className="rounded"
                />
                <Label htmlFor="notificaciones">Notificaciones Automáticas</Label>
              </div>
              
              <Button onClick={guardarConfiguracionGlobal} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modalidades de Pago */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Modalidades de Pago ({modalidades.length})
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{modalidades.filter(m => m.activa).length} activas</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modalidades.map((modalidad) => (
                  <div
                    key={modalidad.id}
                    className={`p-4 border rounded-lg ${!modalidad.activa ? 'opacity-60 bg-gray-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: modalidad.color }}
                        ></div>
                        <div>
                          <h4 className="font-semibold text-lg">{modalidad.nombre}</h4>
                          <p className="text-sm text-gray-600">{modalidad.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTipoBadge(modalidad.tipo)}>
                          <div className="flex items-center gap-1">
                            {getTipoIcon(modalidad.tipo)}
                            {modalidad.tipo}
                          </div>
                        </Badge>
                        {!modalidad.activa && (
                          <Badge variant="secondary">Inactiva</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-gray-600">% Mínimo</p>
                        <p className="font-semibold">{modalidad.porcentaje_minimo}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">% Máximo</p>
                        <p className="font-semibold">{modalidad.porcentaje_maximo}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Plazo Máximo</p>
                        <p className="font-semibold">{modalidad.plazo_maximo_semanas} semanas</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Interés Mora</p>
                        <p className="font-semibold">{modalidad.interes_mora}%</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(modalidad)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicarModalidad(modalidad)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActiva(modalidad.id!)}
                        className={modalidad.activa ? 'text-orange-600' : 'text-green-600'}
                      >
                        {modalidad.activa ? (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activar
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => eliminarModalidad(modalidad.id!)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Crear/Editar Modalidad */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingModalidad ? 'Editar Modalidad' : 'Nueva Modalidad'}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre de la Modalidad *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Pago Semanal Premium"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tipo">Tipo de Modalidad *</Label>
                    <select
                      id="tipo"
                      value={formData.tipo}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="semanal">Semanal</option>
                      <option value="quincenal">Quincenal</option>
                      <option value="mensual">Mensual</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="porcentaje_minimo">Porcentaje Mínimo (%) *</Label>
                    <Input
                      id="porcentaje_minimo"
                      type="number"
                      min="1"
                      max="100"
                      step="0.1"
                      value={formData.porcentaje_minimo}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        porcentaje_minimo: parseFloat(e.target.value) || 0 
                      }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="porcentaje_maximo">Porcentaje Máximo (%) *</Label>
                    <Input
                      id="porcentaje_maximo"
                      type="number"
                      min="1"
                      max="100"
                      step="0.1"
                      value={formData.porcentaje_maximo}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        porcentaje_maximo: parseFloat(e.target.value) || 0 
                      }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plazo_maximo">Plazo Máximo (semanas) *</Label>
                    <Input
                      id="plazo_maximo"
                      type="number"
                      min="1"
                      max="104"
                      value={formData.plazo_maximo_semanas}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        plazo_maximo_semanas: parseInt(e.target.value) || 0 
                      }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="interes_mora_modal">Interés de Mora (%) *</Label>
                    <Input
                      id="interes_mora_modal"
                      type="number"
                      min="0"
                      max="50"
                      step="0.1"
                      value={formData.interes_mora}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        interes_mora: parseFloat(e.target.value) || 0 
                      }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="color">Color Identificativo</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción de la modalidad de pago..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activa"
                    checked={formData.activa}
                    onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="activa">Modalidad activa</Label>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingModalidad ? 'Actualizar' : 'Crear'} Modalidad
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
