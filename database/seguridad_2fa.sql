-- =====================================================
-- SISTEMA DE SEGURIDAD 2FA PARA JUNTAY
-- Implementación de autenticación de dos factores
-- =====================================================

-- Tabla para configuración 2FA de usuarios
CREATE TABLE IF NOT EXISTS usuarios_2fa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Secretos para autenticación
    secret TEXT, -- Secreto activo para TOTP
    secret_temp TEXT, -- Secreto temporal durante setup
    
    -- Códigos de backup para emergencias
    backup_codes TEXT[], -- Array de códigos de respaldo
    
    -- Estado de configuración
    setup_completed BOOLEAN DEFAULT FALSE,
    
    -- Control de seguridad
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- Auditoría
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE(user_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_2fa_user_id ON usuarios_2fa(user_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_2fa_setup ON usuarios_2fa(setup_completed);
CREATE INDEX IF NOT EXISTS idx_usuarios_2fa_locked ON usuarios_2fa(locked_until) WHERE locked_until IS NOT NULL;

-- Tabla para logs de seguridad
CREATE TABLE IF NOT EXISTS logs_seguridad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Información del evento
    evento TEXT NOT NULL, -- 'login_success', 'login_failed', '2fa_setup', '2fa_failed', etc.
    descripcion TEXT,
    
    -- Contexto técnico
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    
    -- Datos adicionales
    metadata JSONB DEFAULT '{}',
    
    -- Severidad del evento
    nivel TEXT CHECK (nivel IN ('info', 'warning', 'error', 'critical')) DEFAULT 'info',
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_logs_seguridad_user_id ON logs_seguridad(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_seguridad_evento ON logs_seguridad(evento);
CREATE INDEX IF NOT EXISTS idx_logs_seguridad_nivel ON logs_seguridad(nivel);
CREATE INDEX IF NOT EXISTS idx_logs_seguridad_fecha ON logs_seguridad(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_seguridad_ip ON logs_seguridad(ip_address);

-- Tabla para sesiones de usuario con timeout
CREATE TABLE IF NOT EXISTS sesiones_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Información de sesión
    session_token TEXT NOT NULL UNIQUE,
    
    -- Control de tiempo
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Información del dispositivo
    ip_address INET,
    user_agent TEXT,
    device_fingerprint TEXT,
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    
    -- Metadata adicional
    metadata JSONB DEFAULT '{}'
);

-- Índices para sesiones
CREATE INDEX IF NOT EXISTS idx_sesiones_user_id ON sesiones_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_token ON sesiones_usuario(session_token);
CREATE INDEX IF NOT EXISTS idx_sesiones_expires ON sesiones_usuario(expires_at);
CREATE INDEX IF NOT EXISTS idx_sesiones_active ON sesiones_usuario(active);

-- Función para limpiar sesiones expiradas
CREATE OR REPLACE FUNCTION limpiar_sesiones_expiradas()
RETURNS INTEGER AS $$
DECLARE
    sesiones_eliminadas INTEGER;
BEGIN
    -- Marcar como inactivas las sesiones expiradas
    UPDATE sesiones_usuario 
    SET active = FALSE 
    WHERE expires_at < NOW() AND active = TRUE;
    
    GET DIAGNOSTICS sesiones_eliminadas = ROW_COUNT;
    
    -- Log de limpieza
    INSERT INTO logs_seguridad (evento, descripcion, nivel, metadata)
    VALUES (
        'session_cleanup',
        'Limpieza automática de sesiones expiradas',
        'info',
        jsonb_build_object('sesiones_eliminadas', sesiones_eliminadas)
    );
    
    RETURN sesiones_eliminadas;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar eventos de seguridad
CREATE OR REPLACE FUNCTION registrar_evento_seguridad(
    p_user_id UUID,
    p_evento TEXT,
    p_descripcion TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_nivel TEXT DEFAULT 'info',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO logs_seguridad (
        user_id, evento, descripcion, ip_address, 
        user_agent, nivel, metadata
    )
    VALUES (
        p_user_id, p_evento, p_descripcion, p_ip_address,
        p_user_agent, p_nivel, p_metadata
    )
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Función para validar sesión activa
CREATE OR REPLACE FUNCTION validar_sesion(p_session_token TEXT)
RETURNS TABLE (
    user_id UUID,
    valid BOOLEAN,
    expires_at TIMESTAMPTZ,
    should_refresh BOOLEAN
) AS $$
DECLARE
    sesion_record RECORD;
BEGIN
    -- Buscar sesión
    SELECT s.user_id, s.expires_at, s.last_activity, s.active
    INTO sesion_record
    FROM sesiones_usuario s
    WHERE s.session_token = p_session_token;
    
    -- Si no existe la sesión
    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::UUID, FALSE, NULL::TIMESTAMPTZ, FALSE;
        RETURN;
    END IF;
    
    -- Si la sesión está inactiva
    IF NOT sesion_record.active THEN
        RETURN QUERY SELECT sesion_record.user_id, FALSE, sesion_record.expires_at, FALSE;
        RETURN;
    END IF;
    
    -- Si la sesión expiró
    IF sesion_record.expires_at < NOW() THEN
        -- Marcar como inactiva
        UPDATE sesiones_usuario 
        SET active = FALSE 
        WHERE session_token = p_session_token;
        
        RETURN QUERY SELECT sesion_record.user_id, FALSE, sesion_record.expires_at, FALSE;
        RETURN;
    END IF;
    
    -- Sesión válida - actualizar última actividad
    UPDATE sesiones_usuario 
    SET last_activity = NOW()
    WHERE session_token = p_session_token;
    
    -- Determinar si debe refrescar (si queda menos de 15 minutos)
    RETURN QUERY SELECT 
        sesion_record.user_id, 
        TRUE, 
        sesion_record.expires_at,
        (sesion_record.expires_at - NOW()) < INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql;

-- Función para extender sesión
CREATE OR REPLACE FUNCTION extender_sesion(
    p_session_token TEXT,
    p_duracion_minutos INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
    nueva_expiracion TIMESTAMPTZ;
BEGIN
    nueva_expiracion := NOW() + (p_duracion_minutos || ' minutes')::INTERVAL;
    
    UPDATE sesiones_usuario 
    SET 
        expires_at = nueva_expiracion,
        last_activity = NOW()
    WHERE session_token = p_session_token AND active = TRUE;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Trigger para limpiar automáticamente sesiones muy antiguas
CREATE OR REPLACE FUNCTION trigger_limpiar_sesiones_antiguas()
RETURNS TRIGGER AS $$
BEGIN
    -- Eliminar sesiones inactivas de más de 7 días
    DELETE FROM sesiones_usuario 
    WHERE active = FALSE 
    AND created_at < NOW() - INTERVAL '7 days';
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger que se ejecuta después de insertar logs
CREATE TRIGGER trigger_cleanup_sesiones
    AFTER INSERT ON logs_seguridad
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_limpiar_sesiones_antiguas();

-- Políticas RLS (Row Level Security)
ALTER TABLE usuarios_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_seguridad ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_usuario ENABLE ROW LEVEL SECURITY;

-- Política para usuarios_2fa: solo el propio usuario puede ver su configuración
CREATE POLICY "usuarios_pueden_ver_su_2fa" ON usuarios_2fa
    FOR ALL USING (auth.uid() = user_id);

-- Política para logs: solo admins pueden ver todos los logs
CREATE POLICY "admins_pueden_ver_logs" ON logs_seguridad
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'gerente')
        )
    );

-- Política para logs: usuarios pueden ver sus propios logs
CREATE POLICY "usuarios_pueden_ver_sus_logs" ON logs_seguridad
    FOR SELECT USING (auth.uid() = user_id);

-- Política para sesiones: solo el propio usuario puede ver sus sesiones
CREATE POLICY "usuarios_pueden_ver_sus_sesiones" ON sesiones_usuario
    FOR ALL USING (auth.uid() = user_id);

-- Insertar algunos eventos de ejemplo para testing
INSERT INTO logs_seguridad (evento, descripcion, nivel) VALUES
('system_init', 'Sistema de seguridad 2FA inicializado', 'info'),
('database_setup', 'Tablas de seguridad creadas correctamente', 'info');

-- Comentarios para documentación
COMMENT ON TABLE usuarios_2fa IS 'Configuración de autenticación de dos factores por usuario';
COMMENT ON TABLE logs_seguridad IS 'Registro de eventos de seguridad del sistema';
COMMENT ON TABLE sesiones_usuario IS 'Control de sesiones activas con timeout automático';

COMMENT ON FUNCTION limpiar_sesiones_expiradas() IS 'Limpia sesiones expiradas y registra estadísticas';
COMMENT ON FUNCTION registrar_evento_seguridad(UUID, TEXT, TEXT, INET, TEXT, TEXT, JSONB) IS 'Registra eventos de seguridad con contexto completo';
COMMENT ON FUNCTION validar_sesion(TEXT) IS 'Valida si una sesión está activa y actualiza última actividad';
COMMENT ON FUNCTION extender_sesion(TEXT, INTEGER) IS 'Extiende la duración de una sesión activa';

-- Mostrar resumen de creación
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema de seguridad 2FA creado exitosamente';
    RAISE NOTICE '📊 Tablas creadas: usuarios_2fa, logs_seguridad, sesiones_usuario';
    RAISE NOTICE '🔧 Funciones creadas: 4 funciones de seguridad';
    RAISE NOTICE '🛡️ Políticas RLS aplicadas para protección de datos';
    RAISE NOTICE '⚡ Índices optimizados para performance';
END $$;
