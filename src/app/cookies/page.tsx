import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Cookie, Settings, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Cookies | R3Clínicas',
  description:
    'Información sobre el uso de cookies, tipologías y gestión de preferencias en el sitio web de R3Clínicas.',
}

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Encabezado */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
              <Cookie className="w-3.5 h-3.5" />
              Guía AEPD de Cookies
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Política de <span className="gradient-text">Cookies</span>
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl mx-auto">
              Te explicamos de forma transparente qué son las cookies, cuáles utilizamos y cómo puedes gestionarlas en tu navegador.
            </p>
          </div>

          {/* Contenido Cookies */}
          <div className="glass rounded-3xl p-8 sm:p-12 border border-white/5 space-y-8 text-neutral-300 text-sm leading-relaxed">
            {/* 1. ¿Qué son las cookies? */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-400" />
                1. ¿Qué es una Cookie?
              </h2>
              <p>
                Una cookie es un pequeño archivo de texto que un sitio web guarda en tu ordenador, tablet o dispositivo móvil cuando lo visitas. Permiten que la página recuerde tus acciones y preferencias (como inicio de sesión, idioma o consentimiento) durante un período de tiempo, para que no tengas que volver a introducirlos cada vez que vuelves al sitio o navegas de una página a otra.
              </p>
            </section>

            {/* 2. Tipos de Cookies que utilizamos */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Tipología de Cookies Utilizadas en R3Clínicas</h2>
              <p>En nuestra plataforma hacemos uso exclusivamente de las siguientes categorías de cookies:</p>

              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base">Cookies Técnicas y Estrictamente Necesarias</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-400">Siempre Activas</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Son imprescindibles para el correcto funcionamiento de la web, la autenticación segura en el portal privado del cliente, el mantenimiento de la sesión activa y el almacenamiento del propio consentimiento de privacidad.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base">Cookies de Análisis y Medición de Rendimiento</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-neutral-400">Opcionales</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Nos permiten cuantificar de forma totalmente anónima el número de visitantes y analizar estadísticamente la navegación para mejorar la velocidad y calidad del servicio ofrecido en R3Clínicas.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Desactivación o eliminación de cookies */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-400" />
                3. Cómo gestionar o bloquear Cookies en tu Navegador
              </h2>
              <p>
                Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador o dispositivo móvil:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-neutral-400 pl-2">
                <li><strong className="text-white">Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
                <li><strong className="text-white">Mozilla Firefox:</strong> Opciones &gt; Privacidad y Seguridad &gt; Cookies y datos del sitio.</li>
                <li><strong className="text-white">Safari (macOS / iOS):</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</li>
                <li><strong className="text-white">Microsoft Edge:</strong> Configuración &gt; Permisos del sitio &gt; Cookies y datos guardados.</li>
              </ul>
              <p className="text-xs text-neutral-500 pt-2">
                Ten en cuenta que si desactivas las cookies técnicas necesarias, es posible que algunas funcionalidades de la web o el acceso a la zona privada de usuarios no funcionen correctamente.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
