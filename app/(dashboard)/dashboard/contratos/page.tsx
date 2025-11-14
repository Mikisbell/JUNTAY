import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { getCreditosStats } from "@/lib/api/creditos"

export const dynamic = "force-dynamic"

export default async function ContratosOverviewPage() {
  const stats = await getCreditosStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Contratos</h1>
          <p className="text-sm text-gray-600">
            Visión general de los contratos prendarios: activos, vencidos y liquidados.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/contratos/activos">
            <Button variant="outline" size="sm">Activos</Button>
          </Link>
          <Link href="/dashboard/contratos/vencidos">
            <Button variant="outline" size="sm">Vencidos</Button>
          </Link>
          <Link href="/dashboard/contratos/liquidados">
            <Button variant="outline" size="sm">Liquidados</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total contratos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-7 w-7 text-gray-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-700">{stats.vigentes}</p>
            </div>
            <CheckCircle className="h-7 w-7 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">En mora / vencidos</p>
              <p className="text-2xl font-bold text-red-700">{stats.enMora}</p>
            </div>
            <AlertCircle className="h-7 w-7 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Cartera activa</p>
              <p className="text-2xl font-bold text-indigo-700">
                S/ {stats.montoCartera.toFixed(0)}
              </p>
            </div>
            <Clock className="h-7 w-7 text-indigo-600" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Estados de contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-700 space-y-2">
          <p>
            Los contratos se clasifican en diferentes estados según su ciclo de vida: activos (vigentes), en mora/vencidos
            y liquidados/castigados. Desde este módulo se consultan y gestionan, mientras que las operaciones diarias se
            realizan desde Empeños.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-[11px]">vigente</Badge>
            <Badge variant="outline" className="text-[11px]">en mora</Badge>
            <Badge variant="outline" className="text-[11px]">vencido</Badge>
            <Badge variant="outline" className="text-[11px]">pagado</Badge>
            <Badge variant="outline" className="text-[11px]">refinanciado</Badge>
            <Badge variant="outline" className="text-[11px]">castigado</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
