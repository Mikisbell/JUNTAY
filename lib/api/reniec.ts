// API para consultar datos de RENIEC por DNI
// Integración con API pública de RENIEC Perú

interface ConsultaRENIEC {
  dni: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  nombre_completo: string
  ubigeo?: string
  direccion?: string
  estado_civil?: string
  fecha_nacimiento?: string
  validado: boolean
  fecha_consulta: Date
  error?: string
}

interface RENIECResponse {
  success: boolean
  data?: ConsultaRENIEC
  error?: string
  cached?: boolean
}

// Cache local para evitar consultas repetidas
const consultasCache = new Map<string, ConsultaRENIEC>()

export async function consultarRENIEC(dni: string): Promise<RENIECResponse> {
  try {
    // Validar formato DNI
    if (!validarFormatoDNI(dni)) {
      return {
        success: false,
        error: 'DNI debe tener 8 dígitos numéricos'
      }
    }

    // Verificar cache (válido por 24 horas)
    const cached = consultasCache.get(dni)
    if (cached) {
      const horasCache = (Date.now() - cached.fecha_consulta.getTime()) / (1000 * 60 * 60)
      if (horasCache < 24) {
        return {
          success: true,
          data: cached,
          cached: true
        }
      }
    }

    // Consultar API RENIEC
    const response = await fetch(`/api/reniec/consultar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dni })
    })

    const result = await response.json()

    if (result.success && result.data) {
      // Guardar en cache
      consultasCache.set(dni, result.data)
      
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        error: result.error || 'No se pudo consultar DNI'
      }
    }

  } catch (error) {
    console.error('Error consultando RENIEC:', error)
    return {
      success: false,
      error: 'Error de conexión con RENIEC'
    }
  }
}

export function validarFormatoDNI(dni: string): boolean {
  // DNI peruano: 8 dígitos numéricos
  const dniRegex = /^\d{8}$/
  return dniRegex.test(dni)
}

export function formatearNombre(consulta: ConsultaRENIEC): string {
  return `${consulta.nombres} ${consulta.apellido_paterno} ${consulta.apellido_materno || ''}`.trim()
}

// Función para verificar si DNI ya existe en sistema
export async function verificarDNIExistente(dni: string): Promise<{existe: boolean, cliente_id?: string}> {
  try {
    const response = await fetch(`/api/clientes/verificar-dni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dni })
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Error verificando DNI existente:', error)
    return { existe: false }
  }
}

// Utilidades para UI
export function obtenerEstadoDNI(dni: string): 'valido' | 'invalido' | 'pendiente' {
  if (!dni) return 'pendiente'
  if (validarFormatoDNI(dni)) return 'valido'
  return 'invalido'
}

export function generarSugerenciasCorrecion(dni: string): string[] {
  const sugerencias: string[] = []
  
  if (dni.length < 8) {
    sugerencias.push(`Agregar ${8 - dni.length} dígito(s) más`)
  } else if (dni.length > 8) {
    sugerencias.push(`Remover ${dni.length - 8} dígito(s)`)
  }
  
  if (!/^\d*$/.test(dni)) {
    sugerencias.push('Solo debe contener números')
  }
  
  return sugerencias
}
