'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Package, 
  Save,
  AlertCircle,
  Search,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { crearRemate } from '@/lib/api/remates'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Garantia {
  id?: string
  nombre: string
  marca: string
  modelo: string
  numero_serie?: string
  estado: string
  valor_tasacion: number
  credito_id?: string
  remate_id?: string
}

export default function NuevoRematePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [garantias, setGarantias] = useState<Garantia[]>([])
  const [garantiaSeleccionada, setGarantiaSeleccionada] = useState<Garantia | null>(null)
  const [searchGarantia, setSearchGarantia] = useState('')
  const [formData, setFormData] = useState({
    garantia_id: '',
    credito_id: '',
    fecha_inicio_remate: '',
    hora_inicio: '',
    duracion_dias: 7,
    precio_base: 0,
    incremento_minimo: 50,
    descripcion: '',
    condiciones_especiales: ''
  })

  useEffect(() => {
    loadGarantiasVencidas()
  }, [])

  const loadGarantiasVencidas = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('garantias')
        .select('*')
        .in('estado', ['perdido', 'vencido'])
        .is('remate_id', null)
        
      if (error) throw error
      
      setGarantias(data || [])
    } catch (error) {
      console.error('Error cargando garantías:', error)
      toast.error('Error al cargar garantías disponibles')
    }
  }

  const garantiasFiltradas = garantias.filter(g =>
    g.nombre.toLowerCase().includes(searchGarantia.toLowerCase()) ||
    g.numero_serie?.toLowerCase().includes(searchGarantia.toLowerCase())
  )

  const handleGarantiaSelect = (garantia: Garantia) => {
    setGarantiaSeleccionada(garantia)
    setFormData(prev => ({
      ...prev,
      garantia_id: garantia.id!,
      credito_id: garantia.credito_id || '',
      precio_base: garantia.valor_tasacion * 0.7, // 70% del valor de tasación como base
      descripcion: `Remate de ${garantia.nombre} - ${garantia.marca} ${garantia.modelo}`
    }))
    setSearchGarantia('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!garantiaSeleccionada) {
      toast.error('Debe seleccionar una garantía')
      return
    }

    if (!formData.fecha_inicio_remate || !formData.hora_inicio) {
      toast.error('Debe especificar fecha y hora de inicio')
      return
    }

    try {
      setLoading(true)
      
      // Combinar fecha y hora
      const fechaHoraInicio = `${formData.fecha_inicio_remate}T${formData.hora_inicio}:00`
      
      const remateData = {
        garantia_id: formData.garantia_id,
        credito_id: formData.credito_id,
        fecha_inicio_remate: fechaHoraInicio,
        duracion_dias: formData.duracion_dias,
        precio_base: formData.precio_base,
        incremento_minimo: formData.incremento_minimo,
        descripcion: formData.descripcion,
        condiciones_especiales: formData.condiciones_especiales
      }

      await crearRemate(remateData)
      
      toast.success('Remate programado exitosamente')
      router.push('/dashboard/remates')
    } catch (error) {
      console.error('Error creando remate:', error)
      toast.error('Error al programar el remate')
    } finally {
      setLoading(false)
    }
  }

  const fechaMinima = new Date().toISOString().split('T')[0]
  const fechaFinEstimada = formData.fecha_inicio_remate 
    ? new Date(new Date(formData.fecha_inicio_remate).getTime() + formData.duracion_dias * 24 * 60 * 60 * 1000)
        .toLocaleDateString('es-PE')
    : ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/remates">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programar Nuevo Remate</h1>
          <p className="text-gray-600">Configure los detalles del remate de garantía</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selección de Garantía */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Seleccionar Garantía
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!garantiaSeleccionada ? (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar garantía por nombre o número de serie..."
                        value={searchGarantia}
                        onChange={(e) => setSearchGarantia(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {garantiasFiltradas.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No hay garantías disponibles para remate</p>
                          <p className="text-sm">Las garantías deben estar vencidas o perdidas</p>
                        </div>
                      ) : (
                        garantiasFiltradas.map((garantia) => (
                          <div
                            key={garantia.id}
                            onClick={() => handleGarantiaSelect(garantia)}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{garantia.nombre}</h4>
                                <p className="text-sm text-gray-600">
                                  {garantia.marca} {garantia.modelo}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Serie: {garantia.numero_serie}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline">{garantia.estado}</Badge>
                                <p className="text-sm font-semibold mt-1">
                                  S/ {garantia.valor_tasacion.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-green-900">{garantiaSeleccionada.nombre}</h4>
                        <p className="text-sm text-green-700">
                          {garantiaSeleccionada.marca} {garantiaSeleccionada.modelo}
                        </p>
                        <p className="text-xs text-green-600">
                          Serie: {garantiaSeleccionada.numero_serie}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{garantiaSeleccionada.estado}</Badge>
                        <p className="text-sm font-semibold mt-1 text-green-900">
                          S/ {garantiaSeleccionada.valor_tasacion.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGarantiaSeleccionada(null)
                        setFormData(prev => ({ ...prev, garantia_id: '', credito_id: '', precio_base: 0 }))
                      }}
                      className="mt-2"
                    >
                      Cambiar Garantía
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuración del Remate */}
            {garantiaSeleccionada && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Configuración del Remate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                      <Input
                        id="fecha_inicio"
                        type="date"
                        min={fechaMinima}
                        value={formData.fecha_inicio_remate}
                        onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio_remate: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
                      <Input
                        id="hora_inicio"
                        type="time"
                        value={formData.hora_inicio}
                        onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duracion_dias">Duración (días)</Label>
                      <Input
                        id="duracion_dias"
                        type="number"
                        min="1"
                        max="30"
                        value={formData.duracion_dias}
                        onChange={(e) => setFormData(prev => ({ ...prev, duracion_dias: parseInt(e.target.value) }))}
                      />
                      {fechaFinEstimada && (
                        <p className="text-xs text-gray-500 mt-1">
                          Finaliza aproximadamente: {fechaFinEstimada}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="incremento_minimo">Incremento Mínimo (S/)</Label>
                      <Input
                        id="incremento_minimo"
                        type="number"
                        min="1"
                        step="0.01"
                        value={formData.incremento_minimo}
                        onChange={(e) => setFormData(prev => ({ ...prev, incremento_minimo: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descripcion">Descripción del Remate</Label>
                    <Input
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      placeholder="Descripción detallada del artículo en remate"
                    />
                  </div>

                  <div>
                    <Label htmlFor="condiciones">Condiciones Especiales</Label>
                    <Input
                      id="condiciones"
                      value={formData.condiciones_especiales}
                      onChange={(e) => setFormData(prev => ({ ...prev, condiciones_especiales: e.target.value }))}
                      placeholder="Condiciones especiales del remate (opcional)"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumen */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Configuración de Precios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="precio_base">Precio Base (S/) *</Label>
                  <Input
                    id="precio_base"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.precio_base}
                    onChange={(e) => setFormData(prev => ({ ...prev, precio_base: parseFloat(e.target.value) }))}
                    required
                  />
                  {garantiaSeleccionada && (
                    <p className="text-xs text-gray-500 mt-1">
                      Valor de tasación: S/ {garantiaSeleccionada.valor_tasacion.toFixed(2)}
                      <br />
                      Sugerido (70%): S/ {(garantiaSeleccionada.valor_tasacion * 0.7).toFixed(2)}
                    </p>
                  )}
                </div>

                {formData.precio_base > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Proyección de Ofertas</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p>Precio base: S/ {formData.precio_base.toFixed(2)}</p>
                      <p>Primera oferta mín: S/ {(formData.precio_base + formData.incremento_minimo).toFixed(2)}</p>
                      <p>Incremento: S/ {formData.incremento_minimo.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información Importante */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Información Importante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                  <p>El remate se activará automáticamente en la fecha y hora programada</p>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-orange-500 mt-0.5" />
                  <p>La garantía quedará bloqueada hasta finalizar el remate</p>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500 mt-0.5" />
                  <p>Se notificará automáticamente a clientes interesados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link href="/dashboard/remates">
            <Button type="button" variant="outline" disabled={loading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading || !garantiaSeleccionada}>
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Programando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Programar Remate
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
