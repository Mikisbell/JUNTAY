import { DashboardStatsAvanzadas } from "@/components/dashboard-stats-avanzadas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCreditos } from "@/lib/api/creditos"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const creditosRecientes = await getCreditos()
  const ultimosCreditos = creditosRecientes.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general del negocio</p>
      </div>
      
      {/* Dashboard Avanzado */}
      <DashboardStatsAvanzadas />
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Créditos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimosCreditos.length > 0 ? (
              <div className="space-y-4">
                {ultimosCreditos.map((credito) => {
                  const nombreCliente = credito.clientes?.tipo_persona === 'natural'
                    ? `${credito.clientes?.nombres} ${credito.clientes?.apellido_paterno}`
                    : credito.clientes?.razon_social
                  
                  return (
                    <Link key={credito.id} href={`/dashboard/creditos/${credito.id}`}>
                      <CreditoItem
                        codigo={credito.codigo || 'N/A'}
                        cliente={nombreCliente || 'Sin nombre'}
                        monto={`S/ ${credito.monto_prestado.toFixed(2)}`}
                        estado={credito.estado}
                        fecha={new Date(credito.fecha_desembolso).toLocaleDateString('es-PE')}
                      />
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No hay créditos registrados</p>
                <Link href="/dashboard/creditos/nueva-solicitud">
                  <button className="text-blue-600 text-sm mt-2 hover:underline">
                    Crear primer crédito
                  </button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Alertas</span>
              <Badge variant="destructive">3</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AlertItem
                tipo="mora"
                mensaje="3 créditos con más de 5 días de mora"
                urgencia="alta"
              />
              <AlertItem
                tipo="vencimiento"
                mensaje="8 cuotas vencen en los próximos 3 días"
                urgencia="media"
              />
              <AlertItem
                tipo="garantia"
                mensaje="2 garantías requieren revaluación"
                urgencia="baja"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction title="Nuevo Cliente" href="/dashboard/clientes/nuevo" />
            <QuickAction title="Nueva Solicitud" href="/dashboard/creditos/nueva-solicitud" />
            <QuickAction title="Nueva Garantía" href="/dashboard/garantias/nueva" />
            <QuickAction title="Ver Créditos" href="/dashboard/creditos" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


function CreditoItem({
  codigo,
  cliente,
  monto,
  estado,
  fecha
}: {
  codigo: string
  cliente: string
  monto: string
  estado: string
  fecha: string
}) {
  const estadoColor = estado === 'vigente' ? 'success' : 'destructive'
  const estadoText = estado === 'vigente' ? 'Vigente' : 'En Mora'
  
  return (
    <div className="flex items-center justify-between pb-4 border-b last:border-0">
      <div>
        <p className="font-medium">{codigo}</p>
        <p className="text-sm text-gray-600">{cliente}</p>
        <p className="text-xs text-gray-500">{fecha}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{monto}</p>
        <Badge variant={estadoColor as any} className="mt-1">
          {estadoText}
        </Badge>
      </div>
    </div>
  )
}

function AlertItem({
  tipo,
  mensaje,
  urgencia
}: {
  tipo: string
  mensaje: string
  urgencia: string
}) {
  const color = urgencia === 'alta' ? 'text-red-600' : urgencia === 'media' ? 'text-yellow-600' : 'text-blue-600'
  
  return (
    <div className="flex items-start space-x-3 pb-4 border-b last:border-0">
      <AlertCircle className={`h-5 w-5 mt-0.5 ${color}`} />
      <div className="flex-1">
        <p className="text-sm font-medium capitalize">{tipo}</p>
        <p className="text-sm text-gray-600">{mensaje}</p>
      </div>
    </div>
  )
}

function QuickAction({ 
  title, 
  href 
}: { 
  title: string
  href: string 
}) {
  return (
    <a 
      href={href}
      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
    >
      <p className="font-medium text-gray-700">{title}</p>
    </a>
  )
}
