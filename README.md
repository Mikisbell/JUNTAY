# 🏦 JUNTAY - Sistema de Casa de Empeño

Sistema moderno y completo para gestión de casa de empeño con préstamos con garantía.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + React 18
- **UI**: TailwindCSS + shadcn/ui + Lucide Icons
- **Base de Datos**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage (fotos de garantías)
- **Autenticación**: Supabase Auth
- **Deploy**: Vercel
- **Lenguaje**: TypeScript

## 📋 Módulos Principales

### 1. Mantenimiento
- ✅ Gestión de clientes (personas naturales y jurídicas)
- ✅ Gestión de usuarios del sistema
- ✅ Configuración de empresas/sucursales
- ✅ Permisos y roles

### 2. Créditos/Préstamos
- ✅ Solicitudes de crédito
- ✅ Evaluación y aprobación
- ✅ Desembolsos
- ✅ Cronograma de pagos
- ✅ Refinanciaciones y reprogramaciones
- ✅ Gestión de moras

### 3. Garantías
- ✅ Registro de bienes empeñados
- ✅ Categorización y valuación
- ✅ Fotografías múltiples
- ✅ Control de estado (en garantía, recuperado, vendido)
- ✅ Ubicación física en almacén

### 4. Finanzas
- ✅ Gestión de cajas
- ✅ Apertura y cierre de caja
- ✅ Cuentas bancarias
- ✅ Cobranzas y pagos
- ✅ Movimientos (ingresos/egresos)
- ✅ Transferencias

### 5. Reportes
- 📊 Reporte de créditos activos
- 📊 Reporte de cobranzas
- 📊 Reporte de moras
- 📊 Reporte de garantías
- 📊 Reporte de movimientos de caja
- 📊 Cartera de clientes
- 📊 Historial de cliente

## 🗄️ Base de Datos

### Tablas Principales

**Clientes y Contactos:**
- `clientes` - Datos de personas naturales/jurídicas
- `conyuges` - Cónyuges de clientes
- `garantes` - Garantes/avales de créditos

**Créditos:**
- `tipos_credito` - Tipos de crédito configurables
- `solicitudes_credito` - Solicitudes en proceso
- `creditos` - Créditos aprobados y activos
- `cronograma_pagos` - Cuotas programadas

**Garantías:**
- `categorias_garantia` - Categorías de bienes
- `garantias` - Bienes empeñados
- `garantia_fotos` - Fotografías de garantías

**Finanzas:**
- `cajas` - Cajas de la empresa
- `cuentas_bancarias` - Cuentas bancarias
- `pagos` - Registro de pagos
- `desembolsos` - Registro de desembolsos
- `movimientos` - Ingresos y egresos

Ver esquema completo en: `database-schema.sql`

## 🔐 Configuración de Supabase

1. Crear proyecto en Supabase
2. Ejecutar el script `database-schema.sql`
3. Configurar Storage para fotos de garantías
4. Configurar Row Level Security (RLS)
5. Obtener las credenciales

## ⚙️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## 🌐 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 📦 Estructura del Proyecto

```
JUNTAY/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas del dashboard
│   │   ├── clientes/      # Módulo de clientes
│   │   ├── creditos/      # Módulo de créditos
│   │   ├── garantias/     # Módulo de garantías
│   │   ├── finanzas/      # Módulo de finanzas
│   │   └── reportes/      # Módulo de reportes
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── forms/            # Formularios
│   └── layouts/          # Layouts
├── lib/                  # Utilidades
│   ├── supabase/        # Cliente Supabase
│   └── utils/           # Funciones helper
├── types/               # TypeScript types
└── public/              # Archivos estáticos
```

## 🎨 Características UI/UX

- ✅ Diseño moderno y responsivo
- ✅ Dark mode
- ✅ Navegación intuitiva
- ✅ Tablas con búsqueda y filtros
- ✅ Formularios validados
- ✅ Alertas y notificaciones
- ✅ Dashboard con métricas en tiempo real
- ✅ Impresión de contratos y recibos

## 🔄 Flujo de Trabajo

1. **Registro de Cliente**: Captura de datos con DNI/RUC
2. **Solicitud de Crédito**: Cliente solicita préstamo
3. **Evaluación**: Analista evalúa capacidad de pago
4. **Aprobación**: Gerente aprueba o rechaza
5. **Registro de Garantía**: Se registra bien empeñado con fotos
6. **Desembolso**: Se entrega el dinero
7. **Cronograma**: Sistema genera cuotas automáticas
8. **Cobranza**: Registro de pagos
9. **Recuperación**: Cliente recupera su bien al pagar

## 📱 Funcionalidades Futuras

- [ ] App móvil para cobradores
- [ ] Integración con RENIEC (consulta DNI)
- [ ] Integración con SUNAT (consulta RUC)
- [ ] WhatsApp automático para recordatorios
- [ ] Sistema de alertas por vencimientos
- [ ] E-commerce para venta de bienes no recuperados

## 👥 Roles del Sistema

- **Admin**: Acceso completo
- **Gerente**: Aprobación de créditos, reportes
- **Analista**: Evaluación de solicitudes
- **Cajero**: Cobranzas y desembolsos

## 📄 Licencia

Propietario: JUNTAY © 2025
