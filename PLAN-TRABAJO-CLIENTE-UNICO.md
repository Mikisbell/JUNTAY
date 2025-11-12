# 📋 PLAN DE TRABAJO - CLIENTE ÚNICO

**Proyecto:** Sistema Casa de Empeño Personalizado  
**Metodología:** Requerimientos → Desarrollo → Validación → Entrega  
**Timeline:** 6-8 semanas total  

---

## 🎯 ETAPA 1: DEFINICIÓN DE REQUERIMIENTOS (Semana 1)

### **📝 Sesiones de Descubrimiento**

#### **Sesión 1: Operación Actual (2 horas)**
**Objetivo:** Entender cómo trabajan hoy

**Preguntas Clave:**
1. **Flujo de Trabajo Diario**
   - ¿Cómo abren la caja cada mañana?
   Si desde las 9 am el trabajador  el administradir  tiene acceso al sistema a cualquier hroa   lso trabjaodres sera progrmados
   - ¿Cómo registran un nuevo empeño?
   el clinete trae lo probamos si todo esta bien lo guardamos  siempre idncando si se encontro alguna anomalia
   - ¿Cómo manejan los pagos de clientes?
   debe haber un campo donde insertaremos el procentaje que debera pagar por el prestamos, por lo general es el 20% por mes
   hay clientes que pagan diariamente otros que pagan semanalmente por ello el porcentaje debe ajustarse 5% semanal 10% cada 15 dias 15% cada 3 semanas 
   para ello se le debe dar un ticker  donde se indica que ya pago en su totalidad o parcial y hay caso en los que el cliente no podra hacer el pago mensual asi qeu tien la opcion de renovar siempre en cuando este pague solo  el 20% o lo que corresponda de interes  ese es un ejemplo ya que va a varias segun el procentaje que corresponda de cada mes  asi como el pago pro semana 
   - ¿Cómo cierran la caja al final del día?
   en eso he tenido porblemas aceptare tus sugernecia profesioanles 

2. **Herramientas Actuales**
   - ¿Qué sistema/software usan ahora?
   si usamos excel
   - ¿Excel, cuadernos, sistema antiguo?
   excel
   - ¿Qué les funciona bien?
   no cumple mis espectavias
   - ¿Cuáles son sus principales frustraciones?
   autmotizacion y el hecho de no poder interactuar con mis  clientes enviando si estan en mora y cuanto dias de mora tiene que se comuniquen con nosotros al menos de enviar un mensaje de confirmación de pago  el contrrator digtal saludos por sferiados

3. **Volumen de Operaciones**
   - ¿Cuántos empeños procesan por día?
   10 promedio 
   - ¿Cuánto dinero manejan diariamente?
   hasta 10 mil soles
   - ¿Cuántas sucursales/cajas tienen?
   de momoento solo 1 pero se esta pensando en abrir otro 
   - ¿Cuántos empleados usan el sistema?
   2

4. **Procesos de Garantías**
   - ¿Cómo valúan las prendas?
   de mooento se hace manualmente, se le envia una foto por watsapp bussines a una persona que se encarga de ello y me da la tasa me gustaria que sea  automatico 
   - ¿Toman fotos? ¿Cómo las almacenan?
   de momento se toman fotos manualmente y se guardan en un cuaderno con u ticker con un codigo de identificacion me gusatrua que se haga a a partir de la aplicacion  qeu em de un qr para qeu habilite mi  celular para qeu se conecten y 
   - ¿Dónde guardan físicamente las garantías?
   en un alancen qu etenemso en al oficina 
   - ¿Cómo manejan las prendas vencidas?
   pues cuando el cliente  no responde en el plazo de 1 semana lo ponemos en venta con un monto mayor al que se le dio 

#### **Sesión 2: Dolores y Necesidades (1.5 horas)**
**Objetivo:** Identificar problemas críticos a resolver

**Áreas de Investigación:**
1. **Control Financiero**
   - ¿Han tenido problemas de faltante/sobrante de caja?
   si 
   - ¿Cómo controlan los movimientos de dinero?
   con excel
   - ¿Necesitan reportes específicos para gerencia?
   si 
   - ¿Integración con bancos necesaria?
    no pero si con  la  reniec  para rellenart los datos solo ingresando su dni

