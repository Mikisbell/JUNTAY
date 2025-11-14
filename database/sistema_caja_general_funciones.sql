-- PARTE 2: FUNCIONES PARA SISTEMA DE CAJA GENERAL

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

-- ========================================
-- 6. FUNCIONES ESPECÍFICAS PARA CASA DE EMPEÑO
-- ========================================

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

-- REGISTRAR DESEMPEÑO TOTAL
CREATE OR REPLACE FUNCTION registrar_desempeno_total(
    p_caja_general_id UUID,
    p_contrato_id UUID,
    p_monto_capital DECIMAL(15,2),
    p_monto_intereses DECIMAL(15,2),
    p_cliente_nombre VARCHAR(200),
    p_prenda_descripcion TEXT,
    p_usuario_operacion UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_movimiento_id UUID;
    v_saldo_anterior DECIMAL(15,2);
    v_saldo_nuevo DECIMAL(15,2);
    v_monto_total DECIMAL(15,2);
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
    
    v_monto_total := p_monto_capital + p_monto_intereses;
    
    SELECT saldo_total INTO v_saldo_anterior FROM caja_general WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior + v_monto_total;
    
    UPDATE caja_general SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible + v_monto_total,
        updated_at = NOW(),
        updated_by = v_usuario_final
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'desempeno_total', v_monto_total, v_saldo_anterior, v_saldo_nuevo,
        'Desempeño total',
        'Desempeño total S/ ' || v_monto_total::text || ' (' || p_monto_capital::text || ' capital + ' || p_monto_intereses::text || ' intereses) de ' || p_cliente_nombre || ' - ' || p_prenda_descripcion,
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

-- FUNCIÓN PARA RESUMEN DE OPERACIONES
CREATE OR REPLACE FUNCTION resumen_operaciones_empeno(
    p_fecha_inicio DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_fecha_fin DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    tipo_operacion VARCHAR(30),
    cantidad_operaciones BIGINT,
    monto_total DECIMAL(15,2),
    monto_promedio DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.tipo_movimiento,
        COUNT(*) as cantidad_operaciones,
        SUM(m.monto) as monto_total,
        AVG(m.monto) as monto_promedio
    FROM movimientos_caja_general m
    WHERE DATE(m.fecha) BETWEEN p_fecha_inicio AND p_fecha_fin
    AND m.tipo_movimiento IN (
        'prestamo_otorgado', 'pago_interes', 'pago_capital', 'desempeno_total',
        'venta_remate', 'comision_tasacion', 'comision_almacenaje',
        'multa_vencimiento', 'renovacion_contrato', 'gasto_operativo'
    )
    GROUP BY m.tipo_movimiento
    ORDER BY monto_total DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 7. COMENTARIOS PARA DOCUMENTACIÓN
-- ========================================

COMMENT ON TABLE caja_general IS 'Caja General/Bóveda central especializada para casa de empeño';
COMMENT ON TABLE asignaciones_caja IS 'Registro de asignaciones de efectivo a cajeros individuales';
COMMENT ON TABLE movimientos_caja_general IS 'Historial detallado de movimientos incluyendo operaciones de casa de empeño';

COMMENT ON COLUMN caja_general.saldo_total IS 'Efectivo total en la bóveda (disponible + asignado)';
COMMENT ON COLUMN caja_general.saldo_disponible IS 'Efectivo disponible para préstamos y asignaciones';
COMMENT ON COLUMN caja_general.saldo_asignado IS 'Efectivo actualmente asignado a cajeros';

COMMENT ON COLUMN asignaciones_caja.diferencia IS 'Diferencia entre lo devuelto y lo asignado (ganancia/pérdida del cajero)';
COMMENT ON COLUMN asignaciones_caja.estado IS 'Estado de la asignación: activa, devuelta, pendiente_devolucion';

-- ========================================
-- MENSAJE DE CONFIRMACIÓN FINAL
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ FUNCIONES BÁSICAS CREADAS EXITOSAMENTE';
    RAISE NOTICE '✅ FUNCIONES DE CASA DE EMPEÑO CREADAS EXITOSAMENTE';
    RAISE NOTICE '🎉 SISTEMA DE CAJA GENERAL COMPLETAMENTE RECREADO';
    RAISE NOTICE '📋 PRÓXIMOS PASOS:';
    RAISE NOTICE '   1. Ejecutar: SELECT inicializar_caja_general(empresa_id, 10000.00, usuario_id);';
    RAISE NOTICE '   2. Probar operaciones con los ejemplos en ejemplos_casa_empeno.sql';
    RAISE NOTICE '   3. Integrar con las interfaces de usuario';
END $$;
