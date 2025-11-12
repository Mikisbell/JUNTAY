# 🚀 Comandos para Subir Cambios a GitHub

## Ejecuta estos comandos en tu terminal (Ubuntu/WSL):

```bash
# 1. Ir al directorio del proyecto
cd /home/mateo/JUNTAY

# 2. Ver qué archivos cambiaron
git status

# 3. Agregar todos los archivos nuevos y modificados
git add .

# 4. Crear commit con descripción detallada
git commit -m "feat: Semana 1 - Correcciones críticas

- Habilitar middleware de autenticación (matcher configurado)
- Agregar helpers para usuario y empresa (lib/utils/auth.ts)
- Actualizar formularios para guardar campos requeridos:
  * clientes: empresa_id, created_by
  * creditos: empresa_id, desembolsado_por  
  * garantias: tasado_por
- Agregar scripts SQL para configuración de Supabase:
  * verificar-tablas.sql
  * crear-empresa-default.sql
  * configurar-storage.sql
  * completar-politicas-storage.sql
  * SUPABASE-SETUP-COMPLETO.sql
- Agregar documentación:
  * INSTRUCCIONES-SUPABASE.md
  * SEMANA-1-CHECKLIST.md
  * CAMBIOS-SEMANA-1.md"

# 5. Subir a GitHub
git push origin main
```

## ✅ Después de ejecutar:

1. **Vercel desplegará automáticamente** (2-3 minutos)
2. **Verifica el deploy** en: https://vercel.com/dashboard
3. **Prueba la aplicación** en: https://juntay.vercel.app

## 📋 Archivos que se subirán:

### Nuevos:
- `lib/utils/auth.ts`
- `scripts/verificar-tablas.sql`
- `scripts/crear-empresa-default.sql`
- `scripts/configurar-storage.sql`
- `scripts/completar-politicas-storage.sql`
- `scripts/subir-cambios.sh`
- `SUPABASE-SETUP-COMPLETO.sql`
- `INSTRUCCIONES-SUPABASE.md`
- `SEMANA-1-CHECKLIST.md`
- `CAMBIOS-SEMANA-1.md`
- `SUBIR-CAMBIOS.md`

### Modificados:
- `middleware.ts`
- `app/(dashboard)/dashboard/clientes/nuevo/page.tsx`
- `app/(dashboard)/dashboard/creditos/nueva-solicitud/page.tsx`
- `app/(dashboard)/dashboard/garantias/nueva/page.tsx`

---

## 🆘 Si hay problemas:

### Error: "not a git repository"
```bash
git init
git remote add origin https://github.com/Mikisbell/JUNTAY.git
```

### Error: "authentication failed"
- Verifica tus credenciales de GitHub
- O usa: `git push https://tu-token@github.com/Mikisbell/JUNTAY.git main`

### Error: "nothing to commit"
- Los cambios ya están subidos
- O no hay cambios nuevos

