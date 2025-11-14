-- SISTEMA DE CAJA GENERAL COMPLETO PARA CASA DE EMPEÑO
-- Script unificado que elimina y recrea todo el sistema

-- ========================================
-- MENSAJE INICIAL
-- ========================================
DO $$
BEGIN
    RAISE NOTICE '🏪 INICIANDO RECREACIÓN DEL SISTEMA DE CAJA GENERAL PARA CASA DE EMPEÑO...';
END $$;

-- ========================================
-- 1. ELIMINAR SISTEMA EXISTENTE
-- ========================================

-- Eliminar triggers
DROP TRIGGER IF EXISTS trigger_actualizar_saldos_caja_general ON caja_general;

-- Eliminar funciones
DROP FUNCTION IF EXISTS actualizar_saldos_caja_general();
DROP FUNCTION IF EXISTS inicializar_caja_general(UUID, DECIMAL, UUID);
DROP FUNCTION IF EXISTS registrar_aporte_socio(UUID, DECIMAL, UUID, VARCHAR, TEXT, VARCHAR, UUID);
DROP FUNCTION IF EXISTS registrar_transferencia_bancaria(UUID, DECIMAL, VARCHAR, VARCHAR, VARCHAR, TEXT, UUID);
DROP FUNCTION IF EXISTS registrar_deposito_banco(UUID, DECIMAL, VARCHAR, VARCHAR, VARCHAR, TEXT, UUID);
DROP FUNCTION IF EXISTS registrar_prestamo_otorgado(UUID, UUID, DECIMAL, VARCHAR, TEXT, UUID);
DROP FUNCTION IF EXISTS registrar_pago_interes(UUID, UUID, DECIMAL, VARCHAR, VARCHAR, UUID);
DROP FUNCTION IF EXISTS registrar_desempeno_total(UUID, UUID, DECIMAL, DECIMAL, VARCHAR, TEXT, UUID);
DROP FUNCTION IF EXISTS registrar_venta_remate(UUID, UUID, DECIMAL, TEXT, VARCHAR, UUID);
DROP FUNCTION IF EXISTS resumen_operaciones_empeno(DATE, DATE);

-- Eliminar tablas (en orden correcto por dependencias)
DROP TABLE IF EXISTS movimientos_caja_general CASCADE;
DROP TABLE IF EXISTS asignaciones_caja CASCADE;
DROP TABLE IF EXISTS caja_general CASCADE;

DO $$
BEGIN
    RAISE NOTICE '✅ Sistema anterior eliminado exitosamente';
END $$;

-- ========================================
-- 2. CREAR TABLAS ACTUALIZADAS
-- ========================================

-- TABLA CAJA GENERAL (BÓVEDA CENTRAL)
CREATE TABLE caja_general (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL DEFAULT 'Caja General',
    descripcion TEXT,
    
    -- SALDOS
    saldo_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    saldo_disponible DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    saldo_asignado DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    
    -- LÍMITES
    limite_asignacion_individual DECIMAL(15,2) DEFAULT 5000.00,
    limite_total_asignaciones DECIMAL(15,2) DEFAULT 50000.00,
    
    -- CONTROL
    activa BOOLEAN DEFAULT true,
    responsable_id UUID,
    
    -- AUDITORÍA
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    
    -- CONSTRAINTS
    CONSTRAINT chk_saldos_coherentes CHECK (saldo_total = saldo_disponible + saldo_asignado),
    CONSTRAINT chk_saldos_positivos CHECK (saldo_total >= 0 AND saldo_disponible >= 0 AND saldo_asignado >= 0)
);

-- TABLA ASIGNACIONES DE CAJA
CREATE TABLE asignaciones_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- RELACIONES
    caja_general_id UUID NOT NULL REFERENCES caja_general(id),
    caja_individual_id UUID NOT NULL REFERENCES cajas(id),
    sesion_caja_id UUID NOT NULL REFERENCES sesiones_caja(id),
    
    -- DATOS DE ASIGNACIÓN
    tipo_operacion VARCHAR(20) NOT NULL CHECK (tipo_operacion IN ('asignacion', 'devolucion')),
    monto_asignado DECIMAL(15,2) NOT NULL,
    monto_devuelto DECIMAL(15,2) DEFAULT 0.00,
    diferencia DECIMAL(15,2) DEFAULT 0.00,
    
    -- SALDOS ANTES/DESPUÉS
    saldo_caja_general_antes DECIMAL(15,2) NOT NULL,
    saldo_caja_general_despues DECIMAL(15,2) NOT NULL,
    
    -- CONTROL Y AUDITORÍA
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'devuelta', 'pendiente_devolucion')),
    observaciones TEXT,
    autorizado_por UUID,
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

