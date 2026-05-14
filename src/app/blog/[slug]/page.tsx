import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('titulo, resumen')
    .eq('slug', slug)
    .single()

  if (!post) return { title: 'Artículo no encontrado' }

  return {
    title: post.titulo,
    description: post.resumen ?? `Artículo sobre salud y rendimiento en R3Clinica.`,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, autor:miembros_equipo(*)')
    .eq('slug', slug)
    .single()

  if (!post) notFound()

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Volver */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>

          {/* Header del post */}
          <header className="mb-12">
            <span className="text-brand-400 text-sm font-bold uppercase tracking-widest block mb-4">
              {post.categoria}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">{post.titulo}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500 py-6 border-y border-white/5">
               <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-500" />
                  <span>{post.autor ? `${post.autor.nombre} ${post.autor.apellidos}` : 'Redacción R3'}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('es-ES', { dateStyle: 'long' }) : ''}</span>
               </div>
            </div>
          </header>

          {/* Imagen destacada */}
          {post.imagen_url && (
            <div className="rounded-3xl overflow-hidden glass mb-12 border-white/5 aspect-video">
              <img src={post.imagen_url} alt={post.titulo} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Contenido (Markdown/HTML placeholder) */}
          <div className="prose prose-invert prose-brand max-w-none text-neutral-300 leading-relaxed space-y-6">
             {/* Aquí se renderizaría el contenido dinámico. Como es un placeholder: */}
             <p className="text-xl text-white font-medium italic">
                {post.resumen}
             </p>
             <div 
               dangerouslySetInnerHTML={{ __html: post.contenido ?? '' }} 
               className="rich-text-content"
             />
             
             {!post.contenido && (
               <p className="py-12 text-center text-neutral-600 italic">
                 El contenido de este artículo está siendo procesado...
               </p>
             )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-2">
              <Tag className="w-4 h-4 text-neutral-600 mr-2 self-center" />
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs text-neutral-500 border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Autor Bio footer */}
          {post.autor && (
             <div className="mt-20 p-8 rounded-3xl glass border-brand-500/10 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                   {post.autor.foto_url && <img src={post.autor.foto_url} alt={post.autor.nombre} className="w-full h-full object-cover" />}
                </div>
                <div className="text-center md:text-left">
                   <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">Sobre el autor</p>
                   <h3 className="text-xl font-bold text-white mb-2">{post.autor.nombre} {post.autor.apellidos}</h3>
                   <p className="text-sm text-neutral-500 leading-relaxed">
                      {post.autor.bio}
                   </p>
                </div>
             </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
