import { NextResponse } from 'next/server'

interface SUNATAPIResponse {
  success: boolean
  data?: {
    ruc: string
    razon_social: string
    direccion: string
    departamento: string
    provincia: string
    distrito: string
    ubigeo: string
    estado: string
    condicion_domicilio: string
    actividad_economica: string
    fecha_inscripcion: string
    tipo_persona: string
    es_buen_contribuyente: boolean
    representante_legal?: {
      nombres: string
      dni: string
      cargo: string
      fecha_desde: string
    }
  }
  error?: string
}

export async function POST(request: Request) {
  try {
    const { ruc } = await request.json()

    if (!ruc) {
      return NextResponse.json(
        { success: false, error: 'RUC requerido' },
        { status: 400 }
      )
    }

    // Validar formato RUC
    if (!/^\d{11}$/.test(ruc)) {
      return NextResponse.json(
        { success: false, error: 'RUC debe tener 11 dígitos' },
        { status: 400 }
      )
    }

    // Intentar API real primero
    const token = process.env.RENIEC_API_TOKEN // Usar el mismo token
    if (token) {
      try {
        console.log('Consultando SUNAT para RUC:', ruc)
        
        // 1. Consultar datos básicos del RUC
        const responseBasic = await fetch('https://api.consultasperu.com/api/v1/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            type_document: 'ruc',
            document_number: ruc
          })
        })

        if (!responseBasic.ok) {
          throw new Error(`Error HTTP en consulta básica: ${responseBasic.status}`)
        }

        const resultBasic = await responseBasic.json()
        
        if (!resultBasic.success) {
          throw new Error(resultBasic.message || 'No se encontraron datos del RUC')
        }

        // 2. Consultar representantes legales
        let representanteLegal = null
        try {
          const responseRep = await fetch('https://api.consultasperu.com/api/v1/query/ruc-representantes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: token,
              ruc: ruc
            })
          })

          if (responseRep.ok) {
            const resultRep = await responseRep.json()
            if (resultRep.success && resultRep.data && resultRep.data.length > 0) {
              // Tomar el primer representante activo
              const rep = resultRep.data[0]
              representanteLegal = {
                nombres: rep.nombres,
                dni: rep.numero_documento,
                cargo: rep.cargo,
                fecha_desde: rep.fecha_desde
              }
            }
          }
        } catch (repError) {
          console.log('No se pudieron obtener representantes:', repError)
        }

        const data = resultBasic.data
        
        const datosFormateados = {
          ruc: data.number,
          razon_social: data.name,
          direccion: data.address,
          departamento: data.department,
          provincia: data.province,
          distrito: data.district,
          ubigeo: data.ubigeo,
          estado: data.status,
          condicion_domicilio: data.domicile_conditions,
          actividad_economica: data.business_line,
          fecha_inscripcion: data.date_creation,
          tipo_persona: data.person_type,
          es_buen_contribuyente: data.es_buen_contribuyente || false,
          representante_legal: representanteLegal
        }
        
        return NextResponse.json({
          success: true,
          data: datosFormateados,
          source: 'api'
        })

      } catch (error) {
        console.log('API real falló, usando mock:', error)
      }
    }

    // Fallback a mock si no hay token o falla la API
    const mockResponse = await consultarSUNATMock(ruc)
    
    return NextResponse.json({
      success: mockResponse.success,
      data: mockResponse.data,
      source: 'mock'
    })

  } catch (error) {
    console.error('Error en consulta SUNAT:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función mock para desarrollo y testing
function consultarSUNATMock(ruc: string): Promise<SUNATAPIResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular datos realistas para testing
      const mockData = {
        '20123456789': {
          razon_social: 'EMPRESA EJEMPLO SAC',
          direccion: 'AV. JAVIER PRADO 123, LIMA',
          departamento: 'LIMA',
          provincia: 'LIMA',
          distrito: 'SAN ISIDRO',
          ubigeo: '150129',
          estado: 'ACTIVO',
          condicion_domicilio: 'HABIDO',
          actividad_economica: 'COMERCIO AL POR MENOR',
          fecha_inscripcion: '2010-01-15',
          tipo_persona: 'PERSONA JURIDICA',
          es_buen_contribuyente: true,
          representante_legal: {
            nombres: 'JUAN CARLOS PEREZ GARCIA',
            dni: '12345678',
            cargo: 'GERENTE GENERAL',
            fecha_desde: '2010-01-15'
          }
        },
        '20987654321': {
          razon_social: 'COMERCIAL LIMA EIRL',
          direccion: 'JR. UNION 456, LIMA',
          departamento: 'LIMA',
          provincia: 'LIMA',
          distrito: 'LIMA',
          ubigeo: '150101',
          estado: 'ACTIVO',
          condicion_domicilio: 'HABIDO',
          actividad_economica: 'VENTA AL POR MAYOR',
          fecha_inscripcion: '2015-05-20',
          tipo_persona: 'EMPRESA INDIVIDUAL',
          es_buen_contribuyente: false,
          representante_legal: {
            nombres: 'MARIA ELENA MARTINEZ TORRES',
            dni: '87654321',
            cargo: 'TITULAR',
            fecha_desde: '2015-05-20'
          }
        }
      }

      const mock = mockData[ruc as keyof typeof mockData]
      
      if (mock) {
        resolve({
          success: true,
          data: {
            ruc,
            ...mock
          }
        })
      } else {
        resolve({
          success: false,
          error: 'RUC no encontrado en registros'
        })
      }
    }, 2000) // Simular delay de API real
  })
}
