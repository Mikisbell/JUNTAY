'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { getCurrentUser, getDefaultEmpresaId } from '@/lib/utils/auth'
import { DNIAutoComplete } from '@/components/dni-autocomplete'

export default function NuevoClientePage() {
  const router = useRouter()
  const [tipoPersona, setTipoPersona] = useState<'natural' | 'juridica'>('natural')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    razon_social: '',
    representante_legal: '',
    telefono: '',
    celular: '',
    email: '',
    direccion: '',
    distrito: '',
    provincia: '',
    departamento: '',
    ocupacion: '',
    empresa_trabaja: '',
    ingreso_mensual: '',
    observaciones: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Manejar datos obtenidos de RENIEC
  const handleDatosRENIEC = (datos: any) => {
    setFormData({
      ...formData,
      numero_documento: datos.dni,
      nombres: datos.nombres,
      apellido_paterno: datos.apellido_paterno,
      apellido_materno: datos.apellido_materno || '',
      direccion: datos.direccion || formData.direccion
    })
    setError(null)
  }

  // Manejar cliente existente
  const handleClienteExistente = (clienteId: string, nombre: string) => {
    setError(`Cliente ya existe: ${nombre}`)
    // Opcionalmente redirigir al cliente existente
    setTimeout(() => {
      router.push(`/dashboard/clientes/${clienteId}`)
    }, 3000)
  }

  const validateForm = () => {
    if (!formData.numero_documento) {
      setError('El número de documento es requerido')
      return false
    }

    if (tipoPersona === 'natural') {
      if (!formData.nombres || !formData.apellido_paterno) {
        setError('Nombres y apellido paterno son requeridos')
        return false
      }
    } else {
      if (!formData.razon_social || !formData.representante_legal) {
        setError('Razón social y representante legal son requeridos')
        return false
      }
    }

    if (!formData.celular && !formData.telefono) {
      setError('Al menos un teléfono es requerido')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Obtener usuario y empresa
      const user = await getCurrentUser()
      const empresaId = await getDefaultEmpresaId()

      const clienteData = {
        tipo_persona: tipoPersona,
        tipo_documento: formData.tipo_documento,
        numero_documento: formData.numero_documento,
        ...(tipoPersona === 'natural' ? {
          nombres: formData.nombres,
          apellido_paterno: formData.apellido_paterno,
          apellido_materno: formData.apellido_materno || null,
        } : {
          razon_social: formData.razon_social,
          representante_legal: formData.representante_legal,
        }),
        email: formData.email || null,
        telefono_principal: formData.telefono || null,
        telefono_secundario: formData.celular || null,
        direccion: formData.direccion || null,
        distrito: formData.distrito || null,
        provincia: formData.provincia || null,
        departamento: formData.departamento || null,
        ocupacion: formData.ocupacion || null,
        empresa_trabaja: formData.empresa_trabaja || null,
        ingreso_mensual: formData.ingreso_mensual ? parseFloat(formData.ingreso_mensual) : null,
        observaciones: formData.observaciones || null,
        activo: true,
        calificacion_crediticia: 'bueno',
        empresa_id: empresaId,
        created_by: user?.id || null
      }

      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select()
        .single()

      if (supabaseError) throw supabaseError

      router.push('/dashboard/clientes?success=Cliente creado exitosamente')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el cliente')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/clientes">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
          <p className="text-gray-600">Registra un nuevo cliente en el sistema</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Tipo de Persona */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Persona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setTipoPersona('natural')}
              className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                tipoPersona === 'natural'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <p className="font-medium">Persona Natural</p>
              <p className="text-sm text-gray-600">DNI, Pasaporte, etc.</p>
            </button>
            <button
              type="button"
              onClick={() => setTipoPersona('juridica')}
              className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                tipoPersona === 'juridica'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <p className="font-medium">Persona Jurídica</p>
              <p className="text-sm text-gray-600">Empresa con RUC</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {tipoPersona === 'natural' ? (
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
                  >
                    <option value="DNI">DNI</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="CE">Carnet de Extranjería</option>
                  </select>
                </div>
                {formData.tipo_documento === 'DNI' ? (
                  <DNIAutoComplete
                    onDatosObtenidos={handleDatosRENIEC}
                    onClienteExistente={handleClienteExistente}
                    valorInicial={formData.numero_documento}
                    disabled={loading}
                  />
                ) : (
                  <div>
                    <Label htmlFor="numero_documento">Número de Documento *</Label>
                    <Input
                      id="numero_documento"
                      name="numero_documento"
                      value={formData.numero_documento}
                      onChange={handleInputChange}
                      placeholder={formData.tipo_documento === 'CE' ? 'CE12345678' : '12345678'}
                      maxLength={20}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    placeholder="Juan Carlos"
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
                    placeholder="Pérez"
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
                    placeholder="López"
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
                  <Label htmlFor="celular">Celular *</Label>
                  <Input
                    id="celular"
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                    placeholder="987654321"
                    maxLength={9}
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono Fijo</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="012345678"
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
                  placeholder="cliente@email.com"
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
                    placeholder="Lima"
                  />
                </div>
                <div>
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input
                    id="provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    placeholder="Lima"
                  />
                </div>
                <div>
                  <Label htmlFor="distrito">Distrito</Label>
                  <Input
                    id="distrito"
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                    placeholder="San Juan de Lurigancho"
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
                  placeholder="Av. Principal 123, Urb. Los Jardines"
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
                    placeholder="Comerciante"
                  />
                </div>
                <div>
                  <Label htmlFor="empresa_trabaja">Empresa donde Trabaja</Label>
                  <Input
                    id="empresa_trabaja"
                    name="empresa_trabaja"
                    value={formData.empresa_trabaja}
                    onChange={handleInputChange}
                    placeholder="Nombre de la empresa"
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
                  placeholder="2500.00"
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
                placeholder="Información adicional sobre el cliente..."
              />
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
                <Label htmlFor="numero_documento">RUC *</Label>
                <Input
                  id="numero_documento"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={handleInputChange}
                  placeholder="20123456789"
                  maxLength={11}
                  required
                />
              </div>

              <div>
                <Label htmlFor="razon_social">Razón Social *</Label>
                <Input
                  id="razon_social"
                  name="razon_social"
                  value={formData.razon_social}
                  onChange={handleInputChange}
                  placeholder="Empresa SAC"
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
                  placeholder="Nombre del representante"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="celular">Teléfono *</Label>
                  <Input
                    id="celular"
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                    placeholder="987654321"
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
                    placeholder="empresa@email.com"
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
                  placeholder="Dirección de la empresa"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Botones */}
      <div className="flex items-center justify-end space-x-4 pb-8">
        <Link href="/dashboard/clientes">
          <Button type="button" variant="outline" disabled={loading}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cliente
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
