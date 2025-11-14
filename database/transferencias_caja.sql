-- Eliminar tabla si existe para recrearla limpia
DROP TABLE IF EXISTS transferencias_caja;

-- Tabla para registrar transferencias entre cajas
CREATE TABLE transferencias_caja (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    caja_origen_id UUID NOT NULL REFERENCES cajas(id),
    caja_destino_id UUID NOT NULL REFERENCES cajas(id),
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    tipo VARCHAR(50) NOT NULL DEFAULT 'operativa',
    concepto VARCHAR(255),
    observaciones TEXT,
    referencia VARCHAR(100) UNIQUE NOT NULL,
    usuario_id UUID,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(20) DEFAULT 'completada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_transferencias_caja_origen ON transferencias_caja(caja_origen_id);
CREATE INDEX idx_transferencias_caja_destino ON transferencias_caja(caja_destino_id);
CREATE INDEX idx_transferencias_fecha ON transferencias_caja(fecha);
CREATE INDEX idx_transferencias_referencia ON transferencias_caja(referencia);

-- Agregar columna saldo_actual a la tabla cajas si no existe
ALTER TABLE cajas ADD COLUMN IF NOT EXISTS saldo_actual DECIMAL(10,2) DEFAULT 0.00;

-- Comentarios para documentación
COMMENT ON TABLE transferencias_caja IS 'Registro de transferencias de efectivo entre cajas';
COMMENT ON COLUMN transferencias_caja.monto IS 'Monto transferido en soles';
COMMENT ON COLUMN transferencias_caja.tipo IS 'Tipo de transferencia: operativa, reposicion, ajuste, emergencia';
COMMENT ON COLUMN transferencias_caja.referencia IS 'Código único de referencia de la transferencia';
COMMENT ON COLUMN transferencias_caja.estado IS 'Estado de la transferencia: completada, pendiente, cancelada';
