import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Solicitud enviada',
  description: 'Tu mensaje ha sido recibido. Te contactaremos en breve.',
  robots: { index: false, follow: false },
}

export default function GraciasPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-6xl">✅</div>
      <h1 className="text-4xl font-bold">¡Mensaje enviado!</h1>
      <p className="text-neutral-400 max-w-md">
        Hemos recibido tu solicitud. Si no se ha abierto WhatsApp automáticamente,
        puedes contactarnos directamente desde el botón de abajo.
      </p>
      <Link
        href="/"
        className="mt-4 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
