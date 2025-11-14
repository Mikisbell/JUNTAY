'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  AlertTriangle, 
  Clock, 
  Calendar, 
  DollarSign,
  Users,
  TrendingUp,
  Search,
  Filter,
  Settings,
  Eye,
  Send,
  Gavel,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface CreditoVencimiento {
  id?: string
  numero_contrato: string
  cliente_nombre: string
  cliente_dni: string
  cliente_telefono?: string
  monto_prestado: number
  monto_pendiente: number
  fecha_vencimiento_legal: string
  dias_vencido: number
  dias_gracia_restantes: number
  estado_vencimiento: 'por_vencer' | 'en_gracia' | 'para_remate' | 'en_remate'
  notificaciones_enviadas: number
  fecha_ultima_notificacion?: string
  garantia_descripcion: string
  garantia_valor: number
  created_at?: string
}

interface EstadisticasVencimientos {
  totalCreditos: number
  porVencer: number
  enGracia: number
  paraRemate: number
  enRemate: number
  montoEnRiesgo: number
  tasaRecuperacion: number
  promedioGracia: number
}

export default function VencimientosPage() {
  const router = useRouter()
  const [creditos, setCreditos] = useState<CreditoVencimiento[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasVencimientos | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroUrgencia, setFiltroUrgencia] = useState<string>('todos')

  useEffect(() => {
    loadVencimientos()
  }, [])

  const loadVencimientos = async () => {
    try {
      setLoading(true)
      
      // Generar datos de ejemplo para vencimientos
      const creditosEjemplo = generarCreditosVencimiento()
      setCreditos(creditosEjemplo)
      
      // Calcular estadísticas
      const stats = calcularEstadisticas(creditosEjemplo)
      setEstadisticas(stats)
      
    } catch (error) {
      console.error('Error cargando vencimientos:', error)
      toast.error('Error al cargar los vencimientos')
    } finally {
      setLoading(false)
    }
  }

  const generarCreditosVencimiento = (): CreditoVencimiento[] => {
    const ejemplos = []
    const nombres = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martín', 'Luis Rodríguez', 'Carmen Silva']
    const garantias = ['Anillo de oro 18k', 'Laptop HP', 'Televisor Samsung 55"', 'Cadena de plata', 'Celular iPhone', 'Reloj Casio']
    const estados = ['por_vencer', 'en_gracia', 'para_remate'] as const
    
    for (let i = 0; i < 20; i++) {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)]
      const garantia = garantias[Math.floor(Math.random() * garantias.length)]
      const estado = estados[Math.floor(Math.random() * estados.length)]
      const montoPrestado = Math.floor(Math.random() * 3000) + 500
      const montoPendiente = montoPrestado * (0.7 + Math.random() * 0.3)
      const garantiaValor = montoPrestado * (1.2 + Math.random() * 0.5)
      
      // Calcular fechas según estado
      const fechaVencimiento = new Date()
      let diasVencido = 0
      let diasGraciaRestantes = 7
      
      if (estado === 'por_vencer') {
        fechaVencimiento.setDate(fechaVencimiento.getDate() + Math.floor(Math.random() * 7) + 1)
        diasVencido = 0
        diasGraciaRestantes = 7
      } else if (estado === 'en_gracia') {
        fechaVencimiento.setDate(fechaVencimiento.getDate() - Math.floor(Math.random() * 7) - 1)
        diasVencido = Math.abs(Math.floor((fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        diasGraciaRestantes = Math.max(0, 7 - diasVencido)
      } else {
        fechaVencimiento.setDate(fechaVencimiento.getDate() - Math.floor(Math.random() * 10) - 8)
        diasVencido = Math.abs(Math.floor((fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        diasGraciaRestantes = 0
      }
      
      ejemplos.push({
        id: `credito-${i}`,
        numero_contrato: `CON-2025-${String(i + 1).padStart(6, '0')}`,
        cliente_nombre: nombre,
        cliente_dni: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        cliente_telefono: `9${Math.floor(Math.random() * 90000000) + 10000000}`,
        monto_prestado: montoPrestado,
        monto_pendiente: Math.round(montoPendiente),
        fecha_vencimiento_legal: fechaVencimiento.toISOString(),
        dias_vencido: diasVencido,
        dias_gracia_restantes: diasGraciaRestantes,
        estado_vencimiento: estado,
        notificaciones_enviadas: Math.floor(Math.random() * 5),
        fecha_ultima_notificacion: estado !== 'por_vencer' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        garantia_descripcion: garantia,
        garantia_valor: Math.round(garantiaValor),
        created_at: fechaVencimiento.toISOString()
      })
    }
    
    return ejemplos.sort((a, b) => {
      // Ordenar por urgencia: para_remate > en_gracia > por_vencer
      const prioridad = { 'para_remate': 3, 'en_gracia': 2, 'por_vencer': 1 }
      return prioridad[b.estado_vencimiento] - prioridad[a.estado_vencimiento]
    })
  }

  const calcularEstadisticas = (creditos: CreditoVencimiento[]): EstadisticasVencimientos => {
    const totalCreditos = creditos.length
    const porVencer = creditos.filter(c => c.estado_vencimiento === 'por_vencer').length
    const enGracia = creditos.filter(c => c.estado_vencimiento === 'en_gracia').length
    const paraRemate = creditos.filter(c => c.estado_vencimiento === 'para_remate').length
    const enRemate = creditos.filter(c => c.estado_vencimiento === 'en_remate').length
    
    const montoEnRiesgo = creditos
      .filter(c => ['en_gracia', 'para_remate'].includes(c.estado_vencimiento))
      .reduce((sum, c) => sum + c.monto_pendiente, 0)
    
    const tasaRecuperacion = totalCreditos > 0 ? 
      ((totalCreditos - paraRemate - enRemate) / totalCreditos) * 100 : 0
    
    const promedioGracia = enGracia > 0 ?
      creditos.filter(c => c.estado_vencimiento === 'en_gracia')
              .reduce((sum, c) => sum + c.dias_gracia_restantes, 0) / enGracia : 0
    
    return {
      totalCreditos,
      porVencer,
      enGracia,
      paraRemate,
      enRemate,
      montoEnRiesgo,
      tasaRecuperacion,
      promedioGracia
    }
  }

  const filtrarCreditos = () => {
    return creditos.filter(credito => {
      const matchesSearch = credito.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           credito.numero_contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           credito.cliente_dni.includes(searchTerm)
      
      const matchesEstado = filtroEstado === 'todos' || credito.estado_vencimiento === filtroEstado
      
      let matchesUrgencia = true
      if (filtroUrgencia === 'critico') {
        matchesUrgencia = credito.estado_vencimiento === 'para_remate' || 
                         (credito.estado_vencimiento === 'en_gracia' && credito.dias_gracia_restantes <= 2)
      } else if (filtroUrgencia === 'urgente') {
        matchesUrgencia = credito.estado_vencimiento === 'en_gracia' && credito.dias_gracia_restantes <= 5
      } else if (filtroUrgencia === 'normal') {
        matchesUrgencia = credito.estado_vencimiento === 'por_vencer'
      }
      
      return matchesSearch && matchesEstado && matchesUrgencia
    })
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'por_vencer': 'secondary',
      'en_gracia': 'default',
      'para_remate': 'destructive',
      'en_remate': 'outline'
    }
    return variants[estado as keyof typeof variants] || 'secondary'
  }

  const getUrgenciaColor = (credito: CreditoVencimiento) => {
    if (credito.estado_vencimiento === 'para_remate') return 'text-red-600'
    if (credito.estado_vencimiento === 'en_gracia' && credito.dias_gracia_restantes <= 2) return 'text-red-600'
    if (credito.estado_vencimiento === 'en_gracia' && credito.dias_gracia_restantes <= 5) return 'text-orange-600'
    return 'text-blue-600'
  }

  const enviarRecordatorio = async (creditoId: string) => {
    toast.success('Recordatorio enviado exitosamente')
    // Aquí iría la integración con el módulo de notificaciones
  }

  const procesarRemate = async (credito: CreditoVencimiento) => {
    toast.success('Crédito enviado al proceso de remate')
    // Aquí iría la integración con el módulo de remates
    router.push(`/dashboard/remates/nuevo?contrato=${encodeURIComponent(credito.numero_contrato)}`)
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const creditosFiltrados = filtrarCreditos()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Proceso de Vencimientos</h1>
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
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Proceso de Vencimientos</h1>
          <p className="text-sm text-gray-600">Control automático de vencimientos y período de gracia</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/vencimientos/configuracion">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </Link>
          <Button onClick={() => loadVencimientos()}>
            <Timer className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Período de Gracia</p>
                  <p className="text-2xl font-bold text-orange-600">{estadisticas.enGracia}</p>
                  <p className="text-xs text-gray-500">Promedio: {estadisticas.promedioGracia.toFixed(1)} días</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Para Remate</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.paraRemate}</p>
                  <p className="text-xs text-gray-500">Acción requerida</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monto en Riesgo</p>
                  <p className="text-2xl font-bold text-purple-600">S/ {estadisticas.montoEnRiesgo.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Gracia + Remate</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa Recuperación</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.tasaRecuperacion.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Histórica</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/vencimientos/en-gracia">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Créditos en Gracia</h3>
                  <p className="text-sm text-gray-600">Gestionar período de gracia</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">{estadisticas?.enGracia || 0}</p>
                </div>
                <Clock className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/vencimientos/para-remate">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Listos para Remate</h3>
                  <p className="text-sm text-gray-600">Procesar automáticamente</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">{estadisticas?.paraRemate || 0}</p>
                </div>
                <Gavel className="h-12 w-12 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/vencimientos/configuracion">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Configuración</h3>
                  <p className="text-sm text-gray-600">Períodos y automatización</p>
                  <p className="text-sm font-medium text-blue-600 mt-2">7 días gracia</p>
                </div>
                <Settings className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente, contrato o DNI..."
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
            <option value="por_vencer">Por Vencer</option>
            <option value="en_gracia">En Gracia</option>
            <option value="para_remate">Para Remate</option>
            <option value="en_remate">En Remate</option>
          </select>
          
          <select
            value={filtroUrgencia}
            onChange={(e) => setFiltroUrgencia(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las Urgencias</option>
            <option value="critico">Crítico (≤2 días)</option>
            <option value="urgente">Urgente (≤5 días)</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Lista de Créditos */}
      {creditosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay créditos en proceso</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroEstado !== 'todos' || filtroUrgencia !== 'todos'
                ? 'No se encontraron créditos con los filtros aplicados'
                : 'Todos los créditos están al día'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {creditosFiltrados.map((credito) => (
            <Card key={credito.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold">{credito.cliente_nombre}</h4>
                      <Badge variant={getEstadoBadge(credito.estado_vencimiento) as "default" | "secondary" | "destructive" | "outline"}>
                        {credito.estado_vencimiento.replace('_', ' ')}
                      </Badge>
                      <span className={`text-sm font-medium ${getUrgenciaColor(credito)}`}>
                        {credito.estado_vencimiento === 'para_remate' ? 'CRÍTICO' :
                         credito.estado_vencimiento === 'en_gracia' && credito.dias_gracia_restantes <= 2 ? 'CRÍTICO' :
                         credito.estado_vencimiento === 'en_gracia' && credito.dias_gracia_restantes <= 5 ? 'URGENTE' : 'NORMAL'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Contrato</p>
                        <p className="font-semibold">{credito.numero_contrato}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monto Pendiente</p>
                        <p className="font-semibold">S/ {credito.monto_pendiente.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Vencimiento</p>
                        <p className="font-semibold">{formatFecha(credito.fecha_vencimiento_legal)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          {credito.estado_vencimiento === 'por_vencer' ? 'Días Restantes' : 
                           credito.estado_vencimiento === 'en_gracia' ? 'Gracia Restante' : 'Días Vencido'}
                        </p>
                        <p className={`font-semibold ${getUrgenciaColor(credito)}`}>
                          {credito.estado_vencimiento === 'por_vencer' ? 
                            Math.ceil((new Date(credito.fecha_vencimiento_legal).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) :
                           credito.estado_vencimiento === 'en_gracia' ? 
                            `${credito.dias_gracia_restantes} días` : 
                            `${credito.dias_vencido} días`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Notificaciones</p>
                        <p className="font-semibold">{credito.notificaciones_enviadas}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>Garantía:</strong> {credito.garantia_descripcion} (S/ {credito.garantia_valor.toFixed(2)})</p>
                      <p><strong>DNI:</strong> {credito.cliente_dni} | <strong>Teléfono:</strong> {credito.cliente_telefono}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link href={`/dashboard/creditos/${credito.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                    
                    {credito.estado_vencimiento !== 'para_remate' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => enviarRecordatorio(credito.id!)}
                        className="w-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Recordatorio
                      </Button>
                    )}
                    
                    {credito.estado_vencimiento === 'para_remate' && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => procesarRemate(credito)}
                        className="w-full"
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Procesar Remate
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
                Mostrando {creditosFiltrados.length} de {creditos.length} créditos
              </span>
              <span>
                Monto filtrado en riesgo: S/ {creditosFiltrados
                  .filter(c => ['en_gracia', 'para_remate'].includes(c.estado_vencimiento))
                  .reduce((sum, c) => sum + c.monto_pendiente, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
