import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, TrendingDown, Filter, Download, Search, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function HistorialCajaPage() {
  // Simulamos movimientos del día
  const movimientosHoy = [
    {
      id: '1',
      hora: '08:00:15',
      tipo: 'apertura_turno',
      concepto: 'Apertura de turno',
      descripcion: 'Asignación inicial de efectivo',
      monto: 15000.00,
      saldo_anterior: 0.00,
      saldo_nuevo: 15000.00,
      referencia: 'APT-001',
      usuario: 'Juan Pérez'
    },
    {
      id: '2',
      hora: '08:45:22',
      tipo: 'prestamo_otorgado',
      concepto: 'Préstamo prendario',
      descripcion: 'Préstamo sobre anillo de oro - Cliente: María García',
      monto: -800.00,
      saldo_anterior: 15000.00,
      saldo_nuevo: 14200.00,
      referencia: 'PRES-2024-001',
      usuario: 'Juan Pérez'
    },
    {
      id: '3',
      hora: '09:15:33',
      tipo: 'pago_interes',
      concepto: 'Pago de interés',
      descripcion: 'Interés mensual - Contrato PRES-2024-001',
      monto: 80.00,
      saldo_anterior: 14200.00,
      saldo_nuevo: 14280.00,
      referencia: 'INT-001',
      usuario: 'Juan Pérez'
    },
    {
      id: '4',
      hora: '10:30:45',
      tipo: 'prestamo_otorgado',
      concepto: 'Préstamo prendario',
      descripcion: 'Préstamo sobre cadena de plata - Cliente: Carlos López',
      monto: -1200.00,
      saldo_anterior: 14280.00,
      saldo_nuevo: 13080.00,
      referencia: 'PRES-2024-002',
      usuario: 'Juan Pérez'
    },
    {
      id: '5',
      hora: '11:00:12',
      tipo: 'desempeno_total',
      concepto: 'Desempeño total',
      descripcion: 'Recuperación de prenda - Cliente: Ana Rodríguez',
      monto: 950.00,
      saldo_anterior: 13080.00,
      saldo_nuevo: 14030.00,
      referencia: 'DESP-001',
      usuario: 'Juan Pérez'
    },
    {
      id: '6',
      hora: '11:45:28',
      tipo: 'venta_remate',
      concepto: 'Venta de remate',
      descripcion: 'Venta de reloj rematado - Comprador: Luis Mendoza',
      monto: 1500.00,
      saldo_anterior: 14030.00,
      saldo_nuevo: 15530.00,
      referencia: 'VR-001',
      usuario: 'Juan Pérez'
    },
    {
      id: '7',
      hora: '12:30:15',
      tipo: 'pago_interes',
      concepto: 'Pago de interés',
      descripcion: 'Interés mensual - Contrato PRES-2023-045',
      monto: 120.00,
      saldo_anterior: 15530.00,
      saldo_nuevo: 15650.00,
      referencia: 'INT-002',
      usuario: 'Juan Pérez'
    },
    {
      id: '8',
      hora: '14:15:42',
      tipo: 'prestamo_otorgado',
      concepto: 'Préstamo prendario',
      descripcion: 'Préstamo sobre laptop - Cliente: Pedro Sánchez',
      monto: -2500.00,
      saldo_anterior: 15650.00,
      saldo_nuevo: 13150.00,
      referencia: 'PRES-2024-003',
      usuario: 'Juan Pérez'
    }
  ]

  const totalIngresos = movimientosHoy.filter(mov => mov.monto > 0).reduce((sum, mov) => sum + mov.monto, 0)
  const totalEgresos = Math.abs(movimientosHoy.filter(mov => mov.monto < 0).reduce((sum, mov) => sum + mov.monto, 0))
  const saldoActual = movimientosHoy[movimientosHoy.length - 1]?.saldo_nuevo || 0

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'prestamo_otorgado': return 'destructive'
      case 'pago_interes': return 'default'
      case 'desempeno_total': return 'secondary'
      case 'venta_remate': return 'default'
      case 'apertura_turno': return 'outline'
      default: return 'outline'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'prestamo_otorgado': return '💰'
      case 'pago_interes': return '📈'
      case 'desempeno_total': return '🔄'
      case 'venta_remate': return '🏷️'
      case 'apertura_turno': return '🔓'
      default: return '📄'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historial de Movimientos</h1>
            <p className="text-gray-600">Registro completo de operaciones del turno actual</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Resumen del Día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Saldo Actual</p>
                <p className="text-2xl font-bold text-blue-800">
                  S/ {saldoActual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-800">
                  S/ {totalIngresos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Egresos</p>
                <p className="text-2xl font-bold text-red-800">
                  S/ {totalEgresos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Operaciones</p>
                <p className="text-2xl font-bold text-purple-800">{movimientosHoy.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Todos ({movimientosHoy.length})</Button>
            <Button variant="outline" size="sm">
              Préstamos ({movimientosHoy.filter(mov => mov.tipo === 'prestamo_otorgado').length})
            </Button>
            <Button variant="outline" size="sm">
              Intereses ({movimientosHoy.filter(mov => mov.tipo === 'pago_interes').length})
            </Button>
            <Button variant="outline" size="sm">
              Desempeños ({movimientosHoy.filter(mov => mov.tipo === 'desempeno_total').length})
            </Button>
            <Button variant="outline" size="sm">
              Ventas ({movimientosHoy.filter(mov => mov.tipo === 'venta_remate').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Movimientos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Movimientos del Turno Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movimientosHoy.map((movimiento) => (
              <div key={movimiento.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full text-2xl ${
                    movimiento.monto > 0 ? 'bg-green-100' : 
                    movimiento.monto < 0 ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {getTipoIcon(movimiento.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{movimiento.concepto}</h4>
                      <Badge variant={getTipoColor(movimiento.tipo)}>
                        {movimiento.tipo.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{movimiento.descripcion}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>🕐 {movimiento.hora}</span>
                      <span>📄 {movimiento.referencia}</span>
                      <span>👤 {movimiento.usuario}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    movimiento.monto > 0 ? 'text-green-600' : 
                    movimiento.monto < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {movimiento.monto > 0 ? '+' : ''}
                    S/ {Math.abs(movimiento.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Saldo: S/ {movimiento.saldo_nuevo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-400">
                    Anterior: S/ {movimiento.saldo_anterior.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen por Tipo de Operación */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Tipo de Operación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { tipo: 'prestamo_otorgado', nombre: 'Préstamos', color: 'red', icono: '💰' },
              { tipo: 'pago_interes', nombre: 'Intereses', color: 'green', icono: '📈' },
              { tipo: 'desempeno_total', nombre: 'Desempeños', color: 'blue', icono: '🔄' },
              { tipo: 'venta_remate', nombre: 'Ventas', color: 'purple', icono: '🏷️' }
            ].map((categoria) => {
              const operaciones = movimientosHoy.filter(mov => mov.tipo === categoria.tipo)
              const total = operaciones.reduce((sum, mov) => sum + Math.abs(mov.monto), 0)
              
              return (
                <div key={categoria.tipo} className={`p-4 rounded-lg border-2 border-${categoria.color}-200 bg-${categoria.color}-50`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{categoria.icono}</span>
                    <div>
                      <p className={`font-semibold text-${categoria.color}-800`}>{categoria.nombre}</p>
                      <p className={`text-sm text-${categoria.color}-600`}>{operaciones.length} operaciones</p>
                    </div>
                  </div>
                  <p className={`text-xl font-bold text-${categoria.color}-800`}>
                    S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
