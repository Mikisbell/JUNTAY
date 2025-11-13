'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  DollarSign,
  Send,
  Phone,
  MessageSquare,
  Mail,
  Search,
  AlertCircle,
  CheckCircle,
  Timer,
  User,
  CreditCard,
  Gavel
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface CreditoEnGracia {
  id?: string
  numero_contrato: string
  cliente_nombre: string
  cliente_dni: string
  cliente_telefono?: string
  cliente_email?: string
  monto_prestado: number
  monto_pendiente: number
  fecha_vencimiento_legal: string
  dias_vencido: number
  dias_gracia_restantes: number
  notificaciones_enviadas: number
  fecha_ultima_notificacion?: string
  garantia_descripcion: string
  garantia_valor: number
  historial_pagos: number
  score_cliente: 'alto' | 'medio' | 'bajo'
  created_at?: string
}

export default function CreditosEnGraciaPage() {
  const [creditos, setCreditos] = useState<CreditoEnGracia[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroUrgencia, setFiltroUrgencia] = useState<string>('todos')
  const [filtroScore, setFiltroScore] = useState<string>('todos')
  const [procesandoAccion, setProcesandoAccion] = useState<string | null>(null)

  useEffect(() => {
    loadCreditosEnGracia()
  }, [])

  const loadCreditosEnGracia = async () => {
    try {
      setLoading(true)
      
      // Generar datos de ejemplo para créditos en gracia
      const creditosEjemplo = generarCreditosEnGracia()
      setCreditos(creditosEjemplo)
      
    } catch (error) {
      console.error('Error cargando créditos en gracia:', error)
      toast.error('Error al cargar los créditos en gracia')
    } finally {
      setLoading(false)
    }
  }

  const generarCreditosEnGracia = (): CreditoEnGracia[] => {
    const ejemplos = []
    const nombres = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martín', 'Luis Rodríguez', 'Carmen Silva', 'Pedro Morales', 'Rosa Jiménez']
    const garantias = ['Anillo de oro 18k', 'Laptop HP Pavilion', 'Televisor Samsung 55"', 'Cadena de plata 925', 'iPhone 14 Pro', 'Reloj Casio G-Shock']
    const scores = ['alto', 'medio', 'bajo'] as const
    
    for (let i = 0; i < 12; i++) {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)]
      const garantia = garantias[Math.floor(Math.random() * garantias.length)]
      const score = scores[Math.floor(Math.random() * scores.length)]
      const montoPrestado = Math.floor(Math.random() * 4000) + 800
      const montoPendiente = montoPrestado * (0.6 + Math.random() * 0.4)
      const garantiaValor = montoPrestado * (1.3 + Math.random() * 0.4)
      
      // Créditos en gracia: vencidos entre 1-7 días
      const diasVencido = Math.floor(Math.random() * 7) + 1
      const diasGraciaRestantes = Math.max(0, 7 - diasVencido)
      
      const fechaVencimiento = new Date()
      fechaVencimiento.setDate(fechaVencimiento.getDate() - diasVencido)
      
      ejemplos.push({
        id: `gracia-${i}`,
        numero_contrato: `CON-2025-${String(i + 100).padStart(6, '0')}`,
        cliente_nombre: nombre,
        cliente_dni: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        cliente_telefono: `9${Math.floor(Math.random() * 90000000) + 10000000}`,
        cliente_email: `${nombre.toLowerCase().replace(' ', '.')}@email.com`,
        monto_prestado: montoPrestado,
        monto_pendiente: Math.round(montoPendiente),
        fecha_vencimiento_legal: fechaVencimiento.toISOString(),
        dias_vencido: diasVencido,
        dias_gracia_restantes: diasGraciaRestantes,
        notificaciones_enviadas: Math.floor(Math.random() * 4) + 1,
        fecha_ultima_notificacion: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        garantia_descripcion: garantia,
        garantia_valor: Math.round(garantiaValor),
        historial_pagos: Math.floor(Math.random() * 10) + 1,
        score_cliente: score,
        created_at: fechaVencimiento.toISOString()
      })
    }
    
    return ejemplos.sort((a, b) => a.dias_gracia_restantes - b.dias_gracia_restantes)
  }

  const filtrarCreditos = () => {
    return creditos.filter(credito => {
      const matchesSearch = credito.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           credito.numero_contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           credito.cliente_dni.includes(searchTerm)
      
      let matchesUrgencia = true
      if (filtroUrgencia === 'critico') {
        matchesUrgencia = credito.dias_gracia_restantes <= 1
      } else if (filtroUrgencia === 'urgente') {
        matchesUrgencia = credito.dias_gracia_restantes <= 3
      } else if (filtroUrgencia === 'moderado') {
        matchesUrgencia = credito.dias_gracia_restantes > 3
      }
      
      const matchesScore = filtroScore === 'todos' || credito.score_cliente === filtroScore
      
      return matchesSearch && matchesUrgencia && matchesScore
    })
  }

  const enviarRecordatorio = async (creditoId: string, tipo: 'whatsapp' | 'sms' | 'email') => {
    setProcesandoAccion(creditoId)
    
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Actualizar contador de notificaciones
      setCreditos(prev => prev.map(c => 
        c.id === creditoId 
          ? { ...c, notificaciones_enviadas: c.notificaciones_enviadas + 1, fecha_ultima_notificacion: new Date().toISOString() }
          : c
      ))
      
      toast.success(`Recordatorio ${tipo} enviado exitosamente`)
    } catch (error) {
      toast.error('Error al enviar recordatorio')
    } finally {
      setProcesandoAccion(null)
    }
  }

  const extenderGracia = async (creditoId: string, diasExtra: number) => {
    setProcesandoAccion(creditoId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setCreditos(prev => prev.map(c => 
        c.id === creditoId 
          ? { ...c, dias_gracia_restantes: c.dias_gracia_restantes + diasExtra }
          : c
      ))
      
      toast.success(`Gracia extendida por ${diasExtra} días`)
    } catch (error) {
      toast.error('Error al extender gracia')
    } finally {
      setProcesandoAccion(null)
    }
  }

  const procesarRemate = async (creditoId: string) => {
    if (!confirm('¿Está seguro de enviar este crédito al proceso de remate?')) return
    
    setProcesandoAccion(creditoId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remover de la lista
      setCreditos(prev => prev.filter(c => c.id !== creditoId))
      
      toast.success('Crédito enviado al proceso de remate')
    } catch (error) {
      toast.error('Error al procesar remate')
    } finally {
      setProcesandoAccion(null)
    }
  }

  const getUrgenciaColor = (diasRestantes: number) => {
    if (diasRestantes <= 1) return 'text-red-600 bg-red-50'
    if (diasRestantes <= 3) return 'text-orange-600 bg-orange-50'
    return 'text-blue-600 bg-blue-50'
  }

  const getScoreBadge = (score: string) => {
    const colors = {
      'alto': 'bg-green-100 text-green-800',
      'medio': 'bg-yellow-100 text-yellow-800',
      'bajo': 'bg-red-100 text-red-800'
    }
    return colors[score as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold">Créditos en Período de Gracia</h1>
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
            <h1 className="text-3xl font-bold text-gray-900">Créditos en Período de Gracia</h1>
            <p className="text-gray-600">Gestión activa del período de gracia de 7 días</p>
          </div>
        </div>
        <Button onClick={() => loadCreditosEnGracia()}>
          <Timer className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total en Gracia</p>
                <p className="text-2xl font-bold">{creditos.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Críticos (≤1 día)</p>
                <p className="text-2xl font-bold text-red-600">
                  {creditos.filter(c => c.dias_gracia_restantes <= 1).length}
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
                <p className="text-sm text-gray-600">Monto en Gracia</p>
                <p className="text-2xl font-bold text-purple-600">
                  S/ {creditos.reduce((sum, c) => sum + c.monto_pendiente, 0).toFixed(0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Promedio Gracia</p>
                <p className="text-2xl font-bold text-green-600">
                  {creditos.length > 0 
                    ? (creditos.reduce((sum, c) => sum + c.dias_gracia_restantes, 0) / creditos.length).toFixed(1)
                    : 0} días
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
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
            value={filtroUrgencia}
            onChange={(e) => setFiltroUrgencia(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las Urgencias</option>
            <option value="critico">Crítico (≤1 día)</option>
            <option value="urgente">Urgente (≤3 días)</option>
            <option value="moderado">Moderado (>3 días)</option>
          </select>
          
          <select
            value={filtroScore}
            onChange={(e) => setFiltroScore(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Scores</option>
            <option value="alto">Score Alto</option>
            <option value="medio">Score Medio</option>
            <option value="bajo">Score Bajo</option>
          </select>
        </div>
      </div>

      {/* Lista de Créditos */}
      {creditosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay créditos en gracia</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filtroUrgencia !== 'todos' || filtroScore !== 'todos'
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
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold">{credito.cliente_nombre}</h4>
                      <Badge className={getScoreBadge(credito.score_cliente)}>
                        Score {credito.score_cliente}
                      </Badge>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getUrgenciaColor(credito.dias_gracia_restantes)}`}>
                        {credito.dias_gracia_restantes <= 1 ? 'CRÍTICO' :
                         credito.dias_gracia_restantes <= 3 ? 'URGENTE' : 'MODERADO'}
                      </div>
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
                        <p className="text-gray-600">Gracia Restante</p>
                        <p className={`font-semibold ${credito.dias_gracia_restantes <= 1 ? 'text-red-600' : 'text-orange-600'}`}>
                          {credito.dias_gracia_restantes} días
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600 mb-1">Información del Cliente:</p>
                        <p><strong>DNI:</strong> {credito.cliente_dni}</p>
                        <p><strong>Teléfono:</strong> {credito.cliente_telefono}</p>
                        <p><strong>Email:</strong> {credito.cliente_email}</p>
                        <p><strong>Historial:</strong> {credito.historial_pagos} pagos</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Garantía:</p>
                        <p><strong>Descripción:</strong> {credito.garantia_descripcion}</p>
                        <p><strong>Valor:</strong> S/ {credito.garantia_valor.toFixed(2)}</p>
                        <p><strong>Vencimiento:</strong> {formatFecha(credito.fecha_vencimiento_legal)}</p>
                        <p><strong>Notificaciones:</strong> {credito.notificaciones_enviadas} enviadas</p>
                      </div>
                    </div>
                    
                    {credito.fecha_ultima_notificacion && (
                      <p className="text-xs text-gray-500">
                        Última notificación: {formatFecha(credito.fecha_ultima_notificacion)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="grid grid-cols-3 gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => enviarRecordatorio(credito.id!, 'whatsapp')}
                        disabled={procesandoAccion === credito.id}
                        className="text-xs"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => enviarRecordatorio(credito.id!, 'sms')}
                        disabled={procesandoAccion === credito.id}
                        className="text-xs"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => enviarRecordatorio(credito.id!, 'email')}
                        disabled={procesandoAccion === credito.id}
                        className="text-xs"
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => extenderGracia(credito.id!, 3)}
                        disabled={procesandoAccion === credito.id}
                        className="text-xs"
                      >
                        +3 días
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => extenderGracia(credito.id!, 7)}
                        disabled={procesandoAccion === credito.id}
                        className="text-xs"
                      >
                        +7 días
                      </Button>
                    </div>
                    
                    <Link href={`/dashboard/creditos/${credito.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Ver Cliente
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => procesarRemate(credito.id!)}
                      disabled={procesandoAccion === credito.id}
                      className="w-full"
                    >
                      <Gavel className="h-4 w-4 mr-2" />
                      Procesar Remate
                    </Button>
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
                Mostrando {creditosFiltrados.length} de {creditos.length} créditos en gracia
              </span>
              <span>
                Monto filtrado: S/ {creditosFiltrados.reduce((sum, c) => sum + c.monto_pendiente, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
