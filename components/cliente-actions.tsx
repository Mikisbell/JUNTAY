'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, Edit, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

interface ClienteActionsProps {
  clienteId: string
}

export function ClienteActions({ clienteId }: ClienteActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
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
    <div className="flex items-center justify-end space-x-2">
      <Link href={`/dashboard/clientes/${clienteId}`}>
        <Button variant="ghost" size="icon" title="Ver detalle">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/dashboard/clientes/${clienteId}/editar`}>
        <Button variant="ghost" size="icon" title="Editar">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Eliminar"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
