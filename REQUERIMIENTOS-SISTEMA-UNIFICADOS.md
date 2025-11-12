# 📋 REQUERIMIENTOS DE SISTEMA UNIFICADOS - JUNTAY

**Proyecto:** Sistema Casa de Empeño - Cliente Único  
**Basado en:** Entrevista completa con cliente + análisis técnico  
**Estado Actual:** Sistema base funcional → Customización completa  
**Última Actualización:** 12 Nov 2025 - Post Entrevista Cliente  

---

## 🎯 RESUMEN EJECUTIVO DE REQUERIMIENTOS

### **📊 INFORMACIÓN DEL CLIENTE (Post-Entrevista)**

#### **🏢 Operación Actual:**
- **Volumen diario:** 10 empeños promedio
- **Manejo de efectivo:** Hasta S/10,000 diarios
- **Personal actual:** 2 empleados operativos
- **Usuarios sistema:** 4 simultáneos requeridos
- **Sucursales:** 1 actual + 1 planificada
- **Sistema actual:** Excel (insuficiente, sin automatización)

#### **💰 Estructura de Intereses:**
- **Base mensual:** 20%
- **Pago semanal:** 5%
- **Pago quincenal:** 10% 
- **Pago tri-semanal:** 15%
- **Renovaciones:** Solo pago de intereses (20% o proporcional)
- **Tickets:** Pagos parciales/totales requeridos

#### **⚠️ Puntos Críticos Identificados:**
- **Control de caja deficiente:** Faltantes/sobrantes frecuentes
- **Comunicación fragmentada:** WhatsApp manual sin automatización
- **Valuación ineficiente:** Envío fotos por WhatsApp a terceros
- **Proceso vencimientos:** 1 semana gracia → venta inmediata
- **Dependencia crítica:** "Si sistema cae 1 hora, empresa se detiene"

### **Estado del Sistema Post-Implementaciones Recientes**
- ✅ **Control de Caja:** COMPLETADO (Nov 12)
- ✅ **Contratos PDF:** COMPLETADO (Nov 12)  
- ✅ **Sistema Fotos:** COMPLETADO (Nov 12)
- ✅ **Navegación completa:** COMPLETADO (Nov 12)
- 🎯 **NEXT UP:** RENIEC API + WhatsApp Business

### **Gap Analysis Actualizado: Cliente Específico**
| Módulo | Estado Nov 12 | Requerido Cliente | Prioridad | Días Estimados |
|--------|---------------|-------------------|-----------|----------------|
| ✅ Control Caja | **COMPLETADO** | ✅ Crítico | ~~ALTA~~ | ~~Hecho~~ |
| ✅ Contratos PDF | **COMPLETADO** | ✅ Crítico | ~~ALTA~~ | ~~Hecho~~ |
| ✅ Fotos Garantías | **COMPLETADO** | ✅ Crítico | ~~ALTA~~ | ~~Hecho~~ |
| 🚧 RENIEC API | ❌ **PENDIENTE** | ✅ **MUY ALTA** | **EXTREMA** | **2-3 días** |
| 🚧 WhatsApp Business | ❌ **PENDIENTE** | ✅ **MUY ALTA** | **EXTREMA** | **2-3 días** |
| 🚧 Proceso Vencimientos | ❌ Pendiente | ✅ Alta | ALTA | 3-4 días |
| 🚧 Pagos Flexibles | ❌ Pendiente | ✅ Alta | ALTA | 2-3 días |
| 🚧 IA Valuación | ❌ Pendiente | ✅ Diferenciador | MEDIA | 4-5 días |
| 🚧 Roles Avanzados | ⚠️ Básico | ✅ Completo | MEDIA | 2-3 días |

---

## 🚨 REQUERIMIENTOS EXTREMA PRIORIDAD (POST-ENTREVISTA)

### **🔥 RENIEC API INTEGRATION**

#### **Funcionalidades Requeridas (Cliente Específico):**
- **Autocompletado por DNI:**
  - Input DNI → datos completos automáticos
  - Nombres, apellidos, dirección actualizada
  - Validación en tiempo real
  - Fallback manual si API no responde

- **Validación de Identidad:**
  - Verificar DNI válido y activo
  - Detectar DNI duplicados en sistema
  - Alertas para DNI observados/inhabilitados
  - Cache local para consultas frecuentes

#### **Especificaciones Técnicas:**
```typescript
interface ConsultaRENIEC {
  dni: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  direccion: string
  ubigeo: string
  estado_civil?: string
  fecha_nacimiento?: string
  validado: boolean
  fecha_consulta: Date
}
```

### **📱 WHATSAPP BUSINESS INTEGRATION**

#### **Funcionalidades Requeridas (Cliente Específico):**
- **Confirmaciones Automáticas:**
  - "Pago recibido: S/XXX - Saldo: S/XXX"
  - "Contrato firmado - Código: CRE-XXX"  
  - "Prenda lista para retiro"
  - Adjuntar recibos PDF automáticamente

- **Recordatorios de Vencimiento:**
  - 7 días antes: "Su cuota vence en 1 semana"
  - 3 días antes: "Recordatorio: cuota vence en 3 días"
  - Día vencimiento: "Su cuota vence HOY"
  - Post-vencimiento: "Su préstamo está vencido - 1 semana gracia"

- **Saludos Estacionales (Cliente Request):**
  - Año Nuevo, Navidad, Día de la Madre, etc.
  - Mensajes personalizados con nombre cliente
  - Programación automática de envíos

