-- =====================================================
-- CORREGIR TABLA USUARIOS - APELLIDOS PERÚ
-- Cambiar "apellidos" a "apellido_paterno" y "apellido_materno"
-- =====================================================

-- 1. Verificar estructura actual
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios'
AND column_name IN ('nombres', 'apellidos', 'apellido_paterno', 'apellido_materno')
ORDER BY column_name;

-- 2. Si tiene "apellidos", hacer la migración
DO $$
BEGIN
    -- Verificar si existe la columna "apellidos"
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'apellidos'
    ) THEN
        -- Agregar nuevas columnas
        ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS apellido_paterno VARCHAR(100);
        ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS apellido_materno VARCHAR(100);
        
        -- Migrar datos (separar apellidos en paterno y materno si es posible)
        -- Si apellidos tiene espacio, dividir; si no, poner todo en paterno
        UPDATE usuarios
        SET 
            apellido_paterno = CASE 
                WHEN POSITION(' ' IN apellidos) > 0 
                THEN SPLIT_PART(apellidos, ' ', 1)
                ELSE apellidos
            END,
            apellido_materno = CASE 
                WHEN POSITION(' ' IN apellidos) > 0 
                THEN SUBSTRING(apellidos FROM POSITION(' ' IN apellidos) + 1)
                ELSE NULL
            END
        WHERE apellido_paterno IS NULL;
        
        -- Hacer NOT NULL el apellido_paterno
        ALTER TABLE usuarios ALTER COLUMN apellido_paterno SET NOT NULL;
        
        -- Eliminar columna antigua
        ALTER TABLE usuarios DROP COLUMN apellidos;
        
        RAISE NOTICE 'Migración completada: apellidos -> apellido_paterno + apellido_materno';
    ELSE
        RAISE NOTICE 'La tabla usuarios ya tiene apellido_paterno y apellido_materno';
    END IF;
END $$;

-- 3. Verificar resultado final
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios'
AND column_name IN ('nombres', 'apellido_paterno', 'apellido_materno')
ORDER BY column_name;

-- 4. Ver datos de usuarios
SELECT id, nombres, apellido_paterno, apellido_materno, email, rol
FROM usuarios
LIMIT 5;
