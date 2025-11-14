-- VERIFICAR SISTEMA DE CAJA GENERAL

-- 1. Verificar que las tablas existen
SELECT 'TABLAS CREADAS:' as status;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('caja_general', 'asignaciones_caja', 'movimientos_caja_general')
ORDER BY table_name;

-- 2. Verificar funciones creadas
SELECT 'FUNCIONES CREADAS:' as status;
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%caja_general%' OR routine_name LIKE '%prestamo%' OR routine_name LIKE '%empeno%'
ORDER BY routine_name;

-- 3. Verificar si hay datos en caja_general
SELECT 'DATOS EN CAJA GENERAL:' as status;
SELECT COUNT(*) as total_cajas_generales FROM caja_general;

-- 4. Si no hay caja general, mostrar cómo crearla
DO $$
DECLARE
    v_count INTEGER;
    v_empresa_id UUID;
BEGIN
    SELECT COUNT(*) INTO v_count FROM caja_general;
    
    IF v_count = 0 THEN
        RAISE NOTICE '⚠️  NO HAY CAJA GENERAL CREADA';
        RAISE NOTICE '📋 PARA CREAR UNA CAJA GENERAL:';
        RAISE NOTICE '   1. Obtén tu empresa_id de la tabla empresas';
        RAISE NOTICE '   2. Ejecuta: SELECT inicializar_caja_general(''tu-empresa-id'', 10000.00, ''tu-usuario-id'');';
        
        -- Intentar obtener una empresa existente
        SELECT id INTO v_empresa_id FROM empresas LIMIT 1;
        IF v_empresa_id IS NOT NULL THEN
            RAISE NOTICE '💡 EMPRESA ENCONTRADA: %', v_empresa_id;
            RAISE NOTICE '🚀 COMANDO SUGERIDO:';
            RAISE NOTICE '   SELECT inicializar_caja_general(''%'', 10000.00, NULL);', v_empresa_id;
        END IF;
    ELSE
        RAISE NOTICE '✅ SISTEMA DE CAJA GENERAL FUNCIONANDO CORRECTAMENTE';
        RAISE NOTICE '📊 Cajas generales activas: %', v_count;
    END IF;
END $$;
