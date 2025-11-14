import { redirect } from 'next/navigation'

// Redirigir automáticamente a nuevo préstamo
export default function OperacionesPage() {
  redirect('/dashboard/operaciones/nuevo-prestamo')
}
