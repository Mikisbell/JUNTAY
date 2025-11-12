'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { getFotosGarantia, subirFotoGarantia, eliminarFotoGarantia, type FotoGarantia } from '@/lib/api/fotos-garantias'
import Image from 'next/image'
import { toast } from 'sonner'

interface UploadFotosGarantiaProps {
  garantiaId: string
  onUploadComplete?: () => void
}

export function UploadFotosGarantia({ garantiaId, onUploadComplete }: UploadFotosGarantiaProps) {
  const [uploading, setUploading] = useState(false)
  const [fotos, setFotos] = useState<FotoGarantia[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const uploadedFotos: FotoGarantia[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen válida`)
          continue
        }

        // Validar tamaño (máx 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} es muy grande (máx 10MB)`)
          continue
        }

        // Usar la nueva API para subir
        const tipoFoto = fotos.length === 0 && i === 0 ? 'principal' : 'detalle'
        const result = await subirFotoGarantia(
          garantiaId,
          file,
          tipoFoto,
          `Foto ${fotos.length + i + 1}`
        )

        if (result.success && result.foto) {
          uploadedFotos.push(result.foto)
          toast.success(`${file.name} subida correctamente`)
        } else {
          toast.error(result.error || `Error al subir ${file.name}`)
        }
      }

      if (uploadedFotos.length > 0) {
        setFotos([...fotos, ...uploadedFotos])
        onUploadComplete?.()
      }
    } catch (err: any) {
      console.error('Error al subir fotos:', err)
      setError(err.message || 'Error al subir fotos')
      toast.error('Error al subir fotos')
    } finally {
      setUploading(false)
      // Resetear input
      e.target.value = ''
    }
  }

  async function handleDeleteFoto(fotoId: string) {
    try {
      const result = await eliminarFotoGarantia(fotoId)
      
      if (result.success) {
        // Actualizar estado local
        setFotos(fotos.filter(f => f.id !== fotoId))
        toast.success('Foto eliminada correctamente')
        onUploadComplete?.()
      } else {
        toast.error(result.error || 'Error al eliminar foto')
      }
    } catch (err: any) {
      console.error('Error al eliminar foto:', err)
      setError(err.message)
      toast.error('Error al eliminar foto')
    }
  }

  return (
    <div className="space-y-4">
      {/* Botón de upload */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          id="foto-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <label htmlFor="foto-upload">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('foto-upload')?.click()}
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Fotos
                </>
              )}
            </span>
          </Button>
        </label>
        <p className="text-sm text-gray-600">
          {fotos.length} foto{fotos.length !== 1 ? 's' : ''} subida{fotos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Grid de fotos */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto) => (
            <Card key={foto.id} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={foto.archivo_url}
                  alt={foto.descripcion || "Foto de garantía"}
                  fill
                  className="object-cover"
                />
                {foto.tipo_foto === 'principal' && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Principal
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFoto(foto.id!)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {foto.descripcion && (
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{foto.descripcion}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Mensaje si no hay fotos */}
      {fotos.length === 0 && !uploading && (
        <Card className="border-dashed border-2">
          <div className="p-8 text-center text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">No hay fotos cargadas</p>
            <p className="text-xs mt-1">Click en "Subir Fotos" para agregar imágenes</p>
          </div>
        </Card>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500">
        ℹ️ Máximo 10MB por foto. Formatos: JPG, PNG, WebP. Primera foto será marcada como principal.
      </p>
    </div>
  )
}
