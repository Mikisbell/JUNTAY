-- Verificar y arreglar estados de cajas
-- Problema: Las cajas se muestran como cerradas cuando deberían estar abiertas

-- 1. Verificar estado actual de las cajas
SELECT 
    codigo,
    nombre,
    estado as estado_caja,
    activa,
    saldo_actual,
    (SELECT estado 
     FROM sesiones_caja 
     WHERE caja_id = cajas.id 
     ORDER BY created_at DESC 
     LIMIT 1) as ultimo_estado_sesion
FROM cajas 
WHERE activa = true
ORDER BY codigo;

-- 2. Actualizar estado de cajas que tienen sesiones abiertas
UPDATE cajas 
SET estado = 'abierta'
WHERE id IN (
    SELECT DISTINCT caja_id 
    FROM sesiones_caja 
    WHERE estado = 'abierta'
);

-- 3. Verificar resultado
SELECT 
    codigo,
    nombre,
    estado,
    saldo_actual
FROM cajas 
WHERE activa = true
ORDER BY codigo;
