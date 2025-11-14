-- Inicializar saldos actuales basados en los montos iniciales existentes
-- Esto es necesario porque agregamos la columna saldo_actual después

-- Actualizar saldos de todas las cajas activas
UPDATE cajas 
SET saldo_actual = COALESCE(
    (SELECT monto_inicial 
     FROM sesiones_caja 
     WHERE caja_id = cajas.id 
     AND estado = 'abierta' 
     ORDER BY created_at DESC 
     LIMIT 1), 
    200.00
)
WHERE activa = true;

-- Verificar los resultados
SELECT 
    codigo,
    nombre,
    estado,
    activa,
    saldo_actual,
    (SELECT monto_inicial 
     FROM sesiones_caja 
     WHERE caja_id = cajas.id 
     AND estado = 'abierta' 
     ORDER BY created_at DESC 
     LIMIT 1) as monto_sesion
FROM cajas 
WHERE activa = true
ORDER BY codigo;
