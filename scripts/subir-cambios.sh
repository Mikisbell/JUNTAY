#!/bin/bash
# Script para subir cambios de Semana 1 a GitHub

echo "📋 Verificando estado de Git..."
git status

echo ""
echo "📦 Agregando archivos..."
git add .

echo ""
echo "💾 Creando commit..."
git commit -m "feat: Semana 1 - Correcciones críticas

- Habilitar middleware de autenticación
- Agregar helpers para usuario y empresa (lib/utils/auth.ts)
- Actualizar formularios para guardar campos requeridos
  * clientes: empresa_id, created_by
  * creditos: empresa_id, desembolsado_por
  * garantias: tasado_por
- Agregar scripts SQL para configuración de Supabase
  * verificar-tablas.sql
  * crear-empresa-default.sql
  * configurar-storage.sql
  * completar-politicas-storage.sql
  * SUPABASE-SETUP-COMPLETO.sql
- Agregar documentación
  * INSTRUCCIONES-SUPABASE.md
  * SEMANA-1-CHECKLIST.md
  * CAMBIOS-SEMANA-1.md"

echo ""
echo "🚀 Subiendo a GitHub..."
git push origin main

echo ""
echo "✅ ¡Cambios subidos exitosamente!"
echo "🌐 Vercel desplegará automáticamente en unos minutos"
echo "📊 Revisa el deploy en: https://vercel.com/dashboard"

