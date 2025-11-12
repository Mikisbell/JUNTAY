import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Obtener y refrescar sesión
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  // Verificar si hay una sesión válida (más estricto)
  const hasValidSession = 
    session && 
    !sessionError && 
    session.user && 
    session.access_token &&
    session.expires_at &&
    new Date(session.expires_at * 1000) > new Date()

  // Si hay error de sesión o cookies inválidas, limpiar
  if (sessionError || (session && !hasValidSession)) {
    // Limpiar cookies de Supabase inválidas
    const authCookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`
    ]
    
    authCookieNames.forEach(name => {
      response.cookies.delete(name)
    })
  }

  // Proteger rutas del dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!hasValidSession) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // NO redirigir de login a dashboard automáticamente
  // Dejar que el usuario haga login primero
  // Esto evita loops cuando hay cookies inválidas

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ],
}
