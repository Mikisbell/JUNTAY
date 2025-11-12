# 📋 REQUERIMIENTOS DE SISTEMA UNIFICADOS - JUNTAY

**Proyecto:** Sistema Casa de Empeño - Cliente Único  
**Basado en:** Análisis completo de archivos MD existentes  
**Estado Actual:** Sistema base 6/10 → Objetivo 9.5/10  

---

## 🎯 RESUMEN EJECUTIVO DE REQUERIMIENTOS

### **Estado Actual del Sistema**
- ✅ **Infraestructura:** Next.js 14 + Supabase + TypeScript (COMPLETADO)
- ✅ **Base de Datos:** 20+ tablas implementadas (COMPLETADO)  
- ✅ **Módulo Clientes:** Funcional con correcciones (COMPLETADO)
- ✅ **Autenticación:** Implementada y corregida (COMPLETADO)
- 🚧 **Módulos Principales:** Necesitan implementación completa

### **Gap Analysis: Requerimientos vs Estado Actual**
| Módulo | Estado Actual | Requerido | Prioridad | Impacto |
|--------|---------------|-----------|-----------|---------|
| Control Caja | ❌ Falta | ✅ Crítico | **ALTA** | **Sin esto no operan** |
| Contratos PDF | ❌ Falta | ✅ Crítico | **ALTA** | **Riesgo legal** |
| Fotos Garantías | ❌ Falta | ✅ Crítico | **ALTA** | **Obligatorio ley** |
| Proceso Vencimientos | ❌ Falta | ✅ Crítico | **ALTA** | **Core negocio** |
| WhatsApp Integration | ❌ Falta | ✅ Importante | MEDIA | Reduce morosidad 25-40% |
| IA Valuación | ❌ Falta | ✅ Diferenciador | MEDIA | Ventaja competitiva |
| Roles/Permisos | ⚠️ Básico | ✅ Completo | MEDIA | Seguridad |
| Reportes SUNAT | ❌ Falta | ✅ Legal | BAJA | Cumplimiento |

---

## 🚨 REQUERIMIENTOS CRÍTICOS (SIN ESTOS NO PUEDEN OPERAR)

### **1. CONTROL DE CAJA COMPLETO**

#### **Funcionalidades Requeridas:**
- **Apertura de Caja:**
  - Conteo por denominaciones (billetes y monedas)
  - Registro de monto inicial
  - Foto de evidencia del conteo
  - Asignación de responsable de caja
  - Hora exacta de apertura

- **Gestión de Movimientos:**
  - Registro de ingresos (pagos de clientes, otros)
  - Registro de egresos (desembolsos, gastos operativos)
  - Categorización automática por tipo
  - Justificación obligatoria para egresos grandes
  - Saldo en tiempo real

- **Cierre de Caja:**
  - Conteo físico vs sistema
  - Identificación automática de diferencias
  - Justificación de faltantes/sobrantes
  - Arqueo detallado por denominaciones
  - Reporte de cierre automático
  - Transferencia a bóveda/banco

#### **Especificaciones Técnicas:**
```typescript
interface SesionCaja {
  id: string
  caja_id: string
  usuario_apertura_id: string
  fecha_apertura: Date
  monto_inicial: number
  desglose_apertura: DesgloseEfectivo
  estado: 'abierta' | 'cerrada'
  
  // Cierre
  fecha_cierre?: Date
  usuario_cierre_id?: string
  monto_final_sistema: number
  monto_final_fisico: number
  diferencia: number
  observaciones_cierre?: string
}

interface MovimientoCaja {
  id: string
  sesion_caja_id: string
  tipo: 'ingreso' | 'egreso'
  concepto: string
  monto: number
  referencia?: string  // ID de pago, desembolso, etc.
  usuario_id: string
  timestamp: Date
}
```

### **2. GENERACIÓN DE CONTRATOS PDF**

#### **Funcionalidades Requeridas:**
- **Template Personalizable:**
  - Plantilla base con datos de la empresa
  - Campos dinámicos (cliente, crédito, garantía)
  - Términos y condiciones configurables
  - Logo y branding de la empresa

- **Generación Automática:**
  - Crear PDF al aprobar crédito
  - Numeración secuencial automática
  - Códigos QR para verificación
  - Firma digital (futuro)

- **Almacenamiento y Control:**
  - Guardar en Supabase Storage
  - Versionado de contratos
  - Acceso rápido desde registro de crédito
  - Reimpresión cuando sea necesario

#### **Especificaciones Técnicas:**
```typescript
interface ContratoGenerado {
  id: string
  credito_id: string
  numero_contrato: string
  template_version: string
  fecha_generacion: Date
  archivo_url: string
  hash_documento: string  // Para verificar integridad
  estado: 'generado' | 'firmado' | 'anulado'
}
```

