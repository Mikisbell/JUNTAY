import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCajas, getCajaGeneral } from '@/lib/api/cajas'
import { CheckCircle, DollarSign, AlertCircle, Clock, User, Calculator } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AbrirTurnoPage() {
  const cajas = await getCajas()
  const cajaGeneral = await getCajaGeneral()

  // Simulamos que el usuario actual es Juan Pérez
  const usuarioActual = {
    nombre: 'Juan Pérez',
    codigo: 'JP001',
    turno: 'Mañana (08:00 - 16:00)'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-xl">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Abrir Turno de Trabajo</h1>
          <p className="text-gray-600">Proceso de apertura y asignación de efectivo</p>
        </div>
      </div>

      {/* Información del Usuario */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <User className="h-5 w-5" />
            Información del Cajero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Cajero</p>
              <p className="text-lg font-bold text-blue-800">{usuarioActual.nombre}</p>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Código</p>
              <p className="text-lg font-bold text-blue-800">{usuarioActual.codigo}</p>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Turno</p>
              <p className="text-lg font-bold text-blue-800">{usuarioActual.turno}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Bóveda Central */}
      {cajaGeneral && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Estado de Bóveda Central
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Efectivo Disponible</p>
                    <p className="text-2xl font-bold text-green-800">
                      S/ {cajaGeneral.saldo_disponible.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Límite por Asignación</p>
                    <p className="text-2xl font-bold text-blue-800">
                      S/ {cajaGeneral.limite_asignacion_individual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selección de Caja */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Caja para Apertura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cajas.map((caja) => (
              <Card key={caja.id} className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-gray-600" />
                    </div>
                    <Badge variant="secondary">
                      Cerrada
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{caja.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-1">Código: {caja.codigo}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Ubicación: {caja.ubicacion || 'No especificada'}
                  </p>
                  
                  <Button className="w-full" variant="outline">
                    Seleccionar Caja
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Apertura */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calculator className="h-5 w-5" />
            Configuración de Apertura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Monto Solicitado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto de Efectivo Solicitado
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="15000.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  step="0.01"
                  min="0"
                  max={cajaGeneral?.limite_asignacion_individual || 50000}
                />
              </div>
              <Button variant="outline">
                Monto Sugerido
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Máximo permitido: S/ {cajaGeneral?.limite_asignacion_individual.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '50,000.00'}
            </p>
          </div>

          {/* Desglose de Billetes */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Desglose de Billetes Solicitado</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { denominacion: 'S/ 200', cantidad: 0 },
                { denominacion: 'S/ 100', cantidad: 0 },
                { denominacion: 'S/ 50', cantidad: 0 },
                { denominacion: 'S/ 20', cantidad: 0 },
                { denominacion: 'S/ 10', cantidad: 0 },
                { denominacion: 'S/ 5', cantidad: 0 },
                { denominacion: 'S/ 2', cantidad: 0 },
                { denominacion: 'S/ 1', cantidad: 0 }
              ].map((billete) => (
                <div key={billete.denominacion} className="bg-gray-50 p-3 rounded-lg">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {billete.denominacion}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones (Opcional)
            </label>
            <textarea
              placeholder="Notas adicionales sobre la apertura del turno..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>

          {/* Validaciones */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Verificaciones Requeridas</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-yellow-700">
                      Confirmo que el monto solicitado es correcto
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-yellow-700">
                      He verificado el desglose de billetes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-yellow-700">
                      Entiendo mi responsabilidad sobre el efectivo asignado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex justify-between">
        <Button variant="outline">
          Cancelar
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">
            Guardar Borrador
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Abrir Turno y Solicitar Efectivo
          </Button>
        </div>
      </div>
    </div>
  )
}
