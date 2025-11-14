'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Vault, 
  DollarSign, 
  Building2, 
  Users, 
  FileText, 
  Gem, 
  Gavel, 
  BarChart3, 
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

interface MainSection {
  id: string
  title: string
  icon: React.ReactNode
  href: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive'
  subsections: {
    id: string
    title: string
    href: string
    description?: string
  }[]
}

const mainSections: MainSection[] = [
  {
    id: 'boveda',
    title: 'Caja General',
    icon: <Vault className="h-5 w-5" />,
    href: '/dashboard/boveda',
    subsections: [
      { id: 'saldos', title: 'Saldos', href: '/dashboard/boveda/saldos', description: 'Vista general de efectivo' },
      { id: 'asignaciones', title: 'Asignaciones', href: '/dashboard/boveda/asignaciones', description: 'Entregas a cajas' },
      { id: 'movimientos', title: 'Movimientos', href: '/dashboard/boveda/movimientos', description: 'Historial completo' },
      { id: 'reportes', title: 'Reportes', href: '/dashboard/boveda/reportes', description: 'Análisis financiero' },
      { id: 'auditoria', title: 'Auditoría', href: '/dashboard/boveda/auditoria', description: 'Control y trazabilidad' }
    ]
  },
  {
    id: 'cajas',
    title: 'Cajas',
    icon: <DollarSign className="h-5 w-5" />,
    href: '/dashboard/cajas',
    subsections: [
      { id: 'mi-caja', title: 'Mi Caja', href: '/dashboard/cajas/mi-caja', description: 'Estado actual de mi turno' },
      { id: 'abrir', title: 'Abrir Turno', href: '/dashboard/cajas/abrir', description: 'Iniciar jornada laboral' },
      { id: 'cerrar', title: 'Cerrar Turno', href: '/dashboard/cajas/cerrar', description: 'Finalizar y arquear' },
      { id: 'historial', title: 'Historial', href: '/dashboard/cajas/historial', description: 'Movimientos del día' },
      { id: 'arqueos', title: 'Arqueos', href: '/dashboard/cajas/arqueos', description: 'Control de efectivo' }
    ]
  },
  {
    id: 'operaciones',
    title: 'Empeños',
    icon: <Building2 className="h-5 w-5" />,
    href: '/dashboard/operaciones',
    subsections: [
      { id: 'nuevo-prestamo', title: 'Nuevo Préstamo', href: '/dashboard/operaciones/nuevo-prestamo', description: 'Otorgar crédito prendario' },
      { id: 'pagar-interes', title: 'Pagar Interés', href: '/dashboard/operaciones/pagar-interes', description: 'Cobrar intereses mensuales' },
      { id: 'desempenar', title: 'Desempeñar', href: '/dashboard/operaciones/desempenar', description: 'Recuperar prenda' },
      { id: 'venta-remate', title: 'Venta Remate', href: '/dashboard/operaciones/venta-remate', description: 'Vender prenda rematada' },
      { id: 'consultas', title: 'Consultas', href: '/dashboard/operaciones/consultas', description: 'Buscar contratos' }
    ]
  },
  {
    id: 'clientes',
    title: 'Clientes',
    icon: <Users className="h-5 w-5" />,
    href: '/dashboard/clientes',
    subsections: [
      { id: 'listado', title: 'Listado', href: '/dashboard/clientes', description: 'Todos los clientes' },
      { id: 'nuevo', title: 'Nuevo Cliente', href: '/dashboard/clientes/nuevo', description: 'Registrar cliente' },
      { id: 'buscar', title: 'Buscar', href: '/dashboard/clientes/buscar', description: 'Localizar por DNI/nombre' }
    ]
  },
  {
    id: 'contratos',
    title: 'Contratos',
    icon: <FileText className="h-5 w-5" />,
    href: '/dashboard/contratos',
    subsections: [
      { id: 'activos', title: 'Activos', href: '/dashboard/contratos/activos', description: 'Préstamos vigentes' },
      { id: 'vencidos', title: 'Vencidos', href: '/dashboard/contratos/vencidos', description: 'Requieren atención' },
      { id: 'liquidados', title: 'Liquidados', href: '/dashboard/contratos/liquidados', description: 'Historial cerrado' }
    ]
  },
  {
    id: 'garantias',
    title: 'Garantías',
    icon: <Gem className="h-5 w-5" />,
    href: '/dashboard/garantias',
    subsections: [
      { id: 'inventario', title: 'Inventario', href: '/dashboard/garantias/inventario', description: 'Prendas en custodia' },
      { id: 'valuaciones', title: 'Valuaciones', href: '/dashboard/garantias/valuaciones', description: 'Tasaciones realizadas' },
      { id: 'fotos', title: 'Fotografías', href: '/dashboard/garantias/fotos', description: 'Galería de prendas' }
    ]
  },
  {
    id: 'remates',
    title: 'Remates',
    icon: <Gavel className="h-5 w-5" />,
    href: '/dashboard/remates',
    subsections: [
      { id: 'programados', title: 'Programados', href: '/dashboard/remates/programados', description: 'Próximos remates' },
      { id: 'en-curso', title: 'En Curso', href: '/dashboard/remates/en-curso', description: 'Subastas activas' },
      { id: 'historial', title: 'Historial', href: '/dashboard/remates/historial', description: 'Remates completados' }
    ]
  },
  {
    id: 'reportes',
    title: 'Reportes',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/dashboard/reportes',
    subsections: [
      { id: 'financiero', title: 'Financiero', href: '/dashboard/reportes/financiero', description: 'Estados y balances' },
      { id: 'operativo', title: 'Operativo', href: '/dashboard/reportes/operativo', description: 'Métricas de negocio' },
      { id: 'gerencial', title: 'Gerencial', href: '/dashboard/reportes/gerencial', description: 'KPIs ejecutivos' }
    ]
  },
  {
    id: 'configuracion',
    title: 'Configuración',
    icon: <Settings className="h-5 w-5" />,
    href: '/dashboard/configuracion',
    subsections: [
      { id: 'empresa', title: 'Empresa', href: '/dashboard/configuracion/empresa', description: 'Datos generales' },
      { id: 'usuarios', title: 'Usuarios', href: '/dashboard/configuracion/usuarios', description: 'Accesos y roles' },
      { id: 'parametros', title: 'Parámetros', href: '/dashboard/configuracion/parametros', description: 'Tasas e intereses' }
    ]
  }
]

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  
  // Determinar sección activa basada en la URL
  const activeSection = mainSections.find(section => 
    pathname.startsWith(section.href) || 
    section.subsections.some(sub => pathname.startsWith(sub.href))
  ) || mainSections[0]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">JUNTAY</h1>
              <p className="text-xs text-gray-500">Casa de Empeño</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {mainSections.map((section) => {
            const isActive = activeSection?.id === section.id
            
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  <span className="text-sm font-medium truncate">{section.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    isActive ? 'rotate-90' : ''
                  }`} />
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JP</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
              <p className="text-xs text-gray-500">Cajero Principal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col lg:mr-80">
        {/* Header Superior con Sub-navegación */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            {/* Sub-navegación horizontal (una sola línea, con scroll si es necesario) */}
            <nav className="hidden md:flex items-center gap-1 max-w-[60vw] overflow-x-auto">
              {activeSection?.subsections.map((subsection) => {
                const isSubActive = pathname === subsection.href
                
                return (
                  <Link
                    key={subsection.id}
                    href={subsection.href}
                    className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                      isSubActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {subsection.title}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Indicadores de Estado */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-600 border-green-200">
              🟢 Caja Abierta
            </Badge>
            <Badge variant="outline">
              S/ 15,420.00
            </Badge>
          </div>
        </header>

        {/* Contenido de la Página */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
