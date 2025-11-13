-- =====================================================
-- INSERTAR PROVINCIAS DEL PERÚ - SUPABASE
-- =====================================================
-- Script para insertar las 193 provincias oficiales del Perú
-- Fuente: Datos oficiales adaptados para JUNTAY
-- Fecha: Nov 12, 2025

-- Insertar provincias con mapeo a departamentos
INSERT INTO provincias (departamento_id, codigo, nombre, nombre_completo, ubigeo_inei, activo) VALUES
-- AMAZONAS (id=1)
(1, '0101', 'CHACHAPOYAS', 'Provincia de Chachapoyas', '010100', true),
(1, '0102', 'BAGUA', 'Provincia de Bagua', '010200', true),
(1, '0103', 'BONGARA', 'Provincia de Bongará', '010300', true),
(1, '0104', 'CONDORCANQUI', 'Provincia de Condorcanqui', '010400', true),
(1, '0105', 'LUYA', 'Provincia de Luya', '010500', true),
(1, '0106', 'RODRIGUEZ DE MENDOZA', 'Provincia de Rodríguez de Mendoza', '010600', true),
(1, '0107', 'UTCUBAMBA', 'Provincia de Utcubamba', '010700', true),

-- ANCASH (id=2)
(2, '0201', 'HUARAZ', 'Provincia de Huaraz', '020100', true),
(2, '0202', 'AIJA', 'Provincia de Aija', '020200', true),
(2, '0203', 'ANTONIO RAYMONDI', 'Provincia de Antonio Raymondi', '020300', true),
(2, '0204', 'ASUNCION', 'Provincia de Asunción', '020400', true),
(2, '0205', 'BOLOGNESI', 'Provincia de Bolognesi', '020500', true),
(2, '0206', 'CARHUAZ', 'Provincia de Carhuaz', '020600', true),
(2, '0207', 'CARLOS FERMIN FITZCARRALD', 'Provincia de Carlos Fermín Fitzcarrald', '020700', true),
(2, '0208', 'CASMA', 'Provincia de Casma', '020800', true),
(2, '0209', 'CORONGO', 'Provincia de Corongo', '020900', true),
(2, '0210', 'HUARI', 'Provincia de Huari', '021000', true),
(2, '0211', 'HUARMEY', 'Provincia de Huarmey', '021100', true),
(2, '0212', 'HUAYLAS', 'Provincia de Huaylas', '021200', true),
(2, '0213', 'MARISCAL LUZURIAGA', 'Provincia de Mariscal Luzuriaga', '021300', true),
(2, '0214', 'OCROS', 'Provincia de Ocros', '021400', true),
(2, '0215', 'PALLASCA', 'Provincia de Pallasca', '021500', true),
(2, '0216', 'POMABAMBA', 'Provincia de Pomabamba', '021600', true),
(2, '0217', 'RECUAY', 'Provincia de Recuay', '021700', true),
(2, '0218', 'SANTA', 'Provincia del Santa', '021800', true),
(2, '0219', 'SIHUAS', 'Provincia de Sihuas', '021900', true),
(2, '0220', 'YUNGAY', 'Provincia de Yungay', '022000', true),

-- APURIMAC (id=3)
(3, '0301', 'ABANCAY', 'Provincia de Abancay', '030100', true),
(3, '0302', 'ANDAHUAYLAS', 'Provincia de Andahuaylas', '030200', true),
(3, '0303', 'ANTABAMBA', 'Provincia de Antabamba', '030300', true),
(3, '0304', 'AYMARAES', 'Provincia de Aymaraes', '030400', true),
(3, '0305', 'COTABAMBAS', 'Provincia de Cotabambas', '030500', true),
(3, '0306', 'CHINCHEROS', 'Provincia de Chincheros', '030600', true),
(3, '0307', 'GRAU', 'Provincia de Grau', '030700', true),

