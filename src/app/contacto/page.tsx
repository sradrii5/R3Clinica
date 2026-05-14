import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/contact/ContactForm'
import { MessageCircle, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Solicita tu cita previa en R3Clinica o pídenos una propuesta para tu empresa. Rellena el formulario y te contactamos en menos de 24h.',
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '34600000000'

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Contacto</span>
            <h1 className="mt-3 text-5xl font-black">
              Hablemos de<br />
              <span className="gradient-text">tus objetivos</span>
            </h1>
            <p className="mt-4 text-neutral-400 max-w-lg mx-auto">
              Selecciona si eres un particular que busca cita previa o una empresa
              que quiere una propuesta corporativa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Formulario */}
            <div className="lg:col-span-3 glass rounded-3xl p-8">
              <ContactForm />
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* WhatsApp directo */}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20gustar%C3%ADa%20pedir%20m%C3%A1s%20informaci%C3%B3n`}
                target="_blank"
                rel="noopener noreferrer"
                id="contacto-whatsapp-direct"
                className="flex items-center gap-4 p-6 rounded-2xl bg-[#25d36615] border border-[#25d366]/30 hover:border-[#25d366]/60 transition-colors group"
              >
                <div className="p-3 rounded-xl bg-[#25d366]/20">
                  <MessageCircle className="w-6 h-6 text-[#25d366]" />
                </div>
                <div>
                  <p className="font-semibold text-white">WhatsApp directo</p>
                  <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    Respuesta en menos de 1 hora
                  </p>
                </div>
              </a>

              {/* Horarios */}
              <div className="glass rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-brand-400 font-semibold text-sm uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  Horario
                </div>
                {[
                  { dia: 'Lunes – Viernes', hora: '7:00 – 22:00' },
                  { dia: 'Sábado',          hora: '8:00 – 14:00' },
                  { dia: 'Domingo',         hora: 'Cerrado' },
                ].map((h) => (
                  <div key={h.dia} className="flex justify-between text-sm">
                    <span className="text-neutral-400">{h.dia}</span>
                    <span className={h.hora === 'Cerrado' ? 'text-neutral-600' : 'text-white font-medium'}>
                      {h.hora}
                    </span>
                  </div>
                ))}
              </div>

              {/* Localización */}
              <div className="glass rounded-2xl p-6 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-white">Dirección</p>
                  <p className="text-neutral-400 mt-1">C/ Ejemplo 1, Planta 2<br />28001 Madrid</p>
                </div>
              </div>

              {/* Empresa badge */}
              <div className="rounded-2xl border border-dashed border-brand-500/30 p-6 text-center">
                <p className="text-brand-400 font-semibold text-sm mb-1">¿Eres empresa?</p>
                <p className="text-neutral-500 text-xs mb-4">
                  Selecciona la pestaña "Empresa" en el formulario para una propuesta personalizada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
