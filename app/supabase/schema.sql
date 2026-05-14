-- ============================================================
--  R3Clinica — Supabase / PostgreSQL Schema
--  Compatible con el modelo de seguridad post-Mayo 2024:
--  NO se depende de privilegios automáticos. Se declaran
--  GRANT explícitos por tabla y políticas RLS.
-- ============================================================

-- ─── 0. EXTENSIONES ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. TIPOS ENUM ──────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_cliente') THEN
    CREATE TYPE public.tipo_cliente AS ENUM ('particular', 'empresa');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_lead') THEN
    CREATE TYPE public.estado_lead AS ENUM ('nuevo', 'contactado', 'convertido', 'descartado');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'categoria_servicio') THEN
    CREATE TYPE public.categoria_servicio AS ENUM (
      'entrenamiento',
      'fisioterapia',
      'nutricion',
      'readaptacion',
      'antiaging',
      'biohacking'
    );
  END IF;
END$$;

-- ─── 2. TABLA: servicios ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.servicios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  nombre        TEXT NOT NULL,
  descripcion   TEXT,
  descripcion_corta TEXT,
  categoria     public.categoria_servicio NOT NULL,
  icono_url     TEXT,
  imagen_url    TEXT,
  precio_desde  NUMERIC(10, 2),
  activo        BOOLEAN NOT NULL DEFAULT true,
  orden         INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.servicios IS 'Catálogo de servicios ofrecidos por R3Clinica.';

