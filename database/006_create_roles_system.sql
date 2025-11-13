-- =====================================================
-- SISTEMA DE ROLES Y PERMISOS - JUNTAY
-- =====================================================
-- Script para crear sistema de roles granulares
-- Fecha: Nov 13, 2025

-- =====================================================
-- TABLA: ROLES
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    nivel_acceso INTEGER DEFAULT 1, -- 1=Básico, 2=Intermedio, 3=Avanzado, 4=Administrador
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: PERMISOS
-- =====================================================
CREATE TABLE IF NOT EXISTS permisos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    modulo VARCHAR(50) NOT NULL, -- 'clientes', 'creditos', 'caja', etc.
    accion VARCHAR(50) NOT NULL, -- 'ver', 'crear', 'editar', 'eliminar', 'aprobar'
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: ROLES_PERMISOS (Relación muchos a muchos)
-- =====================================================
CREATE TABLE IF NOT EXISTS roles_permisos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rol_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id UUID REFERENCES permisos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rol_id, permiso_id)
);

-- =====================================================
-- TABLA: USUARIOS (Extender auth.users de Supabase)
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id),
    rol_id UUID REFERENCES roles(id),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    cargo VARCHAR(100),
    limite_credito_diario DECIMAL(10,2) DEFAULT 0.00,
    limite_credito_individual DECIMAL(10,2) DEFAULT 0.00,
    requiere_aprobacion_creditos BOOLEAN DEFAULT true,
    puede_aprobar_creditos BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INSERTAR ROLES PREDEFINIDOS
-- =====================================================
INSERT INTO roles (nombre, descripcion, nivel_acceso) VALUES
('administrador', 'Acceso total al sistema', 4),
('gerente', 'Gestión completa, reportes y aprobaciones', 3),
('asesor_credito', 'Evaluación y creación de créditos', 2),
('cajero', 'Operaciones de caja y pagos', 1),
('analista', 'Consulta y reportes básicos', 1)
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- INSERTAR PERMISOS BÁSICOS
-- =====================================================
INSERT INTO permisos (modulo, accion, descripcion) VALUES
-- Módulo Clientes
('clientes', 'ver', 'Ver información de clientes'),
('clientes', 'crear', 'Registrar nuevos clientes'),
('clientes', 'editar', 'Modificar datos de clientes'),
('clientes', 'eliminar', 'Eliminar clientes'),

-- Módulo Créditos
('creditos', 'ver', 'Ver información de créditos'),
('creditos', 'crear', 'Crear nuevos créditos'),
('creditos', 'editar', 'Modificar créditos existentes'),
('creditos', 'aprobar', 'Aprobar solicitudes de crédito'),
('creditos', 'desembolsar', 'Realizar desembolsos'),
('creditos', 'eliminar', 'Cancelar/eliminar créditos'),

-- Módulo Garantías
('garantias', 'ver', 'Ver garantías'),
('garantias', 'crear', 'Registrar nuevas garantías'),
('garantias', 'editar', 'Modificar garantías'),
('garantias', 'tasar', 'Realizar tasaciones'),
('garantias', 'eliminar', 'Eliminar garantías'),

-- Módulo Caja
('caja', 'ver', 'Ver movimientos de caja'),
('caja', 'abrir', 'Abrir sesiones de caja'),
('caja', 'cerrar', 'Cerrar sesiones de caja'),
('caja', 'movimientos', 'Registrar movimientos'),
('caja', 'arqueos', 'Realizar arqueos'),

-- Módulo Pagos
('pagos', 'ver', 'Ver pagos registrados'),
('pagos', 'registrar', 'Registrar nuevos pagos'),
('pagos', 'editar', 'Modificar pagos'),
('pagos', 'eliminar', 'Anular pagos'),

-- Módulo Reportes
('reportes', 'basicos', 'Ver reportes básicos'),
('reportes', 'financieros', 'Ver reportes financieros'),
('reportes', 'gerenciales', 'Ver reportes gerenciales'),
('reportes', 'auditoria', 'Ver reportes de auditoría'),

-- Módulo Configuración
('configuracion', 'ver', 'Ver configuraciones'),
('configuracion', 'editar', 'Modificar configuraciones'),
('configuracion', 'usuarios', 'Gestionar usuarios'),
('configuracion', 'empresa', 'Configurar datos empresa')

ON CONFLICT (modulo, accion) DO NOTHING;

-- =====================================================
-- ASIGNAR PERMISOS A ROLES
-- =====================================================

-- ADMINISTRADOR: Todos los permisos
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r, permisos p
WHERE r.nombre = 'administrador'
ON CONFLICT (rol_id, permiso_id) DO NOTHING;

