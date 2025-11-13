'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Calculator, 
  DollarSign,
  Calendar,
  Percent,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface SimulacionResultado {
  modalidad: string
  porcentaje: number
  cuotas_totales: number
  monto_cuota: number
  duracion_semanas: number
  duracion_meses: number
  total_pagado: number
  interes_total: number
  cronograma: CuotaSimulacion[]
}

interface CuotaSimulacion {
  numero: number
  fecha_vencimiento: Date
  monto: number
  capital: number
  interes: number
  saldo_restante: number
}

export default function SimuladorPagosFlexiblesPage() {
  const [formData, setFormData] = useState({
    monto_credito: 5000,
    modalidad: 'semanal' as 'semanal' | 'quincenal' | 'mensual',
    porcentaje_pago: 10,
    tasa_interes_anual: 36
  })
  
  const [simulaciones, setSimulaciones] = useState<SimulacionResultado[]>([])
  const [mostrarCronograma, setMostrarCronograma] = useState<SimulacionResultado | null>(null)

  const modalidadesDisponibles = [
    { 
      value: 'semanal', 
      label: 'Semanal', 
      porcentaje_min: 5, 
      porcentaje_max: 25,
      descripcion: 'Pagos cada 7 días'
    },
    { 
      value: 'quincenal', 
      label: 'Quincenal', 
      porcentaje_min: 10, 
      porcentaje_max: 40,
      descripcion: 'Pagos cada 15 días'
    },
    { 
      value: 'mensual', 
      label: 'Mensual', 
      porcentaje_min: 20, 
      porcentaje_max: 60,
      descripcion: 'Pagos cada 30 días'
    }
  ]

  const calcularSimulacion = (modalidad: string, porcentaje: number): SimulacionResultado => {
    const frecuenciaDias = modalidad === 'semanal' ? 7 : modalidad === 'quincenal' ? 15 : 30
    const frecuenciaAnual = 365 / frecuenciaDias
    const tasaPeriodo = formData.tasa_interes_anual / 100 / frecuenciaAnual
    
    // Cálculo de cuotas con interés compuesto
    const montoCuota = (formData.monto_credito * porcentaje) / 100
    let saldoRestante = formData.monto_credito
    const cronograma: CuotaSimulacion[] = []
    let numerosCuotas = 0
    
    const fechaInicio = new Date()
    
    while (saldoRestante > 0.01 && numerosCuotas < 200) { // Límite de seguridad
      numerosCuotas++
      
      const interesDelPeriodo = saldoRestante * tasaPeriodo
      const capitalDelPeriodo = Math.min(montoCuota - interesDelPeriodo, saldoRestante)
      
      if (capitalDelPeriodo <= 0) {
        // Si el interés es mayor que la cuota, ajustar
        break
      }
      
      saldoRestante -= capitalDelPeriodo
      
      const fechaVencimiento = new Date(fechaInicio)
      fechaVencimiento.setDate(fechaVencimiento.getDate() + numerosCuotas * frecuenciaDias)
      
      cronograma.push({
        numero: numerosCuotas,
        fecha_vencimiento: fechaVencimiento,
        monto: montoCuota,
        capital: capitalDelPeriodo,
        interes: interesDelPeriodo,
        saldo_restante: Math.max(0, saldoRestante)
      })
    }
    
    const totalPagado = cronograma.reduce((sum, cuota) => sum + cuota.monto, 0)
    const interesTotal = cronograma.reduce((sum, cuota) => sum + cuota.interes, 0)
    
    return {
      modalidad,
      porcentaje,
      cuotas_totales: cronograma.length,
      monto_cuota: montoCuota,
      duracion_semanas: Math.ceil(cronograma.length * frecuenciaDias / 7),
      duracion_meses: Math.ceil(cronograma.length * frecuenciaDias / 30),
      total_pagado: totalPagado,
      interes_total: interesTotal,
      cronograma
    }
  }

  const simularTodas = () => {
    const modalidadSeleccionada = modalidadesDisponibles.find(m => m.value === formData.modalidad)
    if (!modalidadSeleccionada) return
    
    const resultados: SimulacionResultado[] = []
    
    // Simular con porcentaje mínimo, medio y máximo
    const porcentajes = [
      modalidadSeleccionada.porcentaje_min,
      Math.round((modalidadSeleccionada.porcentaje_min + modalidadSeleccionada.porcentaje_max) / 2),
      modalidadSeleccionada.porcentaje_max
    ]
    
    porcentajes.forEach(porcentaje => {
      const simulacion = calcularSimulacion(formData.modalidad, porcentaje)
      resultados.push(simulacion)
    })
    
    setSimulaciones(resultados)
  }

  const simularPersonalizada = () => {
    const simulacion = calcularSimulacion(formData.modalidad, formData.porcentaje_pago)
    setSimulaciones([simulacion])
  }

  const formatFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getModalidadColor = (modalidad: string) => {
    const colors = {
      'semanal': 'text-green-600',
      'quincenal': 'text-blue-600',
      'mensual': 'text-purple-600'
    }
    return colors[modalidad as keyof typeof colors] || 'text-gray-600'
  }

  const modalidadSeleccionada = modalidadesDisponibles.find(m => m.value === formData.modalidad)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pagos-flexibles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulador de Pagos Flexibles</h1>
          <p className="text-gray-600">Calcula diferentes escenarios de pago para tus clientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Simulación */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Parámetros de Simulación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monto_credito">Monto del Crédito (S/)</Label>
                <Input
                  id="monto_credito"
                  type="number"
                  min="100"
                  max="100000"
                  step="100"
                  value={formData.monto_credito}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    monto_credito: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="modalidad">Modalidad de Pago</Label>
                <select
                  id="modalidad"
                  value={formData.modalidad}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    modalidad: e.target.value as any 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {modalidadesDisponibles.map((modalidad) => (
                    <option key={modalidad.value} value={modalidad.value}>
                      {modalidad.label} - {modalidad.descripcion}
                    </option>
                  ))}
                </select>
                {modalidadSeleccionada && (
                  <p className="text-xs text-gray-500 mt-1">
                    Porcentaje permitido: {modalidadSeleccionada.porcentaje_min}% - {modalidadSeleccionada.porcentaje_max}%
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="porcentaje_pago">Porcentaje de Pago (%)</Label>
                <Input
                  id="porcentaje_pago"
                  type="number"
                  min={modalidadSeleccionada?.porcentaje_min || 5}
                  max={modalidadSeleccionada?.porcentaje_max || 60}
                  step="0.5"
                  value={formData.porcentaje_pago}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    porcentaje_pago: parseFloat(e.target.value) || 0 
                  }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cuota estimada: S/ {((formData.monto_credito * formData.porcentaje_pago) / 100).toFixed(2)}
                </p>
              </div>
              
              <div>
                <Label htmlFor="tasa_interes">Tasa de Interés Anual (%)</Label>
                <Input
                  id="tasa_interes"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.tasa_interes_anual}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    tasa_interes_anual: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Button onClick={simularPersonalizada} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Simular Personalizada
                </Button>
                <Button onClick={simularTodas} variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Comparar Opciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resultados de Simulación */}
        <div className="lg:col-span-2">
          {simulaciones.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Simulador Listo</h3>
                <p className="text-gray-600 mb-4">
                  Configura los parámetros y ejecuta una simulación para ver los resultados
                </p>
                <div className="flex justify-center gap-2">
                  <Button onClick={simularPersonalizada}>
                    Simular Personalizada
                  </Button>
                  <Button onClick={simularTodas} variant="outline">
                    Comparar Opciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Resultados de Simulación</h3>
                <Badge variant="outline">
                  {simulaciones.length} escenario{simulaciones.length > 1 ? 's' : ''}
                </Badge>
              </div>
              
              {simulaciones.map((simulacion, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold capitalize">
                          Pago {simulacion.modalidad} - {simulacion.porcentaje}%
                        </h4>
                        <p className="text-sm text-gray-600">
                          {simulacion.cuotas_totales} cuotas de S/ {simulacion.monto_cuota.toFixed(2)}
                        </p>
                      </div>
                      <Badge className={getModalidadColor(simulacion.modalidad)}>
                        {simulacion.modalidad}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Duración</p>
                        <p className="font-semibold">
                          {simulacion.duracion_meses} meses
                        </p>
                        <p className="text-xs text-gray-500">
                          ({simulacion.duracion_semanas} semanas)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total a Pagar</p>
                        <p className="font-semibold text-blue-600">
                          S/ {simulacion.total_pagado.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Intereses</p>
                        <p className="font-semibold text-orange-600">
                          S/ {simulacion.interes_total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Costo Total</p>
                        <p className="font-semibold">
                          {((simulacion.interes_total / formData.monto_credito) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm">
                        {simulacion.interes_total / formData.monto_credito < 0.3 ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Opción recomendada</span>
                          </>
                        ) : simulacion.interes_total / formData.monto_credito > 0.6 ? (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600">Costo alto</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600">Opción moderada</span>
                          </>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMostrarCronograma(simulacion)}
                      >
                        Ver Cronograma
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Cronograma Detallado */}
      {mostrarCronograma && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Cronograma Detallado - Pago {mostrarCronograma.modalidad} {mostrarCronograma.porcentaje}%
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setMostrarCronograma(null)}>
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Monto Inicial</p>
                  <p className="text-xl font-bold text-blue-900">S/ {formData.monto_credito.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Cuota {mostrarCronograma.modalidad}</p>
                  <p className="text-xl font-bold text-green-900">S/ {mostrarCronograma.monto_cuota.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600">Total Cuotas</p>
                  <p className="text-xl font-bold text-purple-900">{mostrarCronograma.cuotas_totales}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600">Total Intereses</p>
                  <p className="text-xl font-bold text-orange-900">S/ {mostrarCronograma.interes_total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-left">#</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Fecha</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Cuota</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Capital</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Interés</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mostrarCronograma.cronograma.map((cuota) => (
                      <tr key={cuota.numero} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">{cuota.numero}</td>
                        <td className="border border-gray-300 px-3 py-2">
                          {formatFecha(cuota.fecha_vencimiento)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right font-medium">
                          S/ {cuota.monto.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-blue-600">
                          S/ {cuota.capital.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-orange-600">
                          S/ {cuota.interes.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          S/ {cuota.saldo_restante.toFixed(2)}
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
