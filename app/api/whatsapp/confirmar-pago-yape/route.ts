import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enviarMensajeWhatsApp } from '@/lib/api/whatsapp'

export async function POST(request: Request) {
  try {
    const { 
      credito_id, 
      monto_pago, 
      numero_operacion_yape,
      observaciones 
    } = await request.json()

    if (!credito_id || !monto_pago || !numero_operacion_yape) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos para confirmar pago YAPE' },
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

    // Registrar el pago en la tabla pagos
    const nuevoPago = {
      credito_id: credito_id,
      tipo_pago: 'CUOTA',
      metodo_pago: 'YAPE',
      monto_total: parseFloat(monto_pago),
      monto_capital: parseFloat(monto_pago), // Simplificado
      monto_interes: 0,
      monto_mora: 0,
      fecha_pago: new Date().toISOString(),
      numero_operacion: numero_operacion_yape,
      observaciones: observaciones || `Pago YAPE confirmado automáticamente - Op: ${numero_operacion_yape}`,
      registrado_por: 'SISTEMA_YAPE'
    }

    const { data: pagoCreado, error: errorPago } = await supabase
      .from('pagos')
      .insert([nuevoPago])
      .select()
      .single()

    if (errorPago) {
      console.error('Error registrando pago YAPE:', errorPago)
      return NextResponse.json(
        { success: false, error: 'Error al registrar el pago' },
        { status: 500 }
      )
    }

    // Actualizar monto pagado del crédito
    const nuevoMontoPagado = (credito.monto_pagado || 0) + parseFloat(monto_pago)
    const saldoPendiente = credito.monto_total - nuevoMontoPagado

    await supabase
      .from('creditos')
      .update({ 
        monto_pagado: nuevoMontoPagado,
        estado: saldoPendiente <= 0 ? 'PAGADO' : 'ACTIVO',
        fecha_ultimo_pago: new Date()
      })
      .eq('id', credito_id)

    // Preparar variables para confirmación WhatsApp
    const variables = {
      nombre_cliente: `${credito.clientes.nombres} ${credito.clientes.apellido_paterno}`,
      codigo_credito: credito.codigo,
      monto_pago: monto_pago,
      numero_operacion: numero_operacion_yape,
      saldo_pendiente: saldoPendiente.toFixed(2)
    }

    // Enviar confirmación por WhatsApp
    const resultadoWhatsApp = await enviarMensajeWhatsApp({
      cliente_id: credito.clientes.id,
      telefono: credito.clientes.telefono,
      tipo_mensaje: 'confirmacion',
      plantilla_id: 'confirmacion_pago_yape',
      mensaje: '', // Se genera automáticamente
      variables: variables,
      programado_para: new Date(),
      estado: 'pendiente'
    })

    return NextResponse.json({
      success: true,
      pago_id: pagoCreado.id,
      mensaje_whatsapp_id: resultadoWhatsApp.mensaje_id,
      monto_pagado: monto_pago,
      saldo_pendiente: saldoPendiente,
      estado_credito: saldoPendiente <= 0 ? 'PAGADO' : 'ACTIVO',
      confirmacion_enviada: resultadoWhatsApp.success
    })

  } catch (error) {
    console.error('Error confirmando pago YAPE:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
