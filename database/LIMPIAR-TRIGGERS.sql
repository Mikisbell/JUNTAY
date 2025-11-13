-- =====================================================
-- LIMPIAR TODOS LOS TRIGGERS EXISTENTES
-- =====================================================
-- Ejecutar ESTE script primero si tienes errores de triggers
-- Luego ejecuta 000_crear_todas_las_tablas.sql

-- Eliminar todos los triggers de updated_at que puedan existir
DROP TRIGGER IF EXISTS update_empresas_updated_at ON empresas;
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
DROP TRIGGER IF EXISTS update_creditos_updated_at ON creditos;
DROP TRIGGER IF EXISTS update_garantias_updated_at ON garantias;
DROP TRIGGER IF EXISTS update_mensajes_whatsapp_updated_at ON mensajes_whatsapp;
DROP TRIGGER IF EXISTS update_cajas_updated_at ON cajas;
DROP TRIGGER IF EXISTS update_sesiones_caja_updated_at ON sesiones_caja;
DROP TRIGGER IF EXISTS update_tipos_credito_updated_at ON tipos_credito;
DROP TRIGGER IF EXISTS update_categorias_garantia_updated_at ON categorias_garantia;
DROP TRIGGER IF EXISTS update_garantes_updated_at ON garantes;
DROP TRIGGER IF EXISTS update_gastos_updated_at ON gastos;
DROP TRIGGER IF EXISTS update_cuentas_bancarias_updated_at ON cuentas_bancarias;

-- Verificar que se eliminaron todos los triggers
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- Si el resultado está vacío, todos los triggers se eliminaron correctamente
SELECT 'Todos los triggers eliminados correctamente' as resultado;
