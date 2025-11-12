# 🚨 ANÁLISIS COMPLETO DE ERRORES DEL SISTEMA JUNTAY

## ❌ PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **CLIENTES - Campos faltantes en INSERT**

**Schema requiere:**
```sql
empresa_id UUID REFERENCES empresas(id)
created_by UUID REFERENCES usuarios(id)
```

**Código actual:**
```typescript
// ❌ NO enviamos empresa_id ni created_by
const clienteData = {
  tipo_persona: tipoPersona,
  tipo_documento: formData.tipo_documento,
  // ... otros campos
  // ❌ FALTAN: empresa_id, created_by
}
```

**Impacto:** 
- Si estos campos tienen constraint NOT NULL → Error al insertar
- Si tienen valores por defecto → Funciona pero datos incorrectos

---

### 2. **CRÉDITOS - Campos faltantes en INSERT**

**Schema requiere:**
```sql
empresa_id UUID REFERENCES empresas(id)
solicitud_id UUID REFERENCES solicitudes_credito(id)
tipo_credito_id UUID REFERENCES tipos_credito(id)
desembolsado_por UUID REFERENCES usuarios(id)
```

**Código actual:**
```typescript
// ❌ NO enviamos ninguno de estos campos
const creditoData = {
  codigo,
  cliente_id: formData.cliente_id,
  monto_prestado: monto,
  // ...
  // ❌ FALTAN: empresa_id, solicitud_id, tipo_credito_id, desembolsado_por
}
```

**Impacto:** Error al insertar si NOT NULL

---

### 3. **GARANTÍAS - Campos faltantes**

**Schema requiere:**
```sql
tasado_por UUID REFERENCES usuarios(id)
```

**Código actual:**
```typescript
// ❌ NO enviamos tasado_por
const garantiaData = {
  codigo,
  nombre: formData.nombre,
  // ...
  // ❌ FALTA: tasado_por
}
```

---

### 4. **PAGOS - Query con campos incorrectos**

**Schema real:**
```sql
CREATE TABLE pagos (
    id UUID,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    credito_id UUID,
    cronograma_id UUID,  -- ⚠️ Campo que no usamos
    caja_id UUID,        -- ⚠️ Campo que no usamos
    tipo_pago VARCHAR(50) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    monto_total DECIMAL(12,2) NOT NULL,
    monto_capital DECIMAL(12,2) DEFAULT 0,
    monto_interes DECIMAL(12,2) DEFAULT 0,
    monto_mora DECIMAL(12,2) DEFAULT 0,
    fecha_pago TIMESTAMP,
    numero_operacion VARCHAR(100),
    cuenta_bancaria_id UUID,  -- ⚠️ Campo que no usamos
    observaciones TEXT,
    registrado_por UUID  -- ⚠️ Campo que no usamos
)
```

**Código actual:**
```typescript
// ✅ Ahora correcto pero faltan campos opcionales
const pagoData = {
  codigo: codigoPago,
  credito_id: params.id,
  tipo_pago: 'cuota',
  metodo_pago: formData.metodo_pago,
  monto_total: montoPago,
  // ⚠️ OPCIONALES que no enviamos:
  // cronograma_id, caja_id, registrado_por
}
```

---

### 5. **TABLA cronograma_pagos - Campos correctos**

**Schema:**
```sql
CREATE TABLE cronograma_pagos (
    id UUID,
    credito_id UUID,
    numero_cuota INTEGER NOT NULL,
    monto_capital DECIMAL(12,2) NOT NULL,
    monto_interes DECIMAL(12,2) NOT NULL,
    monto_total DECIMAL(12,2) NOT NULL,
    monto_pagado DECIMAL(12,2) DEFAULT 0,
    monto_mora DECIMAL(12,2) DEFAULT 0,
    fecha_vencimiento DATE NOT NULL,
    fecha_pago TIMESTAMP,
    estado VARCHAR(50) NOT NULL, -- 'pendiente', 'pagado', 'vencido', 'parcial'
    dias_atraso INTEGER DEFAULT 0
)
```

