import Link from "next/link"
import { 
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  DollarSign,
  FileText,
  Settings,
  Menu,
  Wallet,
  Calculator,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import { UserNav } from "@/components/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">JUNTAY</h1>
          <p className="text-sm text-gray-600">Casa de Empeño</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />}>
            Dashboard
          </NavItem>
          
          <div className="pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Gestión
            </p>
            <NavItem href="/dashboard/clientes" icon={<Users size={20} />}>
              Clientes
            </NavItem>
            <NavItem href="/dashboard/creditos" icon={<CreditCard size={20} />}>
              Créditos
            </NavItem>
            <NavItem href="/dashboard/garantias" icon={<Package size={20} />}>
              Garantías
            </NavItem>
            <NavItem href="/dashboard/cobranzas" icon={<Calculator size={20} />}>
              Cobranzas
            </NavItem>
          </div>
          
          <div className="pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Finanzas
            </p>
            <NavItem href="/dashboard/caja" icon={<Wallet size={20} />}>
              Control de Caja
            </NavItem>
          </div>
          
          <div className="pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Administración
            </p>
            <NavItem href="/dashboard/reportes" icon={<BarChart3 size={20} />}>
              Reportes
            </NavItem>
            <NavItem href="/dashboard/configuracion" icon={<Settings size={20} />}>
              Configuración
            </NavItem>
          </div>
        </nav>
        
        <div className="p-4 border-t">
          <LogoutButton />
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu size={24} />
          </Button>
          
          <UserNav />
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ 
  href, 
  icon, 
  children 
}: { 
  href: string
  icon: React.ReactNode
  children: React.ReactNode 
}) {
  return (
    <Link href={href}>
      <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors">
        {icon}
        <span>{children}</span>
      </div>
    </Link>
  )
}
