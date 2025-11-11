# 📦 Guía de Despliegue - JUNTAY

## 🔄 Subir Cambios a GitHub

```bash
cd JUNTAY

# Ver estado de cambios
git status

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "feat: Sistema inicial de casa de empeño con Next.js y Supabase"

# Subir a GitHub
git push origin main
```

## 🚀 Desplegar en Vercel

### Método 1: Desde la Interfaz de Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en "Add New Project"
3. Importa el repositorio `Mikisbell/JUNTAY` desde GitHub
4. Configura las variables de entorno:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```
5. Click en "Deploy"
6. Espera a que termine el build (3-5 minutos)

### Método 2: Desde CLI de Vercel

```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Login en Vercel
vercel login

# Desplegar (primera vez)
vercel

# Despliegues subsiguientes
vercel --prod
```

## 🗄️ Configurar Base de Datos en Supabase

### 1. Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Click en "New Project"
3. Llena los datos:
   - **Name**: JUNTAY
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Closer to your users
4. Click en "Create new project"

### 2. Ejecutar Script de Base de Datos
1. En Supabase, ve a **SQL Editor** (ícono de código)
2. Click en "New Query"
3. Abre el archivo `database-schema.sql` de tu proyecto
4. Copia TODO el contenido
5. Pégalo en el editor de Supabase
6. Click en "Run" (o Ctrl + Enter)
7. Espera la confirmación de éxito

### 3. Configurar Storage
1. Ve a **Storage** en el menú lateral
2. Click en "Create a new bucket"
3. Nombre: `garantias`
4. **Public bucket**: Activado ✅
5. Click en "Create bucket"

### 4. Políticas de Seguridad para Storage
En SQL Editor, ejecuta:

```sql
-- Permitir subida de archivos a usuarios autenticados
CREATE POLICY "Los usuarios pueden subir fotos de garantías"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garantias');

-- Permitir lectura pública de fotos
CREATE POLICY "Lectura pública de garantías"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'garantias');

-- Permitir actualización de archivos propios
CREATE POLICY "Los usuarios pueden actualizar sus archivos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'garantias');

-- Permitir eliminación de archivos propios
CREATE POLICY "Los usuarios pueden eliminar sus archivos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'garantias');
```

### 5. Obtener Credenciales
1. Ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys** → `anon public`

## 🔐 Configurar Variables de Entorno

### En Desarrollo Local
Crea `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_muy_largo
```

### En Vercel
1. Ve a tu proyecto en Vercel
2. Click en "Settings"
3. Click en "Environment Variables"
4. Agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Selecciona: Production, Preview, Development
6. Click en "Save"
7. Redeploy el proyecto

## 👤 Crear Usuario Administrador

En Supabase SQL Editor:

```sql
-- 1. Primero instalar la extensión pgcrypto si no está
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Insertar empresa de ejemplo
INSERT INTO empresas (ruc, razon_social, nombre_comercial, email, telefono, direccion)
VALUES (
  '20123456789', 
  'Mi Casa de Empeño SAC', 
  'JUNTAY', 
  'admin@juntay.com',
  '987654321',
  'Av. Principal 123, Lima'
);

-- 3. Insertar usuario administrador
INSERT INTO usuarios (
    empresa_id, 
    email, 
    password_hash, 
    nombres, 
    apellidos, 
    dni, 
    telefono,
    rol, 
    activo
)
SELECT 
    e.id,
    'admin@juntay.com',
    crypt('admin123', gen_salt('bf')),
    'Administrador',
    'Sistema',
    '12345678',
    '987654321',
    'admin',
    true
FROM empresas e
WHERE e.ruc = '20123456789';
```

**Credenciales iniciales:**
- Email: `admin@juntay.com`
- Contraseña: `admin123`

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer login.

## 🌐 Configurar Dominio Personalizado

### En Vercel:
1. Ve a tu proyecto
2. Click en "Settings" → "Domains"
3. Click en "Add"
4. Ingresa tu dominio: `tudominio.com`
5. Sigue las instrucciones para configurar DNS

### Configuración DNS (en tu proveedor de dominio):
```
Type: CNAME
Name: www (o @)
Value: cname.vercel-dns.com
```

## ✅ Verificar Instalación

1. **Frontend**: Visita tu URL de Vercel o dominio
2. **Base de Datos**: 
   ```sql
   -- En Supabase SQL Editor
   SELECT COUNT(*) FROM clientes;
   SELECT COUNT(*) FROM creditos;
   ```
3. **Storage**: Sube una foto de prueba en la interfaz

## 🔄 Flujo de Trabajo Continuo

```bash
# 1. Hacer cambios en el código
# 2. Probar localmente
npm run dev

# 3. Commit y push
git add .
git commit -m "descripción de cambios"
git push origin main

# 4. Vercel desplegará automáticamente
```

## 🆘 Solución de Problemas

### Error: "Unable to connect to database"
- Verifica las credenciales en `.env.local` o Vercel
- Asegúrate de que el proyecto de Supabase esté activo

### Error: "Storage bucket not found"
- Crea el bucket `garantias` en Supabase Storage
- Verifica las políticas de seguridad

### Error: "Build failed"
- Revisa los logs en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que las variables de entorno estén configuradas

### El sitio carga lento
- Vercel tiene Edge Functions gratuitas
- Supabase está en la región más cercana
- Considera usar CDN para imágenes

## 📈 Próximos Pasos

1. ✅ Probar el login con usuario admin
2. ✅ Configurar tipos de crédito
3. ✅ Registrar primer cliente
4. ✅ Crear primer crédito
5. ✅ Registrar garantía con fotos
6. ✅ Hacer primer pago

## 📞 Soporte

Para más información, revisa:
- `README.md` - Documentación general
- `QUICKSTART.md` - Guía de inicio rápido
- `database-schema.sql` - Esquema de base de datos
