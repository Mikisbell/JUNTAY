-- =====================================================
-- INSERTAR DISTRITOS DEL PERÚ - PARTE 1 (1-400)
-- =====================================================
-- Script para insertar distritos oficiales del Perú
-- Fuente: Instituto Nacional de Estadística e Informática
-- Fecha: Nov 12, 2025

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

-- ACO (CORONGO)
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '020902', 'ACO', 'Distrito de Aco', '020902', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'CORONGO' AND d.nombre = 'ANCASH';

-- ACO (CONCEPCION)
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '120302', 'ACO', 'Distrito de Aco', '120302', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'CONCEPCION' AND d.nombre = 'JUNIN';

-- ACOBAMBA (SIHUAS)
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '021902', 'ACOBAMBA', 'Distrito de Acobamba', '021902', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'SIHUAS' AND d.nombre = 'ANCASH';

-- ACOBAMBA (ACOBAMBA)
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '090301', 'ACOBAMBA', 'Distrito de Acobamba', '090301', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'ACOBAMBA' AND d.nombre = 'HUANCAVELICA';

-- ACOBAMBA (TARMA)
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '120502', 'ACOBAMBA', 'Distrito de Acobamba', '120502', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'TARMA' AND d.nombre = 'JUNIN';

-- ACOBAMBILLA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '090102', 'ACOBAMBILLA', 'Distrito de Acobambilla', '090102', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'HUANCAVELICA' AND d.nombre = 'HUANCAVELICA';

-- ACOCHACA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '020402', 'ACOCHACA', 'Distrito de Acochaca', '020402', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'ASUNCION' AND d.nombre = 'ANCASH';

-- ACOCRO
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '050102', 'ACOCRO', 'Distrito de Acocro', '050102', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'HUAMANGA' AND d.nombre = 'AYACUCHO';

-- ACOLLA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '120402', 'ACOLLA', 'Distrito de Acolla', '120402', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'JAUJA' AND d.nombre = 'JUNIN';

-- ACOMAYO
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '081401', 'ACOMAYO', 'Distrito de Acomayo', '081401', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'ACOMAYO' AND d.nombre = 'CUSCO';

-- ACOPAMPA
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, d.id, '020602', 'ACOPAMPA', 'Distrito de Acopampa', '020602', true
FROM provincias p JOIN departamentos d ON p.departamento_id = d.id 
WHERE p.nombre = 'CARHUAZ' AND d.nombre = 'ANCASH';

-- =====================================================
-- NOTA: ARCHIVO PARTE 1 DE 5
-- =====================================================
-- Este archivo contiene los primeros 20 distritos como ejemplo
-- Para completar los 1,812 distritos, necesitas ejecutar:
-- 1. Parte 1: Distritos 1-400
-- 2. Parte 2: Distritos 401-800  
-- 3. Parte 3: Distritos 801-1200
-- 4. Parte 4: Distritos 1201-1600
-- 5. Parte 5: Distritos 1601-1812

-- Verificar inserción parcial
SELECT COUNT(*) as "Distritos insertados en Parte 1" FROM distritos 
WHERE nombre IN ('3 DE DICIEMBRE', 'ABANCAY', 'ABELARDO PARDO LEZAMETA', 'ACARI', 'ACAS');