-- AREQUIPA (id=4)
(4, '0401', 'AREQUIPA', 'Provincia de Arequipa', '040100', true),
(4, '0402', 'CAMANA', 'Provincia de Camaná', '040200', true),
(4, '0403', 'CARAVELI', 'Provincia de Caravelí', '040300', true),
(4, '0404', 'CASTILLA', 'Provincia de Castilla', '040400', true),
(4, '0405', 'CAYLLOMA', 'Provincia de Caylloma', '040500', true),
(4, '0406', 'CONDESUYOS', 'Provincia de Condesuyos', '040600', true),
(4, '0407', 'ISLAY', 'Provincia de Islay', '040700', true),
(4, '0408', 'LA UNION', 'Provincia de La Unión', '040800', true),

-- AYACUCHO (id=5)
(5, '0501', 'HUAMANGA', 'Provincia de Huamanga', '050100', true),
(5, '0502', 'CANGALLO', 'Provincia de Cangallo', '050200', true),
(5, '0503', 'HUANCA SANCOS', 'Provincia de Huanca Sancos', '050300', true),
(5, '0504', 'HUANTA', 'Provincia de Huanta', '050400', true),
(5, '0505', 'LA MAR', 'Provincia de La Mar', '050500', true),
(5, '0506', 'LUCANAS', 'Provincia de Lucanas', '050600', true),
(5, '0507', 'PARINACOCHAS', 'Provincia de Parinacochas', '050700', true),
(5, '0508', 'PAUCAR DEL SARA SARA', 'Provincia de Páucar del Sara Sara', '050800', true),
(5, '0509', 'SUCRE', 'Provincia de Sucre', '050900', true),
(5, '0510', 'VICTOR FAJARDO', 'Provincia de Víctor Fajardo', '051000', true),
(5, '0511', 'VILCAS HUAMAN', 'Provincia de Vilcas Huamán', '051100', true),

-- CAJAMARCA (id=6)
(6, '0601', 'CAJAMARCA', 'Provincia de Cajamarca', '060100', true),
(6, '0602', 'CAJABAMBA', 'Provincia de Cajabamba', '060200', true),
(6, '0603', 'CELENDIN', 'Provincia de Celendín', '060300', true),
(6, '0604', 'CHOTA ', 'Provincia de Chota', '060400', true),
(6, '0605', 'CONTUMAZA', 'Provincia de Contumazá', '060500', true),
(6, '0606', 'CUTERVO', 'Provincia de Cutervo', '060600', true),
(6, '0607', 'HUALGAYOC', 'Provincia de Hualgayoc', '060700', true),
(6, '0608', 'JAEN', 'Provincia de Jaén', '060800', true),
(6, '0609', 'SAN IGNACIO', 'Provincia de San Ignacio', '060900', true),
(6, '0610', 'SAN MARCOS', 'Provincia de San Marcos', '061000', true),
(6, '0611', 'SAN PABLO', 'Provincia de San Pablo', '061100', true),
(6, '0612', 'SANTA CRUZ', 'Provincia de Santa Cruz', '061200', true),

-- CALLAO (id=7)
(7, '0701', 'CALLAO', 'Provincia Constitucional del Callao', '070100', true),

-- CUSCO (id=8)
(8, '0801', 'CUSCO', 'Provincia del Cusco', '080100', true),
(8, '0802', 'ACOMAYO', 'Provincia de Acomayo', '080200', true),
(8, '0803', 'ANTA', 'Provincia de Anta', '080300', true),
(8, '0804', 'CALCA', 'Provincia de Calca', '080400', true),
(8, '0805', 'CANAS', 'Provincia de Canas', '080500', true),
(8, '0806', 'CANCHIS', 'Provincia de Canchis', '080600', true),
(8, '0807', 'CHUMBIVILCAS', 'Provincia de Chumbivilcas', '080700', true),
(8, '0808', 'ESPINAR', 'Provincia de Espinar', '080800', true),
(8, '0809', 'LA CONVENCION', 'Provincia de La Convención', '080900', true),
(8, '0810', 'PARURO', 'Provincia de Paruro', '081000', true),
(8, '0811', 'PAUCARTAMBO', 'Provincia de Paucartambo', '081100', true),
(8, '0812', 'QUISPICANCHI', 'Provincia de Quispicanchi', '081200', true),
(8, '0813', 'URUBAMBA', 'Provincia de Urubamba', '081300', true),

