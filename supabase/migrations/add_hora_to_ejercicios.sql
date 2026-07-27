-- =============================================
-- MIGRACIÓN: AGREGAR COLUMNA HORA A EJERCICIOS
-- Permite especificar la hora de cada sesión
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

ALTER TABLE public.ejercicios
  ADD COLUMN IF NOT EXISTS hora TEXT;
