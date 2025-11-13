-- =====================================================
-- CREAR TODAS LAS TABLAS DEL SISTEMA JUNTAY
-- =====================================================
-- Script completo para crear toda la estructura de BD
-- Ejecutar PRIMERO antes que cualquier otro script
-- Fecha: Nov 12, 2025

-- =====================================================
-- EXTENSIONES NECESARIAS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLA: EMPRESAS
-- =====================================================
CREATE TABLE IF NOT EXISTS empresas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255),
    logo_url TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: USUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(50) DEFAULT 'empleado',
    activo BOOLEAN DEFAULT true,
    ultima_conexion TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: DEPARTAMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS departamentos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(2) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(150),
    ubigeo_inei VARCHAR(10),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: PROVINCIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS provincias (
    id SERIAL PRIMARY KEY,
    departamento_id INTEGER REFERENCES departamentos(id),
    codigo VARCHAR(4) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(150),
    ubigeo_inei VARCHAR(10),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: DISTRITOS
-- =====================================================
CREATE TABLE IF NOT EXISTS distritos (
    id SERIAL PRIMARY KEY,
    provincia_id INTEGER REFERENCES provincias(id),
    departamento_id INTEGER REFERENCES departamentos(id),
    codigo VARCHAR(6) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(150),
    ubigeo_inei VARCHAR(10),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: CLIENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id),
    tipo_persona VARCHAR(20) DEFAULT 'natural', -- 'natural', 'juridica'
    tipo_documento VARCHAR(20) DEFAULT 'DNI',
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100),
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE,
    genero VARCHAR(10),
    estado_civil VARCHAR(20),
    razon_social VARCHAR(255),
    representante_legal VARCHAR(255),
    email VARCHAR(255),
    telefono_principal VARCHAR(20),
    telefono_secundario VARCHAR(20),
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    direccion TEXT,
    referencia TEXT,
    ocupacion VARCHAR(100),
    empresa_trabaja VARCHAR(255),
    ingreso_mensual DECIMAL(10,2),
    foto_url TEXT,
    observaciones TEXT,
    calificacion_crediticia VARCHAR(20) DEFAULT 'bueno',
    activo BOOLEAN DEFAULT true,
    created_by UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: CONYUGES
-- =====================================================
CREATE TABLE IF NOT EXISTS conyuges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(20) DEFAULT 'DNI',
    numero_documento VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    ocupacion VARCHAR(100),
    empresa_trabaja VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: GARANTES
-- =====================================================
CREATE TABLE IF NOT EXISTS garantes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo_documento VARCHAR(20) DEFAULT 'DNI',
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    ocupacion VARCHAR(100),
    empresa_trabaja VARCHAR(255),
    ingreso_mensual DECIMAL(10,2),
    observaciones TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: TIPOS_CREDITO
