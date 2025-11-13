'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Wallet,
  Calculator
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ReporteFinanciero {
  periodo: string
  ingresos_totales: number
  ingresos_intereses: number
  ingresos_comisiones: number
  gastos_operativos: number
  gastos_financieros: number
  utilidad_bruta: number
  utilidad_neta: number
  roi: number
  margen_utilidad: number
}

interface AnalisisCartera {
  categoria: string
  monto_prestado: number
  monto_pendiente: number
  tasa_recuperacion: number
  provision_riesgo: number
  rentabilidad: number
}

interface FlujoCaja {
  concepto: string
  entrada: number
  salida: number
  neto: number
  acumulado: number
}

export default function ReportesFinancierosPage() {
  const [reportes, setReportes] = useState<ReporteFinanciero[]>([])
  const [cartera, setCartera] = useState<AnalisisCartera[]>([])
  const [flujo, setFlujo] = useState<FlujoCaja[]>([])
  const [loading, setLoading] = useState(true)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mensual')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    loadReportesFinancieros()
  }, [periodoSeleccionado])

  const loadReportesFinancieros = async () => {
    try {
      setLoading(true)
      
      const reportesEjemplo = generarReportesFinancieros()
      const carteraEjemplo = generarAnalisisCartera()
      const flujoEjemplo = generarFlujoCaja()
      
      setReportes(reportesEjemplo)
      setCartera(carteraEjemplo)
      setFlujo(flujoEjemplo)
      
    } catch (error) {
      console.error('Error cargando reportes financieros:', error)
      toast.error('Error al cargar los reportes financieros')
    } finally {
      setLoading(false)
    }
  }

  const generarReportesFinancieros = (): ReporteFinanciero[] => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
    return meses.map(mes => {
      const ingresos_intereses = Math.floor(Math.random() * 40000) + 60000
      const ingresos_comisiones = Math.floor(Math.random() * 15000) + 10000
      const ingresos_totales = ingresos_intereses + ingresos_comisiones
      const gastos_operativos = Math.floor(Math.random() * 25000) + 30000
      const gastos_financieros = Math.floor(Math.random() * 8000) + 5000
      const utilidad_bruta = ingresos_totales - gastos_operativos
      const utilidad_neta = utilidad_bruta - gastos_financieros
      
      return {
        periodo: mes,
        ingresos_totales,
        ingresos_intereses,
        ingresos_comisiones,
        gastos_operativos,
        gastos_financieros,
        utilidad_bruta,
        utilidad_neta,
        roi: (utilidad_neta / ingresos_totales) * 100,
        margen_utilidad: (utilidad_neta / ingresos_totales) * 100
      }
    })
  }

  const generarAnalisisCartera = (): AnalisisCartera[] => {
    return [
      {
        categoria: 'Joyas',
        monto_prestado: 450000,
        monto_pendiente: 320000,
        tasa_recuperacion: 92.5,
        provision_riesgo: 24000,
        rentabilidad: 18.5
      },
      {
        categoria: 'Electrónicos',
        monto_prestado: 280000,
        monto_pendiente: 195000,
        tasa_recuperacion: 88.2,
        provision_riesgo: 19500,
        rentabilidad: 16.8
      },
      {
        categoria: 'Vehículos',
        monto_prestado: 180000,
        monto_pendiente: 125000,
        tasa_recuperacion: 85.7,
        provision_riesgo: 17500,
        rentabilidad: 22.3
      },
      {
        categoria: 'Electrodomésticos',
        monto_prestado: 120000,
        monto_pendiente: 85000,
        tasa_recuperacion: 90.1,
        provision_riesgo: 8500,
        rentabilidad: 15.2
      },
      {
        categoria: 'Otros',
        monto_prestado: 95000,
        monto_pendiente: 68000,
        tasa_recuperacion: 87.3,
        provision_riesgo: 6800,
        rentabilidad: 14.7
      }
    ]
  }

  const generarFlujoCaja = (): FlujoCaja[] => {
    let acumulado = 0
    return [
      {
        concepto: 'Ingresos por Intereses',
        entrada: 85000,
        salida: 0,
        neto: 85000,
        acumulado: acumulado += 85000
      },
      {
        concepto: 'Ingresos por Comisiones',
        entrada: 15000,
        salida: 0,
        neto: 15000,
        acumulado: acumulado += 15000
      },
      {
        concepto: 'Gastos Operativos',
        entrada: 0,
        salida: 45000,
        neto: -45000,
        acumulado: acumulado -= 45000
      },
      {
        concepto: 'Gastos Financieros',
        entrada: 0,
        salida: 8000,
        neto: -8000,
        acumulado: acumulado -= 8000
      },
      {
        concepto: 'Inversión en Cartera',
        entrada: 0,
        salida: 120000,
        neto: -120000,
        acumulado: acumulado -= 120000
      },
      {
        concepto: 'Recuperación de Cartera',
        entrada: 95000,
        salida: 0,
        neto: 95000,
        acumulado: acumulado += 95000
      }
    ]
  }

  const exportarReporte = () => {
    toast.success('Reporte financiero exportado exitosamente')
  }

  const actualizarDatos = async () => {
    setLoading(true)
    await loadReportesFinancieros()
    toast.success('Datos actualizados')
  }

  const calcularTotales = () => {
    return reportes.reduce((acc, reporte) => ({
      ingresos_totales: acc.ingresos_totales + reporte.ingresos_totales,
      gastos_totales: acc.gastos_totales + reporte.gastos_operativos + reporte.gastos_financieros,
      utilidad_neta: acc.utilidad_neta + reporte.utilidad_neta,
      roi_promedio: acc.roi_promedio + reporte.roi
    }), {
      ingresos_totales: 0,
      gastos_totales: 0,
      utilidad_neta: 0,
      roi_promedio: 0
    })
  }

  const totales = calcularTotales()
  const roiPromedio = reportes.length > 0 ? totales.roi_promedio / reportes.length : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reportes Financieros</h1>
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reportes-gerenciales">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes Financieros</h1>
            <p className="text-gray-600">Análisis detallado de rentabilidad y flujo de caja</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={actualizarDatos} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={exportarReporte}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={periodoSeleccionado}
          onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="mensual">Mensual</option>
          <option value="trimestral">Trimestral</option>
          <option value="anual">Anual</option>
        </select>
        
        <div className="flex gap-2">
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="text-sm"
          />
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="text-sm"
          />
        </div>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Aplicar Filtros
        </Button>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-700">
                  S/ {totales.ingresos_totales.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Gastos Totales</p>
                <p className="text-2xl font-bold text-red-700">
                  S/ {totales.gastos_totales.toLocaleString()}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Utilidad Neta</p>
                <p className="text-2xl font-bold text-blue-700">
                  S/ {totales.utilidad_neta.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">ROI Promedio</p>
                <p className="text-2xl font-bold text-purple-700">
                  {roiPromedio.toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evolución Mensual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Evolución Financiera Mensual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Período</th>
                  <th className="text-right p-2">Ingresos</th>
                  <th className="text-right p-2">Gastos</th>
                  <th className="text-right p-2">Utilidad Neta</th>
                  <th className="text-right p-2">ROI</th>
                  <th className="text-right p-2">Margen</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((reporte, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{reporte.periodo}</td>
                    <td className="p-2 text-right text-green-600">
                      S/ {reporte.ingresos_totales.toLocaleString()}
                    </td>
                    <td className="p-2 text-right text-red-600">
                      S/ {(reporte.gastos_operativos + reporte.gastos_financieros).toLocaleString()}
                    </td>
                    <td className="p-2 text-right font-semibold">
                      S/ {reporte.utilidad_neta.toLocaleString()}
                    </td>
                    <td className="p-2 text-right">
                      <Badge variant={reporte.roi > 15 ? 'default' : 'secondary'}>
                        {reporte.roi.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="p-2 text-right">
                      {reporte.margen_utilidad.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Cartera */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Análisis de Cartera por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Categoría</th>
                    <th className="text-right p-2">Prestado</th>
                    <th className="text-right p-2">Pendiente</th>
                    <th className="text-right p-2">Recuperación</th>
                  </tr>
                </thead>
                <tbody>
                  {cartera.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{item.categoria}</td>
                      <td className="p-2 text-right">
                        S/ {item.monto_prestado.toLocaleString()}
                      </td>
                      <td className="p-2 text-right">
                        S/ {item.monto_pendiente.toLocaleString()}
                      </td>
                      <td className="p-2 text-right">
                        <Badge variant={item.tasa_recuperacion > 90 ? 'default' : 'secondary'}>
                          {item.tasa_recuperacion}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Rentabilidad por Categoría</h4>
              {cartera.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.categoria}</span>
                    <span className="font-semibold">{item.rentabilidad}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.rentabilidad / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flujo de Caja */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Flujo de Caja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Concepto</th>
                  <th className="text-right p-2">Entradas</th>
                  <th className="text-right p-2">Salidas</th>
                  <th className="text-right p-2">Neto</th>
                  <th className="text-right p-2">Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {flujo.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{item.concepto}</td>
                    <td className="p-2 text-right text-green-600">
                      {item.entrada > 0 ? `S/ ${item.entrada.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-2 text-right text-red-600">
                      {item.salida > 0 ? `S/ ${item.salida.toLocaleString()}` : '-'}
                    </td>
                    <td className={`p-2 text-right font-semibold ${item.neto > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      S/ {item.neto.toLocaleString()}
                    </td>
                    <td className={`p-2 text-right font-bold ${item.acumulado > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      S/ {item.acumulado.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores Clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Fortalezas Financieras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">ROI superior al objetivo</span>
                <Badge className="bg-green-100 text-green-800">18.5% &gt; 15%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Margen de utilidad saludable</span>
                <Badge className="bg-green-100 text-green-800">36.2%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Crecimiento en ingresos</span>
                <Badge className="bg-green-100 text-green-800">+12.5%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Áreas de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Optimizar gastos operativos</span>
                <Badge className="bg-orange-100 text-orange-800">-5% objetivo</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Mejorar recuperación vehículos</span>
                <Badge className="bg-yellow-100 text-yellow-800">85.7%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Diversificar fuentes ingreso</span>
                <Badge className="bg-blue-100 text-blue-800">Oportunidad</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
