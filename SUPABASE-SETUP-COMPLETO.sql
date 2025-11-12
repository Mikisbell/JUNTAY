-- =====================================================
-- CONFIGURACIÓN COMPLETA DE SUPABASE PARA JUNTAY
-- Ejecutar estos scripts en orden en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PASO 1: VERIFICAR Y CREAR TABLAS NECESARIAS
-- =====================================================
-- Ejecuta esto primero para ver qué tablas ya tienes

-- 1.1 Verificar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1.2 Listar todas las tablas requeridas y su estado
SELECT 
    table_name as "Tabla",
    CASE 
        WHEN table_name IN (
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ) THEN '✅ Existe'
        ELSE '❌ NO EXISTE'
    END as "Estado"
FROM (
    VALUES 
        ('empresas'),
        ('usuarios'),
        ('clientes'),
        ('conyuges'),
        ('garantes'),
        ('tipos_credito'),
        ('solicitudes_credito'),
        ('creditos'),
        ('cronograma_pagos'),
        ('categorias_garantia'),
        ('garantias'),
        ('garantia_fotos'),
        ('cajas'),
        ('sesiones_caja'),
        ('movimientos_caja'),
        ('arqueos_caja'),
        ('cuentas_bancarias'),
        ('pagos'),
        ('desembolsos'),
        ('movimientos')
) AS tablas_requeridas(table_name)
ORDER BY "Estado", "Tabla";

-- 1.3 Ver solo las tablas que NO existen
SELECT table_name as "Tablas Faltantes"
FROM (
    VALUES 
        ('empresas'),
        ('usuarios'),
        ('clientes'),
        ('conyuges'),
        ('garantes'),
        ('tipos_credito'),
        ('solicitudes_credito'),
        ('creditos'),
        ('cronograma_pagos'),
        ('categorias_garantia'),
        ('garantias'),
        ('garantia_fotos'),
        ('cajas'),
        ('sesiones_caja'),
        ('movimientos_caja'),
        ('arqueos_caja'),
        ('cuentas_bancarias'),
        ('pagos'),
        ('desembolsos'),
        ('movimientos')
) AS tablas_requeridas(table_name)
WHERE table_name NOT IN (
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
);

-- ⚠️ IMPORTANTE: Si faltan tablas, ejecuta el archivo database-schema.sql completo
-- (Copia y pega TODO el contenido de database-schema.sql en SQL Editor)

-- =====================================================
-- PASO 2: CREAR EMPRESA POR DEFECTO
-- =====================================================
-- IMPORTANTE: Ejecuta esto después de crear las tablas

-- 2.1 Verificar si ya existe una empresa
SELECT 
    id, 
    ruc, 
    razon_social, 
    nombre_comercial, 
    activo,
    CASE 
        WHEN activo = true THEN '✅ Activa'
        ELSE '⚠️ Inactiva'
    END as "Estado"
FROM empresas 
ORDER BY created_at;

-- 2.2 Crear empresa por defecto si no existe
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

-- 2.3 Verificar que se creó correctamente
SELECT 
    id, 
    ruc, 
    razon_social, 
    nombre_comercial, 
    email,
    telefono,
    activo,
    created_at
FROM empresas 
WHERE ruc = '20123456789';

-- 2.4 Contar empresas activas (debe ser al menos 1)
SELECT 
    COUNT(*) as "Total Empresas",
    COUNT(*) FILTER (WHERE activo = true) as "Empresas Activas"
FROM empresas;

-- =====================================================
-- PASO 3: HACER CAMPOS OPCIONALES (SI ES NECESARIO)
-- =====================================================
-- Si tienes errores de campos NOT NULL, ejecuta esto:

-- 3.1 Verificar qué campos son NOT NULL actualmente
SELECT 
    table_name as "Tabla",
    column_name as "Campo",
    is_nullable as "Puede ser NULL"
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('clientes', 'creditos', 'garantias')
AND column_name IN ('empresa_id', 'created_by', 'desembolsado_por', 'tasado_por')
ORDER BY table_name, column_name;

