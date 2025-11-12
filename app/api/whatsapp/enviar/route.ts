import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { obtenerPlantilla, procesarPlantilla, formatearTelefonoWhatsApp, validarTelefonoPeruano } from '@/lib/api/whatsapp'

export async function POST(request: Request) {
  try {
    const mensaje = await request.json()

    // Validaciones básicas
    if (!mensaje.cliente_id || !mensaje.telefono || !mensaje.plantilla_id) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Validar teléfono
    if (!validarTelefonoPeruano(mensaje.telefono)) {
      return NextResponse.json(
        { success: false, error: 'Número de teléfono inválido' },
        { status: 400 }
      )
    }

    // Obtener plantilla
    const plantilla = obtenerPlantilla(mensaje.plantilla_id)
    if (!plantilla) {
      return NextResponse.json(
        { success: false, error: 'Plantilla no encontrada' },
        { status: 404 }
      )
    }

    // Procesar mensaje con variables
    const mensajeProcesado = procesarPlantilla(plantilla.template, mensaje.variables || {})
    
    // Formatear teléfono para WhatsApp
    const telefonoFormateado = formatearTelefonoWhatsApp(mensaje.telefono)

    const supabase = createClient()

    // Guardar mensaje en BD
    const mensajeData = {
      cliente_id: mensaje.cliente_id,
      telefono: telefonoFormateado,
      tipo_mensaje: mensaje.tipo_mensaje,
      plantilla_id: mensaje.plantilla_id,
      mensaje: mensajeProcesado,
      variables: mensaje.variables || {},
      adjuntos: mensaje.adjuntos || [],
      programado_para: mensaje.programado_para || new Date(),
      estado: 'pendiente'
    }

    const { data: mensajeGuardado, error: errorDB } = await supabase
      .from('mensajes_whatsapp')
      .insert([mensajeData])
      .select()
      .single()

    if (errorDB) {
      console.error('Error guardando mensaje:', errorDB)
      return NextResponse.json(
        { success: false, error: 'Error al guardar mensaje' },
        { status: 500 }
      )
    }

    // Enviar mediante WhatsApp Business API
    const resultadoEnvio = await enviarWhatsAppAPI(telefonoFormateado, mensajeProcesado, mensaje.adjuntos)

    // Actualizar estado del mensaje
    const nuevoEstado = resultadoEnvio.success ? 'enviado' : 'error'
    const { error: errorUpdate } = await supabase
      .from('mensajes_whatsapp')
      .update({ 
        estado: nuevoEstado,
        fecha_enviado: resultadoEnvio.success ? new Date() : null,
        error_mensaje: resultadoEnvio.error || null,
        webhook_id: resultadoEnvio.webhook_id || null
      })
      .eq('id', mensajeGuardado.id)

    if (errorUpdate) {
      console.error('Error actualizando estado:', errorUpdate)
    }

    return NextResponse.json({
      success: resultadoEnvio.success,
      mensaje_id: mensajeGuardado.id,
      telefono: telefonoFormateado,
      mensaje: mensajeProcesado,
      error: resultadoEnvio.error
    })

  } catch (error) {
    console.error('Error en envío WhatsApp:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para enviar a WhatsApp Business API
async function enviarWhatsAppAPI(telefono: string, mensaje: string, adjuntos?: string[]): Promise<{success: boolean, webhook_id?: string, error?: string}> {
  try {
    // OPCIÓN 1: WhatsApp Business API oficial
    if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      return await enviarWhatsAppOficial(telefono, mensaje, adjuntos)
    }
    
    // OPCIÓN 2: Servicio tercero (Twilio, etc.)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      return await enviarWhatsAppTwilio(telefono, mensaje, adjuntos)
    }
    
    // OPCIÓN 3: Mock para desarrollo/testing
    return enviarWhatsAppMock(telefono, mensaje, adjuntos)

  } catch (error) {
    console.error('Error enviando WhatsApp API:', error)
    return {
      success: false,
      error: 'Error de conexión con WhatsApp API'
    }
  }
}

// WhatsApp Business API oficial
async function enviarWhatsAppOficial(telefono: string, mensaje: string, adjuntos?: string[]): Promise<{success: boolean, webhook_id?: string, error?: string}> {
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
async function enviarWhatsAppTwilio(telefono: string, mensaje: string, adjuntos?: string[]): Promise<{success: boolean, webhook_id?: string, error?: string}> {
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

// Mock para desarrollo/testing
function enviarWhatsAppMock(telefono: string, mensaje: string, adjuntos?: string[]): Promise<{success: boolean, webhook_id?: string, error?: string}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular 95% éxito
      const exito = Math.random() > 0.05
      
      if (exito) {
        console.log(`📱 WhatsApp Mock enviado a ${telefono}:`)
        console.log(mensaje)
        console.log('---')
        
        resolve({
          success: true,
          webhook_id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      } else {
        resolve({
          success: false,
          error: 'Error simulado para testing'
        })
      }
    }, 1000 + Math.random() * 2000) // Simular delay API real
  })
}
