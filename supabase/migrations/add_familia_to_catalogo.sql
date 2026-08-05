-- =============================================
-- MIGRACIÓN: Añadir columna "familia" al catálogo de ejercicios
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

ALTER TABLE public.catalogo_ejercicios
  ADD COLUMN IF NOT EXISTS familia TEXT;

-- Índice para filtrado eficiente por familia
CREATE INDEX IF NOT EXISTS idx_catalogo_ejercicios_familia
  ON public.catalogo_ejercicios(familia);

-- Comentario descriptivo
COMMENT ON COLUMN public.catalogo_ejercicios.familia IS
  'Agrupación temática del ejercicio dentro de su grupo muscular. Ej: Sentadilla, Peso Muerto, Press de Banca.';
