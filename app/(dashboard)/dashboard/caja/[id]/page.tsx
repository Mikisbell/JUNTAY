import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCajaById, getSesionActual, getMovimientosSesion } from '@/lib/api/cajas'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, ArrowRightLeft, PlusCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CajaDetallePage({ params }: { params: { id: string } }) {
  const caja = await getCajaById(params.id)
  
  if (!caja) {
    redirect('/dashboard/caja')
  }

  // Obtener sesión con múltiples intentos para datos más frescos
  const supabase = createClient()
  
  // Primer intento: buscar sesión abierta
  let { data: sesion, error: sesionError } = await supabase
    .from('sesiones_caja')
    .select('*')
    .eq('caja_id', params.id)
    .eq('estado', 'abierta')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  // Si no encuentra sesión abierta, buscar la más reciente
  if (sesionError || !sesion) {
    console.log('❌ No se encontró sesión abierta, buscando más reciente...', sesionError)
    
    const { data: sesionReciente } = await supabase
      .from('sesiones_caja')
      .select('*')
      .eq('caja_id', params.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (sesionReciente) {
      console.log('📋 Sesión más reciente encontrada:', sesionReciente)
      sesion = sesionReciente
    }
  }
  
  console.log('🔄 Sesión final obtenida:', sesion)
  
  const movimientos = sesion ? await getMovimientosSesion(sesion.id!) : []

  // Determinar estado real (basado en sesión Y tabla cajas)
  const estaAbierta = (sesion !== null && sesion.estado === 'abierta') || caja.estado === 'abierta'
  
  // Usar saldo actual de la tabla cajas (actualizado por transferencias)
  const saldoActual = caja.saldo_actual || (sesion 
    ? (sesion.monto_inicial || 0) + (sesion.total_ingresos || 0) - (sesion.total_egresos || 0)
    : 0)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/caja">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{caja.nombre}</h1>
              <Badge
                variant={
                  estaAbierta
                    ? 'default'
                    : 'secondary'
                }
              >
                {estaAbierta ? '🟢 Abierta' : '🔴 Cerrada'}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">
              {caja.codigo} {caja.ubicacion && `• ${caja.ubicacion}`}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!estaAbierta ? (
            <Link href={`/dashboard/caja/${params.id}/abrir`}>
              <Button>
                <DollarSign className="h-4 w-4 mr-2" />
                Abrir Caja
              </Button>
            </Link>
          ) : (
            <>
              <Link href={`/dashboard/caja/${params.id}/transferir`}>
                <Button variant="outline" size="sm">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Transferir
                </Button>
              </Link>
              <Link href={`/dashboard/caja/${params.id}/reposicion`}>
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Reponer
                </Button>
              </Link>
              <Link href={`/dashboard/caja/${params.id}/cerrar`}>
                <Button variant="destructive" size="sm">
                  Cerrar Caja
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Estado de la Caja */}
      {(sesion || estaAbierta) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-700 font-medium mb-2">Monto Inicial</p>
              <p className="text-2xl font-bold text-blue-800">
                S/ {sesion ? sesion.monto_inicial.toFixed(2) : '200.00'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <p className="text-sm text-green-700 font-medium mb-2 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Ingresos
              </p>
              <p className="text-2xl font-bold text-green-800">
                S/ {(sesion?.total_ingresos || 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-sm text-red-700 font-medium mb-2 flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Egresos
              </p>
              <p className="text-2xl font-bold text-red-800">
                S/ {(sesion?.total_egresos || 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <p className="text-sm text-purple-700 font-medium mb-2">Saldo Actual</p>
              <p className="text-2xl font-bold text-purple-800">
                S/ {saldoActual.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información de Sesión */}
      {sesion && (
        <Card>
          <CardHeader>
            <CardTitle>Información de la Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Número de Sesión</p>
                <p className="font-semibold">#{sesion.numero_sesion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Apertura</p>
                <p className="font-semibold">
                  {new Date(sesion.fecha_apertura).toLocaleString('es-PE')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Movimientos</p>
                <p className="font-semibold">{sesion.total_movimientos || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <Badge>{sesion.estado}</Badge>
              </div>
            </div>
            {sesion.observaciones_apertura && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Observaciones de Apertura</p>
                <p className="text-sm mt-1">{sesion.observaciones_apertura}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Movimientos */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos de la Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          {movimientos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">Fecha/Hora</th>
                    <th className="text-left p-3 font-medium text-gray-700">Tipo</th>
                    <th className="text-left p-3 font-medium text-gray-700">Concepto</th>
                    <th className="text-left p-3 font-medium text-gray-700">Descripción</th>
                    <th className="text-right p-3 font-medium text-gray-700">Monto</th>
                    <th className="text-right p-3 font-medium text-gray-700">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((mov) => (
                    <tr key={mov.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(mov.fecha).toLocaleString('es-PE', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            mov.tipo === 'ingreso'
                              ? 'default'
                              : mov.tipo === 'egreso'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {mov.tipo === 'ingreso' ? '↑' : mov.tipo === 'egreso' ? '↓' : '•'}{' '}
                          {mov.tipo}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-xs">{mov.concepto}</td>
                      <td className="p-3 text-gray-600">
                        {mov.descripcion || '-'}
                        {mov.referencia_codigo && (
                          <span className="block text-xs text-blue-600">
                            Ref: {mov.referencia_codigo}
                          </span>
                        )}
                      </td>
                      <td
                        className={`p-3 text-right font-semibold ${
                          mov.tipo === 'ingreso'
                            ? 'text-green-600'
                            : mov.tipo === 'egreso'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {mov.tipo === 'ingreso' ? '+' : mov.tipo === 'egreso' ? '-' : ''}S/{' '}
                        {mov.monto.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono text-sm">
                        S/ {mov.saldo_nuevo.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay movimientos registrados</p>
              {!estaAbierta && (
                <Link href={`/dashboard/caja/${params.id}/abrir`}>
                  <Button variant="outline" className="mt-4">
                    Abrir Caja
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensaje si está cerrada */}
      {!sesion && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-blue-800 mb-4">
                Esta caja está cerrada. Ábrela para comenzar a registrar movimientos.
              </p>
              <Link href={`/dashboard/caja/${params.id}/abrir`}>
                <Button>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Abrir Caja
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
