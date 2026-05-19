-- =========================================================================
-- SETUP COMPLETO DEL PORTAL PRIVADO (TABLAS + USUARIO DE PRUEBAS)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =========================================================================

-- 1. FUNCIÓN HELPER DE TRIGGERS
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. TABLAS DEL SISTEMA
-- -------------------------------------------------------------------------
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

CREATE TABLE IF NOT EXISTS public.ejercicios (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rutina_id    UUID NOT NULL REFERENCES public.rutinas(id) ON DELETE CASCADE,
    nombre       TEXT NOT NULL,
    series       INTEGER NOT NULL DEFAULT 3,
    repeticiones TEXT NOT NULL DEFAULT '10',
    imagen_url   TEXT,
    orden        INTEGER NOT NULL DEFAULT 0,
    notas        TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.comidas (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id     UUID NOT NULL REFERENCES public.planes_nutricionales(id) ON DELETE CASCADE,
    nombre      TEXT NOT NULL,
    descripcion TEXT,
    orden       INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRIGGERS updated_at
-- -------------------------------------------------------------------------
DROP TRIGGER IF EXISTS update_perfiles_updated_at ON public.perfiles;
CREATE TRIGGER update_perfiles_updated_at
    BEFORE UPDATE ON public.perfiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rutinas_updated_at ON public.rutinas;
CREATE TRIGGER update_rutinas_updated_at
    BEFORE UPDATE ON public.rutinas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_planes_updated_at ON public.planes_nutricionales;
CREATE TRIGGER update_planes_updated_at
    BEFORE UPDATE ON public.planes_nutricionales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. SEGURIDAD RLS
-- -------------------------------------------------------------------------
ALTER TABLE public.perfiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutinas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ejercicios           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planes_nutricionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comidas              ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cliente: ver su perfil" ON public.perfiles;
CREATE POLICY "Cliente: ver su perfil" ON public.perfiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Cliente: ver sus rutinas" ON public.rutinas;
CREATE POLICY "Cliente: ver sus rutinas" ON public.rutinas FOR SELECT USING (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "Cliente: ver sus ejercicios" ON public.ejercicios;
CREATE POLICY "Cliente: ver sus ejercicios" ON public.ejercicios FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.rutinas r WHERE r.id = rutina_id AND r.cliente_id = auth.uid())
);

DROP POLICY IF EXISTS "Cliente: ver sus planes nutricionales" ON public.planes_nutricionales;
CREATE POLICY "Cliente: ver sus planes nutricionales" ON public.planes_nutricionales FOR SELECT USING (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "Cliente: ver sus comidas" ON public.comidas;
CREATE POLICY "Cliente: ver sus comidas" ON public.comidas FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.planes_nutricionales p WHERE p.id = plan_id AND p.cliente_id = auth.uid())
);

-- GRANTS
GRANT SELECT ON public.perfiles             TO authenticated;
GRANT SELECT ON public.rutinas              TO authenticated;
GRANT SELECT ON public.ejercicios           TO authenticated;
GRANT SELECT ON public.planes_nutricionales TO authenticated;
GRANT SELECT ON public.comidas              TO authenticated;

-- =========================================================================
-- 5. CREACIÓN AUTOMÁTICA DEL USUARIO DE PRUEBAS (cliente@r3clinica.com / Password123)
-- =========================================================================

-- Insertar usuario en la tabla interna de autenticación de Supabase (auth.users)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, recovery_sent_at, last_sign_in_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7', -- UUID Estático creado por nosotros
    'authenticated',
    'authenticated',
    'cliente@r3clinica.com',
    -- Encripta la contraseña 'Password123' usando la extensión pgcrypto por defecto en Supabase
    crypt('Password123', gen_salt('bf', 10)),
    NOW(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
)
ON CONFLICT (id) DO NOTHING;

-- Crear identidad correspondiente de Supabase Auth
INSERT INTO auth.identities (
    id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
VALUES (
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    jsonb_build_object('sub', 'd3b07384-d113-4ec2-a5d5-c0528246e7f7', 'email', 'cliente@r3clinica.com'),
    'email',
    NOW(),
    NOW(),
    NOW()
)
ON CONFLICT (provider, id) DO NOTHING;

-- 6. ASIGNACIÓN DE DATOS DE PRUEBA ASOCIADOS A ESTE USUARIO
-- -------------------------------------------------------------------------

-- Perfil Clínico
INSERT INTO public.perfiles (id, nombre, apellidos, objetivo)
VALUES ('d3b07384-d113-4ec2-a5d5-c0528246e7f7', 'Carlos', 'García', 'Optimización metabólica y fuerza')
ON CONFLICT (id) DO NOTHING;

-- Rutina Activa
INSERT INTO public.rutinas (id, cliente_id, nombre, descripcion, activa, fecha_inicio, fecha_fin)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'Fuerza Máxima e Hipertrofia',
    'Enfoque en ejercicios multiarticulares pesados para maximizar reclutamiento de unidades motoras. Descansa 2 minutos entre series.',
    true,
    '2026-05-19',
    '2026-06-19'
)
ON CONFLICT (id) DO NOTHING;

-- Ejercicios de la Rutina
INSERT INTO public.ejercicios (rutina_id, nombre, series, repeticiones, notas, orden)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'Sentadilla Trasera con Barra', 4, '8-10', 'Controla la bajada en 3 segundos. Mantén el abdomen tenso.', 1),
('a0000000-0000-0000-0000-000000000001', 'Press de Banca Plano', 4, '10', 'Retracción escapular máxima durante todo el levantamiento.', 2),
('a0000000-0000-0000-0000-000000000001', 'Peso Muerto Rumano', 3, '12', 'Enfoque en la bisagra de cadera. Empuja fuerte con los talones.', 3)
ON CONFLICT (id) DO NOTHING;

-- Plan Nutricional Activo
INSERT INTO public.planes_nutricionales (id, cliente_id, nombre, descripcion, calorias_objetivo, activo)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'Carga Limpia Energética',
    'Pautas generales: Beber 3L de agua al día, priorizar alimentos densos en nutrientes y evitar azúcares refinados.',
    2800,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Comidas del Plan
INSERT INTO public.comidas (plan_id, nombre, descripcion, orden)
VALUES 
('b0000000-0000-0000-0000-000000000001', 'Desayuno (08:30)', '4 huevos enteros revueltos + 80g de avena cocida con canela y un puñado de arándanos.', 1),
('b0000000-0000-0000-0000-000000000001', 'Almuerzo (14:00)', '200g de pechuga de pollo a la plancha + 150g de arroz jazmín + espárragos trigueros al horno.', 2),
('b0000000-0000-0000-0000-000000000001', 'Post-Entrenamiento', 'Batido de proteína de suero aislada (Whey Isolate) + 1 plátano maduro.', 3)
ON CONFLICT (id) DO NOTHING;
