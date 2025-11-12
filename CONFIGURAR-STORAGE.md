# 📦 CONFIGURAR SUPABASE STORAGE PARA FOTOS

## ⚠️ IMPORTANTE: Debes configurar esto antes de usar fotos

### 1. Crear Bucket en Supabase

1. Ve a: https://supabase.com/dashboard/project/bvrzwdztdccxaenfwwcy/storage/buckets
2. Click en "Create bucket"
3. Nombre: `garantias`
4. Public bucket: ✅ **SÍ (marcar como público)**
5. Click en "Create"

### 2. Configurar Políticas de Seguridad

Después de crear el bucket, ve a "Policies" y agrega estas políticas:

#### Política 1: Permitir subida (INSERT)
```sql
CREATE POLICY "Permitir subida de fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garantias');
```

#### Política 2: Permitir lectura (SELECT)
```sql
CREATE POLICY "Permitir lectura pública de fotos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'garantias');
```

#### Política 3: Permitir eliminación (DELETE)
```sql
CREATE POLICY "Permitir eliminar fotos propias"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'garantias');
```

### 3. Verificar Configuración

Ejecuta esto en SQL Editor:

```sql
-- Ver buckets
SELECT * FROM storage.buckets WHERE name = 'garantias';

-- Ver políticas
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

### 4. Probar Upload

Una vez configurado:
1. Ve a /dashboard/garantias/nueva
2. Crea una garantía
3. Sube fotos de prueba
4. Verifica que aparezcan en la galería

## 🎯 Estructura de Archivos

```
garantias/
├── [garantia_id]/
│   ├── 1699999999-0.jpg
│   ├── 1699999999-1.jpg
│   └── ...
```

## 📊 Límites Recomendados

- Tamaño máximo por archivo: 5 MB
- Formatos permitidos: JPG, PNG, WebP
- Máximo de fotos por garantía: Ilimitado (pero recomendado 5-10)

## ⚠️ Troubleshooting

### Error: "new row violates row-level security policy"
- Solución: Verificar que las políticas de seguridad estén creadas

### Error: "Bucket not found"
- Solución: Crear el bucket 'garantias' en Storage

### Error: "Permission denied"
- Solución: Verificar que el bucket sea público o que el usuario esté autenticado
