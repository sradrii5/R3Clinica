-- =============================================
-- PORTAL PRIVADO DE CLIENTES - R3Clinica
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. TABLA DE PERFILES (extiende auth.users 1:1)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.perfiles (
    id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre       TEXT NOT NULL,
    apellidos    TEXT NOT NULL,
    foto_url     TEXT,
    objetivo     TEXT,
    fecha_alta   DATE DEFAULT NOW(),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA DE RUTINAS
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.rutinas (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id   UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    nombre       TEXT NOT NULL,
    descripcion  TEXT,
    activa       BOOLEAN DEFAULT TRUE,
    fecha_inicio DATE,
    fecha_fin    DATE,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE EJERCICIOS (hijos de cada rutina)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.ejercicios (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rutina_id    UUID NOT NULL REFERENCES public.rutinas(id) ON DELETE CASCADE,
    nombre       TEXT NOT NULL,
    series       INTEGER NOT NULL DEFAULT 3,
    repeticiones TEXT NOT NULL DEFAULT '10',   -- puede ser "12-15", "Al fallo", etc.
    imagen_url   TEXT,                          -- Supabase Storage
    orden        INTEGER NOT NULL DEFAULT 0,
    notas        TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE PLANES NUTRICIONALES
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.planes_nutricionales (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id         UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    nombre             TEXT NOT NULL,
    descripcion        TEXT,
    calorias_objetivo  INTEGER,
    activo             BOOLEAN DEFAULT TRUE,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE COMIDAS (hijas de cada plan)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.comidas (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id     UUID NOT NULL REFERENCES public.planes_nutricionales(id) ON DELETE CASCADE,
    nombre      TEXT NOT NULL,          -- ej. "Desayuno", "Pre-entreno"
    descripcion TEXT,
    orden       INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRIGGERS updated_at
-- =============================================
CREATE TRIGGER update_perfiles_updated_at
    BEFORE UPDATE ON public.perfiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rutinas_updated_at
    BEFORE UPDATE ON public.rutinas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planes_updated_at
    BEFORE UPDATE ON public.planes_nutricionales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.perfiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutinas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ejercicios           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planes_nutricionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comidas              ENABLE ROW LEVEL SECURITY;

-- PERFILES: cada usuario solo ve el suyo
CREATE POLICY "Cliente: ver su perfil"
    ON public.perfiles FOR SELECT
    USING (auth.uid() = id);

-- RUTINAS: solo ve las que son suyas
CREATE POLICY "Cliente: ver sus rutinas"
    ON public.rutinas FOR SELECT
    USING (auth.uid() = cliente_id);

-- EJERCICIOS: ve los ejercicios de sus rutinas
CREATE POLICY "Cliente: ver sus ejercicios"
    ON public.ejercicios FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.rutinas r
            WHERE r.id = rutina_id AND r.cliente_id = auth.uid()
        )
    );

-- PLANES: solo ve los suyos
CREATE POLICY "Cliente: ver sus planes nutricionales"
    ON public.planes_nutricionales FOR SELECT
    USING (auth.uid() = cliente_id);

-- COMIDAS: ve las comidas de sus planes
CREATE POLICY "Cliente: ver sus comidas"
    ON public.comidas FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.planes_nutricionales p
            WHERE p.id = plan_id AND p.cliente_id = auth.uid()
        )
    );

-- =============================================
-- GRANTS (Supabase post-mayo 2024)
-- =============================================
GRANT SELECT ON public.perfiles             TO authenticated;
GRANT SELECT ON public.rutinas              TO authenticated;
GRANT SELECT ON public.ejercicios           TO authenticated;
GRANT SELECT ON public.planes_nutricionales TO authenticated;
GRANT SELECT ON public.comidas              TO authenticated;

-- =============================================
-- STORAGE BUCKET para imágenes de ejercicios
-- (ejecutar por separado si el bucket no existe)
-- =============================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('ejercicios', 'ejercicios', true)
-- ON CONFLICT (id) DO NOTHING;
