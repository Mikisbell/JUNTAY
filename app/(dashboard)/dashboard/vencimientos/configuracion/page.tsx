'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '../../../../components/ui/switch'
import { 
  ArrowLeft, 
  Settings, 
  Clock, 
  Calendar, 
  Bell,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Timer,
  MessageSquare,
  Phone,
  Mail,
  Gavel,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ConfiguracionVencimientos {
  // Períodos de tiempo
  dias_gracia_default: number
  dias_notificacion_previa: number[]
  dias_extension_maxima: number
  
  // Automatización
  automatizar_proceso: boolean
  crear_remates_automatico: boolean
  enviar_notificaciones_automatico: boolean
  
  // Notificaciones
  canales_activos: {
    whatsapp: boolean
    sms: boolean
    email: boolean
    llamada: boolean
  }
  
  // Horarios de envío
  horario_inicio: string
  horario_fin: string
  dias_laborables_solo: boolean
  
  // Criterios de priorización
  priorizar_por_monto: boolean
  monto_minimo_prioridad_alta: number
  priorizar_por_historial: boolean
  
  // Configuración de remates
  precio_base_porcentaje: number
  incremento_minimo_porcentaje: number
  duracion_remate_dias: number
  
  // Alertas y reportes
  alertas_diarias: boolean
  reporte_semanal: boolean
  notificar_gerencia: boolean
  
  updated_at?: string
}

export default function ConfiguracionVencimientosPage() {
  const [config, setConfig] = useState<ConfiguracionVencimientos>({
    // Valores por defecto según requerimientos
    dias_gracia_default: 7,
    dias_notificacion_previa: [7, 3, 1],
    dias_extension_maxima: 14,
    
    automatizar_proceso: true,
    crear_remates_automatico: false,
    enviar_notificaciones_automatico: true,
    
    canales_activos: {
      whatsapp: true,
      sms: false,
      email: true,
      llamada: false
    },
    
    horario_inicio: '08:00',
    horario_fin: '18:00',
    dias_laborables_solo: true,
    
    priorizar_por_monto: true,
    monto_minimo_prioridad_alta: 2000,
    priorizar_por_historial: true,
    
    precio_base_porcentaje: 70,
    incremento_minimo_porcentaje: 5,
    duracion_remate_dias: 15,
    
    alertas_diarias: true,
    reporte_semanal: true,
    notificar_gerencia: true
  })
  
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadConfiguracion()
  }, [])

  const loadConfiguracion = async () => {
    try {
      setLoading(true)
      // Aquí se cargaría la configuración desde la BD
      // Por ahora usamos valores por defecto
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Error cargando configuración:', error)
      toast.error('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = (field: keyof ConfiguracionVencimientos, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateNestedConfig = (parent: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ConfiguracionVencimientos] as any,
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const guardarConfiguracion = async () => {
    try {
      setLoading(true)
      
      // Validaciones
      if (config.dias_gracia_default < 1 || config.dias_gracia_default > 30) {
        toast.error('Los días de gracia deben estar entre 1 y 30')
        return
      }
      
      if (config.monto_minimo_prioridad_alta < 0) {
        toast.error('El monto mínimo no puede ser negativo')
        return
      }
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setConfig(prev => ({ ...prev, updated_at: new Date().toISOString() }))
      setHasChanges(false)
      toast.success('Configuración guardada exitosamente')
      
    } catch (error) {
      console.error('Error guardando configuración:', error)
      toast.error('Error al guardar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const resetearConfiguracion = () => {
    if (!confirm('¿Está seguro de restablecer la configuración a los valores por defecto?')) return
    
    setConfig({
      dias_gracia_default: 7,
      dias_notificacion_previa: [7, 3, 1],
      dias_extension_maxima: 14,
      
      automatizar_proceso: true,
      crear_remates_automatico: false,
      enviar_notificaciones_automatico: true,
      
      canales_activos: {
        whatsapp: true,
        sms: false,
        email: true,
        llamada: false
      },
      
      horario_inicio: '08:00',
      horario_fin: '18:00',
      dias_laborables_solo: true,
      
      priorizar_por_monto: true,
      monto_minimo_prioridad_alta: 2000,
      priorizar_por_historial: true,
      
      precio_base_porcentaje: 70,
      incremento_minimo_porcentaje: 5,
      duracion_remate_dias: 15,
      
      alertas_diarias: true,
      reporte_semanal: true,
      notificar_gerencia: true
    })
    
    setHasChanges(true)
    toast.success('Configuración restablecida a valores por defecto')
  }

  const updateDiasNotificacion = (index: number, value: number) => {
    const newDias = [...config.dias_notificacion_previa]
    newDias[index] = value
    updateConfig('dias_notificacion_previa', newDias.sort((a, b) => b - a))
  }

  if (loading && !config.updated_at) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Configuración de Vencimientos</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Link href="/dashboard/vencimientos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración de Vencimientos</h1>
            <p className="text-gray-600">Configurar parámetros del proceso automático de vencimientos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetearConfiguracion}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
          <Button 
            onClick={guardarConfiguracion} 
            disabled={!hasChanges || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Estado de Cambios */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Hay cambios sin guardar</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Períodos de Tiempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Períodos de Tiempo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dias_gracia">Días de Gracia por Defecto</Label>
              <Input
                id="dias_gracia"
                type="number"
                min="1"
                max="30"
                value={config.dias_gracia_default}
                onChange={(e) => updateConfig('dias_gracia_default', parseInt(e.target.value) || 7)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Período de gracia después del vencimiento (requerimiento: 7 días)
              </p>
            </div>
            
            <div>
              <Label>Días de Notificación Previa</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {config.dias_notificacion_previa.map((dias, index) => (
                  <Input
                    key={index}
                    type="number"
                    min="1"
                    max="30"
                    value={dias}
                    onChange={(e) => updateDiasNotificacion(index, parseInt(e.target.value) || 1)}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Días antes del vencimiento para enviar recordatorios
              </p>
            </div>
            
            <div>
              <Label htmlFor="extension_maxima">Extensión Máxima de Gracia (días)</Label>
              <Input
                id="extension_maxima"
                type="number"
                min="1"
                max="60"
                value={config.dias_extension_maxima}
                onChange={(e) => updateConfig('dias_extension_maxima', parseInt(e.target.value) || 14)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Automatización */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Automatización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatizar Proceso Completo</Label>
                <p className="text-xs text-gray-500">Ejecutar verificaciones diarias automáticas</p>
              </div>
              <Switch
                checked={config.automatizar_proceso}
                onCheckedChange={(checked) => updateConfig('automatizar_proceso', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Crear Remates Automáticamente</Label>
                <p className="text-xs text-gray-500">Crear remates al finalizar período de gracia</p>
              </div>
              <Switch
                checked={config.crear_remates_automatico}
                onCheckedChange={(checked) => updateConfig('crear_remates_automatico', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Enviar Notificaciones Automáticas</Label>
                <p className="text-xs text-gray-500">Recordatorios automáticos según configuración</p>
              </div>
              <Switch
                checked={config.enviar_notificaciones_automatico}
                onCheckedChange={(checked) => updateConfig('enviar_notificaciones_automatico', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Canales de Notificación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Canales de Notificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <Label>WhatsApp Business</Label>
              </div>
              <Switch
                checked={config.canales_activos.whatsapp}
                onCheckedChange={(checked) => updateNestedConfig('canales_activos', 'whatsapp', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <Label>SMS</Label>
              </div>
              <Switch
                checked={config.canales_activos.sms}
                onCheckedChange={(checked) => updateNestedConfig('canales_activos', 'sms', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-600" />
                <Label>Email</Label>
              </div>
              <Switch
                checked={config.canales_activos.email}
                onCheckedChange={(checked) => updateNestedConfig('canales_activos', 'email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-600" />
                <Label>Llamada Telefónica</Label>
              </div>
              <Switch
                checked={config.canales_activos.llamada}
                onCheckedChange={(checked) => updateNestedConfig('canales_activos', 'llamada', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Horarios de Envío */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Horarios de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horario_inicio">Hora de Inicio</Label>
                <Input
                  id="horario_inicio"
                  type="time"
                  value={config.horario_inicio}
                  onChange={(e) => updateConfig('horario_inicio', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horario_fin">Hora de Fin</Label>
                <Input
                  id="horario_fin"
                  type="time"
                  value={config.horario_fin}
                  onChange={(e) => updateConfig('horario_fin', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Solo Días Laborables</Label>
                <p className="text-xs text-gray-500">Lunes a Viernes únicamente</p>
              </div>
              <Switch
                checked={config.dias_laborables_solo}
                onCheckedChange={(checked) => updateConfig('dias_laborables_solo', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Criterios de Priorización */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Criterios de Priorización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Priorizar por Monto</Label>
                <p className="text-xs text-gray-500">Montos altos tienen prioridad</p>
              </div>
              <Switch
                checked={config.priorizar_por_monto}
                onCheckedChange={(checked) => updateConfig('priorizar_por_monto', checked)}
              />
            </div>
            
            {config.priorizar_por_monto && (
              <div>
                <Label htmlFor="monto_minimo">Monto Mínimo Prioridad Alta (S/)</Label>
                <Input
                  id="monto_minimo"
                  type="number"
                  min="0"
                  step="100"
                  value={config.monto_minimo_prioridad_alta}
                  onChange={(e) => updateConfig('monto_minimo_prioridad_alta', parseFloat(e.target.value) || 0)}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Priorizar por Historial</Label>
                <p className="text-xs text-gray-500">Buenos pagadores tienen prioridad</p>
              </div>
              <Switch
                checked={config.priorizar_por_historial}
                onCheckedChange={(checked) => updateConfig('priorizar_por_historial', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Remates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Configuración de Remates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="precio_base">Precio Base (% del valor de garantía)</Label>
              <Input
                id="precio_base"
                type="number"
                min="30"
                max="100"
                value={config.precio_base_porcentaje}
                onChange={(e) => updateConfig('precio_base_porcentaje', parseInt(e.target.value) || 70)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Porcentaje del valor de garantía como precio inicial
              </p>
            </div>
            
            <div>
              <Label htmlFor="incremento_minimo">Incremento Mínimo (%)</Label>
              <Input
                id="incremento_minimo"
                type="number"
                min="1"
                max="20"
                value={config.incremento_minimo_porcentaje}
                onChange={(e) => updateConfig('incremento_minimo_porcentaje', parseInt(e.target.value) || 5)}
              />
            </div>
            
            <div>
              <Label htmlFor="duracion_remate">Duración del Remate (días)</Label>
              <Input
                id="duracion_remate"
                type="number"
                min="7"
                max="30"
                value={config.duracion_remate_dias}
                onChange={(e) => updateConfig('duracion_remate_dias', parseInt(e.target.value) || 15)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas y Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas Diarias</Label>
                <p className="text-xs text-gray-500">Resumen diario de vencimientos</p>
              </div>
              <Switch
                checked={config.alertas_diarias}
                onCheckedChange={(checked) => updateConfig('alertas_diarias', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Reporte Semanal</Label>
                <p className="text-xs text-gray-500">Análisis semanal de performance</p>
              </div>
              <Switch
                checked={config.reporte_semanal}
                onCheckedChange={(checked) => updateConfig('reporte_semanal', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar Gerencia</Label>
                <p className="text-xs text-gray-500">Alertas críticas a gerencia</p>
              </div>
              <Switch
                checked={config.notificar_gerencia}
                onCheckedChange={(checked) => updateConfig('notificar_gerencia', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de la Configuración */}
      {config.updated_at && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">
                Configuración guardada exitosamente el {new Date(config.updated_at).toLocaleString('es-PE')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
