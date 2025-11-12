import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Calendar, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCreditoById } from '@/lib/api/creditos'
import { GenerarContratoButton, DescargarContratoButton } from '@/components/generar-contrato-button'

export const dynamic = 'force-dynamic'

export default async function CreditoDetallePage({ params }: { params: { id: string } }) {
  const credito = await getCreditoById(params.id)

  if (!credito || !credito.id) {
    notFound()
  }

  const nombreCliente = credito.clientes?.tipo_persona === 'natural'
    ? `${credito.clientes?.nombres} ${credito.clientes?.apellido_paterno}`
    : credito.clientes?.razon_social

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/creditos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{credito.codigo}</h1>
            <p className="text-gray-600">{nombreCliente}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <GenerarContratoButton 
            creditoId={credito.id!} 
            creditoCodigo={credito.codigo}
            variant="outline"
            size="sm"
          />
          <DescargarContratoButton 
            creditoId={credito.id!} 
            creditoCodigo={credito.codigo}
            variant="ghost"
            size="sm"
          />
          <Badge 
            variant={
              credito.estado === 'vigente' ? 'default' : 
              credito.estado === 'en_mora' ? 'destructive' : 
              credito.estado === 'pagado' ? 'secondary' :
              'outline'
            }
            className="text-lg px-4 py-2"
          >
            {credito.estado.toUpperCase().replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Stats del Crédito */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monto Prestado</p>
                <p className="text-2xl font-bold">S/ {credito.monto_prestado.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total a Pagar</p>
                <p className="text-2xl font-bold">S/ {credito.monto_total.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Pendiente</p>
                <p className="text-2xl font-bold text-orange-600">
                  S/ {credito.saldo_pendiente.toFixed(2)}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cuotas Pagadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {credito.cuotas_pagadas || 0} / {credito.numero_cuotas}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Crédito */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalles */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Crédito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Monto Cuota</p>
                  <p className="font-medium text-lg">S/ {credito.monto_cuota.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Frecuencia</p>
                  <p className="font-medium capitalize">{credito.frecuencia_pago}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tasa Mensual</p>
                  <p className="font-medium">{credito.tasa_interes_mensual}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha Desembolso</p>
                  <p className="font-medium">
                    {new Date(credito.fecha_desembolso).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Primer Vencimiento</p>
                  <p className="font-medium">
                    {new Date(credito.fecha_primer_vencimiento).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Último Vencimiento</p>
                  <p className="font-medium">
                    {new Date(credito.fecha_ultimo_vencimiento).toLocaleDateString('es-PE')}
                  </p>
                </div>
              </div>

              {credito.dias_mora && credito.dias_mora > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 font-medium">
                    ⚠️ Días en mora: {credito.dias_mora} días
                  </p>
                  {credito.monto_mora && credito.monto_mora > 0 && (
                    <p className="text-sm text-red-600">
                      Monto mora: S/ {credito.monto_mora.toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              {credito.observaciones && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Observaciones</p>
                  <p className="text-gray-700">{credito.observaciones}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cronograma de Pagos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cronograma de Pagos</CardTitle>
              <Link href={`/dashboard/creditos/${params.id}/registrar-pago`}>
                <Button size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Registrar Pago
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {credito.cronograma_pagos && credito.cronograma_pagos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">#</th>
                        <th className="text-left p-3 font-medium text-gray-700">Vencimiento</th>
                        <th className="text-right p-3 font-medium text-gray-700">Capital</th>
                        <th className="text-right p-3 font-medium text-gray-700">Interés</th>
                        <th className="text-right p-3 font-medium text-gray-700">Total</th>
                        <th className="text-right p-3 font-medium text-gray-700">Pagado</th>
                        <th className="text-center p-3 font-medium text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {credito.cronograma_pagos.sort((a, b) => a.numero_cuota - b.numero_cuota).map((cuota) => (
                        <tr key={cuota.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{cuota.numero_cuota}</td>
                          <td className="p-3">
                            {new Date(cuota.fecha_vencimiento).toLocaleDateString('es-PE')}
                          </td>
                          <td className="p-3 text-right">
                            S/ {cuota.monto_capital.toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            S/ {cuota.monto_interes.toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-medium">
                            S/ {cuota.monto_total.toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            S/ {(cuota.monto_pagado || 0).toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <Badge 
                              variant={
                                cuota.estado === 'pagado' ? 'secondary' : 
                                cuota.estado === 'vencido' ? 'destructive' :
                                cuota.estado === 'parcial' ? 'outline' :
                                'default'
                              }
                              className="text-xs"
                            >
                              {cuota.estado}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold">
                      <tr>
                        <td colSpan={2} className="p-3">TOTALES</td>
                        <td className="p-3 text-right">
                          S/ {credito.monto_prestado.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          S/ {credito.monto_interes.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          S/ {credito.monto_total.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          S/ {(credito.monto_pagado || 0).toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No hay cronograma disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{nombreCliente}</p>
              <p className="text-sm text-gray-600">{credito.clientes?.numero_documento}</p>
              {credito.clientes?.telefono_secundario && (
                <p className="text-sm text-gray-600">
                  📱 {credito.clientes.telefono_secundario}
                </p>
              )}
              {credito.clientes?.email && (
                <p className="text-sm text-gray-600">
                  ✉️ {credito.clientes.email}
                </p>
              )}
              <Link href={`/dashboard/clientes/${credito.cliente_id}`}>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Ver Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Garantías */}
          {credito.garantias && credito.garantias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Garantías</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {credito.garantias.map((garantia: any) => (
                  <div key={garantia.id} className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm">{garantia.nombre}</p>
                    <p className="text-xs text-gray-600">
                      Valor: S/ {garantia.valor_tasacion.toFixed(2)}
                    </p>
                    <Link href={`/dashboard/garantias/${garantia.id}`}>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        Ver detalle
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/dashboard/creditos/${params.id}/registrar-pago`}>
                <Button className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Registrar Pago
                </Button>
              </Link>
              <Button variant="outline" className="w-full" disabled>
                Generar Contrato
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Imprimir Cronograma
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
