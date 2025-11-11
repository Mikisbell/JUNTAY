-- =====================================================
-- SISTEMA DE CASA DE EMPEÑO - JUNTAY
-- Base de datos PostgreSQL para Supabase
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLAS DE CONFIGURACIÓN Y MAESTROS
-- =====================================================

-- Tabla de empresas/sucursales
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ruc VARCHAR(11) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    logo_url TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios del sistema (empleados)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(50) NOT NULL, -- 'admin', 'gerente', 'cajero', 'analista'
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE CLIENTES
-- =====================================================

-- Tabla de clientes (personas que solicitan préstamos)
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    tipo_persona VARCHAR(20) NOT NULL, -- 'natural', 'juridica'
    tipo_documento VARCHAR(20) NOT NULL, -- 'dni', 'ruc', 'pasaporte', 'carnet_extranjeria'
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    
    -- Datos persona natural
    nombres VARCHAR(100),
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE,
    genero VARCHAR(10), -- 'masculino', 'femenino', 'otro'
    estado_civil VARCHAR(20), -- 'soltero', 'casado', 'divorciado', 'viudo'
    
    -- Datos persona jurídica
    razon_social VARCHAR(255),
    representante_legal VARCHAR(255),
    
    -- Datos de contacto
    email VARCHAR(100),
    telefono_principal VARCHAR(20),
    telefono_secundario VARCHAR(20),
    
    -- Dirección
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    direccion TEXT,
    referencia TEXT,
    
    -- Datos laborales
    ocupacion VARCHAR(100),
    empresa_trabaja VARCHAR(255),
    ingreso_mensual DECIMAL(12,2),
    
    -- Datos adicionales
    foto_url TEXT,
    observaciones TEXT,
    calificacion_crediticia VARCHAR(20), -- 'excelente', 'bueno', 'regular', 'malo'
    activo BOOLEAN DEFAULT true,
    
    created_by UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cónyuges (para clientes casados)
CREATE TABLE conyuges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    telefono VARCHAR(20),
    ocupacion VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de garantes/avales
CREATE TABLE garantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    ocupacion VARCHAR(100),
    ingreso_mensual DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE CRÉDITOS/PRÉSTAMOS
-- =====================================================

-- Tabla de tipos de crédito
CREATE TABLE tipos_credito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tasa_interes_mensual DECIMAL(5,2) NOT NULL,
    tasa_mora_diaria DECIMAL(5,2) NOT NULL,
    monto_minimo DECIMAL(12,2),
    monto_maximo DECIMAL(12,2),
    plazo_minimo_dias INTEGER,
    plazo_maximo_dias INTEGER,
    requiere_garantia BOOLEAN DEFAULT true,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de solicitudes de crédito
CREATE TABLE solicitudes_credito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    empresa_id UUID REFERENCES empresas(id),
    cliente_id UUID REFERENCES clientes(id),
    tipo_credito_id UUID REFERENCES tipos_credito(id),
    
    -- Datos de la solicitud
    monto_solicitado DECIMAL(12,2) NOT NULL,
    plazo_dias INTEGER NOT NULL,
    numero_cuotas INTEGER NOT NULL,
    frecuencia_pago VARCHAR(20) NOT NULL, -- 'diario', 'semanal', 'quincenal', 'mensual'
    
    -- Tasas
    tasa_interes_mensual DECIMAL(5,2) NOT NULL,
    tasa_mora_diaria DECIMAL(5,2) NOT NULL,
    
    -- Fechas
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_evaluacion TIMESTAMP WITH TIME ZONE,
    fecha_aprobacion TIMESTAMP WITH TIME ZONE,
    fecha_desembolso TIMESTAMP WITH TIME ZONE,
    
    -- Estado
    estado VARCHAR(50) NOT NULL, -- 'pendiente', 'en_evaluacion', 'aprobado', 'rechazado', 'desembolsado', 'cancelado'
    motivo_rechazo TEXT,
    
    -- Referencias
    tiene_conyuge BOOLEAN DEFAULT false,
    tiene_garante BOOLEAN DEFAULT false,
    
    observaciones TEXT,
    
    evaluado_por UUID REFERENCES usuarios(id),
    aprobado_por UUID REFERENCES usuarios(id),
    created_by UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de créditos aprobados
