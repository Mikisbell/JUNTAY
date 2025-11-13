import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enviarMensajeWhatsApp } from '@/lib/api/whatsapp'

export async function POST(request: Request) {
  try {
    const { credito_id } = await request.json()

    if (!credito_id) {
      return NextResponse.json(
        { success: false, error: 'credito_id es requerido' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Obtener datos del crédito y cliente
    const { data: credito, error: errorCredito } = await supabase
      .from('creditos')
      .select(`
        *,
        clientes (
          id,
          nombres,
          apellido_paterno,
          telefono
        )
      `)
      .eq('id', credito_id)
      .single()

    if (errorCredito || !credito) {
      return NextResponse.json(
        { success: false, error: 'Crédito no encontrado' },
        { status: 404 }
      )
    }

    // Calcular monto pendiente (simplificado - puedes mejorar el cálculo)
    const montoPendiente = credito.monto_total - (credito.monto_pagado || 0)

    if (montoPendiente <= 0) {
      return NextResponse.json(
        { success: false, error: 'Este crédito ya está pagado completamente' },
        { status: 400 }
      )
    }

    // Número YAPE de la empresa (configurable)
    const numeroYape = process.env.NUMERO_YAPE || '987654321'

    // Preparar variables para la plantilla
    const variables = {
      nombre_cliente: `${credito.clientes.nombres} ${credito.clientes.apellido_paterno}`,
      monto_cuota: montoPendiente.toFixed(2),
      numero_yape: numeroYape,
      codigo_credito: credito.codigo
    }

    // Enviar mensaje WhatsApp con solicitud de pago YAPE
    const resultado = await enviarMensajeWhatsApp({
      cliente_id: credito.clientes.id,
      telefono: credito.clientes.telefono,
      tipo_mensaje: 'notificacion',
      plantilla_id: 'solicitud_pago_yape',
      mensaje: '', // Se genera automáticamente desde la plantilla
      variables: variables,
      programado_para: new Date(), // Enviar inmediatamente
      estado: 'pendiente'
    })

    if (resultado.success) {
      // Registrar que se envió solicitud de pago
      await supabase
        .from('creditos')
        .update({ 
          solicitud_pago_enviada: true,
          fecha_solicitud_pago: new Date(),
          metodo_pago_solicitado: 'YAPE'
        })
        .eq('id', credito_id)

      return NextResponse.json({
        success: true,
        mensaje_id: resultado.mensaje_id,
        telefono: credito.clientes.telefono,
        monto_solicitado: montoPendiente,
        numero_yape: numeroYape,
        codigo_credito: credito.codigo
      })
    } else {
      return NextResponse.json(
        { success: false, error: resultado.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error solicitud pago YAPE:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
