import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Endpoint para procesar mensajes WhatsApp programados
// Este endpoint debe ser llamado por un cron job cada 5-10 minutos

export async function GET() {
  try {
    const supabase = createClient()
    
    // Obtener mensajes pendientes que ya es hora de enviar
    const ahora = new Date()
    
    const { data: mensajesPendientes, error } = await supabase
      .from('mensajes_whatsapp')
      .select('*')
      .eq('estado', 'pendiente')
      .lte('programado_para', ahora.toISOString())
      .order('programado_para', { ascending: true })
      .limit(50) // Procesar máximo 50 por vez para evitar timeout

    if (error) {
      console.error('Error obteniendo mensajes pendientes:', error)
      return NextResponse.json(
        { success: false, error: 'Error al obtener mensajes' },
        { status: 500 }
      )
    }

    if (!mensajesPendientes || mensajesPendientes.length === 0) {
      return NextResponse.json({
        success: true,
        procesados: 0,
        mensaje: 'No hay mensajes pendientes para procesar'
      })
    }

    let procesados = 0
    let enviados = 0
    let errores = 0

    // Procesar cada mensaje
    for (const mensaje of mensajesPendientes) {
      try {
        procesados++
        
        // Marcar como en proceso
        await supabase
          .from('mensajes_whatsapp')
          .update({ estado: 'procesando' })
          .eq('id', mensaje.id)

        // Enviar mensaje
        const resultado = await enviarMensajeDirecto(mensaje)
        
        if (resultado.success) {
          // Actualizar como enviado
          await supabase
            .from('mensajes_whatsapp')
            .update({
              estado: 'enviado',
              fecha_enviado: new Date().toISOString(),
              webhook_id: resultado.webhook_id
            })
            .eq('id', mensaje.id)
          
          enviados++
          console.log(`✅ Mensaje enviado: ${mensaje.telefono} - ${mensaje.tipo_mensaje}`)
        } else {
          // Marcar como error
          await supabase
            .from('mensajes_whatsapp')
            .update({
              estado: 'error',
              error_mensaje: resultado.error
            })
            .eq('id', mensaje.id)
          
          errores++
          console.error(`❌ Error enviando mensaje ${mensaje.id}:`, resultado.error)
        }

      } catch (error) {
        errores++
        console.error(`❌ Error procesando mensaje ${mensaje.id}:`, error)
        
        // Marcar como error
        await supabase
          .from('mensajes_whatsapp')
          .update({
            estado: 'error',
            error_mensaje: error instanceof Error ? error.message : 'Error desconocido'
          })
          .eq('id', mensaje.id)
      }
    }

    return NextResponse.json({
      success: true,
      procesados,
      enviados,
      errores,
      timestamp: ahora.toISOString()
    })

  } catch (error) {
    console.error('Error en cron WhatsApp:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// También permitir POST para testing manual
export async function POST() {
  return GET()
}

// Función para enviar mensaje directamente a WhatsApp API
async function enviarMensajeDirecto(mensaje: any): Promise<{success: boolean, webhook_id?: string, error?: string}> {
  try {
    // Usar la misma lógica que el endpoint /api/whatsapp/enviar
    // pero sin guardar en BD (ya está guardado)
    
    // OPCIÓN 1: WhatsApp Business API oficial
    if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      return await enviarWhatsAppOficial(mensaje.telefono, mensaje.mensaje)
    }
    
    // OPCIÓN 2: Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      return await enviarWhatsAppTwilio(mensaje.telefono, mensaje.mensaje)
    }
    
    // OPCIÓN 3: Mock para desarrollo
    return enviarWhatsAppMock(mensaje.telefono, mensaje.mensaje)

  } catch (error) {
    console.error('Error enviando mensaje directo:', error)
    return {
      success: false,
      error: 'Error de conexión con WhatsApp API'
    }
  }
}

// WhatsApp Business API oficial
async function enviarWhatsAppOficial(telefono: string, mensaje: string): Promise<{success: boolean, webhook_id?: string, error?: string}> {
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
  
  const payload = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'text',
    text: {
      body: mensaje
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (response.ok) {
    const result = await response.json()
    return {
      success: true,
      webhook_id: result.messages?.[0]?.id
    }
  } else {
    const error = await response.json()
    return {
      success: false,
      error: error.error?.message || 'Error de WhatsApp API'
    }
  }
}

// Twilio WhatsApp API
async function enviarWhatsAppTwilio(telefono: string, mensaje: string): Promise<{success: boolean, webhook_id?: string, error?: string}> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

  const params = new URLSearchParams({
    From: fromNumber,
    To: `whatsapp:${telefono}`,
    Body: mensaje
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params
  })

  if (response.ok) {
    const result = await response.json()
    return {
      success: true,
      webhook_id: result.sid
    }
  } else {
    const error = await response.json()
    return {
      success: false,
      error: error.message || 'Error de Twilio API'
    }
  }
}

// Mock para desarrollo
function enviarWhatsAppMock(telefono: string, mensaje: string): Promise<{success: boolean, webhook_id?: string, error?: string}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular 95% éxito
      const exito = Math.random() > 0.05
      
      if (exito) {
        console.log(`📱 CRON WhatsApp Mock enviado a ${telefono}:`)
        console.log(mensaje.substring(0, 100) + (mensaje.length > 100 ? '...' : ''))
        console.log('---')
        
        resolve({
          success: true,
          webhook_id: `cron_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      } else {
        resolve({
          success: false,
          error: 'Error simulado de conexión'
        })
      }
    }, 500 + Math.random() * 1000) // Simular delay API
  })
}
