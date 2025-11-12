import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generarContratoPDF, obtenerContratoPDFBlob } from '@/lib/pdf/contrato-empeno'

export async function POST(request: Request) {
  try {
    const { creditoId } = await request.json()

    if (!creditoId) {
      return NextResponse.json(
        { error: 'ID de crédito requerido' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Obtener datos del crédito con relaciones
    const { data: credito, error: creditoError } = await supabase
      .from('creditos')
      .select(`
        *,
        clientes (*),
        garantias (*)
      `)
      .eq('id', creditoId)
      .single()

    if (creditoError || !credito) {
      return NextResponse.json(
        { error: 'Crédito no encontrado' },
        { status: 404 }
      )
    }

    // Generar PDF
    const pdfBlob = obtenerContratoPDFBlob(
      credito,
      credito.clientes,
      credito.garantias?.[0] // Primera garantía
    )

    // Generar nombre de archivo
    const fileName = `contrato-${credito.codigo}-${new Date().toISOString().split('T')[0]}.pdf`

    // Subir a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('contratos')
      .upload(`${credito.id}/${fileName}`, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('Error al subir contrato:', uploadError)
      return NextResponse.json(
        { error: 'Error al almacenar contrato' },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('contratos')
      .getPublicUrl(`${credito.id}/${fileName}`)

    // Registrar contrato en base de datos
    const { error: contratoError } = await supabase
      .from('contratos_generados')
      .insert({
        credito_id: creditoId,
        numero_contrato: credito.codigo,
        template_version: '1.0',
        fecha_generacion: new Date().toISOString(),
        archivo_url: urlData.publicUrl,
        estado: 'generado'
      })

    if (contratoError) {
      console.error('Error al registrar contrato:', contratoError)
    }

    return NextResponse.json({
      success: true,
      contratoUrl: urlData.publicUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('Error al generar contrato:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
