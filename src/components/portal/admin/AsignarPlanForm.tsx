// src/components/portal/admin/AsignarPlanForm.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  guardarSesionFechaAction,
  obtenerEjerciciosPorFechaAction,
  obtenerFechasConSesionAction,
  guardarPlanCompletoAction,
  EjercicioInput,
  ComidaInput
} from '@/app/portal/admin/actions'
import {
  Dumbbell, Salad, Plus, Trash2, Save, CheckCircle, AlertTriangle,
  ChevronLeft, ChevronRight, Calendar, Copy, X, AlertCircle, Wand2, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface ClienteSimple {
  id: string
  nombre: string
  apellidos: string
  objetivo?: string | null
}

interface EjercicioCatalogo {
  id: string
  nombre: string
  descripcion: string | null
  grupo_muscular: string
  imagen_url: string | null
  video_url: string | null
}

interface AsignarPlanFormProps {
  clientes: ClienteSimple[]
  catalogo: EjercicioCatalogo[]
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

// ─── Diff helpers ─────────────────────────────────────────────────────────────

interface DiffLine {
  type: 'added' | 'removed' | 'changed'
  text: string
}

function buildDiff(original: EjercicioInput[], current: EjercicioInput[]): DiffLine[] {
  const lines: DiffLine[] = []
  const maxLen = Math.max(original.length, current.length)

  for (let i = 0; i < maxLen; i++) {
    const orig = original[i]
    const curr = current[i]

    if (!orig && curr) {
      lines.push({ type: 'added', text: `${curr.nombre}: añadido` })
      continue
    }
    if (orig && !curr) {
      lines.push({ type: 'removed', text: `${orig.nombre}: eliminado` })
      continue
    }
    if (orig && curr) {
      const changes: string[] = []
      if (orig.nombre !== curr.nombre) changes.push(`nombre: ${orig.nombre} → ${curr.nombre}`)
      if (orig.series !== curr.series) changes.push(`series: ${orig.series} → ${curr.series}`)
      if (orig.repeticiones !== curr.repeticiones) changes.push(`reps: ${orig.repeticiones} → ${curr.repeticiones}`)
      if ((orig.notas || '') !== (curr.notas || '')) changes.push(`notas: "${orig.notas || ''}" → "${curr.notas || ''}"`)
      if (changes.length > 0) {
        lines.push({ type: 'changed', text: `${curr.nombre}: ${changes.join(' · ')}` })
      }
    }
  }

  return lines
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function AsignarPlanForm({ clientes, catalogo }: AsignarPlanFormProps) {
  // Cliente seleccionado
  const [selectedClienteId, setSelectedClienteId] = useState('')

  // Estado del calendario
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Fechas con sesión para el cliente actual
  const [fechasConSesion, setFechasConSesion] = useState<string[]>([])

  // Editor de sesión
  const [ejercicios, setEjercicios] = useState<EjercicioInput[]>([])
  const [ejerciciosOriginal, setEjerciciosOriginal] = useState<EjercicioInput[]>([])
  const [horaSesion, setHoraSesion] = useState('')
  const [loadingSession, setLoadingSession] = useState(false)

  // Copiar sesión
  const [showCopyPicker, setShowCopyPicker] = useState(false)

  // Popup de confirmación para sesiones pasadas
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingDiff, setPendingDiff] = useState<DiffLine[]>([])

  // Estado del guardado
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Nutrición
  const [planNombre, setPlanNombre] = useState('Pauta Nutricional de Alto Rendimiento')
  const [planDescripcion, setPlanDescripcion] = useState('Plan alto en proteínas, grasas saludables de calidad y carbohidratos complejos de absorción lenta.')
  const [caloriasObjetivo, setCaloriasObjetivo] = useState(2500)
  const [comidas, setComidas] = useState<ComidaInput[]>([
    { nombre: 'Desayuno', descripcion: '3 huevos a la plancha, 1 aguacate mediano, 60g de avena cocida con agua y puñado de arándanos.' },
    { nombre: 'Almuerzo / Comida', descripcion: '200g de pechuga de pollo, 100g de arroz basmati cocido, brócoli salteado al vapor y cucharada de aceite de oliva.' },
    { nombre: 'Cena', descripcion: '180g de salmón salvaje al horno, ensalada grande de espinacas tiernas, tomate, pepino y espárragos.' }
  ])
  const [loadingNutricion, setLoadingNutricion] = useState(false)
  const [successNutricion, setSuccessNutricion] = useState(false)
  const [errorNutricion, setErrorNutricion] = useState<string | null>(null)

  // Scroll refs para comidas
  const comidasContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftShadowCom, setShowLeftShadowCom] = useState(false)
  const [showRightShadowCom, setShowRightShadowCom] = useState(false)

  // ─── Cargar fechas con sesión cuando cambia el cliente ──────────────────────
  useEffect(() => {
    if (!selectedClienteId) {
      setFechasConSesion([])
      setSelectedDate(null)
      setEjercicios([])
      return
    }
    obtenerFechasConSesionAction(selectedClienteId).then(res => {
      if (res.success) setFechasConSesion(res.fechas)
    })
  }, [selectedClienteId])

  // ─── Cargar ejercicios cuando se selecciona una fecha ───────────────────────
  const loadSessionForDate = useCallback(async (date: string) => {
    if (!selectedClienteId) return
    setLoadingSession(true)
    setError(null)
    const res = await obtenerEjerciciosPorFechaAction(selectedClienteId, date)
    const loaded: EjercicioInput[] = (res.ejercicios || []).map((e: any) => ({
      nombre: e.nombre,
      series: e.series,
      repeticiones: e.repeticiones,
      notas: e.notas || '',
      imagen_url: e.imagen_url,
      video_url: e.video_url,
      fecha: date,
      hora: e.hora || null
    }))
    setEjercicios(loaded)
    setEjerciciosOriginal(JSON.parse(JSON.stringify(loaded)))
    setHoraSesion(loaded[0]?.hora || '')
    setLoadingSession(false)
  }, [selectedClienteId])

  const handleSelectDay = (dateStr: string) => {
    setSelectedDate(dateStr)
    setHoraSesion('')
    setShowCopyPicker(false)
    setError(null)
    setSuccess(false)
    loadSessionForDate(dateStr)
  }

  // ─── Calendario helpers ──────────────────────────────────────────────────────
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay()
  const firstDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1
  const totalDays = new Date(calYear, calMonth + 1, 0).getDate()

  const isToday = (day: number) => {
    const t = new Date()
    return t.getDate() === day && t.getMonth() === calMonth && t.getFullYear() === calYear
  }
  const isSelected = (day: number) => selectedDate === toLocalDateStr(calYear, calMonth, day)
  const hasSession = (day: number) => fechasConSesion.includes(toLocalDateStr(calYear, calMonth, day))
  const isPast = (day: number) => isPastDate(toLocalDateStr(calYear, calMonth, day))

  // ─── Ejercicios handlers ─────────────────────────────────────────────────────
  const addEjercicio = () => {
    if (!selectedDate) return
    setEjercicios(prev => [...prev, {
      nombre: '', series: 3, repeticiones: '10-12', notas: '', imagen_url: null, video_url: null, fecha: selectedDate, hora: horaSesion || null
    }])
  }

  const removeEjercicio = (index: number) => setEjercicios(prev => prev.filter((_, i) => i !== index))

  const updateEjercicio = (index: number, field: keyof EjercicioInput, value: string | number) => {
    setEjercicios(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // ─── Copiar sesión desde otra fecha ─────────────────────────────────────────
  const handleCopyFromDate = async (sourceDate: string) => {
    if (!selectedClienteId || !selectedDate) return
    setShowCopyPicker(false)
    setLoadingSession(true)
    const res = await obtenerEjerciciosPorFechaAction(selectedClienteId, sourceDate)
    const copied: EjercicioInput[] = (res.ejercicios || []).map((e: any) => ({
      nombre: e.nombre,
      series: e.series,
      repeticiones: e.repeticiones,
      notas: e.notas || '',
      imagen_url: e.imagen_url,
      video_url: e.video_url,
      fecha: selectedDate,
      hora: e.hora || null
    }))
    setEjercicios(copied)
    if (copied[0]?.hora) {
      setHoraSesion(copied[0].hora)
    }
    setLoadingSession(false)
  }

  // ─── Guardar sesión ──────────────────────────────────────────────────────────
  const handleSaveSession = async () => {
    if (!selectedClienteId || !selectedDate) return

    // Si es pasado, calcular diff y mostrar popup de confirmación
    if (isPastDate(selectedDate)) {
      const diff = buildDiff(ejerciciosOriginal, ejercicios)
      if (diff.length === 0) {
        setError('No hay cambios que guardar.')
        return
      }
      setPendingDiff(diff)
      setShowConfirmDialog(true)
      return
    }

    await doSaveSession()
  }

  const doSaveSession = async () => {
    if (!selectedClienteId || !selectedDate) return
    setLoading(true)
    setError(null)
    setSuccess(false)
    setShowConfirmDialog(false)

    const ejerciciosAGuardar = ejercicios.map(e => ({
      ...e,
      hora: horaSesion || e.hora || null
    }))

    const result = await guardarSesionFechaAction({
      clienteId: selectedClienteId,
      fecha: selectedDate,
      ejercicios: ejerciciosAGuardar
    })

    setLoading(false)
    if (result.success) {
      setSuccess(true)
      setEjerciciosOriginal(JSON.parse(JSON.stringify(ejercicios)))
      // Actualizar lista de fechas con sesión
      if (!fechasConSesion.includes(selectedDate)) {
        setFechasConSesion(prev => [...prev, selectedDate])
      }
      setTimeout(() => setSuccess(false), 4000)
    } else {
      setError(result.error || 'Error al guardar la sesión.')
    }
  }

  // ─── Guardar nutrición (independiente) ──────────────────────────────────────
  const handleSaveNutricion = async () => {
    if (!selectedClienteId) return
    setLoadingNutricion(true)
    setErrorNutricion(null)

    const result = await guardarPlanCompletoAction({
      clienteId: selectedClienteId,
      rutinaNombre: '',
      rutinaDescripcion: '',
      ejercicios: [],
      planNombre,
      planDescripcion,
      caloriasObjetivo,
      comidas
    })

    setLoadingNutricion(false)
    if (result.success) {
      setSuccessNutricion(true)
      setTimeout(() => setSuccessNutricion(false), 4000)
    } else {
      setErrorNutricion(result.error || 'Error al guardar la pauta.')
    }
  }

  const handleScrollCom = () => {
    const c = comidasContainerRef.current
    if (c) {
      setShowLeftShadowCom(c.scrollLeft > 10)
      setShowRightShadowCom(c.scrollLeft < c.scrollWidth - c.clientWidth - 15)
    }
  }

  useEffect(() => {
    handleScrollCom()
    window.addEventListener('resize', handleScrollCom)
    return () => window.removeEventListener('resize', handleScrollCom)
  }, [comidas])

  const selectedClienteObjetivo = clientes.find(c => c.id === selectedClienteId)?.objetivo

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">

      {/* ── Cabecera: Selector de Cliente ─────────────────────────────────── */}
      <div className="glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -z-10" />
        <div>
          <h2 className="text-xl font-bold text-white">Diseñar Sesiones de Entrenamiento</h2>
          <p className="text-sm text-neutral-400">Selecciona un atleta y haz clic en un día del calendario para asignar su sesión.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 uppercase tracking-widest">Seleccionar Atleta</label>
          <select
            value={selectedClienteId}
            onChange={e => { setSelectedClienteId(e.target.value); setSelectedDate(null); setEjercicios([]) }}
            className="w-full bg-[#080c0a]/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
          >
            <option value="" disabled className="bg-[#080c0a] text-neutral-600">-- Selecciona un atleta --</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id} className="bg-[#080c0a] text-white">{c.nombre} {c.apellidos}</option>
            ))}
          </select>
        </div>
        {selectedClienteId && selectedClienteObjetivo && (
          <div className="p-4 bg-[#080c0a]/60 border border-white/5 rounded-2xl text-sm">
            <span className="text-neutral-500 font-medium">Objetivo: </span>
            <span className="text-neutral-300 italic">"{selectedClienteObjetivo}"</span>
          </div>
        )}
      </div>

      {/* ── Bloque Entrenamiento: Calendario + Editor ─────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Sesiones de Entrenamiento</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">

          {/* ─ Calendario ──────────────────────────────────────────────────── */}
          <div className="glass-dark border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
            {/* Header mes */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">Calendario</p>
                <h4 className="text-base font-bold text-white">{MONTHS_ES[calMonth]} {calYear}</h4>
              </div>
              <div className="flex items-center gap-1 border border-white/10 rounded-xl p-1 bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}
                  className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}
                  className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!selectedClienteId && (
              <p className="text-xs text-neutral-600 text-center py-6">Selecciona un atleta para ver su calendario.</p>
            )}

            {selectedClienteId && (
              <>
                {/* Días semana */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {WEEKDAYS_ES.map((w, i) => (
                    <span key={i} className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest py-1">{w}</span>
                  ))}
                </div>

                {/* Grid días */}
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const day = i + 1
                    const dateStr = toLocalDateStr(calYear, calMonth, day)
                    const active = isSelected(day)
                    const today = isToday(day)
                    const hasSess = hasSession(day)
                    const past = isPast(day)

                    return (
                      <button
                        key={`d-${day}`}
                        type="button"
                        onClick={() => handleSelectDay(dateStr)}
                        className={cn(
                          "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer hover:scale-[1.05]",
                          active
                            ? "bg-brand-500 text-black font-black shadow-lg shadow-brand-500/30"
                            : today
                            ? "border border-brand-400/50 bg-brand-500/5 text-brand-400 font-bold"
                            : past && hasSess
                            ? "bg-white/[0.03] border border-white/5 text-neutral-500 hover:border-white/15"
                            : "bg-white/[0.01] border border-white/5 hover:border-white/20 text-neutral-400 hover:text-white"
                        )}
                      >
                        <span className="text-xs font-semibold">{day}</span>
                        {hasSess && (
                          <span className={cn(
                            "w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2",
                            active ? "bg-black" : past ? "bg-neutral-600" : "bg-brand-500"
                          )} />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Leyenda */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />Sesión futura
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-600" />Historial
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full border border-brand-400/50 bg-brand-500/5" />Hoy
                  </div>
                </div>

                {/* Hora de la sesión */}
                {selectedDate && (
                  <div className="pt-3 border-t border-white/5 space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      Hora de la sesión
                    </label>
                    <input
                      type="time"
                      value={horaSesion}
                      onChange={(e) => {
                        const newHora = e.target.value
                        setHoraSesion(newHora)
                        setEjercicios(prev => prev.map(ej => ({ ...ej, hora: newHora || null })))
                      }}
                      className="w-full bg-[#080c0a]/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* ─ Panel Editor de Sesión ─────────────────────────────────────── */}
          <div className="glass-dark border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
            {!selectedDate ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-3">
                <Calendar className="w-10 h-10 text-neutral-700" />
                <p className="text-sm font-semibold text-neutral-500">Selecciona un día</p>
                <p className="text-xs text-neutral-700 max-w-[200px]">Haz clic en cualquier día del calendario para ver o editar la sesión.</p>
              </div>
            ) : (
              <>
                {/* Cabecera del editor */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={cn("text-[10px] font-bold uppercase tracking-widest",
                      isPastDate(selectedDate) ? "text-neutral-500" : "text-brand-400"
                    )}>
                      {isPastDate(selectedDate) ? '📋 Sesión pasada (historial)' : '📅 Sesión activa'}
                    </p>
                    <h4 className="text-base font-bold text-white mt-0.5">{formatDateLong(selectedDate)}</h4>
                  </div>
                  {/* Botón copiar sesión */}
                  {fechasConSesion.filter(f => f !== selectedDate).length > 0 && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCopyPicker(p => !p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copiar sesión
                      </button>
                      {showCopyPicker && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-[#0a0e0c] border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
                          <div className="p-3 border-b border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-white">Copiar desde...</span>
                            <button type="button" onClick={() => setShowCopyPicker(false)} className="text-neutral-500 hover:text-white cursor-pointer">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="max-h-48 overflow-y-auto py-1">
                            {fechasConSesion
                              .filter(f => f !== selectedDate)
                              .map(f => (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => handleCopyFromDate(f)}
                                  className="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                                >
                                  {formatDateLong(f)}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Lista de ejercicios */}
                {loadingSession ? (
                  <div className="flex-1 flex items-center justify-center py-8">
                    <span className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="flex-1 space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {ejercicios.length === 0 && (
                      <div className="flex flex-col items-center justify-center text-center py-8 border border-dashed border-white/10 rounded-2xl">
                        <Dumbbell className="w-8 h-8 text-neutral-700 mb-2" />
                        <p className="text-xs text-neutral-500">Sin ejercicios para este día.</p>
                        <p className="text-[11px] text-neutral-700 mt-1">Añade ejercicios o copia de otra sesión.</p>
                      </div>
                    )}

                    {ejercicios.map((ej, index) => (
                      <div
                        key={index}
                        className="p-4 bg-[#080c0a]/50 border border-white/5 rounded-2xl space-y-3 relative group hover:border-white/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded font-bold">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <select
                            value={ej.nombre}
                            onChange={e => {
                              const sel = catalogo.find(c => c.nombre === e.target.value)
                              const upd = [...ejercicios]
                              upd[index] = { ...upd[index], nombre: e.target.value, imagen_url: sel?.imagen_url || null, video_url: sel?.video_url || null }
                              setEjercicios(upd)
                            }}
                            className="flex-1 bg-transparent border-b border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-500 transition-colors py-0.5 cursor-pointer"
                          >
                            <option value="" disabled className="bg-neutral-950 text-neutral-500">-- Selecciona ejercicio --</option>
                            {Array.from(new Set(catalogo.map(c => c.grupo_muscular))).map(grupo => (
                              <optgroup key={grupo} label={grupo} className="bg-neutral-950 text-brand-400 font-bold">
                                {catalogo.filter(c => c.grupo_muscular === grupo).map(c => (
                                  <option key={c.id} value={c.nombre} className="bg-neutral-900 text-white font-normal">{c.nombre}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeEjercicio(index)}
                            className="text-neutral-600 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {ej.imagen_url && (
                          <div className="relative h-24 rounded-xl overflow-hidden border border-white/5 bg-neutral-900">
                            <img src={ej.imagen_url} alt={ej.nombre} className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Series</label>
                            <input
                              type="number" min={1} max={10}
                              value={ej.series || ''}
                              onChange={e => updateEjercicio(index, 'series', e.target.value ? Number(e.target.value) : 0)}
                              className="w-full bg-[#080c0a]/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500/50"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Repeticiones</label>
                            <input
                              type="text" placeholder="10-12"
                              value={ej.repeticiones}
                              onChange={e => updateEjercicio(index, 'repeticiones', e.target.value)}
                              className="w-full bg-[#080c0a]/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500/50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Notas / Indicaciones</label>
                          <input
                            type="text" placeholder="Ej: RPE 8, pausa 1 seg abajo..."
                            value={ej.notas}
                            onChange={e => updateEjercicio(index, 'notas', e.target.value)}
                            className="w-full bg-transparent border-b border-white/5 text-xs text-neutral-300 placeholder-neutral-700 focus:outline-none focus:border-brand-400 transition-colors py-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Acciones del editor */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-3">
                  <button
                    type="button"
                    onClick={addEjercicio}
                    className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Añadir ejercicio
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSession}
                    disabled={loading || !selectedClienteId || ejercicios.length === 0}
                    className="flex items-center gap-2 py-2 px-5 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-all disabled:opacity-40 cursor-pointer shadow-md"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Save className="w-3.5 h-3.5" />Guardar sesión</>
                    )}
                  </button>
                </div>

                {/* Feedback */}
                {success && (
                  <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold animate-fade-in">
                    <CheckCircle className="w-4 h-4" />Sesión guardada correctamente.
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />{error}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Bloque Nutrición ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
            <Salad className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Pauta Nutricional</h3>
        </div>

        <div className="glass-dark border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase">Nombre de la Pauta</label>
              <input
                type="text" value={planNombre}
                onChange={e => setPlanNombre(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase">Calorías Objetivo</label>
              <input
                type="number" min={500} max={6000} value={caloriasObjetivo}
                onChange={e => setCaloriasObjetivo(Number(e.target.value))}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase">Descripción / Enfoque</label>
            <textarea
              rows={2} value={planDescripcion}
              onChange={e => setPlanDescripcion(e.target.value)}
              className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 resize-none"
            />
          </div>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Comidas ({comidas.length})</span>
              <button type="button" onClick={() => setComidas(p => [...p, { nombre: '', descripcion: '' }])}
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold cursor-pointer">
                <Plus className="w-3.5 h-3.5" />Añadir comida
              </button>
            </div>

            <div className="relative">
              <div className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#0a0e0c] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showLeftShadowCom ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0a0e0c] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showRightShadowCom ? 'opacity-100' : 'opacity-0'}`} />
              <div ref={comidasContainerRef} onScroll={handleScrollCom}
                className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {comidas.map((com, i) => (
                  <div key={i} className="snap-start min-w-[260px] max-w-[280px] shrink-0 p-4 bg-[#080c0a]/50 border border-white/5 rounded-2xl space-y-3 relative">
                    <button type="button" onClick={() => setComidas(p => p.filter((_, idx) => idx !== i))}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input type="text" placeholder="Desayuno, Almuerzo..." value={com.nombre}
                      onChange={e => { const u = [...comidas]; u[i] = { ...u[i], nombre: e.target.value }; setComidas(u) }}
                      className="w-[85%] bg-transparent border-b border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-500 transition-colors" />
                    <textarea rows={4} placeholder="Alimentos y cantidades..." value={com.descripcion}
                      onChange={e => { const u = [...comidas]; u[i] = { ...u[i], descripcion: e.target.value }; setComidas(u) }}
                      className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl p-3 text-xs text-neutral-300 focus:outline-none focus:border-brand-400 resize-none transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2 border-t border-white/5">
            {successNutricion && (
              <span className="flex items-center gap-1.5 text-brand-400 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />Pauta guardada.
              </span>
            )}
            {errorNutricion && (
              <span className="text-red-400 text-xs">{errorNutricion}</span>
            )}
            <button
              type="button"
              onClick={handleSaveNutricion}
              disabled={loadingNutricion || !selectedClienteId}
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-all disabled:opacity-40 cursor-pointer shadow-md"
            >
              {loadingNutricion
                ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                : <><Save className="w-3.5 h-3.5" />Guardar pauta</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Popup confirmación sesión pasada ─────────────────────────────── */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmDialog(false)}>
          <div
            className="bg-[#0d1210] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Editando sesión pasada</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{selectedDate ? formatDateLong(selectedDate) : ''}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Cambios detectados</p>
              <div className="bg-[#080c0a] border border-white/5 rounded-2xl p-4 space-y-2 max-h-48 overflow-y-auto">
                {pendingDiff.length === 0 ? (
                  <p className="text-xs text-neutral-500">Sin cambios detectados.</p>
                ) : (
                  pendingDiff.map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0",
                        line.type === 'added' ? "bg-green-500/15 text-green-400" :
                        line.type === 'removed' ? "bg-red-500/15 text-red-400" :
                        "bg-amber-500/15 text-amber-400"
                      )}>
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : '~'}
                      </span>
                      <span className="text-xs text-neutral-300 leading-relaxed">{line.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Estás modificando una sesión ya realizada. Este cambio quedará registrado en el historial del atleta.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={doSaveSession}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Confirmar cambios
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
