import { redirect } from 'next/navigation'

// Redirigir automáticamente a Mi Caja
export default function CajasPage() {
  redirect('/dashboard/cajas/mi-caja')
}
