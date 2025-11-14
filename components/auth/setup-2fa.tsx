'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TwoFactorAuth } from '@/lib/auth/2fa'
import { Shield, Smartphone, Key, Copy, CheckCircle, AlertTriangle, Download } from 'lucide-react'
import Image from 'next/image'

interface Setup2FAProps {
  userId: string
  userEmail: string
  userRole: string
  onComplete: () => void
  onCancel: () => void
}

export default function Setup2FA({ userId, userEmail, userRole, onComplete, onCancel }: Setup2FAProps) {
  const [step, setStep] = useState<'info' | 'setup' | 'verify' | 'complete'>('info')
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedCodes, setCopiedCodes] = useState(false)

  const isRequired = TwoFactorAuth.requiresTwoFactor(userRole)

  const handleStartSetup = async () => {
    setLoading(true)
    setError('')
    
    try {
      const setup = await TwoFactorAuth.setupTwoFactor(userId, userEmail)
      setQrCode(setup.qrCodeUrl)
      setSecret(setup.secret)
      setBackupCodes(setup.backupCodes)
      setStep('setup')
    } catch (err) {
      setError('Error al configurar 2FA. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Ingresa un código de 6 dígitos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const isValid = await TwoFactorAuth.confirmTwoFactor(userId, verificationCode)
      
      if (isValid) {
        setStep('complete')
      } else {
        setError('Código incorrecto. Verifica tu aplicación autenticadora.')
      }
    } catch (err) {
      setError('Error al verificar el código. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'secret' | 'codes') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'secret') {
        setCopiedSecret(true)
        setTimeout(() => setCopiedSecret(false), 2000)
      } else {
        setCopiedCodes(true)
        setTimeout(() => setCopiedCodes(false), 2000)
      }
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const downloadBackupCodes = () => {
    const content = `JUNTAY - Códigos de Respaldo 2FA
Usuario: ${userEmail}
Fecha: ${new Date().toLocaleDateString('es-PE')}

CÓDIGOS DE RESPALDO:
${backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

IMPORTANTE:
- Guarda estos códigos en un lugar seguro
- Cada código solo se puede usar una vez
- Úsalos solo si no tienes acceso a tu aplicación autenticadora
- Si pierdes estos códigos, contacta al administrador del sistema`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `juntay-backup-codes-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (step === 'info') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Configurar Autenticación 2FA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Seguridad Reforzada</h3>
              <p className="text-sm text-blue-700">
                La autenticación de dos factores protege tu cuenta con una capa adicional de seguridad.
              </p>
            </div>
          </div>

          {isRequired && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Requerido:</strong> Tu rol ({userRole}) requiere autenticación 2FA obligatoria.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Smartphone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Aplicación Autenticadora</h4>
                <p className="text-sm text-gray-600">
                  Necesitarás Google Authenticator, Authy o similar instalada en tu teléfono.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Key className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Códigos de Respaldo</h4>
                <p className="text-sm text-gray-600">
                  Recibirás códigos de emergencia para usar si pierdes tu teléfono.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!isRequired && (
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
            )}
            <Button 
              onClick={handleStartSetup} 
              loading={loading}
              className="flex-1"
            >
              Configurar 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'setup') {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Escanea el Código QR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
              {qrCode && (
                <Image 
                  src={qrCode} 
                  alt="Código QR para 2FA" 
                  width={200} 
                  height={200}
                  className="mx-auto"
                />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Instrucciones:</h4>
            <ol className="text-sm space-y-2 list-decimal list-inside text-gray-600">
              <li>Abre tu aplicación autenticadora (Google Authenticator, Authy, etc.)</li>
              <li>Toca "Agregar cuenta" o el ícono "+"</li>
              <li>Escanea este código QR con tu teléfono</li>
              <li>Si no puedes escanear, usa el código manual abajo</li>
            </ol>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Código manual:</p>
                <code className="text-sm font-mono break-all">{secret}</code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(secret, 'secret')}
              >
                {copiedSecret ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={() => setStep('verify')} className="w-full">
            Continuar
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verificar Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="p-4 bg-green-50 rounded-lg mb-4">
              <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-700">
                Ingresa el código de 6 dígitos que aparece en tu aplicación autenticadora
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Código de verificación</label>
            <Input
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setVerificationCode(value)
                setError('')
              }}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
              Volver
            </Button>
            <Button 
              onClick={handleVerifySetup}
              loading={loading}
              disabled={verificationCode.length !== 6}
              className="flex-1"
            >
              Verificar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'complete') {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            ¡2FA Configurado Exitosamente!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Tu cuenta ahora está protegida con autenticación de dos factores.
            </AlertDescription>
          </Alert>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Códigos de Respaldo
            </h4>
            <p className="text-sm text-yellow-700 mb-3">
              Guarda estos códigos en un lugar seguro. Cada uno solo se puede usar una vez.
            </p>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {backupCodes.map((code, index) => (
                <code key={index} className="text-xs bg-white p-2 rounded border">
                  {code}
                </code>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(backupCodes.join('\n'), 'codes')}
                className="flex-1"
              >
                {copiedCodes ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copiar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadBackupCodes}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>

          <Button onClick={onComplete} className="w-full">
            Completar Configuración
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
