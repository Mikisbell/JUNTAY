'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  MapPin, 
  Scale, 
  Ruler, 
  Palette, 
  AlertTriangle,
  Calendar,
  DollarSign,
  Eye,
  Edit
} from 'lucide-react'
import { Garantia } from '@/lib/api/garantias'

interface GarantiaCardDetalladaProps {
  garantia: Garantia
  onVer?: (id: string) => void
  onEditar?: (id: string) => void
  showActions?: boolean
  compact?: boolean
}

export function GarantiaCardDetallada({
  garantia,
  onVer,
  onEditar,
  showActions = true,
  compact = false
}: GarantiaCardDetalladaProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'bg-green-100 text-green-800 border-green-200'
      case 'en_prenda': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'liberado': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'vendido': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'perdido': return 'bg-red-100 text-red-800 border-red-200'
      case 'evaluacion': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConservacionColor = (conservacion?: string) => {
    switch (conservacion) {
      case 'nuevo': return 'text-green-600'
      case 'muy_bueno': return 'text-blue-600'
      case 'bueno': return 'text-yellow-600'
      case 'regular': return 'text-orange-600'
      case 'malo': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(valor)
  }

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-sm">{garantia.nombre}</h3>
                <Badge className={`text-xs ${getEstadoColor(garantia.estado)}`}>
                  {garantia.estado}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Código:</strong> {garantia.codigo}</p>
                <p><strong>Valor:</strong> {formatearMoneda(garantia.valor_tasacion)}</p>
                {garantia.ubicacion_estante && (
                  <p><strong>Ubicación:</strong> {garantia.ubicacion_estante}</p>
                )}
              </div>
            </div>
            
            {showActions && (
              <div className="flex gap-1 ml-2">
                {onVer && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onVer(garantia.id!)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
                {onEditar && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditar(garantia.id!)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              {garantia.nombre}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getEstadoColor(garantia.estado)}>
                {garantia.estado.replace('_', ' ').toUpperCase()}
              </Badge>
              {garantia.estado_conservacion && (
                <span className={`text-sm font-medium ${getConservacionColor(garantia.estado_conservacion)}`}>
                  {garantia.estado_conservacion.replace('_', ' ')}
                </span>
              )}
              {garantia.requiere_evaluacion_especial && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Evaluación Especial
                </Badge>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {onVer && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onVer(garantia.id!)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              )}
              {onEditar && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditar(garantia.id!)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información Básica */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Código:</span>
            <p className="font-mono">{garantia.codigo}</p>
          </div>
          {garantia.numero_boleta && (
            <div>
              <span className="font-medium text-gray-600">Boleta:</span>
              <p className="font-mono">{garantia.numero_boleta}</p>
            </div>
          )}
          {garantia.marca && (
            <div>
              <span className="font-medium text-gray-600">Marca:</span>
              <p>{garantia.marca}</p>
            </div>
          )}
          {garantia.modelo && (
            <div>
              <span className="font-medium text-gray-600">Modelo:</span>
              <p>{garantia.modelo}</p>
            </div>
          )}
        </div>

        {/* Descripción */}
        {garantia.descripcion && (
          <div>
            <span className="font-medium text-gray-600 text-sm">Descripción:</span>
            <p className="text-sm text-gray-700 mt-1">{garantia.descripcion}</p>
          </div>
        )}

        {/* Características Físicas */}
        {(garantia.peso || garantia.dimensiones || garantia.material || garantia.color) && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              Características Físicas
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {garantia.peso && (
                <div className="flex items-center gap-2">
                  <Scale className="h-3 w-3 text-gray-500" />
                  <span>{garantia.peso} kg</span>
                </div>
              )}
              {garantia.dimensiones && (
                <div className="flex items-center gap-2">
                  <Ruler className="h-3 w-3 text-gray-500" />
                  <span>{garantia.dimensiones}</span>
                </div>
              )}
              {garantia.color && (
                <div className="flex items-center gap-2">
                  <Palette className="h-3 w-3 text-gray-500" />
                  <span>{garantia.color}</span>
                </div>
              )}
              {garantia.material && (
                <div className="flex items-center gap-2">
                  <Package className="h-3 w-3 text-gray-500" />
                  <span>{garantia.material}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ubicación */}
        {(garantia.ubicacion_fisica || garantia.ubicacion_estante) && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Ubicación
            </h4>
            <div className="text-sm space-y-1">
              {garantia.ubicacion_fisica && (
                <p><strong>Física:</strong> {garantia.ubicacion_fisica}</p>
              )}
              {garantia.ubicacion_estante && (
                <p><strong>Estante:</strong> {garantia.ubicacion_estante}</p>
              )}
            </div>
          </div>
        )}

        {/* Valuación */}
        <div className="border-t pt-3">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Valuación
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Valor Comercial:</span>
              <p className="font-semibold text-green-600">
                {formatearMoneda(garantia.valor_comercial)}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Valor Tasación:</span>
              <p className="font-semibold text-blue-600">
                {formatearMoneda(garantia.valor_tasacion)}
              </p>
            </div>
            {garantia.valor_prestamo_maximo && (
              <div className="col-span-2">
                <span className="text-gray-600">Máximo Préstamo:</span>
                <p className="font-semibold text-purple-600">
                  {formatearMoneda(garantia.valor_prestamo_maximo)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fechas */}
        {(garantia.fecha_tasacion || garantia.fecha_vencimiento_legal) && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Fechas Importantes
            </h4>
            <div className="text-sm space-y-1">
              {garantia.fecha_tasacion && (
                <p><strong>Tasación:</strong> {new Date(garantia.fecha_tasacion).toLocaleDateString()}</p>
              )}
              {garantia.fecha_vencimiento_legal && (
                <p><strong>Vencimiento Legal:</strong> {new Date(garantia.fecha_vencimiento_legal).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}

        {/* Notas del Tasador */}
        {garantia.notas_tasador && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2">Notas del Tasador</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {garantia.notas_tasador}
            </p>
          </div>
        )}

        {/* Observaciones */}
        {garantia.observaciones && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2">Observaciones</h4>
            <p className="text-sm text-gray-700">
              {garantia.observaciones}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
