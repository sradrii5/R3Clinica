-- =============================================
-- MIGRACIÓN: Eliminar constraint dia_semana y
-- hacer la columna nullable para el sistema
-- de sesiones por fecha (date-first)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Eliminar el CHECK constraint que fuerza valores de día de semana
ALTER TABLE public.ejercicios
  DROP CONSTRAINT IF EXISTS ejercicios_dia_semana_check;

-- 2. Hacer dia_semana nullable (ya no es obligatorio en el nuevo sistema)
ALTER TABLE public.ejercicios
  ALTER COLUMN dia_semana DROP NOT NULL;

-- 3. Asegurar que la columna fecha existe (por si no se ejecutó la migración anterior)
ALTER TABLE public.ejercicios
  ADD COLUMN IF NOT EXISTS fecha DATE;

-- Verificación: muestra la estructura actual
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'ejercicios'
-- ORDER BY ordinal_position;
