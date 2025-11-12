'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { 
  Image as ImageIcon, 
  Star, 
  StarOff, 
  Download, 
  Eye,
  Calendar,
  FileImage 
} from 'lucide-react'
import { getFotosGarantia, marcarFotoPrincipal, type FotoGarantia } from '@/lib/api/fotos-garantias'
import Image from 'next/image'
import { toast } from 'sonner'

interface GaleriaFotosGarantiaProps {
  garantiaId: string
  readonly?: boolean
}

export function GaleriaFotosGarantia({ garantiaId, readonly = false }: GaleriaFotosGarantiaProps) {
  const [fotos, setFotos] = useState<FotoGarantia[]>([])
  const [loading, setLoading] = useState(true)
  const [fotoSeleccionada, setFotoSeleccionada] = useState<FotoGarantia | null>(null)

  useEffect(() => {
    loadFotos()
  }, [garantiaId])

  async function loadFotos() {
    try {
      setLoading(true)
      const fotosData = await getFotosGarantia(garantiaId)
      setFotos(fotosData)
    } catch (error) {
      console.error('Error al cargar fotos:', error)
      toast.error('Error al cargar fotos')
    } finally {
      setLoading(false)
    }
  }

  async function handleMarcarPrincipal(fotoId: string) {
    if (readonly) return
    
    try {
      const result = await marcarFotoPrincipal(fotoId, garantiaId)
      
      if (result.success) {
        toast.success('Foto marcada como principal')
        await loadFotos() // Recargar para actualizar estado
      } else {
        toast.error(result.error || 'Error al marcar como principal')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar foto')
    }
  }

  function handleDescargar(foto: FotoGarantia) {
    // Crear enlace temporal para descargar
    const link = document.createElement('a')
    link.href = foto.archivo_url
    link.download = foto.nombre_archivo
    link.click()
  }

  function formatFileSize(bytes?: number) {
    if (!bytes) return 'Desconocido'
    
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando fotos...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (fotos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <FileImage className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">No hay fotos disponibles</p>
            <p className="text-xs mt-1">Las fotos aparecerán aquí una vez subidas</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-medium">Fotos de la Garantía</h3>
          <Badge variant="outline">
            {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="text-xs text-gray-500">
          Principal: {fotos.find(f => f.tipo_foto === 'principal')?.nombre_archivo || 'No definida'}
        </div>
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {fotos.map((foto) => (
          <Card 
            key={foto.id} 
            className={`relative group overflow-hidden transition-all hover:shadow-lg ${
              foto.tipo_foto === 'principal' ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="aspect-square relative">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer w-full h-full">
                    <Image
                      src={foto.archivo_url}
                      alt={foto.descripcion || "Foto de garantía"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <div className="space-y-4">
                    <div className="relative aspect-video">
                      <Image
                        src={foto.archivo_url}
                        alt={foto.descripcion || "Foto de garantía"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Información de la foto */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Archivo:</strong> {foto.nombre_archivo}
                      </div>
                      <div>
                        <strong>Tipo:</strong> {foto.tipo_foto || 'detalle'}
                      </div>
                      <div>
                        <strong>Tamaño:</strong> {formatFileSize(foto.tamano_bytes)}
                      </div>
                      <div>
                        <strong>Fecha:</strong> {foto.created_at ? new Date(foto.created_at).toLocaleDateString('es-PE') : 'Desconocida'}
                      </div>
                      {foto.descripcion && (
                        <div className="col-span-2">
                          <strong>Descripción:</strong> {foto.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Badges y controles */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {foto.tipo_foto === 'principal' && (
                  <Badge className="bg-blue-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Principal
                  </Badge>
                )}
                
                {foto.tipo_foto === 'estado' && (
                  <Badge variant="secondary">Estado</Badge>
                )}
              </div>

              {/* Controles hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      setFotoSeleccionada(foto)
                    }}
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDescargar(foto)
                    }}
                    title="Descargar"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  {!readonly && foto.tipo_foto !== 'principal' && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        handleMarcarPrincipal(foto.id!)
                      }}
                      title="Marcar como principal"
                    >
                      <StarOff className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Info footer */}
            {foto.descripcion && (
              <div className="p-2 border-t">
                <p className="text-xs text-gray-600 truncate" title={foto.descripcion}>
                  {foto.descripcion}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <div className="text-xs text-gray-500 flex items-center justify-between">
        <span>
          <ImageIcon className="h-3 w-3 inline mr-1" />
          Total: {(fotos.reduce((acc, f) => acc + (f.tamano_bytes || 0), 0) / (1024 * 1024)).toFixed(1)} MB
        </span>
        <span>
          <Calendar className="h-3 w-3 inline mr-1" />
          Última: {fotos[0]?.created_at ? new Date(fotos[0].created_at).toLocaleDateString('es-PE') : 'N/A'}
        </span>
      </div>
    </div>
  )
}
