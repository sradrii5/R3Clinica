// src/components/portal/admin/AsignarPlanForm.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { guardarPlanCompletoAction, EjercicioInput, ComidaInput } from '@/app/portal/admin/actions'
import { Dumbbell, Salad, Plus, Trash2, Save, CheckCircle, AlertTriangle, Wand2 } from 'lucide-react'

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

export default function AsignarPlanForm({ clientes, catalogo }: AsignarPlanFormProps) {
  const [selectedClienteId, setSelectedClienteId] = useState('')

  // Rutina State
  const [rutinaNombre, setRutinaNombre] = useState('Fuerza e Hipertrofia Estructurada')
  const [rutinaDescripcion, setRutinaDescripcion] = useState('Enfoque en ganancias musculares magras y optimización metabólica. Descansa 90-120 segundos entre series.')
  const [ejercicios, setEjercicios] = useState<EjercicioInput[]>([
    { 
      nombre: 'Sentadilla Goblet con Mancuerna', 
      series: 4, 
      repeticiones: '10-12', 
      notas: 'Mantén el core tenso y baja controlado.',
      imagen_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600',
      video_url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    { 
      nombre: 'Peso Muerto Rumano con Mancuernas', 
      series: 4, 
      repeticiones: '8-10', 
      notas: 'Mantén la espalda neutra y empuja la cadera hacia atrás.',
      imagen_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
      video_url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
  ])

  // Nutrición State
  const [planNombre, setPlanNombre] = useState('Pauta Nutricional de Alto Rendimiento')
  const [planDescripcion, setPlanDescripcion] = useState('Plan alto en proteínas, grasas saludables de calidad y carbohidratos complejos de absorción lenta.')
  const [caloriasObjetivo, setCaloriasObjetivo] = useState(2500)
  const [comidas, setComidas] = useState<ComidaInput[]>([
    { nombre: 'Desayuno', descripcion: '3 huevos a la plancha, 1 aguacate mediano, 60g de avena cocida con agua y puñado de arándanos.' },
    { nombre: 'Almuerzo / Comida', descripcion: '200g de pechuga de pollo, 100g de arroz basmati cocido, brócoli salteado al vapor y cucharada de aceite de oliva.' },
    { nombre: 'Cena', descripcion: '180g de salmón salvaje al horno, ensalada grande de espinacas tiernas, tomate, pepino y espárragos.' }
  ])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs para los contenedores de scroll horizontal
  const ejerciciosContainerRef = useRef<HTMLDivElement>(null)
  const comidasContainerRef = useRef<HTMLDivElement>(null)

  // Estados de sombras indicadoras de scroll lateral
  const [showLeftShadowEj, setShowLeftShadowEj] = useState(false)
  const [showRightShadowEj, setShowRightShadowEj] = useState(false)
  const [showLeftShadowCom, setShowLeftShadowCom] = useState(false)
  const [showRightShadowCom, setShowRightShadowCom] = useState(false)

  // Manejadores de scroll para actualizar sombras
  const handleScrollEj = () => {
    const container = ejerciciosContainerRef.current
    if (container) {
      setShowLeftShadowEj(container.scrollLeft > 10)
      setShowRightShadowEj(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 15
      )
    }
  }

  const handleScrollCom = () => {
    const container = comidasContainerRef.current
    if (container) {
      setShowLeftShadowCom(container.scrollLeft > 10)
      setShowRightShadowCom(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 15
      )
    }
  }

  // Actualizar sombras al cambiar datos o al redimensionar la ventana
  useEffect(() => {
    handleScrollEj()
    window.addEventListener('resize', handleScrollEj)
    return () => window.removeEventListener('resize', handleScrollEj)
  }, [ejercicios])

  useEffect(() => {
    handleScrollCom()
    window.addEventListener('resize', handleScrollCom)
    return () => window.removeEventListener('resize', handleScrollCom)
  }, [comidas])

  // Auto-scroll al añadir nuevos elementos
  const prevEjerciciosLength = useRef(ejercicios.length)
  useEffect(() => {
    if (ejercicios.length > prevEjerciciosLength.current) {
      setTimeout(() => {
        if (ejerciciosContainerRef.current) {
          ejerciciosContainerRef.current.scrollTo({
            left: ejerciciosContainerRef.current.scrollWidth,
            behavior: 'smooth'
          })
        }
      }, 50)
    }
    prevEjerciciosLength.current = ejercicios.length
  }, [ejercicios.length])

  const prevComidasLength = useRef(comidas.length)
  useEffect(() => {
    if (comidas.length > prevComidasLength.current) {
      setTimeout(() => {
        if (comidasContainerRef.current) {
          comidasContainerRef.current.scrollTo({
            left: comidasContainerRef.current.scrollWidth,
            behavior: 'smooth'
          })
        }
      }, 50)
    }
    prevComidasLength.current = comidas.length
  }, [comidas.length])


  // Cargar Plantilla Avanzada de Longevidad / R3
  const handleLoadLongevityTemplate = () => {
    setRutinaNombre('Plan de Fuerza y Longevidad Funcional')
    setRutinaDescripcion('Diseñado para mejorar la masa muscular esquelética (clave para la salud metabólica) y maximizar consumo de oxígeno (VO2 Max).')
    setEjercicios([
      { nombre: 'Sentadillas Traseras con Barra', series: 4, repeticiones: '8-10', notas: 'Baja con control (3s excéntrica).' },
      { nombre: 'Dominadas Asistidas o Jalón al Pecho', series: 3, repeticiones: '10-12', notas: 'Máxima tracción con las escápulas.' },
      { nombre: 'Press Militar de Hombros con Mancuernas', series: 3, repeticiones: '10', notas: 'Empuje vertical estricto, core fuerte.' },
      { nombre: 'Paseo del Granjero (Farmer Walks)', series: 3, repeticiones: '40 metros', notas: 'Mancuernas pesadas, espalda erguida, camina estable.' }
    ])

    setPlanNombre('Pauta Antiinflamatoria R3 (Longevidad)')
    setPlanDescripcion('Rica en antioxidantes, fitonutrientes, omega-3 y proteínas de alto valor biológico para reducir estrés oxidativo.')
    setCaloriasObjetivo(2300)
    setComidas([
      { nombre: 'Desayuno Antioxidante', descripcion: 'Tortilla de 3 claras y 1 huevo entero, espinacas salteadas, kéfir de cabra con semillas de chía, nueces y frambuesas.' },
      { nombre: 'Almuerzo Regenerativo', descripcion: '200g de lubina o bacalao al horno, boniato al vapor (120g), espárragos trigueros y AOVE.' },
      { nombre: 'Merienda Energética', descripcion: 'Batido de proteína whey de pasto con leche de almendras, semillas de lino molidas y una manzana verde.' },
      { nombre: 'Cena Reparadora', descripcion: 'Pechuga de pavo ecológica a la plancha (180g), crema de calabaza y zanahoria con jengibre, y infusión de manzanilla.' }
    ])
  }

  // Ejercicios handlers
  const addEjercicio = () => {
    setEjercicios([...ejercicios, { nombre: '', series: 0, repeticiones: '', notas: '', imagen_url: null, video_url: null }])
  }

  const removeEjercicio = (index: number) => {
    setEjercicios(ejercicios.filter((_, i) => i !== index))
  }

  const handleEjercicioChange = (index: number, field: keyof EjercicioInput, value: string | number) => {
    const updated = [...ejercicios]
    updated[index] = { ...updated[index], [field]: value }
    setEjercicios(updated)
  }

  // Comidas handlers
  const addComida = () => {
    setComidas([...comidas, { nombre: '', descripcion: '' }])
  }

  const removeComida = (index: number) => {
    setComidas(comidas.filter((_, i) => i !== index))
  }

  const handleComidaChange = (index: number, field: keyof ComidaInput, value: string) => {
    const updated = [...comidas]
    updated[index] = { ...updated[index], [field]: value }
    setComidas(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClienteId) {
      setError('Por favor, selecciona un cliente para asignarle el plan.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await guardarPlanCompletoAction({
      clienteId: selectedClienteId,
      rutinaNombre,
      rutinaDescripcion,
      ejercicios,
      planNombre,
      planDescripcion,
      caloriasObjetivo,
      comidas
    })

    setLoading(false)
    if (result.success) {
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setSuccess(false), 5000)
    } else {
      setError(result.error || 'Ocurrió un error inesperado al guardar los planes del cliente.')
    }
  }

  const selectedClienteObjetivo = clientes.find(c => c.id === selectedClienteId)?.objetivo

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-12">
      {success && (
        <div className="p-6 bg-brand-500/10 border border-brand-500/20 rounded-3xl flex items-center gap-4 text-brand-400 shadow-xl shadow-brand-500/5 animate-fade-in">
          <CheckCircle className="w-8 h-8 shrink-0 animate-bounce" />
          <div>
            <h3 className="text-lg font-bold text-white">¡Planes Asignados Correctamente!</h3>
            <p className="text-sm text-neutral-400">
              La rutina y la pauta nutricional se han actualizado en tiempo real. El atleta ya puede visualizarlas en su portal.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Cabecera / Selección del Cliente */}
      <div className="glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -z-10" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Diseñar Entrenamiento y Alimentación</h2>
            <p className="text-sm text-neutral-400">Selecciona al atleta y edita sus planes activos.</p>
          </div>
          <button
            type="button"
            onClick={handleLoadLongevityTemplate}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 transition-all duration-300 shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Cargar Plantilla R3 Longevidad
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-widest">Seleccionar Atleta / Cliente</label>
            <select
              required
              value={selectedClienteId}
              onChange={(e) => {
                setSelectedClienteId(e.target.value)
                setError(null)
              }}
              className="w-full bg-[#080c0a]/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
            >
              <option value="" disabled className="bg-[#080c0a] text-neutral-600">-- Selecciona un atleta de la lista --</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id} className="bg-[#080c0a] text-white">
                  {c.nombre} {c.apellidos}
                </option>
              ))}
            </select>
          </div>

          {selectedClienteId && selectedClienteObjetivo && (
            <div className="p-4 bg-[#080c0a]/60 border border-white/5 rounded-2xl text-sm">
              <span className="text-neutral-500 font-medium">Objetivo del Atleta:</span>
              <p className="text-neutral-300 mt-1 italic">&quot;{selectedClienteObjetivo}&quot;</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* BLOQUE ENTRENAMIENTO */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Bloque Entrenamiento</h3>
          </div>

          <div className="glass-dark border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase">Nombre de la Rutina</label>
              <input
                type="text"
                required
                value={rutinaNombre}
                onChange={(e) => setRutinaNombre(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase">Instrucciones / Notas Generales</label>
              <textarea
                rows={3}
                value={rutinaDescripcion}
                onChange={(e) => setRutinaDescripcion(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 resize-none"
              />
            </div>

            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Ejercicios de la Rutina ({ejercicios.length})</span>
                <button
                  type="button"
                  onClick={addEjercicio}
                  className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir Ejercicio
                </button>
              </div>

              <div className="relative">
                {/* Sombras difuminadas laterales para indicar scroll */}
                <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0e0c] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showLeftShadowEj ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0e0c] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showRightShadowEj ? 'opacity-100' : 'opacity-0'}`} />

                <div 
                  ref={ejerciciosContainerRef}
                  onScroll={handleScrollEj}
                  className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scroll-smooth"
                >
                  {ejercicios.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-8 w-full">No hay ejercicios añadidos aún.</p>
                  ) : (
                    ejercicios.map((ej, index) => (
                      <div 
                        key={index} 
                        className="snap-start min-w-[280px] sm:min-w-[320px] max-w-[320px] shrink-0 p-5 bg-[#080c0a]/50 border border-white/5 rounded-2xl space-y-4 relative group hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <button
                            type="button"
                            onClick={() => removeEjercicio(index)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer z-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* Selector de Ejercicio */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Ejercicio #{index + 1}</label>
                            <select
                              required
                              value={ej.nombre}
                              onChange={(e) => {
                                const selectedNombre = e.target.value
                                const catalogoItem = catalogo.find(item => item.nombre === selectedNombre)
                                
                                const updated = [...ejercicios]
                                updated[index] = {
                                  ...updated[index],
                                  nombre: selectedNombre,
                                  imagen_url: catalogoItem?.imagen_url || null,
                                  video_url: catalogoItem?.video_url || null
                                }
                                setEjercicios(updated)
                              }}
                              className="w-[90%] bg-transparent border-b border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-500 transition-colors py-1 cursor-pointer"
                            >
                              <option value="" disabled className="bg-neutral-950 text-neutral-500">-- Selecciona un Ejercicio --</option>
                              {Array.from(new Set(catalogo.map(item => item.grupo_muscular))).map(grupo => (
                                <optgroup key={grupo} label={grupo} className="bg-neutral-950 text-brand-400 font-bold">
                                  {catalogo
                                    .filter(item => item.grupo_muscular === grupo)
                                    .map(item => (
                                      <option key={item.id} value={item.nombre} className="bg-neutral-900 text-white font-normal">
                                        {item.nombre}
                                      </option>
                                    ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>

                          {/* Vista Previa Visual */}
                          {ej.imagen_url ? (
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/5 bg-neutral-900">
                              <img src={ej.imagen_url} alt={ej.nombre} className="w-full h-full object-cover" />
                              {ej.video_url && (
                                <span className="absolute top-2 right-2 text-[9px] bg-brand-500/25 border border-brand-500/40 text-brand-400 px-1.5 py-0.5 rounded font-mono flex items-center gap-1 shadow-lg shadow-black/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                                  Vídeo
                                </span>
                              )}
                            </div>
                          ) : ej.nombre ? (
                            <div className="aspect-video w-full rounded-xl border border-white/5 bg-neutral-900/50 flex flex-col items-center justify-center text-[10px] text-neutral-600 gap-1">
                              <Dumbbell className="w-6 h-6 opacity-30" />
                              <span>Sin imagen de demostración</span>
                            </div>
                          ) : null}

                          {/* Parámetros específicos */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Series</label>
                              <input
                                type="number"
                                required
                                min={1}
                                max={10}
                                placeholder="3"
                                value={ej.series || ''}
                                onChange={(e) => handleEjercicioChange(index, 'series', e.target.value ? Number(e.target.value) : 0)}
                                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500/50"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Repeticiones</label>
                              <input
                                type="text"
                                required
                                placeholder="12-15"
                                value={ej.repeticiones}
                                onChange={(e) => handleEjercicioChange(index, 'repeticiones', e.target.value)}
                                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500/50"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 mt-3 pt-3 border-t border-white/5">
                          <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Notas específicas</label>
                          <input
                            type="text"
                            placeholder="Ej: RPE 8, pausa de 1 seg abajo..."
                            value={ej.notas}
                            onChange={(e) => handleEjercicioChange(index, 'notas', e.target.value)}
                            className="w-full bg-transparent border-b border-white/5 text-xs text-neutral-300 placeholder-neutral-700 focus:outline-none focus:border-brand-400 transition-colors py-1"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE ALIMENTACIÓN */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
              <Salad className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Bloque Nutrición</h3>
          </div>

          <div className="glass-dark border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase">Nombre de la Pauta</label>
              <input
                type="text"
                required
                value={planNombre}
                onChange={(e) => setPlanNombre(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase">Calorías Objetivo</label>
                <input
                  type="number"
                  required
                  min={500}
                  max={6000}
                  value={caloriasObjetivo}
                  onChange={(e) => setCaloriasObjetivo(Number(e.target.value))}
                  className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase">Descripción / Enfoque Dietético</label>
              <textarea
                rows={2}
                value={planDescripcion}
                onChange={(e) => setPlanDescripcion(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 resize-none"
              />
            </div>

            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Comidas Estructuradas ({comidas.length})</span>
                <button
                  type="button"
                  onClick={addComida}
                  className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir Comida
                </button>
              </div>

              <div className="relative">
                {/* Sombras difuminadas laterales para indicar scroll */}
                <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0e0c] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showLeftShadowCom ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0e0c] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showRightShadowCom ? 'opacity-100' : 'opacity-0'}`} />

                <div 
                  ref={comidasContainerRef}
                  onScroll={handleScrollCom}
                  className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scroll-smooth"
                >
                  {comidas.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-8 w-full">No hay comidas añadidas aún.</p>
                  ) : (
                    comidas.map((com, index) => (
                      <div 
                        key={index} 
                        className="snap-start min-w-[280px] sm:min-w-[320px] max-w-[320px] shrink-0 p-5 bg-[#080c0a]/50 border border-white/5 rounded-2xl space-y-4 relative group hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
                      >
                        <button
                          type="button"
                          onClick={() => removeComida(index)}
                          className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Comida #{index + 1}</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Desayuno, Pre-entreno, Cena..."
                            value={com.nombre}
                            onChange={(e) => handleComidaChange(index, 'nombre', e.target.value)}
                            className="w-[90%] bg-transparent border-b border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-brand-500 transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Alimentos y Cantidades</label>
                          <textarea
                            rows={4}
                            required
                            placeholder="Ej: 150g de salmón salvaje, ensalada mixta grande..."
                            value={com.descripcion}
                            onChange={(e) => handleComidaChange(index, 'descripcion', e.target.value)}
                            className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl p-3 text-xs text-neutral-300 focus:outline-none focus:border-brand-400 resize-none transition-colors"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading || !selectedClienteId}
          className="flex items-center gap-2 py-3.5 px-8 rounded-2xl text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-all duration-300 disabled:opacity-40 cursor-pointer shadow-lg hover:shadow-white/5"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar y Asignar Planes Completo
            </>
          )}
        </button>
      </div>
    </form>
  )
}
