import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog de Salud y Rendimiento',
  description:
    'Artículos científicos sobre entrenamiento, fisioterapia, nutrición y biohacking escritos por nuestro equipo de expertos.',
}

export const revalidate = 3600 // 1h

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, autor:miembros_equipo(nombre, apellidos)')
    .eq('publicado', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Contenido Científico</span>
            <h1 className="mt-3 text-5xl font-black">
              Nuestro <span className="gradient-text">Blog</span>
            </h1>
            <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
              Divulgación basada en evidencia. Aprende cómo optimizar tu cuerpo y mente 
              con artículos de nuestro equipo profesional.
            </p>
          </div>

          {/* Grid de Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(posts ?? []).map((post) => (
              <article key={post.id} className="group glass rounded-3xl overflow-hidden flex flex-col hover:border-brand-500/20 transition-all">
                <Link href={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                  {post.imagen_url ? (
                    <img 
                      src={post.imagen_url} 
                      alt={post.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <span className="text-neutral-800 text-4xl">R3</span>
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                   <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-4">
                      <span className="text-brand-400">{post.categoria}</span>
                      <span className="flex items-center gap-1">
                         <Calendar className="w-3 h-3" />
                         {post.published_at ? new Date(post.published_at).toLocaleDateString('es-ES') : ''}
                      </span>
                   </div>
                   <h2 className="text-xl font-bold mb-3 group-hover:text-brand-400 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.titulo}</Link>
                   </h2>
                   <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3 mb-6">
                      {post.resumen}
                   </p>
                   <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                         <User className="w-3.5 h-3.5" />
                         {post.autor ? `${post.autor.nombre} ${post.autor.apellidos}` : 'Redacción R3'}
                      </div>
                      <Link href={`/blog/${post.slug}`} className="text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
                         Leer más <ArrowRight className="w-3 h-3" />
                      </Link>
                   </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
