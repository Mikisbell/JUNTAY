'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Gavel, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Timer,
  User,
  FileText,
  Send,
  Eye,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface CreditoParaRemate {
  id?: string
  numero_contrato: string
  cliente_nombre: string
  cliente_dni: string
  cliente_telefono?: string
  monto_prestado: number
  monto_pendiente: number
  fecha_vencimiento_legal: string
  dias_vencido: number
  fecha_fin_gracia: string
  dias_desde_fin_gracia: number
  notificaciones_enviadas: number
  fecha_ultima_notificacion?: string
  garantia_id: string
  garantia_descripcion: string
  garantia_valor: number
  garantia_estado: 'disponible' | 'en_proceso' | 'vendida'
  prioridad: 'alta' | 'media' | 'baja'
  valor_recuperacion_estimado: number
  created_at?: string
}

export default function CreditosParaRematePage() {
  const [creditos, setCreditos] = useState<CreditoParaRemate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todos')
  const [filtroEstadoGarantia, setFiltroEstadoGarantia] = useState<string>('todos')
  const [procesandoAccion, setProcesandoAccion] = useState<string | null>(null)
  const [seleccionados, setSeleccionados] = useState<string[]>([])

  useEffect(() => {
    loadCreditosParaRemate()
  }, [])

  const loadCreditosParaRemate = async () => {
    try {
      setLoading(true)
      
      // Generar datos de ejemplo para créditos para remate
      const creditosEjemplo = generarCreditosParaRemate()
      setCreditos(creditosEjemplo)
      
    } catch (error) {
      console.error('Error cargando créditos para remate:', error)
      toast.error('Error al cargar los créditos para remate')
    } finally {
      setLoading(false)
    }
  }

  const generarCreditosParaRemate = (): CreditoParaRemate[] => {
    const ejemplos = []
    const nombres = ['Roberto Silva', 'Patricia Vega', 'Miguel Torres', 'Elena Castillo', 'Jorge Mendoza', 'Lucía Herrera']
    const garantias = [
      'Anillo de oro 18k con diamante',
      'Laptop Dell Inspiron 15',
      'Smart TV LG 65" OLED',
      'Cadena de oro 18k 50cm',
      'iPhone 15 Pro Max 256GB',
      'Reloj Seiko Automático',
      'Tablet iPad Pro 12.9"',
      'Parlante JBL Xtreme 3'
    ]
    const prioridades = ['alta', 'media', 'baja'] as const
    const estadosGarantia = ['disponible', 'en_proceso'] as const
    
    for (let i = 0; i < 8; i++) {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)]
      const garantia = garantias[Math.floor(Math.random() * garantias.length)]
      const prioridad = prioridades[Math.floor(Math.random() * prioridades.length)]
      const estadoGarantia = estadosGarantia[Math.floor(Math.random() * estadosGarantia.length)]
      const montoPrestado = Math.floor(Math.random() * 5000) + 1000
      const montoPendiente = montoPrestado * (0.7 + Math.random() * 0.3)
      const garantiaValor = montoPrestado * (1.4 + Math.random() * 0.6)
      
      // Créditos para remate: más de 7 días desde vencimiento
      const diasVencido = Math.floor(Math.random() * 20) + 8
      const diasDesdeFinGracia = diasVencido - 7
      
      const fechaVencimiento = new Date()
      fechaVencimiento.setDate(fechaVencimiento.getDate() - diasVencido)
      
      const fechaFinGracia = new Date(fechaVencimiento)
      fechaFinGracia.setDate(fechaFinGracia.getDate() + 7)
      
      // Valor de recuperación estimado (70-90% del valor de garantía)
      const valorRecuperacion = garantiaValor * (0.7 + Math.random() * 0.2)
      
      ejemplos.push({
        id: `remate-${i}`,
        numero_contrato: `CON-2025-${String(i + 200).padStart(6, '0')}`,
        cliente_nombre: nombre,
        cliente_dni: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        cliente_telefono: `9${Math.floor(Math.random() * 90000000) + 10000000}`,
        monto_prestado: montoPrestado,
        monto_pendiente: Math.round(montoPendiente),
        fecha_vencimiento_legal: fechaVencimiento.toISOString(),
        dias_vencido: diasVencido,
        fecha_fin_gracia: fechaFinGracia.toISOString(),
        dias_desde_fin_gracia: diasDesdeFinGracia,
        notificaciones_enviadas: Math.floor(Math.random() * 6) + 3,
        fecha_ultima_notificacion: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
        garantia_id: `GAR-${String(i + 300).padStart(6, '0')}`,
        garantia_descripcion: garantia,
        garantia_valor: Math.round(garantiaValor),
        garantia_estado: estadoGarantia,
        prioridad: prioridad,
        valor_recuperacion_estimado: Math.round(valorRecuperacion),
        created_at: fechaVencimiento.toISOString()
      })
    }
    
    return ejemplos.sort((a, b) => {
      // Ordenar por prioridad y días desde fin de gracia
      const prioridadOrder = { 'alta': 3, 'media': 2, 'baja': 1 }
      const prioridadDiff = prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad]
      if (prioridadDiff !== 0) return prioridadDiff
      return b.dias_desde_fin_gracia - a.dias_desde_fin_gracia
    })
  }

  const filtrarCreditos = () => {
    return creditos.filter(credito => {
      const matchesSearch = credito.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           credito.numero_contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           credito.cliente_dni.includes(searchTerm) ||
                           credito.garantia_descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPrioridad = filtroPrioridad === 'todos' || credito.prioridad === filtroPrioridad
      const matchesEstadoGarantia = filtroEstadoGarantia === 'todos' || credito.garantia_estado === filtroEstadoGarantia
      
      return matchesSearch && matchesPrioridad && matchesEstadoGarantia
    })
  }

  const crearRemate = async (creditoId: string) => {
    setProcesandoAccion(creditoId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Actualizar estado de la garantía
      setCreditos(prev => prev.map(c => 
        c.id === creditoId 
          ? { ...c, garantia_estado: 'en_proceso' as const }
          : c
      ))
      
      toast.success('Remate creado exitosamente')
    } catch (error) {
      toast.error('Error al crear remate')
    } finally {
      setProcesandoAccion(null)
    }
  }

  const crearRematesSeleccionados = async () => {
    if (seleccionados.length === 0) {
      toast.error('Seleccione al menos un crédito')
      return
    }
    
    if (!confirm(`¿Crear remates para ${seleccionados.length} créditos seleccionados?`)) return
    
    setProcesandoAccion('batch')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Actualizar estado de las garantías seleccionadas
      setCreditos(prev => prev.map(c => 
        seleccionados.includes(c.id!) 
          ? { ...c, garantia_estado: 'en_proceso' as const }
          : c
      ))
      
      setSeleccionados([])
      toast.success(`${seleccionados.length} remates creados exitosamente`)
    } catch (error) {
      toast.error('Error al crear remates masivos')
    } finally {
      setProcesandoAccion(null)
    }
  }

  const toggleSeleccion = (creditoId: string) => {
    setSeleccionados(prev => 
      prev.includes(creditoId) 
        ? prev.filter(id => id !== creditoId)
        : [...prev, creditoId]
    )
  }

  const seleccionarTodos = () => {
    const creditosFiltrados = filtrarCreditos()
    const disponibles = creditosFiltrados.filter(c => c.garantia_estado === 'disponible')
    
    if (seleccionados.length === disponibles.length) {
      setSeleccionados([])
    } else {
      setSeleccionados(disponibles.map(c => c.id!))
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    const colors = {
      'alta': 'bg-red-100 text-red-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'baja': 'bg-green-100 text-green-800'
    }
    return colors[prioridad as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getEstadoGarantiaBadge = (estado: string) => {
    const variants = {
      'disponible': 'default',
      'en_proceso': 'secondary',
      'vendida': 'outline'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const creditosFiltrados = filtrarCreditos()
  const creditosDisponibles = creditosFiltrados.filter(c => c.garantia_estado === 'disponible')

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Créditos para Remate</h1>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/vencimientos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Créditos para Remate</h1>
            <p className="text-gray-600">Gestión de créditos que completaron el período de gracia</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadCreditosParaRemate()}>
            <Timer className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          {seleccionados.length > 0 && (
            <Button 
              onClick={crearRematesSeleccionados}
              disabled={procesandoAccion === 'batch'}
              className="bg-red-600 hover:bg-red-700"
            >
              <Gavel className="h-4 w-4 mr-2" />
              Crear {seleccionados.length} Remates
            </Button>
          )}
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total para Remate</p>
                <p className="text-2xl font-bold">{creditos.length}</p>
              </div>
              <Gavel className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prioridad Alta</p>
                <p className="text-2xl font-bold text-red-600">
                  {creditos.filter(c => c.prioridad === 'alta').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Recuperación</p>
                <p className="text-2xl font-bold text-green-600">
                  S/ {creditos.reduce((sum, c) => sum + c.valor_recuperacion_estimado, 0).toFixed(0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-blue-600">
                  {creditos.filter(c => c.garantia_estado === 'disponible').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Acciones */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente, contrato, DNI o garantía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las Prioridades</option>
            <option value="alta">Prioridad Alta</option>
            <option value="media">Prioridad Media</option>
            <option value="baja">Prioridad Baja</option>
          </select>
          
          <select
            value={filtroEstadoGarantia}
            onChange={(e) => setFiltroEstadoGarantia(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Estados</option>
            <option value="disponible">Disponible</option>
            <option value="en_proceso">En Proceso</option>
            <option value="vendida">Vendida</option>
          </select>
          
          {creditosDisponibles.length > 0 && (
            <Button 
              variant="outline" 
              onClick={seleccionarTodos}
              className="text-sm"
            >
              {seleccionados.length === creditosDisponibles.length ? 'Deseleccionar' : 'Seleccionar'} Todos
            </Button>
          )}
        </div>
      </div>

      {/* Lista de Créditos */}
      {creditosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay créditos para remate</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroPrioridad !== 'todos' || filtroEstadoGarantia !== 'todos'
                ? 'No se encontraron créditos con los filtros aplicados'
                : 'Todos los créditos están al día o ya procesados'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {creditosFiltrados.map((credito) => (
            <Card key={credito.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {credito.garantia_estado === 'disponible' && (
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(credito.id!)}
                        onChange={() => toggleSeleccion(credito.id!)}
                        className="mt-1"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold">{credito.cliente_nombre}</h4>
                        <Badge className={getPrioridadColor(credito.prioridad)}>
                          Prioridad {credito.prioridad}
                        </Badge>
                        <Badge variant={getEstadoGarantiaBadge(credito.garantia_estado) as "default" | "secondary" | "outline"}>
                          {credito.garantia_estado.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-600">Contrato</p>
                          <p className="font-semibold">{credito.numero_contrato}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Monto Pendiente</p>
                          <p className="font-semibold text-red-600">S/ {credito.monto_pendiente.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Días Vencido</p>
                          <p className="font-semibold">{credito.dias_vencido} días</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Días sin Gracia</p>
                          <p className="font-semibold text-red-600">{credito.dias_desde_fin_gracia} días</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-600 mb-1">Información del Cliente:</p>
                          <p><strong>DNI:</strong> {credito.cliente_dni}</p>
                          <p><strong>Teléfono:</strong> {credito.cliente_telefono}</p>
                          <p><strong>Vencimiento:</strong> {formatFecha(credito.fecha_vencimiento_legal)}</p>
                          <p><strong>Fin Gracia:</strong> {formatFecha(credito.fecha_fin_gracia)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Garantía ({credito.garantia_id}):</p>
                          <p><strong>Descripción:</strong> {credito.garantia_descripcion}</p>
                          <p><strong>Valor Garantía:</strong> S/ {credito.garantia_valor.toFixed(2)}</p>
                          <p><strong>Recuperación Est.:</strong> S/ {credito.valor_recuperacion_estimado.toFixed(2)}</p>
                          <p><strong>Notificaciones:</strong> {credito.notificaciones_enviadas} enviadas</p>
                        </div>
                      </div>
                      
                      {credito.fecha_ultima_notificacion && (
                        <p className="text-xs text-gray-500">
                          Última notificación: {formatFecha(credito.fecha_ultima_notificacion)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <Link href={`/dashboard/creditos/${credito.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Ver Cliente
                      </Button>
                    </Link>
                    
                    <Link href={`/dashboard/garantias/${credito.garantia_id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Garantía
                      </Button>
                    </Link>
                    
                    {credito.garantia_estado === 'disponible' ? (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => crearRemate(credito.id!)}
                        disabled={procesandoAccion === credito.id}
                        className="w-full"
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Crear Remate
                      </Button>
                    ) : credito.garantia_estado === 'en_proceso' ? (
                      <Link href={`/dashboard/remates?garantia=${credito.garantia_id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Remate
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Vendida
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resumen */}
      {creditosFiltrados.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Mostrando {creditosFiltrados.length} de {creditos.length} créditos para remate
                {seleccionados.length > 0 && ` | ${seleccionados.length} seleccionados`}
              </span>
              <span>
                Valor recuperación filtrado: S/ {creditosFiltrados.reduce((sum, c) => sum + c.valor_recuperacion_estimado, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