2. **Cumplimiento Legal**
   - ¿Qué reportes deben generar para SUNAT?
   no  de moemnto pero si  es necesario debemos hacerlo
   - ¿Necesitan comprobantes electrónicos?
   de momoento no  pero si el cliente lo requiere deberia hacerlo 
   - ¿Tienen auditorías regulares?
   no en un futro sera con sl SBSS
   - ¿Qué documentos legales requieren?

3. **Gestión de Clientes**
   - ¿Cómo se comunican con clientes morosos?
   a traves de llamadas y whatsapp
   - ¿Usan WhatsApp, llamadas, visitas?
   si 
   - ¿Qué información necesitan del historial del cliente?
    todo 
   - ¿Manejan clientes corporativos?
   no 

4. **Operaciones Críticas**
   - ¿Cuáles son los procesos que NO pueden fallar?
   todo 
   - ¿Qué pasa si el sistema se cae 1 hora?
   todo el trabajo de la empresa se detiene
   - ¿Necesitan trabajar offline?
   si 
   - ¿Requieren backup en tiempo real?
   si 

#### **Sesión 3: Flujos de Trabajo Detallados (2 horas)**
**Objetivo:** Mapear cada proceso paso a paso

**Flujos a Documentar:**
1. **Flujo de Empeño Nuevo**
   ```
   Cliente llega → Evaluación prenda → Valuación → 
   Negociación → Fotos → Contrato → Almacenamiento → 
   Desembolso → Registro caja
   ```

2. **Flujo de Pago de Cliente**
   ```
   Cliente llega → Identificación → Verificación deuda → 
   Cálculo intereses → Recibo pago → Actualización estado → 
   ¿Desempeña? → Entrega prenda / Continúa empeño
   ```
3. **Flujo de Vencimiento**
   ```
   Detección vencimiento → Notificación cliente → 
   Plazo gracia → ¿Paga/Renueva? → 
   SÍ: Proceso normal / NO: Proceso de remate
   ```

4. **Flujo de Caja Diario**
   ```
   Apertura → Conteo inicial → Operaciones día → 
   Pre-cierre → Arqueo → Diferencias → 
   Justificación → Cierre final → Reporte
   ```

#### **Sesión 4: Requerimientos Técnicos (1 hora)**
**Objetivo:** Especificaciones técnicas y restricciones

**Temas a Cubrir:**
1. **Infraestructura**
   - ¿Tienen internet estable? si
   - ¿Velocidad de conexión? buena
   - ¿Equipos disponibles? (PCs, tablets, celulares) si
   - ¿Impresoras térmicas para recibos? impresora canon g4110

2. **Integraciones Deseadas**
   - ¿WhatsApp Business account? si
   - ¿APIs bancarias específicas? no
   - ¿Sistema contable existente? no
   - ¿Cámaras de seguridad integradas? no

3. **Usuarios del Sistema**
   - ¿Cuántos usuarios simultáneos? 4
   - ¿Diferentes roles? (Admin, cajero, gerente) si
   - ¿Nivel técnico del equipo? nivel medio
   - ¿Capacitación requerida? si

---

## 📊 ENTREGABLES DE LA ETAPA 1

### **📋 Documento de Requerimientos Funcionales**

#### **1. Casos de Uso Principales**
- [ ] CU001: Registrar nuevo empeño
- [ ] CU002: Procesar pago de cliente  
- [ ] CU003: Gestionar vencimientos
- [ ] CU004: Control diario de caja
- [ ] CU005: Generar reportes gerenciales

#### **2. Requerimientos No Funcionales**
- [ ] Performance: Tiempo de respuesta < 2 segundos
- [ ] Disponibilidad: 99.5% uptime
- [ ] Seguridad: Backup automático diario
- [ ] Usabilidad: Sistema intuitivo sin capacitación extensa
- [ ] Escalabilidad: Soportar crecimiento 300% en 2 años

#### **3. Integraciones Requeridas**
- [ ] WhatsApp Business API
- [ ] Generación de PDFs
- [ ] Cámaras para fotos de garantías  
- [ ] Impresoras térmicas
- [ ] [Otras específicas del cliente]

#### **4. Flujos de Trabajo Documentados**
- [ ] Diagramas de flujo de cada proceso crítico
- [ ] Mockups de pantallas principales
- [ ] Reglas de negocio específicas
- [ ] Validaciones y controles requeridos

---

