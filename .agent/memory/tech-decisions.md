# Technical Decisions & Updates Log

## Session Summary (2026-07-28)

### 1. Brand & Header Aesthetics
- Extracted authentic white R3 logo from wall photo without blue/grey background or watermark.
- Updated header subtitle to `Rehabilitación · Readaptación · Rendimiento`.

### 2. Hero Section Optimization
- Badge: `TU CENTRO DEPORTIVO · VALLADOLID`
- Copy: *"Todo comienza con una evaluación inicial. Diseñamos un plan personalizado que integra entrenamiento, fisioterapia, nutrición y seguimiento continuo para ayudarte a conseguir resultados medibles y duraderos"*
- CTAs: Primary *"Pide tu cita"*, Secondary *"Reservar valoración gratuita"* (WhatsApp link).
- Social Proof: Impact stats (+200 clients, 98% back pain recovery, 4.9★ Google) and 4.5s auto-sliding Google Reviews Carousel.

### 3. Services Catalog & Categories
- Centralized static catalog (`src/data/servicios.ts`) containing all 11 core disciplines.
- Added category filter pills & search bar in `/servicios` grid and `/servicios/[slug]` fallback details.
- Added `Pliometría` to `GRUPOS_MUSCULARES` in `GestionarCatalogoForm.tsx`.

### 4. Security & Middleware
- Replaced hardcoded default password with secure 12-char random string in `crearClienteAction`.
- Added HTTP Security Headers in `next.config.ts`.
- Server-side email format and string length validation in `POST /api/contact`.
- Single edge middleware `src/middleware.ts` protecting `/portal/*` and redirecting authenticated users away from `/login`. Removed legacy duplicate `src/proxy.ts` to prevent build conflicts.
