'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Loader2, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Caja {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  ubicacion?: string
  estado: string
  activa: boolean
  created_at: string
}

export default function EditarCajaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [caja, setCaja] = useState<Caja | null>(null)
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    ubicacion: '',
    estado: 'cerrada',
    activa: true
  })

  useEffect(() => {
    cargarCaja()
  }, [params.id])

  async function cargarCaja() {
    try {
      const { data, error } = await supabase
        .from('cajas')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Caja no encontrada')

      setCaja(data)
      setFormData({
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        ubicacion: data.ubicacion || '',
        estado: data.estado,
        activa: data.activa
      })
    } catch (err: any) {
      console.error('Error cargando caja:', err)
      setError(err.message || 'Error al cargar la caja')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      // Validaciones
      if (!formData.codigo || !formData.nombre) {
        throw new Error('Código y nombre son obligatorios')
      }

      // Verificar que el código no exista en otra caja
      if (formData.codigo !== caja?.codigo) {
        const { data: existingCaja } = await supabase
          .from('cajas')
          .select('id')
          .eq('codigo', formData.codigo)
          .neq('id', params.id)
          .single()

        if (existingCaja) {
          throw new Error('Ya existe otra caja con ese código')
        }
      }

      // Actualizar la caja
      const { error: updateError } = await supabase
        .from('cajas')
        .update({
          codigo: formData.codigo.toUpperCase(),
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          ubicacion: formData.ubicacion || null,
          estado: formData.estado,
          activa: formData.activa,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (updateError) throw updateError

      // Redirigir con éxito
      router.push('/dashboard/configuracion/cajas?success=Caja actualizada exitosamente')
    } catch (err: any) {
      console.error('Error actualizando caja:', err)
      setError(err.message || 'Error al actualizar la caja')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !caja) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/configuracion/cajas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/configuracion/cajas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Caja</h1>
          <p className="text-gray-600 mt-1">
            Modificar información de {caja?.codigo}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código de Caja *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                  placeholder="CAJA-01"
                  className="font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato recomendado: CAJA-XX
                </p>
              </div>

              <div>
                <Label htmlFor="nombre">Nombre de la Caja *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Caja Principal"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Descripción opcional de la caja..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                placeholder="Local Central - Piso 1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado y Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estado">Estado Actual</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cerrada">Cerrada</SelectItem>
                    <SelectItem value="abierta">Abierta</SelectItem>
                    <SelectItem value="en_arqueo">En Arqueo</SelectItem>
                    <SelectItem value="bloqueada">Bloqueada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Caja Activa</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, activa: !formData.activa})}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.activa ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.activa ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="text-sm text-gray-600">
                    {formData.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">ID:</span>
                <span className="ml-2 font-mono">{caja?.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Creada:</span>
                <span className="ml-2">
                  {caja?.created_at ? new Date(caja.created_at).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Link href="/dashboard/configuracion/cajas" className="flex-1">
            <Button type="button" variant="outline" className="w-full" disabled={saving}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
