// src/components/portal/admin/CalendarioGlobalAdmin.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  obtenerResumenDiarioAction,
  obtenerFechasConSesionGlobalAction,
  moverCitaAction,
  SesionCliente
} from '@/app/portal/admin/actions'
import {
  ChevronLeft, ChevronRight, CalendarDays, Users, Clock,
  Dumbbell, ChevronDown, ChevronUp, ArrowRight, X, Check,
  AlertTriangle, Calendar, MoveRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const WEEKDAYS_ES = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function toLocalDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function formatDateLong(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return `${days[date.getDay()]}, ${d} de ${MONTHS_ES[m - 1]} de ${y}`
}

function isPastDate(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d) < today
}

function isTodayDate(dateStr: string): boolean {
  const today = new Date()
  const [y, m, d] = dateStr.split('-').map(Number)
  return today.getFullYear() === y && today.getMonth() === m - 1 && today.getDate() === d
}

function getIntensityClass(count: number): string {
  if (count >= 5) return 'bg-brand-500'
  if (count >= 3) return 'bg-brand-500/70'
  if (count >= 1) return 'bg-brand-500/40'
  return ''
}

// ─── Componente MoverCitaModal ────────────────────────────────────────────────

interface MoverCitaModalProps {
  cliente: SesionCliente
  fechaOrigen: string
  onConfirm: (clienteId: string, fechaOrigen: string, fechaDestino: string) => void
  onClose: () => void
  loading: boolean
  error: string | null
}

