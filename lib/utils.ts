import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como moneda peruana (PEN)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount)
}

/**
 * Formatea una fecha en formato español
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Formatea una fecha con hora en formato español
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Calcula la diferencia en días entre dos fechas
 */
export function diffDays(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2
  const diff = Math.abs(d1.getTime() - d2.getTime())
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Genera un código único para créditos, pagos, etc.
 */
export function generateCode(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Valida un DNI peruano (8 dígitos)
 */
export function validateDNI(dni: string): boolean {
  return /^\d{8}$/.test(dni)
}

/**
 * Valida un RUC peruano (11 dígitos)
 */
export function validateRUC(ruc: string): boolean {
  return /^\d{11}$/.test(ruc)
}

/**
 * Calcula el interés de un préstamo
 */
export function calculateInterest(
  monto: number,
  tasaMensual: number,
  numeroCuotas: number
): number {
  const tasaDecimal = tasaMensual / 100
  return monto * tasaDecimal * numeroCuotas
}

/**
 * Calcula la cuota mensual de un préstamo
 */
export function calculateMonthlyPayment(
  monto: number,
  tasaMensual: number,
  numeroCuotas: number
): number {
  const interes = calculateInterest(monto, tasaMensual, numeroCuotas)
  return (monto + interes) / numeroCuotas
}

/**
 * Formatea un número de documento (DNI o RUC)
 */
export function formatDocument(documento: string): string {
  return documento.replace(/(\d{3})(?=\d)/g, '$1 ').trim()
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalize(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
