import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enviarMensajeWhatsApp } from '@/lib/api/whatsapp'

export async function POST(request: Request) {
  try {
    const { pagoId } = await request.json()

    if (!pagoId) {
      return NextResponse.json(
        { success: false, error: 'ID de pago requerido' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Obtener datos del pago con información del cliente y crédito
    const { data: pago, error: pagoError } = await supabase
      .from('pagos')
      .select(`
        *,
        cronograma_pagos!inner (
          creditos!inner (
            id,
            codigo,
            monto_total,
            saldo_pendiente,
            clientes!inner (
              id,
              nombres,
              apellido_paterno,
              apellido_materno,
              celular,
              telefono
            )
          )
        )
      `)
      .eq('id', pagoId)
      .single()

    if (pagoError || !pago) {
      return NextResponse.json(
        { success: false, error: 'Pago no encontrado' },
        { status: 404 }
      )
    }

    const credito = pago.cronograma_pagos.creditos
    const cliente = credito.clientes

    // Verificar que el cliente tenga teléfono
    const telefono = cliente.celular || cliente.telefono
    if (!telefono) {
      return NextResponse.json(
        { success: false, error: 'Cliente no tiene teléfono registrado' },
        { status: 400 }
      )
    }

    // Preparar variables para la plantilla
    const nombreCliente = `${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno || ''}`.trim()
    
    // Calcular si está pagado completo
    const saldoPendiente = credito.saldo_pendiente || 0
    const pagadoCompleto = saldoPendiente <= 0

    // Calcular fecha próximo pago (si aplica)
    let fechaProximoPago = ''
    if (!pagadoCompleto) {
      // Obtener siguiente cuota pendiente
      const { data: proximaCuota } = await supabase
        .from('cronograma_pagos')
        .select('fecha_vencimiento')
        .eq('credito_id', credito.id)
        .eq('estado', 'pendiente')
        .order('fecha_vencimiento', { ascending: true })
        .limit(1)
        .single()

      if (proximaCuota) {
        fechaProximoPago = new Date(proximaCuota.fecha_vencimiento).toLocaleDateString('es-PE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      }
    }

    const variables = {
      nombre_cliente: nombreCliente,
      monto_pago: pago.monto.toFixed(2),
      codigo_credito: credito.codigo,
      saldo_pendiente: saldoPendiente.toFixed(2),
      if_pagado_completo: pagadoCompleto,
      fecha_proximo_pago: fechaProximoPago
    }

    // Enviar mensaje de confirmación
    const resultado = await enviarMensajeWhatsApp({
      cliente_id: cliente.id,
      telefono: telefono,
      tipo_mensaje: 'confirmacion',
      plantilla_id: 'confirmacion_pago',
      mensaje: '', // Se genera automáticamente desde la plantilla
      variables: variables,
      programado_para: new Date(), // Enviar inmediatamente
      estado: 'pendiente'
    })

    if (resultado.success) {
      // Registrar que se envió confirmación
      await supabase
        .from('pagos')
        .update({ 
          confirmacion_whatsapp_enviada: true,
          fecha_confirmacion_whatsapp: new Date()
        })
        .eq('id', pagoId)

      return NextResponse.json({
        success: true,
        mensaje_id: resultado.mensaje_id,
        telefono: telefono,
        cliente: nombreCliente
      })
    } else {
      return NextResponse.json(
        { success: false, error: resultado.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error confirmación pago WhatsApp:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