function MoverCitaModal({ cliente, fechaOrigen, onConfirm, onClose, loading, error }: MoverCitaModalProps) {
  const [fechaDestino, setFechaDestino] = useState('')

  const minDate = (() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0a0e0c] border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-md space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MoveRight className="w-4 h-4 text-brand-400" />
            Mover Cita
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl space-y-2">
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Atleta</p>
          <p className="text-sm font-bold text-white">{cliente.nombre} {cliente.apellidos}</p>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="bg-white/5 px-2 py-0.5 rounded font-mono">{formatDateLong(fechaOrigen)}</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="text-neutral-500">nueva fecha</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Nueva fecha de la sesión</label>
          <input
            type="date"
            value={fechaDestino}
            min={minDate}
            onChange={e => setFechaDestino(e.target.value)}
            className="w-full bg-[#080c0a]/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 [color-scheme:dark] transition-all"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => fechaDestino && onConfirm(cliente.clienteId, fechaOrigen, fechaDestino)}
            disabled={!fechaDestino || loading}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-black hover:bg-brand-400 transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <MoveRight className="w-3.5 h-3.5" />
                Confirmar Cambio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function CalendarioGlobalAdmin() {
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Datos del mes (puntos en el calendario)
  const [fechasDelMes, setFechasDelMes] = useState<{ fecha: string; count: number }[]>([])
  const [loadingMes, setLoadingMes] = useState(false)

  // Sesiones del día seleccionado
  const [sesiones, setSesiones] = useState<SesionCliente[]>([])
  const [loadingDia, setLoadingDia] = useState(false)

  // Ejercicios expandidos por cliente
  const [expandedClientes, setExpandedClientes] = useState<Set<string>>(new Set())

  // Modal mover cita
  const [moverModal, setMoverModal] = useState<{ cliente: SesionCliente; fechaOrigen: string } | null>(null)
  const [moverLoading, setMoverLoading] = useState(false)
  const [moverError, setMoverError] = useState<string | null>(null)
  const [moverSuccess, setMoverSuccess] = useState<string | null>(null)

  // ── Cargar fechas del mes al cambiar mes ──────────────────────────────────
  const cargarMes = useCallback(async (year: number, month: number) => {
    setLoadingMes(true)
    const res = await obtenerFechasConSesionGlobalAction(year, month)
    if (res.success) setFechasDelMes(res.fechas || [])
    setLoadingMes(false)
  }, [])

  useEffect(() => {
    cargarMes(calYear, calMonth)
    setSelectedDate(null)
    setSesiones([])
  }, [calYear, calMonth, cargarMes])

  // ── Cargar sesiones del día seleccionado ──────────────────────────────────
  const handleSelectDay = async (dateStr: string) => {
    setSelectedDate(dateStr)
    setExpandedClientes(new Set())
    setMoverSuccess(null)
    setLoadingDia(true)
    const res = await obtenerResumenDiarioAction(dateStr)
    setSesiones(res.sesiones || [])
    setLoadingDia(false)
  }

  // ── Mover cita ────────────────────────────────────────────────────────────
  const handleMoverCita = async (clienteId: string, fechaOrigen: string, fechaDestino: string) => {
    setMoverLoading(true)
    setMoverError(null)
    const res = await moverCitaAction({ clienteId, fechaOrigen, fechaDestino })
    setMoverLoading(false)

    if (res.success) {
      setMoverModal(null)
      setMoverSuccess(`Cita movida a ${formatDateLong(fechaDestino)} correctamente.`)
      // Refrescar datos del mes y limpiar día seleccionado
      cargarMes(calYear, calMonth)
      setSesiones(prev => prev.filter(s => s.clienteId !== clienteId))
      setTimeout(() => setMoverSuccess(null), 5000)
    } else {
      setMoverError(res.error || 'Error al mover la cita.')
    }
  }

  // ── Helpers del calendario ────────────────────────────────────────────────
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay()
  const firstDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1
  const totalDays = new Date(calYear, calMonth + 1, 0).getDate()

  const getCountForDay = (day: number) => {
    const dateStr = toLocalDateStr(calYear, calMonth, day)
    return fechasDelMes.find(f => f.fecha === dateStr)?.count || 0
  }

  const toggleCliente = (clienteId: string) => {
    setExpandedClientes(prev => {
      const next = new Set(prev)
      if (next.has(clienteId)) next.delete(clienteId)
      else next.add(clienteId)
      return next
    })
  }

  const isToday = (day: number) => {
    const t = new Date()
    return t.getDate() === day && t.getMonth() === calMonth && t.getFullYear() === calYear
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">

      {/* Cabecera */}
      <div className="glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Vista General de Entrenamientos</h2>
            <p className="text-sm text-neutral-400">Selecciona un día para ver todas las sesiones asignadas.</p>
          </div>
        </div>
      </div>

      {/* Feedback mover cita */}
      {moverSuccess && (
        <div className="flex items-center gap-3 p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-brand-400 text-sm animate-fade-in">
          <Check className="w-5 h-5 shrink-0" />
          {moverSuccess}
        </div>
      )}

      {/* Grid: Calendario + Panel lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">

        {/* ── Calendario ──────────────────────────────────────────────── */}
        <div className="glass-dark border border-white/5 rounded-3xl p-6 flex flex-col gap-4">

          {/* Header mes */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Calendario Global</p>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                {MONTHS_ES[calMonth]} {calYear}
                {loadingMes && <span className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin inline-block" />}
              </h4>
            </div>
            <div className="flex items-center gap-1 border border-white/10 rounded-xl p-1 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => {
                  if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
                  else setCalMonth(m => m - 1)
                }}
                className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
                  else setCalMonth(m => m + 1)
                }}
                className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Días semana */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS_ES.map((w, i) => (
              <span key={i} className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest py-1">{w}</span>
            ))}
          </div>

          {/* Grid días */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`e-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1
              const dateStr = toLocalDateStr(calYear, calMonth, day)
              const count = getCountForDay(day)
              const active = selectedDate === dateStr
              const today = isToday(day)
              const past = isPastDate(dateStr)
              const hasSession = count > 0

              return (
                <button
                  key={`d-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(dateStr)}
                  className={cn(
                    'aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer hover:scale-[1.05] gap-0.5',
                    active
                      ? 'bg-brand-500 text-black font-black shadow-lg shadow-brand-500/30'
                      : today
                      ? 'border border-brand-400/50 bg-brand-500/5 text-brand-400 font-bold'
                      : past && hasSession
                      ? 'bg-white/[0.03] border border-white/5 text-neutral-500 hover:border-white/15'
                      : hasSession
                      ? 'bg-white/[0.04] border border-white/10 text-neutral-200 hover:border-brand-500/30'
                      : 'bg-white/[0.01] border border-white/5 hover:border-white/15 text-neutral-500 hover:text-white'
                  )}
                >
                  <span className="text-xs font-semibold leading-none">{day}</span>
                  {hasSession && (
                    <span className={cn(
                      'text-[8px] font-black leading-none',
                      active ? 'text-black/60' : past ? 'text-neutral-600' : 'text-brand-400'
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Leyenda */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="text-brand-400 font-black text-[11px]">3</span>
                Número de sesiones ese día
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full border border-brand-400/50 bg-brand-500/5" />
                Hoy
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-600" />
                Historial
              </div>
            </div>
          </div>
        </div>

        {/* ── Panel Lateral: Sesiones del día ─────────────────────────── */}
        <div className="glass-dark border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
          {!selectedDate ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 gap-4">
              <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-neutral-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-500">Selecciona un día</p>
                <p className="text-xs text-neutral-700 max-w-[200px] mt-1">
                  Haz clic en cualquier día con sesiones asignadas para ver el detalle.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cabecera del panel */}
              <div className="space-y-1">
                <p className={cn(
                  'text-[10px] font-bold uppercase tracking-widest',
                  isPastDate(selectedDate) ? 'text-neutral-500' : isTodayDate(selectedDate) ? 'text-brand-400' : 'text-brand-400'
                )}>
                  {isPastDate(selectedDate) ? '📋 Historial' : isTodayDate(selectedDate) ? '📅 Hoy' : '📅 Próxima sesión'}
                </p>
                <h4 className="text-base font-bold text-white">{formatDateLong(selectedDate)}</h4>
              </div>

              {loadingDia ? (
                <div className="flex-1 flex items-center justify-center py-12">
                  <span className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : sesiones.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-3 border border-dashed border-white/8 rounded-2xl">
                  <Dumbbell className="w-8 h-8 text-neutral-700" />
                  <p className="text-sm text-neutral-500">Sin sesiones asignadas para este día.</p>
                  <p className="text-xs text-neutral-700">Ve a "Diseñar Planes" para añadir sesiones.</p>
                </div>
              ) : (
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[520px] pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                  {/* Resumen */}
                  <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <Users className="w-4 h-4 text-brand-400" />
                    <span className="text-xs text-neutral-300">
                      <span className="font-bold text-white">{sesiones.length}</span> {sesiones.length === 1 ? 'atleta' : 'atletas'} con sesión este día
                    </span>
                  </div>

                  {/* Lista de clientes */}
                  {sesiones.map(sesion => {
                    const expanded = expandedClientes.has(sesion.clienteId)
                    const esPasada = isPastDate(selectedDate)

                    return (
                      <div
                        key={sesion.clienteId}
                        className="bg-[#080c0a]/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-200"
                      >
                        {/* Fila principal del cliente */}
                        <div className="flex items-center gap-3 p-4">
                          {/* Avatar inicial */}
                          <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-black text-brand-400">
                              {sesion.nombre.charAt(0)}{sesion.apellidos.charAt(0)}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{sesion.nombre} {sesion.apellidos}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              {sesion.hora && (
                                <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                                  <Clock className="w-3 h-3" />
                                  {sesion.hora}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                                <Dumbbell className="w-3 h-3" />
                                {sesion.totalEjercicios} ejercicios
                              </span>
                              <span className={cn(
                                'text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider',
                                esPasada
                                  ? 'bg-neutral-700/40 text-neutral-500'
                                  : 'bg-brand-500/15 text-brand-400'
                              )}>
                                {esPasada ? 'Completada' : 'Pendiente'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Botón Mover cita (solo para hoy o futuro) */}
                            {!esPasada && (
                              <button
                                onClick={() => { setMoverError(null); setMoverModal({ cliente: sesion, fechaOrigen: selectedDate! }) }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 border border-white/10 text-neutral-400 hover:text-brand-400 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all cursor-pointer"
                                title="Mover a otra fecha"
                              >
                                <MoveRight className="w-3 h-3" />
                                Mover
                              </button>
                            )}
                            {/* Toggle ejercicios */}
                            <button
                              onClick={() => toggleCliente(sesion.clienteId)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                            >
                              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Lista de ejercicios (expandible) */}
                        {expanded && (
                          <div className="border-t border-white/5 px-4 py-3 space-y-2 animate-fade-in">
                            {sesion.ejercicios.map((ej, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <span className="text-[10px] font-mono text-brand-400/60 bg-brand-500/5 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-neutral-200 truncate">{ej.nombre}</p>
                                  <p className="text-[11px] text-neutral-600">
                                    {ej.series} series × {ej.repeticiones}
                                    {ej.notas && <span className="text-neutral-700"> · {ej.notas}</span>}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Mover Cita */}
      {moverModal && (
        <MoverCitaModal
          cliente={moverModal.cliente}
          fechaOrigen={moverModal.fechaOrigen}
          onConfirm={handleMoverCita}
          onClose={() => { setMoverModal(null); setMoverError(null) }}
          loading={moverLoading}
          error={moverError}
        />
      )}
    </div>
  )
}
