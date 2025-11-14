'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { getCurrentUser } from '@/lib/utils/auth'
import type { CategoriaGarantia } from '@/lib/api/garantias'
import { UploadFotosGarantia } from '@/components/upload-fotos-garantia'

export default function NuevaGarantiaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<CategoriaGarantia[]>([])
  const [garantiaCreada, setGarantiaCreada] = useState<{id: string, codigo: string} | null>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    valor_comercial: '',
    valor_tasacion: '',
    valor_prestamo_maximo: '',
    estado_conservacion: 'bueno',
    ubicacion_fisica: '',
    ubicacion_estante: '',
    peso: '',
    dimensiones: '',
    material: '',
    color: '',
    requiere_evaluacion_especial: false,
    notas_tasador: '',
    observaciones: ''
  })

  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    const { data } = await supabase
      .from('categorias_garantia')
      .select('*')
      .eq('activo', true)
      .order('nombre')
    
    if (data) setCategorias(data)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.nombre || !formData.descripcion || !formData.valor_tasacion) {
      setError('Complete los campos requeridos')
      return
    }

    setLoading(true)

    try {
      // Obtener usuario actual
      const user = await getCurrentUser()

      // Generar código único
      const codigo = `GAR-${Date.now().toString().slice(-8)}`

      const garantiaData = {
        codigo,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria_id: formData.categoria_id || null,
        marca: formData.marca || null,
        modelo: formData.modelo || null,
        numero_serie: formData.numero_serie || null,
        valor_comercial: parseFloat(formData.valor_comercial) || parseFloat(formData.valor_tasacion),
        valor_tasacion: parseFloat(formData.valor_tasacion),
        valor_prestamo_maximo: parseFloat(formData.valor_prestamo_maximo) || parseFloat(formData.valor_tasacion) * 0.8,
        peso: parseFloat(formData.peso) || null,
        dimensiones: formData.dimensiones || null,
        material: formData.material || null,
        color: formData.color || null,
        ubicacion_estante: formData.ubicacion_estante || null,
        requiere_evaluacion_especial: formData.requiere_evaluacion_especial,
        notas_tasador: formData.notas_tasador || null,
        fecha_tasacion: new Date().toISOString().split('T')[0],
        estado: 'disponible',
        estado_conservacion: formData.estado_conservacion,
        ubicacion_fisica: formData.ubicacion_fisica || null,
        observaciones: formData.observaciones || null,
        tasado_por: user?.id || null,
        credito_id: null
      }

      const { data: garantiaInsertada, error: supabaseError } = await supabase
        .from('garantias')
        .insert([garantiaData])
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Mostrar sección de fotos
      setGarantiaCreada({
        id: garantiaInsertada.id,
        codigo: garantiaInsertada.codigo
      })
      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Error al registrar la garantía')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/garantias">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Nueva Garantía</h1>
          <p className="text-sm text-gray-600">Registra un bien empeñado</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-900">Información del Bien</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Detalles generales de la prenda que se registrará como garantía.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nombre">Nombre del Bien *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="iPhone 13 Pro Max"
                required
              />
            </div>

            <div>
              <Label htmlFor="categoria_id">Categoría</Label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="estado_conservacion">Estado de Conservación *</Label>
              <select
                id="estado_conservacion"
                name="estado_conservacion"
                value={formData.estado_conservacion}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                required
              >
                <option value="nuevo">Nuevo</option>
                <option value="muy_bueno">Muy Bueno</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="malo">Malo</option>
              </select>
            </div>

            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                placeholder="Apple"
              />
            </div>

            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                placeholder="iPhone 13 Pro Max 256GB"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="numero_serie">Número de Serie / IMEI</Label>
              <Input
                id="numero_serie"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleInputChange}
                placeholder="123456789012345"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="descripcion">Descripción Detallada *</Label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                placeholder="Describe el estado del bien, accesorios incluidos, etc."
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-900">Valuación</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Valores de referencia para definir el monto máximo de préstamo.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_comercial">Valor Comercial (S/)</Label>
              <Input
                id="valor_comercial"
                name="valor_comercial"
                type="number"
                value={formData.valor_comercial}
                onChange={handleInputChange}
                placeholder="3500.00"
                step="0.01"
              />
              <p className="text-xs text-gray-600 mt-1">Precio de mercado estimado</p>
            </div>

            <div>
              <Label htmlFor="valor_tasacion">Valor de Tasación (S/) *</Label>
              <Input
                id="valor_tasacion"
                name="valor_tasacion"
                type="number"
                value={formData.valor_tasacion}
                onChange={handleInputChange}
                placeholder="2500.00"
                step="0.01"
                required
              />
              <p className="text-xs text-gray-600 mt-1">Valor para el préstamo</p>
            </div>

            <div>
              <Label htmlFor="valor_prestamo_maximo">Valor Máximo Préstamo (S/)</Label>
              <Input
                id="valor_prestamo_maximo"
                name="valor_prestamo_maximo"
                type="number"
                value={formData.valor_prestamo_maximo}
                onChange={handleInputChange}
                placeholder="2000.00"
                step="0.01"
              />
              <p className="text-xs text-gray-600 mt-1">Máximo a prestar (80% por defecto)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-900">Características Físicas</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Peso, dimensiones y materiales que ayudan a identificar el bien.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                name="peso"
                type="number"
                value={formData.peso}
                onChange={handleInputChange}
                placeholder="0.240"
                step="0.001"
              />
            </div>

            <div>
              <Label htmlFor="dimensiones">Dimensiones</Label>
              <Input
                id="dimensiones"
                name="dimensiones"
                value={formData.dimensiones}
                onChange={handleInputChange}
                placeholder="15.7 x 7.65 x 0.76 cm"
              />
            </div>

            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="Aluminio, Vidrio"
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Azul Sierra"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-900">Ubicación y Control</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Información para localizar físicamente la prenda dentro del almacén.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ubicacion_fisica">Ubicación Física</Label>
              <Input
                id="ubicacion_fisica"
                name="ubicacion_fisica"
                value={formData.ubicacion_fisica}
                onChange={handleInputChange}
                placeholder="Almacén Principal"
              />
            </div>

            <div>
              <Label htmlFor="ubicacion_estante">Estante Específico</Label>
              <Input
                id="ubicacion_estante"
                name="ubicacion_estante"
                value={formData.ubicacion_estante}
                onChange={handleInputChange}
                placeholder="A3-C5"
              />
            </div>
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="requiere_evaluacion_especial"
                checked={formData.requiere_evaluacion_especial}
                onChange={(e) => setFormData({...formData, requiere_evaluacion_especial: e.target.checked})}
                className="rounded border-gray-300"
              />
              <span>Requiere evaluación especial</span>
            </Label>
            <p className="text-xs text-gray-600 mt-1">Para joyas, arte, antigüedades, etc.</p>
          </div>

          <div>
            <Label htmlFor="notas_tasador">Notas del Tasador</Label>
            <textarea
              id="notas_tasador"
              name="notas_tasador"
              value={formData.notas_tasador}
              onChange={handleInputChange}
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
              placeholder="Observaciones técnicas del tasador..."
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones Generales</Label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
              placeholder="Notas adicionales..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección de fotos - Solo visible después de crear la garantía */}
      {garantiaCreada && (
        <Card>
          <CardHeader>
            <CardTitle>📸 Fotos de la Garantía - {garantiaCreada.codigo}</CardTitle>
            <p className="text-sm text-gray-600">
              Sube fotos de la prenda para documentar su estado y características
            </p>
          </CardHeader>
          <CardContent>
            <UploadFotosGarantia 
              garantiaId={garantiaCreada.id}
              onUploadComplete={() => {
                console.log('Fotos subidas correctamente')
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-end space-x-4 pb-8">
        <Link href="/dashboard/garantias">
          <Button type="button" variant="outline" disabled={loading}>
            {garantiaCreada ? 'Volver a Garantías' : 'Cancelar'}
          </Button>
        </Link>
        
        {!garantiaCreada ? (
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Registrar Garantía
              </>
            )}
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={() => router.push(`/dashboard/garantias?success=Garantía ${garantiaCreada.codigo} registrada exitosamente`)}
          >
            ✅ Finalizar
          </Button>
        )}
      </div>
    </form>
  )
}
