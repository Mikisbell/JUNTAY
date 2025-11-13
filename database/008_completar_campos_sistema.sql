-- =====================================================
-- COMPLETAR CAMPOS FALTANTES DEL SISTEMA - JUNTAY
-- =====================================================
-- Script para agregar campos críticos que faltan
-- Fecha: Nov 13, 2025

-- =====================================================
-- COMPLETAR TABLA GARANTIAS
-- =====================================================

-- Agregar campos críticos para casa de empeño
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS numero_boleta VARCHAR(20) UNIQUE;
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS fecha_vencimiento_legal DATE;
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS periodo_gracia_dias INTEGER DEFAULT 30;
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS ubicacion_estante VARCHAR(50);
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS peso DECIMAL(8,3);
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS dimensiones VARCHAR(100);
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS material VARCHAR(100);
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS color VARCHAR(50);
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS fecha_tasacion DATE;
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS valor_prestamo_maximo DECIMAL(10,2);
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS requiere_evaluacion_especial BOOLEAN DEFAULT false;
ALTER TABLE garantias ADD COLUMN IF NOT EXISTS notas_tasador TEXT;

-- Corregir estados de garantía
ALTER TABLE garantias ALTER COLUMN estado SET DEFAULT 'disponible';

-- Agregar constraint para estados válidos
ALTER TABLE garantias DROP CONSTRAINT IF EXISTS garantias_estado_check;
ALTER TABLE garantias ADD CONSTRAINT garantias_estado_check 
    CHECK (estado IN ('disponible', 'en_prenda', 'liberado', 'vendido', 'perdido', 'evaluacion'));

-- =====================================================
-- COMPLETAR TABLA CLIENTES
-- =====================================================

-- Agregar campos de contacto y verificación
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS telefono_whatsapp VARCHAR(20);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN DEFAULT false;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS telefono_verificado BOOLEAN DEFAULT false;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS fecha_ultima_verificacion DATE;

-- Agregar campos de ubicación detallada
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS departamento_id INTEGER;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS provincia_id INTEGER;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS distrito_id INTEGER;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS codigo_postal VARCHAR(10);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS coordenadas_gps VARCHAR(50);

-- Agregar campos de evaluación crediticia
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS score_crediticio INTEGER;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS limite_credito_aprobado DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS fecha_ultima_evaluacion DATE;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS historial_pagos VARCHAR(20) DEFAULT 'nuevo'; -- 'excelente', 'bueno', 'regular', 'malo', 'nuevo'

-- Agregar campos de documentos
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tiene_dni_copia BOOLEAN DEFAULT false;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tiene_recibo_servicios BOOLEAN DEFAULT false;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tiene_comprobante_ingresos BOOLEAN DEFAULT false;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS documentos_completos BOOLEAN DEFAULT false;

-- =====================================================
-- COMPLETAR TABLA CREDITOS
-- =====================================================

-- Agregar campos de control y seguimiento
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS numero_contrato VARCHAR(30) UNIQUE;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS fecha_vencimiento_legal DATE;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS dias_gracia INTEGER DEFAULT 30;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS notificaciones_enviadas INTEGER DEFAULT 0;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS fecha_ultima_notificacion DATE;

-- Agregar campos de intereses y mora detallados
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS interes_acumulado DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS mora_acumulada DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS fecha_inicio_mora DATE;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS tasa_interes_anual DECIMAL(5,2);

-- Agregar campos de garantías y avalúos
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS valor_garantias DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS porcentaje_cobertura DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS requiere_renovacion BOOLEAN DEFAULT false;
ALTER TABLE creditos ADD COLUMN IF NOT EXISTS fecha_posible_renovacion DATE;

-- Corregir estados de crédito
ALTER TABLE creditos DROP CONSTRAINT IF EXISTS creditos_estado_check;
ALTER TABLE creditos ADD CONSTRAINT creditos_estado_check 
    CHECK (estado IN ('vigente', 'vencido', 'en_mora', 'pagado', 'cancelado', 'renovado', 'en_remate'));

-- =====================================================
-- CREAR TABLA DE REMATES (FALTABA COMPLETAMENTE)
-- =====================================================

