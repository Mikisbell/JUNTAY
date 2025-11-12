-- =====================================================
-- SCRIPT PARA ARREGLAR CONSTRAINTS DE BASE DE DATOS
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. HACER OPCIONALES LOS CAMPOS DE EMPRESA Y USUARIO
-- (Para que el sistema funcione sin necesidad de estos datos)

-- Tabla clientes
ALTER TABLE clientes ALTER COLUMN empresa_id DROP NOT NULL;
ALTER TABLE clientes ALTER COLUMN created_by DROP NOT NULL;

-- Tabla garantias  
ALTER TABLE garantias ALTER COLUMN tasado_por DROP NOT NULL;

-- Tabla creditos
ALTER TABLE creditos ALTER COLUMN empresa_id DROP NOT NULL;
ALTER TABLE creditos ALTER COLUMN solicitud_id DROP NOT NULL;
ALTER TABLE creditos ALTER COLUMN tipo_credito_id DROP NOT NULL;
ALTER TABLE creditos ALTER COLUMN desembolsado_por DROP NOT NULL;

-- Tabla pagos
ALTER TABLE pagos ALTER COLUMN cronograma_id DROP NOT NULL;
ALTER TABLE pagos ALTER COLUMN caja_id DROP NOT NULL;
ALTER TABLE pagos ALTER COLUMN registrado_por DROP NOT NULL;
ALTER TABLE pagos ALTER COLUMN cuenta_bancaria_id DROP NOT NULL;

-- =====================================================
-- 2. VERIFICAR QUE EXISTAN LAS TABLAS NECESARIAS
-- =====================================================

-- Verificar si existe tabla categorias_garantia
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'categorias_garantia'
);

-- Si NO existe, crearla:
CREATE TABLE IF NOT EXISTS categorias_garantia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    porcentaje_prestamo DECIMAL(5,2) DEFAULT 70.00,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar categorías por defecto si la tabla está vacía
INSERT INTO categorias_garantia (nombre, descripcion, porcentaje_prestamo)
SELECT 'Electrónica', 'Celulares, laptops, tablets, consolas', 70.00
WHERE NOT EXISTS (SELECT 1 FROM categorias_garantia LIMIT 1)
UNION ALL
SELECT 'Electrodomésticos', 'Refrigeradoras, lavadoras, microondas', 60.00
WHERE NOT EXISTS (SELECT 1 FROM categorias_garantia LIMIT 1)
UNION ALL
SELECT 'Joyas', 'Oro, plata, diamantes', 80.00
WHERE NOT EXISTS (SELECT 1 FROM categorias_garantia LIMIT 1)
UNION ALL
SELECT 'Vehículos', 'Motos, autos', 50.00
WHERE NOT EXISTS (SELECT 1 FROM categorias_garantia LIMIT 1)
UNION ALL
SELECT 'Herramientas', 'Herramientas eléctricas, manuales', 65.00
WHERE NOT EXISTS (SELECT 1 FROM categorias_garantia LIMIT 1)
UNION ALL
SELECT 'Otros', 'Otros bienes de valor', 50.00
WHERE NOT EXISTS (SELECT 1 FROM categorias_garantia LIMIT 1);

-- =====================================================
-- 3. AGREGAR INDICES PARA MEJORAR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_clientes_numero_documento ON clientes(numero_documento);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON clientes(activo);
CREATE INDEX IF NOT EXISTS idx_creditos_cliente_id ON creditos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_creditos_estado ON creditos(estado);
CREATE INDEX IF NOT EXISTS idx_cronograma_credito_id ON cronograma_pagos(credito_id);
CREATE INDEX IF NOT EXISTS idx_garantias_credito_id ON garantias(credito_id);
CREATE INDEX IF NOT EXISTS idx_garantias_estado ON garantias(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_credito_id ON pagos(credito_id);

-- =====================================================
-- 4. VERIFICAR ESTADO ACTUAL
-- =====================================================

-- Contar registros en cada tabla
SELECT 
    'clientes' as tabla, 
    COUNT(*) as total 
FROM clientes
UNION ALL
SELECT 'creditos', COUNT(*) FROM creditos
UNION ALL
SELECT 'garantias', COUNT(*) FROM garantias
UNION ALL
SELECT 'cronograma_pagos', COUNT(*) FROM cronograma_pagos
UNION ALL
SELECT 'pagos', COUNT(*) FROM pagos
UNION ALL
SELECT 'categorias_garantia', COUNT(*) FROM categorias_garantia;

-- Ver estructura de clientes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'clientes' 
ORDER BY ordinal_position;
