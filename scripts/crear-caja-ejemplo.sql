-- =====================================================
-- SCRIPT: Crear Caja de Ejemplo
-- Crear caja por defecto para testing
-- =====================================================

-- Insertar caja de ejemplo si no existe
INSERT INTO cajas (
    empresa_id, 
    codigo, 
    nombre, 
    descripcion, 
    ubicacion,
    estado,
    activa
)
SELECT 
    e.id,
    'CAJA-01',
    'Caja Principal',
    'Caja principal para operaciones diarias',
    'Local Principal - Mostrador 1',
    'cerrada',
    true
FROM empresas e 
WHERE e.ruc = '20123456789'
AND NOT EXISTS (
    SELECT 1 FROM cajas c 
    WHERE c.codigo = 'CAJA-01'
);

-- Verificar que se creó
SELECT 
    codigo,
    nombre,
    ubicacion,
    estado,
    activa
FROM cajas 
WHERE codigo = 'CAJA-01';
