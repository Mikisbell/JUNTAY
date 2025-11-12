'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface GenerarContratoButtonProps {
  creditoId: string
  creditoCodigo?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function GenerarContratoButton({ 
  creditoId, 
  creditoCodigo, 
  variant = 'default',
  size = 'default',
  className = ''
}: GenerarContratoButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerarContrato = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/contratos/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creditoId }),
      })

      const result = await response.json()

      if (result.success) {
        // Abrir PDF en nueva ventana
        window.open(result.contratoUrl, '_blank')
        
        toast.success('Contrato generado exitosamente', {
          description: `Archivo: ${result.fileName}`
        })
      } else {
        toast.error('Error al generar contrato', {
          description: result.error || 'Intente nuevamente'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión', {
        description: 'No se pudo generar el contrato'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleGenerarContrato}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4 mr-2" />
          Generar Contrato
        </>
      )}
    </Button>
  )
}

// Componente específico para descargar contrato directamente
export function DescargarContratoButton({ 
  creditoId, 
  creditoCodigo,
  variant = 'outline',
  size = 'sm',
  className = ''
}: GenerarContratoButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDescargarContrato = async () => {
    setIsDownloading(true)
    
    try {
      // Importar dinámicamente para evitar problemas de SSR
      const { descargarContratoPDF } = await import('@/lib/pdf/contrato-empeno')
      
      // Obtener datos del crédito
      const response = await fetch(`/api/creditos/${creditoId}`)
      const credito = await response.json()
      
      if (credito) {
        // Generar y descargar PDF directamente
        descargarContratoPDF(credito, credito.cliente, credito.garantia)
        
        toast.success('Contrato descargado', {
          description: 'El archivo se ha guardado en Descargas'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al descargar', {
        description: 'No se pudo generar el PDF'
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDescargarContrato}
      disabled={isDownloading}
      variant={variant}
      size={size}
      className={className}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Descargando...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Descargar PDF
        </>
      )}
    </Button>
  )
}