-- GERENTE: Casi todos excepto configuración de usuarios
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r, permisos p
WHERE r.nombre = 'gerente'
AND p.accion NOT IN ('usuarios')
ON CONFLICT (rol_id, permiso_id) DO NOTHING;

-- ASESOR DE CRÉDITO: Créditos, clientes, garantías
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r, permisos p
WHERE r.nombre = 'asesor_credito'
AND p.modulo IN ('clientes', 'creditos', 'garantias', 'reportes')
AND p.accion NOT IN ('eliminar', 'aprobar')
ON CONFLICT (rol_id, permiso_id) DO NOTHING;

-- CAJERO: Caja, pagos, ver créditos
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r, permisos p
WHERE r.nombre = 'cajero'
AND (
    (p.modulo = 'caja') OR
    (p.modulo = 'pagos') OR
    (p.modulo = 'creditos' AND p.accion = 'ver') OR
    (p.modulo = 'clientes' AND p.accion = 'ver') OR
    (p.modulo = 'reportes' AND p.accion = 'basicos')
)
ON CONFLICT (rol_id, permiso_id) DO NOTHING;

-- ANALISTA: Solo lectura y reportes básicos
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r, permisos p
WHERE r.nombre = 'analista'
AND p.accion IN ('ver', 'basicos')
ON CONFLICT (rol_id, permiso_id) DO NOTHING;

-- =====================================================
-- FUNCIÓN PARA VERIFICAR PERMISOS
-- =====================================================
CREATE OR REPLACE FUNCTION verificar_permiso(
    usuario_uuid UUID,
    modulo_param VARCHAR,
    accion_param VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    tiene_permiso BOOLEAN := FALSE;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM usuarios u
        JOIN roles_permisos rp ON u.rol_id = rp.rol_id
        JOIN permisos p ON rp.permiso_id = p.id
        WHERE u.id = usuario_uuid
        AND p.modulo = modulo_param
        AND p.accion = accion_param
        AND u.activo = true
        AND p.activo = true
    ) INTO tiene_permiso;
    
    RETURN tiene_permiso;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCIÓN PARA OBTENER PERMISOS DE USUARIO
-- =====================================================
CREATE OR REPLACE FUNCTION obtener_permisos_usuario(usuario_uuid UUID)
RETURNS TABLE(modulo VARCHAR, accion VARCHAR, descripcion TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT p.modulo, p.accion, p.descripcion
    FROM usuarios u
    JOIN roles_permisos rp ON u.rol_id = rp.rol_id
    JOIN permisos p ON rp.permiso_id = p.id
    WHERE u.id = usuario_uuid
    AND u.activo = true
    AND p.activo = true
    ORDER BY p.modulo, p.accion;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS PARA AUDITORÍA
-- =====================================================
CREATE OR REPLACE FUNCTION audit_usuario_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = NOW();
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_usuarios_updated_at ON usuarios;
CREATE TRIGGER trigger_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION audit_usuario_changes();

-- =====================================================
-- HABILITAR RLS EN NUEVAS TABLAS
-- =====================================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles_permisos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS PARA ROLES Y PERMISOS
-- =====================================================

-- Solo administradores pueden gestionar roles
CREATE POLICY "Solo admins pueden ver roles" ON roles
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM usuarios u 
            JOIN roles r ON u.rol_id = r.id 
            WHERE u.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- Todos pueden ver permisos (para UI)
CREATE POLICY "Usuarios autenticados pueden ver permisos" ON permisos
    FOR SELECT USING (auth.role() = 'authenticated');

-- Solo administradores pueden ver asignaciones de permisos
CREATE POLICY "Solo admins pueden ver roles_permisos" ON roles_permisos
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM usuarios u 
            JOIN roles r ON u.rol_id = r.id 
            WHERE u.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa_id ON usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_roles_permisos_rol_id ON roles_permisos(rol_id);
CREATE INDEX IF NOT EXISTS idx_roles_permisos_permiso_id ON roles_permisos(permiso_id);
CREATE INDEX IF NOT EXISTS idx_permisos_modulo_accion ON permisos(modulo, accion);

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================
COMMENT ON TABLE roles IS 'Roles del sistema con niveles de acceso';
COMMENT ON TABLE permisos IS 'Permisos granulares por módulo y acción';
COMMENT ON TABLE roles_permisos IS 'Asignación de permisos a roles';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema con roles y límites';
COMMENT ON FUNCTION verificar_permiso IS 'Verifica si un usuario tiene un permiso específico';
COMMENT ON FUNCTION obtener_permisos_usuario IS 'Obtiene todos los permisos de un usuario';