### **3. SISTEMA DE FOTOS DE GARANTÍAS**

#### **Funcionalidades Requeridas:**
- **Upload y Gestión:**
  - Mínimo 3 fotos, máximo 10 por garantía
  - Drag & drop interface
  - Preview antes de subir
  - Compresión automática (optimizar storage)
  - Metadata automático (fecha, tamaño, resolución)

- **Galería Profesional:**
  - Vista de thumbnails
  - Zoom y navegación
  - Eliminación individual
  - Reordenamiento drag & drop
  - Descarga de fotos

#### **Especificaciones Técnicas:**
```typescript
interface GarantiaFoto {
  id: string
  garantia_id: string
  archivo_url: string
  thumbnail_url: string
  orden: number
  tamano_bytes: number
  fecha_subida: Date
  usuario_id: string
}
```

### **4. PROCESO DE VENCIMIENTOS**

#### **Funcionalidades Requeridas:**
- **Detección Automática:**
  - Cálculo diario de vencimientos
  - Identificación de cuotas pendientes
  - Cálculo automático de días de mora
  - Interés moratorio automático

- **Alertas y Notificaciones:**
  - Vencimientos próximos (3, 7, 15 días)
  - Vencidos hoy
  - Clientes en mora crítica
  - Dashboard de vencimientos

- **Proceso de Gestión:**
  - Actualización automática de estados
  - Workflow de cobranza
  - Registro de gestiones realizadas
  - Preparación para remate/venta

#### **Especificaciones Técnicas:**
```typescript
interface ProcesoVencimiento {
  cuota_id: string
  dias_vencido: number
  interes_moratorio: number
  monto_total_adeudado: number
  estado_gestion: 'pendiente' | 'gestionado' | 'pagado'
  proxima_accion: Date
  tipo_accion: 'llamada' | 'whatsapp' | 'visita' | 'remate'
}
```

---

## 📈 REQUERIMIENTOS IMPORTANTES (GENERAN INGRESOS ADICIONALES)

### **5. INTEGRACIÓN WHATSAPP BUSINESS**

#### **Funcionalidades Requeridas:**
- **Recordatorios Automáticos:**
  - Mensajes 3, 7, 15 días antes vencimiento
  - Personalización por tipo de cliente
  - Horarios configurables de envío
  - Rate limiting para no spamear

- **Comunicación Transaccional:**
  - Recibos de pago por WhatsApp (PDF)
  - Confirmaciones de desembolso
  - Notificaciones de prenda lista para retiro
  - Estados de cuenta bajo demanda

#### **Especificaciones Técnicas:**
```typescript
interface WhatsAppMessage {
  id: string
  cliente_id: string
  telefono: string
  tipo: 'recordatorio' | 'recibo' | 'notificacion'
  mensaje: string
  adjuntos?: string[]
  estado: 'pendiente' | 'enviado' | 'entregado' | 'error'
  fecha_programada: Date
  fecha_enviado?: Date
}
```

### **6. IA DE VALUACIÓN Y PREDICCIÓN**

#### **Funcionalidades Requeridas:**
- **Valuación con Cámara:**
  - Foto → análisis automático
  - Identificación de categoría
  - Precio sugerido basado en mercado
  - Nivel de confianza de la valuación

- **Scoring de Clientes:**
  - Análisis de historial de pagos
  - Probabilidad de mora
  - Límite de crédito sugerido
  - Alertas de riesgo

#### **Especificaciones Técnicas:**
```typescript
interface ValuacionIA {
  garantia_id: string
  imagen_url: string
  categoria_detectada: string
  precio_sugerido: number
  confianza_nivel: number  // 0-100%
  factores_considerados: string[]
  fecha_valuacion: Date
}

interface ScoringCliente {
  cliente_id: string
  puntaje_credito: number  // 0-1000
  probabilidad_mora: number  // 0-100%
  limite_sugerido: number
  factores_riesgo: string[]
  fecha_calculo: Date
}
```

---

## 🔐 REQUERIMIENTOS DE SEGURIDAD Y CONTROL

### **7. SISTEMA DE ROLES Y PERMISOS**

#### **Roles Definidos:**
- **Administrador:** Acceso total al sistema
- **Gerente:** Reportes, aprobaciones, configuración
- **Analista de Crédito:** Evaluación y aprobación de créditos
- **Cajero:** Operaciones de caja y pagos

#### **Permisos Granulares:**
```typescript
interface PermisosUsuario {
  // Módulo Clientes
  clientes_ver: boolean
  clientes_crear: boolean
  clientes_editar: boolean
  clientes_eliminar: boolean
  
  // Módulo Créditos  
  creditos_ver: boolean
  creditos_crear: boolean
  creditos_aprobar: boolean
  creditos_desembolsar: boolean
  
  // Módulo Caja
  caja_abrir: boolean
  caja_cerrar: boolean
  caja_movimientos: boolean
  caja_reportes: boolean
  
  // Módulo Reportes
  reportes_financieros: boolean
  reportes_gerenciales: boolean
  reportes_auditoria: boolean
}
```