## 🎯 ETAPA 2: DISEÑO Y PLANIFICACIÓN (Días 8-10)

### **🏗️ Arquitectura de Solución**

#### **Stack Tecnológico Confirmado**
```typescript
interface StackPersonalizado {
  frontend: "Next.js 14 + TypeScript + shadcn/ui"
  backend: "Next.js API Routes + Supabase"  
  database: "PostgreSQL (Supabase)"
  storage: "Supabase Storage (fotos)"
  deployment: "Vercel"
  
  // Integraciones específicas
  whatsapp: "WhatsApp Business API"
  pdf: "jsPDF + react-pdf"
  ia_valuacion: "OpenAI Vision API"
  backup: "Supabase automated + manual"
}
```

#### **📐 Diseño de Base de Datos**
- [ ] **Revisión del esquema actual** vs requerimientos específicos
- [ ] **Customizaciones necesarias** para el cliente
- [ ] **Campos adicionales** no considerados originalmente
- [ ] **Índices específicos** para performance

#### **🎨 Diseño de UI/UX**
- [ ] **Wireframes** de pantallas críticas
- [ ] **Flujo de navegación** optimizado para sus procesos
- [ ] **Mockups** de interfaces principales
- [ ] **Prototipo interactivo** para validación

### **📅 Cronograma Detallado de Desarrollo**

#### **Sprint 1 (Semanas 2-3): Core Crítico**
**Objetivo:** Sistema mínimo viable para operar

- **Semana 2:**
  - [ ] Día 8-10: Setup personalizado + DB adjustments
  - [ ] Día 11-14: Control de caja completo
  
- **Semana 3:**  
  - [ ] Día 15-17: Generación de contratos PDF
  - [ ] Día 18-21: Upload y gestión de fotos

**Entregable:** Demo funcional del core

#### **Sprint 2 (Semanas 4-5): Operación Completa**
**Objetivo:** Todos los flujos principales funcionando

- **Semana 4:**
  - [ ] Día 22-24: Proceso de vencimientos
  - [ ] Día 25-28: Flujos de pago completos
  
- **Semana 5:**
  - [ ] Día 29-31: Reportes específicos del cliente
  - [ ] Día 32-35: Integración WhatsApp básica

**Entregable:** Sistema completo para testing

#### **Sprint 3 (Semanas 6-7): Diferenciación**
**Objetivo:** IA y automatizaciones avanzadas

- **Semana 6:**
  - [ ] Día 36-38: IA de valuación con cámara
  - [ ] Día 39-42: Scoring de clientes automático
  
- **Semana 7:**
  - [ ] Día 43-45: Notificaciones WhatsApp automáticas  
  - [ ] Día 46-49: Dashboard ejecutivo con BI

**Entregable:** Sistema con ventaja competitiva

#### **Sprint 4 (Semana 8): Producción**
**Objetivo:** Sistema listo para go-live

- **Semana 8:**
  - [ ] Día 50-52: Testing intensivo con usuarios reales
  - [ ] Día 53-55: Capacitación del equipo
  - [ ] Día 56: Go-live y soporte inicial

**Entregable:** Sistema en producción

---

## 🔄 METODOLOGÍA DE VALIDACIÓN

### **✅ Checkpoints de Validación**

#### **Checkpoint 1 (Día 21): Core Demo**
**Validar con el cliente:**
- [ ] ¿El control de caja funciona como esperan?
- [ ] ¿Los contratos PDF tienen el formato correcto?
- [ ] ¿El flujo de fotos es intuitivo?
- [ ] **Decisión:** ¿Continuar o ajustar?

#### **Checkpoint 2 (Día 35): Sistema Completo**
**Testing con usuarios reales:**
- [ ] Procesar 5-10 empeños de prueba end-to-end
- [ ] Realizar ciclo completo de caja (apertura → operaciones → cierre)  
- [ ] Validar todos los reportes requeridos
- [ ] **Decisión:** ¿Listo para IA o necesita ajustes?

#### **Checkpoint 3 (Día 49): Sistema Final**
**Pre-producción testing:**
- [ ] Stress testing con volumen real
- [ ] Validación de todas las integraciones
- [ ] Capacitación de power users
- [ ] **Decisión:** ¿Go-live o una semana más?

---

## 📋 CRITERIOS DE ACEPTACIÓN

### **🎯 Criterios de Éxito por Módulo**

