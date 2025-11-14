-- SISTEMA DE CAJA GENERAL BANCARIO
-- Implementación profesional para manejo centralizado de efectivo

-- 1. TABLA CAJA GENERAL (BÓVEDA CENTRAL)
CREATE TABLE IF NOT EXISTS caja_general (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL DEFAULT 'Caja General',
    descripcion TEXT,
    
    -- SALDOS
    saldo_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,        -- Efectivo total en bóveda
    saldo_disponible DECIMAL(15,2) NOT NULL DEFAULT 0.00,   -- Disponible para asignar
    saldo_asignado DECIMAL(15,2) NOT NULL DEFAULT 0.00,     -- Asignado a cajeros
    
    -- LÍMITES
    limite_asignacion_individual DECIMAL(15,2) DEFAULT 5000.00,  -- Máximo por cajero
    limite_total_asignaciones DECIMAL(15,2) DEFAULT 50000.00,    -- Máximo total asignado
    
    -- CONTROL
    activa BOOLEAN DEFAULT true,
    responsable_id UUID,  -- Supervisor/Gerente
    
    -- AUDITORÍA
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    
    -- CONSTRAINTS
    CONSTRAINT chk_saldos_coherentes CHECK (saldo_total = saldo_disponible + saldo_asignado),
    CONSTRAINT chk_saldos_positivos CHECK (saldo_total >= 0 AND saldo_disponible >= 0 AND saldo_asignado >= 0)
);

-- 2. TABLA ASIGNACIONES DE CAJA (ENTREGAS A CAJEROS)
CREATE TABLE IF NOT EXISTS asignaciones_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- RELACIONES
    caja_general_id UUID NOT NULL REFERENCES caja_general(id),
    caja_individual_id UUID NOT NULL REFERENCES cajas(id),
    sesion_caja_id UUID NOT NULL REFERENCES sesiones_caja(id),
    
    -- DATOS DE ASIGNACIÓN
    tipo_operacion VARCHAR(20) NOT NULL CHECK (tipo_operacion IN ('asignacion', 'devolucion')),
    monto_asignado DECIMAL(15,2) NOT NULL,
    monto_devuelto DECIMAL(15,2) DEFAULT 0.00,
    diferencia DECIMAL(15,2) DEFAULT 0.00,  -- Ganancia/Pérdida del cajero
    
    -- SALDOS ANTES/DESPUÉS
    saldo_caja_general_antes DECIMAL(15,2) NOT NULL,
    saldo_caja_general_despues DECIMAL(15,2) NOT NULL,
    
    -- CONTROL Y AUDITORÍA
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'devuelta', 'pendiente_devolucion')),
    observaciones TEXT,
    autorizado_por UUID,  -- Supervisor que autoriza
    cajero_responsable UUID NOT NULL,
    
    -- FECHAS
    fecha_asignacion TIMESTAMP DEFAULT NOW(),
    fecha_devolucion TIMESTAMP,
    
    -- AUDITORÍA
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    
    -- CONSTRAINTS
    CONSTRAINT chk_monto_positivo CHECK (monto_asignado > 0),
    CONSTRAINT chk_diferencia_calculada CHECK (diferencia = monto_devuelto - monto_asignado)
);

-- 3. TABLA MOVIMIENTOS CAJA GENERAL (HISTORIAL DETALLADO)
CREATE TABLE IF NOT EXISTS movimientos_caja_general (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- RELACIONES
    caja_general_id UUID NOT NULL REFERENCES caja_general(id),
    asignacion_id UUID REFERENCES asignaciones_caja(id),
    
    -- DATOS DEL MOVIMIENTO
    tipo_movimiento VARCHAR(30) NOT NULL CHECK (tipo_movimiento IN (
        'asignacion_cajero', 'devolucion_cajero', 'ingreso_efectivo', 
        'retiro_efectivo', 'transferencia_entrada', 'transferencia_salida',
        'ajuste_inventario', 'deposito_banco', 'aporte_socio',
        'transferencia_bancaria', 'cobranza_directa', 'venta_activo',
        'pago_proveedor', 'retiro_socio', 'dividendo_socio'
    )),
    
    monto DECIMAL(15,2) NOT NULL,
    saldo_anterior DECIMAL(15,2) NOT NULL,
    saldo_nuevo DECIMAL(15,2) NOT NULL,
    
    -- DETALLES
    concepto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    referencia_externa VARCHAR(50),  -- Número de comprobante, etc.
    
    -- RESPONSABLES
    usuario_operacion UUID NOT NULL,  -- Quien hace la operación
    autorizado_por UUID,              -- Quien autoriza (si aplica)
    
    -- AUDITORÍA
    fecha TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    
    -- CONSTRAINTS
    CONSTRAINT chk_saldo_coherente CHECK (
        (tipo_movimiento IN ('asignacion_cajero', 'retiro_efectivo', 'transferencia_salida', 'pago_proveedor', 'retiro_socio', 'dividendo_socio', 'deposito_banco') AND saldo_nuevo = saldo_anterior - monto) OR
        (tipo_movimiento IN ('devolucion_cajero', 'ingreso_efectivo', 'transferencia_entrada', 'aporte_socio', 'transferencia_bancaria', 'cobranza_directa', 'venta_activo') AND saldo_nuevo = saldo_anterior + monto) OR
        (tipo_movimiento = 'ajuste_inventario')
    )
);

