# 🚀 Guía de Inicio Rápido - JUNTAY

## Paso 1: Instalar Dependencias

```bash
cd JUNTAY
npm install
```

## Paso 2: Configurar Supabase

### 2.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Guarda las credenciales

### 2.2 Ejecutar el Script de Base de Datos
1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Crea un nuevo query
3. Copia y pega todo el contenido de `database-schema.sql`
4. Ejecuta el script (Run)

### 2.3 Configurar Storage para Fotos de Garantías
1. Ve a **Storage** en Supabase
2. Crea un bucket llamado `garantias`
3. Configura las políticas de seguridad:

```sql
-- Permitir subida autenticada
CREATE POLICY "Usuarios pueden subir fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garantias');

-- Permitir lectura pública
CREATE POLICY "Lectura pública de fotos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'garantias');
```

## Paso 3: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tus credenciales
nano .env.local
```

Agregar:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## Paso 4: Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Paso 5: Crear Usuario Administrador

En Supabase SQL Editor:

```sql
-- Insertar empresa de ejemplo
INSERT INTO empresas (ruc, razon_social, nombre_comercial, email)
VALUES ('20123456789', 'Mi Casa de Empeño SAC', 'JUNTAY', 'admin@juntay.com');

-- Insertar usuario admin (la contraseña será 'admin123')
INSERT INTO usuarios (
    empresa_id, 
    email, 
    password_hash, 
    nombres, 
    apellidos, 
    dni, 
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
    'admin',
    true
FROM empresas e
WHERE e.ruc = '20123456789';
```

## Paso 6: Deploy en Vercel

### 6.1 Conectar con GitHub
El repositorio ya está conectado a GitHub.

### 6.2 Deploy en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Conecta con tu cuenta de GitHub
3. Importa el repositorio `JUNTAY`
4. Agrega las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click en **Deploy**

### 6.3 Configurar Dominio
1. En Vercel, ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

## 📚 Próximos Pasos

1. ✅ **Probar el login** con el usuario admin creado
2. ✅ **Crear tipos de crédito** en Mantenimiento
3. ✅ **Registrar tu primer cliente**
4. ✅ **Crear una solicitud de crédito**
5. ✅ **Registrar garantías con fotos**

## 🆘 Troubleshooting

### Error: "supabase is not defined"
- Verifica que las variables de entorno estén en `.env.local`
- Reinicia el servidor de desarrollo

### Error al subir fotos
- Verifica que el bucket `garantias` exista
- Revisa las políticas de seguridad en Storage

### Error de autenticación
- Verifica las credenciales del usuario
- Asegúrate de que el usuario esté activo

## 📞 Soporte

Para más ayuda, revisa la documentación completa en `README.md`
