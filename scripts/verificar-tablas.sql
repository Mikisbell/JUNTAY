-- Script para verificar que todas las tablas existan en Supabase
-- Ejecutar en Supabase SQL Editor

-- Listar todas las tablas requeridas y su estado
SELECT 
    table_name as "Tabla",
    CASE 
        WHEN table_name IN (
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ) THEN '✅ Existe'
        ELSE '❌ NO EXISTE'
    END as "Estado"
FROM (
    VALUES 
        ('empresas'),
        ('usuarios'),
        ('clientes'),
        ('conyuges'),
        ('garantes'),
        ('tipos_credito'),
        ('solicitudes_credito'),
        ('creditos'),
        ('cronograma_pagos'),
        ('categorias_garantia'),
        ('garantias'),
        ('garantia_fotos'),
        ('cajas'),
        ('sesiones_caja'),
        ('movimientos_caja'),
        ('arqueos_caja'),
        ('cuentas_bancarias'),
        ('pagos'),
        ('desembolsos'),
        ('movimientos')
) AS tablas_requeridas(table_name)
ORDER BY "Estado", "Tabla";

-- Ver solo las tablas que NO existen
SELECT table_name as "Tablas Faltantes"
FROM (
    VALUES 
        ('empresas'),
        ('usuarios'),
        ('clientes'),
        ('conyuges'),
        ('garantes'),
        ('tipos_credito'),
        ('solicitudes_credito'),
        ('creditos'),
        ('cronograma_pagos'),
        ('categorias_garantia'),
        ('garantias'),
        ('garantia_fotos'),
        ('cajas'),
        ('sesiones_caja'),
        ('movimientos_caja'),
        ('arqueos_caja'),
        ('cuentas_bancarias'),
        ('pagos'),
        ('desembolsos'),
        ('movimientos')
) AS tablas_requeridas(table_name)
WHERE table_name NOT IN (
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
);
