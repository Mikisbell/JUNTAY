-- =====================================================
-- SCRIPT SEGURO: RECREAR MÓDULO DE CONTROL DE CAJA
-- Elimina tablas existentes y las recrea
-- =====================================================

-- IMPORTANTE: Este script eliminará todas las tablas de caja
-- y sus datos. Solo ejecutar si estás seguro.

-- =====================================================
-- 1. ELIMINAR TABLAS EXISTENTES (en orden por dependencias)
-- =====================================================

-- Eliminar todo con CASCADE (las vistas, triggers y funciones se eliminarán automáticamente)
DROP TABLE IF EXISTS transferencias_caja CASCADE;
DROP TABLE IF EXISTS gastos CASCADE;
DROP TABLE IF EXISTS arqueos_caja CASCADE;
DROP TABLE IF EXISTS movimientos_caja CASCADE;
DROP TABLE IF EXISTS sesiones_caja CASCADE;
DROP TABLE IF EXISTS cajas CASCADE;

-- También eliminar tabla antigua si existe
DROP TABLE IF EXISTS cajas_apertura_cierre CASCADE;

-- Eliminar función si existe (después de eliminar tablas)
DROP FUNCTION IF EXISTS actualizar_totales_sesion() CASCADE;

-- =====================================================
-- 2. CREAR TABLAS NUEVAS
-- =====================================================

-- Tabla de cajas (puntos de cobro/pago)
CREATE TABLE cajas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255),
    
    estado VARCHAR(20) NOT NULL DEFAULT 'cerrada',
    activa BOOLEAN DEFAULT true,
    
    responsable_actual_id UUID REFERENCES usuarios(id),
    fecha_ultima_apertura TIMESTAMP WITH TIME ZONE,
    fecha_ultimo_cierre TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sesiones de caja
CREATE TABLE sesiones_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caja_id UUID REFERENCES cajas(id),
    numero_sesion INTEGER NOT NULL,
    
    fecha_apertura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usuario_apertura_id UUID REFERENCES usuarios(id),
    monto_inicial DECIMAL(12,2) NOT NULL DEFAULT 0,
    billetes_apertura JSON,
    observaciones_apertura TEXT,
    
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    usuario_cierre_id UUID REFERENCES usuarios(id),
    monto_sistema DECIMAL(12,2),
    monto_contado DECIMAL(12,2),
    diferencia DECIMAL(12,2),
    billetes_cierre JSON,
    observaciones_cierre TEXT,
    
    total_ingresos DECIMAL(12,2) DEFAULT 0,
    total_egresos DECIMAL(12,2) DEFAULT 0,
    total_movimientos INTEGER DEFAULT 0,
    
    estado VARCHAR(20) NOT NULL DEFAULT 'abierta',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(caja_id, numero_sesion)
);

