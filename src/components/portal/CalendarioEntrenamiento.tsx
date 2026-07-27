'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Dumbbell, Play, Info, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Ejercicio {
  id: string
  rutina_id: string
  nombre: string
  series: number
  repeticiones: string
  imagen_url: string | null
  video_url: string | null
  orden: number
  notas: string | null
  dia_semana: string
  fecha: string | null
}

interface CalendarioEntrenamientoProps {
  rutinaNombre: string | null
  rutinaDescripcion: string | null
  ejercicios: Ejercicio[]
}

const WEEKDAYS_ES = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const WEEKDAYS_MAP = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export default function CalendarioEntrenamiento({
  rutinaNombre,
  rutinaDescripcion,
  ejercicios,
}: CalendarioEntrenamientoProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // First day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay()
  // Adjust to start week on Monday: 0 (Mon) to 6 (Sun)
  const firstDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1

  // Total days in the month
  const totalDays = new Date(year, month + 1, 0).getDate()

  // Navigation handlers — sin restricción, permite ver historial de meses anteriores
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isPastDay = (day: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(year, month, day) < today
  }

  const handleSelectDay = (day: number) => {
    setSelectedDate(new Date(year, month, day))
    setActiveVideoUrl(null)
  }

  const getLocalDateString = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }

  // Check if a specific date has exercises
  const dateHasExercises = (day: number) => {
    const checkDate = new Date(year, month, day)
    const dayName = WEEKDAYS_MAP[checkDate.getDay()]
    const dateStr = getLocalDateString(year, month, day)
    return ejercicios.some((e) => e.fecha === dateStr || (!e.fecha && e.dia_semana === dayName))
  }

  // Get exercises for the selected date
  const getExercisesForSelectedDate = () => {
    const dayName = WEEKDAYS_MAP[selectedDate.getDay()]
    const dateStr = getLocalDateString(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )
    return ejercicios
      .filter((e) => e.fecha === dateStr || (!e.fecha && e.dia_semana === dayName))
      .sort((a, b) => a.orden - b.orden)
  }

  const selectedDayName = WEEKDAYS_MAP[selectedDate.getDay()]
  const selectedDayExercises = getExercisesForSelectedDate()

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    )
  }

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
      {/* Columna Izquierda: Calendario */}
      <div className="glass border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
        <div>
          {/* Header Calendario */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                Agenda de Optimización
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Selecciona un día para ver tus ejercicios.</p>
            </div>
            <div className="flex items-center gap-1 border border-white/10 rounded-xl p-1 bg-white/[0.02]">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-white px-3 select-none">
                {MONTHS_ES[month]} {year}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS_ES.map((w, idx) => (
              <span key={idx} className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest py-1">
                {w}
              </span>
            ))}
          </div>

          {/* Grid de días */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Celdas vacías */}
            {Array.from({ length: firstDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {/* Días del mes */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const day = idx + 1
              const hasExs = dateHasExercises(day)
              const today = isToday(day)
              const active = isSelected(day)
              const past = isPastDay(day)

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer group hover:scale-[1.05]",
                    active
                      ? "bg-brand-500 text-black font-black"
                      : today
                      ? "border border-brand-400/50 bg-brand-500/5 text-brand-400 font-bold"
                      : past && hasExs
                      ? "bg-white/[0.02] border border-white/5 hover:border-white/15 text-neutral-500 hover:text-neutral-300"
                      : "bg-white/[0.01] border border-white/5 hover:border-white/20 text-neutral-400 hover:text-white"
                  )}
                >
                  <span className="text-sm font-semibold">{day}</span>
                  {hasExs && (
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2",
                        active ? "bg-black animate-none" : past ? "bg-neutral-600" : "bg-brand-500 animate-pulse"
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Info Leyenda */}
        <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-brand-400/50 bg-brand-500/5" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-400" />
            <span>Entrenamiento pautado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-600" />
            <span>Historial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-800" />
            <span>Descanso</span>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Rutina del día */}
      <div className="flex flex-col gap-6">
        {/* Encabezado Rutina del día */}
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Rutina para el {selectedDate.getDate()} de {MONTHS_ES[month]}
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/5 px-2.5 py-1 border border-white/10">
              {selectedDayName}
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-3 truncate">{rutinaNombre || 'Sin Rutina Activa'}</h2>
          {rutinaDescripcion && (
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">{rutinaDescripcion}</p>
          )}
        </div>

        {/* Listado de Ejercicios */}
        <div className="flex-1 min-h-[300px]">
          {selectedDayExercises.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
              <Dumbbell className="w-10 h-10 text-neutral-600 mb-3 opacity-40" />
              <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wide">Descanso o Recuperación Activa</h4>
              <p className="text-xs text-neutral-600 mt-2 max-w-[240px] leading-relaxed">
                No tienes ejercicios asignados. Aprovecha para caminar, estirar, hidratarte bien o realizar una sesión de fisioterapia.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {selectedDayExercises.map((ej, index) => (
                <div
                  key={ej.id}
                  className="p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Monograma / Número orden */}
                    <div className="w-10 h-10 bg-brand-500/5 border border-brand-500/10 text-brand-400 font-mono text-sm font-bold flex items-center justify-center shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors leading-tight">
                        {ej.nombre}
                      </h4>
                      <p className="text-xs text-brand-300/80 font-mono">
                        {ej.series} series &times; {ej.repeticiones} reps
                      </p>
                      {ej.notas && (
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-1 leading-normal">
                          <Info className="w-3 h-3 text-neutral-600 shrink-0" />
                          {ej.notas}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Video Demostrativo inline o popup */}
                  {ej.video_url && (
                    <div className="shrink-0 flex items-center sm:self-center">
                      {activeVideoUrl === ej.id ? (
                        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setActiveVideoUrl(null)}>
                          <div className="relative max-w-3xl w-full aspect-video border border-white/10 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                            <video src={ej.video_url} controls autoPlay className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setActiveVideoUrl(null)}
                              className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/10 cursor-pointer"
                            >
                              Cerrar Vídeo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveVideoUrl(ej.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-500/20 hover:border-brand-500 bg-brand-500/5 text-brand-400 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Ver Demo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
