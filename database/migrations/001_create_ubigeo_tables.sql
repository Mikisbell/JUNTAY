-- ============================================================
-- SISTEMA COMPLETO DE UBIGEOS PARA PERÚ - SUPABASE/POSTGRESQL  
-- Migración de datos oficiales INEI
-- Fecha: 2024-11-12
-- Optimizado para performance máxima
-- ============================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: departamentos
-- ============================================================
DROP TABLE IF EXISTS departamentos CASCADE;
CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(2) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(150),
    ubigeo_inei VARCHAR(10),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar los 25 departamentos oficiales
INSERT INTO departamentos (id, codigo, nombre, nombre_completo) VALUES 
(1, '01', 'AMAZONAS', 'Departamento de Amazonas'),
(2, '02', 'ANCASH', 'Departamento de Ancash'),  
(3, '03', 'APURIMAC', 'Departamento de Apurímac'),
(4, '04', 'AREQUIPA', 'Departamento de Arequipa'),
(5, '05', 'AYACUCHO', 'Departamento de Ayacucho'),
(6, '06', 'CAJAMARCA', 'Departamento de Cajamarca'),
(7, '07', 'CALLAO', 'Provincia Constitucional del Callao'),
(8, '08', 'CUSCO', 'Departamento del Cusco'),
(9, '09', 'HUANCAVELICA', 'Departamento de Huancavelica'),
(10, '10', 'HUANUCO', 'Departamento de Huánuco'),
(11, '11', 'ICA', 'Departamento de Ica'),
(12, '12', 'JUNIN', 'Departamento de Junín'),
(13, '13', 'LA LIBERTAD', 'Departamento de La Libertad'),
(14, '14', 'LAMBAYEQUE', 'Departamento de Lambayeque'),
(15, '15', 'LIMA', 'Departamento de Lima'),
(16, '16', 'LORETO', 'Departamento de Loreto'),
(17, '17', 'MADRE DE DIOS', 'Departamento de Madre de Dios'),
(18, '18', 'MOQUEGUA', 'Departamento de Moquegua'),
(19, '19', 'PASCO', 'Departamento de Pasco'),
(20, '20', 'PIURA', 'Departamento de Piura'),
(21, '21', 'PUNO', 'Departamento de Puno'),
(22, '22', 'SAN MARTIN', 'Departamento de San Martín'),
(23, '23', 'TACNA', 'Departamento de Tacna'),
(24, '24', 'TUMBES', 'Departamento de Tumbes'),
(25, '25', 'UCAYALI', 'Departamento de Ucayali');

-- ============================================================
-- TABLA: provincias
-- ============================================================
DROP TABLE IF EXISTS provincias CASCADE;
CREATE TABLE provincias (
    id SERIAL PRIMARY KEY,
    departamento_id INTEGER NOT NULL REFERENCES departamentos(id) ON DELETE CASCADE,
    codigo VARCHAR(4) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(150),
    ubigeo_inei VARCHAR(10),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(departamento_id, codigo)
);

-- ============================================================
-- TABLA: distritos  
-- ============================================================
DROP TABLE IF EXISTS distritos CASCADE;
CREATE TABLE distritos (
    id SERIAL PRIMARY KEY,
    provincia_id INTEGER NOT NULL REFERENCES provincias(id) ON DELETE CASCADE,
    departamento_id INTEGER NOT NULL REFERENCES departamentos(id) ON DELETE CASCADE,
    codigo VARCHAR(6) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(150),
    ubigeo_inei VARCHAR(10),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provincia_id, codigo)
);

-- ============================================================
-- ÍNDICES OPTIMIZADOS PARA PERFORMANCE MÁXIMA
-- ============================================================

-- Departamentos
CREATE INDEX idx_departamentos_codigo ON departamentos(codigo);
CREATE INDEX idx_departamentos_nombre ON departamentos(nombre);
CREATE INDEX idx_departamentos_activo ON departamentos(activo);

-- Provincias  
CREATE INDEX idx_provincias_departamento ON provincias(departamento_id);
CREATE INDEX idx_provincias_codigo ON provincias(codigo);
CREATE INDEX idx_provincias_nombre ON provincias(nombre);
CREATE INDEX idx_provincias_activo ON provincias(activo);
CREATE INDEX idx_provincias_dept_activo ON provincias(departamento_id, activo);

-- Distritos
CREATE INDEX idx_distritos_provincia ON distritos(provincia_id);
CREATE INDEX idx_distritos_departamento ON distritos(departamento_id);
CREATE INDEX idx_distritos_codigo ON distritos(codigo);
CREATE INDEX idx_distritos_nombre ON distritos(nombre);
CREATE INDEX idx_distritos_activo ON distritos(activo);
CREATE INDEX idx_distritos_prov_activo ON distritos(provincia_id, activo);

-- Índices compuestos para queries complejas
CREATE INDEX idx_distritos_dept_prov ON distritos(departamento_id, provincia_id);
CREATE INDEX idx_provincias_distritos ON provincias(departamento_id) INCLUDE (nombre);

-- ============================================================
-- TRIGGERS PARA UPDATED_AT AUTOMÁTICO
-- ============================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabla
CREATE TRIGGER update_departamentos_updated_at 
    BEFORE UPDATE ON departamentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provincias_updated_at 
    BEFORE UPDATE ON provincias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distritos_updated_at 
    BEFORE UPDATE ON distritos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS (ROW LEVEL SECURITY) - OPCIONAL PARA SEGURIDAD
-- ============================================================

-- Habilitar RLS
ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE distritos ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura (todos pueden leer)
CREATE POLICY "Allow public read access on departamentos" ON departamentos FOR SELECT USING (true);
CREATE POLICY "Allow public read access on provincias" ON provincias FOR SELECT USING (true);  
CREATE POLICY "Allow public read access on distritos" ON distritos FOR SELECT USING (true);

-- ============================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================================

COMMENT ON TABLE departamentos IS 'Departamentos oficiales del Perú según INEI';
COMMENT ON TABLE provincias IS 'Provincias del Perú organizadas por departamento';
COMMENT ON TABLE distritos IS 'Distritos del Perú organizados por provincia y departamento';

COMMENT ON COLUMN departamentos.codigo IS 'Código oficial INEI de 2 dígitos';
COMMENT ON COLUMN provincias.codigo IS 'Código oficial INEI de 4 dígitos';
COMMENT ON COLUMN distritos.codigo IS 'Código oficial INEI de 6 dígitos';

-- ============================================================
-- VERIFICACIÓN DE DATOS
-- ============================================================

-- Mostrar estadísticas
SELECT 
    'Departamentos' as tabla, 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE activo = true) as activos
FROM departamentos

UNION ALL

SELECT 
    'Provincias' as tabla,
    COUNT(*) as total, 
    COUNT(*) FILTER (WHERE activo = true) as activos
FROM provincias

UNION ALL

SELECT 
    'Distritos' as tabla,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE activo = true) as activos  
FROM distritos;

-- ============================================================
-- GRANT PERMISSIONS (OPCIONAL - AJUSTAR SEGÚN NECESIDADES)
-- ============================================================

-- Grant permissions to authenticated users
-- GRANT ALL ON departamentos TO authenticated;
-- GRANT ALL ON provincias TO authenticated;
-- GRANT ALL ON distritos TO authenticated;

-- Grant permissions to anon users (solo lectura)
-- GRANT SELECT ON departamentos TO anon;
-- GRANT SELECT ON provincias TO anon;
-- GRANT SELECT ON distritos TO anon;
