'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { getCurrentUser, getDefaultEmpresaId } from '@/lib/utils/auth'
import { DNIAutoComplete } from '@/components/dni-autocomplete'
import { RUCAutoComplete } from '@/components/ruc-autocomplete'
import { UbicacionSelectorAPI } from '@/components/ubicacion-selector-api'

export default function NuevoClientePage() {
  const router = useRouter()
  const [tipoPersona, setTipoPersona] = useState<'natural' | 'juridica'>('natural')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mostrarDatosLaborales, setMostrarDatosLaborales] = useState(false)
  const [mostrarObservaciones, setMostrarObservaciones] = useState(false)
  
  // Tracking de campos auto-rellenados vs campos completados manualmente
  const [camposAutoRellenados, setCamposAutoRellenados] = useState<Set<string>>(new Set())
  const [camposCompletadosManualmente, setCamposCompletadosManualmente] = useState<Set<string>>(new Set())

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
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
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Marcar campo como completado manualmente si tiene valor
    if (value.trim()) {
      setCamposCompletadosManualmente(prev => new Set(prev).add(name))
    } else {
      setCamposCompletadosManualmente(prev => {
        const newSet = new Set(prev)
        newSet.delete(name)
        return newSet
      })
    }
  }

  // Manejar datos obtenidos de RENIEC - Autorelleno completo
  const handleDatosRENIEC = (datos: any) => {
    // Campos que se van a auto-rellenar
    const camposAutoLlenados = ['numero_documento', 'nombres', 'apellido_paterno']
    
    // Agregar campos opcionales si tienen datos
    if (datos.apellido_materno) camposAutoLlenados.push('apellido_materno')
    if (datos.fecha_nacimiento) camposAutoLlenados.push('fecha_nacimiento')
    if (datos.direccion) camposAutoLlenados.push('direccion')
    
    // Solo auto-rellenar ubicación si viene directamente de la API
    if (datos.departamento) camposAutoLlenados.push('departamento')
    if (datos.provincia) camposAutoLlenados.push('provincia')
    if (datos.distrito) camposAutoLlenados.push('distrito')

    setFormData({
      ...formData,
      // Datos básicos
      numero_documento: datos.dni,
      nombres: datos.nombres,
      apellido_paterno: datos.apellido_paterno,
      apellido_materno: datos.apellido_materno || '',
      fecha_nacimiento: datos.fecha_nacimiento || '',
      // Dirección y ubicación (solo si vienen directamente de la API)
      direccion: datos.direccion || formData.direccion,
      departamento: datos.departamento || formData.departamento,
      provincia: datos.provincia || formData.provincia,
      distrito: datos.distrito || formData.distrito
    })
    
    // Marcar campos como auto-rellenados
    setCamposAutoRellenados(new Set(camposAutoLlenados))
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

  // Manejar datos obtenidos de SUNAT - Autorelleno para empresas
  const handleDatosSUNAT = (datos: any) => {
    // Campos que se van a auto-rellenar
    const camposAutoLlenados = ['numero_documento', 'razon_social']
    
    // Agregar campos opcionales si tienen datos
    if (datos.direccion) camposAutoLlenados.push('direccion')
    if (datos.departamento) camposAutoLlenados.push('departamento')
    if (datos.provincia) camposAutoLlenados.push('provincia')
    if (datos.distrito) camposAutoLlenados.push('distrito')
    if (datos.representante_legal?.nombres) camposAutoLlenados.push('representante_legal')

    setFormData({
      ...formData,
      // Datos básicos de empresa
      numero_documento: datos.ruc,
      razon_social: datos.razon_social,
      direccion: datos.direccion || formData.direccion,
      departamento: datos.departamento || formData.departamento,
      provincia: datos.provincia || formData.provincia,
      distrito: datos.distrito || formData.distrito,
      // Representante legal si está disponible
      representante_legal: datos.representante_legal?.nombres || formData.representante_legal
    })
    
    // Marcar campos como auto-rellenados
    setCamposAutoRellenados(new Set(camposAutoLlenados))
    setError(null)
  }

  // Manejar empresa existente
  const handleEmpresaExistente = (empresaId: string, nombre: string) => {
    setError(`Empresa ya existe: ${nombre}`)
    // Opcionalmente redirigir a la empresa existente
    setTimeout(() => {
      router.push(`/dashboard/clientes/${empresaId}`)
    }, 3000)
  }

  // Función para verificar si un campo debe ser readonly (inmutable)
  const esCampoInmutable = (nombreCampo: string) => {
    const camposInmutablesDNI = ['nombres', 'apellido_paterno', 'apellido_materno', 'fecha_nacimiento']
    return camposInmutablesDNI.includes(nombreCampo) && camposAutoRellenados.has(nombreCampo)
  }

  // Función para obtener el estilo del campo según su estado
  const getCampoStyle = (nombreCampo: string, valor: string) => {
    const tieneValor = valor && valor.trim()
    const esAutoRellenado = camposAutoRellenados.has(nombreCampo)
    const esCompletadoManualmente = camposCompletadosManualmente.has(nombreCampo)
    const esInmutable = esCampoInmutable(nombreCampo)
    
    if (esInmutable) {
      // Campos inmutables de RENIEC: Verde más intenso con cursor no permitido
      return 'border-emerald-500 bg-emerald-50 cursor-not-allowed'
    } else if (esAutoRellenado || (tieneValor && esCompletadoManualmente)) {
      // Verde: auto-rellenado o completado manualmente
      return 'border-emerald-300 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200'
    } else if (!tieneValor && (camposAutoRellenados.size > 0 || camposCompletadosManualmente.size > 0)) {
      // Rojo: campo vacío después de que se han rellenado otros campos
      return 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
    } else {
      // Normal: estado inicial
      return ''
    }
  }

  // Manejar cambio de ubicación desde el selector
  const handleUbicacionChange = (ubicacion: {
    departamento: string
    provincia: string
    distrito: string
  }) => {
    setFormData({
      ...formData,
      departamento: ubicacion.departamento,
      provincia: ubicacion.provincia,
      distrito: ubicacion.distrito
    })

    // Marcar campos como completados manualmente si tienen valor
    const camposActualizados = new Set(camposCompletadosManualmente)
    if (ubicacion.departamento) camposActualizados.add('departamento')
    if (ubicacion.provincia) camposActualizados.add('provincia')  
    if (ubicacion.distrito) camposActualizados.add('distrito')
    setCamposCompletadosManualmente(camposActualizados)
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/clientes">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Nuevo Cliente</h1>
          <p className="text-sm text-gray-600">Registra un nuevo cliente en el sistema</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Tipo de Persona */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-900">Tipo de Persona</CardTitle>
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
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Datos de Identificación</CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Documento de identidad y datos personales básicos del cliente.
              </p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="nombres">
                    Nombres * 
                    {esCampoInmutable('nombres') && (
                      <span className="text-xs text-green-600 ml-2 font-medium">
                        (Obtenido de RENIEC - No editable)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    placeholder="Juan Carlos"
                    className={getCampoStyle('nombres', formData.nombres)}
                    readOnly={esCampoInmutable('nombres')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellido_paterno">
                    Apellido Paterno *
                    {esCampoInmutable('apellido_paterno') && (
                      <span className="text-xs text-green-600 ml-2 font-medium">
                        (Obtenido de RENIEC - No editable)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="apellido_paterno"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleInputChange}
                    placeholder="Pérez"
                    className={getCampoStyle('apellido_paterno', formData.apellido_paterno)}
                    readOnly={esCampoInmutable('apellido_paterno')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellido_materno">
                    Apellido Materno
                    {esCampoInmutable('apellido_materno') && (
                      <span className="text-xs text-green-600 ml-2 font-medium">
                        (Obtenido de RENIEC - No editable)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="apellido_materno"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleInputChange}
                    placeholder="López"
                    className={getCampoStyle('apellido_materno', formData.apellido_materno)}
                    readOnly={esCampoInmutable('apellido_materno')}
                  />
                </div>
                <div>
                  <Label htmlFor="fecha_nacimiento">
                    Fecha de Nacimiento
                    {esCampoInmutable('fecha_nacimiento') && (
                      <span className="text-xs text-green-600 ml-2 font-medium">
                        (Obtenido de RENIEC - No editable)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    className={getCampoStyle('fecha_nacimiento', formData.fecha_nacimiento)}
                    readOnly={esCampoInmutable('fecha_nacimiento')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos de Contacto */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Datos de Contacto</CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Teléfonos y correo para recordatorios, avisos de vencimiento y soporte.
              </p>
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
                    className={getCampoStyle('celular', formData.celular)}
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
                    className={getCampoStyle('telefono', formData.telefono)}
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
                  className={getCampoStyle('email', formData.email)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Dirección</CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Ubicación principal para análisis de riesgo y gestión de cobranzas.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <UbicacionSelectorAPI
                departamentoInicial={formData.departamento}
                provinciaInicial={formData.provincia}
                distritoInicial={formData.distrito}
                onUbicacionChange={handleUbicacionChange}
                getCampoStyle={getCampoStyle}
                disabled={loading}
              />

              <div>
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Av. Principal 123, Urb. Los Jardines"
                  className={getCampoStyle('direccion', formData.direccion)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Datos Laborales (plegable) */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setMostrarDatosLaborales((prev) => !prev)}
            >
              <div>
                <CardTitle className="text-sm font-medium text-gray-900">Datos Laborales</CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  Opcional. Mejora la evaluación de riesgo y conocimiento del cliente.
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  mostrarDatosLaborales ? 'rotate-180' : ''
                }`}
              />
            </CardHeader>
            {mostrarDatosLaborales && (
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
                    className={getCampoStyle('ocupacion', formData.ocupacion)}
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
                    className={getCampoStyle('empresa_trabaja', formData.empresa_trabaja)}
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
                  className={getCampoStyle('ingreso_mensual', formData.ingreso_mensual)}
                />
              </div>
              </CardContent>
            )}
          </Card>

          {/* Observaciones (plegable) */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setMostrarObservaciones((prev) => !prev)}
            >
              <div>
                <CardTitle className="text-sm font-medium text-gray-900">Observaciones</CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  Notas internas sobre el cliente (no se muestran en comprobantes).
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  mostrarObservaciones ? 'rotate-180' : ''
                }`}
              />
            </CardHeader>
            {mostrarObservaciones && (
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
            )}
          </Card>
        </>
      ) : (
        <>
          {/* Persona Jurídica */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Datos de la Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RUCAutoComplete
                onDatosObtenidos={handleDatosSUNAT}
                onEmpresaExistente={handleEmpresaExistente}
                valorInicial={formData.numero_documento}
                disabled={loading}
              />

              <div>
                <Label htmlFor="razon_social">Razón Social *</Label>
                <Input
                  id="razon_social"
                  name="razon_social"
                  value={formData.razon_social}
                  onChange={handleInputChange}
                  placeholder="Empresa SAC"
                  className={getCampoStyle('razon_social', formData.razon_social)}
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
                  className={getCampoStyle('representante_legal', formData.representante_legal)}
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
                    className={getCampoStyle('celular', formData.celular)}
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
                    className={getCampoStyle('email', formData.email)}
                  />
                </div>
              </div>

              {/* Ubicación de la Empresa */}
              <div className="space-y-4">
                <UbicacionSelectorAPI
                  departamentoInicial={formData.departamento}
                  provinciaInicial={formData.provincia}
                  distritoInicial={formData.distrito}
                  onUbicacionChange={handleUbicacionChange}
                  getCampoStyle={getCampoStyle}
                  disabled={loading}
                />

                <div>
                  <Label htmlFor="direccion">Dirección Completa</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Av. Principal 123, Urb. Industrial"
                    className={getCampoStyle('direccion', formData.direccion)}
                  />
                </div>
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