CREATE TABLE creditos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    solicitud_id UUID REFERENCES solicitudes_credito(id),
    empresa_id UUID REFERENCES empresas(id),
    cliente_id UUID REFERENCES clientes(id),
    tipo_credito_id UUID REFERENCES tipos_credito(id),
    
    -- Montos
    monto_prestado DECIMAL(12,2) NOT NULL,
    monto_interes DECIMAL(12,2) NOT NULL,
    monto_total DECIMAL(12,2) NOT NULL,
    monto_pagado DECIMAL(12,2) DEFAULT 0,
    monto_mora DECIMAL(12,2) DEFAULT 0,
    saldo_pendiente DECIMAL(12,2) NOT NULL,
    
    -- Configuración
    numero_cuotas INTEGER NOT NULL,
    cuotas_pagadas INTEGER DEFAULT 0,
    frecuencia_pago VARCHAR(20) NOT NULL,
    monto_cuota DECIMAL(12,2) NOT NULL,
    
    -- Tasas
    tasa_interes_mensual DECIMAL(5,2) NOT NULL,
    tasa_mora_diaria DECIMAL(5,2) NOT NULL,
    
    -- Fechas
    fecha_desembolso DATE NOT NULL,
    fecha_primer_vencimiento DATE NOT NULL,
    fecha_ultimo_vencimiento DATE NOT NULL,
    fecha_ultimo_pago TIMESTAMP WITH TIME ZONE,
    
    -- Estado
    estado VARCHAR(50) NOT NULL, -- 'vigente', 'vencido', 'en_mora', 'pagado', 'refinanciado', 'castigado'
    dias_mora INTEGER DEFAULT 0,
    
    observaciones TEXT,
    
    desembolsado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cronograma de pagos
CREATE TABLE cronograma_pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credito_id UUID REFERENCES creditos(id) ON DELETE CASCADE,
    numero_cuota INTEGER NOT NULL,
    
    -- Montos
    monto_cuota DECIMAL(12,2) NOT NULL,
    monto_capital DECIMAL(12,2) NOT NULL,
    monto_interes DECIMAL(12,2) NOT NULL,
    monto_mora DECIMAL(12,2) DEFAULT 0,
    monto_pagado DECIMAL(12,2) DEFAULT 0,
    saldo_pendiente DECIMAL(12,2) NOT NULL,
    
    -- Fechas
    fecha_vencimiento DATE NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    
    -- Estado
    estado VARCHAR(50) NOT NULL, -- 'pendiente', 'pagado', 'parcial', 'vencido'
    dias_mora INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(credito_id, numero_cuota)
);

-- Tabla de relación crédito-garante
CREATE TABLE credito_garantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credito_id UUID REFERENCES creditos(id) ON DELETE CASCADE,
    garante_id UUID REFERENCES garantes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE GARANTÍAS (BIENES EMPEÑADOS)
-- =====================================================

-- Tabla de categorías de garantías
CREATE TABLE categorias_garantia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    porcentaje_prestamo DECIMAL(5,2), -- % del valor del bien que se puede prestar
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de garantías/bienes empeñados
CREATE TABLE garantias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    credito_id UUID REFERENCES creditos(id),
    categoria_id UUID REFERENCES categorias_garantia(id),
    
    -- Datos del bien
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),
    
    -- Valuación
    valor_comercial DECIMAL(12,2) NOT NULL,
    valor_tasacion DECIMAL(12,2) NOT NULL,
    porcentaje_prestamo DECIMAL(5,2),
    
    -- Estado
    estado VARCHAR(50) NOT NULL, -- 'en_garantia', 'recuperado', 'vendido', 'perdido'
    estado_conservacion VARCHAR(50), -- 'nuevo', 'muy_bueno', 'bueno', 'regular', 'malo'
    
    -- Fechas
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_recuperacion TIMESTAMP WITH TIME ZONE,
    fecha_venta TIMESTAMP WITH TIME ZONE,
    
    observaciones TEXT,
    ubicacion_fisica VARCHAR(255), -- Ubicación en almacén
    
    tasado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fotos de garantías
