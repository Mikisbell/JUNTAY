-- =====================================================
-- CREAR TABLA MENSAJES WHATSAPP - SUPABASE
-- =====================================================
-- Script para crear tabla mensajes_whatsapp requerida por el sistema
-- Fecha: Nov 12, 2025

-- Crear tabla principal
CREATE TABLE IF NOT EXISTS mensajes_whatsapp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    telefono VARCHAR(20) NOT NULL,
    tipo_mensaje VARCHAR(20) NOT NULL CHECK (tipo_mensaje IN ('confirmacion', 'recordatorio', 'saludo', 'notificacion')),
    plantilla_id VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    adjuntos TEXT[] DEFAULT '{}',
    programado_para TIMESTAMPTZ NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'entregado', 'error', 'cancelado')),
    fecha_enviado TIMESTAMPTZ,
    fecha_entregado TIMESTAMPTZ,
    error_mensaje TEXT,
    webhook_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_cliente ON mensajes_whatsapp(cliente_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_estado ON mensajes_whatsapp(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_programado ON mensajes_whatsapp(programado_para);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_tipo ON mensajes_whatsapp(tipo_mensaje);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_telefono ON mensajes_whatsapp(telefono);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_plantilla ON mensajes_whatsapp(plantilla_id);

-- Enable Row Level Security (RLS)
ALTER TABLE mensajes_whatsapp ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Allow authenticated users to view their messages" ON mensajes_whatsapp
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert messages" ON mensajes_whatsapp
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update messages" ON mensajes_whatsapp
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at (idempotente)
DROP TRIGGER IF EXISTS update_mensajes_whatsapp_updated_at ON mensajes_whatsapp;
CREATE TRIGGER update_mensajes_whatsapp_updated_at
    BEFORE UPDATE ON mensajes_whatsapp
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =====================================================
-- Insertar algunos mensajes de ejemplo para testing
-- (Solo ejecutar si existe un cliente en la tabla clientes)

-- INSERT INTO mensajes_whatsapp (
--     cliente_id,
--     telefono,
--     tipo_mensaje,
--     plantilla_id,
--     mensaje,
--     variables,
--     programado_para,
--     estado
-- ) VALUES (
--     (SELECT id FROM clientes LIMIT 1),
--     '+51987654321',
--     'confirmacion',
--     'confirmacion_pago',
--     '✅ PAGO RECIBIDO - JUNTAY\n\nHola Juan Pérez,\n\nConfirmamos el pago recibido:\n💰 Monto: S/ 150.00\n📝 Crédito: CRE-001\n💳 Saldo pendiente: S/ 350.00\n\nGracias por confiar en nosotros.\n*JUNTOS AVANZAMOS* 🤝',
--     '{"nombre_cliente": "Juan Pérez", "monto_pago": "150.00", "codigo_credito": "CRE-001", "saldo_pendiente": "350.00"}',
--     NOW() + INTERVAL '5 minutes',
--     'pendiente'
-- );

-- =====================================================
-- VERIFICACIÓN DE TABLA CREADA
-- =====================================================
-- Verificar que la tabla fue creada correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'mensajes_whatsapp' 
ORDER BY ordinal_position;

-- Verificar índices creados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'mensajes_whatsapp';

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'mensajes_whatsapp';

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- ✅ Tabla mensajes_whatsapp creada
-- ✅ 6 índices creados para performance
-- ✅ RLS habilitado con políticas de seguridad  
-- ✅ Trigger para updated_at configurado
-- ✅ Constraints y validaciones aplicadas
-- 📱 Sistema WhatsApp Business listo para usar