-- Tabla de movimientos de caja
CREATE TABLE movimientos_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sesion_id UUID REFERENCES sesiones_caja(id),
    caja_id UUID REFERENCES cajas(id),
    
    tipo VARCHAR(30) NOT NULL,
    concepto VARCHAR(50) NOT NULL,
    
    referencia_tipo VARCHAR(30),
    referencia_id UUID,
    referencia_codigo VARCHAR(50),
    
    monto DECIMAL(12,2) NOT NULL,
    saldo_anterior DECIMAL(12,2) NOT NULL,
    saldo_nuevo DECIMAL(12,2) NOT NULL,
    
    descripcion TEXT,
    comprobante_numero VARCHAR(50),
    metodo_pago VARCHAR(30),
    
    usuario_id UUID REFERENCES usuarios(id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    anulado BOOLEAN DEFAULT false,
    fecha_anulacion TIMESTAMP WITH TIME ZONE,
    usuario_anulacion_id UUID REFERENCES usuarios(id),
    motivo_anulacion TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de arqueos de caja
CREATE TABLE arqueos_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sesion_id UUID REFERENCES sesiones_caja(id),
    caja_id UUID REFERENCES cajas(id),
    
    tipo VARCHAR(20) NOT NULL,
    
    monto_sistema DECIMAL(12,2) NOT NULL,
    monto_contado DECIMAL(12,2) NOT NULL,
    diferencia DECIMAL(12,2) NOT NULL,
    
    billetes_200 INTEGER DEFAULT 0,
    billetes_100 INTEGER DEFAULT 0,
    billetes_50 INTEGER DEFAULT 0,
    billetes_20 INTEGER DEFAULT 0,
    billetes_10 INTEGER DEFAULT 0,
    monedas_5 INTEGER DEFAULT 0,
    monedas_2 INTEGER DEFAULT 0,
    monedas_1 INTEGER DEFAULT 0,
    monedas_050 INTEGER DEFAULT 0,
    monedas_020 INTEGER DEFAULT 0,
    monedas_010 INTEGER DEFAULT 0,
    
    detalle_efectivo JSON,
    
    observaciones TEXT,
    justificacion_diferencia TEXT,
    
    realizado_por UUID REFERENCES usuarios(id),
    supervisado_por UUID REFERENCES usuarios(id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de gastos operativos
CREATE TABLE gastos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    caja_id UUID REFERENCES cajas(id),
    sesion_id UUID REFERENCES sesiones_caja(id),
    movimiento_id UUID REFERENCES movimientos_caja(id),
    
    codigo VARCHAR(50) UNIQUE NOT NULL,
    
    categoria VARCHAR(50) NOT NULL,
    subcategoria VARCHAR(50),
    
    descripcion TEXT NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    
    tipo_comprobante VARCHAR(20),
    numero_comprobante VARCHAR(50),
    proveedor_nombre VARCHAR(255),
    proveedor_ruc VARCHAR(20),
    
    fecha_gasto DATE NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    metodo_pago VARCHAR(30),
    
    registrado_por UUID REFERENCES usuarios(id),
    aprobado_por UUID REFERENCES usuarios(id),
    fecha_aprobacion TIMESTAMP WITH TIME ZONE,
    
    observaciones TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de transferencias entre cajas
CREATE TABLE transferencias_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    
    caja_origen_id UUID REFERENCES cajas(id),
    caja_destino_id UUID REFERENCES cajas(id),
    sesion_origen_id UUID REFERENCES sesiones_caja(id),
    sesion_destino_id UUID REFERENCES sesiones_caja(id),
    
    monto DECIMAL(12,2) NOT NULL,
    
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    
    solicitado_por UUID REFERENCES usuarios(id),
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmado_por UUID REFERENCES usuarios(id),
    fecha_confirmacion TIMESTAMP WITH TIME ZONE,
    
    observaciones TEXT,
    motivo_rechazo TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREAR ÍNDICES
-- =====================================================

CREATE INDEX idx_sesiones_caja_fecha ON sesiones_caja(fecha_apertura, fecha_cierre);
CREATE INDEX idx_sesiones_caja_estado ON sesiones_caja(estado);
CREATE INDEX idx_movimientos_caja_sesion ON movimientos_caja(sesion_id);
CREATE INDEX idx_movimientos_caja_fecha ON movimientos_caja(fecha);
CREATE INDEX idx_movimientos_caja_referencia ON movimientos_caja(referencia_tipo, referencia_id);
CREATE INDEX idx_arqueos_caja_sesion ON arqueos_caja(sesion_id);
CREATE INDEX idx_gastos_fecha ON gastos(fecha_gasto);
CREATE INDEX idx_gastos_estado ON gastos(estado);

-- =====================================================
-- 4. CREAR TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION actualizar_totales_sesion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sesiones_caja
    SET 
        total_ingresos = (
            SELECT COALESCE(SUM(monto), 0)
            FROM movimientos_caja
            WHERE sesion_id = NEW.sesion_id
            AND tipo = 'ingreso'
            AND anulado = false
        ),
        total_egresos = (
            SELECT COALESCE(SUM(monto), 0)
            FROM movimientos_caja
            WHERE sesion_id = NEW.sesion_id
            AND tipo = 'egreso'
            AND anulado = false
        ),
        total_movimientos = (
            SELECT COUNT(*)
            FROM movimientos_caja
            WHERE sesion_id = NEW.sesion_id
            AND anulado = false
        ),
        updated_at = NOW()
    WHERE id = NEW.sesion_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_totales_sesion
AFTER INSERT OR UPDATE ON movimientos_caja
FOR EACH ROW
EXECUTE FUNCTION actualizar_totales_sesion();

-- =====================================================
-- 5. CREAR VISTAS
-- =====================================================

CREATE OR REPLACE VIEW vista_saldo_cajas AS
SELECT 
    c.id,
    c.codigo,
    c.nombre,
    c.estado,
    s.id as sesion_actual_id,
    s.monto_inicial,
    s.total_ingresos,
    s.total_egresos,
    (s.monto_inicial + s.total_ingresos - s.total_egresos) as saldo_actual,
    s.fecha_apertura,
    u.nombres || ' ' || u.apellido_paterno as responsable
FROM cajas c
LEFT JOIN sesiones_caja s ON s.caja_id = c.id AND s.estado = 'abierta'
LEFT JOIN usuarios u ON u.id = s.usuario_apertura_id
WHERE c.activa = true;

CREATE OR REPLACE VIEW vista_movimientos_dia AS
SELECT 
    m.*,
    c.nombre as caja_nombre,
    u.nombres || ' ' || u.apellido_paterno as usuario_nombre
FROM movimientos_caja m
JOIN cajas c ON c.id = m.caja_id
LEFT JOIN usuarios u ON u.id = m.usuario_id
WHERE DATE(m.fecha) = CURRENT_DATE
AND m.anulado = false
ORDER BY m.fecha DESC;

-- =====================================================
-- 6. INSERTAR DATOS INICIALES
-- =====================================================

INSERT INTO cajas (codigo, nombre, descripcion, ubicacion, estado, activa)
VALUES ('CAJA-01', 'Caja Principal', 'Caja principal de la empresa', 'Local Central', 'cerrada', true);

-- =====================================================
-- 7. VERIFICACIÓN
-- =====================================================

SELECT 'Tablas creadas exitosamente:' as resultado;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'cajas', 
  'sesiones_caja', 
  'movimientos_caja', 
  'arqueos_caja', 
  'gastos', 
  'transferencias_caja'
)
ORDER BY table_name;

SELECT 'Caja inicial creada:' as resultado;
SELECT codigo, nombre, estado FROM cajas;
