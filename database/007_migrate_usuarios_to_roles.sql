-- =====================================================
-- MIGRACIÓN DE USUARIOS A SISTEMA DE ROLES - JUNTAY
-- =====================================================
-- Script para migrar tabla usuarios existente al nuevo sistema de roles
-- Fecha: Nov 13, 2025

-- =====================================================
-- PASO 1: CREAR TABLAS DE ROLES (SI NO EXISTEN)
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

CREATE TABLE IF NOT EXISTS permisos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    modulo VARCHAR(50) NOT NULL, -- 'clientes', 'creditos', 'caja', etc.
    accion VARCHAR(50) NOT NULL, -- 'ver', 'crear', 'editar', 'eliminar', 'aprobar'
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(modulo, accion)
);

CREATE TABLE IF NOT EXISTS roles_permisos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rol_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id UUID REFERENCES permisos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rol_id, permiso_id)
);

-- =====================================================
-- PASO 2: INSERTAR ROLES PREDEFINIDOS
-- =====================================================
INSERT INTO roles (nombre, descripcion, nivel_acceso) VALUES
('administrador', 'Acceso total al sistema', 4),
('gerente', 'Gestión completa, reportes y aprobaciones', 3),
('asesor_credito', 'Evaluación y creación de créditos', 2),
('cajero', 'Operaciones de caja y pagos', 1),
('analista', 'Consulta y reportes básicos', 1)
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- PASO 3: INSERTAR PERMISOS BÁSICOS
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
-- PASO 4: ASIGNAR PERMISOS A ROLES
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
-- PASO 5: MIGRAR TABLA USUARIOS EXISTENTE
-- =====================================================

-- Agregar nuevas columnas a la tabla usuarios existente
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol_id UUID REFERENCES roles(id);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS limite_credito_diario DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS limite_credito_individual DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS requiere_aprobacion_creditos BOOLEAN DEFAULT true;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS puede_aprobar_creditos BOOLEAN DEFAULT false;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cargo VARCHAR(100);

-- Migrar roles existentes al nuevo sistema
UPDATE usuarios SET rol_id = (
    CASE 
        WHEN rol = 'admin' THEN (SELECT id FROM roles WHERE nombre = 'administrador')
        WHEN rol = 'gerente' THEN (SELECT id FROM roles WHERE nombre = 'gerente')
        WHEN rol = 'cajero' THEN (SELECT id FROM roles WHERE nombre = 'cajero')
        WHEN rol = 'analista' THEN (SELECT id FROM roles WHERE nombre = 'analista')
        ELSE (SELECT id FROM roles WHERE nombre = 'asesor_credito')
    END
) WHERE rol_id IS NULL;

-- Establecer límites por defecto según el rol
UPDATE usuarios SET 
    limite_credito_diario = CASE 
        WHEN rol = 'admin' THEN 50000.00
        WHEN rol = 'gerente' THEN 20000.00
        WHEN rol = 'cajero' THEN 0.00
        WHEN rol = 'analista' THEN 0.00
        ELSE 5000.00 -- asesor_credito
    END,
    limite_credito_individual = CASE 
        WHEN rol = 'admin' THEN 10000.00
        WHEN rol = 'gerente' THEN 5000.00
        WHEN rol = 'cajero' THEN 0.00
        WHEN rol = 'analista' THEN 0.00
        ELSE 1000.00 -- asesor_credito
    END,
    requiere_aprobacion_creditos = CASE 
        WHEN rol IN ('admin', 'gerente') THEN false
        ELSE true
    END,
    puede_aprobar_creditos = CASE 
        WHEN rol IN ('admin', 'gerente') THEN true
        ELSE false
    END
WHERE limite_credito_diario = 0.00 AND limite_credito_individual = 0.00;

-- =====================================================
-- PASO 6: CREAR FUNCIONES PARA VERIFICAR PERMISOS
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
-- PASO 7: HABILITAR RLS EN NUEVAS TABLAS
-- =====================================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles_permisos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 8: CREAR POLÍTICAS RLS
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
-- PASO 9: CREAR ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_roles_permisos_rol_id ON roles_permisos(rol_id);
CREATE INDEX IF NOT EXISTS idx_roles_permisos_permiso_id ON roles_permisos(permiso_id);
CREATE INDEX IF NOT EXISTS idx_permisos_modulo_accion ON permisos(modulo, accion);

-- =====================================================
-- PASO 10: TRIGGERS PARA AUDITORÍA
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
-- VERIFICACIÓN FINAL
-- =====================================================
-- Mostrar resumen de la migración
SELECT 
    'Migración completada' as status,
    (SELECT COUNT(*) FROM roles) as total_roles,
    (SELECT COUNT(*) FROM permisos) as total_permisos,
    (SELECT COUNT(*) FROM usuarios WHERE rol_id IS NOT NULL) as usuarios_migrados,
    (SELECT COUNT(*) FROM roles_permisos) as asignaciones_permisos;
