# 🔐 Configurar Token de GitHub para Git

## Opción A: Guardar Token en Git Credential Helper

```bash
# Configurar Git para guardar credenciales
git config --global credential.helper store

# Ahora cuando hagas push, ingresa:
# Username: mikisbell
# Password: [tu token de GitHub]
# Git lo guardará automáticamente
```

## Opción B: Configurar URL con Token

```bash
# Reemplaza TU_TOKEN con el token que creaste
git remote set-url origin https://TU_TOKEN@github.com/Mikisbell/JUNTAY.git

# Ahora puedes hacer push sin pedir credenciales
git push origin main
```

## Opción C: Usar SSH (Alternativa)

```bash
# 1. Generar clave SSH (si no tienes)
ssh-keygen -t ed25519 -C "tu-email@example.com"

# 2. Copiar la clave pública
cat ~/.ssh/id_ed25519.pub

# 3. Agregar la clave en GitHub:
#    https://github.com/settings/keys
#    Click "New SSH key" → Pega la clave

# 4. Cambiar remote a SSH
git remote set-url origin git@github.com:Mikisbell/JUNTAY.git

# 5. Probar conexión
ssh -T git@github.com

# 6. Hacer push
git push origin main
```

---

## 🎯 Recomendación

**Usa la Opción A** (credential helper) - Es la más simple y segura.

---

## 📝 Pasos Rápidos:

1. Crea el token en GitHub (ver instrucciones arriba)
2. Ejecuta: `git config --global credential.helper store`
3. Ejecuta: `git push origin main`
4. Cuando pida password, pega el TOKEN (no tu contraseña)
5. ✅ Listo, Git guardará el token

