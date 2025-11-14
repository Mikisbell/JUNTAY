-- SCRIPT PARA INICIALIZAR CAJA GENERAL
-- Ejecutar DESPUÉS de crear las tablas con caja_general_sistema.sql

-- 1. Verificar si ya existe una Caja General
DO $$
DECLARE
    v_empresa_id UUID;
    v_caja_general_id UUID;
    v_usuario_admin UUID;
BEGIN
    -- Obtener primera empresa (ajustar según necesidad)
    SELECT id INTO v_empresa_id FROM empresas LIMIT 1;
    
    IF v_empresa_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró ninguna empresa. Crear empresa primero.';
    END IF;
    
    -- Verificar si ya existe Caja General
    SELECT id INTO v_caja_general_id 
    FROM caja_general 
    WHERE empresa_id = v_empresa_id AND activa = true;
    
    IF v_caja_general_id IS NOT NULL THEN
        RAISE NOTICE 'Ya existe una Caja General activa: %', v_caja_general_id;
        RETURN;
    END IF;
    
    -- Obtener usuario administrador (ajustar según necesidad)
    SELECT id INTO v_usuario_admin FROM auth.users LIMIT 1;
    
    -- Crear Caja General con saldo inicial de S/ 10,000.00
    SELECT inicializar_caja_general(
        v_empresa_id,
        10000.00,
        v_usuario_admin
    ) INTO v_caja_general_id;
    
    RAISE NOTICE 'Caja General creada exitosamente: %', v_caja_general_id;
    RAISE NOTICE 'Saldo inicial: S/ 10,000.00';
    
END $$;

-- 2. Verificar resultado
SELECT 
    codigo,
    nombre,
    saldo_total,
    saldo_disponible,
    saldo_asignado,
    activa,
    created_at
FROM caja_general 
WHERE activa = true;

-- 3. Mostrar movimiento inicial
SELECT 
    tipo_movimiento,
    monto,
    saldo_anterior,
    saldo_nuevo,
    concepto,
    descripcion,
    fecha
FROM movimientos_caja_general 
ORDER BY created_at DESC 
LIMIT 5;
