'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Users,
  Clock,
  Settings,
  Calculator,
  Search,
  Filter,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Percent
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ModalidadPago {
  id?: string
  nombre: string
  tipo: 'semanal' | 'quincenal' | 'mensual'
  porcentaje_minimo: number
  plazo_maximo_semanas: number
  activa: boolean
  descripcion?: string
  created_at?: string
}

interface CronogramaFlexible {
  id?: string
  credito_id: string
  modalidad_id: string
  cliente_nombre: string
  monto_total: number
  monto_cuota: number
  cuotas_totales: number
  cuotas_pagadas: number
  estado: 'activo' | 'completado' | 'vencido' | 'suspendido'
  fecha_inicio: string
  fecha_fin: string
  proximo_pago?: string
  created_at?: string
}

interface EstadisticasPagos {
  totalCronogramas: number
  cronogramasActivos: number
  cronogramasCompletados: number
  cronogramasVencidos: number
  montoTotalGestionado: number
  ingresosMensuales: number
  tasaCumplimiento: number
  clientesActivos: number
}

export default function PagosFlexiblesPage() {
  const [modalidades, setModalidades] = useState<ModalidadPago[]>([])
  const [cronogramas, setCronogramas] = useState<CronogramaFlexible[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasPagos | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroModalidad, setFiltroModalidad] = useState<string>('todos')

  useEffect(() => {
    loadDatosPagosFlexibles()
  }, [])

  const loadDatosPagosFlexibles = async () => {
    try {
      setLoading(true)
      
      // Cargar modalidades (usar datos por defecto si no existe tabla)
      const modalidadesPorDefecto: ModalidadPago[] = [
        {
          id: '1',
          nombre: 'Pago Semanal',
          tipo: 'semanal',
          porcentaje_minimo: 5,
          plazo_maximo_semanas: 20,
          activa: true,
          descripcion: 'Pagos semanales con 5% mínimo del capital',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          nombre: 'Pago Quincenal',
          tipo: 'quincenal',
          porcentaje_minimo: 10,
          plazo_maximo_semanas: 24,
          activa: true,
          descripcion: 'Pagos quincenales con 10% mínimo del capital',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          nombre: 'Pago Mensual',
          tipo: 'mensual',
          porcentaje_minimo: 20,
          plazo_maximo_semanas: 52,
          activa: true,
          descripcion: 'Pagos mensuales con 20% mínimo del capital',
          created_at: new Date().toISOString()
        }
      ]
      
      setModalidades(modalidadesPorDefecto)
      
      // Generar cronogramas de ejemplo
      const cronogramasEjemplo = generarCronogramasEjemplo()
      setCronogramas(cronogramasEjemplo)
      
      // Calcular estadísticas
      const stats = calcularEstadisticas(cronogramasEjemplo)
      setEstadisticas(stats)
      
    } catch (error) {
      console.error('Error cargando datos:', error)
      toast.error('Error al cargar los datos de pagos flexibles')
    } finally {
      setLoading(false)
    }
  }

  const generarCronogramasEjemplo = (): CronogramaFlexible[] => {
    const ejemplos = []
    const nombres = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martín', 'Luis Rodríguez', 'Carmen Silva']
    const estados = ['activo', 'completado', 'vencido'] as const
    
    for (let i = 0; i < 15; i++) {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)]
      const estado = estados[Math.floor(Math.random() * estados.length)]
      const montoTotal = Math.floor(Math.random() * 5000) + 1000
      const cuotasTotales = Math.floor(Math.random() * 20) + 5
      const cuotasPagadas = estado === 'completado' ? cuotasTotales : Math.floor(Math.random() * cuotasTotales)
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - Math.floor(Math.random() * 90))
      
      ejemplos.push({
        id: `cronograma-${i}`,
        credito_id: `credito-${i}`,
        modalidad_id: Math.floor(Math.random() * 3) + 1 + '',
        cliente_nombre: nombre,
        monto_total: montoTotal,
        monto_cuota: Math.floor(montoTotal / cuotasTotales),
        cuotas_totales: cuotasTotales,
        cuotas_pagadas: cuotasPagadas,
        estado,
        fecha_inicio: fechaInicio.toISOString(),
        fecha_fin: new Date(fechaInicio.getTime() + cuotasTotales * 7 * 24 * 60 * 60 * 1000).toISOString(),
        proximo_pago: estado === 'activo' ? new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString() : undefined,
        created_at: fechaInicio.toISOString()
      })
    }
    
    return ejemplos
  }

  const calcularEstadisticas = (cronogramas: CronogramaFlexible[]): EstadisticasPagos => {
    const totalCronogramas = cronogramas.length
    const cronogramasActivos = cronogramas.filter(c => c.estado === 'activo').length
    const cronogramasCompletados = cronogramas.filter(c => c.estado === 'completado').length
    const cronogramasVencidos = cronogramas.filter(c => c.estado === 'vencido').length
    
    const montoTotalGestionado = cronogramas.reduce((sum, c) => sum + c.monto_total, 0)
    const ingresosMensuales = cronogramas
      .filter(c => c.estado === 'completado')
      .reduce((sum, c) => sum + c.monto_total, 0)
    
    const tasaCumplimiento = totalCronogramas > 0 
      ? (cronogramasCompletados / totalCronogramas) * 100 
      : 0
    
    const clientesActivos = new Set(cronogramas.filter(c => c.estado === 'activo').map(c => c.cliente_nombre)).size
    
    return {
      totalCronogramas,
      cronogramasActivos,
      cronogramasCompletados,
      cronogramasVencidos,
      montoTotalGestionado,
      ingresosMensuales,
      tasaCumplimiento,
      clientesActivos
    }
  }

  const filtrarCronogramas = () => {
    return cronogramas.filter(cronograma => {
      const matchesSearch = cronograma.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = filtroEstado === 'todos' || cronograma.estado === filtroEstado
      const matchesModalidad = filtroModalidad === 'todos' || cronograma.modalidad_id === filtroModalidad
      
      return matchesSearch && matchesEstado && matchesModalidad
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

  const getModalidadNombre = (modalidadId: string) => {
    const modalidad = modalidades.find(m => m.id === modalidadId)
    return modalidad?.nombre || 'Modalidad desconocida'
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
          <h1 className="text-3xl font-bold">Pagos Flexibles</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pagos Flexibles</h1>
          <p className="text-gray-600">Gestión de modalidades y cronogramas de pago</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/pagos-flexibles/simulador">
            <Button variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              Simulador
            </Button>
          </Link>
          <Link href="/dashboard/pagos-flexibles/configurar">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </Link>
          <Link href="/dashboard/pagos-flexibles/cronogramas">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cronograma
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cronogramas Activos</p>
                  <p className="text-2xl font-bold text-blue-600">{estadisticas.cronogramasActivos}</p>
                  <p className="text-xs text-gray-500">{estadisticas.clientesActivos} clientes</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa de Cumplimiento</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.tasaCumplimiento.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{estadisticas.cronogramasCompletados} completados</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monto Gestionado</p>
                  <p className="text-2xl font-bold text-purple-600">S/ {estadisticas.montoTotalGestionado.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Total en cronogramas</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cronogramas Vencidos</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.cronogramasVencidos}</p>
                  <p className="text-xs text-gray-500">Requieren atención</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modalidades Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Modalidades de Pago Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modalidades.filter(m => m.activa).map((modalidad) => (
              <div key={modalidad.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{modalidad.nombre}</h4>
                  <Badge variant="outline" className="capitalize">
                    {modalidad.tipo}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{modalidad.descripcion}</p>
                <div className="flex justify-between text-sm">
                  <span>Mínimo: {modalidad.porcentaje_minimo}%</span>
                  <span>Máximo: {modalidad.plazo_maximo_semanas} semanas</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
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
          
          <select
            value={filtroModalidad}
            onChange={(e) => setFiltroModalidad(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las Modalidades</option>
            {modalidades.map((modalidad) => (
              <option key={modalidad.id} value={modalidad.id}>
                {modalidad.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Cronogramas */}
      {cronogramasFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cronogramas</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroEstado !== 'todos' || filtroModalidad !== 'todos'
                ? 'No se encontraron cronogramas con los filtros aplicados'
                : 'Aún no hay cronogramas de pago flexibles'
              }
            </p>
            <Link href="/dashboard/pagos-flexibles/cronogramas">
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
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{cronograma.cliente_nombre}</h4>
                      <Badge variant={getEstadoBadge(cronograma.estado) as any}>
                        {cronograma.estado}
                      </Badge>
                      <Badge variant="outline">
                        {getModalidadNombre(cronograma.modalidad_id)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Monto Total</p>
                        <p className="font-semibold">S/ {cronograma.monto_total.toFixed(2)}</p>
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
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
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
                    <Link href={`/dashboard/pagos-flexibles/cronogramas/${cronograma.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/pagos-flexibles/cronogramas">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Plus className="h-5 w-5" />
                Nuevo Cronograma
              </Button>
            </Link>
            <Link href="/dashboard/pagos-flexibles/simulador">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Calculator className="h-5 w-5" />
                Simulador de Cuotas
              </Button>
            </Link>
            <Link href="/dashboard/pagos-flexibles/configurar">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Settings className="h-5 w-5" />
                Configurar Modalidades
              </Button>
            </Link>
            <Link href="/dashboard/creditos">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <CreditCard className="h-5 w-5" />
                Ver Créditos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      {cronogramasFiltrados.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Mostrando {cronogramasFiltrados.length} de {cronogramas.length} cronogramas
              </span>
              <span>
                Monto filtrado: S/ {cronogramasFiltrados.reduce((sum, c) => sum + c.monto_total, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
