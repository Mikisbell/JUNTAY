import { 
  CreditCard, 
  Users, 
  Package, 
  TrendingUp,
  DollarSign,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general del negocio</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Créditos Activos"
          value="45"
          icon={<CreditCard className="h-8 w-8 text-blue-600" />}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Total Prestado"
          value="S/ 125,450"
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
          trend="+8%"
          trendUp={true}
        />
        <StatsCard
          title="Clientes Activos"
          value="128"
          icon={<Users className="h-8 w-8 text-purple-600" />}
          trend="+23"
          trendUp={true}
        />
        <StatsCard
          title="Garantías"
          value="67"
          icon={<Package className="h-8 w-8 text-orange-600" />}
          trend="+5"
          trendUp={true}
        />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Créditos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CreditoItem
                codigo="CRE-2025-001"
                cliente="Juan Pérez López"
                monto="S/ 5,000"
                estado="vigente"
                fecha="10/11/2025"
              />
              <CreditoItem
                codigo="CRE-2025-002"
                cliente="María García Ruiz"
                monto="S/ 3,500"
                estado="vigente"
                fecha="09/11/2025"
              />
              <CreditoItem
                codigo="CRE-2025-003"
                cliente="Carlos Sánchez"
                monto="S/ 8,000"
                estado="en_mora"
                fecha="05/11/2025"
              />
            </div>
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
            <QuickAction title="Nueva Solicitud" href="/dashboard/creditos/solicitud" />
            <QuickAction title="Registrar Pago" href="/dashboard/cobranzas/nuevo" />
            <QuickAction title="Ver Reportes" href="/dashboard/reportes" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp 
}: { 
  title: string
  value: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend} vs mes anterior
            </p>
          </div>
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
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