**Código actual:**
```typescript
// ✅ Correcto
cronograma.map(cuota => ({
  credito_id: credito.id,
  numero_cuota: cuota.numero_cuota,
  monto_capital: cuota.monto_capital,
  monto_interes: cuota.monto_interes,
  monto_total: cuota.monto_total,
  fecha_vencimiento: cuota.fecha_vencimiento,
  monto_pagado: 0,
  estado: 'pendiente'
}))
```

---

### 6. **TIPOS DE TYPESCRIPT - Inconsistencias**

**Problema:**
```typescript
// En algunas partes usamos:
credito.cliente?.nombres  // ❌ No existe
credito.cronograma  // ❌ No existe

// En otras partes usamos:
credito.clientes?.nombres  // ✅ Correcto
credito.cronograma_pagos  // ✅ Correcto
```

---

### 7. **RELACIONES EN SUPABASE**

**Problema con garantías:**
```typescript
// ❌ NO FUNCIONA (Supabase no puede hacer este join)
.select('*, creditos(*), garantias(*)')

// La relación es:
// creditos.id ← garantias.credito_id
// No existe garantias.id ← creditos.garantia_id
```

**Solución actual:** ✅ Ya corregido con query separado

---

### 8. **DASHBOARD - Datos Estáticos vs Dinámicos**

**Problema:**
```typescript
// Alertas son estáticas
<AlertItem tipo="mora" mensaje="3 créditos con más de 5 días de mora" />
// ❌ Deberían calcularse desde la base de datos
```

---

### 9. **MIDDLEWARE DESHABILITADO**

**Problema:**
```typescript
// middleware.ts
export const config = {
  matcher: []  // ⚠️ Todas las rutas públicas
}
```

**Impacto:** Sistema sin protección de autenticación

---

### 10. **CATEGORÍAS DE GARANTÍAS**

**Schema tiene:**
```sql
CREATE TABLE categorias_garantia (
    id UUID,
    empresa_id UUID,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    porcentaje_prestamo DECIMAL(5,2)
)
```

**Pregunta:** ¿Esta tabla existe en Supabase?
Si no existe → Error al intentar listar categorías

---

## 📊 RESUMEN DE SEVERIDAD

```
🔴 CRÍTICO (Bloquea funcionalidad):
   - Campos NOT NULL faltantes en INSERT
   - Tablas que no existen en Supabase
   
🟡 IMPORTANTE (Funciona pero con errores):
   - Campos opcionales no enviados (empresa_id, created_by)
   - Dashboard con datos estáticos
   - Middleware deshabilitado
   
🟢 MENOR (Mejoras):
   - Tipos de TypeScript inconsistentes
   - Código duplicado
```

---

## ✅ SOLUCIONES PROPUESTAS

### Solución 1: Hacer todos los campos opcionales en el schema
```sql
-- Cambiar en Supabase:
ALTER TABLE clientes ALTER COLUMN empresa_id DROP NOT NULL;
ALTER TABLE clientes ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE creditos ALTER COLUMN empresa_id DROP NOT NULL;
-- etc...
```

### Solución 2: Enviar valores NULL explícitamente
```typescript
const clienteData = {
  // ... campos actuales
  empresa_id: null,
  created_by: null
}
```

### Solución 3: Obtener empresa_id y user_id del contexto
```typescript
const { data: { user } } = await supabase.auth.getUser()
const clienteData = {
  // ... campos actuales
  created_by: user?.id || null,
  empresa_id: 'uuid-de-empresa-default'
}
```

---

## 🎯 PRIORIDAD DE CORRECCIÓN

1. **URGENTE:** Verificar qué campos son NOT NULL en Supabase
2. **URGENTE:** Agregar empresa_id y created_by a inserts
3. **IMPORTANTE:** Verificar que existan todas las tablas
4. **IMPORTANTE:** Habilitar middleware
5. **OPCIONAL:** Dashboard dinámico
6. **OPCIONAL:** Limpiar tipos de TypeScript
