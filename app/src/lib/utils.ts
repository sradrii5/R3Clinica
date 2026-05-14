// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina clases CSS con soporte para Tailwind y condicionales */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
