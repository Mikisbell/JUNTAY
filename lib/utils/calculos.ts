// Funciones de cálculo puras (sin dependencias de servidor)

export interface CuotaCalculada {
  numero_cuota: number
  monto_capital: number
  monto_interes: number
  monto_total: number
  fecha_vencimiento: string
}

// Función para calcular cronograma de pagos
export function calcularCronograma(
  montoPrestado: number,
  tasaMensual: number,
  numeroCuotas: number,
  frecuenciaPago: 'diario' | 'semanal' | 'quincenal' | 'mensual',
  fechaDesembolso: Date
): CuotaCalculada[] {
  const cronograma: CuotaCalculada[] = []
  
  // Calcular tasa por período
  let tasaPeriodo = tasaMensual / 100
  if (frecuenciaPago === 'quincenal') tasaPeriodo = tasaPeriodo / 2
  if (frecuenciaPago === 'semanal') tasaPeriodo = tasaPeriodo / 4
  if (frecuenciaPago === 'diario') tasaPeriodo = tasaPeriodo / 30
  
  // Calcular monto de cuota (método francés)
  const montoCuota = (montoPrestado * tasaPeriodo * Math.pow(1 + tasaPeriodo, numeroCuotas)) / 
                     (Math.pow(1 + tasaPeriodo, numeroCuotas) - 1)
  
  let saldoCapital = montoPrestado
  let fechaActual = new Date(fechaDesembolso)
  
  // Días entre cuotas según frecuencia
  const diasEntreCuotas = {
    diario: 1,
    semanal: 7,
    quincenal: 15,
    mensual: 30
  }
  
  for (let i = 1; i <= numeroCuotas; i++) {
    // Calcular fecha de vencimiento
    fechaActual = new Date(fechaActual)
    fechaActual.setDate(fechaActual.getDate() + diasEntreCuotas[frecuenciaPago])
    
    // Calcular interés y capital
    const montoInteres = saldoCapital * tasaPeriodo
    const montoCapital = montoCuota - montoInteres
    
    cronograma.push({
      numero_cuota: i,
      monto_capital: parseFloat(montoCapital.toFixed(2)),
      monto_interes: parseFloat(montoInteres.toFixed(2)),
      monto_total: parseFloat(montoCuota.toFixed(2)),
      fecha_vencimiento: fechaActual.toISOString().split('T')[0]
    })
    
    saldoCapital -= montoCapital
  }
  
  return cronograma
}
