'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Cerrar sesión en Supabase
      await supabase.auth.signOut()
      
      // Refrescar el router
      router.refresh()
      
      // Redirigir a login con redirección completa para limpiar cookies
      window.location.href = '/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Aún así redirigir a login
      window.location.href = '/login'
    }
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-red-600"
      onClick={handleLogout}
    >
      <LogOut size={20} className="mr-2" />
      Cerrar Sesión
    </Button>
  )
}
