import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'

export interface SessionConfig {
  cajero: number      // 15 minutos
  supervisor: number  // 30 minutos  
  gerente: number     // 60 minutos
  admin: number       // 120 minutos
}

export interface SessionInfo {
  userId: string
  sessionToken: string
  expiresAt: Date
  lastActivity: Date
  role: string
  shouldRefresh: boolean
  valid: boolean
}

export class SessionManager {
  private static readonly SESSION_CONFIG: SessionConfig = {
    cajero: 15,
    supervisor: 30,
    gerente: 60,
    admin: 120
  }

  /**
   * Crea una nueva sesión para el usuario
   */
  static async createSession(
    userId: string, 
    role: string, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<string> {
    const supabase = createClient()
    
    // Generar token único
    const sessionToken = this.generateSessionToken()
    
    // Calcular expiración basada en rol
    const durationMinutes = this.SESSION_CONFIG[role as keyof SessionConfig] || 60
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000)
    
    // Invalidar sesiones anteriores del mismo usuario
    await supabase
      .from('sesiones_usuario')
      .update({ active: false })
      .eq('user_id', userId)
      .eq('active', true)

    // Crear nueva sesión
    const { error } = await supabase
      .from('sesiones_usuario')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: { role, created_by: 'session_manager' }
      })

    if (error) {
      throw new Error(`Error creando sesión: ${error.message}`)
    }

    // Registrar evento de seguridad
    await this.logSecurityEvent(
      userId,
      'session_created',
      `Nueva sesión creada para rol ${role}`,
      ipAddress,
      userAgent,
      'info',
      { role, duration_minutes: durationMinutes }
    )

    return sessionToken
  }

  /**
   * Valida una sesión existente
   */
  static async validateSession(sessionToken: string): Promise<SessionInfo | null> {
    const supabase = createClient()
    
    try {
      // Usar función SQL para validación eficiente
      const { data, error } = await supabase
        .rpc('validar_sesion', { p_session_token: sessionToken })
        .single()

      if (error || !data) {
        return null
      }

      return {
        userId: data.user_id,
        sessionToken,
        expiresAt: new Date(data.expires_at),
        lastActivity: new Date(),
        role: '', // Se obtendría de otra consulta si es necesario
        shouldRefresh: data.should_refresh,
        valid: data.valid
      }
    } catch (error) {
      console.error('Error validando sesión:', error)
      return null
    }
  }

  /**
   * Extiende una sesión activa
   */
  static async extendSession(sessionToken: string, role: string): Promise<boolean> {
    const supabase = createClient()
    
    const durationMinutes = this.SESSION_CONFIG[role as keyof SessionConfig] || 60
    
    try {
      const { data, error } = await supabase
        .rpc('extender_sesion', { 
          p_session_token: sessionToken,
          p_duracion_minutos: durationMinutes 
        })

      return !error && data === true
    } catch (error) {
      console.error('Error extendiendo sesión:', error)
      return false
    }
  }

  /**
   * Invalida una sesión (logout)
   */
  static async invalidateSession(sessionToken: string, userId?: string): Promise<void> {
    const supabase = createClient()
    
    await supabase
      .from('sesiones_usuario')
      .update({ active: false })
      .eq('session_token', sessionToken)

    if (userId) {
      await this.logSecurityEvent(
        userId,
        'session_invalidated',
        'Sesión invalidada por logout',
        undefined,
        undefined,
        'info'
      )
    }
  }

  /**
   * Invalida todas las sesiones de un usuario
   */
  static async invalidateAllUserSessions(userId: string): Promise<void> {
    const supabase = createClient()
    
    await supabase
      .from('sesiones_usuario')
      .update({ active: false })
      .eq('user_id', userId)
      .eq('active', true)

    await this.logSecurityEvent(
      userId,
      'all_sessions_invalidated',
      'Todas las sesiones del usuario fueron invalidadas',
      undefined,
      undefined,
      'warning'
    )
  }

  /**
   * Obtiene sesiones activas de un usuario
   */
  static async getUserActiveSessions(userId: string): Promise<Array<{
    id: string
    sessionToken: string
    createdAt: Date
    lastActivity: Date
    expiresAt: Date
    ipAddress?: string
    userAgent?: string
  }>> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('sesiones_usuario')
      .select('id, session_token, created_at, last_activity, expires_at, ip_address, user_agent')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map(session => ({
      id: session.id,
      sessionToken: session.session_token,
      createdAt: new Date(session.created_at),
      lastActivity: new Date(session.last_activity),
      expiresAt: new Date(session.expires_at),
      ipAddress: session.ip_address,
      userAgent: session.user_agent
    }))
  }

  /**
   * Limpia sesiones expiradas (para ejecutar periódicamente)
   */
  static async cleanupExpiredSessions(): Promise<number> {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .rpc('limpiar_sesiones_expiradas')

      if (error) {
        throw error
      }

      return data || 0
    } catch (error) {
      console.error('Error limpiando sesiones:', error)
      return 0
    }
  }

  /**
   * Obtiene estadísticas de sesiones
   */
  static async getSessionStats(): Promise<{
    total_active: number
    by_role: Record<string, number>
    expiring_soon: number
  }> {
    const supabase = createClient()
    
    const { data: activeSessions } = await supabase
      .from('sesiones_usuario')
      .select('metadata, expires_at')
      .eq('active', true)

    if (!activeSessions) {
      return { total_active: 0, by_role: {}, expiring_soon: 0 }
    }

    const byRole: Record<string, number> = {}
    let expiringSoon = 0
    const now = new Date()
    const soonThreshold = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutos

    for (const session of activeSessions) {
      const role = session.metadata?.role || 'unknown'
      byRole[role] = (byRole[role] || 0) + 1
      
      if (new Date(session.expires_at) <= soonThreshold) {
        expiringSoon++
      }
    }

    return {
      total_active: activeSessions.length,
      by_role: byRole,
      expiring_soon: expiringSoon
    }
  }

  /**
   * Genera un token de sesión único
   */
  private static generateSessionToken(): string {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2)
    const extraRandom = crypto.getRandomValues(new Uint8Array(16))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
    
    return `sess_${timestamp}_${randomPart}_${extraRandom}`
  }

  /**
   * Registra un evento de seguridad
   */
  private static async logSecurityEvent(
    userId: string,
    evento: string,
    descripcion: string,
    ipAddress?: string,
    userAgent?: string,
    nivel: 'info' | 'warning' | 'error' | 'critical' = 'info',
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const supabase = createClient()
    
    try {
      await supabase
        .rpc('registrar_evento_seguridad', {
          p_user_id: userId,
          p_evento: evento,
          p_descripcion: descripcion,
          p_ip_address: ipAddress,
          p_user_agent: userAgent,
          p_nivel: nivel,
          p_metadata: metadata
        })
    } catch (error) {
      console.error('Error registrando evento de seguridad:', error)
    }
  }

  /**
   * Middleware para Next.js que valida sesiones automáticamente
   */
  static async middleware(request: Request): Promise<{
    valid: boolean
    userId?: string
    shouldRefresh?: boolean
    redirectTo?: string
  }> {
    const sessionToken = this.extractSessionToken(request)
    
    if (!sessionToken) {
      return { valid: false, redirectTo: '/login' }
    }

    const sessionInfo = await this.validateSession(sessionToken)
    
    if (!sessionInfo || !sessionInfo.valid) {
      return { valid: false, redirectTo: '/login' }
    }

    return {
      valid: true,
      userId: sessionInfo.userId,
      shouldRefresh: sessionInfo.shouldRefresh
    }
  }

  /**
   * Extrae el token de sesión de la request
   */
  private static extractSessionToken(request: Request): string | null {
    // Intentar obtener de cookie
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)
      
      if (cookies['juntay-session']) {
        return cookies['juntay-session']
      }
    }

    // Intentar obtener de header Authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    return null
  }
}

// Configuración de timeouts por rol
export const ROLE_TIMEOUTS = {
  cajero: 15 * 60 * 1000,      // 15 minutos en ms
  supervisor: 30 * 60 * 1000,  // 30 minutos en ms
  gerente: 60 * 60 * 1000,     // 60 minutos en ms
  admin: 120 * 60 * 1000       // 120 minutos en ms
}

// Hook para React que maneja timeout automático
export function useSessionTimeout(role: string, onTimeout: () => void) {
  const timeout = ROLE_TIMEOUTS[role as keyof typeof ROLE_TIMEOUTS] || ROLE_TIMEOUTS.cajero
  
  // Implementar lógica de timeout en el cliente
  // Este hook se usaría en componentes React para manejar el timeout automático
}
