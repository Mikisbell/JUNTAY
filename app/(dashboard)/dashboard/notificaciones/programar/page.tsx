'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  Phone, 
  Mail,
  Users,
  Search,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Cliente {
  id?: string
  nombres?: string
  apellido_paterno?: string
  apellido_materno?: string
  razon_social?: string
  tipo_persona: 'natural' | 'juridica'
  telefono?: string
  telefono_whatsapp?: string
  email?: string
}

interface Plantilla {
  id?: string
  nombre: string
  tipo: 'whatsapp' | 'sms' | 'email'
  asunto?: string
  contenido: string
  variables?: string[]
}

export default function ProgramarNotificacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [searchClientes, setSearchClientes] = useState('')
  const [clientesSeleccionados, setClientesSeleccionados] = useState<Cliente[]>([])
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<Plantilla | null>(null)
  
  const [formData, setFormData] = useState({
    tipo: 'whatsapp' as 'whatsapp' | 'sms' | 'email',
    asunto: '',
    mensaje: '',
    fecha_programada: '',
    hora_programada: '',
    enviar_inmediato: true
  })

  useEffect(() => {
    loadClientes()
    loadPlantillas()
  }, [])

  const loadClientes = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nombres, apellido_paterno, apellido_materno, razon_social, tipo_persona, telefono, telefono_whatsapp, email')
        .order('nombres', { ascending: true })
        
      if (error) throw error
      setClientes(data || [])
    } catch (error) {
      console.error('Error cargando clientes:', error)
      toast.error('Error al cargar los clientes')
    }
  }

  const loadPlantillas = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('plantillas_notificacion')
        .select('*')
        .order('nombre', { ascending: true })
        
      if (error) {
        // Si la tabla no existe, crear algunas plantillas por defecto
        console.log('Tabla plantillas_notificacion no existe, usando plantillas por defecto')
        setPlantillas([
          {
            id: '1',
            nombre: 'Recordatorio de Pago',
            tipo: 'whatsapp',
            contenido: 'Hola {nombre}, te recordamos que tienes un pago pendiente por S/ {monto} con vencimiento el {fecha}. ¡Gracias!'
          },
          {
            id: '2',
            nombre: 'Confirmación de Pago',
            tipo: 'whatsapp',
            contenido: 'Hola {nombre}, confirmamos la recepción de tu pago por S/ {monto}. ¡Gracias por tu puntualidad!'
          },
          {
            id: '3',
            nombre: 'Vencimiento Próximo',
            tipo: 'whatsapp',
            contenido: 'Hola {nombre}, tu crédito vence en {dias} días. Monto a pagar: S/ {monto}. Evita intereses adicionales.'
          }
        ])
        return
      }
      
      setPlantillas(data || [])
    } catch (error) {
      console.error('Error cargando plantillas:', error)
    }
  }

  const clientesFiltrados = clientes.filter(cliente => {
    const nombreCompleto = cliente.tipo_persona === 'natural'
      ? `${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno}`.toLowerCase()
      : cliente.razon_social?.toLowerCase() || ''
    
    return nombreCompleto.includes(searchClientes.toLowerCase()) ||
           cliente.telefono?.includes(searchClientes) ||
           cliente.email?.toLowerCase().includes(searchClientes.toLowerCase())
  })

  const agregarCliente = (cliente: Cliente) => {
    if (!clientesSeleccionados.find(c => c.id === cliente.id)) {
      setClientesSeleccionados([...clientesSeleccionados, cliente])
    }
    setSearchClientes('')
  }

  const removerCliente = (clienteId: string) => {
    setClientesSeleccionados(clientesSeleccionados.filter(c => c.id !== clienteId))
  }

  const aplicarPlantilla = (plantilla: Plantilla) => {
    setPlantillaSeleccionada(plantilla)
    setFormData(prev => ({
      ...prev,
      tipo: plantilla.tipo,
      asunto: plantilla.asunto || '',
      mensaje: plantilla.contenido
    }))
  }

  const validarContacto = (cliente: Cliente, tipo: string) => {
    switch (tipo) {
      case 'whatsapp':
        return cliente.telefono_whatsapp || cliente.telefono
      case 'sms':
        return cliente.telefono
      case 'email':
        return cliente.email
      default:
        return false
    }
  }

  const clientesValidos = clientesSeleccionados.filter(cliente => 
    validarContacto(cliente, formData.tipo)
  )

  const clientesInvalidos = clientesSeleccionados.filter(cliente => 
    !validarContacto(cliente, formData.tipo)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (clientesValidos.length === 0) {
      toast.error('Debe seleccionar al menos un cliente con contacto válido')
      return
    }
    
    if (!formData.mensaje.trim()) {
      toast.error('El mensaje es requerido')
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()
      
      const fechaProgramada = formData.enviar_inmediato 
        ? new Date().toISOString()
        : `${formData.fecha_programada}T${formData.hora_programada}:00`
      
      // Crear notificaciones para cada cliente válido
      const notificaciones = clientesValidos.map(cliente => {
        const nombreCliente = cliente.tipo_persona === 'natural'
          ? `${cliente.nombres} ${cliente.apellido_paterno}`
          : cliente.razon_social
        
        let contacto = ''
        switch (formData.tipo) {
          case 'whatsapp':
            contacto = cliente.telefono_whatsapp || cliente.telefono || ''
            break
          case 'sms':
            contacto = cliente.telefono || ''
            break
          case 'email':
            contacto = cliente.email || ''
            break
        }
        
        return {
          tipo: formData.tipo,
          destinatario_nombre: nombreCliente,
          destinatario_contacto: contacto,
          asunto: formData.asunto || null,
          mensaje: formData.mensaje,
          estado: 'programada' as const,
          fecha_programada: fechaProgramada,
          cliente_id: cliente.id,
          plantilla_id: plantillaSeleccionada?.id || null
        }
      })
      
      const { error } = await supabase
        .from('notificaciones')
        .insert(notificaciones)
        
      if (error) throw error
      
      toast.success(`${notificaciones.length} notificaciones ${formData.enviar_inmediato ? 'enviadas' : 'programadas'} exitosamente`)
      router.push('/dashboard/notificaciones')
      
    } catch (error) {
      console.error('Error programando notificaciones:', error)
      toast.error('Error al programar las notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const getNombreCliente = (cliente: Cliente) => {
    return cliente.tipo_persona === 'natural'
      ? `${cliente.nombres} ${cliente.apellido_paterno}`
      : cliente.razon_social
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />
      case 'sms': return <Phone className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      default: return <Send className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/notificaciones">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programar Notificación</h1>
          <p className="text-gray-600">Enviar WhatsApp, SMS o Email a clientes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuración de Notificación */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tipo de Notificación */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Notificación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                    { value: 'sms', label: 'SMS', icon: Phone },
                    { value: 'email', label: 'Email', icon: Mail }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tipo: value as any }))}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                        formData.tipo === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plantillas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Plantillas Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plantillas
                    .filter(p => p.tipo === formData.tipo)
                    .map((plantilla) => (
                      <button
                        key={plantilla.id}
                        type="button"
                        onClick={() => aplicarPlantilla(plantilla)}
                        className={`p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                          plantillaSeleccionada?.id === plantilla.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <h4 className="font-medium text-sm">{plantilla.nombre}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {plantilla.contenido}
                        </p>
                      </button>
                    ))}
                </div>
                <Link href="/dashboard/notificaciones/plantillas" className="block mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Gestionar Plantillas
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contenido del Mensaje */}
            <Card>
              <CardHeader>
                <CardTitle>Contenido del Mensaje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.tipo === 'email' && (
                  <div>
                    <Label htmlFor="asunto">Asunto</Label>
                    <Input
                      id="asunto"
                      value={formData.asunto}
                      onChange={(e) => setFormData(prev => ({ ...prev, asunto: e.target.value }))}
                      placeholder="Asunto del email"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="mensaje">Mensaje *</Label>
                  <Textarea
                    id="mensaje"
                    value={formData.mensaje}
                    onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes usar variables como {'{nombre}'}, {'{monto}'}, {'{fecha}'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Programación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Programación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enviar_inmediato"
                    checked={formData.enviar_inmediato}
                    onChange={(e) => setFormData(prev => ({ ...prev, enviar_inmediato: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="enviar_inmediato">Enviar inmediatamente</Label>
                </div>
                
                {!formData.enviar_inmediato && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={formData.fecha_programada}
                        onChange={(e) => setFormData(prev => ({ ...prev, fecha_programada: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required={!formData.enviar_inmediato}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hora">Hora</Label>
                      <Input
                        id="hora"
                        type="time"
                        value={formData.hora_programada}
                        onChange={(e) => setFormData(prev => ({ ...prev, hora_programada: e.target.value }))}
                        required={!formData.enviar_inmediato}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selección de Destinatarios */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Seleccionar Destinatarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={searchClientes}
                    onChange={(e) => setSearchClientes(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {searchClientes && (
                  <div className="max-h-40 overflow-y-auto border rounded-lg">
                    {clientesFiltrados.slice(0, 10).map((cliente) => (
                      <button
                        key={cliente.id}
                        type="button"
                        onClick={() => agregarCliente(cliente)}
                        className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                      >
                        <p className="font-medium text-sm">{getNombreCliente(cliente)}</p>
                        <p className="text-xs text-gray-600">
                          {formData.tipo === 'whatsapp' && (cliente.telefono_whatsapp || cliente.telefono)}
                          {formData.tipo === 'sms' && cliente.telefono}
                          {formData.tipo === 'email' && cliente.email}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Destinatarios Seleccionados */}
            <Card>
              <CardHeader>
                <CardTitle>Destinatarios Seleccionados</CardTitle>
              </CardHeader>
              <CardContent>
                {clientesSeleccionados.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay destinatarios seleccionados</p>
                ) : (
                  <div className="space-y-2">
                    {clientesValidos.map((cliente) => (
                      <div key={cliente.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                        <div>
                          <p className="font-medium text-sm text-green-900">{getNombreCliente(cliente)}</p>
                          <p className="text-xs text-green-700">
                            {formData.tipo === 'whatsapp' && (cliente.telefono_whatsapp || cliente.telefono)}
                            {formData.tipo === 'sms' && cliente.telefono}
                            {formData.tipo === 'email' && cliente.email}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removerCliente(cliente.id!)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    
                    {clientesInvalidos.map((cliente) => (
                      <div key={cliente.id} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                        <div>
                          <p className="font-medium text-sm text-red-900">{getNombreCliente(cliente)}</p>
                          <p className="text-xs text-red-700">
                            Sin contacto {formData.tipo}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removerCliente(cliente.id!)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resumen */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {getTipoIcon(formData.tipo)}
                  <span className="font-medium capitalize">{formData.tipo}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Destinatarios válidos: {clientesValidos.length}</p>
                  {clientesInvalidos.length > 0 && (
                    <p className="text-red-600">Sin contacto: {clientesInvalidos.length}</p>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  {formData.enviar_inmediato ? (
                    <p className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Envío inmediato
                    </p>
                  ) : (
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange-600" />
                      Programado: {formData.fecha_programada} {formData.hora_programada}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link href="/dashboard/notificaciones">
            <Button type="button" variant="outline" disabled={loading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading || clientesValidos.length === 0}>
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {formData.enviar_inmediato ? 'Enviando...' : 'Programando...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {formData.enviar_inmediato ? 'Enviar Ahora' : 'Programar Envío'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
