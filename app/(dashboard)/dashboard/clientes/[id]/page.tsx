import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Briefcase, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getClienteById } from '@/lib/api/clientes'

export const dynamic = 'force-dynamic'

export default async function ClienteDetallePage({ params }: { params: { id: string } }) {
  const cliente = await getClienteById(params.id)

  if (!cliente) {
    notFound()
  }

  const nombreCompleto = cliente.tipo_persona === 'natural'
    ? `${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno || ''}`
    : cliente.razon_social

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/clientes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{nombreCompleto}</h1>
            <p className="text-gray-600">
              {cliente.tipo_persona === 'natural' ? 'Persona Natural' : 'Persona Jurídica'} • {cliente.numero_documento}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/clientes/${params.id}/editar`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Estado y Calificación */}
      <div className="flex items-center space-x-4">
        <Badge variant={cliente.activo ? 'default' : 'secondary'}>
          {cliente.activo ? 'Activo' : 'Inactivo'}
        </Badge>
        {cliente.calificacion_crediticia && (
          <Badge
            variant={
              cliente.calificacion_crediticia === 'excelente' ? 'default' :
              cliente.calificacion_crediticia === 'bueno' ? 'secondary' :
              'destructive'
            }
          >
            Calificación: {cliente.calificacion_crediticia}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos de Identificación */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de Identificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo de Documento</p>
                  <p className="font-medium">{cliente.tipo_documento}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Número de Documento</p>
                  <p className="font-medium">{cliente.numero_documento}</p>
                </div>
              </div>

              {cliente.tipo_persona === 'natural' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombres</p>
                    <p className="font-medium">{cliente.nombres}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Apellidos</p>
                    <p className="font-medium">
                      {cliente.apellido_paterno} {cliente.apellido_materno || ''}
                    </p>
                  </div>
                  {cliente.fecha_nacimiento && (
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                      <p className="font-medium">
                        {new Date(cliente.fecha_nacimiento).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                  )}
                  {cliente.genero && (
                    <div>
                      <p className="text-sm text-gray-600">Género</p>
                      <p className="font-medium capitalize">{cliente.genero}</p>
                    </div>
                  )}
                  {cliente.estado_civil && (
                    <div>
                      <p className="text-sm text-gray-600">Estado Civil</p>
                      <p className="font-medium capitalize">{cliente.estado_civil}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Razón Social</p>
                    <p className="font-medium">{cliente.razon_social}</p>
                  </div>
                  {cliente.representante_legal && (
                    <div>
                      <p className="text-sm text-gray-600">Representante Legal</p>
                      <p className="font-medium">{cliente.representante_legal}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dirección */}
          {(cliente.direccion || cliente.distrito || cliente.provincia || cliente.departamento) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Dirección
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cliente.direccion && (
                  <p className="font-medium">{cliente.direccion}</p>
                )}
                {(cliente.distrito || cliente.provincia || cliente.departamento) && (
                  <p className="text-sm text-gray-600">
                    {[cliente.distrito, cliente.provincia, cliente.departamento]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {cliente.referencia && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Referencia:</span> {cliente.referencia}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Datos Laborales */}
          {(cliente.ocupacion || cliente.empresa_trabaja || cliente.ingreso_mensual) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Datos Laborales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {cliente.ocupacion && (
                    <div>
                      <p className="text-sm text-gray-600">Ocupación</p>
                      <p className="font-medium">{cliente.ocupacion}</p>
                    </div>
                  )}
                  {cliente.empresa_trabaja && (
                    <div>
                      <p className="text-sm text-gray-600">Empresa</p>
                      <p className="font-medium">{cliente.empresa_trabaja}</p>
                    </div>
                  )}
                  {cliente.ingreso_mensual && (
                    <div>
                      <p className="text-sm text-gray-600">Ingreso Mensual</p>
                      <p className="font-medium flex items-center">
                        <DollarSign className="h-4 w-4" />
                        S/ {cliente.ingreso_mensual.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observaciones */}
          {cliente.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle>Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{cliente.observaciones}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cliente.telefono_principal && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Principal</p>
                    <p className="font-medium">{cliente.telefono_principal}</p>
                  </div>
                </div>
              )}
              {cliente.telefono_secundario && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Secundario</p>
                    <p className="font-medium">{cliente.telefono_secundario}</p>
                  </div>
                </div>
              )}
              {cliente.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="font-medium text-sm break-all">{cliente.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historial de Créditos */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Créditos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">No hay créditos registrados</p>
              </div>
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Registrado</p>
                <p className="font-medium">
                  {new Date(cliente.created_at!).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Última actualización</p>
                <p className="font-medium">
                  {new Date(cliente.updated_at!).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
