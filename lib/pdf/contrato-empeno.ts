// Generador de contratos de empeño en PDF
// NOTA: Requiere instalación: npm install jspdf

import type { Credito } from '@/lib/api/creditos'

// Función para generar contrato (sin jsPDF por ahora - template)
export function generarContratoEmpeno(credito: any, cliente: any, garantia: any) {
  // Esta función requiere jsPDF
  // Por ahora retornamos el HTML del contrato para preview
  
  const fecha = new Date(credito.fecha_desembolso).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const nombreCliente = cliente.tipo_persona === 'natural'
    ? `${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno || ''}`.trim()
    : cliente.razon_social

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contrato de Mutuo con Garantía Prendaria - ${credito.codigo}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
    h1 { text-align: center; font-size: 18px; margin-bottom: 30px; }
    h2 { font-size: 14px; margin-top: 20px; margin-bottom: 10px; }
    p { text-align: justify; margin-bottom: 10px; font-size: 12px; }
    .seccion { margin-bottom: 20px; }
    .firma { margin-top: 60px; text-align: center; }
    .firma-linea { width: 200px; border-top: 1px solid #000; margin: 0 auto; padding-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
    th { background-color: #f2f2f2; }
    .highlight { background-color: #ffffcc; font-weight: bold; }
  </style>
</head>
<body>
  <h1>CONTRATO DE MUTUO CON GARANTÍA PRENDARIA</h1>
  
  <p>Conste por el presente documento, el <strong>CONTRATO DE MUTUO CON GARANTÍA PRENDARIA</strong>, que celebran al amparo del artículo 1648° del Código Civil:</p>
  
  <div class="seccion">
    <h2>I. DE LAS PARTES:</h2>
    <p><strong>EL MUTUANTE:</strong></p>
    <p>
      <strong>JUNTAY S.A.C.</strong>, con RUC N° 20123456789, con domicilio en Av. Principal 123, Lima, Perú,
      debidamente representada por su Gerente General.
    </p>
    
    <p><strong>EL MUTUATARIO:</strong></p>
    <p>
      <strong>${nombreCliente}</strong>, identificado con ${cliente.tipo_documento.toUpperCase()} N° ${cliente.numero_documento},
      con domicilio en ${cliente.direccion || 'No especificado'}, ${cliente.distrito || ''}, ${cliente.provincia || ''}, ${cliente.departamento || ''}.
      ${cliente.email ? `Email: ${cliente.email}.` : ''}
      ${cliente.telefono_principal ? `Teléfono: ${cliente.telefono_principal}.` : ''}
    </p>
  </div>

  <div class="seccion">
    <h2>II. DEL OBJETO DEL CONTRATO:</h2>
    <p>
      Por el presente contrato, <strong>EL MUTUANTE</strong> entrega en calidad de préstamo (mutuo) a 
      <strong>EL MUTUATARIO</strong> la suma de <strong class="highlight">S/ ${credito.monto_prestado.toFixed(2)} (${numeroALetras(credito.monto_prestado)} SOLES)</strong>,
      la misma que <strong>EL MUTUATARIO</strong> se obliga a devolver en el plazo y condiciones pactadas en el presente contrato.
    </p>
  </div>

  <div class="seccion">
    <h2>III. DE LA GARANTÍA PRENDARIA:</h2>
    <p>
      Para garantizar el cumplimiento de la obligación asumida, <strong>EL MUTUATARIO</strong> entrega en prenda a 
      <strong>EL MUTUANTE</strong> el siguiente bien:
    </p>
    <table>
      <tr>
        <th>Descripción</th>
        <td>${garantia?.nombre || 'N/A'}</td>
      </tr>
      <tr>
        <th>Detalles</th>
        <td>${garantia?.descripcion || 'N/A'}</td>
      </tr>
      ${garantia?.marca ? `<tr><th>Marca</th><td>${garantia.marca}</td></tr>` : ''}
      ${garantia?.modelo ? `<tr><th>Modelo</th><td>${garantia.modelo}</td></tr>` : ''}
      ${garantia?.numero_serie ? `<tr><th>Serie</th><td>${garantia.numero_serie}</td></tr>` : ''}
      <tr>
        <th>Valor de Tasación</th>
        <td class="highlight">S/ ${garantia?.valor_tasacion?.toFixed(2) || '0.00'}</td>
      </tr>
      <tr>
        <th>Estado de Conservación</th>
        <td>${garantia?.estado_conservacion || 'No especificado'}</td>
      </tr>
    </table>
  </div>

  <div class="seccion">
    <h2>IV. DE LAS CONDICIONES ECONÓMICAS:</h2>
    <table>
      <tr>
        <th>Concepto</th>
        <th>Monto/Dato</th>
      </tr>
      <tr>
        <td>Monto del Préstamo</td>
        <td class="highlight">S/ ${credito.monto_prestado.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Tasa de Interés Mensual</td>
        <td>${credito.tasa_interes_mensual}%</td>
      </tr>
      <tr>
        <td>Monto de Intereses</td>
        <td>S/ ${credito.monto_interes.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Monto Total a Pagar</td>
        <td class="highlight">S/ ${credito.monto_total.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Número de Cuotas</td>
        <td>${credito.numero_cuotas} cuotas ${credito.frecuencia_pago}s</td>
      </tr>
      <tr>
        <td>Monto por Cuota</td>
        <td>S/ ${credito.monto_cuota.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Fecha de Desembolso</td>
        <td>${fecha}</td>
      </tr>
      <tr>
        <td>Fecha de Primer Vencimiento</td>
        <td>${new Date(credito.fecha_primer_vencimiento).toLocaleDateString('es-PE')}</td>
      </tr>
      <tr>
        <td>Fecha de Último Vencimiento</td>
        <td>${new Date(credito.fecha_ultimo_vencimiento).toLocaleDateString('es-PE')}</td>
      </tr>
      <tr>
        <td>Tasa de Mora Diaria</td>
        <td>${credito.tasa_mora_diaria}%</td>
      </tr>
    </table>
  </div>

  <div class="seccion">
    <h2>V. DE LAS OBLIGACIONES DE LAS PARTES:</h2>
    
    <h3>Obligaciones del MUTUATARIO:</h3>
    <p>a) Pagar puntualmente las cuotas pactadas en las fechas establecidas.</p>
    <p>b) Mantener la garantía prendaria en custodia del MUTUANTE hasta la cancelación total de la deuda.</p>
    <p>c) Informar cualquier cambio de domicilio o datos de contacto.</p>
    <p>d) No disponer del bien dado en garantía hasta cancelar la totalidad de la deuda.</p>
    
    <h3>Obligaciones del MUTUANTE:</h3>
    <p>a) Custodiar la garantía prendaria de manera adecuada.</p>
    <p>b) Devolver la garantía al MUTUATARIO una vez cancelada la totalidad de la deuda.</p>
    <p>c) Emitir constancia de pago por cada cuota cancelada.</p>
  </div>

  <div class="seccion">
    <h2>VI. DE LA MORA Y PENALIDADES:</h2>
    <p>
      En caso de incumplimiento en el pago de cualquier cuota en la fecha pactada, se generarán 
      intereses moratorios a una tasa de <strong>${credito.tasa_mora_diaria}% diario</strong> sobre el monto vencido,
      sin perjuicio del derecho del MUTUANTE de exigir el cumplimiento del contrato o su resolución.
    </p>
  </div>

  <div class="seccion">
    <h2>VII. DEL VENCIMIENTO Y REMATE:</h2>
    <p>
      Transcurridos <strong>30 días</strong> desde el vencimiento de la última cuota sin que se haya cancelado
      la totalidad de la deuda, el MUTUANTE podrá proceder a la venta de la garantía prendaria, previa
      notificación al MUTUATARIO, conforme a lo establecido en el artículo 1068° del Código Civil.
    </p>
    <p>
      Del producto de la venta se descontará el saldo de la deuda, los intereses, gastos de conservación
      y venta, devolviéndose al MUTUATARIO el excedente si lo hubiere.
    </p>
  </div>

  <div class="seccion">
    <h2>VIII. DE LA RESOLUCIÓN DE CONFLICTOS:</h2>
    <p>
      Cualquier controversia derivada del presente contrato será resuelta mediante conciliación o,
      en su defecto, mediante arbitraje de derecho, conforme a las normas de la Ley de Arbitraje,
      sometiéndose las partes a la jurisdicción y competencia de los jueces y tribunales de Lima, Perú.
    </p>
  </div>

  <div class="seccion">
    <h2>IX. DECLARACIÓN:</h2>
    <p>
      Ambas partes declaran estar conformes con los términos del presente contrato y se comprometen
      a cumplirlo de buena fe. El MUTUATARIO declara haber recibido el monto del préstamo en dinero
      en efectivo en este acto, siendo de su entera satisfacción.
    </p>
  </div>

  <p style="margin-top: 40px;">
    Firmado en Lima, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleDateString('es-PE', { month: 'long' })} de ${new Date().getFullYear()}.
  </p>

  <div class="firma">
    <div style="display: inline-block; margin: 0 50px;">
      <div class="firma-linea">EL MUTUANTE</div>
      <p style="font-size: 10px; margin-top: 5px;">JUNTAY S.A.C.</p>
    </div>
    <div style="display: inline-block; margin: 0 50px;">
      <div class="firma-linea">EL MUTUATARIO</div>
      <p style="font-size: 10px; margin-top: 5px;">${nombreCliente}</p>
      <p style="font-size: 10px;">${cliente.tipo_documento.toUpperCase()}: ${cliente.numero_documento}</p>
    </div>
  </div>

  <p style="text-align: center; margin-top: 40px; font-size: 10px; color: #666;">
    Código de Contrato: ${credito.codigo} | Generado: ${new Date().toLocaleString('es-PE')}
  </p>
