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

    // Intentar API real primero
    const token = process.env.RENIEC_API_TOKEN
    if (token) {
      try {
        const response = await consultarRENIECReal(dni)
        
        if (response) {
          const datosFormateados = {
            dni: response.dni,
            nombres: response.nombres,
            apellido_paterno: response.apellido_paterno,
            apellido_materno: response.apellido_materno,
            nombre_completo: `${response.nombres} ${response.apellido_paterno} ${response.apellido_materno || ''}`.trim(),
            ubigeo: response.ubigeo,
            direccion: response.direccion,
            estado_civil: response.estado_civil,
            fecha_nacimiento: response.fecha_nacimiento,
            timestamp: new Date().toISOString()
          }
          
          return NextResponse.json({
            success: true,
            data: datosFormateados,
            source: 'api'
          })
        }
      } catch (error) {
        console.log('API real falló, usando mock:', error)
      }
    }

    // Si falla la API real o no hay token, usar mock como fallback
    const mockResponse = await consultarRENIECMock(dni)
    
    return NextResponse.json({
      success: mockResponse.success,
      data: mockResponse.data,
      source: 'mock'
    })

  } catch (error) {
    console.error('Error en consulta RENIEC:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para consultar RENIEC real con consultasperu.com
async function consultarRENIECReal(dni: string): Promise<any | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const token = process.env.RENIEC_API_TOKEN
      if (!token) {
        throw new Error('RENIEC_API_TOKEN no configurado')
      }

      console.log('Consultando consultasperu.com para DNI:', dni)
      
      // API de consultasperu.com
      const response = await fetch('https://api.consultasperu.com/api/v1/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          type_document: 'dni',
          document_number: dni
        })
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'No se encontraron datos')
      }

      const data = result.data
      
      // Parsear nombre completo para extraer apellidos
      const nombreCompleto = data.full_name || ''
      const nombreSolo = data.name || ''
      const apellidos = data.surname || ''
      
      // Separar apellidos (formato: "APELLIDO1 APELLIDO2")
      const apellidosArray = apellidos.trim().split(' ')
      const apellidoPaterno = apellidosArray[0] || ''
      const apellidoMaterno = apellidosArray.slice(1).join(' ') || ''
      
      resolve({
        dni,
        nombres: nombreSolo,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        ubigeo: data.ubigeo || '',
        direccion: data.address || 'S/N',
        estado_civil: 'SOLTERO', // No viene en la API
        fecha_nacimiento: data.date_of_birth || ''
      })

    } catch (error) {
      console.error('Error consultando consultasperu.com:', error)
      resolve(null)
    }
  })
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
        },
        '43708661': {
          nombres: 'MIGUEL ANGEL',
          apellido_paterno: 'RIVERA',
          apellido_materno: 'OSPINA',
          ubigeo: '150101',
          direccion: 'S/N',
          estado_civil: 'SOLTERO',
          fecha_nacimiento: '1990-01-01'
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