-- 3.2 Hacer campos opcionales en tabla CLIENTES
DO $$
BEGIN
    -- empresa_id
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clientes' 
        AND column_name = 'empresa_id'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE clientes ALTER COLUMN empresa_id DROP NOT NULL;
        RAISE NOTICE 'Campo empresa_id en clientes ahora es opcional';
    END IF;

    -- created_by
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clientes' 
        AND column_name = 'created_by'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE clientes ALTER COLUMN created_by DROP NOT NULL;
        RAISE NOTICE 'Campo created_by en clientes ahora es opcional';
    END IF;
END $$;

-- 3.3 Hacer campos opcionales en tabla CREDITOS
DO $$
BEGIN
    -- empresa_id
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'creditos' 
        AND column_name = 'empresa_id'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE creditos ALTER COLUMN empresa_id DROP NOT NULL;
        RAISE NOTICE 'Campo empresa_id en creditos ahora es opcional';
    END IF;

    -- desembolsado_por
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'creditos' 
        AND column_name = 'desembolsado_por'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE creditos ALTER COLUMN desembolsado_por DROP NOT NULL;
        RAISE NOTICE 'Campo desembolsado_por en creditos ahora es opcional';
    END IF;
END $$;

-- 3.4 Hacer campos opcionales en tabla GARANTIAS
DO $$
BEGIN
    -- tasado_por
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'garantias' 
        AND column_name = 'tasado_por'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE garantias ALTER COLUMN tasado_por DROP NOT NULL;
        RAISE NOTICE 'Campo tasado_por en garantias ahora es opcional';
    END IF;
END $$;

-- 3.5 Verificar cambios aplicados
SELECT 
    table_name as "Tabla",
    column_name as "Campo",
    is_nullable as "Puede ser NULL",
    CASE 
        WHEN is_nullable = 'YES' THEN '✅ Opcional'
        ELSE '❌ Requerido'
    END as "Estado"
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('clientes', 'creditos', 'garantias')
AND column_name IN ('empresa_id', 'created_by', 'desembolsado_por', 'tasado_por')
ORDER BY table_name, column_name;

-- =====================================================
-- PASO 4: CONFIGURAR STORAGE (DESPUÉS DE CREAR EL BUCKET)
-- =====================================================
-- IMPORTANTE: 
-- 1. Primero ve a Storage en Supabase
-- 2. Crea un bucket llamado 'garantias' (público)
-- 3. Luego ejecuta este script

-- Verificar que el bucket existe
SELECT * FROM storage.buckets WHERE id = 'garantias';

-- Eliminar políticas existentes si las hay (opcional, para empezar limpio)
DROP POLICY IF EXISTS "Los usuarios pueden subir fotos de garantías" ON storage.objects;
DROP POLICY IF EXISTS "Lectura pública de garantías" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus archivos" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus archivos" ON storage.objects;

-- Crear políticas de seguridad para Storage

-- Permitir subida de archivos a usuarios autenticados
CREATE POLICY "Los usuarios pueden subir fotos de garantías"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garantias');

-- Permitir lectura pública de fotos
CREATE POLICY "Lectura pública de garantías"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'garantias');

-- Permitir actualización de archivos propios
-- Primero eliminar si existe para evitar errores
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus archivos" ON storage.objects;
CREATE POLICY "Los usuarios pueden actualizar sus archivos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'garantias');

-- Permitir eliminación de archivos propios
-- Primero eliminar si existe para evitar errores
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus archivos" ON storage.objects;
CREATE POLICY "Los usuarios pueden eliminar sus archivos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'garantias');

-- =====================================================
-- PASO 5: VERIFICACIÓN FINAL
-- =====================================================

-- Verificar empresa creada
SELECT id, ruc, razon_social, nombre_comercial, activo 
FROM empresas 
WHERE activo = true;

-- Verificar tablas principales
SELECT 
    'empresas' as tabla, COUNT(*) as registros FROM empresas
UNION ALL
SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'creditos', COUNT(*) FROM creditos
UNION ALL
SELECT 'garantias', COUNT(*) FROM garantias;

-- Verificar políticas de Storage
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%garantías%' OR policyname LIKE '%garantias%';

