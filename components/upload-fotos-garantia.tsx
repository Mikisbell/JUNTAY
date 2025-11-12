'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

interface UploadFotosGarantiaProps {
  garantiaId: string
  onUploadComplete?: () => void
}

export function UploadFotosGarantia({ garantiaId, onUploadComplete }: UploadFotosGarantiaProps) {
  const [uploading, setUploading] = useState(false)
  const [fotos, setFotos] = useState<Array<{ url: string; id: string }>>([])
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const uploadedFotos: Array<{ url: string; id: string }> = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} no es una imagen`)
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} es muy grande (máx 5MB)`)
        }

        // Crear nombre único
        const fileExt = file.name.split('.').pop()
        const fileName = `${garantiaId}/${Date.now()}-${i}.${fileExt}`

        // Subir a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('garantias')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('garantias')
          .getPublicUrl(fileName)

        // Guardar referencia en BD
        const { data: fotoData, error: fotoError } = await supabase
          .from('garantia_fotos')
          .insert([{
            garantia_id: garantiaId,
            url: publicUrl,
            es_principal: fotos.length === 0 && i === 0, // Primera foto es principal
            orden: fotos.length + i
          }])
          .select()
          .single()

        if (fotoError) throw fotoError

        uploadedFotos.push({
          url: publicUrl,
          id: fotoData.id
        })
      }

      setFotos([...fotos, ...uploadedFotos])
      onUploadComplete?.()
    } catch (err: any) {
      console.error('Error al subir fotos:', err)
      setError(err.message || 'Error al subir fotos')
    } finally {
      setUploading(false)
      // Resetear input
      e.target.value = ''
    }
  }

  async function handleDeleteFoto(fotoId: string, fotoUrl: string) {
    try {
      // Extraer path de la URL
      const urlParts = fotoUrl.split('/garantias/')
      if (urlParts.length < 2) throw new Error('URL inválida')
      
      const filePath = urlParts[1]

      // Eliminar de storage
      const { error: storageError } = await supabase.storage
        .from('garantias')
        .remove([filePath])

      if (storageError) throw storageError

      // Eliminar de BD
      const { error: dbError } = await supabase
        .from('garantia_fotos')
        .delete()
        .eq('id', fotoId)

      if (dbError) throw dbError

      // Actualizar estado local
      setFotos(fotos.filter(f => f.id !== fotoId))
      onUploadComplete?.()
    } catch (err: any) {
      console.error('Error al eliminar foto:', err)
      setError(err.message)
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
                  src={foto.url}
                  alt="Foto de garantía"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFoto(foto.id, foto.url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
        ℹ️ Máximo 5MB por foto. Formatos: JPG, PNG, WebP
      </p>
    </div>
  )
}
