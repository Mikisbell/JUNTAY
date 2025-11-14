-- INICIALIZAR SISTEMA DE CAJA GENERAL COMPLETO

-- 1. Verificar si existe una empresa
DO $$
DECLARE
    v_empresa_id UUID;
    v_usuario_id UUID;
    v_caja_general_id UUID;
    v_count_empresas INTEGER;
    v_count_cajas INTEGER;
BEGIN
    -- Verificar empresas existentes
    SELECT COUNT(*) INTO v_count_empresas FROM empresas;
    
    IF v_count_empresas = 0 THEN
        RAISE EXCEPTION 'No hay empresas registradas. Crear una empresa primero.';
    END IF;
    
    -- Obtener primera empresa
    SELECT id INTO v_empresa_id FROM empresas ORDER BY created_at LIMIT 1;
    
    -- Obtener primer usuario (o usar NULL)
    SELECT id INTO v_usuario_id FROM auth.users ORDER BY created_at LIMIT 1;
    
    RAISE NOTICE '🏢 Empresa seleccionada: %', v_empresa_id;
    RAISE NOTICE '👤 Usuario responsable: %', COALESCE(v_usuario_id::text, 'NULL');
    
    -- Verificar si ya existe caja general
    SELECT COUNT(*) INTO v_count_cajas FROM caja_general WHERE empresa_id = v_empresa_id;
    
    IF v_count_cajas > 0 THEN
        SELECT id INTO v_caja_general_id FROM caja_general WHERE empresa_id = v_empresa_id AND activa = true LIMIT 1;
        RAISE NOTICE '✅ Ya existe Caja General: %', v_caja_general_id;
        
        -- Mostrar estado actual
        DECLARE
            v_saldo_total DECIMAL(15,2);
            v_saldo_disponible DECIMAL(15,2);
            v_saldo_asignado DECIMAL(15,2);
        BEGIN
            SELECT saldo_total, saldo_disponible, saldo_asignado 
            INTO v_saldo_total, v_saldo_disponible, v_saldo_asignado
            FROM caja_general 
            WHERE id = v_caja_general_id;
            
            RAISE NOTICE '💰 Saldo actual: S/ % (Disponible: S/ %, Asignado: S/ %)', 
                   v_saldo_total, v_saldo_disponible, v_saldo_asignado;
        END;
    ELSE
        -- Crear nueva caja general
        RAISE NOTICE '🚀 Creando nueva Caja General...';
        
        SELECT inicializar_caja_general(v_empresa_id, 10000.00, v_usuario_id) INTO v_caja_general_id;
        
        RAISE NOTICE '✅ Caja General creada exitosamente: %', v_caja_general_id;
        RAISE NOTICE '💰 Saldo inicial: S/ 10,000.00';
    END IF;
    
    -- Mostrar resumen final
    RAISE NOTICE '';
    RAISE NOTICE '🎉 SISTEMA DE CAJA GENERAL LISTO PARA USAR';
    RAISE NOTICE '📋 PRÓXIMOS PASOS:';
    RAISE NOTICE '   1. Abrir una caja individual desde el dashboard';
    RAISE NOTICE '   2. El sistema automáticamente creará la asignación desde Caja General';
    RAISE NOTICE '   3. Al cerrar la caja, el efectivo regresará a Caja General';
    RAISE NOTICE '';
    RAISE NOTICE '🏪 OPERACIONES DE CASA DE EMPEÑO DISPONIBLES:';
    RAISE NOTICE '   - registrar_prestamo_otorgado()';
    RAISE NOTICE '   - registrar_pago_interes()';
    RAISE NOTICE '   - registrar_desempeno_total()';
    RAISE NOTICE '   - registrar_venta_remate()';
    
END $$;

-- 2. Mostrar estado de todas las cajas generales
SELECT 
    'ESTADO ACTUAL DE CAJAS GENERALES' as titulo,
    id,
    codigo,
    nombre,
    saldo_total,
    saldo_disponible,
    saldo_asignado,
    activa,
    created_at
FROM caja_general
ORDER BY created_at DESC;
