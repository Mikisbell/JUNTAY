import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCajas, getSaldoActualCaja } from '@/lib/api/cajas'
import { DollarSign, Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MiCajaPage() {
  const cajas = await getCajas()
  
  // Simulamos que el usuario actual tiene asignada la primera caja
  // En producción esto vendría del contexto del usuario autenticado
  const miCaja = cajas[0]
  
  if (!miCaja) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin Caja Asignada</h2>
          <p className="text-gray-600">No tienes una caja asignada. Contacta al supervisor.</p>
        </div>
      </div>
    )
  }

  const saldoCaja = await getSaldoActualCaja(miCaja.id!)
  const estaAbierta = saldoCaja.tiene_sesion_abierta

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${estaAbierta ? 'bg-green-100' : 'bg-gray-100'}`}>
            <DollarSign className={`h-8 w-8 ${estaAbierta ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mi Caja - {miCaja.nombre}</h1>
            <p className="text-gray-600">Estado actual de tu turno operativo</p>
          </div>
        </div>
        <Badge variant={estaAbierta ? 'default' : 'secondary'} className="text-sm">
          {estaAbierta ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              Turno Abierto
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-1" />
              Turno Cerrado
            </>
          )}
        </Badge>
      </div>

      {/* Estado de la Caja */}
      <Card className={`border ${
        estaAbierta 
          ? 'border-green-100 bg-white' 
          : 'border-gray-200 bg-white'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            estaAbierta ? 'text-green-800' : 'text-gray-800'
          }`}>
            <DollarSign className="h-5 w-5" />
            {miCaja.codigo} - {miCaja.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Saldo Actual */}
            <div className="bg-white/80 p-6 rounded-xl border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">💰 Saldo Actual</h3>
                <div className={`w-3 h-3 rounded-full ${
                  estaAbierta ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <p className={`text-2xl md:text-3xl font-bold mb-1 ${
                estaAbierta ? 'text-green-700' : 'text-gray-600'
              }`}>
                S/ {saldoCaja.saldo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">Efectivo en caja</p>
            </div>

            {/* Ingresos del Día */}
            <div className="bg-white/80 p-6 rounded-xl border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">📈 Ingresos</h3>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-700 mb-1">
                S/ {(saldoCaja.total_ingresos || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">Hoy</p>
            </div>

            {/* Egresos del Día */}
            <div className="bg-white/80 p-6 rounded-xl border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">📉 Egresos</h3>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-red-700 mb-1">
                S/ {(saldoCaja.total_egresos || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">Hoy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Control de Turno */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Control de Turno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!estaAbierta ? (
              <Link href={`/dashboard/caja/${miCaja.id}/abrir`}>
                <Button className="w-full h-12 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Abrir Mi Turno
                </Button>
              </Link>
            ) : (
              <div className="space-y-3">
                <Link href={`/dashboard/caja/${miCaja.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver Movimientos del Día
                  </Button>
                </Link>
                <Link href={`/dashboard/caja/${miCaja.id}/cerrar`}>
                  <Button variant="destructive" className="w-full">
                    <Lock className="h-5 w-5 mr-2" />
                    Cerrar Mi Turno
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Operaciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Operaciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {estaAbierta ? (
              <>
                <Link href="/dashboard/operaciones/nuevo-prestamo">
                  <Button variant="outline" className="w-full justify-start">
                    Nuevo Préstamo
                  </Button>
                </Link>
                <Link href="/dashboard/operaciones/pagar-interes">
                  <Button variant="outline" className="w-full justify-start">
                    Pagar Interés
                  </Button>
                </Link>
                <Link href="/dashboard/operaciones/desempenar">
                  <Button variant="outline" className="w-full justify-start">
                    Desempeñar Prenda
                  </Button>
                </Link>
                <Link href="/dashboard/operaciones/consultas">
                  <Button variant="outline" className="w-full justify-start">
                    Consultar Contrato
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-6">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Abre tu turno para realizar operaciones
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información de la Caja */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de la Caja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Código</p>
              <p className="text-lg font-bold text-gray-900">{miCaja.codigo}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Ubicación</p>
              <p className="text-lg font-bold text-gray-900">{miCaja.ubicacion || 'No especificada'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Estado</p>
              <Badge variant={miCaja.activa ? 'default' : 'secondary'}>
                {miCaja.activa ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
