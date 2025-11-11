import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  CreditCard, 
  Shield, 
  TrendingUp, 
  Users,
  Package,
  DollarSign
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">JUNTAY</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Sistema Moderno de Casa de Empeño
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Gestiona tu negocio de forma eficiente con nuestro sistema completo 
          de préstamos con garantía, control de inventario y cobranzas.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8">
              Comenzar Ahora
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver Características
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Características Principales
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="h-10 w-10 text-blue-600" />}
            title="Gestión de Clientes"
            description="Registra y administra clientes con DNI/RUC, historial crediticio y documentación completa."
          />
          <FeatureCard
            icon={<CreditCard className="h-10 w-10 text-blue-600" />}
            title="Créditos y Préstamos"
            description="Solicitudes, evaluación, aprobación y cronogramas de pago automáticos."
          />
          <FeatureCard
            icon={<Package className="h-10 w-10 text-blue-600" />}
            title="Gestión de Garantías"
            description="Registro fotográfico de bienes empeñados con valuación y control de estado."
          />
          <FeatureCard
            icon={<DollarSign className="h-10 w-10 text-blue-600" />}
            title="Finanzas y Caja"
            description="Control de cajas, cuentas bancarias, cobranzas y movimientos financieros."
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-blue-600" />}
            title="Reportes Detallados"
            description="Análisis completo de cartera, moras, cobranzas y rendimiento del negocio."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-blue-600" />}
            title="Seguridad Total"
            description="Control de acceso por roles, auditoría completa y respaldo de datos."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Cloud Based</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Disponibilidad</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-blue-100">Usuarios</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Seguro</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 JUNTAY. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
