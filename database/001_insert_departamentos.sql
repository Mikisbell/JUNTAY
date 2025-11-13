-- =====================================================
-- INSERTAR DEPARTAMENTOS DEL PERÚ - SUPABASE
-- =====================================================
-- Script para insertar los 25 departamentos oficiales del Perú
-- Fuente: Datos oficiales adaptados para JUNTAY
-- Fecha: Nov 12, 2025

-- Insertar departamentos (24 departamentos + 1 Provincia Constitucional del Callao)
INSERT INTO departamentos (codigo, nombre, nombre_completo, ubigeo_inei, activo) VALUES
('01', 'AMAZONAS', 'Departamento de Amazonas', '01', true),
('02', 'ANCASH', 'Departamento de Áncash', '02', true),
('03', 'APURIMAC', 'Departamento de Apurímac', '03', true),
('04', 'AREQUIPA', 'Departamento de Arequipa', '04', true),
('05', 'AYACUCHO', 'Departamento de Ayacucho', '05', true),
('06', 'CAJAMARCA', 'Departamento de Cajamarca', '06', true),
('07', 'CALLAO', 'Provincia Constitucional del Callao', '07', true),
('08', 'CUSCO', 'Departamento del Cusco', '08', true),
('09', 'HUANCAVELICA', 'Departamento de Huancavelica', '09', true),
('10', 'HUANUCO', 'Departamento de Huánuco', '10', true),
('11', 'ICA', 'Departamento de Ica', '11', true),
('12', 'JUNIN', 'Departamento de Junín', '12', true),
('13', 'LA LIBERTAD', 'Departamento de La Libertad', '13', true),
('14', 'LAMBAYEQUE', 'Departamento de Lambayeque', '14', true),
('15', 'LIMA', 'Departamento de Lima', '15', true),
('16', 'LORETO', 'Departamento de Loreto', '16', true),
('17', 'MADRE DE DIOS', 'Departamento de Madre de Dios', '17', true),
('18', 'MOQUEGUA', 'Departamento de Moquegua', '18', true),
('19', 'PASCO', 'Departamento de Pasco', '19', true),
('20', 'PIURA', 'Departamento de Piura', '20', true),
('21', 'PUNO', 'Departamento de Puno', '21', true),
('22', 'SAN MARTIN', 'Departamento de San Martín', '22', true),
('23', 'TACNA', 'Departamento de Tacna', '23', true),
('24', 'TUMBES', 'Departamento de Tumbes', '24', true),
('25', 'UCAYALI', 'Departamento de Ucayali', '25', true);

-- =====================================================
-- VERIFICACIÓN DE INSERCIÓN
-- =====================================================
-- Verificar que todos los departamentos fueron insertados correctamente
SELECT 
    COUNT(*) as total_departamentos,
    COUNT(CASE WHEN activo = true THEN 1 END) as departamentos_activos
FROM departamentos;

-- Mostrar todos los departamentos insertados
SELECT 
    id,
    codigo,
    nombre,
    nombre_completo,
    ubigeo_inei,
    activo,
    created_at
FROM departamentos 
ORDER BY codigo;

-- =====================================================
-- RESUMEN DE INSERCIÓN
-- =====================================================
-- Total departamentos insertados: 25
-- Departamentos regulares: 24
-- Provincias constitucionales: 1 (Callao)
-- Estado: COMPLETADO
-- Fecha: Nov 12, 2025

-- NOTAS IMPORTANTES:
-- 1. Callao es una Provincia Constitucional, no un departamento
-- 2. Todos los códigos siguen el estándar INEI oficial
-- 3. Los nombres están en mayúsculas según convención oficial
-- 4. Campo 'activo' permite deshabilitar temporalmente sin eliminar
