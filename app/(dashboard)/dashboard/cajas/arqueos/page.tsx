import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, CheckCircle, AlertTriangle, DollarSign, Clock, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ArqueosPage() {
  // Simulamos datos de arqueos
  const arqueoActual = {
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '08:00:00',
    saldo_teorico: 13150.00,
    saldo_fisico: 0, // Se completará por el usuario
    diferencia: 0,
    estado: 'en_proceso'
  }

  const historialArqueos = [
    {
      fecha: '2024-11-13',
      hora: '16:30:00',
      saldo_teorico: 12450.00,
      saldo_fisico: 12450.00,
      diferencia: 0.00,
      estado: 'cuadrado',
      observaciones: 'Arqueo perfecto, sin diferencias'
    },
    {
      fecha: '2024-11-12',
      hora: '16:25:00',
      saldo_teorico: 11800.00,
      saldo_fisico: 11795.00,
      diferencia: -5.00,
      estado: 'diferencia_menor',
      observaciones: 'Faltante menor, posible error en vuelto'
    },
    {
      fecha: '2024-11-11',
      hora: '16:35:00',
      saldo_teorico: 13200.00,
      saldo_fisico: 13210.00,
      diferencia: 10.00,
      estado: 'diferencia_menor',
      observaciones: 'Sobrante menor, cliente no recibió vuelto completo'
    }
  ]

  const denominaciones = [
    { valor: 200, cantidad: 0, subtotal: 0 },
    { valor: 100, cantidad: 0, subtotal: 0 },
    { valor: 50, cantidad: 0, subtotal: 0 },
    { valor: 20, cantidad: 0, subtotal: 0 },
    { valor: 10, cantidad: 0, subtotal: 0 },
    { valor: 5, cantidad: 0, subtotal: 0 },
    { valor: 2, cantidad: 0, subtotal: 0 },
    { valor: 1, cantidad: 0, subtotal: 0 },
    { valor: 0.50, cantidad: 0, subtotal: 0 },
    { valor: 0.20, cantidad: 0, subtotal: 0 },
    { valor: 0.10, cantidad: 0, subtotal: 0 },
    { valor: 0.05, cantidad: 0, subtotal: 0 }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Calculator className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Arqueos de Caja</h1>
            <p className="text-gray-600">Control y verificación de efectivo físico</p>
          </div>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Calculator className="h-4 w-4 mr-2" />
          Nuevo Arqueo
        </Button>
      </div>

      {/* Arqueo Actual */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calculator className="h-5 w-5" />
            Arqueo en Proceso - {arqueoActual.fecha}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estado del Arqueo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Saldo Teórico</p>
              <p className="text-2xl font-bold text-green-800">
                S/ {arqueoActual.saldo_teorico.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">Según sistema</p>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Saldo Físico</p>
              <p className="text-2xl font-bold text-blue-800">S/ 0.00</p>
              <p className="text-xs text-gray-500">Por contar</p>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Diferencia</p>
              <p className="text-2xl font-bold text-purple-800">S/ 0.00</p>
              <p className="text-xs text-gray-500">Pendiente</p>
            </div>
          </div>

          {/* Conteo de Denominaciones */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Conteo por Denominaciones</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {denominaciones.map((denom) => (
                <div key={denom.valor} className="bg-white p-4 rounded-lg border">
                  <div className="text-center mb-2">
                    <p className="font-semibold text-gray-800">
                      S/ {denom.valor >= 1 ? denom.valor.toFixed(0) : denom.valor.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {denom.valor >= 5 ? 'Billete' : 'Moneda'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                    />
                    <p className="text-xs text-center text-gray-600">
                      = S/ {denom.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del Conteo */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">Total Billetes</p>
                <p className="text-xl font-bold text-blue-800">S/ 0.00</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">Total Monedas</p>
                <p className="text-xl font-bold text-blue-800">S/ 0.00</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">Total Físico</p>
                <p className="text-xl font-bold text-blue-800">S/ 0.00</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">Estado</p>
                <Badge variant="outline">En Proceso</Badge>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Arqueo
            </label>
            <textarea
              placeholder="Registra cualquier observación sobre el conteo de efectivo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-between">
            <Button variant="outline">
              Cancelar Arqueo
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">
                Guardar Borrador
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Completar Arqueo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Arqueos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Arqueos Cuadrados</p>
                <p className="text-2xl font-bold text-green-800">
                  {historialArqueos.filter(a => a.estado === 'cuadrado').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Con Diferencias</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {historialArqueos.filter(a => a.estado === 'diferencia_menor').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Promedio Diferencia</p>
                <p className="text-2xl font-bold text-blue-800">S/ 1.67</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Efectividad</p>
                <p className="text-2xl font-bold text-purple-800">96.7%</p>
              </div>
              <div className="p-2 bg-purple-200 rounded-lg">
                📊
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Arqueos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Arqueos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historialArqueos.map((arqueo, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    arqueo.estado === 'cuadrado' ? 'bg-green-100 text-green-600' :
                    arqueo.estado === 'diferencia_menor' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {arqueo.estado === 'cuadrado' ? <CheckCircle className="h-5 w-5" /> :
                     <AlertTriangle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        Arqueo del {arqueo.fecha}
                      </h4>
                      <Badge variant={
                        arqueo.estado === 'cuadrado' ? 'default' :
                        arqueo.estado === 'diferencia_menor' ? 'secondary' : 'destructive'
                      }>
                        {arqueo.estado === 'cuadrado' ? 'CUADRADO' :
                         arqueo.estado === 'diferencia_menor' ? 'DIFERENCIA MENOR' : 'DIFERENCIA MAYOR'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{arqueo.observaciones}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>🕐 {arqueo.hora}</span>
                      <span>💰 Teórico: S/ {arqueo.saldo_teorico.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                      <span>📊 Físico: S/ {arqueo.saldo_fisico.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    arqueo.diferencia === 0 ? 'text-green-600' :
                    Math.abs(arqueo.diferencia) <= 10 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {arqueo.diferencia > 0 ? '+' : ''}
                    S/ {arqueo.diferencia.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">Diferencia</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consejos para Arqueos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">💡 Consejos para Arqueos Exitosos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Antes del Conteo:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Organiza billetes por denominación</li>
                <li>• Separa monedas en grupos</li>
                <li>• Asegúrate de tener buena iluminación</li>
                <li>• Evita distracciones durante el conteo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Durante el Conteo:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Cuenta dos veces cada denominación</li>
                <li>• Registra inmediatamente cada cantidad</li>
                <li>• Verifica el total antes de confirmar</li>
                <li>• Documenta cualquier billete dañado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