CREATE TABLE garantia_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garantia_id UUID REFERENCES garantias(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    descripcion VARCHAR(255),
    es_principal BOOLEAN DEFAULT false,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE FINANZAS
-- =====================================================

-- Tabla de cajas
CREATE TABLE cajas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    saldo_inicial DECIMAL(12,2) DEFAULT 0,
    saldo_actual DECIMAL(12,2) DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de apertura y cierre de caja
CREATE TABLE cajas_apertura_cierre (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caja_id UUID REFERENCES cajas(id),
    usuario_id UUID REFERENCES usuarios(id),
    
    tipo VARCHAR(20) NOT NULL, -- 'apertura', 'cierre'
    
    -- Montos
    saldo_sistema DECIMAL(12,2) NOT NULL,
    saldo_fisico DECIMAL(12,2) NOT NULL,
    diferencia DECIMAL(12,2) NOT NULL,
    
    -- Desglose
    total_ingresos DECIMAL(12,2) DEFAULT 0,
    total_egresos DECIMAL(12,2) DEFAULT 0,
    total_cobranzas DECIMAL(12,2) DEFAULT 0,
    total_desembolsos DECIMAL(12,2) DEFAULT 0,
    
    fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    observaciones TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cuentas bancarias
CREATE TABLE cuentas_bancarias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    banco VARCHAR(100) NOT NULL,
    tipo_cuenta VARCHAR(50) NOT NULL, -- 'ahorros', 'corriente'
    numero_cuenta VARCHAR(50) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'PEN',
    saldo_actual DECIMAL(12,2) DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    credito_id UUID REFERENCES creditos(id),
    cronograma_id UUID REFERENCES cronograma_pagos(id),
    caja_id UUID REFERENCES cajas(id),
    
    -- Tipo de pago
    tipo_pago VARCHAR(50) NOT NULL, -- 'cuota', 'adelanto', 'cancelacion_total', 'mora'
    metodo_pago VARCHAR(50) NOT NULL, -- 'efectivo', 'transferencia', 'yape', 'plin'
    
    -- Montos
    monto_total DECIMAL(12,2) NOT NULL,
    monto_capital DECIMAL(12,2) DEFAULT 0,
    monto_interes DECIMAL(12,2) DEFAULT 0,
    monto_mora DECIMAL(12,2) DEFAULT 0,
    
    -- Fechas
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Referencias
    numero_operacion VARCHAR(100),
    cuenta_bancaria_id UUID REFERENCES cuentas_bancarias(id),
    
    observaciones TEXT,
    
    registrado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de desembolsos
CREATE TABLE desembolsos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    credito_id UUID REFERENCES creditos(id),
    caja_id UUID REFERENCES cajas(id),
    
    monto DECIMAL(12,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL, -- 'efectivo', 'transferencia'
    fecha_desembolso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    cuenta_bancaria_id UUID REFERENCES cuentas_bancarias(id),
    numero_operacion VARCHAR(100),
    
    observaciones TEXT,
    
    desembolsado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de movimientos generales (ingresos/egresos)
CREATE TABLE movimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    empresa_id UUID REFERENCES empresas(id),
    caja_id UUID REFERENCES cajas(id),
    cuenta_bancaria_id UUID REFERENCES cuentas_bancarias(id),
    
    tipo VARCHAR(20) NOT NULL, -- 'ingreso', 'egreso'
    categoria VARCHAR(100) NOT NULL, -- 'servicios', 'mantenimiento', 'sueldos', 'otros'
    concepto TEXT NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    
    fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    documento_tipo VARCHAR(50), -- 'boleta', 'factura', 'recibo'
    documento_numero VARCHAR(50),
    
    observaciones TEXT,
    
    registrado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE REPORTES Y AUDITORÍA
-- =====================================================

-- Tabla de auditoría general
CREATE TABLE auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id),
    tabla VARCHAR(100) NOT NULL,
    operacion VARCHAR(20) NOT NULL, -- 'insert', 'update', 'delete'
    registro_id UUID,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Clientes
CREATE INDEX idx_clientes_documento ON clientes(numero_documento);
CREATE INDEX idx_clientes_empresa ON clientes(empresa_id);
CREATE INDEX idx_clientes_activo ON clientes(activo);

-- Créditos
CREATE INDEX idx_creditos_cliente ON creditos(cliente_id);
CREATE INDEX idx_creditos_estado ON creditos(estado);
CREATE INDEX idx_creditos_fecha_desembolso ON creditos(fecha_desembolso);

-- Cronograma
CREATE INDEX idx_cronograma_credito ON cronograma_pagos(credito_id);
CREATE INDEX idx_cronograma_estado ON cronograma_pagos(estado);
CREATE INDEX idx_cronograma_fecha_vencimiento ON cronograma_pagos(fecha_vencimiento);

-- Garantías
CREATE INDEX idx_garantias_credito ON garantias(credito_id);
CREATE INDEX idx_garantias_estado ON garantias(estado);

-- Pagos
CREATE INDEX idx_pagos_credito ON pagos(credito_id);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);

-- =====================================================
-- TRIGGERS PARA AUDITORÍA Y LÓGICA DE NEGOCIO
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
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creditos_updated_at BEFORE UPDATE ON creditos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_garantias_updated_at BEFORE UPDATE ON garantias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de créditos activos con información del cliente
CREATE VIEW vista_creditos_activos AS
SELECT 
    c.id,
    c.codigo,
    c.monto_prestado,
    c.saldo_pendiente,
    c.estado,
    c.fecha_desembolso,
    c.dias_mora,
    cl.numero_documento,
    cl.nombres,
    cl.apellido_paterno,
    cl.apellido_materno,
    cl.telefono_principal,
    tc.nombre as tipo_credito
FROM creditos c
INNER JOIN clientes cl ON c.cliente_id = cl.id
INNER JOIN tipos_credito tc ON c.tipo_credito_id = tc.id
WHERE c.estado IN ('vigente', 'en_mora', 'vencido');

-- Vista de cuotas por vencer (próximos 7 días)
CREATE VIEW vista_cuotas_por_vencer AS
SELECT 
    cp.id,
    c.codigo as codigo_credito,
    cl.numero_documento,
    CONCAT(cl.nombres, ' ', cl.apellido_paterno) as cliente,
    cl.telefono_principal,
    cp.numero_cuota,
    cp.monto_cuota,
    cp.fecha_vencimiento,
    cp.estado
FROM cronograma_pagos cp
INNER JOIN creditos c ON cp.credito_id = c.id
INNER JOIN clientes cl ON c.cliente_id = cl.id
WHERE cp.estado = 'pendiente'
AND cp.fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY cp.fecha_vencimiento;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías de garantía por defecto
INSERT INTO categorias_garantia (id, nombre, descripcion, porcentaje_prestamo) VALUES
(uuid_generate_v4(), 'Electrónica', 'Celulares, laptops, tablets, consolas', 70.00),
(uuid_generate_v4(), 'Electrodomésticos', 'Refrigeradoras, lavadoras, microondas', 60.00),
(uuid_generate_v4(), 'Joyas', 'Oro, plata, diamantes', 80.00),
(uuid_generate_v4(), 'Vehículos', 'Motos, autos, camionetas', 70.00),
(uuid_generate_v4(), 'Herramientas', 'Herramientas eléctricas y manuales', 65.00),
(uuid_generate_v4(), 'Otros', 'Otros bienes', 50.00);

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE clientes IS 'Tabla principal de clientes que solicitan préstamos';
COMMENT ON TABLE creditos IS 'Tabla de créditos/préstamos aprobados y desembolsados';
COMMENT ON TABLE garantias IS 'Tabla de bienes empeñados como garantía de créditos';
COMMENT ON TABLE cronograma_pagos IS 'Cronograma detallado de pagos de cada crédito';
COMMENT ON TABLE pagos IS 'Registro de todos los pagos realizados';
