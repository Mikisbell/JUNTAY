'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, User, UserCheck, UserX, Clock, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Caja {
  id: string
  codigo: string
  nombre: string
  responsable_actual_id?: string
}

interface Usuario {
  id: string
  email: string
  nombre?: string
  apellido?: string
  rol?: string
}

interface AsignacionHistorial {
  id: string
  usuario_id: string
  fecha_asignacion: string
  fecha_desasignacion?: string
  activa: boolean
  usuario?: Usuario
}

export default function ResponsablesCajaPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [caja, setCaja] = useState<Caja | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [historial, setHistorial] = useState<AsignacionHistorial[]>([])
  const [nuevoResponsable, setNuevoResponsable] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [params.id])

  async function cargarDatos() {
    try {
      // Cargar caja
      const { data: cajaData } = await supabase
        .from('cajas')
        .select('*')
        .eq('id', params.id)
        .single()

      setCaja(cajaData)

      // Cargar usuarios (simulado - en producción vendría de tabla usuarios)
      const usuariosMock = [
        { id: '1', email: 'admin@juntay.com', nombre: 'Administrador', apellido: 'Sistema', rol: 'admin' },
        { id: '2', email: 'cajero1@juntay.com', nombre: 'Juan', apellido: 'Pérez', rol: 'cajero' },
        { id: '3', email: 'cajero2@juntay.com', nombre: 'María', apellido: 'García', rol: 'cajero' },
        { id: '4', email: 'supervisor@juntay.com', nombre: 'Carlos', apellido: 'López', rol: 'supervisor' }
      ]
      setUsuarios(usuariosMock)

      // Cargar historial de asignaciones (simulado)
      const historialMock = [
        {
          id: '1',
          usuario_id: '2',
          fecha_asignacion: '2025-11-01T08:00:00Z',
          fecha_desasignacion: '2025-11-10T18:00:00Z',
          activa: false,
          usuario: usuariosMock.find(u => u.id === '2')
        },
        {
          id: '2',
          usuario_id: '3',
          fecha_asignacion: '2025-11-11T08:00:00Z',
          activa: true,
          usuario: usuariosMock.find(u => u.id === '3')
        }
      ]
      setHistorial(historialMock)

    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const asignarResponsable = async () => {
    if (!nuevoResponsable) return

    setSaving(true)
    try {
      // Desasignar responsable actual si existe
      const responsableActual = historial.find(h => h.activa)
      if (responsableActual) {
        // En producción: actualizar registro en BD
        console.log('Desasignando responsable actual:', responsableActual.usuario_id)
      }

      // Asignar nuevo responsable
      const { error } = await supabase
        .from('cajas')
        .update({ 
          responsable_actual_id: nuevoResponsable,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      // Recargar datos
      await cargarDatos()
      setNuevoResponsable('')
      
    } catch (error) {
      console.error('Error asignando responsable:', error)
    } finally {
      setSaving(false)
    }
  }

  const desasignarResponsable = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('cajas')
        .update({ 
          responsable_actual_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      await cargarDatos()
      
    } catch (error) {
      console.error('Error desasignando responsable:', error)
    } finally {
      setSaving(false)
    }
  }

  const getUsuarioNombre = (usuarioId: string) => {
    const usuario = usuarios.find(u => u.id === usuarioId)
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario no encontrado'
  }

  const getRolBadge = (rol?: string) => {
    const variants = {
      'admin': 'bg-purple-100 text-purple-800',
      'supervisor': 'bg-blue-100 text-blue-800',
      'cajero': 'bg-green-100 text-green-800'
    }
    return variants[rol as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const responsableActual = usuarios.find(u => u.id === caja?.responsable_actual_id)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/configuracion/cajas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Responsables de Caja</h1>
          <p className="text-gray-600 mt-1">
            Gestionar responsables de {caja?.codigo} - {caja?.nombre}
          </p>
        </div>
      </div>

      {/* Responsable Actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Responsable Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {responsableActual ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {responsableActual.nombre} {responsableActual.apellido}
                  </h3>
                  <p className="text-sm text-gray-600">{responsableActual.email}</p>
                  <Badge className={getRolBadge(responsableActual.rol)}>
                    {responsableActual.rol?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={desasignarResponsable}
                disabled={saving}
              >
                <UserX className="h-4 w-4 mr-2" />
                Desasignar
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserX className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No hay responsable asignado actualmente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asignar Nuevo Responsable */}
      <Card>
        <CardHeader>
          <CardTitle>Asignar Nuevo Responsable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={nuevoResponsable} onValueChange={setNuevoResponsable}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {usuarios
                    .filter(u => u.id !== caja?.responsable_actual_id)
                    .map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        <div className="flex items-center gap-2">
                          <span>{usuario.nombre} {usuario.apellido}</span>
                          <Badge className={getRolBadge(usuario.rol)} variant="outline">
                            {usuario.rol}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={asignarResponsable}
              disabled={!nuevoResponsable || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Asignando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Asignar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Asignaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Historial de Asignaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historial.map((asignacion) => (
              <div key={asignacion.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {getUsuarioNombre(asignacion.usuario_id)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {asignacion.usuario?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRolBadge(asignacion.usuario?.rol)}>
                        {asignacion.usuario?.rol?.toUpperCase()}
                      </Badge>
                      <Badge variant={asignacion.activa ? "default" : "secondary"}>
                        {asignacion.activa ? "Activa" : "Finalizada"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Desde:</span>{' '}
                    {new Date(asignacion.fecha_asignacion).toLocaleDateString()}
                  </p>
                  {asignacion.fecha_desasignacion && (
                    <p>
                      <span className="font-medium">Hasta:</span>{' '}
                      {new Date(asignacion.fecha_desasignacion).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {historial.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No hay historial de asignaciones</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usuarios Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{usuario.nombre} {usuario.apellido}</h4>
                  <p className="text-sm text-gray-600">{usuario.email}</p>
                  <Badge className={getRolBadge(usuario.rol)}>
                    {usuario.rol?.toUpperCase()}
                  </Badge>
                </div>
                {usuario.id === caja?.responsable_actual_id && (
                  <Badge variant="default">Asignado</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
