// CACHE LOCAL PARA UBIGEOS - OPTIMIZACIÓN DE PERFORMANCE
// Evita consultas repetitivas al repositorio GitHub

interface UbigeoData {
  id_ubigeo: string
  nombre_ubigeo: string
  codigo_ubigeo: string
  etiqueta_ubigeo: string
  buscador_ubigeo: string
  numero_hijos_ubigeo: string
  nivel_ubigeo: string
  id_padre_ubigeo: string
}

interface CacheEntry {
  data: any
  timestamp: number
  expires: number
}

class UbigeoCache {
  private cache: Map<string, CacheEntry> = new Map()
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hora en ms

  // Cache para provincias por departamento
  async getProvincias(): Promise<any> {
    const cacheKey = 'provincias_all'
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      console.log('✅ Cache HIT - Provincias desde cache local')
      return cached
    }

    console.log('🔄 Cache MISS - Descargando provincias desde GitHub')
    try {
      const response = await fetch('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/provincias.json')
      const data = await response.json()
      
      this.setToCache(cacheKey, data)
      console.log('✅ Provincias cacheadas localmente')
      return data
    } catch (error) {
      console.error('❌ Error cacheando provincias:', error)
      throw error
    }
  }

  // Cache para distritos completos
  async getDistritos(): Promise<any> {
    const cacheKey = 'distritos_all'
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      console.log('✅ Cache HIT - Distritos desde cache local')
      return cached
    }

    console.log('🔄 Cache MISS - Descargando distritos desde GitHub')
    try {
      const response = await fetch('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/distritos.json')
      const data = await response.json()
      
      this.setToCache(cacheKey, data)
      console.log('✅ Distritos cacheados localmente')
      return data
    } catch (error) {
      console.error('❌ Error cacheando distritos:', error)
      throw error
    }
  }

  // Buscar provincias por departamento (desde cache)
  async getProvinciasPorDepartamento(departamento: string): Promise<UbigeoData[]> {
    const provinciasData = await this.getProvincias()
    
    // Buscar ID del departamento
    const departamentoUpper = departamento.toUpperCase()
    let provinciasList: UbigeoData[] = []
    
    for (const [deptId, provincias] of Object.entries(provinciasData)) {
      const provinciaArray = provincias as UbigeoData[]
      
      // Buscar si alguna provincia corresponde a este departamento
      // (Esto requiere lógica adicional para mapear departamentos)
      for (const provincia of provinciaArray) {
        // Por ahora retornamos todas las provincias del primer departamento que encuentre
        // TODO: Implementar mapeo correcto departamento -> provincias
        if (provinciaArray.length > 0) {
          provinciasList = provinciaArray
          break
        }
      }
      if (provinciasList.length > 0) break
    }
    
    return provinciasList.sort((a, b) => a.nombre_ubigeo.localeCompare(b.nombre_ubigeo))
  }

  // Buscar distritos por provincia (desde cache)
  async getDistritosPorProvincia(provincia: string): Promise<string[]> {
    const provinciasData = await this.getProvincias()
    const distritosData = await this.getDistritos()
    
    // Buscar ID de la provincia
    let provinciaId = null
    
    for (const [deptId, provincias] of Object.entries(provinciasData)) {
      const provinciasList = provincias as UbigeoData[]
      const provinciaEncontrada = provinciasList.find((p: UbigeoData) => 
        p.nombre_ubigeo.toUpperCase() === provincia.toUpperCase()
      )
      
      if (provinciaEncontrada) {
        provinciaId = provinciaEncontrada.id_ubigeo
        break
      }
    }
    
    if (!provinciaId) {
      console.log(`❌ No se encontró ID para provincia: ${provincia}`)
      return []
    }
    
    // Obtener distritos
    const distritosArray = distritosData[provinciaId] || []
    const nombresDistritos = distritosArray.map((d: UbigeoData) => d.nombre_ubigeo.toUpperCase())
    
    return nombresDistritos.sort()
  }

  // Gestión interna del cache
  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    if (Date.now() > entry.expires) {
      console.log(`⏰ Cache EXPIRED para ${key}`)
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  private setToCache(key: string, data: any): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + this.CACHE_DURATION
    }
    
    this.cache.set(key, entry)
    console.log(`💾 Cached ${key} (expires en ${this.CACHE_DURATION/1000/60} min)`)
  }

  // Limpiar cache manualmente
  clearCache(): void {
    this.cache.clear()
    console.log('🗑️ Cache limpiado completamente')
  }

  // Obtener estadísticas del cache
  getCacheStats(): { size: number, keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Instancia singleton del cache
export const ubigeoCache = new UbigeoCache()

// Funciones de conveniencia
export async function getProvinciasCached() {
  return ubigeoCache.getProvincias()
}

export async function getDistritosCached() {
  return ubigeoCache.getDistritos()
}

export async function getProvinciasPorDepartamentoCached(departamento: string) {
  return ubigeoCache.getProvinciasPorDepartamento(departamento)
}

export async function getDistritosPorProvinciaCached(provincia: string) {
  return ubigeoCache.getDistritosPorProvincia(provincia)
}
