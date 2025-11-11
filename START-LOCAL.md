# 🚀 Guía para Iniciar JUNTAY Localmente

## ✅ Estado Actual
- ✅ Autenticación implementada
- ✅ Módulo de Clientes con Supabase
- ✅ Dependencias instaladas
- ✅ Código subido a GitHub

---

## 📋 PASO 1: Crear Usuario Admin en Supabase

1. Abre tu navegador en:
   ```
   https://supabase.com/dashboard/project/bvrzwdztdccxaenfwwcy/auth/users
   ```

2. Click en **"Add user"** (botón verde arriba a la derecha)

3. Selecciona **"Create new user"**

4. Llena los datos:
   - **Email:** `admin@juntay.com`
   - **Password:** `admin123`
   - ✅ **Auto Confirm User:** ON (activado)

5. Click **"Create user"**

6. Verifica que aparece un check verde ✅ junto al email

---

## 📋 PASO 2: Abrir Terminal de Ubuntu

1. Presiona `Windows + R`
2. Escribe: `ubuntu`
3. Presiona Enter
4. Te abrirá la terminal de Ubuntu

---

## 📋 PASO 3: Navegar al Proyecto

En la terminal de Ubuntu, ejecuta:

```bash
cd /home/mateo/JUNTAY
```

---

## 📋 PASO 4: Iniciar el Servidor

```bash
npm run dev
```

Deberías ver:
```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   - ready in X.Xs
```

✅ **¡Listo!** El servidor está corriendo.

---

## 📋 PASO 5: Probar la Aplicación

### 5.1. Landing Page
1. Abre tu navegador en: http://localhost:3000
2. ✅ Deberías ver la landing page de JUNTAY

### 5.2. Login
1. Click en **"Iniciar Sesión"** o ve a: http://localhost:3000/login
2. **Ingresa:**
   - Email: `admin@juntay.com`
   - Password: `admin123`
3. Click **"Iniciar Sesión"**

### 5.3. Dashboard
1. ✅ Deberías ser redirigido a: http://localhost:3000/dashboard
2. ✅ Verifica:
   - Sidebar con navegación
   - Tu usuario arriba a la derecha
   - Métricas del dashboard

### 5.4. Módulo de Clientes
1. Click en **"Clientes"** en el sidebar
2. ✅ Verás la página con:
   - Estadísticas (Total: 0, Activos: 0, etc.)
   - Buscador
   - Tabla vacía (aún no hay clientes)
   - Botón "Nuevo Cliente"

### 5.5. Crear Primer Cliente
1. Click en **"Nuevo Cliente"**
2. Llena el formulario:
   - Tipo: Persona Natural
   - DNI: 12345678
   - Nombres: Juan
   - Apellido Paterno: Pérez
   - Apellido Materno: López
   - Email: juan.perez@example.com
   - Celular: 987654321
3. Click **"Guardar"**

### 5.6. Logout
1. Scroll abajo en el sidebar
2. Click **"Cerrar Sesión"**
3. ✅ Vuelves a /login

---

## 🔧 Si algo no funciona

### Error: "Couldn't find pages directory"
- Asegúrate de estar en la carpeta correcta:
  ```bash
  pwd
  # Debe mostrar: /home/mateo/JUNTAY
  ```

### Error: "Permission denied"
- Ejecuta:
  ```bash
  chmod +x node_modules/.bin/next
  npm run dev
  ```

### Error: "Invalid login credentials"
- Verifica que creaste el usuario en Supabase
- El email debe estar confirmado ✅
- Intenta con el password exacto: `admin123`

### Error: No aparece el formulario de clientes
- Presiona `Ctrl+Shift+R` para refrescar (hard reload)
- Verifica la consola del navegador (F12)

---

## 📸 Capturas Esperadas

### 1. Terminal Ubuntu
```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   - ready in 3.2s
```

### 2. Login Page
- Logo JUNTAY azul
- Formulario email/password
- Fondo azul claro

### 3. Dashboard
- Sidebar blanco
- 4 métricas con números
- Usuario arriba a la derecha
- Botón "Cerrar Sesión"

### 4. Clientes
- Estadísticas arriba
- Buscador
- Tabla (vacía al inicio)
- Botón "Nuevo Cliente"

---

## ✅ Checklist

- [ ] Usuario admin creado en Supabase
- [ ] Terminal de Ubuntu abierta
- [ ] Proyecto JUNTAY localizado
- [ ] Servidor corriendo en localhost:3000
- [ ] Landing page visible
- [ ] Login funcional
- [ ] Dashboard accesible
- [ ] Módulo de Clientes visible
- [ ] Formulario de nuevo cliente funciona
- [ ] Logout funciona

---

## 🎯 ¿Todo Listo?

Si completaste todos los pasos:
1. ✅ Tu sistema local está funcionando
2. ✅ Puedes crear clientes
3. ✅ La autenticación funciona
4. ✅ Los datos se guardan en Supabase

**¡Felicitaciones! JUNTAY está funcionando localmente.** 🎉

---

## 📝 Notas

- El servidor debe estar corriendo para usar la aplicación
- Para detener el servidor: `Ctrl+C` en la terminal
- Para reiniciar: `npm run dev`
- Los cambios que hagas se reflejan automáticamente (hot reload)

---

## 🆘 Ayuda

Si tienes problemas:
1. Toma captura del error
2. Copia el mensaje completo
3. Compártelo conmigo y te ayudo
