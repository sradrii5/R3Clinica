-- =========================================================================
-- PARCHE DE SEGURIDAD Y GESTIÓN DE CLIENTES - R3Clinica
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =========================================================================

-- 1. Añadir columnas email y activo a public.perfiles
ALTER TABLE public.perfiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.perfiles ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;

-- 2. Actualizar registros existentes con sus datos por defecto (evitar NULLs)
UPDATE public.perfiles SET email = 'cliente@r3clinica.com' WHERE id = 'd3b07384-d113-4ec2-a5d5-c0528246e7f7' AND email IS NULL;
UPDATE public.perfiles SET email = 'admin@r3clinica.com' WHERE id = 'e3b07384-d113-4ec2-a5d5-c0528246e7f7' AND email IS NULL;

-- 3. Crear función helper recursión-safe para RLS
CREATE OR REPLACE FUNCTION public.es_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid() AND es_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Habilitar políticas RLS para administradores en la tabla perfiles
-- Permitir a administradores ver todos los perfiles
DROP POLICY IF EXISTS "Admins: ver todos los perfiles" ON public.perfiles;
CREATE POLICY "Admins: ver todos los perfiles" 
    ON public.perfiles FOR SELECT 
    USING (public.es_admin());

-- Permitir a administradores actualizar perfiles
DROP POLICY IF EXISTS "Admins: actualizar perfiles" ON public.perfiles;
CREATE POLICY "Admins: actualizar perfiles" 
    ON public.perfiles FOR UPDATE 
    USING (public.es_admin())
    WITH CHECK (public.es_admin());

-- 5. Actualizar políticas de lectura para clientes en la tabla perfiles (deben estar activos)
DROP POLICY IF EXISTS "Cliente: ver su perfil" ON public.perfiles;
CREATE POLICY "Cliente: ver su perfil" 
    ON public.perfiles FOR SELECT 
    USING (auth.uid() = id AND activo = TRUE);
