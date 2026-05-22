-- =========================================================================
-- PARCHE DE BASE DE DATOS: CATÁLOGO DE EJERCICIOS Y MULTIMEDIA - R3Clinica
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =========================================================================

-- 1. Crear tabla de catálogo de ejercicios
CREATE TABLE IF NOT EXISTS public.catalogo_ejercicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    grupo_muscular TEXT NOT NULL,
    imagen_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS en catalogo_ejercicios
ALTER TABLE public.catalogo_ejercicios ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS para catalogo_ejercicios
DROP POLICY IF EXISTS "Permitir lectura para todos los autenticados" ON public.catalogo_ejercicios;
CREATE POLICY "Permitir lectura para todos los autenticados"
    ON public.catalogo_ejercicios FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins: gestionar catalogo" ON public.catalogo_ejercicios;
CREATE POLICY "Admins: gestionar catalogo"
    ON public.catalogo_ejercicios FOR ALL
    USING (public.es_admin())
    WITH CHECK (public.es_admin());

-- 4. Añadir columna video_url a public.ejercicios si no existe
ALTER TABLE public.ejercicios ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 5. Insertar ejercicios semilla del catálogo
INSERT INTO public.catalogo_ejercicios (nombre, descripcion, grupo_muscular, imagen_url, video_url)
VALUES
('Sentadilla Goblet con Mancuerna', 'Sostén una mancuerna verticalmente frente al pecho. Baja controladamente empujando las caderas hacia atrás, manteniendo el core activo y el pecho arriba.', 'Tren Inferior', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Puente de Glúteo Unilateral', 'Tumbado boca arriba, flexiona las rodillas apoyando los pies en el suelo. Eleva una pierna y empuja con el talón opuesto para elevar la cadera contrayendo fuertemente el glúteo.', 'Tren Inferior', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Peso Muerto Rumano con Mancuernas', 'De pie con las mancuernas al frente. Flexiona ligeramente las rodillas e inclina el torso hacia adelante empujando la cadera hacia atrás hasta sentir tensión en los isquiotibiales.', 'Tren Inferior', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Flexiones de Pecho Escapulares', 'En posición de plancha alta, realiza una flexión controlada juntando las escápulas al bajar y empujando fuertemente el suelo al subir para activar el serrato anterior.', 'Tren Superior', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=600', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Pájaro / Vuelos Posteriores con Banda', 'Sujeta una banda elástica frente al pecho. Abre los brazos hacia los lados apretando la parte posterior de los hombros y las escápulas. Controla el retorno.', 'Tren Superior', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Bichito Muerto (Dead Bug)', 'Tumbado boca arriba con brazos extendidos hacia el techo y rodillas a 90 grados. Extiende brazo y pierna contraria de forma alterna manteniendo la zona lumbar pegada al suelo.', 'Core', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Plancha Abdominal Activa', 'Apoya los antebrazos y las puntas de los pies. Contrae glúteos, abdomen y empuja los codos contra el suelo. Mantén una línea recta de cabeza a talones sin dejar caer la pelvis.', 'Core', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Movilidad Torácica en Cuadrupedia', 'En cuadrupedia, coloca una mano detrás de la oreja. Rota el codo hacia el brazo de apoyo y luego abre el pecho rotando el codo hacia el techo, siguiendo el movimiento con la mirada.', 'Fisioterapia / Movilidad', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=600', 'https://www.w3schools.com/html/mov_bbb.mp4')
ON CONFLICT (nombre) DO UPDATE 
SET descripcion = EXCLUDED.descripcion,
    grupo_muscular = EXCLUDED.grupo_muscular,
    imagen_url = EXCLUDED.imagen_url,
    video_url = EXCLUDED.video_url;