#### **Control de Caja**
- [ ] Apertura en < 2 minutos
- [ ] Registro de movimientos en tiempo real
- [ ] Cierre con diferencias explicadas
- [ ] Reportes automáticos generados

#### **Gestión de Empeños** 
- [ ] Registro completo en < 3 minutos
- [ ] Contrato PDF generado automáticamente
- [ ] Mínimo 3 fotos por garantía
- [ ] Cálculo automático de intereses

#### **Proceso de Pagos**
- [ ] Identificación de cliente en < 30 segundos  
- [ ] Cálculo automático de monto a pagar
- [ ] Recibo impreso automáticamente
- [ ] Actualización de estado en tiempo real

#### **WhatsApp Integration**
- [ ] Recordatorios automáticos enviados
- [ ] Recibos enviados por WhatsApp
- [ ] Confirmaciones de pago automáticas
- [ ] Tasa de entrega > 95%

#### **IA de Valuación**
- [ ] Foto → precio sugerido en < 10 segundos
- [ ] Precisión > 80% vs valuación manual experta
- [ ] Detección de categoría automática
- [ ] Alertas de riesgo para prendas dudosas

---

## 💰 ESTRUCTURA DE PAGOS

### **🏦 Modelo de Pagos por Hitos**

```typescript
interface EstructuraPagos {
  pago_inicial: {
    monto: "30% del total"
    trigger: "Firma de contrato + inicio desarrollo"
    entregable: "Documento de requerimientos aprobado"
  }
  
  pago_intermedio_1: {
    monto: "25% del total"  
    trigger: "Checkpoint 1 - Core Demo aprobado"
    entregable: "Funcionalidades críticas funcionando"
  }
  
  pago_intermedio_2: {
    monto: "25% del total"
    trigger: "Checkpoint 2 - Sistema completo"
    entregable: "Todos los flujos principales operativos"
  }
  
  pago_final: {
    monto: "20% del total"
    trigger: "Go-live exitoso"
    entregable: "Sistema en producción + capacitación"
  }
}
```

---

## 🛡️ GESTIÓN DE RIESGOS

### **⚠️ Riesgos Identificados y Mitigaciones**

#### **Riesgo Técnico**
- **Problema:** Integraciones complejas (WhatsApp, IA)
- **Mitigación:** Prototipos tempranos, APIs alternativas
- **Plan B:** Funcionalidades manual como backup

#### **Riesgo de Scope Creep**
- **Problema:** Cliente pide funcionalidades adicionales
- **Mitigación:** Documento de requerimientos firmado
- **Plan B:** Change requests con costo adicional

#### **Riesgo de Timeline**  
- **Problema:** Desarrollo toma más tiempo del estimado
- **Mitigación:** Buffer de 1 semana en timeline
- **Plan B:** Entrega por fases priorizadas

#### **Riesgo de Adopción**
- **Problema:** Usuarios no adoptan el sistema
- **Mitigación:** Capacitación intensiva + soporte
- **Plan B:** Migración gradual desde sistema actual

---

## 📞 COMUNICACIÓN Y REPORTING

### **📊 Reportes de Progreso**

#### **Daily Standups (15 min)**
- ¿Qué hice ayer?
- ¿Qué haré hoy?  
- ¿Hay bloqueos?

#### **Weekly Reports**
- Progreso vs timeline
- Demos de funcionalidades completadas
- Próximos hitos
- Riesgos identificados

#### **Milestone Reviews**
- Demostración completa
- Validación con usuarios finales
- Feedback y ajustes necesarios
- Decisión de continuar/ajustar

---

## ✅ PRÓXIMO PASO INMEDIATO

### **🎯 Esta Semana: Ejecutar Etapa 1**

**Acción Inmediata:**
1. **Coordinar Sesión 1** con el cliente (2 horas)
2. **Preparar cuestionario** detallado basado en este plan
3. **Documentar cada sesión** en tiempo real
4. **Crear documento de requerimientos** formal

**Al final de esta semana tendremos:**
- ✅ **Entendimiento completo** de sus necesidades
- ✅ **Requerimientos documentados** y validados  
- ✅ **Cronograma específico** con fechas reales
- ✅ **Propuesta económica** final
- ✅ **Listo para empezar a codificar** Semana 2

**¿Estás listo para coordinar la primera sesión con el cliente?**
