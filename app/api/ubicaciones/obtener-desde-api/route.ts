import { NextRequest, NextResponse } from 'next/server'

// Cache global para ubicaciones obtenidas de la API real
let ubicacionesCache: {
  departamentos: Set<string>
  provincias: Map<string, Set<string>>
  distritos: Map<string, Set<string>>
  lastUpdate: number
} = {
  departamentos: new Set(),
  provincias: new Map(),
  distritos: new Map(),
  lastUpdate: 0
}

// Lista de RUCs conocidos para obtener ubicaciones diversas
const RUCS_MUESTRA = [
  '20100070970', // Supermercados Peruanos
  '20131312955', // Saga Falabella
  '20100047218', // Banco de Crédito del Perú
  '20325117835', // Corporación Lindley
  '20100128056', // Tiendas EFE
  '20100017491', // Cervecería San Juan
  '20131380021', // Cineplanet
  '20159473148', // Plaza Vea
  '20546618671', // Ripley Peru
  '20100255771'  // Telefónica del Perú
]

async function obtenerUbicacionesDesdeAPI(): Promise<void> {
  const token = process.env.RENIEC_API_TOKEN
  if (!token) {
    throw new Error('RENIEC_API_TOKEN no configurado')
  }

  console.log('🔄 Obteniendo ubicaciones desde API consultasperu.com...')

  for (const ruc of RUCS_MUESTRA) {
    try {
      console.log(`📍 Consultando RUC: ${ruc}`)
      
      const response = await fetch('https://api.consultasperu.com/api/v1/query/ruc-anexos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          ruc: ruc
        })
      })

      const result = await response.json()

      if (result.success && result.data && Array.isArray(result.data)) {
        result.data.forEach((establecimiento: any) => {
          const { departamento, provincia, distrito } = establecimiento
          
          if (departamento && provincia && distrito) {
            // Agregar departamento
            ubicacionesCache.departamentos.add(departamento.toUpperCase())
            
            // Agregar provincia por departamento
            const deptKey = departamento.toUpperCase()
            if (!ubicacionesCache.provincias.has(deptKey)) {
              ubicacionesCache.provincias.set(deptKey, new Set())
            }
            ubicacionesCache.provincias.get(deptKey)!.add(provincia.toUpperCase())
            
            // Agregar distrito por provincia
            const provKey = `${deptKey}-${provincia.toUpperCase()}`
            if (!ubicacionesCache.distritos.has(provKey)) {
              ubicacionesCache.distritos.set(provKey, new Set())
            }
            ubicacionesCache.distritos.get(provKey)!.add(distrito.toUpperCase())
            
            console.log(`✅ Ubicación agregada: ${departamento} > ${provincia} > ${distrito}`)
          }
        })
      } else {
        console.log(`❌ No se obtuvieron datos para RUC: ${ruc}`)
      }

      // Pequeña pausa entre consultas para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error consultando RUC ${ruc}:`, error)
      continue
    }
  }

  ubicacionesCache.lastUpdate = Date.now()
  console.log(`🎉 Cache actualizado con ubicaciones reales desde API`)
  console.log(`📊 Departamentos: ${ubicacionesCache.departamentos.size}`)
  console.log(`📊 Provincias: ${ubicacionesCache.provincias.size}`)
  console.log(`📊 Distritos: ${ubicacionesCache.distritos.size}`)
}

export async function GET() {
  try {
    // Actualizar cache cada 24 horas o si está vacío
    const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas
    const needsUpdate = Date.now() - ubicacionesCache.lastUpdate > CACHE_DURATION || 
                       ubicacionesCache.departamentos.size === 0

    if (needsUpdate) {
      await obtenerUbicacionesDesdeAPI()
    }

    return NextResponse.json({
      success: true,
      message: 'Ubicaciones obtenidas desde API real',
      data: {
        departamentos: Array.from(ubicacionesCache.departamentos).sort(),
        totalProvincias: ubicacionesCache.provincias.size,
        totalDistritos: ubicacionesCache.distritos.size,
        lastUpdate: new Date(ubicacionesCache.lastUpdate).toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error obteniendo ubicaciones desde API:', error)
    return NextResponse.json(
      { success: false, error: 'Error obteniendo ubicaciones desde API' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, departamento, provincia } = await request.json()

    // Asegurar que el cache esté actualizado
    if (ubicacionesCache.departamentos.size === 0) {
      await obtenerUbicacionesDesdeAPI()
    }

    switch (action) {
      case 'departamentos':
        return NextResponse.json({
          success: true,
          data: Array.from(ubicacionesCache.departamentos).sort()
        })

      case 'provincias':
        if (!departamento) {
          return NextResponse.json(
            { success: false, error: 'Departamento requerido' },
            { status: 400 }
          )
        }
        
        const provincias = ubicacionesCache.provincias.get(departamento.toUpperCase()) || new Set()
        return NextResponse.json({
          success: true,
          data: Array.from(provincias).sort()
        })

      case 'distritos':
        if (!departamento || !provincia) {
          return NextResponse.json(
            { success: false, error: 'Departamento y provincia requeridos' },
            { status: 400 }
          )
        }
        
        const clave = `${departamento.toUpperCase()}-${provincia.toUpperCase()}`
        const distritos = ubicacionesCache.distritos.get(clave) || new Set()
        return NextResponse.json({
          success: true,
          data: Array.from(distritos).sort()
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('❌ Error en POST ubicaciones:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Cache disponible internamente en este módulo
// No se puede exportar desde archivos de rutas en Next.js App Router
