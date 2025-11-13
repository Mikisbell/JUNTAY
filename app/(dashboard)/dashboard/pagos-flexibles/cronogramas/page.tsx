'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Calendar, 
  Plus, 
  Search,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Calculator
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface CronogramaFlexible {
  id?: string
  credito_id: string
  cliente_nombre: string
  cliente_dni?: string
  modalidad_tipo: 'semanal' | 'quincenal' | 'mensual'
  monto_total: number
  porcentaje_pago: number
  monto_cuota: number
  cuotas_totales: number
  cuotas_pagadas: number
  estado: 'activo' | 'completado' | 'vencido' | 'suspendido'
  fecha_inicio: string
  fecha_fin: string
  proximo_pago?: string
  created_at?: string
}

interface Cuota {
  numero: number
  fecha_vencimiento: string
  monto: number
  estado: 'pendiente' | 'pagada' | 'vencida'
  fecha_pago?: string
  monto_pagado?: number
}

export default function CronogramasPage() {
  const [cronogramas, setCronogramas] = useState<CronogramaFlexible[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [showModal, setShowModal] = useState(false)
  const [cronogramaSeleccionado, setCronogramaSeleccionado] = useState<CronogramaFlexible | null>(null)
  const [cuotas, setCuotas] = useState<Cuota[]>([])

  useEffect(() => {
    loadCronogramas()
  }, [])

  const loadCronogramas = async () => {
    try {
      setLoading(true)
      
      // Generar cronogramas de ejemplo
      const cronogramasEjemplo = generarCronogramasEjemplo()
      setCronogramas(cronogramasEjemplo)
      
    } catch (error) {
      console.error('Error cargando cronogramas:', error)
      toast.error('Error al cargar los cronogramas')
    } finally {
      setLoading(false)
    }
  }

  const generarCronogramasEjemplo = (): CronogramaFlexible[] => {
    const ejemplos = []
    const clientes = [
      { nombre: 'Juan Pérez García', dni: '12345678' },
      { nombre: 'María García López', dni: '87654321' },
      { nombre: 'Carlos López Silva', dni: '11223344' },
      { nombre: 'Ana Martín Ruiz', dni: '44332211' },
      { nombre: 'Luis Rodríguez Vega', dni: '55667788' }
    ]
    
    const modalidades = ['semanal', 'quincenal', 'mensual'] as const
    const estados = ['activo', 'completado', 'vencido', 'suspendido'] as const
    
    for (let i = 0; i < 12; i++) {
      const cliente = clientes[Math.floor(Math.random() * clientes.length)]
      const modalidad = modalidades[Math.floor(Math.random() * modalidades.length)]
      const estado = estados[Math.floor(Math.random() * estados.length)]
      const montoTotal = Math.floor(Math.random() * 8000) + 2000
      const porcentajePago = modalidad === 'semanal' ? 5 + Math.random() * 15 : 
                           modalidad === 'quincenal' ? 10 + Math.random() * 20 : 
                           20 + Math.random() * 30
      
      const frecuenciaDias = modalidad === 'semanal' ? 7 : modalidad === 'quincenal' ? 15 : 30
      const cuotasTotales = Math.floor(100 / porcentajePago)
      const montoCuota = (montoTotal * porcentajePago) / 100
      const cuotasPagadas = estado === 'completado' ? cuotasTotales : 
                          estado === 'activo' ? Math.floor(Math.random() * cuotasTotales) : 0
      
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - Math.floor(Math.random() * 60))
      
      const fechaFin = new Date(fechaInicio)
      fechaFin.setDate(fechaFin.getDate() + (cuotasTotales * frecuenciaDias))
      
      const proximoPago = estado === 'activo' ? 
        new Date(fechaInicio.getTime() + (cuotasPagadas + 1) * frecuenciaDias * 24 * 60 * 60 * 1000) : 
        undefined
      
      ejemplos.push({
        id: `cronograma-${i}`,
        credito_id: `credito-${i}`,
        cliente_nombre: cliente.nombre,
        cliente_dni: cliente.dni,
        modalidad_tipo: modalidad,
        monto_total: montoTotal,
        porcentaje_pago: Math.round(porcentajePago * 10) / 10,
        monto_cuota: Math.round(montoCuota * 100) / 100,
        cuotas_totales: cuotasTotales,
        cuotas_pagadas: cuotasPagadas,
        estado,
        fecha_inicio: fechaInicio.toISOString(),
        fecha_fin: fechaFin.toISOString(),
        proximo_pago: proximoPago?.toISOString(),
        created_at: fechaInicio.toISOString()
      })
    }
    
    return ejemplos
  }

  const generarCuotas = (cronograma: CronogramaFlexible): Cuota[] => {
    const cuotas: Cuota[] = []
    const frecuenciaDias = cronograma.modalidad_tipo === 'semanal' ? 7 : 
                          cronograma.modalidad_tipo === 'quincenal' ? 15 : 30
    
    for (let i = 0; i < cronograma.cuotas_totales; i++) {
      const fechaVencimiento = new Date(cronograma.fecha_inicio)
      fechaVencimiento.setDate(fechaVencimiento.getDate() + (i + 1) * frecuenciaDias)
      
      const estado = i < cronograma.cuotas_pagadas ? 'pagada' : 
                    fechaVencimiento < new Date() ? 'vencida' : 'pendiente'
      
      cuotas.push({
        numero: i + 1,
        fecha_vencimiento: fechaVencimiento.toISOString(),
        monto: cronograma.monto_cuota,
        estado,
        fecha_pago: estado === 'pagada' ? fechaVencimiento.toISOString() : undefined,
        monto_pagado: estado === 'pagada' ? cronograma.monto_cuota : undefined
      })
    }
    
    return cuotas
  }

  const verDetalleCronograma = (cronograma: CronogramaFlexible) => {
    setCronogramaSeleccionado(cronograma)
    const cuotasGeneradas = generarCuotas(cronograma)
    setCuotas(cuotasGeneradas)
    setShowModal(true)
  }

  const filtrarCronogramas = () => {
    return cronogramas.filter(cronograma => {
      const matchesSearch = cronograma.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cronograma.cliente_dni?.includes(searchTerm)
      const matchesEstado = filtroEstado === 'todos' || cronograma.estado === filtroEstado
      
      return matchesSearch && matchesEstado
    })
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activo': 'default',
      'completado': 'success',
      'vencido': 'destructive',
      'suspendido': 'secondary'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const getModalidadBadge = (modalidad: string) => {
    const colors = {
      'semanal': 'bg-green-100 text-green-800',
      'quincenal': 'bg-blue-100 text-blue-800',
      'mensual': 'bg-purple-100 text-purple-800'
    }
    return colors[modalidad as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const cronogramasFiltrados = filtrarCronogramas()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cronogramas de Pago</h1>
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
          <Link href="/dashboard/pagos-flexibles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cronogramas de Pago</h1>
            <p className="text-gray-600">Gestión de cronogramas flexibles activos</p>
          </div>
        </div>
        <Link href="/dashboard/creditos/nueva-solicitud">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cronograma
          </Button>
        </Link>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cronogramas</p>
                <p className="text-2xl font-bold">{cronogramas.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {cronogramas.filter(c => c.estado === 'activo').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">
                  {cronogramas.filter(c => c.estado === 'vencido').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  S/ {cronogramas.reduce((sum, c) => sum + c.monto_total, 0).toFixed(0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos los Estados</option>
          <option value="activo">Activos</option>
          <option value="completado">Completados</option>
          <option value="vencido">Vencidos</option>
          <option value="suspendido">Suspendidos</option>
        </select>
      </div>

      {/* Lista de Cronogramas */}
      {cronogramasFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cronogramas</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroEstado !== 'todos'
                ? 'No se encontraron cronogramas con los filtros aplicados'
                : 'Aún no hay cronogramas de pago flexibles'
              }
            </p>
            <Link href="/dashboard/creditos/nueva-solicitud">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Cronograma
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cronogramasFiltrados.map((cronograma) => (
            <Card key={cronograma.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold">{cronograma.cliente_nombre}</h4>
                      <Badge variant={getEstadoBadge(cronograma.estado) as "default" | "secondary" | "destructive" | "outline"}>
                        {cronograma.estado}
                      </Badge>
                      <Badge className={getModalidadBadge(cronograma.modalidad_tipo)}>
                        {cronograma.modalidad_tipo}
                      </Badge>
                      <span className="text-sm text-gray-500">DNI: {cronograma.cliente_dni}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Monto Total</p>
                        <p className="font-semibold">S/ {cronograma.monto_total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">% Pago</p>
                        <p className="font-semibold">{cronograma.porcentaje_pago}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cuota</p>
                        <p className="font-semibold">S/ {cronograma.monto_cuota.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Progreso</p>
                        <p className="font-semibold">
                          {cronograma.cuotas_pagadas}/{cronograma.cuotas_totales}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Próximo Pago</p>
                        <p className="font-semibold">
                          {cronograma.proximo_pago 
                            ? formatFecha(cronograma.proximo_pago)
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            cronograma.estado === 'completado' ? 'bg-green-600' :
                            cronograma.estado === 'vencido' ? 'bg-red-600' : 'bg-blue-600'
                          }`}
                          style={{ 
                            width: `${(cronograma.cuotas_pagadas / cronograma.cuotas_totales) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((cronograma.cuotas_pagadas / cronograma.cuotas_totales) * 100).toFixed(1)}% completado
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => verDetalleCronograma(cronograma)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detalle Cronograma */}
      {showModal && cronogramaSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Cronograma - {cronogramaSeleccionado.cliente_nombre}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Monto Total</p>
                  <p className="text-xl font-bold">S/ {cronogramaSeleccionado.monto_total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Modalidad</p>
                  <p className="text-xl font-bold capitalize">{cronogramaSeleccionado.modalidad_tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <Badge variant={getEstadoBadge(cronogramaSeleccionado.estado) as "default" | "secondary" | "destructive" | "outline"} className="text-sm">
                    {cronogramaSeleccionado.estado}
                  </Badge>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Cuota</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Fecha Vencimiento</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Monto</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Fecha Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuotas.map((cuota) => (
                      <tr key={cuota.numero} className={cuota.estado === 'vencida' ? 'bg-red-50' : ''}>
                        <td className="border border-gray-300 px-4 py-2">#{cuota.numero}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {formatFecha(cuota.fecha_vencimiento)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          S/ {cuota.monto.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Badge 
                            variant={
                              cuota.estado === 'pagada' ? 'default' :
                              cuota.estado === 'vencida' ? 'destructive' : 'secondary'
                            }
                            className={
                              cuota.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                              cuota.estado === 'vencida' ? '' : ''
                            }
                          >
                            {cuota.estado}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {cuota.fecha_pago ? formatFecha(cuota.fecha_pago) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
