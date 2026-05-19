-- 1. ELIMINACIÓN DE REGISTROS PREVIOS (Para poder re-ejecutar sin duplicados)
-- Borramos en orden de dependencia estricto (hijos primero, padres después)
-- =========================================================================
DELETE FROM public.comidas WHERE plan_id = 'b0000000-0000-0000-0000-000000000001';
DELETE FROM public.ejercicios WHERE rutina_id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM public.planes_nutricionales WHERE id = 'b0000000-0000-0000-0000-000000000001';
DELETE FROM public.rutinas WHERE id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM public.perfiles WHERE id IN ('d3b07384-d113-4ec2-a5d5-c0528246e7f7', 'e3b07384-d113-4ec2-a5d5-c0528246e7f7');
DELETE FROM auth.identities WHERE user_id IN ('d3b07384-d113-4ec2-a5d5-c0528246e7f7', 'e3b07384-d113-4ec2-a5d5-c0528246e7f7');
DELETE FROM auth.users WHERE id IN ('d3b07384-d113-4ec2-a5d5-c0528246e7f7', 'e3b07384-d113-4ec2-a5d5-c0528246e7f7');

-- 2. INSERTAR USUARIOS EN LA AUTENTICACIÓN INTERNA DE SUPABASE (auth.users)
-- =========================================================================
-- Cliente: cliente@r3clinica.com / Contraseña: Password123
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, recovery_sent_at, last_sign_in_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'authenticated',
    'authenticated',
    'cliente@r3clinica.com',
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
);

-- Admin: admin@r3clinica.com / Contraseña: AdminPassword123
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, recovery_sent_at, last_sign_in_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'e3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'authenticated',
    'authenticated',
    'admin@r3clinica.com',
    crypt('AdminPassword123', gen_salt('bf', 10)),
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
);

-- 3. ASOCIAR LAS IDENTIDADES EN SUPABASE AUTH
-- =========================================================================
INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
VALUES (
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    jsonb_build_object('sub', 'd3b07384-d113-4ec2-a5d5-c0528246e7f7', 'email', 'cliente@r3clinica.com'),
    'email',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    NOW(),
    NOW(),
    NOW()
);

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
VALUES (
    'e3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'e3b07384-d113-4ec2-a5d5-c0528246e7f7',
    jsonb_build_object('sub', 'e3b07384-d113-4ec2-a5d5-c0528246e7f7', 'email', 'admin@r3clinica.com'),
    'email',
    'e3b07384-d113-4ec2-a5d5-c0528246e7f7',
    NOW(),
    NOW(),
    NOW()
);

-- 4. CREAR PERFILES ASOCIADOS EN LA TABLA PÚBLICA
-- =========================================================================
-- Cliente
INSERT INTO public.perfiles (id, nombre, apellidos, objetivo, es_admin)
VALUES ('d3b07384-d113-4ec2-a5d5-c0528246e7f7', 'Carlos', 'García', 'Optimización metabólica y fuerza', false);

-- Admin
INSERT INTO public.perfiles (id, nombre, apellidos, objetivo, es_admin)
VALUES ('e3b07384-d113-4ec2-a5d5-c0528246e7f7', 'Director', 'Médico R3', 'Panel de administración general', true);

-- 5. INSERTAR RUTINA DE PRUEBA
-- =========================================================================
INSERT INTO public.rutinas (id, cliente_id, nombre, descripcion, activa, fecha_inicio, fecha_fin)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'Fuerza Máxima e Hipertrofia',
    'Enfoque en ejercicios multiarticulares pesados para maximizar reclutamiento de unidades motoras. Descansa 2 minutos entre series.',
    true,
    '2026-05-19',
    '2026-06-19'
);

-- 6. ASIGNAR EJERCICIOS A LA RUTINA
-- =========================================================================
INSERT INTO public.ejercicios (id, rutina_id, nombre, series, repeticiones, notas, orden)
VALUES 
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Sentadilla Trasera con Barra', 4, '8-10', 'Controla la bajada en 3 segundos. Mantén el abdomen tenso.', 1),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Press de Banca Plano', 4, '10', 'Retracción escapular máxima durante todo el levantamiento.', 2),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Peso Muerto Rumano', 3, '12', 'Enfoque en la bisagra de cadera. Empuja fuerte con los talones.', 3);

-- 7. CREAR PLAN NUTRICIONAL ACTIVO
-- =========================================================================
INSERT INTO public.planes_nutricionales (id, cliente_id, nombre, descripcion, calorias_objetivo, activo)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'd3b07384-d113-4ec2-a5d5-c0528246e7f7',
    'Carga Limpia Energética',
    'Pautas generales: Beber 3L de agua al día, priorizar alimentos densos en nutrientes y evitar azúcares refinados.',
    2800,
    true
);

-- 8. ASIGNAR COMIDAS AL PLAN
-- =========================================================================
INSERT INTO public.comidas (id, plan_id, nombre, descripcion, orden)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Desayuno (08:30)', '4 huevos enteros revueltos + 80g de avena cocida con canela y un puñado de arándanos.', 1),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Almuerzo (14:00)', '200g de pechuga de pollo a la plancha + 150g de arroz jazmín + espárragos trigueros al horno.', 2),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Post-Entrenamiento', 'Batido de proteína de suero aislada (Whey Isolate) + 1 plátano maduro.', 3);
