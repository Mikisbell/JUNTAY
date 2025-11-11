"use client"

import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function NuevoClientePage() {
  const [tipoPersona, setTipoPersona] = useState("natural")
  
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
          <p className="text-gray-600">Registra un nuevo cliente en el sistema</p>
        </div>
      </div>
      
      {/* Tipo de Persona */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Persona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <button
              onClick={() => setTipoPersona("natural")}
              className={`flex-1 p-4 border-2 rounded-lg ${
                tipoPersona === "natural" 
                  ? "border-blue-600 bg-blue-50" 
                  : "border-gray-300"
              }`}
            >
              <p className="font-medium">Persona Natural</p>
              <p className="text-sm text-gray-600">DNI, Pasaporte, etc.</p>
            </button>
            <button
              onClick={() => setTipoPersona("juridica")}
              className={`flex-1 p-4 border-2 rounded-lg ${
                tipoPersona === "juridica" 
                  ? "border-blue-600 bg-blue-50" 
                  : "border-gray-300"
              }`}
            >
              <p className="font-medium">Persona Jurídica</p>
              <p className="text-sm text-gray-600">Empresa con RUC</p>
            </button>
          </div>
        </CardContent>
      </Card>
      
      {tipoPersona === "natural" ? (
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
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="dni">DNI</option>
                    <option value="pasaporte">Pasaporte</option>
                    <option value="carnet_extranjeria">Carnet de Extranjería</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="numero_documento">Número de Documento *</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="numero_documento" 
                      placeholder="12345678"
                      maxLength={8}
                    />
                    <Button>Buscar</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input id="nombres" placeholder="Juan Carlos" />
                </div>
                <div>
                  <Label htmlFor="apellido_paterno">Apellido Paterno *</Label>
                  <Input id="apellido_paterno" placeholder="Pérez" />
                </div>
                <div>
                  <Label htmlFor="apellido_materno">Apellido Materno</Label>
                  <Input id="apellido_materno" placeholder="López" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input id="fecha_nacimiento" type="date" />
                </div>
                <div>
                  <Label htmlFor="genero">Género</Label>
                  <select 
                    id="genero"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="estado_civil">Estado Civil</Label>
                  <select 
                    id="estado_civil"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Seleccionar</option>
                    <option value="soltero">Soltero(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viudo">Viudo(a)</option>
                  </select>
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
                  <Label htmlFor="telefono_principal">Teléfono Principal *</Label>
                  <Input id="telefono_principal" placeholder="987654321" />
                </div>
                <div>
                  <Label htmlFor="telefono_secundario">Teléfono Secundario</Label>
                  <Input id="telefono_secundario" placeholder="912345678" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="cliente@email.com" />
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
                  <Input id="departamento" placeholder="Lima" />
                </div>
                <div>
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input id="provincia" placeholder="Lima" />
                </div>
                <div>
                  <Label htmlFor="distrito">Distrito</Label>
                  <Input id="distrito" placeholder="San Juan de Lurigancho" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Input id="direccion" placeholder="Av. Principal 123, Urb. Los Jardines" />
              </div>
              
              <div>
                <Label htmlFor="referencia">Referencia</Label>
                <Input id="referencia" placeholder="Al frente del parque" />
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
                  <Input id="ocupacion" placeholder="Comerciante" />
                </div>
                <div>
                  <Label htmlFor="empresa_trabaja">Empresa donde Trabaja</Label>
                  <Input id="empresa_trabaja" placeholder="Nombre de la empresa" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ingreso_mensual">Ingreso Mensual (S/)</Label>
                <Input 
                  id="ingreso_mensual" 
                  type="number" 
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ruc">RUC *</Label>
                  <div className="flex space-x-2">
                    <Input id="ruc" placeholder="20123456789" maxLength={11} />
                    <Button>Buscar</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="razon_social">Razón Social *</Label>
                <Input id="razon_social" placeholder="Empresa SAC" />
              </div>
              
              <div>
                <Label htmlFor="representante_legal">Representante Legal *</Label>
                <Input id="representante_legal" placeholder="Nombre del representante" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono_empresa">Teléfono *</Label>
                  <Input id="telefono_empresa" placeholder="987654321" />
                </div>
                <div>
                  <Label htmlFor="email_empresa">Email</Label>
                  <Input id="email_empresa" type="email" placeholder="empresa@email.com" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="direccion_empresa">Dirección</Label>
                <Input id="direccion_empresa" placeholder="Dirección de la empresa" />
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Botones */}
      <div className="flex items-center justify-end space-x-4 pb-8">
        <Link href="/dashboard/clientes">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Guardar Cliente
        </Button>
      </div>
    </div>
  )
}
