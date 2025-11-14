'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Database,
  Wifi
} from 'lucide-react'

interface KPI {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease'
  icon: any
  color: string
}

interface Alert {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  time: string
  category: string
}

interface SystemMetric {
  name: string
  value: number
  status: 'good' | 'warning' | 'critical'
  unit: string
}

export default function DashboardEjecutivo() {
  const [realTimeData, setRealTimeData] = useState({
    kpis: [] as KPI[],
    alerts: [] as Alert[],
    systemMetrics: [] as SystemMetric[],
    lastUpdate: new Date()
  })

  const [isConnected, setIsConnected] = useState(true)

  // Simular datos en tiempo real
  useEffect(() => {
    const updateData = () => {
      setRealTimeData({
        kpis: [
          {
            title: 'Ingresos Hoy',
            value: 'S/ 12,450',
            change: 15.2,
            changeType: 'increase',
            icon: DollarSign,
            color: 'text-green-600'
          },
          {
            title: 'Préstamos Activos',
            value: 247,
            change: 3.1,
            changeType: 'increase',
            icon: Users,
            color: 'text-blue-600'
          },
          {
            title: 'Tasa de Morosidad',
            value: '2.8%',
            change: -0.5,
            changeType: 'decrease',
            icon: AlertTriangle,
            color: 'text-orange-600'
          },
          {
            title: 'ROI Mensual',
            value: '18.5%',
            change: 2.3,
            changeType: 'increase',
            icon: TrendingUp,
            color: 'text-purple-600'
          },
          {
            title: 'Efectivo Disponible',
            value: 'S/ 45,200',
            change: -8.2,
            changeType: 'decrease',
            icon: Target,
            color: 'text-indigo-600'
          },
          {
            title: 'Operaciones Hoy',
            value: 89,
            change: 12.4,
            changeType: 'increase',
            icon: Activity,
            color: 'text-cyan-600'
          }
        ],
        alerts: [
          {
            id: '1',
            title: 'Saldo bajo en Caja General (18%)',
            severity: 'high',
            time: '2 min',
            category: 'Financiero'
          },
          {
            id: '2',
            title: '15 contratos vencen mañana',
            severity: 'medium',
            time: '5 min',
            category: 'Operacional'
          },
          {
            id: '3',
            title: 'Backup completado exitosamente',
            severity: 'low',
            time: '1 hora',
            category: 'Sistema'
          },
          {
            id: '4',
            title: 'Transacción inusual detectada: S/ 8,500',
            severity: 'medium',
            time: '15 min',
            category: 'Seguridad'
          }
        ],
        systemMetrics: [
          { name: 'CPU', value: 45, status: 'good', unit: '%' },
          { name: 'Memoria', value: 67, status: 'warning', unit: '%' },
          { name: 'Almacenamiento', value: 23, status: 'good', unit: '%' },
          { name: 'Conexiones DB', value: 12, status: 'good', unit: '' },
          { name: 'Tiempo Respuesta', value: 180, status: 'good', unit: 'ms' },
          { name: 'Uptime', value: 99.8, status: 'good', unit: '%' }
        ],
        lastUpdate: new Date()
      })
    }

    // Actualizar inmediatamente
    updateData()

    // Actualizar cada 30 segundos
    const interval = setInterval(updateData, 30000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
          <p className="text-gray-600">Monitoreo en tiempo real - Casa de Empeño JUNTAY</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Última actualización: {realTimeData.lastUpdate.toLocaleTimeString('es-PE')}
          </div>
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {realTimeData.kpis.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className={`flex items-center ${
                  kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(kpi.change)}%
                  </span>
                </div>
                <span className="text-sm text-gray-600 ml-2">vs ayer</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertas y Métricas del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Activas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Alertas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realTimeData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.category}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">hace {alert.time}</p>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {realTimeData.systemMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                    <p className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}{metric.unit}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos en Tiempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flujo de Efectivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Flujo de Efectivo (Últimas 24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de flujo de efectivo</p>
                <p className="text-sm text-gray-500">Actualización en tiempo real</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribución de Cartera */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Distribución de Cartera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Distribución por estado</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span>Al día</span>
                    </div>
                    <span className="font-semibold">85.2%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span>Próximo vencimiento</span>
                    </div>
                    <span className="font-semibold">12.0%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span>En mora</span>
                    </div>
                    <span className="font-semibold">2.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: '14:32',
                action: 'Nuevo préstamo otorgado',
                details: 'S/ 2,500 - Cliente: María García',
                type: 'success'
              },
              {
                time: '14:28',
                action: 'Pago de interés recibido',
                details: 'S/ 180 - Contrato: PRES-2024-156',
                type: 'info'
              },
              {
                time: '14:15',
                action: 'Alerta de saldo bajo',
                details: 'Caja General: 18% del total',
                type: 'warning'
              },
              {
                time: '14:02',
                action: 'Desempeño procesado',
                details: 'S/ 1,800 - Contrato: PRES-2024-089',
                type: 'success'
              },
              {
                time: '13:45',
                action: 'Backup automático completado',
                details: 'Backup incremental - 2.3MB',
                type: 'info'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="text-sm text-gray-500 font-mono min-w-[50px]">
                  {activity.time}
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer con información del sistema */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Base de datos: Operativa</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span>Conexión: Estable</span>
          </div>
        </div>
        <div>
          JUNTAY v2.0 - Dashboard Ejecutivo en Tiempo Real
        </div>
      </div>
    </div>
  )
}