-- TABLA MOVIMIENTOS CAJA GENERAL
CREATE TABLE movimientos_caja_general (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- RELACIONES
    caja_general_id UUID NOT NULL REFERENCES caja_general(id),
    asignacion_id UUID REFERENCES asignaciones_caja(id),
    
    -- DATOS DEL MOVIMIENTO
    tipo_movimiento VARCHAR(30) NOT NULL CHECK (tipo_movimiento IN (
        -- OPERACIONES BANCARIAS GENERALES
        'asignacion_cajero', 'devolucion_cajero', 'ingreso_efectivo', 
        'retiro_efectivo', 'transferencia_entrada', 'transferencia_salida',
        'ajuste_inventario', 'deposito_banco', 'aporte_socio',
        'transferencia_bancaria', 'pago_proveedor', 'retiro_socio', 'dividendo_socio',
        -- OPERACIONES ESPECÍFICAS DE CASA DE EMPEÑO
        'prestamo_otorgado', 'pago_interes', 'pago_capital', 'desempeno_total',
        'venta_remate', 'comision_tasacion', 'comision_almacenaje',
        'multa_vencimiento', 'renovacion_contrato', 'gasto_operativo'
    )),
    
    monto DECIMAL(15,2) NOT NULL,
    saldo_anterior DECIMAL(15,2) NOT NULL,
    saldo_nuevo DECIMAL(15,2) NOT NULL,
    
    -- DETALLES
    concepto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    referencia_externa VARCHAR(50),
    
    -- RESPONSABLES
    usuario_operacion UUID NOT NULL,
    autorizado_por UUID,
    
    -- AUDITORÍA
    fecha TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    
    -- CONSTRAINTS
    CONSTRAINT chk_saldo_coherente CHECK (
        -- EGRESOS (reducen saldo disponible)
        (tipo_movimiento IN ('asignacion_cajero', 'retiro_efectivo', 'transferencia_salida', 'pago_proveedor', 'retiro_socio', 'dividendo_socio', 'deposito_banco', 'prestamo_otorgado', 'gasto_operativo') AND saldo_nuevo = saldo_anterior - monto) OR
        -- INGRESOS (aumentan saldo disponible)
        (tipo_movimiento IN ('devolucion_cajero', 'ingreso_efectivo', 'transferencia_entrada', 'aporte_socio', 'transferencia_bancaria', 'pago_interes', 'pago_capital', 'desempeno_total', 'venta_remate', 'comision_tasacion', 'comision_almacenaje', 'multa_vencimiento', 'renovacion_contrato') AND saldo_nuevo = saldo_anterior + monto) OR
        -- AJUSTES (pueden ser + o -)
        (tipo_movimiento = 'ajuste_inventario')
    )
);

DO $$
BEGIN
    RAISE NOTICE '✅ Tablas creadas exitosamente';
END $$;

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

DO $$
BEGIN
    RAISE NOTICE '✅ Índices y triggers creados exitosamente';
END $$;
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
BEGIN
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
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'prestamo_otorgado', p_monto, v_saldo_anterior, v_saldo_nuevo,
        'Préstamo otorgado',
        'Préstamo de S/ ' || p_monto::text || ' a ' || p_cliente_nombre || ' sobre ' || p_prenda_descripcion,
        p_contrato_id::text, p_usuario_operacion, p_usuario_operacion
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
        p_caja_general_id, 'pago_interes', p_monto, v_saldo_anterior, v_saldo_nuevo,
        'Pago de intereses',
        'Pago de intereses S/ ' || p_monto::text || ' de ' || p_cliente_nombre || ' - ' || p_periodo_pago,
        p_contrato_id::text, p_usuario_operacion, p_usuario_operacion
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
BEGIN
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
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'desempeno_total', v_monto_total, v_saldo_anterior, v_saldo_nuevo,
        'Desempeño total',
        'Desempeño total S/ ' || v_monto_total::text || ' (' || p_monto_capital::text || ' capital + ' || p_monto_intereses::text || ' intereses) de ' || p_cliente_nombre || ' - ' || p_prenda_descripcion,
        p_contrato_id::text, p_usuario_operacion, p_usuario_operacion
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
BEGIN
    SELECT saldo_total INTO v_saldo_anterior FROM caja_general WHERE id = p_caja_general_id;
    
    IF v_saldo_anterior IS NULL THEN
        RAISE EXCEPTION 'Caja General no encontrada: %', p_caja_general_id;
    END IF;
    
    v_saldo_nuevo := v_saldo_anterior + p_monto_venta;
    
    UPDATE caja_general SET 
        saldo_total = v_saldo_nuevo,
        saldo_disponible = saldo_disponible + p_monto_venta,
        updated_at = NOW(),
        updated_by = p_usuario_operacion
    WHERE id = p_caja_general_id;
    
    INSERT INTO movimientos_caja_general (
        caja_general_id, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
        concepto, descripcion, referencia_externa, usuario_operacion, created_by
    ) VALUES (
        p_caja_general_id, 'venta_remate', p_monto_venta, v_saldo_anterior, v_saldo_nuevo,
        'Venta de remate',
        'Venta de remate S/ ' || p_monto_venta::text || ' - ' || p_prenda_descripcion || ' a ' || p_comprador_nombre,
        p_contrato_id::text, p_usuario_operacion, p_usuario_operacion
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
