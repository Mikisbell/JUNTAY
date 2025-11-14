-- EJEMPLOS DE OPERACIONES ESPECÍFICAS PARA CASA DE EMPEÑO
-- Ejecutar DESPUÉS de crear e inicializar la Caja General

-- Variables para los ejemplos (ajustar según datos reales)
DO $$
DECLARE
    v_caja_general_id UUID;
    v_usuario_id UUID;
    v_contrato_id UUID;
    v_movimiento_id UUID;
BEGIN
    -- Obtener IDs necesarios
    SELECT id INTO v_caja_general_id FROM caja_general WHERE activa = true LIMIT 1;
    SELECT id INTO v_usuario_id FROM auth.users LIMIT 1;
    
    -- Generar ID de contrato ficticio para ejemplos
    v_contrato_id := gen_random_uuid();
    
    IF v_caja_general_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró Caja General activa. Ejecutar inicializar_caja_general.sql primero.';
    END IF;
    
    RAISE NOTICE 'Usando Caja General: %', v_caja_general_id;
    RAISE NOTICE 'Usuario operación: %', v_usuario_id;
    
    -- ========================================
    -- EJEMPLO 1: PRÉSTAMO OTORGADO
    -- ========================================
    RAISE NOTICE '=== REGISTRANDO PRÉSTAMO OTORGADO ===';
    
    SELECT registrar_prestamo_otorgado(
        v_caja_general_id,
        v_contrato_id,
        1500.00,  -- S/ 1,500 prestado
        'María García Pérez',
        'Anillo de oro 18k con diamante de 0.5ct',
        v_usuario_id
    ) INTO v_movimiento_id;
    
    RAISE NOTICE 'Préstamo registrado. Movimiento ID: %', v_movimiento_id;
    
    -- ========================================
    -- EJEMPLO 2: PAGO DE INTERESES
    -- ========================================
    RAISE NOTICE '=== REGISTRANDO PAGO DE INTERESES ===';
    
    SELECT registrar_pago_interes(
        v_caja_general_id,
        v_contrato_id,
        150.00,  -- S/ 150 de intereses (10% mensual)
        'María García Pérez',
        'Mes 1 - Noviembre 2023',
        v_usuario_id
    ) INTO v_movimiento_id;
    
    RAISE NOTICE 'Pago de intereses registrado. Movimiento ID: %', v_movimiento_id;
    
    -- ========================================
    -- EJEMPLO 3: VENTA DE REMATE (prenda vencida)
    -- ========================================
    RAISE NOTICE '=== REGISTRANDO VENTA DE REMATE ===';
    
    -- Generar nuevo contrato para remate
    v_contrato_id := gen_random_uuid();
    
    SELECT registrar_venta_remate(
        v_caja_general_id,
        v_contrato_id,
        2200.00,  -- S/ 2,200 venta en remate
        'Cadena de oro 18k de 50 gramos',
        'Carlos Mendoza Silva',
        v_usuario_id
    ) INTO v_movimiento_id;
    
    RAISE NOTICE 'Venta de remate registrada. Movimiento ID: %', v_movimiento_id;
    
END $$;

-- ========================================
-- CONSULTAS DE VERIFICACIÓN PARA CASA DE EMPEÑO
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

-- 2. Movimientos específicos de casa de empeño
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
WHERE tipo_movimiento IN (
    'prestamo_otorgado', 'pago_interes', 'pago_capital', 
    'desempeno_total', 'venta_remate', 'comision_tasacion'
)
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Resumen de operaciones por tipo (Casa de Empeño)
SELECT 
    CASE 
        WHEN tipo_movimiento IN ('prestamo_otorgado', 'gasto_operativo') THEN 'EGRESOS'
        WHEN tipo_movimiento IN ('pago_interes', 'pago_capital', 'desempeno_total', 'venta_remate', 'comision_tasacion', 'comision_almacenaje', 'multa_vencimiento') THEN 'INGRESOS'
        ELSE 'OTROS'
    END as categoria,
    tipo_movimiento,
    COUNT(*) as cantidad_operaciones,
    SUM(monto) as monto_total,
    AVG(monto) as monto_promedio,
    MIN(monto) as monto_minimo,
    MAX(monto) as monto_maximo
