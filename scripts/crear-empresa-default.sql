-- Crear empresa por defecto si no existe
-- Ejecutar en Supabase SQL Editor

INSERT INTO empresas (ruc, razon_social, nombre_comercial, email, telefono, direccion, activo)
SELECT 
    '20123456789', 
    'Mi Casa de Empeño SAC', 
    'JUNTAY', 
    'admin@juntay.com',
    '987654321',
    'Av. Principal 123, Lima',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM empresas WHERE ruc = '20123456789'
);
