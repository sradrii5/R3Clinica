import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Lock, ShieldCheck, Mail, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidad | R3Clínicas',
  description:
    'Información detallada sobre la protección de datos personales y los derechos RGPD de los usuarios en R3Clínicas.',
}

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Encabezado */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              Protección de Datos RGPD (UE 2016/679)
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Política de <span className="gradient-text">Privacidad</span>
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl mx-auto">
              En R3Clínicas garantizamos la máxima seguridad y confidencialidad en el tratamiento de tus datos personales.
            </p>
          </div>

          {/* Contenido Privacidad */}
          <div className="glass rounded-3xl p-8 sm:p-12 border border-white/5 space-y-8 text-neutral-300 text-sm leading-relaxed">
            {/* 1. Responsable */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
                1. Responsable del Tratamiento
              </h2>
              <p>
                De conformidad con el Reglamento General de Protección de Datos (RGPD UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD), te informamos de que el responsable del tratamiento de tus datos es:
              </p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-xs font-mono text-neutral-300">
                <p><strong className="text-white">Identidad:</strong> R3Clínicas</p>
                <p><strong className="text-white">Dirección:</strong> Calle Divina Pastora, 5, 47004 Valladolid</p>
                <p><strong className="text-white">Contacto DPD / Privacidad:</strong> info@r3clinica.com</p>
                <p><strong className="text-white">Teléfono:</strong> +34 602 73 82 39</p>
              </div>
            </section>

            {/* 2. Finalidades y Legitimación */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Finalidades y Bases Legitimadoras del Tratamiento</h2>
              <p>Tratamos tus datos personales para las siguientes finalidades específicas:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-brand-400" />
                    Gestión de Citas y Consultas
                  </div>
                  <p className="text-xs text-neutral-400">
                    Atender tus solicitudes de cita de fisioterapia, entrenamiento o valoración a través de formularios o WhatsApp.
                  </p>
                  <span className="text-[10px] text-brand-400 uppercase font-semibold">Base: Ejecución de contrato / Precontrato</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-brand-400" />
                    Acceso al Portal Privado
                  </div>
                  <p className="text-xs text-neutral-400">
                    Gestionar tu cuenta de usuario para que puedas acceder a tus rutinas de ejercicios, dieta y seguimiento.
                  </p>
                  <span className="text-[10px] text-brand-400 uppercase font-semibold">Base: Ejecución de servicio contratado</span>
                </div>
              </div>
            </section>

            {/* 3. Conservación de Datos */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Plazos de Conservación de Datos</h2>
              <p>
                Los datos personales proporcionados se conservarán mientras se mantenga la relación profesional o contractual con el cliente, y durante los plazos legalmente exigidos para el cumplimiento de obligaciones administrativas o sanitarias aplicables.
              </p>
            </section>

            {/* 4. Cesión de Datos a Terceros */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. Destinatarios y Encargados de Tratamiento</h2>
              <p>
                Tus datos no se cederán a terceros bajo ninguna circunstancia salvo obligación legal previa. Para la prestación técnica de la plataforma web y la base de datos segura, utilizamos proveedores tecnológicos que cumplen los estándares europeos del RGPD (Supabase / Vercel).
              </p>
            </section>

            {/* 5. Derechos de los Usuarios */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-400" />
                5. Derechos del Usuario (ARCO-POL)
              </h2>
              <p>
                Como interesado, tienes derecho a obtener confirmación sobre si en R3Clínicas estamos tratando tus datos personales. Tienes derecho a:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-2">
                <li><strong className="text-white">Acceso:</strong> Consultar qué datos personales tenemos sobre ti.</li>
                <li><strong className="text-white">Rectificación:</strong> Solicitar la modificación de datos inexactos.</li>
                <li><strong className="text-white">Supresión (Olvido):</strong> Solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
                <li><strong className="text-white">Oposición y Limitación:</strong> Oponerte al tratamiento o solicitar su limitación.</li>
                <li><strong className="text-white">Portabilidad:</strong> Recibir tus datos personales en un formato estructurado.</li>
              </ul>
              <p className="pt-2">
                Para ejercitar cualquiera de estos derechos, puedes enviar una solicitud por escrito adjuntando copia de tu DNI a <strong className="text-white">info@r3clinica.com</strong> o por correo postal a Calle Divina Pastora, 5, 47004 Valladolid.
              </p>
              <p className="text-xs text-neutral-400">
                Si consideras que tus derechos no han sido adecuadamente atendidos, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline">www.aepd.es</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