CREATE TABLE IF NOT EXISTS remates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    garantia_id UUID REFERENCES garantias(id),
    credito_id UUID REFERENCES creditos(id),
    numero_remate VARCHAR(20) UNIQUE NOT NULL,
    fecha_inicio_remate DATE NOT NULL,
    fecha_fin_remate DATE,
    precio_base DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2),
    estado VARCHAR(20) DEFAULT 'programado', -- 'programado', 'en_proceso', 'vendido', 'no_vendido', 'cancelado'
    comprador_nombre VARCHAR(255),
    comprador_documento VARCHAR(20),
    comprador_telefono VARCHAR(20),
    metodo_pago VARCHAR(50),
    observaciones TEXT,
    realizado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREAR TABLA DE NOTIFICACIONES (FALTABA)
-- =====================================================

CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    credito_id UUID REFERENCES creditos(id),
    cliente_id UUID REFERENCES clientes(id),
    tipo VARCHAR(30) NOT NULL, -- 'vencimiento', 'mora', 'remate', 'pago_recibido', 'recordatorio'
    canal VARCHAR(20) NOT NULL, -- 'whatsapp', 'sms', 'email', 'llamada', 'presencial'
    mensaje TEXT NOT NULL,
    telefono_destino VARCHAR(20),
    email_destino VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'enviado', 'entregado', 'fallido'
    fecha_programada TIMESTAMPTZ,
    fecha_enviado TIMESTAMPTZ,
    fecha_entregado TIMESTAMPTZ,
    respuesta_cliente TEXT,
    costo_envio DECIMAL(8,4) DEFAULT 0.00,
    proveedor VARCHAR(50), -- 'twilio', 'whatsapp_business', 'interno'
    mensaje_id_externo VARCHAR(100),
    error_detalle TEXT,
    enviado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREAR TABLA DE EVALUACIONES (FALTABA)
-- =====================================================

CREATE TABLE IF NOT EXISTS evaluaciones_credito (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id),
    evaluado_por UUID REFERENCES usuarios(id),
    fecha_evaluacion DATE NOT NULL,
    score_calculado INTEGER,
    limite_recomendado DECIMAL(10,2),
    observaciones TEXT,
    factores_positivos TEXT,
    factores_negativos TEXT,
    recomendacion VARCHAR(20), -- 'aprobar', 'rechazar', 'aprobar_con_condiciones'
    condiciones_especiales TEXT,
    vigente_hasta DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMPLETAR TABLA PAGOS
-- =====================================================

-- Verificar si la tabla pagos existe, si no crearla
CREATE TABLE IF NOT EXISTS pagos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    credito_id UUID REFERENCES creditos(id),
    numero_recibo VARCHAR(30) UNIQUE NOT NULL,
    monto_pago DECIMAL(10,2) NOT NULL,
    monto_capital DECIMAL(10,2) DEFAULT 0.00,
    monto_interes DECIMAL(10,2) DEFAULT 0.00,
    monto_mora DECIMAL(10,2) DEFAULT 0.00,
    fecha_pago DATE NOT NULL,
    metodo_pago VARCHAR(30) NOT NULL, -- 'efectivo', 'yape', 'plin', 'transferencia', 'tarjeta'
    referencia_pago VARCHAR(100),
    observaciones TEXT,
    recibido_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar campos faltantes a pagos
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS comprobante_url TEXT;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'confirmado'; -- 'pendiente', 'confirmado', 'anulado'
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS fecha_anulacion DATE;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS motivo_anulacion TEXT;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS anulado_por UUID REFERENCES usuarios(id);

-- =====================================================
-- COMPLETAR TABLA CRONOGRAMA_PAGOS
-- =====================================================

-- Verificar si existe, si no crearla
CREATE TABLE IF NOT EXISTS cronograma_pagos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    credito_id UUID REFERENCES creditos(id),
    numero_cuota INTEGER NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    monto_cuota DECIMAL(10,2) NOT NULL,
    monto_capital DECIMAL(10,2) NOT NULL,
    monto_interes DECIMAL(10,2) NOT NULL,
    saldo_pendiente DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'pagado', 'vencido', 'mora'
    fecha_pago DATE,
    monto_pagado DECIMAL(10,2) DEFAULT 0.00,
    dias_mora INTEGER DEFAULT 0,
    monto_mora DECIMAL(10,2) DEFAULT 0.00,
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para garantías
CREATE INDEX IF NOT EXISTS idx_garantias_estado ON garantias(estado);
CREATE INDEX IF NOT EXISTS idx_garantias_credito_id ON garantias(credito_id);
CREATE INDEX IF NOT EXISTS idx_garantias_numero_boleta ON garantias(numero_boleta);
CREATE INDEX IF NOT EXISTS idx_garantias_fecha_vencimiento ON garantias(fecha_vencimiento_legal);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_numero_documento ON clientes(numero_documento);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono_principal ON clientes(telefono_principal);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON clientes(activo);

