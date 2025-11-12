import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enviarMensajeWhatsApp } from '@/lib/api/whatsapp'

export async function POST(request: Request) {
  try {
    const { creditoId } = await request.json()

    if (!creditoId) {
      return NextResponse.json(
        { success: false, error: 'ID de crédito requerido' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Obtener crédito con cliente y cuotas pendientes
    const { data: credito, error: creditoError } = await supabase
      .from('creditos')
      .select(`
        id,
        codigo,
        clientes!inner (
          id,
          nombres,
          apellido_paterno,
          apellido_materno,
          celular,
          telefono
        ),
        cronograma_pagos!inner (
          id,
          numero_cuota,
          monto_cuota,
          fecha_vencimiento,
          estado
        )
      `)
      .eq('id', creditoId)
      .eq('cronograma_pagos.estado', 'pendiente')
      .single()

    if (creditoError || !credito) {
      return NextResponse.json(
        { success: false, error: 'Crédito no encontrado' },
        { status: 404 }
      )
    }

    const cliente = credito.clientes
    const telefono = cliente.celular || cliente.telefono

    if (!telefono) {
      return NextResponse.json(
        { success: false, error: 'Cliente no tiene teléfono registrado' },
        { status: 400 }
      )
    }

    const nombreCliente = `${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno || ''}`.trim()
    let recordatoriosProgramados = 0

    // Programar recordatorios para cada cuota pendiente
    for (const cuota of credito.cronograma_pagos) {
      const fechaVencimiento = new Date(cuota.fecha_vencimiento)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0) // Resetear horas para comparar solo fechas

      // Calcular fechas de recordatorios
      const fecha7Dias = new Date(fechaVencimiento)
      fecha7Dias.setDate(fecha7Dias.getDate() - 7)

      const fecha3Dias = new Date(fechaVencimiento)
      fecha3Dias.setDate(fecha3Dias.getDate() - 3)

      const fechaHoy = new Date(fechaVencimiento)

      // Fecha de gracia (1 semana después de vencimiento)
      const fechaGracia = new Date(fechaVencimiento)
      fechaGracia.setDate(fechaGracia.getDate() + 7)

      // Variables comunes
      const variables = {
        nombre_cliente: nombreCliente,
        codigo_credito: credito.codigo,
        monto_cuota: cuota.monto_cuota.toFixed(2),
        fecha_vencimiento: fechaVencimiento.toLocaleDateString('es-PE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        fecha_limite_gracia: fechaGracia.toLocaleDateString('es-PE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      }

      // Recordatorio 7 días antes (si aún no ha pasado)
      if (fecha7Dias >= hoy) {
        await programarRecordatorio({
          cliente_id: cliente.id,
          telefono,
          plantilla_id: 'recordatorio_7_dias',
          variables,
          fecha_envio: fecha7Dias
        })
        recordatoriosProgramados++
      }

      // Recordatorio 3 días antes (si aún no ha pasado)
      if (fecha3Dias >= hoy) {
        await programarRecordatorio({
          cliente_id: cliente.id,
          telefono,
          plantilla_id: 'recordatorio_3_dias',
          variables,
          fecha_envio: fecha3Dias
        })
        recordatoriosProgramados++
      }

      // Recordatorio el día de vencimiento (si es hoy o futuro)
      if (fechaHoy >= hoy) {
        await programarRecordatorio({
          cliente_id: cliente.id,
          telefono,
          plantilla_id: 'recordatorio_hoy',
          variables,
          fecha_envio: fechaHoy
        })
        recordatoriosProgramados++
      }

      // Recordatorio de gracia (1 día después de vencimiento)
      const fechaRecordatorioGracia = new Date(fechaVencimiento)
      fechaRecordatorioGracia.setDate(fechaRecordatorioGracia.getDate() + 1)

      if (fechaRecordatorioGracia >= hoy) {
        await programarRecordatorio({
          cliente_id: cliente.id,
          telefono,
          plantilla_id: 'vencido_gracia',
          variables,
          fecha_envio: fechaRecordatorioGracia
        })
        recordatoriosProgramados++
      }
    }

    return NextResponse.json({
      success: true,
      programados: recordatoriosProgramados,
      credito: credito.codigo,
      cliente: nombreCliente
    })

  } catch (error) {
    console.error('Error programando recordatorios:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función helper para programar un recordatorio individual
async function programarRecordatorio({
  cliente_id,
  telefono,
  plantilla_id,
  variables,
  fecha_envio
}: {
  cliente_id: string
  telefono: string
  plantilla_id: string
  variables: Record<string, any>
  fecha_envio: Date
}): Promise<void> {
  try {
    // Configurar hora de envío (9:00 AM)
    fecha_envio.setHours(9, 0, 0, 0)

    await enviarMensajeWhatsApp({
      cliente_id,
      telefono,
      tipo_mensaje: 'recordatorio',
      plantilla_id,
      mensaje: '',
      variables,
      programado_para: fecha_envio
    })
  } catch (error) {
    console.error('Error programando recordatorio individual:', error)
    throw error
  }
}
