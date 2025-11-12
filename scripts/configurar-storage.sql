-- Configurar Storage para fotos de garantías
-- IMPORTANTE: Primero crear el bucket 'garantias' en Supabase Storage (público)
-- Luego ejecutar este script en SQL Editor

-- Verificar que el bucket existe
SELECT * FROM storage.buckets WHERE id = 'garantias';

-- Políticas de seguridad para Storage

-- Permitir subida de archivos a usuarios autenticados
CREATE POLICY IF NOT EXISTS "Los usuarios pueden subir fotos de garantías"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garantias');

-- Permitir lectura pública de fotos
CREATE POLICY IF NOT EXISTS "Lectura pública de garantías"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'garantias');

-- Permitir actualización de archivos propios
CREATE POLICY IF NOT EXISTS "Los usuarios pueden actualizar sus archivos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'garantias');

-- Permitir eliminación de archivos propios
CREATE POLICY IF NOT EXISTS "Los usuarios pueden eliminar sus archivos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'garantias');
