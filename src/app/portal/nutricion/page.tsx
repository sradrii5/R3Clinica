import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Salad, Info, Utensils, Flame } from 'lucide-react'

export default async function PortalNutricion() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Obtener plan nutricional activo
  const { data: plan } = await supabase
    .from('planes_nutricionales')
    .select('id, nombre, descripcion, calorias_objetivo')
    .eq('cliente_id', user?.id)
    .eq('activo', true)
    .maybeSingle()

  // Obtener comidas de ese plan
  let comidas: any[] = []
  if (plan) {
    const { data } = await supabase
      .from('comidas')
      .select('id, nombre, descripcion')
      .eq('plan_id', plan.id)
      .order('orden', { ascending: true })
    
    comidas = data || []
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Tu Plan de Alimentación</h1>
        <p className="text-neutral-400 mt-2 text-sm">
          Nutrición estratégica adaptada a tus objetivos biológicos y genéticos.
        </p>
      </div>

      {plan ? (
        <div className="space-y-8">
          {/* Resumen de Macros / Calorías */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-3xl p-6 border border-white/5 bg-brand-500/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-neutral-500 block uppercase tracking-wider">Objetivo Diario</span>
                <span className="text-2xl font-black text-white font-mono">{plan.calorias_objetivo || '---'} kcal</span>
              </div>
            </div>
            {plan.descripcion && (
              <div className="md:col-span-2 glass rounded-3xl p-6 border border-white/5 flex gap-4 items-start">
                <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Pautas Generales</h3>
                  <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{plan.descripcion}</p>
                </div>
              </div>
            )}
          </div>

          {/* Listado de Comidas estructurado */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-brand-400" />
              Distribución Diaria
            </h2>

            {comidas.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/5">
                {comidas.map((comida, index) => (
                  <div key={comida.id} className="relative pl-12 group">
                    {/* Indicador de Línea temporal */}
                    <div className="absolute left-[18px] top-6 w-2.5 h-2.5 rounded-full bg-neutral-800 border-2 border-brand-500 group-hover:scale-125 transition-transform" />

                    {/* Tarjeta de Comida */}
                    <div className="glass rounded-3xl p-6 border border-white/5 hover:border-brand-500/10 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold font-mono text-brand-400/80 bg-brand-500/5 border border-brand-500/10 px-2 py-0.5 rounded-md uppercase">
                          Comida {index + 1}
                        </span>
                        <h3 className="text-lg font-bold text-white">{comida.nombre}</h3>
                      </div>
                      <p className="text-sm text-neutral-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 whitespace-pre-line">
                        {comida.descripcion || 'Sin pautas específicas programadas.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-12 text-center border border-white/5 text-neutral-500">
                <Salad className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Este plan no tiene comidas especificadas todavía.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl p-12 text-center border border-white/5 text-neutral-500">
          <Salad className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm">No tienes ningún plan nutricional activo.</p>
        </div>
      )}
    </div>
  )
}
