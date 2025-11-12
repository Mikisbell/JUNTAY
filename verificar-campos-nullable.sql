-- =====================================================
-- VERIFICAR TODOS LOS CAMPOS NULLABLE
-- =====================================================

-- 1. TABLA CLIENTES
SELECT 
    'clientes' as tabla,
    column_name, 
    is_nullable,
    CASE WHEN is_nullable = 'NO' THEN '❌ PROBLEMA' ELSE '✅ OK' END as estado
FROM information_schema.columns 
WHERE table_name = 'clientes' 
AND column_name IN ('empresa_id', 'created_by')
ORDER BY column_name;

-- 2. TABLA CREDITOS
SELECT 
    'creditos' as tabla,
    column_name, 
    is_nullable,
    CASE WHEN is_nullable = 'NO' THEN '❌ PROBLEMA' ELSE '✅ OK' END as estado
FROM information_schema.columns 
WHERE table_name = 'creditos' 
AND column_name IN ('empresa_id', 'solicitud_id', 'tipo_credito_id', 'desembolsado_por')
ORDER BY column_name;

-- 3. TABLA GARANTIAS
SELECT 
    'garantias' as tabla,
    column_name, 
    is_nullable,
    CASE WHEN is_nullable = 'NO' THEN '❌ PROBLEMA' ELSE '✅ OK' END as estado
FROM information_schema.columns 
WHERE table_name = 'garantias' 
AND column_name IN ('tasado_por', 'credito_id')
ORDER BY column_name;

-- 4. TABLA PAGOS
SELECT 
    'pagos' as tabla,
    column_name, 
    is_nullable,
    CASE WHEN is_nullable = 'NO' THEN '❌ PROBLEMA' ELSE '✅ OK' END as estado
FROM information_schema.columns 
WHERE table_name = 'pagos' 
AND column_name IN ('cronograma_id', 'caja_id', 'registrado_por', 'cuenta_bancaria_id')
ORDER BY column_name;

-- =====================================================
-- RESUMEN FINAL
-- =====================================================

SELECT 
    'RESUMEN' as tipo,
    COUNT(*) as total_campos_problematicos
FROM information_schema.columns 
WHERE table_name IN ('clientes', 'creditos', 'garantias', 'pagos')
AND column_name IN (
    'empresa_id', 'created_by', 
    'solicitud_id', 'tipo_credito_id', 'desembolsado_por',
    'tasado_por', 'credito_id',
    'cronograma_id', 'caja_id', 'registrado_por', 'cuenta_bancaria_id'
)
AND is_nullable = 'NO';
