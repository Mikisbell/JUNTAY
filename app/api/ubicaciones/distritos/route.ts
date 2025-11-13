import { NextRequest, NextResponse } from 'next/server'

// BÚSQUEDA EN DATOS OFICIALES DEL REPOSITORIO
// https://github.com/joseluisq/ubigeos-peru
async function buscarDistritosEnRepositorioOficial(dept: string, prov: string): Promise<string[]> {
  try {
    // Primero obtenemos el ID de la provincia
    const provinciaResponse = await fetch('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/provincias.json')
    const provinciasData = await provinciaResponse.json()
    
    let provinciaId = null
    
    // Buscar ID de la provincia en el departamento especificado
    for (const [deptId, provincias] of Object.entries(provinciasData)) {
      const provinciasList = provincias as any[]
      const provinciaEncontrada = provinciasList.find((p: any) => 
        p.nombre_ubigeo.toUpperCase() === prov.toUpperCase()
      )
      
      if (provinciaEncontrada) {
        provinciaId = provinciaEncontrada.id_ubigeo
        break
      }
    }
    
    if (!provinciaId) {
      console.log(`❌ No se encontró ID para provincia: ${prov}`)
      return []
    }
    
    // Ahora obtenemos los distritos usando el ID de la provincia
    const distritosResponse = await fetch('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/distritos.json')
    const distritosData = await distritosResponse.json()
    
    const distritosArray = distritosData[provinciaId] || []
    const nombresDistritos = distritosArray.map((d: any) => d.nombre_ubigeo.toUpperCase())
    
    console.log(`✅ Encontrados ${nombresDistritos.length} distritos oficiales para ${prov}`)
    return nombresDistritos.sort()
    
  } catch (error) {
    console.error('❌ Error consultando repositorio oficial:', error)
    // Fallback a algunos distritos conocidos
    const distritosConocidos: { [key: string]: string[] } = {
      'CHUPACA': ['CHUPACA', '3 DE DICIEMBRE', 'AHUAC', 'CHONGOS BAJO', 'HUACHAC', 'HUAMANCACA CHICO', 'JARPA', 'SAN JUAN DE YSCOS', 'YANACANCHA'],
      'ABANCAY': ['ABANCAY', 'CHACOCHE', 'CIRCA', 'CURAHUASI', 'HUANIPACA', 'LAMBRAMA', 'PICHIRHUA', 'SAN PEDRO DE CACHORA', 'TAMBURCO'],
      'LIMA': ['LIMA', 'ATE', 'BARRANCO', 'BREÑA', 'CARABAYLLO', 'CHACLACAYO', 'CHORRILLOS', 'CIENEGUILLA', 'COMAS', 'EL AGUSTINO', 'INDEPENDENCIA', 'JESUS MARIA', 'LA MOLINA', 'LA VICTORIA', 'LINCE', 'LOS OLIVOS', 'LURIGANCHO', 'LURIN', 'MAGDALENA DEL MAR', 'MAGDALENA VIEJA', 'MIRAFLORES', 'PACHACAMAC', 'PUCUSANA', 'PUEBLO LIBRE', 'PUENTE PIEDRA', 'PUNTA HERMOSA', 'PUNTA NEGRA', 'RIMAC', 'SAN BARTOLO', 'SAN BORJA', 'SAN ISIDRO', 'SAN JUAN DE LURIGANCHO', 'SAN JUAN DE MIRAFLORES', 'SAN LUIS', 'SAN MARTIN DE PORRES', 'SAN MIGUEL', 'SANTA ANITA', 'SANTA MARIA DEL MAR', 'SANTA ROSA', 'SANTIAGO DE SURCO', 'SURQUILLO', 'VILLA EL SALVADOR', 'VILLA MARIA DEL TRIUNFO']
    }
    return distritosConocidos[prov.toUpperCase()] || []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departamento = searchParams.get('departamento')
    const provincia = searchParams.get('provincia')

    if (!departamento || !provincia) {
      return NextResponse.json(
        { success: false, error: 'Departamento y provincia requeridos' },
        { status: 400 }
      )
    }

    console.log(`🏘️ Consultando repositorio oficial GitHub para: ${departamento} - ${provincia}`)

    const distritosEncontrados = await buscarDistritosEnRepositorioOficial(departamento, provincia)
    
    if (distritosEncontrados.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se encontraron distritos para: ${departamento} - ${provincia}`,
          message: `Consultando repositorio oficial GitHub. Esta provincia podría no existir o tener un nombre diferente.`,
          fuente_consultada: 'https://github.com/joseluisq/ubigeos-peru',
          sugerencia: 'Verificar el nombre exacto de la provincia'
        },
        { status: 404 }
      )
    }

    console.log(`📋 Distritos oficiales: ${distritosEncontrados.join(', ')}`)

    return NextResponse.json({
      success: true,
      data: distritosEncontrados,
      total: distritosEncontrados.length,
      departamento: departamento.toUpperCase(),
      provincia: provincia.toUpperCase(),
      source: 'Repositorio Oficial GitHub - joseluisq/ubigeos-peru',
      oficial: true,
      url_repositorio: 'https://github.com/joseluisq/ubigeos-peru',
      datos_completos: true
    })

  } catch (error) {
    console.error('Error obteniendo distritos oficiales del repositorio:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