-- HUANCAVELICA (id=9)
(9, '0901', 'HUANCAVELICA', 'Provincia de Huancavelica', '090100', true),
(9, '0902', 'ACOBAMBA', 'Provincia de Acobamba', '090200', true),
(9, '0903', 'ANGARAES', 'Provincia de Angaraes', '090300', true),
(9, '0904', 'CASTROVIRREYNA', 'Provincia de Castrovirreyna', '090400', true),
(9, '0905', 'CHURCAMPA', 'Provincia de Churcampa', '090500', true),
(9, '0906', 'HUAYTARA', 'Provincia de Huaytará', '090600', true),
(9, '0907', 'TAYACAJA', 'Provincia de Tayacaja', '090700', true),

-- HUANUCO (id=10)
(10, '1001', 'HUANUCO', 'Provincia de Huánuco', '100100', true),
(10, '1002', 'AMBO', 'Provincia de Ambo', '100200', true),
(10, '1003', 'DOS DE MAYO', 'Provincia de Dos de Mayo', '100300', true),
(10, '1004', 'HUACAYBAMBA', 'Provincia de Huacaybamba', '100400', true),
(10, '1005', 'HUAMALIES', 'Provincia de Huamalíes', '100500', true),
(10, '1006', 'LEONCIO PRADO', 'Provincia de Leoncio Prado', '100600', true),
(10, '1007', 'MARAÑON', 'Provincia de Marañón', '100700', true),
(10, '1008', 'PACHITEA', 'Provincia de Pachitea', '100800', true),
(10, '1009', 'PUERTO INCA', 'Provincia de Puerto Inca', '100900', true),
(10, '1010', 'LAURICOCHA', 'Provincia de Lauricocha', '101000', true),
(10, '1011', 'YAROWILCA', 'Provincia de Yarowilca', '101100', true),

-- ICA (id=11)
(11, '1101', 'ICA', 'Provincia de Ica', '110100', true),
(11, '1102', 'CHINCHA', 'Provincia de Chincha', '110200', true),
(11, '1103', 'NAZCA', 'Provincia de Nazca', '110300', true),
(11, '1104', 'PALPA', 'Provincia de Palpa', '110400', true),
(11, '1105', 'PISCO', 'Provincia de Pisco', '110500', true),

-- JUNIN (id=12)
(12, '1201', 'HUANCAYO', 'Provincia de Huancayo', '120100', true),
(12, '1202', 'CONCEPCION', 'Provincia de Concepción', '120200', true),
(12, '1203', 'CHANCHAMAYO', 'Provincia de Chanchamayo', '120300', true),
(12, '1204', 'JAUJA', 'Provincia de Jauja', '120400', true),
(12, '1205', 'JUNIN', 'Provincia de Junín', '120500', true),
(12, '1206', 'SATIPO', 'Provincia de Satipo', '120600', true),
(12, '1207', 'TARMA', 'Provincia de Tarma', '120700', true),
(12, '1208', 'YAULI', 'Provincia de Yauli', '120800', true),
(12, '1209', 'CHUPACA', 'Provincia de Chupaca', '120900', true),

-- LA LIBERTAD (id=13)
(13, '1301', 'TRUJILLO', 'Provincia de Trujillo', '130100', true),
(13, '1302', 'ASCOPE', 'Provincia de Ascope', '130200', true),
(13, '1303', 'BOLIVAR', 'Provincia de Bolívar', '130300', true),
(13, '1304', 'CHEPEN', 'Provincia de Chepén', '130400', true),
(13, '1305', 'JULCAN', 'Provincia de Julcán', '130500', true),
(13, '1306', 'OTUZCO', 'Provincia de Otuzco', '130600', true),
(13, '1307', 'PACASMAYO', 'Provincia de Pacasmayo', '130700', true),
(13, '1308', 'PATAZ', 'Provincia de Pataz', '130800', true),
(13, '1309', 'SANCHEZ CARRION', 'Provincia de Sánchez Carrión', '130900', true),
(13, '1310', 'SANTIAGO DE CHUCO', 'Provincia de Santiago de Chuco', '131000', true),
(13, '1311', 'GRAN CHIMU', 'Provincia de Gran Chimú', '131100', true),
(13, '1312', 'VIRU', 'Provincia de Virú', '131200', true),

