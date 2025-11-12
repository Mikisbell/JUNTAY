// WhatsApp Business API Integration
// Automatización de comunicación con clientes

interface WhatsAppMessage {
  id?: string
  cliente_id: string
  telefono: string
  tipo_mensaje: 'confirmacion' | 'recordatorio' | 'saludo' | 'notificacion'
  plantilla_id: string
  mensaje: string
  variables: Record<string, any>
  adjuntos?: string[]
  programado_para: Date
  estado: 'pendiente' | 'enviado' | 'entregado' | 'error' | 'cancelado'
  fecha_enviado?: Date
  fecha_entregado?: Date
  error_mensaje?: string
  webhook_id?: string
}

interface PlantillaWhatsApp {
  id: string
  nombre: string
  tipo: 'confirmacion' | 'recordatorio' | 'saludo' | 'notificacion'
  template: string
  variables_requeridas: string[]
  activo: boolean
  lenguaje: string
}

// Plantillas predefinidas según requerimientos cliente
export const plantillasWhatsApp: PlantillaWhatsApp[] = [
  // Confirmaciones de pago
  {
    id: 'confirmacion_pago',
    nombre: 'Confirmación de Pago',
    tipo: 'confirmacion',
    template: `✅ *PAGO RECIBIDO - JUNTAY*

Hola {{nombre_cliente}},

Confirmamos el pago recibido:
💰 Monto: S/ {{monto_pago}}
📝 Crédito: {{codigo_credito}}
💳 Saldo pendiente: S/ {{saldo_pendiente}}

{{#if_pagado_completo}}
🎉 ¡Felicitaciones! Tu crédito está al día.
{{else}}
📅 Próximo pago: {{fecha_proximo_pago}}
{{/if_pagado_completo}}

Gracias por confiar en nosotros.
*JUNTOS AVANZAMOS* 🤝`,
    variables_requeridas: ['nombre_cliente', 'monto_pago', 'codigo_credito', 'saldo_pendiente'],
    activo: true,
    lenguaje: 'es'
  },

  // Recordatorios de vencimiento
  {
    id: 'recordatorio_7_dias',
    nombre: 'Recordatorio 7 días',
    tipo: 'recordatorio',
    template: `📅 *RECORDATORIO - JUNTAY*

Hola {{nombre_cliente}},

Te recordamos que tu cuota vence en *7 días*:

💳 Crédito: {{codigo_credito}}
💰 Monto a pagar: S/ {{monto_cuota}}
📅 Fecha límite: {{fecha_vencimiento}}

Puedes pagar en nuestras oficinas o coordinar el pago llamándonos.

*JUNTOS AVANZAMOS* 🤝`,
    variables_requeridas: ['nombre_cliente', 'codigo_credito', 'monto_cuota', 'fecha_vencimiento'],
    activo: true,
    lenguaje: 'es'
  },

  {
    id: 'recordatorio_3_dias',
    nombre: 'Recordatorio 3 días',
    tipo: 'recordatorio',
    template: `⚠️ *RECORDATORIO IMPORTANTE - JUNTAY*

Hola {{nombre_cliente}},

Tu cuota vence en solo *3 días*:

💳 Crédito: {{codigo_credito}}
💰 Monto a pagar: S/ {{monto_cuota}}
📅 Fecha límite: {{fecha_vencimiento}}

Para evitar moras, te recomendamos pagar antes de la fecha límite.

*JUNTOS AVANZAMOS* 🤝`,
    variables_requeridas: ['nombre_cliente', 'codigo_credito', 'monto_cuota', 'fecha_vencimiento'],
    activo: true,
    lenguaje: 'es'
  },

  {
    id: 'recordatorio_hoy',
    nombre: 'Recordatorio Hoy',
    tipo: 'recordatorio',
    template: `🚨 *TU CUOTA VENCE HOY - JUNTAY*

Hola {{nombre_cliente}},

Tu cuota vence *HOY*:

💳 Crédito: {{codigo_credito}}
💰 Monto a pagar: S/ {{monto_cuota}}
⏰ Hasta las 6:00 PM

¡Evita intereses moratorios pagando hoy!

*JUNTOS AVANZAMOS* 🤝`,
    variables_requeridas: ['nombre_cliente', 'codigo_credito', 'monto_cuota'],
    activo: true,
    lenguaje: 'es'
  },

  // Vencimiento con gracia
  {
    id: 'vencido_gracia',
    nombre: 'Vencido con Gracia',
    tipo: 'recordatorio',
    template: `⏳ *CUOTA VENCIDA - PERIODO DE GRACIA - JUNTAY*

Hola {{nombre_cliente}},

Tu préstamo está vencido pero aún tienes *1 semana de gracia*:

💳 Crédito: {{codigo_credito}}
💰 Monto a pagar: S/ {{monto_cuota}}
⏰ Plazo de gracia hasta: {{fecha_limite_gracia}}

Después de esta fecha, la prenda pasará al proceso de venta.

¡Contáctanos para coordinar el pago!

*JUNTOS AVANZAMOS* 🤝`,
    variables_requeridas: ['nombre_cliente', 'codigo_credito', 'monto_cuota', 'fecha_limite_gracia'],
    activo: true,
    lenguaje: 'es'
  },

  // Saludos estacionales
  {
    id: 'saludo_navidad',
    nombre: 'Saludo Navidad',
    tipo: 'saludo',
    template: `🎄 *FELIZ NAVIDAD - JUNTAY*

Querido {{nombre_cliente}},

En esta Navidad, queremos agradecerte por ser parte de nuestra familia JUNTAY.

Que esta época esté llena de alegría, amor y prosperidad para ti y tu familia.

¡Feliz Navidad! 🎁✨

*JUNTOS AVANZAMOS* 🤝`,
    variables_requeridas: ['nombre_cliente'],
    activo: true,
    lenguaje: 'es'
  },

  {
    id: 'saludo_ano_nuevo',
    nombre: 'Saludo Año Nuevo',
    tipo: 'saludo',
    template: `🎊 *FELIZ AÑO NUEVO - JUNTAY*

Hola {{nombre_cliente}},

¡Te deseamos un próspero Año Nuevo 2025!

Que este año esté lleno de oportunidades, éxitos y bendiciones para ti y tu familia.

Gracias por confiar en nosotros durante todo este tiempo.

*JUNTOS AVANZAMOS* hacia un mejor año 🚀

¡Feliz 2025! 🎉`,
    variables_requeridas: ['nombre_cliente'],
    activo: true,
    lenguaje: 'es'
  }
]

