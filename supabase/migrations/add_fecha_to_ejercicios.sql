-- =========================================================================
-- MIGRACIÓN: AGREGAR FECHA A LOS EJERCICIOS DE ENTRENAMIENTO - R3Clinica
-- =========================================================================

ALTER TABLE public.ejercicios ADD COLUMN IF NOT EXISTS fecha DATE;