-- Índices para créditos
CREATE INDEX IF NOT EXISTS idx_creditos_estado ON creditos(estado);
CREATE INDEX IF NOT EXISTS idx_creditos_cliente_id ON creditos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_creditos_fecha_vencimiento ON creditos(fecha_vencimiento_legal);
CREATE INDEX IF NOT EXISTS idx_creditos_numero_contrato ON creditos(numero_contrato);

-- Índices para pagos
CREATE INDEX IF NOT EXISTS idx_pagos_credito_id ON pagos(credito_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha_pago ON pagos(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_pagos_metodo_pago ON pagos(metodo_pago);

-- Índices para notificaciones
CREATE INDEX IF NOT EXISTS idx_notificaciones_credito_id ON notificaciones(credito_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_estado ON notificaciones(estado);
CREATE INDEX IF NOT EXISTS idx_notificaciones_fecha_programada ON notificaciones(fecha_programada);

-- =====================================================
-- TRIGGERS PARA AUDITORÍA Y AUTOMATIZACIÓN
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_garantias_updated_at ON garantias;
CREATE TRIGGER update_garantias_updated_at
    BEFORE UPDATE ON garantias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_creditos_updated_at ON creditos;
CREATE TRIGGER update_creditos_updated_at
    BEFORE UPDATE ON creditos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIONES DE NEGOCIO AUTOMATIZADAS
-- =====================================================

-- Función para calcular días de mora
CREATE OR REPLACE FUNCTION calcular_dias_mora(fecha_vencimiento DATE)
RETURNS INTEGER AS $$
BEGIN
    IF fecha_vencimiento < CURRENT_DATE THEN
        RETURN CURRENT_DATE - fecha_vencimiento;
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de boleta
CREATE OR REPLACE FUNCTION generar_numero_boleta()
RETURNS VARCHAR AS $$
DECLARE
    nuevo_numero VARCHAR;
    contador INTEGER;
BEGIN
    SELECT COUNT(*) + 1 INTO contador FROM garantias WHERE numero_boleta IS NOT NULL;
    nuevo_numero := 'BOL-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(contador::TEXT, 6, '0');
    RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de contrato
CREATE OR REPLACE FUNCTION generar_numero_contrato()
RETURNS VARCHAR AS $$
DECLARE
    nuevo_numero VARCHAR;
    contador INTEGER;
BEGIN
    SELECT COUNT(*) + 1 INTO contador FROM creditos WHERE numero_contrato IS NOT NULL;
    nuevo_numero := 'CON-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(contador::TEXT, 6, '0');
    RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE remates IS 'Registro de remates de garantías no recuperadas';
COMMENT ON TABLE notificaciones IS 'Sistema de notificaciones automáticas a clientes';
COMMENT ON TABLE evaluaciones_credito IS 'Evaluaciones crediticias de clientes';

COMMENT ON COLUMN garantias.numero_boleta IS 'Número único de boleta de empeño';
COMMENT ON COLUMN garantias.fecha_vencimiento_legal IS 'Fecha límite legal para recuperar la garantía';
COMMENT ON COLUMN garantias.periodo_gracia_dias IS 'Días de gracia después del vencimiento';

COMMENT ON COLUMN clientes.score_crediticio IS 'Puntaje crediticio calculado (0-1000)';
COMMENT ON COLUMN clientes.limite_credito_aprobado IS 'Límite máximo de crédito aprobado';

COMMENT ON COLUMN creditos.numero_contrato IS 'Número único del contrato de préstamo';
COMMENT ON COLUMN creditos.fecha_vencimiento_legal IS 'Fecha de vencimiento legal del crédito';

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar resumen de campos agregados
SELECT 
    'Actualización completada' as status,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'garantias') as campos_garantias,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'clientes') as campos_clientes,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'creditos') as campos_creditos,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('remates', 'notificaciones', 'evaluaciones_credito')) as nuevas_tablas;
