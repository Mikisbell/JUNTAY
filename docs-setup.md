# 📚 SETUP DOCUMENTACIÓN JUNTAY

## 🎯 OPCIÓN RECOMENDADA: NEXTRA

### 1. CREAR PROYECTO NEXTRA
```bash
# Crear nuevo proyecto de documentación
npx create-nextra-app@latest juntay-docs --template=docs

# Navegar al directorio
cd juntay-docs

# Instalar dependencias
npm install
```

### 2. CONFIGURACIÓN INICIAL

**theme.config.tsx:**
```tsx
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>📋 JUNTAY Docs</span>,
  project: {
    link: 'https://github.com/Mikisbell/JUNTAY',
  },
  docsRepositoryBase: 'https://github.com/Mikisbell/JUNTAY-DOCS',
  footer: {
    text: 'JUNTAY - Sistema Integral Casa de Empeño',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – JUNTAY Docs'
    }
  }
}

export default config
```

**next.config.js:**
```js
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra()
```

### 3. ESTRUCTURA SUGERIDA

```
juntay-docs/
├── pages/
│   ├── index.mdx                    # Página principal
│   ├── getting-started/
│   │   ├── installation.mdx         # Instalación
│   │   ├── first-steps.mdx          # Primeros pasos
│   │   └── configuration.mdx        # Configuración
│   ├── modules/
│   │   ├── caja/
│   │   │   ├── overview.mdx         # Control de Caja
│   │   │   ├── opening.mdx          # Apertura
│   │   │   ├── transfers.mdx        # Transferencias
│   │   │   ├── replenishment.mdx    # Reposición
│   │   │   └── closing.mdx          # Cierre
│   │   ├── clients/
│   │   │   ├── registration.mdx     # Registro clientes
│   │   │   ├── reniec.mdx           # RENIEC API
│   │   │   └── history.mdx          # Historial
│   │   ├── credits/
│   │   │   ├── creation.mdx         # Creación créditos
│   │   │   ├── payments.mdx         # Pagos
│   │   │   └── contracts.mdx        # Contratos PDF
│   │   ├── guarantees/
│   │   │   ├── registration.mdx     # Registro garantías
│   │   │   ├── photos.mdx           # Sistema fotos
│   │   │   └── valuation.mdx        # Tasación
│   │   └── communications/
│   │       ├── whatsapp.mdx         # WhatsApp Business
│   │       ├── yape.mdx             # Sistema YAPE
│   │       └── notifications.mdx    # Notificaciones
│   ├── api/
│   │   ├── authentication.mdx       # Autenticación
│   │   ├── endpoints.mdx            # Endpoints API
│   │   └── webhooks.mdx             # Webhooks
│   ├── deployment/
│   │   ├── vercel.mdx               # Deploy Vercel
│   │   ├── supabase.mdx             # Configuración Supabase
│   │   └── environment.mdx          # Variables entorno
│   └── troubleshooting/
│       ├── common-issues.mdx        # Problemas comunes
│       ├── database.mdx             # Base de datos
│       └── performance.mdx          # Performance
├── public/
│   ├── images/                      # Screenshots
│   └── videos/                      # Videos tutoriales
└── components/
    ├── CodeBlock.tsx                # Bloques de código
    ├── Screenshot.tsx               # Capturas pantalla
    └── VideoEmbed.tsx               # Videos embebidos
```

### 4. DEPLOY EN VERCEL

**vercel.json:**
```json
{
  "functions": {
    "pages/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/docs/:path*",
      "destination": "/:path*"
    }
  ]
}
```

**Deploy commands:**
```bash
# Conectar con Vercel
vercel

# Configurar dominio personalizado
vercel domains add docs.juntay.com
```

## 🎨 ALTERNATIVAS DE DOCUMENTACIÓN

### OPCIÓN 2: GITBOOK
- **Pros:** Interface visual, colaborativo
- **Contras:** Limitado en personalización
- **URL:** `juntay.gitbook.io`

### OPCIÓN 3: DOCUSAURUS
- **Pros:** Muy completo, Facebook/Meta
- **Contras:** Más complejo setup
- **Stack:** React + MDX

### OPCIÓN 4: VITEPRESS
- **Pros:** Muy rápido, Vue.js
- **Contras:** Menos ecosistema
- **Stack:** Vue + Vite

## 📋 CONTENIDO SUGERIDO

### 1. PÁGINA PRINCIPAL
- Overview del sistema
- Características principales
- Quick start guide
- Links rápidos

### 2. GUÍAS DE USUARIO
- Manual por módulos
- Screenshots paso a paso
- Videos tutoriales
- Casos de uso reales

### 3. DOCUMENTACIÓN TÉCNICA
- API Reference
- Database schema
- Deployment guides
- Troubleshooting

### 4. RECURSOS ADICIONALES
- Changelog
- Roadmap
- FAQ
- Soporte

## 🚀 RECOMENDACIÓN FINAL

**NEXTRA es la mejor opción porque:**
- ✅ Misma tecnología (Next.js)
- ✅ Deploy automático en Vercel
- ✅ Búsqueda integrada
- ✅ Responsive design
- ✅ SEO optimizado
- ✅ Fácil mantenimiento
