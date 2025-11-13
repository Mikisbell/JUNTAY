'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Gavel, 
  DollarSign, 
  User, 
  Clock,
  Trophy,
  Plus,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Oferta {
  id?: string
  remate_id: string
  nombre_oferente: string
  telefono_oferente?: string
  email_oferente?: string
  monto_oferta: number
  fecha_oferta: string
  estado: 'pendiente' | 'aceptada' | 'rechazada'
  notas?: string
  created_at?: string
}

interface Remate {
  id?: string
  numero_remate: string
  estado: string
  precio_base: number
  precio_final?: number
  incremento_minimo?: number
  ganador_nombre?: string
  fecha_inicio_remate: string
  fecha_fin_remate?: string
  garantias?: {
    nombre?: string
    valor_tasacion: number
  }
}

export default function OfertasRematePage() {
  const params = useParams()
  const router = useRouter()
  const [remate, setRemate] = useState<Remate | null>(null)
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [nuevaOferta, setNuevaOferta] = useState({
    nombre_oferente: '',
    telefono_oferente: '',
    email_oferente: '',
    monto_oferta: 0,
    notas: ''
  })

  useEffect(() => {
    if (params.id) {
      loadRemateYOfertas(params.id as string)
    }
  }, [params.id])

  const loadRemateYOfertas = async (remateId: string) => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Cargar datos del remate
      const { data: remateData, error: remateError } = await supabase
        .from('remates')
        .select(`
          *,
          garantias (
            nombre,
            valor_tasacion
          )
        `)
        .eq('id', remateId)
        .single()
        
      if (remateError) throw remateError
      setRemate(remateData)
      
      // Cargar ofertas del remate
      const { data: ofertasData, error: ofertasError } = await supabase
        .from('ofertas_remate')
        .select('*')
        .eq('remate_id', remateId)
        .order('monto_oferta', { ascending: false })
        
      if (ofertasError) throw ofertasError
      setOfertas(ofertasData || [])
      
      // Establecer monto mínimo para nueva oferta
      const mayorOferta = ofertasData && ofertasData.length > 0 
        ? Math.max(...ofertasData.map(o => o.monto_oferta))
        : remateData.precio_base
      
      setNuevaOferta(prev => ({
        ...prev,
        monto_oferta: mayorOferta + (remateData.incremento_minimo || 50)
      }))
      
    } catch (error) {
      console.error('Error cargando datos:', error)
      toast.error('Error al cargar el remate y ofertas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitOferta = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!remate) return
    
    if (!nuevaOferta.nombre_oferente.trim()) {
      toast.error('El nombre del oferente es requerido')
      return
    }
    
    const mayorOferta = ofertas.length > 0 
      ? Math.max(...ofertas.map(o => o.monto_oferta))
      : remate.precio_base
    
    const montoMinimo = mayorOferta + (remate.incremento_minimo || 50)
    
    if (nuevaOferta.monto_oferta < montoMinimo) {
      toast.error(`El monto mínimo es S/ ${montoMinimo.toFixed(2)}`)
      return
    }

    try {
      setSubmitting(true)
      const supabase = createClient()
      
      const ofertaData = {
        remate_id: remate.id!,
        nombre_oferente: nuevaOferta.nombre_oferente.trim(),
        telefono_oferente: nuevaOferta.telefono_oferente.trim() || null,
        email_oferente: nuevaOferta.email_oferente.trim() || null,
        monto_oferta: nuevaOferta.monto_oferta,
        estado: 'pendiente' as const,
        notas: nuevaOferta.notas.trim() || null,
        fecha_oferta: new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('ofertas_remate')
        .insert([ofertaData])
        
      if (error) throw error
      
      toast.success('Oferta registrada exitosamente')
      
      // Recargar ofertas
      await loadRemateYOfertas(remate.id!)
      
      // Limpiar formulario
      setNuevaOferta({
        nombre_oferente: '',
        telefono_oferente: '',
        email_oferente: '',
        monto_oferta: 0,
        notas: ''
      })
      
    } catch (error) {
      console.error('Error registrando oferta:', error)
      toast.error('Error al registrar la oferta')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAceptarOferta = async (ofertaId: string, montoOferta: number, nombreOferente: string) => {
    if (!remate) return
    
    if (!confirm(`¿Confirmar venta a ${nombreOferente} por S/ ${montoOferta.toFixed(2)}?`)) {
      return
    }

    try {
      const supabase = createClient()
      
      // Actualizar remate como vendido
      const { error: remateError } = await supabase
        .from('remates')
        .update({
          estado: 'vendido',
          precio_final: montoOferta,
          ganador_nombre: nombreOferente,
          fecha_fin_remate: new Date().toISOString()
        })
        .eq('id', remate.id!)
        
      if (remateError) throw remateError
      
      // Actualizar oferta como aceptada
      const { error: ofertaError } = await supabase
        .from('ofertas_remate')
        .update({ estado: 'aceptada' })
        .eq('id', ofertaId)
        
      if (ofertaError) throw ofertaError
      
      // Rechazar todas las demás ofertas
      const { error: rechazarError } = await supabase
        .from('ofertas_remate')
        .update({ estado: 'rechazada' })
        .eq('remate_id', remate.id!)
        .neq('id', ofertaId)
        
      if (rechazarError) throw rechazarError
      
      toast.success('¡Remate finalizado exitosamente!')
      
      // Recargar datos
      await loadRemateYOfertas(remate.id!)
      
    } catch (error) {
      console.error('Error finalizando remate:', error)
      toast.error('Error al finalizar el remate')
    }
  }

  const handleRechazarOferta = async (ofertaId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('ofertas_remate')
        .update({ estado: 'rechazada' })
        .eq('id', ofertaId)
        
      if (error) throw error
      
      toast.success('Oferta rechazada')
      await loadRemateYOfertas(remate?.id!)
      
    } catch (error) {
      console.error('Error rechazando oferta:', error)
      toast.error('Error al rechazar la oferta')
    }
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'pendiente': 'secondary',
      'aceptada': 'success',
      'rechazada': 'destructive'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!remate) {
    return (
      <div className="text-center py-12">
        <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Remate no encontrado</h2>
        <p className="text-gray-600 mb-4">El remate que busca no existe o ha sido eliminado</p>
        <Link href="/dashboard/remates">
          <Button>Volver a Remates</Button>
        </Link>
      </div>
    )
  }

  const mayorOferta = ofertas.length > 0 ? Math.max(...ofertas.map(o => o.monto_oferta)) : 0
  const montoMinimo = Math.max(mayorOferta, remate.precio_base) + (remate.incremento_minimo || 50)
  const remateActivo = remate.estado === 'en_proceso'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/remates/${remate.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Remate
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ofertas - {remate.numero_remate}</h1>
            <p className="text-gray-600">{remate.garantias?.nombre}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={remate.estado === 'en_proceso' ? 'default' : 'secondary'}>
            {remate.estado.toUpperCase()}
          </Badge>
          {mayorOferta > 0 && (
            <Badge variant="outline" className="text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Mayor: S/ {mayorOferta.toFixed(2)}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Remate */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Información del Remate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Precio Base</p>
                <p className="text-xl font-bold text-blue-600">S/ {remate.precio_base.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Incremento Mínimo</p>
                <p className="font-semibold">S/ {(remate.incremento_minimo || 50).toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Valor de Tasación</p>
                <p className="font-semibold">S/ {remate.garantias?.valor_tasacion.toFixed(2)}</p>
              </div>
              
              {mayorOferta > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">Mayor Oferta Actual</p>
                  <p className="text-2xl font-bold text-green-900">S/ {mayorOferta.toFixed(2)}</p>
                </div>
              )}
              
              {remateActivo && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600">Próxima Oferta Mínima</p>
                  <p className="text-lg font-bold text-blue-900">S/ {montoMinimo.toFixed(2)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulario Nueva Oferta */}
          {remateActivo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nueva Oferta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOferta} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del Oferente *</Label>
                    <Input
                      id="nombre"
                      value={nuevaOferta.nombre_oferente}
                      onChange={(e) => setNuevaOferta(prev => ({ ...prev, nombre_oferente: e.target.value }))}
                      placeholder="Nombre completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={nuevaOferta.telefono_oferente}
                      onChange={(e) => setNuevaOferta(prev => ({ ...prev, telefono_oferente: e.target.value }))}
                      placeholder="999 999 999"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={nuevaOferta.email_oferente}
                      onChange={(e) => setNuevaOferta(prev => ({ ...prev, email_oferente: e.target.value }))}
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="monto">Monto de Oferta (S/) *</Label>
                    <Input
                      id="monto"
                      type="number"
                      min={montoMinimo}
                      step="0.01"
                      value={nuevaOferta.monto_oferta}
                      onChange={(e) => setNuevaOferta(prev => ({ ...prev, monto_oferta: parseFloat(e.target.value) }))}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo: S/ {montoMinimo.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="notas">Notas (opcional)</Label>
                    <Input
                      id="notas"
                      value={nuevaOferta.notas}
                      onChange={(e) => setNuevaOferta(prev => ({ ...prev, notas: e.target.value }))}
                      placeholder="Comentarios adicionales"
                    />
                  </div>
                  
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Registrar Oferta
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Lista de Ofertas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Ofertas Recibidas ({ofertas.length})
                </span>
                {ofertas.length > 0 && (
                  <Badge variant="outline">
                    Promedio: S/ {(ofertas.reduce((sum, o) => sum + o.monto_oferta, 0) / ofertas.length).toFixed(2)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ofertas.length === 0 ? (
                <div className="text-center py-12">
                  <Gavel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ofertas</h3>
                  <p className="text-gray-600">
                    {remateActivo 
                      ? 'Aún no se han recibido ofertas para este remate'
                      : 'Este remate no recibió ofertas'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ofertas.map((oferta, index) => (
                    <div
                      key={oferta.id}
                      className={`p-4 border rounded-lg ${
                        index === 0 && oferta.estado === 'pendiente' 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{oferta.nombre_oferente}</h4>
                            <p className="text-sm text-gray-600">{formatFecha(oferta.fecha_oferta)}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            S/ {oferta.monto_oferta.toFixed(2)}
                          </p>
                          <Badge variant={getEstadoBadge(oferta.estado) as any}>
                            {oferta.estado}
                          </Badge>
                        </div>
                      </div>
                      
                      {(oferta.telefono_oferente || oferta.email_oferente) && (
                        <div className="flex gap-4 mb-3 text-sm text-gray-600">
                          {oferta.telefono_oferente && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {oferta.telefono_oferente}
                            </div>
                          )}
                          {oferta.email_oferente && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {oferta.email_oferente}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {oferta.notas && (
                        <p className="text-sm text-gray-600 mb-3 italic">"{oferta.notas}"</p>
                      )}
                      
                      {remateActivo && oferta.estado === 'pendiente' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAceptarOferta(oferta.id!, oferta.monto_oferta, oferta.nombre_oferente)}
                            className="flex-1"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Aceptar Oferta
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRechazarOferta(oferta.id!)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
