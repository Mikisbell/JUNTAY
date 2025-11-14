-- PARTE 2: ÍNDICES, TRIGGERS Y FUNCIONES PARA CAJA GENERAL

-- ========================================
-- 3. CREAR ÍNDICES
-- ========================================

CREATE INDEX idx_caja_general_empresa ON caja_general(empresa_id);
CREATE INDEX idx_caja_general_activa ON caja_general(activa) WHERE activa = true;

CREATE INDEX idx_asignaciones_caja_general ON asignaciones_caja(caja_general_id);
CREATE INDEX idx_asignaciones_caja_individual ON asignaciones_caja(caja_individual_id);
CREATE INDEX idx_asignaciones_sesion ON asignaciones_caja(sesion_caja_id);
CREATE INDEX idx_asignaciones_estado ON asignaciones_caja(estado);
CREATE INDEX idx_asignaciones_fecha ON asignaciones_caja(fecha_asignacion);

CREATE INDEX idx_movimientos_caja_general ON movimientos_caja_general(caja_general_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_caja_general(fecha);
CREATE INDEX idx_movimientos_tipo ON movimientos_caja_general(tipo_movimiento);

-- ========================================
-- 4. CREAR TRIGGERS
-- ========================================

CREATE OR REPLACE FUNCTION actualizar_saldos_caja_general()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    
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

-- ========================================
-- 5. FUNCIONES BÁSICAS
-- ========================================

-- INICIALIZAR CAJA GENERAL
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
        empresa_id, codigo, nombre, saldo_total, saldo_disponible, 
        saldo_asignado, responsable_id, created_by
    ) VALUES (
        p_empresa_id, 'CAJA-GENERAL-001', 'Caja General - Bóveda Principal',
        p_saldo_inicial, p_saldo_inicial, 0.00, p_responsable_id, p_responsable_id
    ) RETURNING id INTO v_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, usuario_operacion, created_by
    ) VALUES (
        v_caja_general_id, 'ingreso_efectivo', p_saldo_inicial, 0.00, p_saldo_inicial,
        'inicializacion_sistema', 'Inicialización de Caja General con saldo inicial',
        p_responsable_id, p_responsable_id
    );
    
    RETURN v_caja_general_id;
END;
$$ LANGUAGE plpgsql;

-- REGISTRAR APORTE DE SOCIO
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
    SELECT saldo_total INTO v_saldo_anterior FROM caja_general WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior + p_monto;
    
    UPDATE caja_general SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible + p_monto,
        updated_at = NOW(),
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'aporte_socio', p_monto, v_saldo_anterior, v_saldo_nuevo,
        p_concepto, COALESCE(p_descripcion, 'Aporte de socio al capital de la empresa'),
        p_referencia_externa, p_usuario_operacion, p_usuario_operacion
    ) RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- REGISTRAR TRANSFERENCIA BANCARIA
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
    SELECT saldo_total INTO v_saldo_anterior FROM caja_general WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior + p_monto;
    
    UPDATE caja_general SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible + p_monto,
        updated_at = NOW(),
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'transferencia_bancaria', p_monto, v_saldo_anterior, v_saldo_nuevo,
        p_concepto, COALESCE(p_descripcion, 'Transferencia desde ' || p_banco_origen),
        p_numero_operacion, p_usuario_operacion, p_usuario_operacion
    ) RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- REGISTRAR DEPÓSITO A BANCO
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
    SELECT saldo_total INTO v_saldo_anterior FROM caja_general WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    IF v_saldo_anterior < p_monto THEN
        RAISE EXCEPTION 'Saldo insuficiente para depósito. Disponible: %, Solicitado: %', v_saldo_anterior, p_monto;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior - p_monto;
    
    UPDATE caja_general SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible - p_monto,
        updated_at = NOW(),
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'deposito_banco', p_monto, v_saldo_anterior, v_saldo_nuevo,
        p_concepto, COALESCE(p_descripcion, 'Depósito a ' || p_banco_destino),
        p_numero_operacion, p_usuario_operacion, p_usuario_operacion
    ) RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;
