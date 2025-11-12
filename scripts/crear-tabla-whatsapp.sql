-- =====================================================
-- TABLA PARA MENSAJES WHATSAPP
-- Sistema de automatización WhatsApp Business
-- =====================================================

-- Crear tabla de mensajes WhatsApp
CREATE TABLE IF NOT EXISTS mensajes_whatsapp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    tipo_mensaje VARCHAR(20) NOT NULL CHECK (tipo_mensaje IN ('confirmacion', 'recordatorio', 'saludo', 'notificacion')),
    plantilla_id VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    adjuntos JSONB DEFAULT '[]',
    
    -- Programación y estado
    programado_para TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'entregado', 'error', 'cancelado')),
    
    -- Metadatos de envío
    fecha_enviado TIMESTAMP WITH TIME ZONE,
    fecha_entregado TIMESTAMP WITH TIME ZONE,
    error_mensaje TEXT,
    webhook_id VARCHAR(100),
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_cliente ON mensajes_whatsapp(cliente_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_estado ON mensajes_whatsapp(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_programado ON mensajes_whatsapp(programado_para);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_tipo ON mensajes_whatsapp(tipo_mensaje);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_webhook ON mensajes_whatsapp(webhook_id);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_mensajes_whatsapp_updated_at ON mensajes_whatsapp;
CREATE TRIGGER update_mensajes_whatsapp_updated_at
    BEFORE UPDATE ON mensajes_whatsapp
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Agregar campos a tabla pagos para tracking WhatsApp
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pagos' AND column_name = 'confirmacion_whatsapp_enviada') THEN
        ALTER TABLE pagos ADD COLUMN confirmacion_whatsapp_enviada BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pagos' AND column_name = 'fecha_confirmacion_whatsapp') THEN
        ALTER TABLE pagos ADD COLUMN fecha_confirmacion_whatsapp TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Agregar campos a tabla creditos para tracking recordatorios
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creditos' AND column_name = 'recordatorios_programados') THEN
        ALTER TABLE creditos ADD COLUMN recordatorios_programados BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creditos' AND column_name = 'fecha_recordatorios_programados') THEN
        ALTER TABLE creditos ADD COLUMN fecha_recordatorios_programados TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Crear tabla de plantillas WhatsApp (para gestión dinámica)
CREATE TABLE IF NOT EXISTS plantillas_whatsapp (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('confirmacion', 'recordatorio', 'saludo', 'notificacion')),
    template TEXT NOT NULL,
    variables_requeridas JSONB DEFAULT '[]',
    activo BOOLEAN DEFAULT TRUE,
    lenguaje VARCHAR(5) DEFAULT 'es',
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at en plantillas
DROP TRIGGER IF EXISTS update_plantillas_whatsapp_updated_at ON plantillas_whatsapp;
CREATE TRIGGER update_plantillas_whatsapp_updated_at
    BEFORE UPDATE ON plantillas_whatsapp
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar plantillas predefinidas
INSERT INTO plantillas_whatsapp (id, nombre, tipo, template, variables_requeridas, activo) VALUES
('confirmacion_pago', 'Confirmación de Pago', 'confirmacion', 
'✅ *PAGO RECIBIDO - JUNTAY*

Hola {{nombre_cliente}},

Confirmamos el pago recibido:
💰 Monto: S/ {{monto_pago}}
📝 Crédito: {{codigo_credito}}
💳 Saldo pendiente: S/ {{saldo_pendiente}}

{{#if_pagado_completo}}
🎉 ¡Felicitaciones! Tu crédito está al día.
{{else}}
📅 Próximo pago: {{fecha_proximo_pago}}
{{/if_pagado_completo}}

Gracias por confiar en nosotros.
*JUNTOS AVANZAMOS* 🤝',
'["nombre_cliente", "monto_pago", "codigo_credito", "saldo_pendiente"]'::jsonb, 
true),

('recordatorio_7_dias', 'Recordatorio 7 días', 'recordatorio',
'📅 *RECORDATORIO - JUNTAY*

Hola {{nombre_cliente}},

Te recordamos que tu cuota vence en *7 días*:

💳 Crédito: {{codigo_credito}}
💰 Monto a pagar: S/ {{monto_cuota}}
📅 Fecha límite: {{fecha_vencimiento}}

Puedes pagar en nuestras oficinas o coordinar el pago llamándonos.

*JUNTOS AVANZAMOS* 🤝',
'["nombre_cliente", "codigo_credito", "monto_cuota", "fecha_vencimiento"]'::jsonb,
true),

('recordatorio_3_dias', 'Recordatorio 3 días', 'recordatorio',
'⚠️ *RECORDATORIO IMPORTANTE - JUNTAY*

Hola {{nombre_cliente}},

Tu cuota vence en solo *3 días*:

💳 Crédito: {{codigo_credito}}
💰 Monto a pagar: S/ {{monto_cuota}}
📅 Fecha límite: {{fecha_vencimiento}}

Para evitar moras, te recomendamos pagar antes de la fecha límite.

*JUNTOS AVANZAMOS* 🤝',
'["nombre_cliente", "codigo_credito", "monto_cuota", "fecha_vencimiento"]'::jsonb,
true),

('recordatorio_hoy', 'Recordatorio Hoy', 'recordatorio',
'🚨 *TU CUOTA VENCE HOY - JUNTAY*

Hola {{nombre_cliente}},

Tu cuota vence *HOY*:

💳 Crédito: {{codigo_credito}}
💰 Monto a pagar: S/ {{monto_cuota}}
⏰ Hasta las 6:00 PM

¡Evita intereses moratorios pagando hoy!

*JUNTOS AVANZAMOS* 🤝',
'["nombre_cliente", "codigo_credito", "monto_cuota"]'::jsonb,
true),

('vencido_gracia', 'Vencido con Gracia', 'recordatorio',
'⏳ *CUOTA VENCIDA - PERIODO DE GRACIA - JUNTAY*

Hola {{nombre_cliente}},

Tu préstamo está vencido pero aún tienes *1 semana de gracia*:

💳 Crédito: {{codigo_credito}}
💰 Monto a pagar: S/ {{monto_cuota}}
⏰ Plazo de gracia hasta: {{fecha_limite_gracia}}

Después de esta fecha, la prenda pasará al proceso de venta.

¡Contáctanos para coordinar el pago!

*JUNTOS AVANZAMOS* 🤝',
'["nombre_cliente", "codigo_credito", "monto_cuota", "fecha_limite_gracia"]'::jsonb,
true),

('saludo_navidad', 'Saludo Navidad', 'saludo',
'🎄 *FELIZ NAVIDAD - JUNTAY*

Querido {{nombre_cliente}},

En esta Navidad, queremos agradecerte por ser parte de nuestra familia JUNTAY.

Que esta época esté llena de alegría, amor y prosperidad para ti y tu familia.

¡Feliz Navidad! 🎁✨

*JUNTOS AVANZAMOS* 🤝',
'["nombre_cliente"]'::jsonb,
true),

('saludo_ano_nuevo', 'Saludo Año Nuevo', 'saludo',
'🎊 *FELIZ AÑO NUEVO - JUNTAY*

Hola {{nombre_cliente}},

¡Te deseamos un próspero Año Nuevo 2025!

Que este año esté lleno de oportunidades, éxitos y bendiciones para ti y tu familia.

Gracias por confiar en nosotros durante todo este tiempo.

*JUNTOS AVANZAMOS* hacia un mejor año 🚀

¡Feliz 2025! 🎉',
'["nombre_cliente"]'::jsonb,
true)

ON CONFLICT (id) DO NOTHING;

-- Configurar RLS (Row Level Security)
ALTER TABLE mensajes_whatsapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantillas_whatsapp ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para mensajes_whatsapp
DROP POLICY IF EXISTS "Usuarios pueden ver mensajes WhatsApp" ON mensajes_whatsapp;
DROP POLICY IF EXISTS "Usuarios pueden crear mensajes WhatsApp" ON mensajes_whatsapp;
DROP POLICY IF EXISTS "Usuarios pueden actualizar mensajes WhatsApp" ON mensajes_whatsapp;

CREATE POLICY "Usuarios pueden ver mensajes WhatsApp"
ON mensajes_whatsapp FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden crear mensajes WhatsApp"
ON mensajes_whatsapp FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar mensajes WhatsApp"
ON mensajes_whatsapp FOR UPDATE
TO authenticated
USING (true);

-- Políticas RLS para plantillas_whatsapp
DROP POLICY IF EXISTS "Usuarios pueden ver plantillas WhatsApp" ON plantillas_whatsapp;
DROP POLICY IF EXISTS "Usuarios pueden gestionar plantillas WhatsApp" ON plantillas_whatsapp;

CREATE POLICY "Usuarios pueden ver plantillas WhatsApp"
ON plantillas_whatsapp FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden gestionar plantillas WhatsApp"
ON plantillas_whatsapp FOR ALL
TO authenticated
USING (true);

-- Verificar creación
SELECT 
    'Tablas WhatsApp creadas' as mensaje,
    (SELECT COUNT(*) FROM mensajes_whatsapp) as mensajes_count,
    (SELECT COUNT(*) FROM plantillas_whatsapp) as plantillas_count;
