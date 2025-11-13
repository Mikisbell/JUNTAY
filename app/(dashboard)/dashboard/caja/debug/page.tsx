'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

export default function DebugCajaPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testCrearSesion = async () => {
    setLoading(true)
    setLogs([])
    
    try {
      addLog('🔍 Iniciando test de creación de sesión...')
      
      // 1. Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        addLog(`❌ Error de autenticación: ${authError.message}`)
        return
      }
      addLog(`✅ Usuario autenticado: ${user?.email || 'Sin email'}`)
      
      // 2. Buscar una caja
      const { data: cajas, error: cajasError } = await supabase
        .from('cajas')
        .select('*')
        .limit(1)
      
      if (cajasError) {
        addLog(`❌ Error al buscar cajas: ${cajasError.message}`)
        return
      }
      
      if (!cajas || cajas.length === 0) {
        addLog('❌ No se encontraron cajas en la base de datos')
        return
      }
      
      const caja = cajas[0]
      addLog(`✅ Caja encontrada: ${caja.nombre} (ID: ${caja.id})`)
      
      // 3. Verificar sesiones existentes
      const { data: sesionesExistentes, error: sesionesError } = await supabase
        .from('sesiones_caja')
        .select('*')
        .eq('caja_id', caja.id)
        .eq('estado', 'abierta')
      
      if (sesionesError) {
        addLog(`❌ Error al verificar sesiones: ${sesionesError.message}`)
        return
      }
      
      addLog(`ℹ️ Sesiones abiertas encontradas: ${sesionesExistentes?.length || 0}`)
      
      if (sesionesExistentes && sesionesExistentes.length > 0) {
        addLog('⚠️ Ya existe una sesión abierta, cerrándola primero...')
        
        const { error: cerrarError } = await supabase
          .from('sesiones_caja')
          .update({ estado: 'cerrada' })
          .eq('id', sesionesExistentes[0].id)
        
        if (cerrarError) {
          addLog(`❌ Error al cerrar sesión existente: ${cerrarError.message}`)
          return
        }
        addLog('✅ Sesión anterior cerrada')
      }
      
      // 4. Crear nueva sesión
      const montoInicial = 100.00
      const { data: nuevaSesion, error: crearError } = await supabase
        .from('sesiones_caja')
        .insert([{
          caja_id: caja.id,
          numero_sesion: 1,
          fecha_apertura: new Date().toISOString(),
          usuario_apertura_id: user?.id || null,
          monto_inicial: montoInicial,
          estado: 'abierta',
          total_ingresos: 0,
          total_egresos: 0,
          total_movimientos: 0
        }])
        .select()
        .single()
      
      if (crearError) {
        addLog(`❌ Error al crear sesión: ${crearError.message}`)
        addLog(`📋 Detalles del error: ${JSON.stringify(crearError, null, 2)}`)
        return
      }
      
      addLog(`✅ Sesión creada exitosamente: ID ${nuevaSesion.id}`)
      
      // 5. Verificar que se creó correctamente
      const { data: verificacion, error: verificarError } = await supabase
        .from('sesiones_caja')
        .select('*')
        .eq('id', nuevaSesion.id)
        .single()
      
      if (verificarError) {
        addLog(`❌ Error al verificar sesión: ${verificarError.message}`)
        return
      }
      
      addLog(`✅ Verificación exitosa: ${JSON.stringify(verificacion, null, 2)}`)
      
      // 6. Buscar sesión activa
      const { data: sesionActiva, error: buscarError } = await supabase
        .from('sesiones_caja')
        .select('*')
        .eq('caja_id', caja.id)
        .eq('estado', 'abierta')
        .single()
      
      if (buscarError) {
        addLog(`❌ Error al buscar sesión activa: ${buscarError.message}`)
        return
      }
      
      addLog(`✅ Sesión activa encontrada: ID ${sesionActiva.id}`)
      addLog('🎉 ¡Test completado exitosamente!')
      
    } catch (error: any) {
      addLog(`💥 Error inesperado: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Debug Sistema de Caja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testCrearSesion} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Ejecutando Test...' : '🧪 Test Crear Sesión de Caja'}
          </Button>
          
          {logs.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
