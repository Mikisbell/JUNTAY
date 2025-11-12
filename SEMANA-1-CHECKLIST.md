# ✅ Checklist Semana 1 - Correcciones Críticas

## 📋 Estado de Cambios

### ✅ Completado

- [x] **lib/utils/auth.ts** - Helper para usuario y empresa creado
- [x] **middleware.ts** - Matcher habilitado para proteger rutas
- [x] **Formulario de Clientes** - Actualizado para usar helpers
- [x] **Formulario de Créditos** - Actualizado para usar helpers
- [x] **Formulario de Garantías** - Actualizado para usar helpers
- [x] **Scripts SQL** - Creados para verificación y configuración

---

## 🔧 Pasos para Completar la Configuración

### 1. Verificar Tablas en Supabase

1. Ve a tu proyecto en Supabase
2. Abre **SQL Editor**
3. Copia y pega el contenido de `scripts/verificar-tablas.sql`
4. Ejecuta el script (Run o Ctrl+Enter)
5. Verifica que todas las tablas existan
6. Si faltan tablas, ejecuta `database-schema.sql` completo

### 2. Crear Empresa por Defecto

1. En Supabase SQL Editor
2. Copia y pega el contenido de `scripts/crear-empresa-default.sql`
3. Ejecuta el script
4. Verifica que se haya creado:
```sql
SELECT * FROM empresas WHERE ruc = '20123456789';
```

### 3. Configurar Storage

1. Ve a **Storage** en Supabase
2. Click en **"Create a new bucket"**
3. Nombre: `garantias`
4. **Public bucket**: ✅ Activado
5. Click en **"Create bucket"**
6. Ve a **SQL Editor**
7. Copia y pega el contenido de `scripts/configurar-storage.sql`
8. Ejecuta el script

### 4. Verificar Middleware

1. Abre `middleware.ts`
2. Verifica que el matcher esté configurado:
```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ],
}
```

### 5. Probar Funcionalidad

- [ ] **Login**: Probar que funcione correctamente
- [ ] **Protección de Rutas**: Intentar acceder a `/dashboard` sin login (debe redirigir a `/login`)
- [ ] **Crear Cliente**: Verificar que `empresa_id` y `created_by` se guarden correctamente
- [ ] **Crear Crédito**: Verificar que `empresa_id` y `desembolsado_por` se guarden correctamente
- [ ] **Crear Garantía**: Verificar que `tasado_por` se guarde correctamente
- [ ] **Subir Foto**: Probar subir una foto de garantía en Storage

---

## 🐛 Solución de Problemas

### Error: "empresa_id cannot be null"
- **Causa**: No existe empresa en la base de datos
- **Solución**: Ejecutar `scripts/crear-empresa-default.sql`

### Error: "relation 'empresas' does not exist"
- **Causa**: Tabla empresas no existe
- **Solución**: Ejecutar `database-schema.sql` completo

### Error: "Storage bucket not found"
- **Causa**: Bucket `garantias` no existe
- **Solución**: Crear bucket en Supabase Storage y ejecutar `scripts/configurar-storage.sql`

### Error: "Unauthorized" al subir fotos
- **Causa**: Políticas de Storage no configuradas
- **Solución**: Ejecutar `scripts/configurar-storage.sql`

### Middleware no funciona
- **Causa**: Matcher vacío o incorrecto
- **Solución**: Verificar que `middleware.ts` tenga el matcher correcto

---

## 📝 Notas Importantes

1. **Empresa por Defecto**: El sistema usa la primera empresa activa. Asegúrate de tener al menos una empresa creada.

2. **Usuario Actual**: Los helpers obtienen el usuario desde Supabase Auth. Asegúrate de estar autenticado.

3. **Campos NULL**: Si algunos campos siguen siendo NULL, verifica:
   - Que exista una empresa activa
   - Que el usuario esté autenticado
   - Que los campos no tengan constraint NOT NULL en la BD

4. **Storage**: Las fotos se guardan en el bucket público `garantias`. Asegúrate de configurar las políticas correctamente.

---

## ✅ Verificación Final

Antes de considerar completada la Semana 1, verifica:

- [ ] Todas las tablas existen en Supabase
- [ ] Existe al menos una empresa activa
- [ ] Storage bucket `garantias` está creado y configurado
- [ ] Middleware protege las rutas correctamente
- [ ] Los formularios guardan `empresa_id` y `created_by`/`desembolsado_por`/`tasado_por`
- [ ] Se pueden subir fotos a Storage
- [ ] El sistema funciona sin errores en consola

---

## 🎉 ¡Listo!

Si todos los items están completados, la Semana 1 está finalizada. Puedes continuar con las siguientes fases del proyecto.