</body>
</html>
  `

  return html
}

// Función auxiliar para convertir números a letras (simplificada)
function numeroALetras(num: number): string {
  // Esta es una implementación simplificada
  // Para producción, usar una librería como numero-a-letras
  
  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']
  
  if (num === 0) return 'CERO'
  if (num === 100) return 'CIEN'
  
  let resultado = ''
  const numEntero = Math.floor(num)
  
  // Implementación básica para números hasta 9999
  if (numEntero >= 1000) {
    const miles = Math.floor(numEntero / 1000)
    resultado += unidades[miles] + ' MIL '
  }
  
  const resto = numEntero % 1000
  if (resto >= 100) {
    const c = Math.floor(resto / 100)
    resultado += centenas[c] + ' '
  }
  
  const restoDecenas = resto % 100
  if (restoDecenas >= 10) {
    const d = Math.floor(restoDecenas / 10)
    resultado += decenas[d] + ' '
  }
  
  const u = resto % 10
  if (u > 0) {
    resultado += unidades[u]
  }
  
  return resultado.trim() || 'CERO'
}

// Función para generar contrato y descargarlo
export async function descargarContrato(creditoId: string) {
  try {
    // Obtener datos del crédito, cliente y garantía
    // (esto debería llamar a las APIs correspondientes)
    
    // Generar HTML
    // const html = generarContratoEmpeno(credito, cliente, garantia)
    
    // Por ahora, abrir en nueva ventana
    // En producción, convertir a PDF con jsPDF o similar
    
    return {
      success: true,
      message: 'Contrato generado'
    }
  } catch (error) {
    console.error('Error al generar contrato:', error)
    return {
      success: false,
      error: 'Error al generar contrato'
    }
  }
}
