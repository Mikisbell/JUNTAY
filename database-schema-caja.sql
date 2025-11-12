-- =====================================================
-- MÓDULO DE CONTROL DE CAJA
-- Sistema profesional de control financiero
-- =====================================================

-- Tabla de cajas (puntos de cobro/pago)
CREATE TABLE cajas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- 'CAJA-01', 'CAJA-02'
    nombre VARCHAR(100) NOT NULL, -- 'Caja Principal', 'Caja Secundaria'
    descripcion TEXT,
    ubicacion VARCHAR(255), -- 'Local Central', 'Sucursal Norte'
    
    -- Estado
    estado VARCHAR(20) NOT NULL DEFAULT 'cerrada', -- 'abierta', 'cerrada', 'en_arqueo', 'bloqueada'
    activa BOOLEAN DEFAULT true,
    
    -- Responsable actual
    responsable_actual_id UUID REFERENCES usuarios(id),
    fecha_ultima_apertura TIMESTAMP WITH TIME ZONE,
    fecha_ultimo_cierre TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sesiones de caja (apertura y cierre diario)
CREATE TABLE sesiones_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caja_id UUID REFERENCES cajas(id),
    numero_sesion INTEGER NOT NULL, -- Incremental por caja
    
    -- Apertura
    fecha_apertura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usuario_apertura_id UUID REFERENCES usuarios(id),
    monto_inicial DECIMAL(12,2) NOT NULL DEFAULT 0, -- Fondo fijo
    billetes_apertura JSON, -- Desglose de billetes y monedas
    observaciones_apertura TEXT,
    
    -- Cierre
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    usuario_cierre_id UUID REFERENCES usuarios(id),
    monto_sistema DECIMAL(12,2), -- Lo que dice el sistema
    monto_contado DECIMAL(12,2), -- Lo que se contó físicamente
    diferencia DECIMAL(12,2), -- Faltante (-) o Sobrante (+)
    billetes_cierre JSON, -- Desglose de billetes y monedas
    observaciones_cierre TEXT,
    
    -- Resumen de movimientos
    total_ingresos DECIMAL(12,2) DEFAULT 0,
    total_egresos DECIMAL(12,2) DEFAULT 0,
    total_movimientos INTEGER DEFAULT 0,
    
    estado VARCHAR(20) NOT NULL DEFAULT 'abierta', -- 'abierta', 'cerrada', 'cuadrada', 'con_diferencia'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(caja_id, numero_sesion)
);

-- Tabla de movimientos de caja (cada transacción)
CREATE TABLE movimientos_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sesion_id UUID REFERENCES sesiones_caja(id),
    caja_id UUID REFERENCES cajas(id),
    
    -- Tipo de movimiento
    tipo VARCHAR(30) NOT NULL, -- 'ingreso', 'egreso', 'apertura', 'cierre', 'ajuste'
    concepto VARCHAR(50) NOT NULL, -- 'desembolso_credito', 'pago_cuota', 'gasto_operativo', 'retiro'
    
    -- Referencias
    referencia_tipo VARCHAR(30), -- 'credito', 'pago', 'gasto', 'otro'
    referencia_id UUID, -- ID del crédito, pago, etc.
    referencia_codigo VARCHAR(50), -- Código visible (CRE-001, PAG-001)
    
    -- Montos
    monto DECIMAL(12,2) NOT NULL,
    saldo_anterior DECIMAL(12,2) NOT NULL,
    saldo_nuevo DECIMAL(12,2) NOT NULL,
    
    -- Metadatos
    descripcion TEXT,
    comprobante_numero VARCHAR(50), -- Número de boleta/factura
    metodo_pago VARCHAR(30), -- 'efectivo', 'transferencia', 'yape', 'plin'
    
    -- Auditoría
    usuario_id UUID REFERENCES usuarios(id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Anulación
    anulado BOOLEAN DEFAULT false,
    fecha_anulacion TIMESTAMP WITH TIME ZONE,
    usuario_anulacion_id UUID REFERENCES usuarios(id),
    motivo_anulacion TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de arqueos de caja (conteos físicos)
CREATE TABLE arqueos_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sesion_id UUID REFERENCES sesiones_caja(id),
    caja_id UUID REFERENCES cajas(id),
    
    tipo VARCHAR(20) NOT NULL, -- 'apertura', 'intermedio', 'cierre'
    
    -- Conteo
    monto_sistema DECIMAL(12,2) NOT NULL, -- Lo que dice el sistema
    monto_contado DECIMAL(12,2) NOT NULL, -- Lo que se contó
    diferencia DECIMAL(12,2) NOT NULL, -- Faltante o sobrante
    
    -- Desglose de billetes y monedas
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
    
    -- JSON con detalle completo
    detalle_efectivo JSON,
    
    -- Observaciones
    observaciones TEXT,
    justificacion_diferencia TEXT,
    
    -- Auditoría
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
    
    codigo VARCHAR(50) UNIQUE NOT NULL, -- 'GAS-20250111-001'
    
    -- Tipo de gasto
    categoria VARCHAR(50) NOT NULL, -- 'alquiler', 'servicios', 'sueldos', 'marketing', 'otros'
    subcategoria VARCHAR(50),
    
    -- Detalles
    descripcion TEXT NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    
    -- Comprobante
    tipo_comprobante VARCHAR(20), -- 'boleta', 'factura', 'recibo'
    numero_comprobante VARCHAR(50),
    proveedor_nombre VARCHAR(255),
    proveedor_ruc VARCHAR(20),
    
    -- Fechas
    fecha_gasto DATE NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    
    -- Estado
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'pagado', 'anulado'
    metodo_pago VARCHAR(30), -- 'efectivo', 'transferencia', 'cheque'
    
    -- Auditoría
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
    codigo VARCHAR(50) UNIQUE NOT NULL, -- 'TRF-20250111-001'
    
    -- Origen y destino
    caja_origen_id UUID REFERENCES cajas(id),
    caja_destino_id UUID REFERENCES cajas(id),
    sesion_origen_id UUID REFERENCES sesiones_caja(id),
    sesion_destino_id UUID REFERENCES sesiones_caja(id),
    
    -- Monto
    monto DECIMAL(12,2) NOT NULL,
    
    -- Estado
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'rechazada'
    
    -- Auditoría
    solicitado_por UUID REFERENCES usuarios(id),
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmado_por UUID REFERENCES usuarios(id),
    fecha_confirmacion TIMESTAMP WITH TIME ZONE,
    
    observaciones TEXT,
    motivo_rechazo TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
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
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Actualizar totales de sesión cuando hay movimientos
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
-- DATOS INICIALES
-- =====================================================

-- Insertar caja principal
INSERT INTO cajas (codigo, nombre, descripcion, ubicacion, estado, activa)
VALUES ('CAJA-01', 'Caja Principal', 'Caja principal de la empresa', 'Local Central', 'cerrada', true)
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de saldo actual por caja
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

-- Vista de movimientos del día
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
