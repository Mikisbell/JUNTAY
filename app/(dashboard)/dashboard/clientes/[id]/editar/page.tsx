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
import type { Cliente } from '@/lib/api/clientes'

export default function EditarClientePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    razon_social: '',
    representante_legal: '',
    telefono_principal: '',
    telefono_secundario: '',
    email: '',
    direccion: '',
    distrito: '',
    provincia: '',
    departamento: '',
    referencia: '',
    ocupacion: '',
    empresa_trabaja: '',
    ingreso_mensual: '',
    observaciones: '',
    activo: true
  })

  useEffect(() => {
    loadCliente()
  }, [params.id])

  const loadCliente = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (data) {
        setCliente(data)
        setFormData({
          tipo_documento: data.tipo_documento || 'DNI',
          numero_documento: data.numero_documento || '',
          nombres: data.nombres || '',
          apellido_paterno: data.apellido_paterno || '',
          apellido_materno: data.apellido_materno || '',
          razon_social: data.razon_social || '',
          representante_legal: data.representante_legal || '',
          telefono_principal: data.telefono_principal || '',
          telefono_secundario: data.telefono_secundario || '',
          email: data.email || '',
          direccion: data.direccion || '',
          distrito: data.distrito || '',
          provincia: data.provincia || '',
          departamento: data.departamento || '',
          referencia: data.referencia || '',
          ocupacion: data.ocupacion || '',
          empresa_trabaja: data.empresa_trabaja || '',
          ingreso_mensual: data.ingreso_mensual?.toString() || '',
          observaciones: data.observaciones || '',
          activo: data.activo ?? true
        })
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const updateData = {
        tipo_documento: formData.tipo_documento,
        numero_documento: formData.numero_documento,
        ...(cliente?.tipo_persona === 'natural' ? {
          nombres: formData.nombres,
          apellido_paterno: formData.apellido_paterno,
          apellido_materno: formData.apellido_materno || null,
        } : {
          razon_social: formData.razon_social,
          representante_legal: formData.representante_legal,
        }),
        email: formData.email || null,
        telefono_principal: formData.telefono_principal || null,
        telefono_secundario: formData.telefono_secundario || null,
        direccion: formData.direccion || null,
        distrito: formData.distrito || null,
        provincia: formData.provincia || null,
        departamento: formData.departamento || null,
        referencia: formData.referencia || null,
        ocupacion: formData.ocupacion || null,
        empresa_trabaja: formData.empresa_trabaja || null,
        ingreso_mensual: formData.ingreso_mensual ? parseFloat(formData.ingreso_mensual) : null,
        observaciones: formData.observaciones || null,
        activo: formData.activo,
        updated_at: new Date().toISOString()
      }

      const { error: supabaseError } = await supabase
        .from('clientes')
        .update(updateData)
        .eq('id', params.id)

      if (supabaseError) throw supabaseError

      router.push(`/dashboard/clientes/${params.id}?success=Cliente actualizado exitosamente`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el cliente')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cliente no encontrado</p>
        <Link href="/dashboard/clientes">
          <Button className="mt-4">Volver al listado</Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/clientes/${params.id}`}>
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-gray-600">
            {cliente.tipo_persona === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {cliente.tipo_persona === 'natural' ? (
        <>
          {/* Datos de Identificación */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de Identificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                  <select
                    id="tipo_documento"
                    name="tipo_documento"
                    value={formData.tipo_documento}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    disabled
                  >
                    <option value="DNI">DNI</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="CE">Carnet de Extranjería</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="numero_documento">Número de Documento</Label>
                  <Input
                    id="numero_documento"
                    name="numero_documento"
                    value={formData.numero_documento}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellido_paterno">Apellido Paterno *</Label>
                  <Input
                    id="apellido_paterno"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellido_materno">Apellido Materno</Label>
                  <Input
                    id="apellido_materno"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono_secundario">Celular</Label>
                  <Input
                    id="telefono_secundario"
                    name="telefono_secundario"
                    value={formData.telefono_secundario}
                    onChange={handleInputChange}
                    maxLength={9}
                  />
                </div>
                <div>
                  <Label htmlFor="telefono_principal">Teléfono Fijo</Label>
                  <Input
                    id="telefono_principal"
                    name="telefono_principal"
                    value={formData.telefono_principal}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input
                    id="provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="distrito">Distrito</Label>
                  <Input
                    id="distrito"
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="referencia">Referencia</Label>
                <Input
                  id="referencia"
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Datos Laborales */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Laborales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ocupacion">Ocupación</Label>
                  <Input
                    id="ocupacion"
                    name="ocupacion"
                    value={formData.ocupacion}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="empresa_trabaja">Empresa donde Trabaja</Label>
                  <Input
                    id="empresa_trabaja"
                    name="empresa_trabaja"
                    value={formData.empresa_trabaja}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ingreso_mensual">Ingreso Mensual (S/)</Label>
                <Input
                  id="ingreso_mensual"
                  name="ingreso_mensual"
                  type="number"
                  value={formData.ingreso_mensual}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="observaciones">Notas Adicionales</Label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
              />
            </CardContent>
          </Card>

          {/* Estado */}
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span>Cliente activo</span>
              </label>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Persona Jurídica */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de la Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="numero_documento">RUC</Label>
                <Input
                  id="numero_documento"
                  name="numero_documento"
                  value={formData.numero_documento}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="razon_social">Razón Social *</Label>
                <Input
                  id="razon_social"
                  name="razon_social"
                  value={formData.razon_social}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="representante_legal">Representante Legal *</Label>
                <Input
                  id="representante_legal"
                  name="representante_legal"
                  value={formData.representante_legal}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono_secundario">Teléfono *</Label>
                  <Input
                    id="telefono_secundario"
                    name="telefono_secundario"
                    value={formData.telefono_secundario}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Botones */}
      <div className="flex items-center justify-end space-x-4 pb-8">
        <Link href={`/dashboard/clientes/${params.id}`}>
          <Button type="button" variant="outline" disabled={saving}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
