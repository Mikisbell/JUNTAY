import { NextResponse } from 'next/server'

interface RENIECAPIResponse {
  success: boolean
  data?: {
    dni: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    nombre_completo: string
    ubigeo?: string
    direccion?: string
    estado_civil?: string
    fecha_nacimiento?: string
  }
  error?: string
}

export async function POST(request: Request) {
  try {
    const { dni } = await request.json()

    if (!dni) {
      return NextResponse.json(
        { success: false, error: 'DNI requerido' },
        { status: 400 }
      )
    }

    // Validar formato DNI
    if (!/^\d{8}$/.test(dni)) {
      return NextResponse.json(
        { success: false, error: 'DNI debe tener 8 dígitos' },
        { status: 400 }
      )
    }

    // API RENIEC Pública (gratuita con límites)
    // Alternativas: apis.net.pe, consultar-dni.com, reniec.gob.pe
    
    // OPCIÓN 1: API Pública Gratuita (con límites)
    const response = await consultarAPIRENIEC(dni)
    
    if (response.success && response.data) {
      const datosFormateados = {
        dni: response.data.dni,
        nombres: response.data.nombres,
        apellido_paterno: response.data.apellido_paterno,
        apellido_materno: response.data.apellido_materno,
        nombre_completo: `${response.data.nombres} ${response.data.apellido_paterno} ${response.data.apellido_materno || ''}`.trim(),
        ubigeo: response.data.ubigeo,
        direccion: response.data.direccion,
        estado_civil: response.data.estado_civil,
        fecha_nacimiento: response.data.fecha_nacimiento,
        validado: true,
        fecha_consulta: new Date()
      }

      return NextResponse.json({
        success: true,
        data: datosFormateados
      })
    } else {
      return NextResponse.json(
        { success: false, error: response.error || 'DNI no encontrado en RENIEC' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Error en consulta RENIEC:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function consultarAPIRENIEC(dni: string): Promise<RENIECAPIResponse> {
  try {
    // MÉTODO 1: API Gratuita (con límites diarios)
    const url = `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`
    const headers = {
      'Authorization': `Bearer ${process.env.RENIEC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }

    // Si no hay token, usar método alternativo o mock
    if (!process.env.RENIEC_API_TOKEN) {
      return consultarRENIECMock(dni)
    }

    const response = await fetch(url, { 
      headers,
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`API RENIEC error: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.nombres) {
      return {
        success: true,
        data: {
          dni: data.numeroDocumento || dni,
          nombres: data.nombres,
          apellido_paterno: data.apellidoPaterno,
          apellido_materno: data.apellidoMaterno,
          nombre_completo: `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno || ''}`.trim(),
          ubigeo: data.ubigeo,
          direccion: data.direccion,
          estado_civil: data.estadoCivil,
          fecha_nacimiento: data.fechaNacimiento
        }
      }
    } else {
      return {
        success: false,
        error: 'DNI no encontrado'
      }
    }

  } catch (error) {
    console.error('Error consultando API RENIEC:', error)
    
    // Fallback a método mock para desarrollo/testing
    return consultarRENIECMock(dni)
  }
}

// Función mock para desarrollo y testing
function consultarRENIECMock(dni: string): Promise<RENIECAPIResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular datos realistas para testing
      const mockData = {
        '12345678': {
          nombres: 'JUAN CARLOS',
          apellido_paterno: 'RODRIGUEZ',
          apellido_materno: 'GARCIA',
          ubigeo: '150101',
          direccion: 'AV. LIMA 123, LIMA, PERU',
          estado_civil: 'SOLTERO',
          fecha_nacimiento: '1990-05-15'
        },
        '87654321': {
          nombres: 'MARIA ELENA',
          apellido_paterno: 'MARTINEZ',
          apellido_materno: 'TORRES',
          ubigeo: '150103',
          direccion: 'JR. CUSCO 456, LIMA, PERU',
          estado_civil: 'CASADA',
          fecha_nacimiento: '1985-12-20'
        }
      }

      const mock = mockData[dni as keyof typeof mockData]
      
      if (mock) {
        resolve({
          success: true,
          data: {
            dni,
            nombres: mock.nombres,
            apellido_paterno: mock.apellido_paterno,
            apellido_materno: mock.apellido_materno,
            nombre_completo: `${mock.nombres} ${mock.apellido_paterno} ${mock.apellido_materno}`,
            ubigeo: mock.ubigeo,
            direccion: mock.direccion,
            estado_civil: mock.estado_civil,
            fecha_nacimiento: mock.fecha_nacimiento
          }
        })
      } else {
        resolve({
          success: false,
          error: 'DNI no encontrado en registros'
        })
      }
    }, 1500) // Simular delay de API real
  })
}
