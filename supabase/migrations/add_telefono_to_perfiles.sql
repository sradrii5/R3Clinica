-- =============================================
-- MIGRACIÓN: Añadir columna "telefono" a perfiles
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS telefono TEXT;

COMMENT ON COLUMN public.perfiles.telefono IS
  'Número de teléfono del cliente (con prefijo internacional, ej: 34612345678). Usado para deep links de WhatsApp.';
