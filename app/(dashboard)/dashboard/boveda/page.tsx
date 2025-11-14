import { redirect } from 'next/navigation'

// Redirigir automáticamente a la primera subsección
export default function BovedaPage() {
  redirect('/dashboard/boveda/saldos')
}