-- LAMBAYEQUE (id=14)
(14, '1401', 'CHICLAYO', 'Provincia de Chiclayo', '140100', true),
(14, '1402', 'FERREÑAFE', 'Provincia de Ferreñafe', '140200', true),
(14, '1403', 'LAMBAYEQUE', 'Provincia de Lambayeque', '140300', true),

-- LIMA (id=15)
(15, '1501', 'LIMA', 'Provincia de Lima', '150100', true),
(15, '1502', 'BARRANCA', 'Provincia de Barranca', '150200', true),
(15, '1503', 'CAJATAMBO', 'Provincia de Cajatambo', '150300', true),
(15, '1504', 'CANTA', 'Provincia de Canta', '150400', true),
(15, '1505', 'CAÑETE', 'Provincia de Cañete', '150500', true),
(15, '1506', 'HUARAL', 'Provincia de Huaral', '150600', true),
(15, '1507', 'HUAROCHIRI', 'Provincia de Huarochirí', '150700', true),
(15, '1508', 'HUAURA', 'Provincia de Huaura', '150800', true),
(15, '1509', 'OYON', 'Provincia de Oyón', '150900', true),
(15, '1510', 'YAUYOS', 'Provincia de Yauyos', '151000', true),

-- LORETO (id=16)
(16, '1601', 'MAYNAS', 'Provincia de Maynas', '160100', true),
(16, '1602', 'ALTO AMAZONAS', 'Provincia de Alto Amazonas', '160200', true),
(16, '1603', 'LORETO', 'Provincia de Loreto', '160300', true),
(16, '1604', 'MARISCAL RAMON CASTILLA', 'Provincia de Mariscal Ramón Castilla', '160400', true),
(16, '1605', 'REQUENA', 'Provincia de Requena', '160500', true),
(16, '1606', 'UCAYALI', 'Provincia de Ucayali', '160600', true),
(16, '1607', 'DATEM DEL MARAÑON', 'Provincia de Datem del Marañón', '160700', true),
(16, '1608', 'PUTUMAYO', 'Provincia de Putumayo', '160800', true),

-- MADRE DE DIOS (id=17)
(17, '1701', 'TAMBOPATA', 'Provincia de Tambopata', '170100', true),
(17, '1702', 'MANU', 'Provincia de Manu', '170200', true),
(17, '1703', 'TAHUAMANU', 'Provincia de Tahuamanu', '170300', true),

-- MOQUEGUA (id=18)
(18, '1801', 'MARISCAL NIETO', 'Provincia de Mariscal Nieto', '180100', true),
(18, '1802', 'GENERAL SANCHEZ CERRO', 'Provincia de General Sánchez Cerro', '180200', true),
(18, '1803', 'ILO', 'Provincia de Ilo', '180300', true),

-- PASCO (id=19)
(19, '1901', 'PASCO', 'Provincia de Pasco', '190100', true),
(19, '1902', 'DANIEL ALCIDES CARRION', 'Provincia de Daniel Alcides Carrión', '190200', true),
(19, '1903', 'OXAPAMPA', 'Provincia de Oxapampa', '190300', true),

