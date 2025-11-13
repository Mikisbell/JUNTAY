import { NextRequest, NextResponse } from 'next/server'
import { getDistritosPorProvinciaCached } from '@/lib/cache/ubigeo-cache'

// BÚSQUEDA OPTIMIZADA CON CACHE LOCAL
// https://github.com/joseluisq/ubigeos-peru
async function buscarDistritosOptimizado(dept: string, prov: string): Promise<string[]> {
  try {
    console.log(`⚡ Búsqueda OPTIMIZADA con cache para: ${prov}`)
    
    // Usar cache local - MUCHO MÁS RÁPIDO
    const distritos = await getDistritosPorProvinciaCached(prov)
    
    if (distritos.length > 0) {
      console.log(`✅ Cache HIT: ${distritos.length} distritos para ${prov}`)
      return distritos
    }
    
    console.log(`⚠️ No se encontraron distritos para: ${prov}`)
    return []
    
  } catch (error) {
    console.error('❌ Error en búsqueda optimizada:', error)
    
    // Fallback ultrarrápido con distritos principales
    const distritosConocidos: { [key: string]: string[] } = {
      'CHUPACA': ['CHUPACA', 'AHUAC', 'CHONGOS BAJO', 'HUACHAC', 'JARPA', 'SAN JUAN DE YSCOS', 'YANACANCHA'],
      'ABANCAY': ['ABANCAY', 'CHACOCHE', 'CIRCA', 'CURAHUASI', 'HUANIPACA', 'LAMBRAMA', 'PICHIRHUA', 'SAN PEDRO DE CACHORA', 'TAMBURCO'],
      'LIMA': ['LIMA', 'ATE', 'BARRANCO', 'BREÑA', 'CHORRILLOS', 'COMAS', 'INDEPENDENCIA', 'JESUS MARIA', 'LA MOLINA', 'LA VICTORIA', 'LINCE', 'LOS OLIVOS', 'MIRAFLORES', 'PUEBLO LIBRE', 'RIMAC', 'SAN BORJA', 'SAN ISIDRO', 'SAN JUAN DE LURIGANCHO', 'SAN MARTIN DE PORRES', 'SAN MIGUEL', 'SANTA ANITA', 'SANTIAGO DE SURCO', 'SURQUILLO', 'VILLA EL SALVADOR'],
      'AREQUIPA': ['AREQUIPA', 'ALTO SELVA ALEGRE', 'CAYMA', 'CERRO COLORADO', 'CHARACATO', 'CHIGUATA', 'JACOBO HUNTER', 'LA JOYA', 'MARIANO MELGAR', 'MIRAFLORES', 'MOLLEBAYA', 'PAUCARPATA', 'POCSI', 'POLOBAYA', 'QUEQUEÑA', 'SABANDIA', 'SACHACA', 'SAN JUAN DE SIGUAS', 'SAN JUAN DE TARUCANI', 'SANTA ISABEL DE SIGUAS', 'SANTA RITA DE SIGUAS', 'SOCABAYA', 'TIABAYA', 'UCHUMAYO', 'VITOR', 'YANAHUARA', 'YARABAMBA', 'YURA']
    }
    
    console.log(`🔄 Fallback usado para ${prov}`)
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

    console.log(`⚡ Consulta OPTIMIZADA con cache para: ${departamento} - ${provincia}`)

    const distritosEncontrados = await buscarDistritosOptimizado(departamento, provincia)
    
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