-- ─── 3. TABLA: miembros_equipo ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.miembros_equipo (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          TEXT NOT NULL,
  apellidos       TEXT,
  cargo           TEXT NOT NULL,
  especialidades  TEXT[],            -- array de especialidades
  bio             TEXT,
  foto_url        TEXT,
  linkedin_url    TEXT,
  instagram_url   TEXT,
  orden           INTEGER NOT NULL DEFAULT 0,
  activo          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.miembros_equipo IS 'Equipo profesional de R3Clinica.';

-- ─── 4. TABLA: testimonios ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_cliente TEXT NOT NULL,
  avatar_url    TEXT,
  cargo_empresa TEXT,                -- ej. "CEO en Empresa X" (para leads corporativos)
  servicio_id   UUID REFERENCES public.servicios(id) ON DELETE SET NULL,
  contenido     TEXT NOT NULL,
  puntuacion    SMALLINT CHECK (puntuacion BETWEEN 1 AND 5),
  tipo          public.tipo_cliente NOT NULL DEFAULT 'particular',
  destacado     BOOLEAN NOT NULL DEFAULT false,
  publicado     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.testimonios IS 'Testimonios de clientes, diferenciados por tipo particular/empresa.';

-- ─── 5. TABLA: leads ────────────────────────────────────────
-- Tabla central de captación de contactos.
-- Los campos de empresa son opcionales (NULL para particulares).
CREATE TABLE IF NOT EXISTS public.leads (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Datos comunes
  nombre            TEXT NOT NULL,
  apellidos         TEXT,
  email             TEXT NOT NULL,
  telefono          TEXT,
  tipo              public.tipo_cliente NOT NULL DEFAULT 'particular',
  servicio_interes  public.categoria_servicio,
  mensaje           TEXT,
  estado            public.estado_lead NOT NULL DEFAULT 'nuevo',
  origen            TEXT NOT NULL DEFAULT 'web',   -- 'web', 'whatsapp', 'instagram', etc.

  -- Datos exclusivos para empresa (NULL si tipo = 'particular')
  nombre_empresa    TEXT,
  cargo_contacto    TEXT,        -- puesto de la persona que contacta
  num_empleados     INTEGER,
  sector            TEXT,
  descripcion_necesidad TEXT,

  -- Metadatos
  ip_origen         INET,
  user_agent        TEXT,
  utm_source        TEXT,
  utm_medium        TEXT,
  utm_campaign      TEXT,
  whatsapp_enviado  BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraint: si es empresa, nombre_empresa es obligatorio
  CONSTRAINT empresa_requiere_nombre
    CHECK (tipo = 'particular' OR (tipo = 'empresa' AND nombre_empresa IS NOT NULL))
);

COMMENT ON TABLE public.leads IS 'Captación de leads diferenciada entre particulares y empresas.';
COMMENT ON COLUMN public.leads.tipo IS 'particular = cita previa personal; empresa = propuesta corporativa.';

-- ─── 6. TABLA: instalaciones ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.instalaciones (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo      TEXT NOT NULL,
  descripcion TEXT,
  imagen_url  TEXT NOT NULL,
  orden       INTEGER NOT NULL DEFAULT 0,
  activo      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.instalaciones IS 'Galería de instalaciones de R3Clinica.';

-- ─── 7. TABLA: blog_posts (opcional, para autoridad SEO) ─────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  titulo      TEXT NOT NULL,
  resumen     TEXT,
  contenido   TEXT,              -- Markdown o HTML
  imagen_url  TEXT,
  autor_id    UUID REFERENCES public.miembros_equipo(id) ON DELETE SET NULL,
  categoria   public.categoria_servicio,
  tags        TEXT[],
  publicado   BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.blog_posts IS 'Artículos de blog para autoridad de contenido y SEO.';

-- ─── 8. TRIGGER: updated_at automático ──────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'servicios','miembros_equipo','testimonios','leads',
    'instalaciones','blog_posts'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON public.%I;
       CREATE TRIGGER set_updated_at
         BEFORE UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();',
      tbl, tbl
    );
  END LOOP;
END$$;

-- ─── 9. ÍNDICES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_tipo        ON public.leads(tipo);
CREATE INDEX IF NOT EXISTS idx_leads_estado      ON public.leads(estado);
CREATE INDEX IF NOT EXISTS idx_leads_email       ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_servicios_slug    ON public.servicios(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug   ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_pub    ON public.blog_posts(publicado, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonios_tipo  ON public.testimonios(tipo, publicado);

-- ═══════════════════════════════════════════════════════════════
--  SECCIÓN DE SEGURIDAD — Modelo post-Mayo 2024 Supabase
--  GRANTS explícitos + Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════════

-- ─── 10. GRANT en SCHEMA ─────────────────────────────────────
-- Permite al API Gateway (PostgREST) ver el esquema público.
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- ─── 11. GRANTS granulares por tabla ─────────────────────────

-- anon: solo puede LEER contenido público e INSERTAR leads (formulario de contacto)
GRANT SELECT ON public.servicios         TO anon;
GRANT SELECT ON public.miembros_equipo   TO anon;
GRANT SELECT ON public.instalaciones     TO anon;
GRANT SELECT ON public.blog_posts        TO anon;
GRANT SELECT ON public.testimonios       TO anon;
GRANT INSERT ON public.leads             TO anon;   -- formulario público de contacto

-- authenticated: acceso completo para usuarios autenticados (back-office/Filament via service_role)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.servicios         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.miembros_equipo   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instalaciones     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonios       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads             TO authenticated;

-- Secuencias (necesario para columnas serial/identity si las hubiera)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ─── 12. ACTIVAR RLS en todas las tablas ─────────────────────
ALTER TABLE public.servicios        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.miembros_equipo  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instalaciones    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonios      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads            ENABLE ROW LEVEL SECURITY;

-- ─── 13. POLÍTICAS RLS ───────────────────────────────────────

-- servicios: lectura pública de los activos
CREATE POLICY "servicios_lectura_publica" ON public.servicios
  FOR SELECT TO anon, authenticated
  USING (activo = true);

CREATE POLICY "servicios_gestion_auth" ON public.servicios
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- miembros_equipo: lectura pública de los activos
CREATE POLICY "equipo_lectura_publica" ON public.miembros_equipo
  FOR SELECT TO anon, authenticated
  USING (activo = true);

CREATE POLICY "equipo_gestion_auth" ON public.miembros_equipo
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- instalaciones: lectura pública de las activas
CREATE POLICY "instalaciones_lectura_publica" ON public.instalaciones
  FOR SELECT TO anon, authenticated
  USING (activo = true);

CREATE POLICY "instalaciones_gestion_auth" ON public.instalaciones
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- blog_posts: lectura pública solo de publicados
CREATE POLICY "blog_lectura_publica" ON public.blog_posts
  FOR SELECT TO anon
  USING (publicado = true);

CREATE POLICY "blog_lectura_auth" ON public.blog_posts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "blog_gestion_auth" ON public.blog_posts
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- testimonios: solo los publicados son visibles públicamente
CREATE POLICY "testimonios_lectura_publica" ON public.testimonios
  FOR SELECT TO anon
  USING (publicado = true);

CREATE POLICY "testimonios_gestion_auth" ON public.testimonios
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- leads: anon SOLO puede insertar (nunca leer datos de otros leads)
CREATE POLICY "leads_insertar_publica" ON public.leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- leads: authenticated puede leer y gestionar todos los leads
CREATE POLICY "leads_gestion_auth" ON public.leads
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ─── 14. DATOS SEMILLA (seed) ────────────────────────────────
INSERT INTO public.servicios (slug, nombre, descripcion_corta, categoria, orden, activo) VALUES
  ('entrenamiento-personal',  'Entrenamiento Personal',       'Programas individualizados de alto rendimiento.',        'entrenamiento',  1, true),
  ('fisioterapia',            'Fisioterapia',                  'Recuperación y prevención de lesiones deportivas.',       'fisioterapia',   2, true),
  ('nutricion-deportiva',     'Nutrición Deportiva',           'Planificación nutricional orientada al rendimiento.',     'nutricion',      3, true),
  ('readaptacion',            'Readaptación Funcional',        'Vuelta al deporte tras lesión con protocolos seguros.',   'readaptacion',   4, true),
  ('antiaging',               'Anti-aging',                    'Protocolos de longevidad y envejecimiento saludable.',    'antiaging',      5, true),
  ('biohacking',              'Biohacking',                    'Optimización biológica basada en ciencia y tecnología.',  'biohacking',     6, true)
ON CONFLICT (slug) DO NOTHING;
