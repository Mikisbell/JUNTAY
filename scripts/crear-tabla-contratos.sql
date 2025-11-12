-- =====================================================
-- TABLA PARA CONTRATOS GENERADOS
-- Almacena información de contratos PDF generados
-- =====================================================

-- Crear tabla de contratos generados
CREATE TABLE IF NOT EXISTS contratos_generados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credito_id UUID REFERENCES creditos(id) NOT NULL,
    numero_contrato VARCHAR(50) NOT NULL,
    template_version VARCHAR(10) DEFAULT '1.0',
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archivo_url TEXT,
    hash_documento VARCHAR(256), -- Para verificar integridad
    estado VARCHAR(20) DEFAULT 'generado', -- 'generado', 'firmado', 'anulado'
    
    -- Metadatos
    generado_por UUID REFERENCES usuarios(id),
    firmado_por UUID REFERENCES usuarios(id),
    fecha_firma TIMESTAMP WITH TIME ZONE,
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear bucket de storage para contratos si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contratos', 'contratos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso para contratos
DROP POLICY IF EXISTS "Usuarios pueden ver contratos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden subir contratos" ON storage.objects;

CREATE POLICY "Usuarios pueden ver contratos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'contratos');

CREATE POLICY "Usuarios pueden subir contratos" 
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contratos');

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_contratos_credito_id ON contratos_generados(credito_id);
CREATE INDEX IF NOT EXISTS idx_contratos_fecha ON contratos_generados(fecha_generacion);
CREATE INDEX IF NOT EXISTS idx_contratos_estado ON contratos_generados(estado);

-- Verificar creación
SELECT 
    'Tabla contratos_generados creada' as mensaje,
    COUNT(*) as registros_existentes
FROM contratos_generados;