-- 4. ÍNDICES PARA RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_caja_general_empresa ON caja_general(empresa_id);
CREATE INDEX IF NOT EXISTS idx_caja_general_activa ON caja_general(activa) WHERE activa = true;

CREATE INDEX IF NOT EXISTS idx_asignaciones_caja_general ON asignaciones_caja(caja_general_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_caja_individual ON asignaciones_caja(caja_individual_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_sesion ON asignaciones_caja(sesion_caja_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_estado ON asignaciones_caja(estado);
CREATE INDEX IF NOT EXISTS idx_asignaciones_fecha ON asignaciones_caja(fecha_asignacion);

CREATE INDEX IF NOT EXISTS idx_movimientos_caja_general ON movimientos_caja_general(caja_general_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_caja_general(fecha);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON movimientos_caja_general(tipo_movimiento);

-- 5. TRIGGERS PARA MANTENER CONSISTENCIA
CREATE OR REPLACE FUNCTION actualizar_saldos_caja_general()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar timestamp
    NEW.updated_at = NOW();
    
    -- Validar coherencia de saldos
    IF NEW.saldo_total != (NEW.saldo_disponible + NEW.saldo_asignado) THEN
        RAISE EXCEPTION 'Inconsistencia en saldos: total=% disponible=% asignado=%', 
            NEW.saldo_total, NEW.saldo_disponible, NEW.saldo_asignado;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_saldos_caja_general
    BEFORE UPDATE ON caja_general
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_saldos_caja_general();

-- 6. FUNCIÓN PARA INICIALIZAR CAJA GENERAL
CREATE OR REPLACE FUNCTION inicializar_caja_general(
    p_empresa_id UUID,
    p_saldo_inicial DECIMAL(15,2) DEFAULT 10000.00,
    p_responsable_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_caja_general_id UUID;
BEGIN
    INSERT INTO caja_general (
        empresa_id,
        codigo,
        nombre,
        saldo_total,
        saldo_disponible,
        saldo_asignado,
        responsable_id,
        created_by
    ) VALUES (
        p_empresa_id,
        'CAJA-GENERAL-001',
        'Caja General - Bóveda Principal',
        p_saldo_inicial,
        p_saldo_inicial,
        0.00,
        p_responsable_id,
        p_responsable_id
    )
    RETURNING id INTO v_caja_general_id;
    
    -- Registrar movimiento inicial
    INSERT INTO movimientos_caja_general (
        caja_general_id,
        tipo_movimiento,
        monto,
        saldo_anterior,
        saldo_nuevo,
        concepto,
        descripcion,
        usuario_operacion,
        created_by
    ) VALUES (
        v_caja_general_id,
        'ingreso_efectivo',
        p_saldo_inicial,
        0.00,
        p_saldo_inicial,
        'inicializacion_sistema',
        'Inicialización de Caja General con saldo inicial',
        p_responsable_id,
        p_responsable_id
    );
    
    RETURN v_caja_general_id;
END;
$$ LANGUAGE plpgsql;

-- 8. FUNCIÓN PARA REGISTRAR APORTE DE SOCIO
CREATE OR REPLACE FUNCTION registrar_aporte_socio(
    p_caja_general_id UUID,
    p_monto DECIMAL(15,2),
    p_socio_id UUID,
    p_concepto VARCHAR(100) DEFAULT 'Aporte de socio',
    p_descripcion TEXT DEFAULT NULL,
    p_referencia_externa VARCHAR(50) DEFAULT NULL,
    p_usuario_operacion UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_movimiento_id UUID;
    v_saldo_anterior DECIMAL(15,2);
    v_saldo_nuevo DECIMAL(15,2);
BEGIN
    -- Obtener saldo actual
    SELECT saldo_total INTO v_saldo_anterior 
    FROM caja_general 
    WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior + p_monto;
    
    -- Actualizar saldo de Caja General
    UPDATE caja_general 
    SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible + p_monto,
        updated_at = NOW(),
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    -- Registrar movimiento
    INSERT INTO movimientos_caja_general (
        caja_general_id,
        tipo_movimiento,
        monto,
        saldo_anterior,
        saldo_nuevo,
        concepto,
        descripcion,
        referencia_externa,
        usuario_operacion,
        created_by
    ) VALUES (
        p_caja_general_id,
        'aporte_socio',
        p_monto,
        v_saldo_anterior,
        v_saldo_nuevo,
        p_concepto,
        COALESCE(p_descripcion, 'Aporte de socio al capital de la empresa'),
        p_referencia_externa,
        p_usuario_operacion,
        p_usuario_operacion
    )
    RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- 9. FUNCIÓN PARA REGISTRAR TRANSFERENCIA BANCARIA
CREATE OR REPLACE FUNCTION registrar_transferencia_bancaria(
    p_caja_general_id UUID,
    p_monto DECIMAL(15,2),
    p_banco_origen VARCHAR(100),
    p_numero_operacion VARCHAR(50),
    p_concepto VARCHAR(100) DEFAULT 'Transferencia bancaria',
    p_descripcion TEXT DEFAULT NULL,
    p_usuario_operacion UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_movimiento_id UUID;
    v_saldo_anterior DECIMAL(15,2);
    v_saldo_nuevo DECIMAL(15,2);
BEGIN
    -- Obtener saldo actual
    SELECT saldo_total INTO v_saldo_anterior 
    FROM caja_general 
    WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior + p_monto;
    
    -- Actualizar saldo de Caja General
    UPDATE caja_general 
    SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible + p_monto,
        updated_at = NOW(),
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    -- Registrar movimiento
    INSERT INTO movimientos_caja_general (
        caja_general_id,
        tipo_movimiento,
        monto,
        saldo_anterior,
        saldo_nuevo,
        concepto,
        descripcion,
        referencia_externa,
        usuario_operacion,
        created_by
    ) VALUES (
        p_caja_general_id,
        'transferencia_bancaria',
        p_monto,
        v_saldo_anterior,
        v_saldo_nuevo,
        p_concepto,
        COALESCE(p_descripcion, 'Transferencia desde ' || p_banco_origen),
        p_numero_operacion,
        p_usuario_operacion,
        p_usuario_operacion
    )
    RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- 10. FUNCIÓN PARA DEPOSITAR A BANCO (EGRESO)
CREATE OR REPLACE FUNCTION registrar_deposito_banco(
    p_caja_general_id UUID,
    p_monto DECIMAL(15,2),
    p_banco_destino VARCHAR(100),
    p_numero_operacion VARCHAR(50),
    p_concepto VARCHAR(100) DEFAULT 'Depósito a banco',
    p_descripcion TEXT DEFAULT NULL,
    p_usuario_operacion UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_movimiento_id UUID;
    v_saldo_anterior DECIMAL(15,2);
    v_saldo_nuevo DECIMAL(15,2);
BEGIN
    -- Obtener saldo actual
    SELECT saldo_total INTO v_saldo_anterior 
    FROM caja_general 
    WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    IF v_saldo_anterior < p_monto THEN
        RAISE EXCEPTION 'Saldo insuficiente para depósito. Disponible: %, Solicitado: %', v_saldo_anterior, p_monto;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior - p_monto;
    
    -- Actualizar saldo de Caja General
    UPDATE caja_general 
    SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible - p_monto,
        updated_at = NOW(),
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    -- Registrar movimiento
    INSERT INTO movimientos_caja_general (
        caja_general_id,
        tipo_movimiento,
        monto,
        saldo_anterior,
        saldo_nuevo,
        concepto,
        descripcion,
        referencia_externa,
        usuario_operacion,
        created_by
    ) VALUES (
        p_caja_general_id,
        'deposito_banco',
        p_monto,
        v_saldo_anterior,
        v_saldo_nuevo,
        p_concepto,
        COALESCE(p_descripcion, 'Depósito a ' || p_banco_destino),
        p_numero_operacion,
        p_usuario_operacion,
        p_usuario_operacion
    )
    RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- 7. COMENTARIOS PARA DOCUMENTACIÓN
COMMENT ON TABLE caja_general IS 'Caja General/Bóveda central que contiene todo el efectivo disponible';
COMMENT ON TABLE asignaciones_caja IS 'Registro de asignaciones de efectivo a cajeros individuales';
COMMENT ON TABLE movimientos_caja_general IS 'Historial detallado de todos los movimientos de la caja general';

COMMENT ON COLUMN caja_general.saldo_total IS 'Efectivo total en la bóveda (disponible + asignado)';
COMMENT ON COLUMN caja_general.saldo_disponible IS 'Efectivo disponible para asignar a cajeros';
COMMENT ON COLUMN caja_general.saldo_asignado IS 'Efectivo actualmente asignado a cajeros';

COMMENT ON COLUMN asignaciones_caja.diferencia IS 'Diferencia entre lo devuelto y lo asignado (ganancia/pérdida del cajero)';
COMMENT ON COLUMN asignaciones_caja.estado IS 'Estado de la asignación: activa, devuelta, pendiente_devolucion';