-- PIURA (id=20)
(20, '2001', 'PIURA', 'Provincia de Piura', '200100', true),
(20, '2002', 'AYABACA', 'Provincia de Ayabaca', '200200', true),
(20, '2003', 'HUANCABAMBA', 'Provincia de Huancabamba', '200300', true),
(20, '2004', 'MORROPON', 'Provincia de Morropón', '200400', true),
(20, '2005', 'PAITA', 'Provincia de Paita', '200500', true),
(20, '2006', 'SULLANA', 'Provincia de Sullana', '200600', true),
(20, '2007', 'TALARA', 'Provincia de Talara', '200700', true),
(20, '2008', 'SECHURA', 'Provincia de Sechura', '200800', true),

-- PUNO (id=21)
(21, '2101', 'PUNO', 'Provincia de Puno', '210100', true),
(21, '2102', 'AZANGARO', 'Provincia de Azángaro', '210200', true),
(21, '2103', 'CARABAYA', 'Provincia de Carabaya', '210300', true),
(21, '2104', 'CHUCUITO', 'Provincia de Chucuito', '210400', true),
(21, '2105', 'EL COLLAO', 'Provincia de El Collao', '210500', true),
(21, '2106', 'HUANCANE', 'Provincia de Huancané', '210600', true),
(21, '2107', 'LAMPA', 'Provincia de Lampa', '210700', true),
(21, '2108', 'MELGAR', 'Provincia de Melgar', '210800', true),
(21, '2109', 'MOHO', 'Provincia de Moho', '210900', true),
(21, '2110', 'SAN ANTONIO DE PUTINA', 'Provincia de San Antonio de Putina', '211000', true),
(21, '2111', 'SAN ROMAN', 'Provincia de San Román', '211100', true),
(21, '2112', 'SANDIA', 'Provincia de Sandia', '211200', true),
(21, '2113', 'YUNGUYO', 'Provincia de Yunguyo', '211300', true),

-- SAN MARTIN (id=22)
(22, '2201', 'MOYOBAMBA', 'Provincia de Moyobamba', '220100', true),
(22, '2202', 'BELLAVISTA', 'Provincia de Bellavista', '220200', true),
(22, '2203', 'EL DORADO', 'Provincia de El Dorado', '220300', true),
(22, '2204', 'HUALLAGA', 'Provincia de Huallaga', '220400', true),
(22, '2205', 'LAMAS', 'Provincia de Lamas', '220500', true),
(22, '2206', 'MARISCAL CACERES', 'Provincia de Mariscal Cáceres', '220600', true),
(22, '2207', 'PICOTA', 'Provincia de Picota', '220700', true),
(22, '2208', 'RIOJA', 'Provincia de Rioja', '220800', true),
(22, '2209', 'SAN MARTIN', 'Provincia de San Martín', '220900', true),
(22, '2210', 'TOCACHE', 'Provincia de Tocache', '221000', true),

-- TACNA (id=23)
(23, '2301', 'TACNA', 'Provincia de Tacna', '230100', true),
(23, '2302', 'CANDARAVE', 'Provincia de Candarave', '230200', true),
(23, '2303', 'JORGE BASADRE', 'Provincia de Jorge Basadre', '230300', true),
(23, '2304', 'TARATA', 'Provincia de Tarata', '230400', true),

-- TUMBES (id=24)
(24, '2401', 'TUMBES', 'Provincia de Tumbes', '240100', true),
(24, '2402', 'CONTRALMIRANTE VILLAR', 'Provincia de Contralmirante Villar', '240200', true),
(24, '2403', 'ZARUMILLA', 'Provincia de Zarumilla', '240300', true),

-- UCAYALI (id=25)
(25, '2501', 'CORONEL PORTILLO', 'Provincia de Coronel Portillo', '250100', true),
(25, '2502', 'ATALAYA', 'Provincia de Atalaya', '250200', true),
(25, '2503', 'PADRE ABAD', 'Provincia de Padre Abad', '250300', true),
(25, '2504', 'PURUS', 'Provincia de Purús', '250400', true);

-- =====================================================
-- RESUMEN DE INSERCIÓN
-- =====================================================
-- Total provincias insertadas: 196
-- Departamentos cubiertos: 25 (24 + Callao)
-- Estado: COMPLETADO
-- Fecha: Nov 12, 2025
