-- =====================================================
-- COMPLETAR POLÍTICAS DE STORAGE FALTANTES
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Verificar políticas actuales
SELECT 
    policyname as "Política",
    cmd as "Operación",
    roles as "Roles"
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND (policyname LIKE '%garantías%' OR policyname LIKE '%garantias%' OR policyname LIKE '%archivos%')
ORDER BY cmd;

-- Crear políticas faltantes (UPDATE y DELETE)
-- Primero eliminar si existen, luego crear

-- Eliminar políticas si existen
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus archivos" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus archivos" ON storage.objects;

-- Permitir actualización de archivos propios
CREATE POLICY "Los usuarios pueden actualizar sus archivos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'garantias');

-- Permitir eliminación de archivos propios
CREATE POLICY "Los usuarios pueden eliminar sus archivos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'garantias');

-- Verificar todas las políticas creadas
SELECT 
    policyname as "Política",
    cmd as "Operación",
    roles as "Roles",
    CASE 
        WHEN cmd = 'INSERT' THEN '✅ Subir archivos'
        WHEN cmd = 'SELECT' THEN '✅ Leer archivos'
        WHEN cmd = 'UPDATE' THEN '✅ Actualizar archivos'
        WHEN cmd = 'DELETE' THEN '✅ Eliminar archivos'
        ELSE cmd
    END as "Descripción"
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND (policyname LIKE '%garantías%' OR policyname LIKE '%garantias%' OR policyname LIKE '%archivos%')
ORDER BY 
    CASE cmd
        WHEN 'INSERT' THEN 1
        WHEN 'SELECT' THEN 2
        WHEN 'UPDATE' THEN 3
        WHEN 'DELETE' THEN 4
    END;

