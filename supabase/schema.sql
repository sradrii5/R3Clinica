-- RECREANDO SCHEMA SQL
-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE tipo_lead AS ENUM ('particular', 'empresa');
CREATE TYPE categoria_servicio AS ENUM ('entrenamiento', 'fisioterapia', 'nutricion', 'readaptacion', 'antiaging', 'biohacking');

-- Tablas
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo tipo_lead NOT NULL,
    nombre TEXT NOT NULL,
    apellidos TEXT,
    email TEXT NOT NULL,
    telefono TEXT,
    servicio_interes categoria_servicio,
    mensaje TEXT,
    nombre_empresa TEXT,
    cargo_contacto TEXT,
    num_empleados INTEGER,
    sector TEXT,
    descripcion_necesidad TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    origen TEXT DEFAULT 'web',
    whatsapp_enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    descripcion_corta TEXT,
    categoria categoria_servicio NOT NULL,
    precio_desde DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miembros_equipo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    cargo TEXT NOT NULL,
    bio TEXT,
    foto_url TEXT,
    especialidades TEXT[],
    linkedin_url TEXT,
    instagram_url TEXT,
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_cliente TEXT NOT NULL,
    cargo_empresa TEXT,
    contenido TEXT NOT NULL,
    puntuacion INTEGER CHECK (puntuacion >= 1 AND puntuacion <= 5),
    foto_url TEXT,
    destacado BOOLEAN DEFAULT FALSE,
    publicado BOOLEAN DEFAULT TRUE,
    tipo tipo_lead DEFAULT 'particular',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicios_updated_at BEFORE UPDATE ON public.servicios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_miembros_updated_at BEFORE UPDATE ON public.miembros_equipo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS y GRANTS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.miembros_equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonios ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Permitir inserción anónima de leads" ON public.leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Permitir lectura pública de servicios" ON public.servicios FOR SELECT USING (activo = TRUE);
CREATE POLICY "Permitir lectura pública de equipo" ON public.miembros_equipo FOR SELECT USING (activo = TRUE);
CREATE POLICY "Permitir lectura pública de testimonios" ON public.testimonios FOR SELECT USING (publicado = TRUE);

-- Grants explícitos (Supabase post-mayo 2024)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT SELECT ON public.servicios TO anon;
GRANT SELECT ON public.miembros_equipo TO anon;
GRANT SELECT ON public.testimonios TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
