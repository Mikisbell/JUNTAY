import { createClient } from '@/lib/supabase/server'

export interface EvaluacionCredito {
  id?: string
  cliente_id: string
  evaluado_por?: string
  fecha_evaluacion: string
  score_calculado?: number
  limite_recomendado?: number
  observaciones?: string
  factores_positivos?: string
  factores_negativos?: string
  recomendacion: 'aprobar' | 'rechazar' | 'aprobar_con_condiciones'
  condiciones_especiales?: string
  vigente_hasta?: string
  created_at?: string

  // Relaciones
  cliente?: any
  usuario?: any
}

export async function getEvaluaciones(cliente_id?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('evaluaciones_credito')
    .select(`
      *, 
      clientes(nombres, apellido_paterno, numero_documento),
      usuarios(nombres, apellidos)
    `)
    .order('created_at', { ascending: false })
  
  if (cliente_id) {
    query = query.eq('cliente_id', cliente_id)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching evaluaciones:', error)
    return []
  }
  
  return data as EvaluacionCredito[]
}

export async function getEvaluacionById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('evaluaciones_credito')
    .select(`
      *, 
      clientes(*),
      usuarios(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching evaluación:', error)
    return null
  }
  
  return data as EvaluacionCredito
}

export async function crearEvaluacion(evaluacionData: Partial<EvaluacionCredito>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('evaluaciones_credito')
    .insert([{
      ...evaluacionData,
      fecha_evaluacion: evaluacionData.fecha_evaluacion || new Date().toISOString().split('T')[0]
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creando evaluación:', error)
    throw error
  }
  
  // Actualizar el score del cliente
  if (data.score_calculado && data.cliente_id) {
    await actualizarScoreCliente(data.cliente_id, data.score_calculado, data.limite_recomendado)
  }
  
  return data as EvaluacionCredito
}

export async function actualizarEvaluacion(id: string, updates: Partial<EvaluacionCredito>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('evaluaciones_credito')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error actualizando evaluación:', error)
    throw error
  }
  
  return data as EvaluacionCredito
}

async function actualizarScoreCliente(cliente_id: string, score: number, limite?: number) {
  const supabase = createClient()
  
  const updates: any = {
    score_crediticio: score,
    fecha_ultima_evaluacion: new Date().toISOString().split('T')[0]
  }
  
  if (limite) {
    updates.limite_credito_aprobado = limite
  }
  
  const { error } = await supabase
    .from('clientes')
    .update(updates)
    .eq('id', cliente_id)
  
  if (error) {
    console.error('Error actualizando score cliente:', error)
  }
}

export async function calcularScoreCrediticio(cliente_id: string): Promise<number> {
  const supabase = createClient()
  
  // Obtener datos del cliente
  const { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', cliente_id)
    .single()
  
  if (!cliente) return 0
  
  // Obtener historial de créditos
  const { data: creditos } = await supabase
    .from('creditos')
    .select('*')
    .eq('cliente_id', cliente_id)
  
  let score = 500 // Score base
  
  // Factores positivos
  if (cliente.documentos_completos) score += 50
  if (cliente.telefono_verificado) score += 30
  if (cliente.email_verificado) score += 20
  if (cliente.ingreso_mensual > 1000) score += 40
  
  // Historial crediticio
  if (creditos && creditos.length > 0) {
    const creditosPagados = creditos.filter(c => c.estado === 'pagado').length
    const creditosEnMora = creditos.filter(c => c.estado === 'en_mora').length
    const totalCreditos = creditos.length
    
    // Buen historial de pagos
    const porcentajePagados = creditosPagados / totalCreditos
    score += Math.round(porcentajePagados * 200)
    
    // Penalizar mora
    score -= creditosEnMora * 50
    
    // Bonificar por antigüedad
    const fechaPrimerCredito = new Date(Math.min(...creditos.map(c => new Date(c.created_at).getTime())))
    const mesesAntiguedad = (Date.now() - fechaPrimerCredito.getTime()) / (1000 * 60 * 60 * 24 * 30)
    score += Math.min(mesesAntiguedad * 5, 100)
  }
  
  // Normalizar score entre 300-850
  score = Math.max(300, Math.min(850, score))
  
  return Math.round(score)
}

export async function getRecomendacionCredito(cliente_id: string, monto_solicitado: number): Promise<{
  recomendacion: 'aprobar' | 'rechazar' | 'aprobar_con_condiciones'
  score: number
  limite_recomendado: number
  factores_positivos: string[]
  factores_negativos: string[]
  condiciones?: string[]
}> {
  const score = await calcularScoreCrediticio(cliente_id)
  const supabase = createClient()
  
  // Obtener datos del cliente
  const { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', cliente_id)
    .single()
  
  const factores_positivos: string[] = []
  const factores_negativos: string[] = []
  const condiciones: string[] = []
  
  // Analizar factores
  if (cliente?.documentos_completos) {
    factores_positivos.push('Documentación completa')
  } else {
    factores_negativos.push('Documentación incompleta')
  }
  
  if (cliente?.telefono_verificado) {
    factores_positivos.push('Teléfono verificado')
  }
  
  if (cliente?.ingreso_mensual > 1000) {
    factores_positivos.push('Ingresos estables')
  } else {
    factores_negativos.push('Ingresos bajos o no declarados')
  }
  
  // Calcular límite recomendado basado en score
  let limite_recomendado = 0
  if (score >= 700) {
    limite_recomendado = 5000
  } else if (score >= 600) {
    limite_recomendado = 3000
  } else if (score >= 500) {
    limite_recomendado = 1500
  } else if (score >= 400) {
    limite_recomendado = 800
  } else {
    limite_recomendado = 500
  }
  
  // Determinar recomendación
  let recomendacion: 'aprobar' | 'rechazar' | 'aprobar_con_condiciones'
  
  if (score >= 650 && monto_solicitado <= limite_recomendado) {
    recomendacion = 'aprobar'
  } else if (score < 350) {
    recomendacion = 'rechazar'
    factores_negativos.push('Score crediticio muy bajo')
  } else {
    recomendacion = 'aprobar_con_condiciones'
    
    if (monto_solicitado > limite_recomendado) {
      condiciones.push(`Reducir monto a máximo S/ ${limite_recomendado}`)
    }
    
    if (score < 500) {
      condiciones.push('Requiere aval o garantía adicional')
    }
    
    if (!cliente?.documentos_completos) {
      condiciones.push('Completar documentación requerida')
    }
  }
  
  return {
    recomendacion,
    score,
    limite_recomendado,
    factores_positivos,
    factores_negativos,
    condiciones: condiciones.length > 0 ? condiciones : undefined
  }
}

export async function getEvaluacionesStats() {
  const supabase = createClient()
  
  const [total, aprobadas, rechazadas, conCondiciones] = await Promise.all([
    supabase.from('evaluaciones_credito').select('id', { count: 'exact', head: true }),
    supabase.from('evaluaciones_credito').select('id', { count: 'exact', head: true }).eq('recomendacion', 'aprobar'),
    supabase.from('evaluaciones_credito').select('id', { count: 'exact', head: true }).eq('recomendacion', 'rechazar'),
    supabase.from('evaluaciones_credito').select('id', { count: 'exact', head: true }).eq('recomendacion', 'aprobar_con_condiciones')
  ])
  
  // Calcular score promedio
  const { data: scoresData } = await supabase
    .from('evaluaciones_credito')
    .select('score_calculado')
    .not('score_calculado', 'is', null)
  
  const scorePromedio = scoresData?.length > 0 
    ? Math.round(scoresData.reduce((sum, e) => sum + (e.score_calculado || 0), 0) / scoresData.length)
    : 0
  
  return {
    total: total.count || 0,
    aprobadas: aprobadas.count || 0,
    rechazadas: rechazadas.count || 0,
    conCondiciones: conCondiciones.count || 0,
    scorePromedio
  }
}
