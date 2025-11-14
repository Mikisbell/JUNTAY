-- ACTUALIZAR FUNCIONES DE CASA DE EMPEÑO CON CORRECCIÓN DE USUARIO

-- REGISTRAR PRÉSTAMO OTORGADO
CREATE OR REPLACE FUNCTION registrar_prestamo_otorgado(
    p_caja_general_id UUID,
    p_contrato_id UUID,
    p_monto DECIMAL(15,2),
    p_cliente_nombre VARCHAR(200),
    p_prenda_descripcion TEXT,
    p_usuario_operacion UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_movimiento_id UUID;
    v_saldo_anterior DECIMAL(15,2);
    v_saldo_nuevo DECIMAL(15,2);
    v_usuario_final UUID;
BEGIN
    -- Si no se proporciona usuario, usar un UUID por defecto o el primer usuario disponible
    IF p_usuario_operacion IS NULL THEN
        SELECT id INTO v_usuario_final FROM auth.users ORDER BY created_at LIMIT 1;
        IF v_usuario_final IS NULL THEN
            v_usuario_final := gen_random_uuid(); -- UUID temporal si no hay usuarios
        END IF;
    ELSE
        v_usuario_final := p_usuario_operacion;
    END IF;
    
    SELECT saldo_total INTO v_saldo_anterior FROM caja_general WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    IF v_saldo_anterior < p_monto THEN
        RAISE EXCEPTION 'Saldo insuficiente para préstamo. Disponible: %, Solicitado: %', v_saldo_anterior, p_monto;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior - p_monto;
    
    UPDATE caja_general SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible - p_monto,
        updated_at = NOW(),
        updated_by = v_usuario_final
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'prestamo_otorgado', p_monto, v_saldo_anterior, v_saldo_nuevo,
        'Préstamo otorgado',
        'Préstamo de S/ ' || p_monto::text || ' a ' || p_cliente_nombre || ' sobre ' || p_prenda_descripcion,
        p_contrato_id::text, v_usuario_final, v_usuario_final
    ) RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- REGISTRAR PAGO DE INTERESES
CREATE OR REPLACE FUNCTION registrar_pago_interes(
    p_caja_general_id UUID,
    p_contrato_id UUID,
    p_monto DECIMAL(15,2),
    p_cliente_nombre VARCHAR(200),
    p_periodo_pago VARCHAR(50),
    p_usuario_operacion UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_movimiento_id UUID;
    v_saldo_anterior DECIMAL(15,2);
    v_saldo_nuevo DECIMAL(15,2);
    v_usuario_final UUID;
BEGIN
    -- Si no se proporciona usuario, usar un UUID por defecto o el primer usuario disponible
    IF p_usuario_operacion IS NULL THEN
        SELECT id INTO v_usuario_final FROM auth.users ORDER BY created_at LIMIT 1;
        IF v_usuario_final IS NULL THEN
            v_usuario_final := gen_random_uuid();
        END IF;
    ELSE
        v_usuario_final := p_usuario_operacion;
    END IF;
    
    SELECT saldo_total INTO v_saldo_anterior FROM caja_general WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior + p_monto;
    
    UPDATE caja_general SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible + p_monto,
        updated_at = NOW(),
        updated_by = v_usuario_final
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'pago_interes', p_monto, v_saldo_anterior, v_saldo_nuevo,
        'Pago de intereses',
        'Pago de intereses S/ ' || p_monto::text || ' de ' || p_cliente_nombre || ' - ' || p_periodo_pago,
        p_contrato_id::text, v_usuario_final, v_usuario_final
    ) RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- REGISTRAR VENTA DE REMATE
CREATE OR REPLACE FUNCTION registrar_venta_remate(
    p_caja_general_id UUID,
    p_contrato_id UUID,
    p_monto_venta DECIMAL(15,2),
    p_prenda_descripcion TEXT,
    p_comprador_nombre VARCHAR(200),
    p_usuario_operacion UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_movimiento_id UUID;
    v_saldo_anterior DECIMAL(15,2);
    v_saldo_nuevo DECIMAL(15,2);
    v_usuario_final UUID;
BEGIN
    -- Si no se proporciona usuario, usar un UUID por defecto o el primer usuario disponible
    IF p_usuario_operacion IS NULL THEN
        SELECT id INTO v_usuario_final FROM auth.users ORDER BY created_at LIMIT 1;
        IF v_usuario_final IS NULL THEN
            v_usuario_final := gen_random_uuid();
        END IF;
    ELSE
        v_usuario_final := p_usuario_operacion;
    END IF;
    
    SELECT saldo_total INTO v_saldo_anterior FROM caja_general WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior + p_monto_venta;
    
    UPDATE caja_general SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible + p_monto_venta,
        updated_at = NOW(),
        updated_by = v_usuario_final
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'venta_remate', p_monto_venta, v_saldo_anterior, v_saldo_nuevo,
        'Venta de remate',
        'Venta de remate S/ ' || p_monto_venta::text || ' - ' || p_prenda_descripcion || ' a ' || p_comprador_nombre,
        p_contrato_id::text, v_usuario_final, v_usuario_final
    ) RETURNING id INTO v_movimiento_id;
    
    RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ FUNCIONES DE CASA DE EMPEÑO ACTUALIZADAS CORRECTAMENTE';
    RAISE NOTICE '🔧 Ahora manejan correctamente el parámetro usuario_operacion NULL';
END $$;
