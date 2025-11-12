# 📋 Instrucciones para Configurar Supabase

## 🎯 Pasos a Seguir

### **PASO 1: Verificar Tablas Existentes**

1. Ve a tu proyecto en **Supabase**
2. Abre **SQL Editor** (ícono de código en el menú lateral)
3. Copia y pega el **PASO 1** del archivo `SUPABASE-SETUP-COMPLETO.sql`
4. Ejecuta el script (botón **Run** o `Ctrl + Enter`)
5. Revisa qué tablas existen y cuáles faltan

**Si faltan tablas:**
- Abre el archivo `database-schema.sql` de tu proyecto
- Copia **TODO** el contenido
- Pégalo en SQL Editor de Supabase
- Ejecuta el script completo
- Espera a que termine (puede tardar 1-2 minutos)

---

### **PASO 2: Crear Empresa por Defecto**

1. En **SQL Editor** de Supabase
2. Copia y pega el **PASO 2** del archivo `SUPABASE-SETUP-COMPLETO.sql`
3. Ejecuta el script
4. Deberías ver un mensaje de éxito o "0 rows affected" (si ya existe)

**Verificar:**
```sql
SELECT * FROM empresas WHERE ruc = '20123456789';
```

Deberías ver 1 fila con la empresa creada.

---

### **PASO 3: Hacer Campos Opcionales (Si es Necesario)**

**Solo ejecuta esto si tienes errores de campos NOT NULL al crear registros.**

1. En **SQL Editor**
2. Copia y pega el **PASO 3** del archivo `SUPABASE-SETUP-COMPLETO.sql`
3. Ejecuta el script
4. Esto hará que los campos `empresa_id`, `created_by`, `desembolsado_por`, `tasado_por` sean opcionales

---

### **PASO 4: Configurar Storage para Fotos**

#### 4.1 Crear el Bucket

1. Ve a **Storage** en el menú lateral de Supabase
2. Click en **"Create a new bucket"**
3. **Nombre**: `garantias`
4. **Public bucket**: ✅ **Activado** (muy importante)
5. Click en **"Create bucket"**

#### 4.2 Configurar Políticas

1. Ve a **SQL Editor**
2. Copia y pega el **PASO 4** del archivo `SUPABASE-SETUP-COMPLETO.sql`
3. Ejecuta el script
4. Deberías ver mensajes de éxito para cada política

**Verificar:**
```sql
SELECT * FROM storage.buckets WHERE id = 'garantias';
```

Deberías ver el bucket `garantias` listado.

---

### **PASO 5: Verificación Final**

1. En **SQL Editor**
2. Copia y pega el **PASO 5** del archivo `SUPABASE-SETUP-COMPLETO.sql`
3. Ejecuta el script
4. Revisa los resultados:
   - Debe haber 1 empresa activa
   - Las tablas principales deben existir (pueden tener 0 registros)
   - Las políticas de Storage deben estar creadas

---

## ✅ Checklist de Verificación

Antes de continuar, verifica:

- [ ] Todas las tablas existen (20 tablas)
- [ ] Existe al menos 1 empresa activa
- [ ] El bucket `garantias` está creado y es público
- [ ] Las políticas de Storage están configuradas
- [ ] No hay errores en la consola de Supabase

---

## 🐛 Solución de Problemas

### Error: "relation 'empresas' does not exist"
**Solución**: Ejecuta el archivo `database-schema.sql` completo

### Error: "empresa_id cannot be null"
**Solución**: Ejecuta el PASO 3 para hacer los campos opcionales, o asegúrate de que existe una empresa activa

### Error: "Storage bucket not found"
**Solución**: Crea el bucket `garantias` en Storage antes de ejecutar las políticas

### Error: "policy already exists"
**Solución**: El script elimina las políticas existentes primero, pero si persiste, elimínalas manualmente:
```sql
DROP POLICY IF EXISTS "nombre_de_la_politica" ON storage.objects;
```

---

## 📝 Notas Importantes

1. **Orden de Ejecución**: Ejecuta los pasos en orden (1, 2, 3, 4, 5)
2. **Empresa por Defecto**: El sistema necesita al menos una empresa activa para funcionar
3. **Storage Público**: El bucket `garantias` debe ser público para que las fotos sean accesibles
4. **Campos Opcionales**: Si prefieres que los campos sean obligatorios, no ejecutes el PASO 3, pero asegúrate de que siempre haya una empresa y un usuario autenticado

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu base de datos estará lista para usar con el sistema JUNTAY.

