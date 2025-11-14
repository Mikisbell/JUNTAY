-- SCRIPT MAESTRO PARA RECREAR SISTEMA DE CAJA GENERAL COMPLETO
-- Ejecuta todos los scripts en el orden correcto

\echo '🏪 INICIANDO RECREACIÓN DEL SISTEMA DE CAJA GENERAL PARA CASA DE EMPEÑO...'

-- PARTE 1: Eliminar y crear tablas
\i recrear_caja_general_completo.sql

\echo '✅ Tablas creadas exitosamente'

-- PARTE 2: Crear índices, triggers y funciones básicas  
\i recrear_caja_general_funciones.sql

\echo '✅ Funciones básicas creadas exitosamente'

-- PARTE 3: Crear funciones específicas para casa de empeño
\i recrear_caja_general_empeno.sql

\echo '✅ Funciones de casa de empeño creadas exitosamente'

\echo '🎉 SISTEMA DE CAJA GENERAL COMPLETAMENTE RECREADO'
\echo '📋 PRÓXIMOS PASOS:'
\echo '   1. Ejecutar: SELECT inicializar_caja_general(empresa_id, 10000.00, usuario_id);'
\echo '   2. Probar operaciones con los ejemplos en ejemplos_casa_empeno.sql'
\echo '   3. Integrar con las interfaces de usuario'