// Función principal para enviar mensaje
export async function enviarMensajeWhatsApp(mensaje: Omit<WhatsAppMessage, 'id'>): Promise<{success: boolean, mensaje_id?: string, error?: string}> {
  try {
    const response = await fetch('/api/whatsapp/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mensaje)
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Error enviando WhatsApp:', error)
    return {
      success: false,
      error: 'Error de conexión al enviar WhatsApp'
    }
  }
}

// Programar recordatorios automáticos
export async function programarRecordatoriosCredito(creditoId: string): Promise<{success: boolean, programados: number, error?: string}> {
  try {
    const response = await fetch('/api/whatsapp/programar-recordatorios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creditoId })
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Error programando recordatorios:', error)
    return {
      success: false,
      programados: 0,
      error: 'Error al programar recordatorios'
    }
  }
}

// Enviar confirmación de pago inmediata
export async function enviarConfirmacionPago(pagoId: string): Promise<{success: boolean, error?: string}> {
  try {
    const response = await fetch('/api/whatsapp/confirmacion-pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pagoId })
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Error confirmación pago WhatsApp:', error)
    return {
      success: false,
      error: 'Error al enviar confirmación'
    }
  }
}

// Programar saludos estacionales
export async function programarSaludosEstacionales(): Promise<{success: boolean, programados: number, error?: string}> {
  try {
    const response = await fetch('/api/whatsapp/programar-saludos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Error programando saludos:', error)
    return {
      success: false,
      programados: 0,
      error: 'Error al programar saludos'
    }
  }
}

// Obtener plantilla por ID
export function obtenerPlantilla(plantillaId: string): PlantillaWhatsApp | null {
  return plantillasWhatsApp.find(p => p.id === plantillaId) || null
}

// Procesar plantilla con variables
export function procesarPlantilla(template: string, variables: Record<string, any>): string {
  let mensaje = template
  
  // Reemplazar variables simples {{variable}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    mensaje = mensaje.replace(regex, String(value || ''))
  })
  
  // Procesar condicionales simples {{#if_condicion}} ... {{/if_condicion}}
  mensaje = mensaje.replace(/{{#if_(\w+)}}(.*?){{else}}(.*?){{\/if_\w+}}/gs, (match, condicion, textoIf, textoElse) => {
    return variables[condicion] ? textoIf : textoElse
  })
  
  mensaje = mensaje.replace(/{{#if_(\w+)}}(.*?){{\/if_\w+}}/gs, (match, condicion, texto) => {
    return variables[condicion] ? texto : ''
  })
  
  return mensaje.trim()
}

// Validar número de teléfono peruano
export function validarTelefonoPeruano(telefono: string): boolean {
  // Celular: 9xxxxxxxx (9 dígitos empezando en 9)
  // Teléfono fijo: xxxxxxx (7 dígitos) o (01)xxxxxxx
  const celularRegex = /^9\d{8}$/
  const fijoRegex = /^(\d{7}|01\d{7})$/
  
  const numeroLimpio = telefono.replace(/[\s\-\(\)]/g, '')
  return celularRegex.test(numeroLimpio) || fijoRegex.test(numeroLimpio)
}

// Formatear teléfono para WhatsApp (agregar código país)
export function formatearTelefonoWhatsApp(telefono: string): string {
  const numeroLimpio = telefono.replace(/[\s\-\(\)]/g, '')
  
  // Si es celular peruano (9xxxxxxxx), agregar +51
  if (/^9\d{8}$/.test(numeroLimpio)) {
    return `+51${numeroLimpio}`
  }
  
  // Si ya tiene código de país, mantenerlo
  if (numeroLimpio.startsWith('51') || numeroLimpio.startsWith('+51')) {
    return numeroLimpio.startsWith('+') ? numeroLimpio : `+${numeroLimpio}`
  }
  
  // Asumir Perú por defecto
  return `+51${numeroLimpio}`
}
