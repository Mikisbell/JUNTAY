'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
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