FROM movimientos_caja_general 
WHERE tipo_movimiento IN (
    'prestamo_otorgado', 'pago_interes', 'pago_capital', 'desempeno_total',
    'venta_remate', 'comision_tasacion', 'comision_almacenaje',
    'multa_vencimiento', 'renovacion_contrato', 'gasto_operativo'
)
GROUP BY categoria, tipo_movimiento
ORDER BY categoria, monto_total DESC;

-- 4. Flujo de efectivo diario (específico para casa de empeño)
SELECT 
    DATE(fecha) as fecha,
    SUM(CASE WHEN tipo_movimiento = 'prestamo_otorgado' THEN monto ELSE 0 END) as prestamos_otorgados,
    SUM(CASE WHEN tipo_movimiento = 'pago_interes' THEN monto ELSE 0 END) as intereses_cobrados,
    SUM(CASE WHEN tipo_movimiento = 'desempeno_total' THEN monto ELSE 0 END) as desempenos_totales,
    SUM(CASE WHEN tipo_movimiento = 'venta_remate' THEN monto ELSE 0 END) as ventas_remate,
    SUM(CASE WHEN tipo_movimiento IN ('pago_interes', 'desempeno_total', 'venta_remate', 'comision_tasacion', 'comision_almacenaje') THEN monto ELSE 0 END) as total_ingresos,
    SUM(CASE WHEN tipo_movimiento IN ('prestamo_otorgado', 'gasto_operativo') THEN monto ELSE 0 END) as total_egresos,
    SUM(CASE WHEN tipo_movimiento IN ('pago_interes', 'desempeno_total', 'venta_remate', 'comision_tasacion', 'comision_almacenaje') THEN monto 
             WHEN tipo_movimiento IN ('prestamo_otorgado', 'gasto_operativo') THEN -monto 
             ELSE 0 END) as flujo_neto
FROM movimientos_caja_general 
WHERE tipo_movimiento IN (
    'prestamo_otorgado', 'pago_interes', 'pago_capital', 'desempeno_total',
    'venta_remate', 'comision_tasacion', 'comision_almacenaje',
    'multa_vencimiento', 'renovacion_contrato', 'gasto_operativo'
)
AND fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(fecha)
ORDER BY fecha DESC;

-- 5. Indicadores de rendimiento (KPIs para casa de empeño)
WITH kpis AS (
    SELECT 
        COUNT(CASE WHEN tipo_movimiento = 'prestamo_otorgado' THEN 1 END) as total_prestamos,
        SUM(CASE WHEN tipo_movimiento = 'prestamo_otorgado' THEN monto ELSE 0 END) as monto_prestado,
        SUM(CASE WHEN tipo_movimiento = 'pago_interes' THEN monto ELSE 0 END) as intereses_cobrados,
        SUM(CASE WHEN tipo_movimiento = 'venta_remate' THEN monto ELSE 0 END) as ventas_remate,
        COUNT(CASE WHEN tipo_movimiento = 'venta_remate' THEN 1 END) as total_remates
    FROM movimientos_caja_general 
    WHERE fecha >= CURRENT_DATE - INTERVAL '30 days'
    AND tipo_movimiento IN ('prestamo_otorgado', 'pago_interes', 'venta_remate')
)
SELECT 
    total_prestamos,
    monto_prestado,
    CASE WHEN monto_prestado > 0 THEN monto_prestado / total_prestamos ELSE 0 END as prestamo_promedio,
    intereses_cobrados,
    CASE WHEN monto_prestado > 0 THEN (intereses_cobrados / monto_prestado) * 100 ELSE 0 END as tasa_rendimiento_pct,
    ventas_remate,
    total_remates,
    CASE WHEN total_remates > 0 THEN ventas_remate / total_remates ELSE 0 END as venta_remate_promedio,
    CASE WHEN total_prestamos > 0 THEN (total_remates::DECIMAL / total_prestamos) * 100 ELSE 0 END as tasa_remate_pct
FROM kpis;

-- ========================================
-- FUNCIONES DE CONSULTA ESPECÍFICAS
-- ========================================

-- Función para obtener resumen de operaciones por período
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

-- Ejemplo de uso del resumen
SELECT * FROM resumen_operaciones_empeno(CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE);
