import { createClient } from '@/lib/supabase/server'

export async function UserNav() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const email = user.email || ''
  const initials = email
    .split('@')[0]
    .split('.')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-sm font-medium">{email.split('@')[0]}</p>
        <p className="text-xs text-gray-600">
          {user.user_metadata?.rol || 'Usuario'}
        </p>
      </div>
      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
        {initials}
      </div>
    </div>
  )
}
