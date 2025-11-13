import { NextRequest, NextResponse } from 'next/server'

// Cache para ubicaciones obtenidas de la API real
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

// RUCs de empresas grandes para obtener ubicaciones reales  
const RUCS_EMPRESAS = [
  '20100070970', // Supermercados Peruanos - PRIMERA PRUEBA
  '20131312955', // Saga Falabella
  '20100047218'  // Banco de Crédito del Perú - Solo estos 3 primero para test rápido
]

async function consultarUbicacionesAPI() {
  // Token real que ya funciona para DNI y RUC
  const token = '6d189ad58ba715e8198161a3cce4f26290a0d795fe8a72fae046801764a6d6d8'

  console.log('🔄 Consultando ubicaciones reales desde API consultasperu.com...')

  // Limpiar cache
  ubicacionesCache.departamentos.clear()
  ubicacionesCache.provincias.clear() 
  ubicacionesCache.distritos.clear()

  for (const ruc of RUCS_EMPRESAS) {
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

      if (!response.ok) {
        console.error(`❌ Error HTTP ${response.status} para RUC ${ruc}`)
        continue
      }

      const result = await response.json()

      if (result.success && result.data && Array.isArray(result.data)) {
        console.log(`✅ ${result.data.length} establecimientos encontrados para RUC ${ruc}`)
        
        result.data.forEach((establecimiento: any) => {
          const { departamento, provincia, distrito } = establecimiento
          
          if (departamento && provincia && distrito) {
            console.log(`📍 Ubicación: ${departamento} > ${provincia} > ${distrito}`)
            
            // Agregar departamento
            ubicacionesCache.departamentos.add(departamento.toUpperCase().trim())
            
            // Agregar provincia por departamento
            const deptKey = departamento.toUpperCase().trim()
            if (!ubicacionesCache.provincias.has(deptKey)) {
              ubicacionesCache.provincias.set(deptKey, new Set())
            }
            ubicacionesCache.provincias.get(deptKey)!.add(provincia.toUpperCase().trim())
            
            // Agregar distrito por provincia
            const provKey = `${deptKey}-${provincia.toUpperCase().trim()}`
            if (!ubicacionesCache.distritos.has(provKey)) {
              ubicacionesCache.distritos.set(provKey, new Set())
            }
            ubicacionesCache.distritos.get(provKey)!.add(distrito.toUpperCase().trim())
          }
        })
      } else {
        console.log(`❌ Sin datos para RUC ${ruc}: ${result.message}`)
      }

      // Pausa entre consultas para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      console.error(`❌ Error consultando RUC ${ruc}:`, error)
      continue
    }
  }

  ubicacionesCache.lastUpdate = Date.now()
  
  console.log(`🎉 Cache actualizado:`)
  console.log(`📊 Departamentos: ${ubicacionesCache.departamentos.size}`)
  console.log(`📊 Provincias: ${ubicacionesCache.provincias.size}`) 
  console.log(`📊 Distritos: ${ubicacionesCache.distritos.size}`)
}

async function obtenerUbicacionesDesdeAPI(action: string, params?: any) {
  // Actualizar cache si está vacío o tiene más de 5 minutos (para testing)  
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos para testing
  const needsUpdate = Date.now() - ubicacionesCache.lastUpdate > CACHE_DURATION || 
                     ubicacionesCache.departamentos.size === 0

  console.log(`🔍 Cache status: needsUpdate=${needsUpdate}, lastUpdate=${ubicacionesCache.lastUpdate}, departamentos=${ubicacionesCache.departamentos.size}`)

  if (needsUpdate) {
    console.log('🔄 Actualizando cache desde API...')
    await consultarUbicacionesAPI()
  } else {
    console.log('✅ Usando cache existente')
  }

  switch (action) {
    case 'departamentos':
      return Array.from(ubicacionesCache.departamentos).sort()
    
    case 'provincias':
      const departamento = params?.departamento
      if (!departamento) return []
      const provincias = ubicacionesCache.provincias.get(departamento.toUpperCase()) || new Set()
      return Array.from(provincias).sort()
    
    case 'distritos':
      const dept = params?.departamento
      const prov = params?.provincia
      if (!dept || !prov) return []
      const clave = `${dept.toUpperCase()}-${prov.toUpperCase()}`
      const distritos = ubicacionesCache.distritos.get(clave) || new Set()
      return Array.from(distritos).sort()
    
    default:
      return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, departamento, provincia } = await request.json()

    const data = await obtenerUbicacionesDesdeAPI(action, { departamento, provincia })

    console.log(`🔍 DEBUG: Action=${action}, Data length=${data.length}`)
    
    return NextResponse.json({
      success: true,
      data: data,
      source: 'API consultasperu.com RUC-ANEXOS'
    })

  } catch (error) {
    console.error('❌ Error obteniendo ubicaciones:', error)
    return NextResponse.json(
      { success: false, error: 'Error obteniendo ubicaciones' },
      { status: 500 }
    )
  }
}
