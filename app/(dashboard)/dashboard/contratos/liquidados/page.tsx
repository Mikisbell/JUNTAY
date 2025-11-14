import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCreditos } from "@/lib/api/creditos"

export const dynamic = "force-dynamic"

export default async function ContratosLiquidadosPage() {
  const creditos = await getCreditos()
  const liquidados = creditos.filter(c => c.estado === "pagado" || c.estado === "castigado")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contratos liquidados / cerrados</h1>
          <p className="text-sm text-gray-600">
            Historial de contratos que ya fueron cancelados o castigados para fines de auditoría y consulta.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Listado de contratos liquidados / cerrados</CardTitle>
        </CardHeader>
        <CardContent>
          {liquidados.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-600">
              No hay contratos liquidados registrados.
            </div>
          ) : (
            <div className="overflow-x-auto text-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">Código</th>
                    <th className="text-left p-3 font-medium text-gray-700">Cliente</th>
                    <th className="text-left p-3 font-medium text-gray-700">Documento</th>
                    <th className="text-left p-3 font-medium text-gray-700">Monto total</th>
                    <th className="text-left p-3 font-medium text-gray-700">Estado</th>
                    <th className="text-left p-3 font-medium text-gray-700">Fecha desembolso</th>
                    <th className="text-right p-3 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {liquidados.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{c.codigo}</td>
                      <td className="p-3">
                        <p className="font-medium text-gray-900">
                          {c.clientes?.tipo_persona === "natural"
                            ? `${c.clientes?.nombres} ${c.clientes?.apellido_paterno}`
                            : c.clientes?.razon_social}
                        </p>
                      </td>
                      <td className="p-3 text-xs text-gray-600">{c.clientes?.numero_documento}</td>
                      <td className="p-3">
                        <p className="font-medium text-gray-900">S/ {c.monto_total.toFixed(2)}</p>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={c.estado === "pagado" ? "secondary" : "outline"}
                          className="text-[11px] capitalize"
                        >
                          {c.estado.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-gray-600">
                        {new Date(c.fecha_desembolso).toLocaleDateString("es-PE")}
                      </td>
                      <td className="p-3 text-right">
                        <Link href={`/dashboard/creditos/${c.id}`} className="text-xs text-blue-600 hover:underline">
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
