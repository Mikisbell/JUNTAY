-- EJEMPLOS DE USO - MOVIMIENTOS DE CAJA GENERAL
-- Ejecutar DESPUÉS de crear e inicializar la Caja General

-- Variables para los ejemplos (ajustar según datos reales)
DO $$
DECLARE
    v_caja_general_id UUID;
    v_usuario_id UUID;
    v_socio_id UUID;
    v_movimiento_id UUID;
BEGIN
    -- Obtener IDs necesarios
    SELECT id INTO v_caja_general_id FROM caja_general WHERE activa = true LIMIT 1;
    SELECT id INTO v_usuario_id FROM auth.users LIMIT 1;
    SELECT id INTO v_socio_id FROM auth.users LIMIT 1; -- Ajustar según tabla de socios
    
    IF v_caja_general_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró Caja General activa. Ejecutar inicializar_caja_general.sql primero.';
    END IF;
    
    RAISE NOTICE 'Usando Caja General: %', v_caja_general_id;
    RAISE NOTICE 'Usuario operación: %', v_usuario_id;
    
    -- ========================================
    -- EJEMPLO 1: APORTE DE SOCIO
    -- ========================================
    RAISE NOTICE '=== REGISTRANDO APORTE DE SOCIO ===';
    
    SELECT registrar_aporte_socio(
        v_caja_general_id,
        5000.00,  -- S/ 5,000 de aporte
        v_socio_id,
        'Aporte inicial de socio',
        'Aporte de capital para incrementar liquidez de la empresa',
        'APORTE-001',
        v_usuario_id
    ) INTO v_movimiento_id;
    
    RAISE NOTICE 'Aporte registrado. Movimiento ID: %', v_movimiento_id;
    
    -- ========================================
    -- EJEMPLO 2: TRANSFERENCIA BANCARIA
    -- ========================================
    RAISE NOTICE '=== REGISTRANDO TRANSFERENCIA BANCARIA ===';
    
    SELECT registrar_transferencia_bancaria(
        v_caja_general_id,
        3000.00,  -- S/ 3,000 desde banco
        'Banco de Crédito del Perú',
        'TRF-20231113-001',
        'Transferencia desde cuenta corriente',
        'Retiro de cuenta corriente para operaciones de caja',
        v_usuario_id
    ) INTO v_movimiento_id;
    
    RAISE NOTICE 'Transferencia bancaria registrada. Movimiento ID: %', v_movimiento_id;
    
    -- ========================================
    -- EJEMPLO 3: DEPÓSITO A BANCO (cuando hay exceso)
    -- ========================================
    RAISE NOTICE '=== REGISTRANDO DEPÓSITO A BANCO ===';
    
    SELECT registrar_deposito_banco(
        v_caja_general_id,
        2000.00,  -- S/ 2,000 a depositar
        'Banco de la Nación',
        'DEP-20231113-001',
        'Depósito por exceso de efectivo',
        'Depósito de exceso de efectivo para seguridad',
        v_usuario_id
    ) INTO v_movimiento_id;
    
    RAISE NOTICE 'Depósito a banco registrado. Movimiento ID: %', v_movimiento_id;
    
END $$;

-- ========================================
-- CONSULTAS DE VERIFICACIÓN
-- ========================================

-- 1. Estado actual de Caja General
SELECT 
    codigo,
    nombre,
    saldo_total,
    saldo_disponible,
    saldo_asignado,
    (saldo_total - saldo_disponible - saldo_asignado) as diferencia_control
FROM caja_general 
WHERE activa = true;

-- 2. Últimos movimientos registrados
SELECT 
    tipo_movimiento,
    monto,
    saldo_anterior,
    saldo_nuevo,
    concepto,
    descripcion,
    referencia_externa,
    fecha
FROM movimientos_caja_general 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Resumen por tipo de movimiento
SELECT 
    tipo_movimiento,
    COUNT(*) as cantidad_movimientos,
    SUM(CASE WHEN monto > 0 AND saldo_nuevo > saldo_anterior THEN monto ELSE 0 END) as total_ingresos,
    SUM(CASE WHEN monto > 0 AND saldo_nuevo < saldo_anterior THEN monto ELSE 0 END) as total_egresos,
    SUM(CASE WHEN saldo_nuevo > saldo_anterior THEN monto ELSE -monto END) as efecto_neto
FROM movimientos_caja_general 
GROUP BY tipo_movimiento
ORDER BY tipo_movimiento;

-- ========================================
-- FUNCIONES DE CONSULTA ÚTILES
-- ========================================

-- Función para obtener balance diario
CREATE OR REPLACE FUNCTION balance_caja_general_diario(p_fecha DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    fecha DATE,
    saldo_inicial DECIMAL(15,2),
    total_ingresos DECIMAL(15,2),
    total_egresos DECIMAL(15,2),
    saldo_final DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH movimientos_dia AS (
        SELECT 
            DATE(m.fecha) as fecha_mov,
            CASE WHEN m.saldo_nuevo > m.saldo_anterior THEN m.monto ELSE 0 END as ingreso,
            CASE WHEN m.saldo_nuevo < m.saldo_anterior THEN m.monto ELSE 0 END as egreso,
            m.saldo_anterior,
            m.saldo_nuevo,
            ROW_NUMBER() OVER (PARTITION BY DATE(m.fecha) ORDER BY m.fecha) as primer_mov,
            ROW_NUMBER() OVER (PARTITION BY DATE(m.fecha) ORDER BY m.fecha DESC) as ultimo_mov
        FROM movimientos_caja_general m
        WHERE DATE(m.fecha) = p_fecha
    )
    SELECT 
        p_fecha,
        MIN(CASE WHEN primer_mov = 1 THEN saldo_anterior END) as saldo_inicial,
        SUM(ingreso) as total_ingresos,
        SUM(egreso) as total_egresos,
        MAX(CASE WHEN ultimo_mov = 1 THEN saldo_nuevo END) as saldo_final
    FROM movimientos_dia
    WHERE fecha_mov = p_fecha;
END;
$$ LANGUAGE plpgsql;

-- Ejemplo de uso del balance diario
SELECT * FROM balance_caja_general_diario(CURRENT_DATE);
