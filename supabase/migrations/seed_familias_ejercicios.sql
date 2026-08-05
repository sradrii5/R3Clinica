-- =============================================
-- SEED: Asignación automática de familias a ejercicios existentes
-- Ejecutar DESPUÉS de add_familia_to_catalogo.sql
-- Supabase Dashboard > SQL Editor
-- =============================================

-- ── Tren Inferior / Sentadillas ──────────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Sentadilla'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%sentadilla%', '%squat%', '%goblet%', '%front squat%', '%back squat%'
]);

-- ── Tren Inferior / Peso Muerto ──────────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Peso Muerto'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%peso muerto%', '%deadlift%', '%rumano%', '%sumo%', '%rdl%'
]);

-- ── Tren Inferior / Cadera y Glúteo ─────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Bisagra de Cadera'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%hip thrust%', '%puente de glúteo%', '%puente de gluteo%',
  '%hip hinge%', '%glute bridge%'
]);

-- ── Tren Inferior / Zancadas ─────────────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Zancadas'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%zancada%', '%lunge%', '%split squat%', '%búlgara%', '%bulgara%'
]);

-- ── Tren Superior / Press ────────────────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Press'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%press%', '%empuje%', '%push%', '%fondos%', '%dips%',
  '%flexiones%', '%push-up%'
]);

-- ── Tren Superior / Jalones y Remos ─────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Jalón / Remo'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%jalón%', '%jalon%', '%remo%', '%pull%', '%dominada%',
  '%chin-up%', '%pulldown%', '%pullover%'
]);

-- ── Core / Plancha ───────────────────────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Plancha / Core'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%plancha%', '%plank%', '%core%', '%abdom%', '%crunch%',
  '%hollow%', '%dead bug%', '%bird dog%', '%rollout%'
]);

-- ── Cardio ───────────────────────────────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Cardio'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%cardio%', '%carrera%', '%bici%', '%remo ergómetro%',
  '%skierg%', '%battle rope%', '%saltos%', '%burpee%'
]);

-- ── Movilidad y Fisioterapia ─────────────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Movilidad / Fisioterapia'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%movilidad%', '%estiramiento%', '%foam%', '%fisio%',
  '%stretching%', '%fáscia%', '%fascia%', '%liberación%'
]);

-- ── Pliometría ───────────────────────────────────────────────
UPDATE public.catalogo_ejercicios
SET familia = 'Pliometría'
WHERE LOWER(nombre) LIKE ANY(ARRAY[
  '%pliométr%', '%pliomet%', '%salto%', '%box jump%',
  '%salto al cajón%', '%drop jump%'
]);

-- Resumen de lo asignado (para verificación)
SELECT familia, COUNT(*) as total
FROM public.catalogo_ejercicios
GROUP BY familia
ORDER BY familia NULLS LAST;