#### **Especificaciones Técnicas:**
```typescript
interface WhatsAppAutomation {
  cliente_id: string
  telefono: string
  tipo_mensaje: 'confirmacion' | 'recordatorio' | 'saludo'
  plantilla_id: string
  variables: Record<string, any>
  programado_para: Date
  estado: 'pendiente' | 'enviado' | 'entregado' | 'error'
}
```

---

## 🚨 REQUERIMIENTOS CRÍTICOS BASE (YA IMPLEMENTADOS)

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

### **4. SISTEMA DE PAGOS FLEXIBLES (CLIENTE ESPECÍFICO)**

#### **Funcionalidades Requeridas:**
- **Cálculo Automático por Frecuencia:**
  - **Mensual:** 20% base
  - **Semanal:** 5% (20%/4)
  - **Quincenal:** 10% (20%/2)  
  - **Tri-semanal:** 15% (20%*3/4)
  - Configuración personalizable por cliente

- **Tickets de Pago:**
  - "Pago Parcial" - Reduce saldo pendiente
  - "Pago Total" - Liquida cuota completa
  - "Renovación" - Solo intereses, extiende plazo
  - Estado visual: Pendiente/Pagado/Vencido

- **Renovaciones (Cliente Request):**
  - Opción: Pagar solo intereses del periodo
  - Resetea contador de días a 30 días más
  - Mantiene capital original intacto
  - Limita renovaciones (máx 3 veces)

#### **Especificaciones Técnicas:**
```typescript
interface PagoFlexible {
  cuota_id: string
  tipo_pago: 'parcial' | 'total' | 'renovacion'
  frecuencia: 'diario' | 'semanal' | 'quincenal' | 'tri-semanal' | 'mensual'
  porcentaje_aplicado: number
  monto_calculado: number
  monto_pagado: number
  saldo_pendiente: number
  es_renovacion: boolean
  numero_renovacion?: number
}
```

### **5. PROCESO DE VENCIMIENTOS (CLIENTE ESPECÍFICO)**

#### **Funcionalidades Requeridas:**
- **Plazo de Gracia (Cliente Request):**
  - **1 semana exacta** después de vencimiento
  - Durante gracia: Solo recordatorios, NO mora
  - Después de gracia: Preparar para venta
  - "Cuando cliente no responde en 1 semana → venta"

- **Escalamiento Automático:**
  - Día 1-7: Recordatorios WhatsApp automáticos
  - Día 8: "Plazo gracia terminado"
  - Día 8+: Proceso de remate activado
  - Precio venta: "Monto mayor al que se le dio"

- **Workflow de Venta:**
  - Cambiar estado prenda: "En proceso venta"
  - Calcular precio mínimo venta
  - Generar ficha para vitrina/marketplace
  - Notificar al cliente última oportunidad

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

## 📅 CRONOGRAMA ACTUALIZADO (POST-ENTREVISTA)

### **✅ COMPLETADO (12 Nov 2025):**
- ✅ Control de Caja completo
- ✅ Generación de Contratos PDF
- ✅ Sistema de Fotos de Garantías
- ✅ Navegación completa del dashboard

### **🚀 EN CURSO (13-15 Nov 2025):**
- 🚧 **RENIEC API Integration** (2-3 días)
- 🚧 **WhatsApp Business API** (2-3 días)

### **⚡ SIGUIENTE SPRINT (16-20 Nov 2025):**
- [ ] Sistema de Pagos Flexibles (2-3 días)
- [ ] Proceso de Vencimientos específico (3-4 días)

### **🎯 SPRINT DIFERENCIACIÓN (21-27 Nov 2025):**
- [ ] IA de Valuación con cámara (4-5 días)
- [ ] Roles y Permisos granulares (2-3 días)

### **📊 SPRINT FINAL (28 Nov - 5 Dic 2025):**
- [ ] Reportes gerenciales
- [ ] Optimizaciones de performance
- [ ] Testing exhaustivo
- [ ] Capacitación y go-live

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

## 🚀 PRÓXIMOS PASOS INMEDIATOS

### **✅ COMPLETADOS (60% del Sprint 1):**
1. ✅ **Control de Caja** - FUNCIONANDO AL 100%
2. ✅ **Contratos PDF** - FUNCIONANDO AL 100%  
3. ✅ **Fotos Garantías** - FUNCIONANDO AL 100%

### **🎯 PRIORIDAD EXTREMA (Esta Semana):**

#### **1. RENIEC API Integration (2-3 días)**
- **Impacto:** Reduce tiempo registro 80%
- **Cliente dice:** "Solo ingresar DNI para rellenar datos"
- **ROI:** 5-10 min → 30 seg por cliente

#### **2. WhatsApp Business API (2-3 días)**  
- **Impacto:** Automatiza 100% comunicación cliente
- **Cliente dice:** "Confirmaciones pago, recordatorios, saludos"
- **ROI:** Reduce morosidad 25-40%

### **🔥 JUSTIFICACIÓN PRIORIDAD:**
- **Excel actual:** "No cumple expectativas"
- **Sistema crítico:** "Si cae 1 hora, empresa se detiene"
- **Comunicación manual:** Fragmentada y sin seguimiento
- **Proceso actual:** Envían fotos WhatsApp para valuar

### **📋 CRITERIOS DE ÉXITO (Cliente):**
- [ ] DNI → datos completos < 30 segundos
- [ ] WhatsApp automático confirmando pagos
- [ ] Recordatorios 7, 3, 1 días antes vencimiento
- [ ] Saludos automáticos en feriados
- [ ] Reducir tiempo registro cliente 80%

**¿PROCEDEMOS CON RENIEC API + WHATSAPP BUSINESS?**
