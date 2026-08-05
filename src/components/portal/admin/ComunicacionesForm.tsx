// src/components/portal/admin/ComunicacionesForm.tsx
'use client'

import { useState } from 'react'
import {
  enviarEmailAction,
  TipoPlantilla
} from '@/app/portal/admin/comunicaciones-actions'
import { generarWhatsAppLink } from '@/lib/whatsapp'
import {
  Mail, MessageCircle, Send, Check, AlertTriangle,
  Users, User, ChevronDown, ChevronUp, ExternalLink,
  Bell, Tag, FileText, Info, Phone
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ClienteCom {
  id: string
  nombre: string
  apellidos: string
  email: string | null
  telefono: string | null
}

interface ComunicacionesFormProps {
  clientes: ClienteCom[]
}

// ─── Plantillas predefinidas ──────────────────────────────────────────────────

interface Plantilla {
  tipo: TipoPlantilla
  icono: React.ReactNode
  label: string
  asunto: string
  mensaje: string
  color: string
}

const PLANTILLAS: Plantilla[] = [
  {
    tipo: 'recordatorio_cita',
    icono: <Bell className="w-4 h-4" />,
    label: 'Recordatorio de cita',
    color: 'brand',
    asunto: 'Recordatorio: Tu sesión en R3Clinica',
    mensaje: `Hola {nombre},

Te recordamos que tienes una sesión de entrenamiento próximamente en R3Clinica.

Por favor, avísanos con antelación si necesitas cancelar o cambiar la fecha para poder reorganizar tu agenda sin problema.

¡Nos vemos pronto! 💪

El equipo de R3Clinica`
  },
  {
    tipo: 'oferta_especial',
    icono: <Tag className="w-4 h-4" />,
    label: 'Oferta especial',
    color: 'amber',
    asunto: '🎯 Oferta exclusiva para ti — R3Clinica',
    mensaje: `Hola {nombre},

Tenemos una oferta especial que creemos que puede interesarte.

[Describe aquí la oferta: descuento, bono de sesiones, programa especial...]

Esta oferta está disponible por tiempo limitado. ¡No la dejes pasar!

Cualquier duda, estamos aquí para ayudarte.

El equipo de R3Clinica`
  },
  {
    tipo: 'actualizacion_plan',
    icono: <FileText className="w-4 h-4" />,
    label: 'Actualización de plan',
    color: 'purple',
    asunto: '📋 Tu plan de entrenamiento ha sido actualizado',
    mensaje: `Hola {nombre},

Hemos actualizado tu plan de entrenamiento en el portal de R3Clinica.

Puedes ver los cambios iniciando sesión en tu portal personal:
https://r3clinica.com/portal

Si tienes alguna pregunta sobre los nuevos ejercicios o la planificación, no dudes en consultarnos.

¡A por ello! 🚀

El equipo de R3Clinica`
  },
  {
    tipo: 'personalizado',
    icono: <Mail className="w-4 h-4" />,
    label: 'Mensaje personalizado',
    color: 'neutral',
    asunto: '',
    mensaje: `Hola {nombre},

`
  }
]

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function ComunicacionesForm({ clientes }: ComunicacionesFormProps) {

  // ── Sección activa ──────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<'email' | 'whatsapp'>('email')

  // ── Email: selección de destinatarios ──────────────────────────────────────
  const [emailMode, setEmailMode] = useState<'todos' | 'individual'>('todos')
  const [selectedClienteId, setSelectedClienteId] = useState('')

  // ── Email: plantilla y mensaje ──────────────────────────────────────────────
  const [plantillaActiva, setPlantillaActiva] = useState<TipoPlantilla>('recordatorio_cita')
  const [asunto, setAsunto] = useState(PLANTILLAS[0].asunto)
  const [mensaje, setMensaje] = useState(PLANTILLAS[0].mensaje)

  // ── Email: estado ───────────────────────────────────────────────────────────
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [pendingSetup, setPendingSetup] = useState(false)

  // ── WhatsApp ────────────────────────────────────────────────────────────────
  const [waClienteId, setWaClienteId] = useState('')
  const [waMensaje, setWaMensaje] = useState(`Hola, te contactamos desde R3Clinica. `)

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const clientesConEmail = clientes.filter(c => c.email)
  const clientesConTelefono = clientes.filter(c => c.telefono)

  const getDestinatarios = () => {
    if (emailMode === 'individual') {
      const c = clientes.find(cl => cl.id === selectedClienteId)
      return c && c.email ? [{ email: c.email, nombre: c.nombre }] : []
    }
    return clientesConEmail.map(c => ({ email: c.email!, nombre: c.nombre }))
  }

  const handlePlantilla = (p: Plantilla) => {
    setPlantillaActiva(p.tipo)
    setAsunto(p.asunto)
    setMensaje(p.mensaje)
  }

  const handleEnviarEmail = async () => {
    const destinatarios = getDestinatarios()
    if (destinatarios.length === 0) {
      setEmailError('Selecciona al menos un destinatario con email.')
      return
    }
    if (!asunto.trim()) {
      setEmailError('El asunto no puede estar vacío.')
      return
    }

    setSendingEmail(true)
    setEmailError(null)
    setEmailSuccess(null)
    setPendingSetup(false)

    const res = await enviarEmailAction({ destinatarios, tipo: plantillaActiva, asunto, mensaje })

    setSendingEmail(false)
    if (res.success) {
      setEmailSuccess(`✅ Email enviado correctamente a ${res.enviados} destinatario${res.enviados !== 1 ? 's' : ''}.`)
      setTimeout(() => setEmailSuccess(null), 6000)
    } else if (res.pendingSetup) {
      setPendingSetup(true)
    } else {
      setEmailError(res.error || 'Error al enviar el email.')
    }
  }

  const waCliente = clientes.find(c => c.id === waClienteId)
  const waLink = waCliente?.telefono
    ? generarWhatsAppLink(waCliente.telefono, waMensaje)
    : null

  const currentPlantilla = PLANTILLAS.find(p => p.tipo === plantillaActiva)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">

      {/* Cabecera */}
      <div className="glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Centro de Comunicaciones</h2>
            <p className="text-sm text-neutral-400">Envía emails y mensajes de WhatsApp a tus atletas.</p>
          </div>
        </div>
      </div>

      {/* Selector de sección */}
      <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSection('email')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer',
            activeSection === 'email'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          onClick={() => setActiveSection('whatsapp')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer',
            activeSection === 'whatsapp'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
      </div>

      {/* ── SECCIÓN EMAIL ──────────────────────────────────────────────────── */}
      {activeSection === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">

          {/* Panel izquierdo: config */}
          <div className="space-y-4">

            {/* Banner pending setup */}
            {pendingSetup && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <Info className="w-4 h-4 shrink-0" />
                  Servicio de email pendiente de configuración
                </div>
                <p className="text-xs text-amber-400/70 leading-relaxed">
                  Añade <code className="bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">RESEND_API_KEY</code> y <code className="bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">RESEND_FROM_EMAIL</code> a las variables de entorno del servidor para activar el envío de emails.
                </p>
              </div>
            )}

            {/* Destinatarios */}
            <div className="glass-dark border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-400" />
                Destinatarios
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => setEmailMode('todos')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border',
                    emailMode === 'todos'
                      ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                      : 'bg-white/[0.02] border-white/5 text-neutral-500 hover:text-white'
                  )}
                >
                  <Users className="w-3.5 h-3.5" />
                  Todos ({clientesConEmail.length})
                </button>
                <button
                  onClick={() => setEmailMode('individual')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border',
                    emailMode === 'individual'
                      ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                      : 'bg-white/[0.02] border-white/5 text-neutral-500 hover:text-white'
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  Individual
                </button>
              </div>

              {emailMode === 'individual' && (
                <select
                  value={selectedClienteId}
                  onChange={e => setSelectedClienteId(e.target.value)}
                  className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors cursor-pointer"
                >
                  <option value="" disabled className="bg-neutral-950 text-neutral-500">-- Selecciona un atleta --</option>
                  {clientesConEmail.map(c => (
                    <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                      {c.nombre} {c.apellidos} — {c.email}
                    </option>
                  ))}
                </select>
              )}

              {emailMode === 'todos' && (
                <p className="text-[11px] text-neutral-600">
                  Se enviará a los {clientesConEmail.length} clientes que tienen email registrado.
                  {clientes.length - clientesConEmail.length > 0 && (
                    <span className="text-amber-600/70"> {clientes.length - clientesConEmail.length} sin email.</span>
                  )}
                </p>
              )}
            </div>

            {/* Plantillas */}
            <div className="glass-dark border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Plantillas</h3>
              {PLANTILLAS.map(p => (
                <button
                  key={p.tipo}
                  onClick={() => handlePlantilla(p)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border',
                    plantillaActiva === p.tipo
                      ? 'bg-brand-500/10 border-brand-500/25 text-brand-400'
                      : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                  )}
                >
                  <span className={cn(
                    'p-1.5 rounded-lg shrink-0',
                    plantillaActiva === p.tipo ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-neutral-500'
                  )}>
                    {p.icono}
                  </span>
                  <span className="text-xs font-semibold">{p.label}</span>
                  {plantillaActiva === p.tipo && <Check className="w-3.5 h-3.5 ml-auto text-brand-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Panel derecho: editor + envío */}
          <div className="glass-dark border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-400" />
              Redactar Email
            </h3>

            {/* Asunto */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Asunto</label>
              <input
                type="text"
                value={asunto}
                onChange={e => setAsunto(e.target.value)}
                placeholder="Asunto del email..."
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>

            {/* Mensaje */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Mensaje</label>
                <span className="text-[10px] text-neutral-600">{'{nombre}'} se reemplaza con el nombre del atleta</span>
              </div>
              <textarea
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                rows={12}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors resize-none font-mono leading-relaxed"
              />
            </div>

            {/* Feedback */}
            {emailSuccess && (
              <div className="flex items-center gap-2 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400 text-xs animate-fade-in">
                <Check className="w-4 h-4 shrink-0" />
                {emailSuccess}
              </div>
            )}
            {emailError && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                {emailError}
              </div>
            )}

            {/* Botón enviar */}
            <button
              onClick={handleEnviarEmail}
              disabled={sendingEmail || (emailMode === 'individual' && !selectedClienteId)}
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-40 cursor-pointer shadow-lg"
            >
              {sendingEmail ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Email
                  {emailMode === 'todos' && clientesConEmail.length > 0 && (
                    <span className="text-xs font-normal opacity-60">({clientesConEmail.length})</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── SECCIÓN WHATSAPP ───────────────────────────────────────────────── */}
      {activeSection === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">

          {/* Panel izquierdo: selector cliente */}
          <div className="glass-dark border border-white/5 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-brand-400" />
              Seleccionar Atleta
            </h3>

            <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-xs text-amber-400/70 leading-relaxed">
              <Info className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
              Al hacer clic en "Abrir WhatsApp", se abrirá la app con el mensaje ya redactado. Solo tienes que darle a Enviar.
            </div>

            <select
              value={waClienteId}
              onChange={e => setWaClienteId(e.target.value)}
              className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors cursor-pointer"
            >
              <option value="" disabled className="bg-neutral-950 text-neutral-500">-- Selecciona un atleta --</option>
              {clientesConTelefono.map(c => (
                <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                  {c.nombre} {c.apellidos}
                </option>
              ))}
            </select>

            {clientesConTelefono.length === 0 && (
              <p className="text-xs text-neutral-600 text-center py-2">
                Ningún atleta tiene teléfono registrado aún.<br />
                Añádelo desde "Gestionar Clientes".
              </p>
            )}

            {waCliente && (
              <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-2">
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Atleta seleccionado</p>
                <p className="text-sm font-bold text-white">{waCliente.nombre} {waCliente.apellidos}</p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Phone className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="font-mono">{waCliente.telefono}</span>
                </div>
              </div>
            )}
          </div>

          {/* Panel derecho: mensaje */}
          <div className="glass-dark border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col">
            <h3 className="text-sm font-bold text-white">Mensaje de WhatsApp</h3>

            {/* Templates rápidos */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: '⏰ Recordatorio cita', msg: `Hola ${waCliente?.nombre || '{nombre}'}, te recordamos tu próxima sesión de entrenamiento en R3Clinica. ¡Nos vemos pronto! 💪` },
                { label: '📋 Plan actualizado', msg: `Hola ${waCliente?.nombre || '{nombre}'}, hemos actualizado tu plan de entrenamiento en el portal de R3Clinica. Échale un ojo cuando puedas 🏋️` },
                { label: '🎯 Oferta', msg: `Hola ${waCliente?.nombre || '{nombre}'}, tenemos una propuesta especial para ti. ¿Podemos hablar? 😊` },
              ].map(t => (
                <button
                  key={t.label}
                  onClick={() => setWaMensaje(t.msg)}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all cursor-pointer font-medium"
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Mensaje</label>
              <textarea
                value={waMensaje}
                onChange={e => setWaMensaje(e.target.value)}
                rows={8}
                placeholder="Escribe el mensaje de WhatsApp..."
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors resize-none leading-relaxed"
              />
            </div>

            <a
              href={waLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold transition-colors shadow-lg',
                waLink
                  ? 'bg-[#25D366] text-white hover:bg-[#20bc59] cursor-pointer'
                  : 'bg-white/5 text-neutral-600 cursor-not-allowed pointer-events-none'
              )}
            >
              <MessageCircle className="w-4 h-4" />
              Abrir WhatsApp
              {waLink && <ExternalLink className="w-3.5 h-3.5 opacity-60" />}
            </a>

            {!waClienteId && (
              <p className="text-[11px] text-neutral-600 text-center">Selecciona un atleta para activar el botón de WhatsApp.</p>
            )}
            {waClienteId && !waCliente?.telefono && (
              <p className="text-[11px] text-amber-600/70 text-center">Este atleta no tiene teléfono registrado.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
