-- Script para crear usuario administrador
-- Ejecutar en Supabase SQL Editor

-- Crear usuario de autenticación
-- Nota: Esto debe ejecutarse manualmente en Supabase Dashboard
-- Authentication > Users > Add user > Create new user
-- Email: admin@juntay.com
-- Password: admin123

-- Insertar datos del usuario en la tabla usuarios
INSERT INTO usuarios (
  email,
  nombre_completo,
  rol,
  activo
) VALUES (
  'admin@juntay.com',
  'Administrador Sistema',
  'SUPER_ADMIN',
  true
)
ON CONFLICT (email) DO UPDATE
SET 
  nombre_completo = EXCLUDED.nombre_completo,
  rol = EXCLUDED.rol,
  activo = EXCLUDED.activo;

-- Verificar
SELECT * FROM usuarios WHERE email = 'admin@juntay.com';
