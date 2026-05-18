'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Building2, User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Lead } from '@/types/leads'

// ─── Zod schema único sin preprocess para evitar inferencia unknown ───────────
const contactFormSchema = z.object({
  tipo:            z.enum(['particular', 'empresa']),
  nombre:          z.string().min(2, 'El nombre es obligatorio'),
  apellidos:       z.string().optional(),
  email:           z.string().email('Email no válido'),
  telefono:        z.string().optional(),
  servicioInteres: z.enum(['entrenamiento','fisioterapia','nutricion','readaptacion','antiaging','biohacking']).optional(),
  mensaje:         z.string().optional(),
  // Campos empresa
  nombreEmpresa:   z.string().optional(),
  cargoContacto:   z.string().optional(),
  numEmpleados:    z.coerce.number().optional(),
  sector:          z.string().optional(),
  descripcionNecesidad: z.string().optional(),
}).refine((data) => {
  if (data.tipo === 'empresa' && (!data.nombreEmpresa || data.nombreEmpresa.length < 2)) {
    return false;
  }
  return true;
}, {
  message: 'El nombre de empresa es obligatorio',
  path: ['nombreEmpresa'],
})

type ContactFormData = z.infer<typeof contactFormSchema>

const SERVICIOS = [
  { value: 'entrenamiento', label: 'Entrenamiento Personal' },
  { value: 'fisioterapia',  label: 'Fisioterapia' },
  { value: 'nutricion',     label: 'Nutrición Deportiva' },
  { value: 'readaptacion',  label: 'Readaptación Funcional' },
  { value: 'antiaging',     label: 'Anti-aging' },
  { value: 'biohacking',    label: 'Biohacking' },
]

// ─── Subcomponentes ────────────────────────────────────────────────────────────
function Field({
  label, error, children, required,
}: {
  label: string; error?: string; children: React.ReactNode; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-300">
        {label} {required && <span className="text-brand-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-500/60 focus:bg-white/8 transition-all duration-200 text-sm'

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ContactForm() {
  const [tipo, setTipo] = useState<'particular' | 'empresa'>('particular')
  const [sending, setSending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema) as any, // Cast a any para evitar error de duplicidad de tipos en build
    defaultValues: { tipo: 'particular' },
  })

  const handleTipoChange = (t: 'particular' | 'empresa') => {
    setTipo(t)
    reset({ tipo: t })
  }

  const onSubmit = async (data: ContactFormData) => {
    setSending(true)
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data as Lead),
      })
      const result = await res.json()

      if (!result.success) {
        setServerError(result.error ?? 'Error al enviar el formulario.')
        return
      }

      if (typeof window !== 'undefined') {
        window.open(result.whatsappUrl, '_blank')
      }
      router.push('/gracias')
    } catch {
      setServerError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 gap-1 bg-white/5">
        {(['particular', 'empresa'] as const).map((t) => (
          <button
            key={t}
            type="button"
            id={`toggle-${t}`}
            onClick={() => handleTipoChange(t)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
              tipo === t
                ? 'bg-brand-500 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white'
            )}
          >
            {t === 'particular' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            {t === 'particular' ? 'Particular' : 'Empresa'}
          </button>
        ))}
      </div>

      <input type="hidden" {...register('tipo')} value={tipo} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre" required error={errors.nombre?.message}>
          <input {...register('nombre')} placeholder="Ana García" className={inputClass} id="field-nombre" />
        </Field>
        <Field label="Apellidos" error={errors.apellidos?.message}>
          <input {...register('apellidos')} placeholder="García López" className={inputClass} id="field-apellidos" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email" required error={errors.email?.message}>
          <input {...register('email')} type="email" placeholder="ana@email.com" className={inputClass} id="field-email" />
        </Field>
        <Field label="Teléfono" error={errors.telefono?.message}>
          <input {...register('telefono')} type="tel" placeholder="+34 600 000 000" className={inputClass} id="field-telefono" />
        </Field>
      </div>

      <Field label="Servicio de interés" error={errors.servicioInteres?.message}>
        <select {...register('servicioInteres')} className={cn(inputClass, 'cursor-pointer')} id="field-servicio">
          <option value="">Selecciona un servicio</option>
          {SERVICIOS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </Field>

      {tipo === 'empresa' && (
        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-brand-500/20 bg-brand-500/5">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Datos de empresa</p>

          <Field label="Nombre de la empresa" required error={errors.nombreEmpresa?.message}>
            <input {...register('nombreEmpresa')} placeholder="Empresa S.L." className={inputClass} id="field-empresa" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tu cargo">
              <input {...register('cargoContacto')} placeholder="Director de RRHH" className={inputClass} id="field-cargo" />
            </Field>
            <Field label="Nº de empleados">
              <input {...register('numEmpleados')} type="number" placeholder="50" min={1} className={inputClass} id="field-empleados" />
            </Field>
          </div>

          <Field label="Sector">
            <input {...register('sector')} placeholder="Tecnología, Retail, Salud…" className={inputClass} id="field-sector" />
          </Field>

          <Field label="¿Qué necesitáis?">
            <textarea
              {...register('descripcionNecesidad')}
              rows={3}
              placeholder="Describe brevemente el programa que buscáis…"
              className={cn(inputClass, 'resize-none')}
              id="field-necesidad"
            />
          </Field>
        </div>
      )}

      <Field label="Mensaje" error={errors.mensaje?.message}>
        <textarea
          {...register('mensaje')}
          rows={tipo === 'empresa' ? 2 : 4}
          placeholder={
            tipo === 'empresa'
              ? 'Información adicional…'
              : 'Cuéntanos tu objetivo o cualquier consulta…'
          }
          className={cn(inputClass, 'resize-none')}
          id="field-mensaje"
        />
      </Field>

      {serverError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        id="contact-submit-btn"
        disabled={sending}
        className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-[#25D366]/20"
      >
        {sending ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Enviando…</>
        ) : (
          <>
            {tipo === 'empresa' ? 'Solicitar propuesta' : 'Pedir cita'}
            <Send className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-xs text-neutral-600 text-center">
        Al enviar, aceptas nuestra{' '}
        <a href="/privacidad" className="underline hover:text-neutral-400">política de privacidad</a>.
        Te redirigiremos a WhatsApp para confirmar tu solicitud.
      </p>
    </form>
  )
}
