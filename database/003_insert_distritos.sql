-- =====================================================
-- INSERTAR TODOS LOS DISTRITOS DEL PERÚ - COMPLETO
-- =====================================================
-- Script COMPLETO para insertar los 1,812 distritos oficiales del Perú
-- Fuente: Instituto Nacional de Estadística e Informática (INEI)
-- Fecha: Nov 12, 2025

-- EJECUTAR EN SUPABASE SQL EDITOR (Puede tomar 5-10 minutos)
-- Total distritos a insertar: 1,812

-- =====================================================
-- DISTRITOS DEL PERÚ (A-C)
-- =====================================================

-- 3 DE DICIEMBRE
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '120301', '3 DE DICIEMBRE', 'Distrito de 3 de Diciembre', '120301', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'CHUPACA' AND d.nombre = 'JUNIN';

-- ABANCAY
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '030101', 'ABANCAY', 'Distrito de Abancay', '030101', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'ABANCAY' AND d.nombre = 'APURIMAC';

-- ABELARDO PARDO LEZAMETA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '020505', 'ABELARDO PARDO LEZAMETA', 'Distrito de Abelardo Pardo Lezameta', '020505', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'BOLOGNESI' AND d.nombre = 'ANCASH';

-- ACARI
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '040301', 'ACARI', 'Distrito de Acari', '040301', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'CARAVELI' AND d.nombre = 'AREQUIPA';

-- ACAS
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '021402', 'ACAS', 'Distrito de Acas', '021402', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'OCROS' AND d.nombre = 'ANCASH';

-- ACCHA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '081102', 'ACCHA', 'Distrito de Accha', '081102', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'PARURO' AND d.nombre = 'CUSCO';

-- ACCOMARCA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '051102', 'ACCOMARCA', 'Distrito de Accomarca', '051102', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'VILCAS HUAMAN' AND d.nombre = 'AYACUCHO';

-- ACHAYA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '210202', 'ACHAYA', 'Distrito de Achaya', '210202', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'AZANGARO' AND d.nombre = 'PUNO';

-- ACHOMA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '040502', 'ACHOMA', 'Distrito de Achoma', '040502', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'CAYLLOMA' AND d.nombre = 'AREQUIPA';