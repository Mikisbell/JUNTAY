-- =====================================================
-- CONFIGURACIÓN DE STORAGE PARA FOTOS DE GARANTÍAS
-- Crear buckets y políticas de acceso
-- =====================================================

-- Crear bucket para fotos de garantías si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'garantias-fotos', 
  'garantias-fotos', 
  true,
  10485760, -- 10MB limit
  '{"image/jpeg","image/jpg","image/png","image/webp"}'
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = '{"image/jpeg","image/jpg","image/png","image/webp"}';

-- Crear tabla para tracking de fotos
CREATE TABLE IF NOT EXISTS fotos_garantias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garantia_id UUID REFERENCES garantias(id) ON DELETE CASCADE NOT NULL,
    archivo_url TEXT NOT NULL,
    archivo_path TEXT NOT NULL,
    nombre_archivo TEXT NOT NULL,
    tipo_foto VARCHAR(20) DEFAULT 'principal', -- 'principal', 'detalle', 'estado'
    descripcion TEXT,
    orden INTEGER DEFAULT 1,
    
    -- Metadatos del archivo
    mime_type VARCHAR(100),
    tamano_bytes INTEGER,
    ancho INTEGER,
    alto INTEGER,
    
    -- Auditoría
    subido_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_fotos_garantias_garantia_id ON fotos_garantias(garantia_id);
CREATE INDEX IF NOT EXISTS idx_fotos_garantias_tipo ON fotos_garantias(tipo_foto);
CREATE INDEX IF NOT EXISTS idx_fotos_garantias_orden ON fotos_garantias(garantia_id, orden);

-- Políticas RLS para fotos_garantias
ALTER TABLE fotos_garantias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios pueden ver fotos de garantías" ON fotos_garantias;
DROP POLICY IF EXISTS "Usuarios pueden subir fotos de garantías" ON fotos_garantias;
DROP POLICY IF EXISTS "Usuarios pueden actualizar fotos de garantías" ON fotos_garantias;
DROP POLICY IF EXISTS "Usuarios pueden eliminar fotos de garantías" ON fotos_garantias;

CREATE POLICY "Usuarios pueden ver fotos de garantías"
ON fotos_garantias FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden subir fotos de garantías"
ON fotos_garantias FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar fotos de garantías"
ON fotos_garantias FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden eliminar fotos de garantías"
ON fotos_garantias FOR DELETE
TO authenticated
USING (true);

-- Políticas de Storage para garantias-fotos bucket
DROP POLICY IF EXISTS "Usuarios pueden ver fotos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden subir fotos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden actualizar fotos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden eliminar fotos" ON storage.objects;

CREATE POLICY "Usuarios pueden ver fotos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'garantias-fotos');

CREATE POLICY "Usuarios pueden subir fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garantias-fotos');

CREATE POLICY "Usuarios pueden actualizar fotos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'garantias-fotos');

CREATE POLICY "Usuarios pueden eliminar fotos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'garantias-fotos');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en fotos_garantias
DROP TRIGGER IF EXISTS update_fotos_garantias_updated_at ON fotos_garantias;
CREATE TRIGGER update_fotos_garantias_updated_at
    BEFORE UPDATE ON fotos_garantias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar configuración
SELECT 
    'Storage bucket configurado' as mensaje,
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'garantias-fotos';

SELECT 
    'Tabla fotos_garantias creada' as mensaje,
    COUNT(*) as registros_existentes
FROM fotos_garantias;
