'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Bell,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

interface WhatsAppIntegrationProps {
  creditoId?: string
  pagoId?: string
  clienteId?: string
  tipo: 'confirmacion_pago' | 'programar_recordatorios' | 'enviar_personalizado'
  className?: string
  autoEnviar?: boolean
}

interface EstadoWhatsApp {
  estado: 'inicial' | 'enviando' | 'enviado' | 'error' | 'programado'
  mensaje?: string
  error?: string
  detalles?: any
}

export function WhatsAppIntegration({
  creditoId,
  pagoId,
  clienteId,
  tipo,
  className = '',
  autoEnviar = false
}: WhatsAppIntegrationProps) {
  const [estado, setEstado] = useState<EstadoWhatsApp>({ estado: 'inicial' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (autoEnviar) {
      handleEnviarAutomatico()
    }
  }, [autoEnviar])

  const handleEnviarAutomatico = async () => {
    if (tipo === 'confirmacion_pago' && pagoId) {
      await enviarConfirmacionPago()
    } else if (tipo === 'programar_recordatorios' && creditoId) {
      await programarRecordatorios()
    }
  }

  const enviarConfirmacionPago = async () => {
    if (!pagoId) {
      toast.error('ID de pago requerido')
      return
    }

    setLoading(true)
    setEstado({ estado: 'enviando' })

    try {
      const response = await fetch('/api/whatsapp/confirmacion-pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pagoId })
      })

      const result = await response.json()

      if (result.success) {
        setEstado({
          estado: 'enviado',
          mensaje: `Confirmación enviada a ${result.cliente}`,
          detalles: {
            telefono: result.telefono,
            mensaje_id: result.mensaje_id
          }
        })
        toast.success(`✅ Confirmación WhatsApp enviada a ${result.cliente}`)
      } else {
        setEstado({
          estado: 'error',
          error: result.error || 'Error al enviar confirmación'
        })
        toast.error('Error al enviar confirmación WhatsApp')
      }

    } catch (error) {
      console.error('Error confirmación WhatsApp:', error)
      setEstado({
        estado: 'error',
        error: 'Error de conexión'
      })
      toast.error('Error de conexión WhatsApp')
    } finally {
      setLoading(false)
    }
  }

  const programarRecordatorios = async () => {
    if (!creditoId) {
      toast.error('ID de crédito requerido')
      return
    }

    setLoading(true)
    setEstado({ estado: 'enviando' })

    try {
      const response = await fetch('/api/whatsapp/programar-recordatorios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creditoId })
      })

      const result = await response.json()

      if (result.success) {
        setEstado({
          estado: 'programado',
          mensaje: `${result.programados} recordatorios programados para ${result.cliente}`,
          detalles: {
            programados: result.programados,
            credito: result.credito,
            cliente: result.cliente
          }
        })
        toast.success(`📅 ${result.programados} recordatorios programados`)
      } else {
        setEstado({
          estado: 'error',
          error: result.error || 'Error al programar recordatorios'
        })
        toast.error('Error al programar recordatorios')
      }

    } catch (error) {
      console.error('Error programando recordatorios:', error)
      setEstado({
        estado: 'error',
        error: 'Error de conexión'
      })
      toast.error('Error de conexión WhatsApp')
    } finally {
      setLoading(false)
    }
  }

  const obtenerIconoEstado = () => {
    switch (estado.estado) {
      case 'enviando': return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'enviado': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'programado': return <Calendar className="h-4 w-4 text-blue-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <MessageCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const obtenerColorCard = () => {
    switch (estado.estado) {
      case 'enviado': return 'border-green-200 bg-green-50'
      case 'programado': return 'border-blue-200 bg-blue-50'
      case 'error': return 'border-red-200 bg-red-50'
      case 'enviando': return 'border-blue-300 bg-blue-50'
      default: return 'border-gray-200'
    }
  }

  const obtenerTextoAccion = () => {
    switch (tipo) {
      case 'confirmacion_pago': return loading ? 'Enviando confirmación...' : 'Enviar confirmación'
      case 'programar_recordatorios': return loading ? 'Programando recordatorios...' : 'Programar recordatorios'
      case 'enviar_personalizado': return loading ? 'Enviando mensaje...' : 'Enviar mensaje'
      default: return 'Enviar WhatsApp'
    }
  }

  const handleAccion = () => {
    switch (tipo) {
      case 'confirmacion_pago':
        enviarConfirmacionPago()
        break
      case 'programar_recordatorios':
        programarRecordatorios()
        break
      default:
        toast.info('Funcionalidad no implementada')
    }
  }

  return (
    <Card className={`${obtenerColorCard()} ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {obtenerIconoEstado()}
          WhatsApp Automático
          {estado.estado === 'enviado' && <Badge variant="secondary" className="bg-green-100 text-green-800">Enviado</Badge>}
          {estado.estado === 'programado' && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Programado</Badge>}
          {estado.estado === 'error' && <Badge variant="destructive">Error</Badge>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Mensaje de estado */}
        {estado.mensaje && (
          <div className="text-sm text-gray-700">
            ✅ {estado.mensaje}
          </div>
        )}

        {/* Error */}
        {estado.error && (
          <div className="text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200">
            ❌ {estado.error}
          </div>
        )}

        {/* Detalles */}
        {estado.detalles && (
          <div className="text-xs text-gray-600 space-y-1">
            {estado.detalles.telefono && (
              <div>📱 {estado.detalles.telefono}</div>
            )}
            {estado.detalles.programados !== undefined && (
              <div>📅 {estado.detalles.programados} recordatorios</div>
            )}
            {estado.detalles.credito && (
              <div>💳 {estado.detalles.credito}</div>
            )}
          </div>
        )}

        {/* Botón de acción */}
        {!autoEnviar && estado.estado === 'inicial' && (
          <Button
            onClick={handleAccion}
            disabled={loading}
            size="sm"
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {obtenerTextoAccion()}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {obtenerTextoAccion()}
              </>
            )}
          </Button>
        )}

        {/* Botón reintentar */}
        {estado.estado === 'error' && (
          <Button
            onClick={handleAccion}
            disabled={loading}
            size="sm"
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Reintentando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Reintentar
              </>
            )}
          </Button>
        )}

        {/* Info del tipo */}
        <div className="text-xs text-gray-500 mt-2">
          {tipo === 'confirmacion_pago' && '💰 Confirmación automática de pago recibido'}
          {tipo === 'programar_recordatorios' && '📅 Recordatorios automáticos de vencimiento'}
          {tipo === 'enviar_personalizado' && '✉️ Mensaje personalizado'}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente específico para confirmaciones de pago
export function WhatsAppConfirmacionPago({
  pagoId,
  autoEnviar = false,
  className = ''
}: {
  pagoId: string
  autoEnviar?: boolean
  className?: string
}) {
  return (
    <WhatsAppIntegration
      pagoId={pagoId}
      tipo="confirmacion_pago"
      autoEnviar={autoEnviar}
      className={className}
    />
  )
}

// Componente específico para recordatorios
export function WhatsAppRecordatorios({
  creditoId,
  autoEnviar = false,
  className = ''
}: {
  creditoId: string
  autoEnviar?: boolean
  className?: string
}) {
  return (
    <WhatsAppIntegration
      creditoId={creditoId}
      tipo="programar_recordatorios"
      autoEnviar={autoEnviar}
      className={className}
    />
  )
}
