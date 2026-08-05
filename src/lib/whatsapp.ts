// src/lib/whatsapp.ts
// Helper de cliente: genera deep links de WhatsApp sin llamadas al servidor.
// NO incluir 'use server' — se ejecuta en el cliente.

/**
 * Genera un deep link de WhatsApp con un mensaje pre-rellenado.
 * @param telefono - Número con prefijo internacional (ej: "34612345678")
 * @param mensaje - Texto que aparecerá en el campo de mensaje de WhatsApp
 */
export function generarWhatsAppLink(telefono: string, mensaje: string): string {
  const numeroLimpio = telefono.replace(/\D/g, '')
  const mensajeCodificado = encodeURIComponent(mensaje)
  return `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`
}