-- =====================================================
CREATE TABLE IF NOT EXISTS tipos_credito (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tasa_interes_mensual DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    tasa_mora_diaria DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    monto_minimo DECIMAL(10,2) DEFAULT 0.00,
    monto_maximo DECIMAL(10,2) DEFAULT 0.00,
    plazo_minimo_dias INTEGER DEFAULT 30,
    plazo_maximo_dias INTEGER DEFAULT 360,
    requiere_garante BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: SOLICITUDES_CREDITO
-- =====================================================
CREATE TABLE IF NOT EXISTS solicitudes_credito (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    cliente_id UUID REFERENCES clientes(id),
    tipo_credito_id UUID REFERENCES tipos_credito(id),
    monto_solicitado DECIMAL(10,2) NOT NULL,
    plazo_dias INTEGER NOT NULL,
    proposito TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'evaluando', 'aprobado', 'rechazado'
    observaciones TEXT,
    evaluado_por UUID REFERENCES usuarios(id),
    fecha_evaluacion TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: CREDITOS
-- =====================================================
CREATE TABLE IF NOT EXISTS creditos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    solicitud_id UUID REFERENCES solicitudes_credito(id),
    empresa_id UUID REFERENCES empresas(id),
    cliente_id UUID REFERENCES clientes(id),
    tipo_credito_id UUID REFERENCES tipos_credito(id),
    monto_prestado DECIMAL(10,2) NOT NULL,
    monto_interes DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    monto_total DECIMAL(10,2) NOT NULL,
    monto_pagado DECIMAL(10,2) DEFAULT 0.00,
    monto_mora DECIMAL(10,2) DEFAULT 0.00,
    saldo_pendiente DECIMAL(10,2) NOT NULL,
    numero_cuotas INTEGER NOT NULL DEFAULT 1,
    cuotas_pagadas INTEGER DEFAULT 0,
    frecuencia_pago VARCHAR(20) DEFAULT 'mensual', -- 'diario', 'semanal', 'quincenal', 'mensual'
    monto_cuota DECIMAL(10,2) NOT NULL,
    tasa_interes_mensual DECIMAL(5,2) NOT NULL,
    tasa_mora_diaria DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    fecha_desembolso DATE NOT NULL,
    fecha_primer_vencimiento DATE NOT NULL,
    fecha_ultimo_vencimiento DATE NOT NULL,
    fecha_ultimo_pago DATE,
    estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'pagado', 'vencido', 'en_mora', 'cancelado'
    dias_mora INTEGER DEFAULT 0,
    observaciones TEXT,
    desembolsado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: CREDITO_GARANTES
-- =====================================================
CREATE TABLE IF NOT EXISTS credito_garantes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    credito_id UUID REFERENCES creditos(id) ON DELETE CASCADE,
    garante_id UUID REFERENCES garantes(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: CRONOGRAMA_PAGOS
-- =====================================================
CREATE TABLE IF NOT EXISTS cronograma_pagos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    credito_id UUID REFERENCES creditos(id) ON DELETE CASCADE,
    numero_cuota INTEGER NOT NULL,
    monto_cuota DECIMAL(10,2) NOT NULL,
    monto_capital DECIMAL(10,2) NOT NULL,
    monto_interes DECIMAL(10,2) NOT NULL,
    monto_mora DECIMAL(10,2) DEFAULT 0.00,
    monto_pagado DECIMAL(10,2) DEFAULT 0.00,
    saldo_pendiente DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_pago DATE,
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'pagado', 'vencido'
    dias_mora INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: CATEGORIAS_GARANTIA
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias_garantia (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    porcentaje_prestamo_maximo DECIMAL(5,2) DEFAULT 70.00, -- % máximo del valor que se puede prestar
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: GARANTIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS garantias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    credito_id UUID REFERENCES creditos(id),
    categoria_id UUID REFERENCES categorias_garantia(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),
    valor_comercial DECIMAL(10,2) NOT NULL,
    valor_tasacion DECIMAL(10,2) NOT NULL,
    porcentaje_prestamo DECIMAL(5,2),
    estado VARCHAR(20) DEFAULT 'en_prenda', -- 'en_prenda', 'liberado', 'perdido', 'vendido'
    estado_conservacion VARCHAR(50),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    fecha_recuperacion DATE,
    fecha_venta DATE,
    observaciones TEXT,
    ubicacion_fisica VARCHAR(255),
    tasado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: GARANTIA_FOTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS garantia_fotos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    garantia_id UUID REFERENCES garantias(id) ON DELETE CASCADE,
    archivo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    orden INTEGER DEFAULT 1,
    tamano_bytes INTEGER,
    fecha_subida TIMESTAMPTZ DEFAULT NOW(),
    usuario_id UUID REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: CAJAS
-- =====================================================
CREATE TABLE IF NOT EXISTS cajas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'cerrada', -- 'abierta', 'cerrada', 'en_arqueo', 'bloqueada'
    activa BOOLEAN DEFAULT true,
    responsable_actual_id UUID REFERENCES usuarios(id),
    fecha_ultima_apertura TIMESTAMPTZ,
    fecha_ultimo_cierre TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: SESIONES_CAJA
-- =====================================================
CREATE TABLE IF NOT EXISTS sesiones_caja (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    caja_id UUID REFERENCES cajas(id),
    numero_sesion INTEGER NOT NULL,
    fecha_apertura TIMESTAMPTZ NOT NULL,
    usuario_apertura_id UUID REFERENCES usuarios(id),
    monto_inicial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    billetes_apertura JSONB,
    observaciones_apertura TEXT,
    fecha_cierre TIMESTAMPTZ,
    usuario_cierre_id UUID REFERENCES usuarios(id),
    monto_sistema DECIMAL(10,2),
    monto_contado DECIMAL(10,2),
    diferencia DECIMAL(10,2),
    billetes_cierre JSONB,
    observaciones_cierre TEXT,
    total_ingresos DECIMAL(10,2) DEFAULT 0.00,
    total_egresos DECIMAL(10,2) DEFAULT 0.00,
    total_movimientos INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'abierta', -- 'abierta', 'cerrada', 'cuadrada', 'con_diferencia'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: MOVIMIENTOS_CAJA
-- =====================================================
CREATE TABLE IF NOT EXISTS movimientos_caja (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sesion_id UUID REFERENCES sesiones_caja(id),
    caja_id UUID REFERENCES cajas(id),
    tipo VARCHAR(20) NOT NULL, -- 'ingreso', 'egreso', 'apertura', 'cierre', 'ajuste'
    concepto VARCHAR(100) NOT NULL,
    referencia_tipo VARCHAR(50),
    referencia_id VARCHAR(100),
    referencia_codigo VARCHAR(50),
    monto DECIMAL(10,2) NOT NULL,
    saldo_anterior DECIMAL(10,2) NOT NULL,
    saldo_nuevo DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    comprobante_numero VARCHAR(50),
    metodo_pago VARCHAR(50),
    usuario_id UUID REFERENCES usuarios(id),
    fecha TIMESTAMPTZ DEFAULT NOW(),
    anulado BOOLEAN DEFAULT false,
    fecha_anulacion TIMESTAMPTZ,
    usuario_anulacion_id UUID REFERENCES usuarios(id),
    motivo_anulacion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: ARQUEOS_CAJA
-- =====================================================
CREATE TABLE IF NOT EXISTS arqueos_caja (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sesion_id UUID REFERENCES sesiones_caja(id),
    caja_id UUID REFERENCES cajas(id),
    tipo VARCHAR(20) NOT NULL, -- 'apertura', 'intermedio', 'cierre'
    monto_sistema DECIMAL(10,2) NOT NULL,
    monto_contado DECIMAL(10,2) NOT NULL,
    diferencia DECIMAL(10,2) NOT NULL,
    billetes_200 INTEGER DEFAULT 0,
    billetes_100 INTEGER DEFAULT 0,
    billetes_50 INTEGER DEFAULT 0,
    billetes_20 INTEGER DEFAULT 0,
    billetes_10 INTEGER DEFAULT 0,
    monedas_5 INTEGER DEFAULT 0,
    monedas_2 INTEGER DEFAULT 0,
    monedas_1 INTEGER DEFAULT 0,
    monedas_050 INTEGER DEFAULT 0,
    monedas_020 INTEGER DEFAULT 0,
    monedas_010 INTEGER DEFAULT 0,
    detalle_efectivo JSONB,
    observaciones TEXT,
    justificacion_diferencia TEXT,
    realizado_por UUID REFERENCES usuarios(id),
    supervisado_por UUID REFERENCES usuarios(id),
    fecha TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: CUENTAS_BANCARIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS cuentas_bancarias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id),
    banco VARCHAR(100) NOT NULL,
    tipo_cuenta VARCHAR(50) NOT NULL, -- 'corriente', 'ahorros'
    numero_cuenta VARCHAR(50) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'PEN', -- 'PEN', 'USD'
    titular VARCHAR(255) NOT NULL,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: PAGOS
-- =====================================================
CREATE TABLE IF NOT EXISTS pagos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    credito_id UUID REFERENCES creditos(id),
    cronograma_id UUID REFERENCES cronograma_pagos(id),
    caja_id UUID REFERENCES cajas(id),
    tipo_pago VARCHAR(50) NOT NULL, -- 'cuota', 'parcial', 'total', 'mora'
    metodo_pago VARCHAR(50) NOT NULL, -- 'efectivo', 'transferencia', 'cheque'
    monto_total DECIMAL(10,2) NOT NULL,
    monto_capital DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    monto_interes DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    monto_mora DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fecha_pago DATE NOT NULL,
    numero_operacion VARCHAR(50),
    cuenta_bancaria_id UUID REFERENCES cuentas_bancarias(id),
    observaciones TEXT,
    registrado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: DESEMBOLSOS
-- =====================================================
CREATE TABLE IF NOT EXISTS desembolsos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    credito_id UUID REFERENCES creditos(id),
    caja_id UUID REFERENCES cajas(id),
    monto DECIMAL(10,2) NOT NULL,
    metodo_desembolso VARCHAR(50) NOT NULL, -- 'efectivo', 'transferencia', 'cheque'
    fecha_desembolso DATE NOT NULL,
    numero_operacion VARCHAR(50),
    cuenta_bancaria_id UUID REFERENCES cuentas_bancarias(id),
    observaciones TEXT,
    realizado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: MOVIMIENTOS (Contabilidad general)
-- =====================================================
CREATE TABLE IF NOT EXISTS movimientos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    fecha DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'ingreso', 'egreso'
    concepto VARCHAR(255) NOT NULL,
    referencia_tipo VARCHAR(50), -- 'pago', 'desembolso', 'gasto'
    referencia_id UUID,
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    registrado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: GASTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS gastos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id),
    caja_id UUID REFERENCES cajas(id),
    sesion_id UUID REFERENCES sesiones_caja(id),
    movimiento_id UUID REFERENCES movimientos_caja(id),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    descripcion TEXT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    tipo_comprobante VARCHAR(50),
    numero_comprobante VARCHAR(50),
    proveedor_nombre VARCHAR(255),
    proveedor_ruc VARCHAR(11),
    fecha_gasto DATE NOT NULL,
    fecha_pago DATE,
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'pagado', 'anulado'
    metodo_pago VARCHAR(50),
    registrado_por UUID REFERENCES usuarios(id),
    aprobado_por UUID REFERENCES usuarios(id),
    fecha_aprobacion TIMESTAMPTZ,
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: TRANSFERENCIAS_CAJA
-- =====================================================
CREATE TABLE IF NOT EXISTS transferencias_caja (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    caja_origen_id UUID REFERENCES cajas(id),
    caja_destino_id UUID REFERENCES cajas(id),
    sesion_origen_id UUID REFERENCES sesiones_caja(id),
    sesion_destino_id UUID REFERENCES sesiones_caja(id),
    monto DECIMAL(10,2) NOT NULL,
    concepto TEXT NOT NULL,
    fecha_transferencia TIMESTAMPTZ DEFAULT NOW(),
    autorizado_por UUID REFERENCES usuarios(id),
    realizado_por UUID REFERENCES usuarios(id),
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: AUDITORIA
-- =====================================================
CREATE TABLE IF NOT EXISTS auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id),
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(50) NOT NULL,
    registro_id VARCHAR(100),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: MENSAJES_WHATSAPP
-- =====================================================
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

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_clientes_documento ON clientes(numero_documento);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa ON clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON clientes(activo);

CREATE INDEX IF NOT EXISTS idx_creditos_codigo ON creditos(codigo);
CREATE INDEX IF NOT EXISTS idx_creditos_cliente ON creditos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_creditos_estado ON creditos(estado);
CREATE INDEX IF NOT EXISTS idx_creditos_vencimiento ON creditos(fecha_ultimo_vencimiento);

CREATE INDEX IF NOT EXISTS idx_cronograma_credito ON cronograma_pagos(credito_id);
CREATE INDEX IF NOT EXISTS idx_cronograma_vencimiento ON cronograma_pagos(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_cronograma_estado ON cronograma_pagos(estado);

CREATE INDEX IF NOT EXISTS idx_garantias_credito ON garantias(credito_id);
CREATE INDEX IF NOT EXISTS idx_garantias_codigo ON garantias(codigo);

CREATE INDEX IF NOT EXISTS idx_pagos_credito ON pagos(credito_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(fecha_pago);

CREATE INDEX IF NOT EXISTS idx_movimientos_caja_sesion ON movimientos_caja(sesion_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_fecha ON movimientos_caja(fecha);
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_tipo ON movimientos_caja(tipo);

CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_cliente ON mensajes_whatsapp(cliente_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_estado ON mensajes_whatsapp(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_whatsapp_programado ON mensajes_whatsapp(programado_para);

-- Índices para ubicaciones
CREATE INDEX IF NOT EXISTS idx_provincias_departamento ON provincias(departamento_id);
CREATE INDEX IF NOT EXISTS idx_distritos_provincia ON distritos(provincia_id);
CREATE INDEX IF NOT EXISTS idx_distritos_departamento ON distritos(departamento_id);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Eliminar triggers existentes y crear nuevos (seguro para re-ejecutar)
DROP TRIGGER IF EXISTS update_empresas_updated_at ON empresas;
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_creditos_updated_at ON creditos;
CREATE TRIGGER update_creditos_updated_at BEFORE UPDATE ON creditos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_garantias_updated_at ON garantias;
CREATE TRIGGER update_garantias_updated_at BEFORE UPDATE ON garantias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mensajes_whatsapp_updated_at ON mensajes_whatsapp;
CREATE TRIGGER update_mensajes_whatsapp_updated_at BEFORE UPDATE ON mensajes_whatsapp FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Contar todas las tablas creadas
SELECT 
    COUNT(*) as "Total Tablas Creadas"
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Listar todas las tablas con conteo de columnas
SELECT 
    table_name as "Tabla",
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as "Columnas"
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- ✅ 23+ tablas creadas con todas las relaciones
-- ✅ Índices para performance optimizada
-- ✅ Triggers para campos updated_at
-- ✅ Estructura completa para sistema JUNTAY
-- 🎯 Listo para insertar datos con scripts 001, 002, 003, etc.