### **8. AUDITORÍA COMPLETA**

#### **Funcionalidades Requeridas:**
- **Log de Acciones:**
  - Quién hizo qué, cuándo, dónde
  - IP y dispositivo usado
  - Cambios en datos sensibles
  - Intentos de acceso fallidos

#### **Especificaciones Técnicas:**
```typescript
interface LogAuditoria {
  id: string
  usuario_id: string
  accion: string
  modulo: string
  registro_id?: string
  datos_anteriores?: object
  datos_nuevos?: object
  ip_address: string
  user_agent: string
  timestamp: Date
}
```

---

## 📊 REQUERIMIENTOS DE REPORTES Y COMPLIANCE

### **9. REPORTES OBLIGATORIOS SUNAT**

#### **Funcionalidades Requeridas:**
- **Comprobantes Electrónicos:**
  - Boletas de venta
  - Facturas (si corresponde)  
  - Numeración automática
  - Formato XML para SUNAT

- **Libro de Operaciones:**
  - Registro automático de todas las operaciones
  - Formato requerido por SUNAT
  - Exportación mensual
  - Validación de datos

#### **Especificaciones Técnicas:**
```typescript
interface ComprobanteElectronico {
  id: string
  tipo: 'boleta' | 'factura'
  numero: string
  fecha_emision: Date
  cliente_documento: string
  monto_total: number
  igv: number
  estado_sunat: 'pendiente' | 'enviado' | 'aceptado' | 'rechazado'
  xml_content: string
  hash_signature: string
}
```

---

## 🛠️ REQUERIMIENTOS TÉCNICOS DE INFRAESTRUCTURA

### **Stack Tecnológico Confirmado:**
- **Frontend:** Next.js 14 + TypeScript + shadcn/ui ✅
- **Backend:** Next.js API Routes + Supabase ✅  
- **Base de Datos:** PostgreSQL (Supabase) ✅
- **Storage:** Supabase Storage ✅
- **Deploy:** Vercel ✅
- **Integraciones:** WhatsApp Business API, OpenAI Vision API

### **Requerimientos de Performance:**
- **Tiempo de respuesta:** < 2 segundos para operaciones normales
- **Disponibilidad:** 99.5% uptime
- **Backup:** Automático cada 6 horas + manual
- **Usuarios concurrentes:** Hasta 10 usuarios simultáneos

### **Requerimientos de Seguridad:**
- **Encriptación:** SSL/TLS en todas las comunicaciones
- **Autenticación:** 2FA para usuarios administrativos
- **Sesiones:** Expiración automática después de inactividad
- **Datos sensibles:** Encriptación en base de datos

---

## 📅 CRONOGRAMA DE IMPLEMENTACIÓN

### **Semana 1-2: Funcionalidades Críticas**
- [ ] Control de Caja completo
- [ ] Generación de Contratos PDF

### **Semana 3-4: Core Operativo**  
- [ ] Sistema de Fotos de Garantías
- [ ] Proceso de Vencimientos

### **Semana 5-6: Diferenciación**
- [ ] Integración WhatsApp
- [ ] IA de Valuación básica

### **Semana 7-8: Seguridad y Compliance**
- [ ] Roles y Permisos completos
- [ ] Reportes SUNAT básicos

---

## ✅ CRITERIOS DE ACEPTACIÓN

### **Para cada módulo implementado:**
- [ ] **Funcionalidad completa** según especificaciones
- [ ] **Testing exhaustivo** con datos reales
- [ ] **Performance aceptable** (< 2 segundos)
- [ ] **Interfaz intuitiva** (sin capacitación extensiva)
- [ ] **Documentación** de uso incluida

### **Para el sistema completo:**
- [ ] **Integración perfecta** entre todos los módulos
- [ ] **Backup y recuperación** funcionando
- [ ] **Seguridad implementada** en todos los niveles
- [ ] **Capacitación completada** para todos los usuarios
- [ ] **Go-live exitoso** sin interrupciones

---

## 🚀 PRÓXIMO PASO

**IMPLEMENTAR EN ORDEN DE PRIORIDAD:**

1. **Control de Caja** (Semana 1) - SIN ESTO NO PUEDEN OPERAR
2. **Contratos PDF** (Semana 2) - RIESGO LEGAL ALTO  
3. **Fotos Garantías** (Semana 3) - OBLIGATORIO POR LEY
4. **Proceso Vencimientos** (Semana 4) - CORE DEL NEGOCIO

**¿Empezamos con Control de Caja?**
