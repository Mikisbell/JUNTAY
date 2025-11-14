import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, DollarSign, User, Gem, FileText, AlertCircle, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NuevoPrestamoPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-xl">
          <DollarSign className="h-7 w-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Nuevo Préstamo Prendario</h1>
          <p className="text-sm text-gray-600">Proceso guiado para otorgar crédito con garantía</p>
        </div>
      </div>

      {/* Wizard de Proceso */}
      <Card className="border border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Building2 className="h-5 w-5" />
            Proceso de Evaluación y Préstamo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Paso 1: Cliente */}
            <div className="text-center p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="p-3 bg-blue-100 rounded-full mx-auto mb-3 w-fit">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-800 mb-2">1. Cliente</h3>
              <p className="text-sm text-blue-600 mb-3">Identificar y registrar</p>
              <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                Buscar / Nuevo
              </Button>
            </div>

            {/* Paso 2: Prenda */}
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="p-3 bg-gray-100 rounded-full mx-auto mb-3 w-fit">
                <Gem className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-400 mb-2">2. Prenda</h3>
              <p className="text-sm text-gray-400 mb-3">Evaluar y tasar</p>
              <Button variant="outline" disabled className="w-full">
                Pendiente
              </Button>
            </div>

            {/* Paso 3: Préstamo */}
            <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="p-3 bg-gray-100 rounded-full mx-auto mb-3 w-fit">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-400 mb-2">3. Préstamo</h3>
              <p className="text-sm text-gray-400 mb-3">Calcular monto</p>
              <Button variant="outline" disabled className="w-full">
                Pendiente
              </Button>
            </div>

            {/* Paso 4: Contrato */}
            <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="p-3 bg-gray-100 rounded-full mx-auto mb-3 w-fit">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-400 mb-2">4. Contrato</h3>
              <p className="text-sm text-gray-400 mb-3">Firmar y entregar</p>
              <Button variant="outline" disabled className="w-full">
                Pendiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Búsqueda de Cliente */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xs font-semibold tracking-wide text-gray-700 uppercase">Paso 1 · Cliente</h2>
          <p className="text-xs text-gray-500">Primero identifica o registra al cliente antes de continuar con la prenda y el préstamo.</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-6 xl:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Buscar Cliente Existente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de DNI
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="12345678"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={8}
                      />
                      <Button>Buscar</Button>
                    </div>
                  </div>
                  
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Ingresa el DNI para buscar el cliente
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Cliente Nuevo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm mb-4">
                    Si el cliente no existe en el sistema, puedes registrarlo durante el proceso.
                  </p>
                  
                  <Button className="w-full" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Registrar Cliente Nuevo
                  </Button>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Documentos Requeridos</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• DNI original y vigente</li>
                          <li>• Comprobante de domicilio</li>
                          <li>• Prenda a empeñar</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border border-green-100 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm text-gray-900">
                <span>Resumen del préstamo</span>
                <Badge variant="outline" className="text-[11px] text-green-700 border-green-200">
                  Simulación
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-gray-700">
              <div>
                <p className="font-semibold text-gray-900">Lo esencial</p>
                <ul className="mt-1 space-y-1">
                  <li>• Monto a entregar hoy: <span className="font-semibold">S/ 0.00</span></li>
                  <li>• Monto estimado a pagar: <span className="font-semibold">S/ 0.00</span></li>
                  <li>• Vence el: <span className="font-semibold">--/--/----</span></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Si no paga a tiempo</p>
                <p className="mt-1 text-gray-600">
                  La prenda entra a periodo de gracia y luego a proceso de remate según las reglas configuradas.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Cómo recupera su prenda</p>
                <p className="mt-1 text-gray-600">
                  Pagando el total antes del vencimiento o según las políticas de renovación visibles en el contrato.
                </p>
              </div>
              <p className="text-[11px] text-gray-500">
                Este resumen es informativo. Los valores finales se confirman en el paso de condiciones y contrato.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Información Importante */}
      <Card className="border border-yellow-100 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 text-sm">
            <AlertCircle className="h-5 w-5" />
            Información Importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Tasas Vigentes</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Tasa mensual: 10%</li>
                <li>• Plazo mínimo: 30 días</li>
                <li>• Plazo máximo: 120 días</li>
                <li>• Renovación automática disponible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Límites de Préstamo</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Mínimo: S/ 50.00</li>
                <li>• Máximo: S/ 50,000.00</li>
                <li>• Basado en valuación de prenda</li>
                <li>• Hasta 80% del valor tasado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex justify-between">
        <Button variant="outline">
          Cancelar
        </Button>
        <Button disabled>
          Continuar con Evaluación
          <span className="text-xs ml-2">(Selecciona cliente primero)</span>
        </Button>
      </div>
    </div>
  )
}
