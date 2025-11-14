-- RECREAR SISTEMA DE CAJA GENERAL COMPLETO PARA CASA DE EMPEÑO
-- Elimina y recrea todas las tablas, funciones y triggers

-- ========================================
-- 1. ELIMINAR SISTEMA EXISTENTE
-- ========================================

-- Eliminar triggers
DROP TRIGGER IF EXISTS trigger_actualizar_saldos_caja_general ON caja_general;

-- Eliminar funciones
DROP FUNCTION IF EXISTS actualizar_saldos_caja_general();
DROP FUNCTION IF EXISTS inicializar_caja_general(UUID, DECIMAL, UUID);
DROP FUNCTION IF EXISTS registrar_aporte_socio(UUID, DECIMAL, UUID, VARCHAR, TEXT, VARCHAR, UUID);
DROP FUNCTION IF EXISTS registrar_transferencia_bancaria(UUID, DECIMAL, VARCHAR, VARCHAR, VARCHAR, TEXT, UUID);
DROP FUNCTION IF EXISTS registrar_deposito_banco(UUID, DECIMAL, VARCHAR, VARCHAR, VARCHAR, TEXT, UUID);
DROP FUNCTION IF EXISTS registrar_prestamo_otorgado(UUID, UUID, DECIMAL, VARCHAR, TEXT, UUID);
DROP FUNCTION IF EXISTS registrar_pago_interes(UUID, UUID, DECIMAL, VARCHAR, VARCHAR, UUID);
DROP FUNCTION IF EXISTS registrar_venta_remate(UUID, UUID, DECIMAL, TEXT, VARCHAR, UUID);
DROP FUNCTION IF EXISTS resumen_operaciones_empeno(DATE, DATE);

-- Eliminar tablas (en orden correcto por dependencias)
DROP TABLE IF EXISTS movimientos_caja_general CASCADE;
DROP TABLE IF EXISTS asignaciones_caja CASCADE;
DROP TABLE IF EXISTS caja_general CASCADE;

-- ========================================
-- 2. CREAR TABLAS ACTUALIZADAS
-- ========================================

-- TABLA CAJA GENERAL (BÓVEDA CENTRAL)
CREATE TABLE caja_general (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL DEFAULT 'Caja General',
    descripcion TEXT,
    
    -- SALDOS
    saldo_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    saldo_disponible DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    saldo_asignado DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    
    -- LÍMITES
    limite_asignacion_individual DECIMAL(15,2) DEFAULT 5000.00,
    limite_total_asignaciones DECIMAL(15,2) DEFAULT 50000.00,
    
    -- CONTROL
    activa BOOLEAN DEFAULT true,
    responsable_id UUID,
    
    -- AUDITORÍA
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    
    -- CONSTRAINTS
    CONSTRAINT chk_saldos_coherentes CHECK (saldo_total = saldo_disponible + saldo_asignado),
    CONSTRAINT chk_saldos_positivos CHECK (saldo_total >= 0 AND saldo_disponible >= 0 AND saldo_asignado >= 0)
);

-- TABLA ASIGNACIONES DE CAJA
CREATE TABLE asignaciones_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- RELACIONES
    caja_general_id UUID NOT NULL REFERENCES caja_general(id),
    caja_individual_id UUID NOT NULL REFERENCES cajas(id),
    sesion_caja_id UUID NOT NULL REFERENCES sesiones_caja(id),
    
    -- DATOS DE ASIGNACIÓN
    tipo_operacion VARCHAR(20) NOT NULL CHECK (tipo_operacion IN ('asignacion', 'devolucion')),
    monto_asignado DECIMAL(15,2) NOT NULL,
    monto_devuelto DECIMAL(15,2) DEFAULT 0.00,
    diferencia DECIMAL(15,2) DEFAULT 0.00,
    
    -- SALDOS ANTES/DESPUÉS
    saldo_caja_general_antes DECIMAL(15,2) NOT NULL,
    saldo_caja_general_despues DECIMAL(15,2) NOT NULL,
    
    -- CONTROL Y AUDITORÍA
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'devuelta', 'pendiente_devolucion')),
    observaciones TEXT,
    autorizado_por UUID,
    cajero_responsable UUID NOT NULL,
    
    -- FECHAS
    fecha_asignacion TIMESTAMP DEFAULT NOW(),
    fecha_devolucion TIMESTAMP,
    
    -- AUDITORÍA
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    
    -- CONSTRAINTS
    CONSTRAINT chk_monto_positivo CHECK (monto_asignado > 0),
    CONSTRAINT chk_diferencia_calculada CHECK (diferencia = monto_devuelto - monto_asignado)
);

-- TABLA MOVIMIENTOS CAJA GENERAL
CREATE TABLE movimientos_caja_general (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- RELACIONES
    caja_general_id UUID NOT NULL REFERENCES caja_general(id),
    asignacion_id UUID REFERENCES asignaciones_caja(id),
    
    -- DATOS DEL MOVIMIENTO
    tipo_movimiento VARCHAR(30) NOT NULL CHECK (tipo_movimiento IN (
        -- OPERACIONES BANCARIAS GENERALES
        'asignacion_cajero', 'devolucion_cajero', 'ingreso_efectivo', 
        'retiro_efectivo', 'transferencia_entrada', 'transferencia_salida',
        'ajuste_inventario', 'deposito_banco', 'aporte_socio',
        'transferencia_bancaria', 'pago_proveedor', 'retiro_socio', 'dividendo_socio',
        -- OPERACIONES ESPECÍFICAS DE CASA DE EMPEÑO
        'prestamo_otorgado', 'pago_interes', 'pago_capital', 'desempeno_total',
        'venta_remate', 'comision_tasacion', 'comision_almacenaje',
        'multa_vencimiento', 'renovacion_contrato', 'gasto_operativo'
    )),
    
    monto DECIMAL(15,2) NOT NULL,
    saldo_anterior DECIMAL(15,2) NOT NULL,
    saldo_nuevo DECIMAL(15,2) NOT NULL,
    
    -- DETALLES
    concepto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    referencia_externa VARCHAR(50),
    
    -- RESPONSABLES
    usuario_operacion UUID NOT NULL,
    autorizado_por UUID,
    
    -- AUDITORÍA
    fecha TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    
    -- CONSTRAINTS
    CONSTRAINT chk_saldo_coherente CHECK (
        -- EGRESOS (reducen saldo disponible)
        (tipo_movimiento IN ('asignacion_cajero', 'retiro_efectivo', 'transferencia_salida', 'pago_proveedor', 'retiro_socio', 'dividendo_socio', 'deposito_banco', 'prestamo_otorgado', 'gasto_operativo') AND saldo_nuevo = saldo_anterior - monto) OR
        -- INGRESOS (aumentan saldo disponible)
        (tipo_movimiento IN ('devolucion_cajero', 'ingreso_efectivo', 'transferencia_entrada', 'aporte_socio', 'transferencia_bancaria', 'pago_interes', 'pago_capital', 'desempeno_total', 'venta_remate', 'comision_tasacion', 'comision_almacenaje', 'multa_vencimiento', 'renovacion_contrato') AND saldo_nuevo = saldo_anterior + monto) OR
        -- AJUSTES (pueden ser + o -)
        (tipo_movimiento = 'ajuste_inventario')
    )
);
