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
  Brain, 
  Zap,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Database,
  Eye,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ConfiguracionIA {
  // Configuración General
  precision_minima: number
  confianza_minima: number
  tiempo_maximo_procesamiento: number
  
  // Modelos Activos
  modelos_activos: {
    joyas: boolean
    electronicos: boolean
    vehiculos: boolean
    general: boolean
  }
  
  // Configuración de Análisis
  analisis_automatico: boolean
  revision_manual_requerida: boolean
  umbral_revision_manual: number
  
  // Configuración de Imágenes
  calidad_minima_imagen: number
  max_imagenes_por_analisis: number
  formatos_permitidos: string[]
  
  // Integración con Mercado
  fuentes_precios_activas: string[]
  actualizacion_precios_horas: number
  margen_error_precios: number
  
  // Configuración Avanzada
  learning_rate_default: number
  batch_size_default: number
  epocas_entrenamiento: number
  
  // Notificaciones
  notificar_baja_confianza: boolean
  notificar_entrenamiento_completado: boolean
  notificar_errores: boolean
  
  // Seguridad
  backup_automatico: boolean
  logs_detallados: boolean
  auditoria_decisiones: boolean
  
  updated_at?: string
}

export default function ConfiguracionIAPage() {
  const [config, setConfig] = useState<ConfiguracionIA>({
    // Valores por defecto
    precision_minima: 85.0,
    confianza_minima: 75.0,
    tiempo_maximo_procesamiento: 30,
    
    modelos_activos: {
      joyas: true,
      electronicos: true,
      vehiculos: false,
      general: true
    },
    
    analisis_automatico: true,
    revision_manual_requerida: true,
    umbral_revision_manual: 70.0,
    
    calidad_minima_imagen: 80.0,
    max_imagenes_por_analisis: 5,
    formatos_permitidos: ['jpg', 'jpeg', 'png', 'webp'],
    
    fuentes_precios_activas: ['MercadoLibre', 'OLX', 'Joyerías Lima'],
    actualizacion_precios_horas: 24,
    margen_error_precios: 15.0,
    
    learning_rate_default: 0.001,
    batch_size_default: 32,
    epocas_entrenamiento: 100,
    
    notificar_baja_confianza: true,
    notificar_entrenamiento_completado: true,
    notificar_errores: true,
    
    backup_automatico: true,
    logs_detallados: true,
    auditoria_decisiones: true
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
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Error cargando configuración:', error)
      toast.error('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = (field: keyof ConfiguracionIA, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateNestedConfig = (parent: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ConfiguracionIA] as any,
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const guardarConfiguracion = async () => {
    try {
      setLoading(true)
      
      // Validaciones
      if (config.precision_minima < 50 || config.precision_minima > 100) {
        toast.error('La precisión mínima debe estar entre 50% y 100%')
        return
      }
      
      if (config.confianza_minima < 50 || config.confianza_minima > 100) {
        toast.error('La confianza mínima debe estar entre 50% y 100%')
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
      precision_minima: 85.0,
      confianza_minima: 75.0,
      tiempo_maximo_procesamiento: 30,
      
      modelos_activos: {
        joyas: true,
        electronicos: true,
        vehiculos: false,
        general: true
      },
      
      analisis_automatico: true,
      revision_manual_requerida: true,
      umbral_revision_manual: 70.0,
      
      calidad_minima_imagen: 80.0,
      max_imagenes_por_analisis: 5,
      formatos_permitidos: ['jpg', 'jpeg', 'png', 'webp'],
      
      fuentes_precios_activas: ['MercadoLibre', 'OLX', 'Joyerías Lima'],
      actualizacion_precios_horas: 24,
      margen_error_precios: 15.0,
      
      learning_rate_default: 0.001,
      batch_size_default: 32,
      epocas_entrenamiento: 100,
      
      notificar_baja_confianza: true,
      notificar_entrenamiento_completado: true,
      notificar_errores: true,
      
      backup_automatico: true,
      logs_detallados: true,
      auditoria_decisiones: true
    })
    
    setHasChanges(true)
    toast.success('Configuración restablecida a valores por defecto')
  }

  const toggleFuentePrecio = (fuente: string) => {
    const fuentesActuales = config.fuentes_precios_activas
    const nuevasFuentes = fuentesActuales.includes(fuente)
      ? fuentesActuales.filter(f => f !== fuente)
      : [...fuentesActuales, fuente]
    
    updateConfig('fuentes_precios_activas', nuevasFuentes)
  }

  const toggleFormato = (formato: string) => {
    const formatosActuales = config.formatos_permitidos
    const nuevosFormatos = formatosActuales.includes(formato)
      ? formatosActuales.filter(f => f !== formato)
      : [...formatosActuales, formato]
    
    updateConfig('formatos_permitidos', nuevosFormatos)
  }

  if (loading && !config.updated_at) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Configuración IA</h1>
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
          <Link href="/dashboard/ia-valuacion">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración IA</h1>
            <p className="text-gray-600">Ajustar parámetros del sistema de valuación inteligente</p>
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
        {/* Configuración General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="precision_minima">Precisión Mínima (%)</Label>
              <Input
                id="precision_minima"
                type="number"
                min="50"
                max="100"
                step="0.1"
                value={config.precision_minima}
                onChange={(e) => updateConfig('precision_minima', parseFloat(e.target.value) || 85)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Precisión mínima requerida para aprobar automáticamente
              </p>
            </div>
            
            <div>
              <Label htmlFor="confianza_minima">Confianza Mínima (%)</Label>
              <Input
                id="confianza_minima"
                type="number"
                min="50"
                max="100"
                step="0.1"
                value={config.confianza_minima}
                onChange={(e) => updateConfig('confianza_minima', parseFloat(e.target.value) || 75)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nivel de confianza mínimo para procesar automáticamente
              </p>
            </div>
            
            <div>
              <Label htmlFor="tiempo_maximo">Tiempo Máximo de Procesamiento (segundos)</Label>
              <Input
                id="tiempo_maximo"
                type="number"
                min="5"
                max="300"
                value={config.tiempo_maximo_procesamiento}
                onChange={(e) => updateConfig('tiempo_maximo_procesamiento', parseInt(e.target.value) || 30)}
              />
            </div>
            
            <div>
              <Label htmlFor="umbral_revision">Umbral para Revisión Manual (%)</Label>
              <Input
                id="umbral_revision"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={config.umbral_revision_manual}
                onChange={(e) => updateConfig('umbral_revision_manual', parseFloat(e.target.value) || 70)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Confianza por debajo de este valor requiere revisión manual
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modelos Activos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Modelos Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Modelo de Joyas</Label>
                <p className="text-xs text-gray-500">JoyasNet v4.0 - Precisión: 94.5%</p>
              </div>
              <Switch
                checked={config.modelos_activos.joyas}
                onCheckedChange={(checked: boolean) => updateNestedConfig('modelos_activos', 'joyas', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Modelo de Electrónicos</Label>
                <p className="text-xs text-gray-500">TechVision v3.0 - Precisión: 91.2%</p>
              </div>
              <Switch
                checked={config.modelos_activos.electronicos}
                onCheckedChange={(checked: boolean) => updateNestedConfig('modelos_activos', 'electronicos', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Modelo de Vehículos</Label>
                <p className="text-xs text-gray-500">AutoDetect v2.0 - Precisión: 88.7%</p>
              </div>
              <Switch
                checked={config.modelos_activos.vehiculos}
                onCheckedChange={(checked: boolean) => updateNestedConfig('modelos_activos', 'vehiculos', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Modelo General</Label>
                <p className="text-xs text-gray-500">GeneralAI v4.1 - Precisión: 85.3%</p>
              </div>
              <Switch
                checked={config.modelos_activos.general}
                onCheckedChange={(checked: boolean) => updateNestedConfig('modelos_activos', 'general', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Análisis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Configuración de Análisis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Análisis Automático</Label>
                <p className="text-xs text-gray-500">Procesar imágenes automáticamente al subirlas</p>
              </div>
              <Switch
                checked={config.analisis_automatico}
                onCheckedChange={(checked: boolean) => updateConfig('analisis_automatico', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Revisión Manual Requerida</Label>
                <p className="text-xs text-gray-500">Siempre requerir aprobación manual</p>
              </div>
              <Switch
                checked={config.revision_manual_requerida}
                onCheckedChange={(checked: boolean) => updateConfig('revision_manual_requerida', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="calidad_imagen">Calidad Mínima de Imagen (%)</Label>
              <Input
                id="calidad_imagen"
                type="number"
                min="50"
                max="100"
                value={config.calidad_minima_imagen}
                onChange={(e) => updateConfig('calidad_minima_imagen', parseFloat(e.target.value) || 80)}
              />
            </div>
            
            <div>
              <Label htmlFor="max_imagenes">Máximo de Imágenes por Análisis</Label>
              <Input
                id="max_imagenes"
                type="number"
                min="1"
                max="20"
                value={config.max_imagenes_por_analisis}
                onChange={(e) => updateConfig('max_imagenes_por_analisis', parseInt(e.target.value) || 5)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Precios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Integración con Mercado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Fuentes de Precios Activas</Label>
              <div className="space-y-2">
                {['MercadoLibre', 'OLX', 'Joyerías Lima', 'Ripley', 'Saga Falabella'].map((fuente) => (
                  <div key={fuente} className="flex items-center justify-between">
                    <Label>{fuente}</Label>
                    <Switch
                      checked={config.fuentes_precios_activas.includes(fuente)}
                      onCheckedChange={() => toggleFuentePrecio(fuente)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="actualizacion_precios">Actualización de Precios (horas)</Label>
              <Input
                id="actualizacion_precios"
                type="number"
                min="1"
                max="168"
                value={config.actualizacion_precios_horas}
                onChange={(e) => updateConfig('actualizacion_precios_horas', parseInt(e.target.value) || 24)}
              />
            </div>
            
            <div>
              <Label htmlFor="margen_error">Margen de Error en Precios (%)</Label>
              <Input
                id="margen_error"
                type="number"
                min="5"
                max="50"
                step="0.1"
                value={config.margen_error_precios}
                onChange={(e) => updateConfig('margen_error_precios', parseFloat(e.target.value) || 15)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración Avanzada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración Avanzada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="learning_rate">Learning Rate por Defecto</Label>
              <Input
                id="learning_rate"
                type="number"
                min="0.0001"
                max="0.1"
                step="0.0001"
                value={config.learning_rate_default}
                onChange={(e) => updateConfig('learning_rate_default', parseFloat(e.target.value) || 0.001)}
              />
            </div>
            
            <div>
              <Label htmlFor="batch_size">Batch Size por Defecto</Label>
              <Input
                id="batch_size"
                type="number"
                min="8"
                max="128"
                step="8"
                value={config.batch_size_default}
                onChange={(e) => updateConfig('batch_size_default', parseInt(e.target.value) || 32)}
              />
            </div>
            
            <div>
              <Label htmlFor="epocas">Épocas de Entrenamiento</Label>
              <Input
                id="epocas"
                type="number"
                min="10"
                max="500"
                value={config.epocas_entrenamiento}
                onChange={(e) => updateConfig('epocas_entrenamiento', parseInt(e.target.value) || 100)}
              />
            </div>
            
            <div>
              <Label className="text-base font-semibold mb-3 block">Formatos de Imagen Permitidos</Label>
              <div className="flex gap-2 flex-wrap">
                {['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'].map((formato) => (
                  <Button
                    key={formato}
                    variant={config.formatos_permitidos.includes(formato) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleFormato(formato)}
                  >
                    .{formato}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones y Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Notificaciones y Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar Baja Confianza</Label>
                <p className="text-xs text-gray-500">Alertar cuando la confianza sea baja</p>
              </div>
              <Switch
                checked={config.notificar_baja_confianza}
                onCheckedChange={(checked: boolean) => updateConfig('notificar_baja_confianza', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar Entrenamiento Completado</Label>
                <p className="text-xs text-gray-500">Alertar cuando termine el entrenamiento</p>
              </div>
              <Switch
                checked={config.notificar_entrenamiento_completado}
                onCheckedChange={(checked: boolean) => updateConfig('notificar_entrenamiento_completado', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar Errores</Label>
                <p className="text-xs text-gray-500">Alertar sobre errores del sistema</p>
              </div>
              <Switch
                checked={config.notificar_errores}
                onCheckedChange={(checked: boolean) => updateConfig('notificar_errores', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Automático</Label>
                <p className="text-xs text-gray-500">Respaldar modelos automáticamente</p>
              </div>
              <Switch
                checked={config.backup_automatico}
                onCheckedChange={(checked: boolean) => updateConfig('backup_automatico', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Logs Detallados</Label>
                <p className="text-xs text-gray-500">Registrar información detallada</p>
              </div>
              <Switch
                checked={config.logs_detallados}
                onCheckedChange={(checked: boolean) => updateConfig('logs_detallados', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auditoría de Decisiones</Label>
                <p className="text-xs text-gray-500">Registrar todas las decisiones de IA</p>
              </div>
              <Switch
                checked={config.auditoria_decisiones}
                onCheckedChange={(checked: boolean) => updateConfig('auditoria_decisiones', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

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
