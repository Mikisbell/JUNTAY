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
  FileText, 
  MessageSquare, 
  Phone, 
  Mail,
  Plus,
  Edit,
  Trash2,
  Copy,
  Search,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Plantilla {
  id?: string
  nombre: string
  tipo: 'whatsapp' | 'sms' | 'email'
  asunto?: string
  contenido: string
  variables?: string[]
  activa: boolean
  usos_count?: number
  created_at?: string
  updated_at?: string
}

export default function PlantillasPage() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [showModal, setShowModal] = useState(false)
  const [editingPlantilla, setEditingPlantilla] = useState<Plantilla | null>(null)
  const [previewPlantilla, setPreviewPlantilla] = useState<Plantilla | null>(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'whatsapp' as 'whatsapp' | 'sms' | 'email',
    asunto: '',
    contenido: '',
    activa: true
  })

  useEffect(() => {
    loadPlantillas()
  }, [])

  const loadPlantillas = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Intentar cargar plantillas de la base de datos
      const { data, error } = await supabase
        .from('plantillas_notificacion')
        .select('*')
        .order('created_at', { ascending: false })
        
      if (error) {
        // Si la tabla no existe, usar plantillas por defecto
        console.log('Usando plantillas por defecto')
        setPlantillas([
          {
            id: '1',
            nombre: 'Recordatorio de Pago',
            tipo: 'whatsapp',
            contenido: 'Hola {nombre}, te recordamos que tienes un pago pendiente por S/ {monto} con vencimiento el {fecha}. Para pagar puedes usar YAPE al {telefono_yape}. ¡Gracias!',
            variables: ['nombre', 'monto', 'fecha', 'telefono_yape'],
            activa: true,
            usos_count: 15,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            nombre: 'Confirmación de Pago',
            tipo: 'whatsapp',
            contenido: 'Hola {nombre}, confirmamos la recepción de tu pago por S/ {monto} el {fecha}. Tu crédito está al día. ¡Gracias por tu puntualidad!',
            variables: ['nombre', 'monto', 'fecha'],
            activa: true,
            usos_count: 8,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            nombre: 'Vencimiento Próximo - 7 días',
            tipo: 'whatsapp',
            contenido: 'Hola {nombre}, tu crédito vence en 7 días ({fecha_vencimiento}). Monto a pagar: S/ {monto}. Evita intereses adicionales pagando a tiempo.',
            variables: ['nombre', 'fecha_vencimiento', 'monto'],
            activa: true,
            usos_count: 12,
            created_at: new Date().toISOString()
          },
          {
            id: '4',
            nombre: 'Vencimiento Próximo - 3 días',
            tipo: 'whatsapp',
            contenido: 'URGENTE: Hola {nombre}, tu crédito vence en 3 días ({fecha_vencimiento}). Monto: S/ {monto}. Paga hoy para evitar mora.',
            variables: ['nombre', 'fecha_vencimiento', 'monto'],
            activa: true,
            usos_count: 20,
            created_at: new Date().toISOString()
          },
          {
            id: '5',
            nombre: 'Notificación de Remate',
            tipo: 'whatsapp',
            contenido: 'Hola {nombre}, tu garantía "{garantia}" entrará en remate el {fecha_remate}. Precio base: S/ {precio_base}. Puedes recuperarla pagando S/ {monto_total}.',
            variables: ['nombre', 'garantia', 'fecha_remate', 'precio_base', 'monto_total'],
            activa: true,
            usos_count: 3,
            created_at: new Date().toISOString()
          },
          {
            id: '6',
            nombre: 'Email - Resumen Mensual',
            tipo: 'email',
            asunto: 'Resumen de tu crédito - {mes} {año}',
            contenido: 'Estimado/a {nombre},\n\nTe enviamos el resumen de tu crédito correspondiente al mes de {mes} {año}:\n\n- Saldo actual: S/ {saldo}\n- Próximo pago: {fecha_proximo_pago}\n- Monto: S/ {monto_proximo_pago}\n\nGracias por confiar en nosotros.\n\nSaludos cordiales,\nEquipo JUNTAY',
            variables: ['nombre', 'mes', 'año', 'saldo', 'fecha_proximo_pago', 'monto_proximo_pago'],
            activa: true,
            usos_count: 5,
            created_at: new Date().toISOString()
          }
        ])
        return
      }
      
      setPlantillas(data || [])
    } catch (error) {
      console.error('Error cargando plantillas:', error)
      toast.error('Error al cargar las plantillas')
    } finally {
      setLoading(false)
    }
  }

  const plantillasFiltradas = plantillas.filter(plantilla => {
    const matchesSearch = plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plantilla.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filtroTipo === 'todos' || plantilla.tipo === filtroTipo
    return matchesSearch && matchesTipo
  })

  const openModal = (plantilla?: Plantilla) => {
    if (plantilla) {
      setEditingPlantilla(plantilla)
      setFormData({
        nombre: plantilla.nombre,
        tipo: plantilla.tipo,
        asunto: plantilla.asunto || '',
        contenido: plantilla.contenido,
        activa: plantilla.activa
      })
    } else {
      setEditingPlantilla(null)
      setFormData({
        nombre: '',
        tipo: 'whatsapp',
        asunto: '',
        contenido: '',
        activa: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPlantilla(null)
    setFormData({
      nombre: '',
      tipo: 'whatsapp',
      asunto: '',
      contenido: '',
      activa: true
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim() || !formData.contenido.trim()) {
      toast.error('Nombre y contenido son requeridos')
      return
    }

    try {
      const supabase = createClient()
      
      // Extraer variables del contenido
      const variables: string[] = []
      const regex = /\{(\w+)\}/g
      let match
      while ((match = regex.exec(formData.contenido)) !== null) {
        variables.push(match[1])
      }
      
      const plantillaData = {
        nombre: formData.nombre.trim(),
        tipo: formData.tipo,
        asunto: formData.asunto.trim() || null,
        contenido: formData.contenido.trim(),
        variables: variables,
        activa: formData.activa
      }
      
      if (editingPlantilla) {
        // Actualizar plantilla existente
        const { error } = await supabase
          .from('plantillas_notificacion')
          .update(plantillaData)
          .eq('id', editingPlantilla.id!)
          
        if (error) throw error
        toast.success('Plantilla actualizada exitosamente')
      } else {
        // Crear nueva plantilla
        const { error } = await supabase
          .from('plantillas_notificacion')
          .insert([plantillaData])
          
        if (error) throw error
        toast.success('Plantilla creada exitosamente')
      }
      
      closeModal()
      await loadPlantillas()
      
    } catch (error) {
      console.error('Error guardando plantilla:', error)
      toast.error('Error al guardar la plantilla')
    }
  }

  const duplicarPlantilla = async (plantilla: Plantilla) => {
    try {
      const supabase = createClient()
      
      const nuevaPlantilla = {
        nombre: `${plantilla.nombre} (Copia)`,
        tipo: plantilla.tipo,
        asunto: plantilla.asunto,
        contenido: plantilla.contenido,
        variables: plantilla.variables,
        activa: true
      }
      
      const { error } = await supabase
        .from('plantillas_notificacion')
        .insert([nuevaPlantilla])
        
      if (error) throw error
      
      toast.success('Plantilla duplicada exitosamente')
      await loadPlantillas()
      
    } catch (error) {
      console.error('Error duplicando plantilla:', error)
      toast.error('Error al duplicar la plantilla')
    }
  }

  const eliminarPlantilla = async (plantillaId: string) => {
    if (!confirm('¿Está seguro de eliminar esta plantilla? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('plantillas_notificacion')
        .delete()
        .eq('id', plantillaId)
        
      if (error) throw error
      
      toast.success('Plantilla eliminada exitosamente')
      await loadPlantillas()
      
    } catch (error) {
      console.error('Error eliminando plantilla:', error)
      toast.error('Error al eliminar la plantilla')
    }
  }

  const toggleActiva = async (plantilla: Plantilla) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('plantillas_notificacion')
        .update({ activa: !plantilla.activa })
        .eq('id', plantilla.id!)
        
      if (error) throw error
      
      toast.success(`Plantilla ${!plantilla.activa ? 'activada' : 'desactivada'}`)
      await loadPlantillas()
      
    } catch (error) {
      console.error('Error actualizando plantilla:', error)
      toast.error('Error al actualizar la plantilla')
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />
      case 'sms': return <Phone className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTipoBadge = (tipo: string) => {
    const colors = {
      'whatsapp': 'bg-green-100 text-green-800',
      'sms': 'bg-blue-100 text-blue-800',
      'email': 'bg-purple-100 text-purple-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Plantillas</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <Link href="/dashboard/notificaciones">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Plantillas</h1>
            <p className="text-gray-600">Crear y administrar plantillas de notificaciones</p>
          </div>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Plantillas</p>
                <p className="text-2xl font-bold">{plantillas.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">
                  {plantillas.filter(p => p.activa).length}
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
                <p className="text-sm text-gray-600">WhatsApp</p>
                <p className="text-2xl font-bold text-green-600">
                  {plantillas.filter(p => p.tipo === 'whatsapp').length}
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
                <p className="text-sm text-gray-600">Más Usada</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.max(...plantillas.map(p => p.usos_count || 0), 0)}
                </p>
                <p className="text-xs text-gray-500">usos</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar plantillas por nombre o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
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
      </div>

      {/* Grid de Plantillas */}
      {plantillasFiltradas.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay plantillas</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroTipo !== 'todos'
                ? 'No se encontraron plantillas con los filtros aplicados'
                : 'Aún no hay plantillas creadas'
              }
            </p>
            <Button onClick={() => openModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Plantilla
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plantillasFiltradas.map((plantilla) => (
            <Card key={plantilla.id} className={`hover:shadow-lg transition-shadow ${!plantilla.activa ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getTipoIcon(plantilla.tipo)}
                    <h3 className="font-semibold text-lg">{plantilla.nombre}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={getTipoBadge(plantilla.tipo)}>
                      {plantilla.tipo.toUpperCase()}
                    </Badge>
                    {!plantilla.activa && (
                      <Badge variant="secondary">Inactiva</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {plantilla.asunto && (
                  <div>
                    <p className="text-xs text-gray-500">Asunto:</p>
                    <p className="text-sm font-medium">{plantilla.asunto}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-gray-500">Contenido:</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{plantilla.contenido}</p>
                </div>
                
                {plantilla.variables && plantilla.variables.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {plantilla.variables.slice(0, 3).map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {'{' + variable + '}'}
                        </Badge>
                      ))}
                      {plantilla.variables.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{plantilla.variables.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Usos: {plantilla.usos_count || 0}</span>
                  {plantilla.created_at && (
                    <span>Creada: {formatFecha(plantilla.created_at)}</span>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewPlantilla(plantilla)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(plantilla)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => duplicarPlantilla(plantilla)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActiva(plantilla)}
                    className={plantilla.activa ? 'text-orange-600' : 'text-green-600'}
                  >
                    {plantilla.activa ? <X className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => eliminarPlantilla(plantilla.id!)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Crear/Editar Plantilla */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingPlantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre de la Plantilla *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Recordatorio de Pago"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipo">Tipo de Notificación *</Label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                
                {formData.tipo === 'email' && (
                  <div>
                    <Label htmlFor="asunto">Asunto del Email</Label>
                    <Input
                      id="asunto"
                      value={formData.asunto}
                      onChange={(e) => setFormData(prev => ({ ...prev, asunto: e.target.value }))}
                      placeholder="Asunto del email"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="contenido">Contenido del Mensaje *</Label>
                  <Textarea
                    id="contenido"
                    value={formData.contenido}
                    onChange={(e) => setFormData(prev => ({ ...prev, contenido: e.target.value }))}
                    placeholder="Escribe el contenido de la plantilla..."
                    rows={8}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usa variables como {'{nombre}'}, {'{monto}'}, {'{fecha}'} para personalizar el mensaje
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activa"
                    checked={formData.activa}
                    onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="activa">Plantilla activa</Label>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingPlantilla ? 'Actualizar' : 'Crear'} Plantilla
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Plantilla */}
      {previewPlantilla && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Vista Previa</h2>
                <Button variant="ghost" size="sm" onClick={() => setPreviewPlantilla(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getTipoIcon(previewPlantilla.tipo)}
                  <span className="font-medium">{previewPlantilla.nombre}</span>
                  <Badge className={getTipoBadge(previewPlantilla.tipo)}>
                    {previewPlantilla.tipo.toUpperCase()}
                  </Badge>
                </div>
                
                {previewPlantilla.asunto && (
                  <div>
                    <p className="text-sm text-gray-600">Asunto:</p>
                    <p className="font-medium">{previewPlantilla.asunto}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600">Contenido:</p>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="whitespace-pre-wrap">{previewPlantilla.contenido}</p>
                  </div>
                </div>
                
                {previewPlantilla.variables && previewPlantilla.variables.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Variables disponibles:</p>
                    <div className="flex flex-wrap gap-1">
                      {previewPlantilla.variables.map((variable) => (
                        <Badge key={variable} variant="outline">
                          {'{' + variable + '}'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
