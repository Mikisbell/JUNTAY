export type Json =
  | string
  | number
  | boolean
  | null
  | { [key]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          ruc: string
          razon_social: string
          nombre_comercial: string | null
          direccion: string | null
          telefono: string | null
          email: string | null
          logo_url: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ruc: string
          razon_social: string
          nombre_comercial?: string | null
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          logo_url?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ruc?: string
          razon_social?: string
          nombre_comercial?: string | null
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          logo_url?: string | null
          activo?: boolean
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          empresa_id: string | null
          tipo_persona: string
          tipo_documento: string
          numero_documento: string
          nombres: string | null
          apellido_paterno: string | null
          apellido_materno: string | null
          fecha_nacimiento: string | null
          genero: string | null
          estado_civil: string | null
          razon_social: string | null
          representante_legal: string | null
          email: string | null
          telefono_principal: string | null
          telefono_secundario: string | null
          departamento: string | null
          provincia: string | null
          distrito: string | null
          direccion: string | null
          referencia: string | null
          ocupacion: string | null
          empresa_trabaja: string | null
          ingreso_mensual: number | null
          foto_url: string | null
          observaciones: string | null
          calificacion_crediticia: string | null
          activo: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          tipo_persona: string
          tipo_documento: string
          numero_documento: string
          nombres?: string | null
          apellido_paterno?: string | null
          apellido_materno?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          estado_civil?: string | null
          razon_social?: string | null
          representante_legal?: string | null
          email?: string | null
          telefono_principal?: string | null
          telefono_secundario?: string | null
          departamento?: string | null
          provincia?: string | null
          distrito?: string | null
          direccion?: string | null
          referencia?: string | null
          ocupacion?: string | null
          empresa_trabaja?: string | null
          ingreso_mensual?: number | null
          foto_url?: string | null
          observaciones?: string | null
          calificacion_crediticia?: string | null
          activo?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          tipo_persona?: string
          tipo_documento?: string
          numero_documento?: string
          nombres?: string | null
          apellido_paterno?: string | null
          apellido_materno?: string | null
          email?: string | null
          telefono_principal?: string | null
          direccion?: string | null
          activo?: boolean
          updated_at?: string
        }
      }
      creditos: {
        Row: {
          id: string
          codigo: string
          solicitud_id: string | null
          empresa_id: string | null
          cliente_id: string | null
          tipo_credito_id: string | null
          monto_prestado: number
          monto_interes: number
          monto_total: number
          monto_pagado: number
          monto_mora: number
          saldo_pendiente: number
          numero_cuotas: number
          cuotas_pagadas: number
          frecuencia_pago: string
          monto_cuota: number
          tasa_interes_mensual: number
          tasa_mora_diaria: number
          fecha_desembolso: string
          fecha_primer_vencimiento: string
          fecha_ultimo_vencimiento: string
          fecha_ultimo_pago: string | null
          estado: string
          dias_mora: number
          observaciones: string | null
          desembolsado_por: string | null
          created_at: string
          updated_at: string
        }
      }
      garantias: {
        Row: {
          id: string
          codigo: string
          credito_id: string | null
          categoria_id: string | null
          nombre: string
          descripcion: string
          marca: string | null
          modelo: string | null
          numero_serie: string | null
          valor_comercial: number
          valor_tasacion: number
          porcentaje_prestamo: number | null
          estado: string
          estado_conservacion: string | null
          fecha_registro: string
          fecha_recuperacion: string | null
          fecha_venta: string | null
          observaciones: string | null
          ubicacion_fisica: string | null
          tasado_por: string | null
          created_at: string
          updated_at: string
        }
      }
      cronograma_pagos: {
        Row: {
          id: string
          credito_id: string | null
          numero_cuota: number
          monto_cuota: number
          monto_capital: number
          monto_interes: number
          monto_mora: number
          monto_pagado: number
          saldo_pendiente: number
          fecha_vencimiento: string
          fecha_pago: string | null
          estado: string
          dias_mora: number
          created_at: string
        }
      }
      pagos: {
        Row: {
          id: string
          codigo: string
          credito_id: string | null
          cronograma_id: string | null
          caja_id: string | null
          tipo_pago: string
          metodo_pago: string
          monto_total: number
          monto_capital: number
          monto_interes: number
          monto_mora: number
          fecha_pago: string
          numero_operacion: string | null
          cuenta_bancaria_id: string | null
          observaciones: string | null
          registrado_por: string | null
          created_at: string
        }
      }
    }
    Views: {
      vista_creditos_activos: {
        Row: {
          id: string
          codigo: string
          monto_prestado: number
          saldo_pendiente: number
          estado: string
          fecha_desembolso: string
          dias_mora: number
          numero_documento: string
          nombres: string
          apellido_paterno: string
          apellido_materno: string
          telefono_principal: string
          tipo_credito: string
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
