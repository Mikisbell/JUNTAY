'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function NuevaCajaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    ubicacion: '',
    estado: 'cerrada',
    activa: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validaciones
      if (!formData.codigo || !formData.nombre) {
        throw new Error('Código y nombre son obligatorios')
      }

      // Verificar que el código no exista
      const { data: existingCaja } = await supabase
        .from('cajas')
        .select('id')
        .eq('codigo', formData.codigo)
        .single()

      if (existingCaja) {
        throw new Error('Ya existe una caja con ese código')
      }

      // Crear la caja
      const { error: insertError } = await supabase
        .from('cajas')
        .insert([{
          codigo: formData.codigo.toUpperCase(),
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          ubicacion: formData.ubicacion || null,
          estado: formData.estado,
          activa: formData.activa
        }])

      if (insertError) throw insertError

      // Redirigir con éxito
      router.push('/dashboard/configuracion/cajas?success=Caja creada exitosamente')
    } catch (err: any) {
      console.error('Error creando caja:', err)
      setError(err.message || 'Error al crear la caja')
    } finally {
      setLoading(false)
    }
  }

  const generateCodigo = () => {
    const nextNumber = Math.floor(Math.random() * 99) + 1
    setFormData({
      ...formData,
      codigo: `CAJA-${nextNumber.toString().padStart(2, '0')}`
    })
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
          <h1 className="text-3xl font-bold text-gray-900">Nueva Caja</h1>
          <p className="text-gray-600 mt-1">Crear una nueva caja en el sistema</p>
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
                <div className="flex gap-2">
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                    placeholder="CAJA-01"
                    className="font-mono"
                    required
                  />
                  <Button type="button" variant="outline" onClick={generateCodigo}>
                    Auto
                  </Button>
                </div>
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
            <CardTitle>Configuración Inicial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estado">Estado Inicial</Label>
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

        {/* Vista Previa */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {formData.codigo || 'CÓDIGO'}
                    </span>
                    <span className={`w-3 h-3 rounded-full ${
                      formData.activa ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                  </div>
                  <h3 className="font-semibold text-lg mt-1">
                    {formData.nombre || 'Nombre de la Caja'}
                  </h3>
                  {formData.descripcion && (
                    <p className="text-sm text-gray-600">{formData.descripcion}</p>
                  )}
                  {formData.ubicacion && (
                    <p className="text-sm text-gray-500">📍 {formData.ubicacion}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    formData.estado === 'abierta' ? 'bg-green-100 text-green-800' :
                    formData.estado === 'cerrada' ? 'bg-gray-100 text-gray-800' :
                    formData.estado === 'en_arqueo' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {formData.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Link href="/dashboard/configuracion/cajas" className="flex-1">
            <Button type="button" variant="outline" className="w-full" disabled={loading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Crear Caja
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
