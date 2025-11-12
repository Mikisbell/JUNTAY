'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

interface DeleteClienteButtonProps {
  clienteId: string
  clienteNombre: string
}

export function DeleteClienteButton({ clienteId, clienteNombre }: DeleteClienteButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar a ${clienteNombre}? Esta acción no se puede deshacer.`)) {
      return
    }

    setDeleting(true)

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', clienteId)

      if (error) throw error

      // Redirigir al listado con mensaje de éxito
      router.push('/dashboard/clientes?success=Cliente eliminado exitosamente')
      router.refresh()
    } catch (error: any) {
      console.error('Error al eliminar cliente:', error)
      alert(`Error al eliminar: ${error.message}`)
      setDeleting(false)
    }
  }

  return (
    <Button 
      variant="destructive"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Eliminando...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </>
      )}
    </Button>
  )
}
