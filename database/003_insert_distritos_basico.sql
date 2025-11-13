-- =====================================================
-- INSERTAR DISTRITOS BÁSICOS - LIMA Y CALLAO
-- =====================================================
-- Script básico con los distritos más importantes
-- Solo Lima Metropolitana + Callao (50 distritos)

-- LIMA METROPOLITANA (43 distritos)
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150101', 'LIMA', 'Distrito de Lima', '150101', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150102', 'ANCON', 'Distrito de Ancón', '150102', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150103', 'ATE', 'Distrito de Ate', '150103', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150104', 'BARRANCO', 'Distrito de Barranco', '150104', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150105', 'BREÑA', 'Distrito de Breña', '150105', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150106', 'CARABAYLLO', 'Distrito de Carabayllo', '150106', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150107', 'CHACLACAYO', 'Distrito de Chaclacayo', '150107', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150108', 'CHORRILLOS', 'Distrito de Chorrillos', '150108', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150109', 'CIENEGUILLA', 'Distrito de Cieneguilla', '150109', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150110', 'COMAS', 'Distrito de Comas', '150110', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150111', 'EL AGUSTINO', 'Distrito de El Agustino', '150111', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150112', 'INDEPENDENCIA', 'Distrito de Independencia', '150112', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150113', 'JESUS MARIA', 'Distrito de Jesús María', '150113', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150114', 'LA MOLINA', 'Distrito de La Molina', '150114', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150115', 'LA VICTORIA', 'Distrito de La Victoria', '150115', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150116', 'LINCE', 'Distrito de Lince', '150116', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150117', 'LOS OLIVOS', 'Distrito de Los Olivos', '150117', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150118', 'LURIGANCHO', 'Distrito de Lurigancho', '150118', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150119', 'LURIN', 'Distrito de Lurín', '150119', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150120', 'MAGDALENA DEL MAR', 'Distrito de Magdalena del Mar', '150120', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150121', 'PUEBLO LIBRE', 'Distrito de Pueblo Libre', '150121', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150122', 'MIRAFLORES', 'Distrito de Miraflores', '150122', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150123', 'PACHACAMAC', 'Distrito de Pachacámac', '150123', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150124', 'PUCUSANA', 'Distrito de Pucusana', '150124', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150125', 'PUENTE PIEDRA', 'Distrito de Puente Piedra', '150125', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150126', 'PUNTA HERMOSA', 'Distrito de Punta Hermosa', '150126', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150127', 'PUNTA NEGRA', 'Distrito de Punta Negra', '150127', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150128', 'RIMAC', 'Distrito del Rímac', '150128', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150129', 'SAN BARTOLO', 'Distrito de San Bartolo', '150129', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150130', 'SAN BORJA', 'Distrito de San Borja', '150130', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150131', 'SAN ISIDRO', 'Distrito de San Isidro', '150131', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150132', 'SAN JUAN DE LURIGANCHO', 'Distrito de San Juan de Lurigancho', '150132', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150133', 'SAN JUAN DE MIRAFLORES', 'Distrito de San Juan de Miraflores', '150133', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150134', 'SAN LUIS', 'Distrito de San Luis', '150134', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150135', 'SAN MARTIN DE PORRES', 'Distrito de San Martín de Porres', '150135', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150136', 'SAN MIGUEL', 'Distrito de San Miguel', '150136', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150137', 'SANTA ANITA', 'Distrito de Santa Anita', '150137', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150138', 'SANTA MARIA DEL MAR', 'Distrito de Santa María del Mar', '150138', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150139', 'SANTA ROSA', 'Distrito de Santa Rosa', '150139', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150140', 'SANTIAGO DE SURCO', 'Distrito de Santiago de Surco', '150140', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150141', 'SURQUILLO', 'Distrito de Surquillo', '150141', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150142', 'VILLA EL SALVADOR', 'Distrito de Villa El Salvador', '150142', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '150143', 'VILLA MARIA DEL TRIUNFO', 'Distrito de Villa María del Triunfo', '150143', true
FROM provincias p WHERE p.nombre = 'LIMA' AND p.departamento_id = 15;

-- CALLAO (7 distritos)
INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '070101', 'CALLAO', 'Distrito del Callao', '070101', true
FROM provincias p WHERE p.nombre = 'CALLAO' AND p.departamento_id = 7;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '070102', 'BELLAVISTA', 'Distrito de Bellavista', '070102', true
FROM provincias p WHERE p.nombre = 'CALLAO' AND p.departamento_id = 7;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '070103', 'CARMEN DE LA LEGUA REYNOSO', 'Distrito de Carmen de la Legua Reynoso', '070103', true
FROM provincias p WHERE p.nombre = 'CALLAO' AND p.departamento_id = 7;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '070104', 'LA PERLA', 'Distrito de La Perla', '070104', true
FROM provincias p WHERE p.nombre = 'CALLAO' AND p.departamento_id = 7;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '070105', 'LA PUNTA', 'Distrito de La Punta', '070105', true
FROM provincias p WHERE p.nombre = 'CALLAO' AND p.departamento_id = 7;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '070106', 'VENTANILLA', 'Distrito de Ventanilla', '070106', true
FROM provincias p WHERE p.nombre = 'CALLAO' AND p.departamento_id = 7;

INSERT INTO distritos (provincia_id, departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) 
SELECT p.id, p.departamento_id, '070107', 'MI PERU', 'Distrito de Mi Perú', '070107', true
FROM provincias p WHERE p.nombre = 'CALLAO' AND p.departamento_id = 7;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT COUNT(*) as "Distritos insertados" FROM distritos;

SELECT 
    d.nombre as departamento,
    p.nombre as provincia,
    COUNT(dt.id) as total_distritos
FROM departamentos d
LEFT JOIN provincias p ON d.id = p.departamento_id
LEFT JOIN distritos dt ON p.id = dt.provincia_id
WHERE d.nombre IN ('LIMA', 'CALLAO')
GROUP BY d.id, d.nombre, p.id, p.nombre
ORDER BY d.nombre, p.nombre;
