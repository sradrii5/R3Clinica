import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, Scale, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Aviso Legal | R3Clínicas',
  description:
    'Información legal, términos de uso y datos identificativos de R3Clínicas de acuerdo con la LSSI-CE y normativa vigente.',
}

export default function AvisoLegalPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Encabezado */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              Marco Legal LSSI-CE
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Aviso <span className="gradient-text">Legal</span>
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl mx-auto">
              Última actualización: {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Contenido Legal */}
          <div className="glass rounded-3xl p-8 sm:p-12 border border-white/5 space-y-8 text-neutral-300 text-sm leading-relaxed">
            {/* 1. Datos Identificativos */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-400" />
                1. Datos Identificativos del Titular
              </h2>
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se exponen los siguientes datos identificativos del titular del sitio web:
              </p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 font-mono text-xs text-neutral-300">
                <p><strong className="text-white">Denominación Social:</strong> R3Clínicas — Centro de Alto Rendimiento y Salud</p>
                <p><strong className="text-white">Domicilio Social:</strong> Calle Divina Pastora, 5, 47004 Valladolid, España</p>
                <p><strong className="text-white">Teléfono de Contacto:</strong> +34 602 73 82 39</p>
                <p><strong className="text-white">Correo Electrónico:</strong> info@r3clinica.com</p>
                <p><strong className="text-white">Actividad Principal:</strong> Servicios de fisioterapia, entrenamiento personal, nutrición y salud integral.</p>
              </div>
            </section>

            {/* 2. Condiciones de Uso */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
                2. Términos y Condiciones de Uso
              </h2>
              <p>
                El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
              </p>
              <p>
                El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que R3Clínicas ofrece a través de su portal y con carácter enunciativo pero no limitativo, a no emplearlos para:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-2">
                <li>Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público.</li>
                <li>Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos.</li>
                <li>Provocar daños en los sistemas físicos y lógicos de R3Clínicas, de sus proveedores o de terceras personas.</li>
              </ul>
            </section>

            {/* 3. Propiedad Intelectual e Industrial */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Propiedad Intelectual e Industrial</h2>
              <p>
                R3Clínicas por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
              </p>
              <p>
                Quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización previa y por escrito de R3Clínicas.
              </p>
            </section>

            {/* 4. Exclusión de Garantías y Responsabilidad */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. Exclusión de Garantías y Responsabilidad</h2>
              <p>
                R3Clínicas no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
              </p>
            </section>

            {/* 5. Legislación Aplicable y Jurisdicción */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">5. Legislación Aplicable y Jurisdicción</h2>
              <p>
                La relación entre R3Clínicas y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y Tribunales de la ciudad de Valladolid, salvo que la legislación aplicable disponga obligatoriamente otra cosa.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
