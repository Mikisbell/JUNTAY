import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCreditos } from "@/lib/api/creditos"

export const dynamic = "force-dynamic"

export default async function ContratosVencidosPage() {
  const creditos = await getCreditos()
  const vencidos = creditos.filter(c => c.estado === "en_mora" || c.estado === "vencido")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contratos vencidos / en mora</h1>
          <p className="text-sm text-gray-600">
            Contratos que requieren gestión de cobranza, renovación o preparación para remate.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Listado de contratos vencidos / en mora</CardTitle>
        </CardHeader>
        <CardContent>
          {vencidos.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-600">
              No hay contratos vencidos ni en mora registrados.
            </div>
          ) : (
            <div className="overflow-x-auto text-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Código</th>
                    <th className="text-left p-3 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Cliente</th>
                    <th className="text-left p-3 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Documento</th>
                    <th className="text-left p-3 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Saldo</th>
                    <th className="text-left p-3 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Días en mora</th>
                    <th className="text-left p-3 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Estado</th>
                    <th className="text-left p-3 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Fecha desembolso</th>
                    <th className="text-right p-3 text-[11px] font-medium text-gray-500 tracking-wide uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vencidos.map((c) => (
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
                        <p className="font-medium text-red-700">S/ {c.saldo_pendiente.toFixed(2)}</p>
                      </td>
                      <td className="p-3 text-xs text-gray-700">{c.dias_mora ?? 0}</td>
                      <td className="p-3">
                        <Badge
                          variant="destructive"
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
