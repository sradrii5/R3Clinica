---
type: project
created: 2026-07-27
updated: 2026-07-27
---

# Technical Decisions

## Exercise Date Scheduling (July 2026)

- **Problem**: Exercises assigned to days of the week were automatically repeating for the whole month, but clients with flexible attendance needed date-specific training.
- **Solution**: Added a `fecha` column (type `DATE`) to the `ejercicios` table.
- **Backward Compatibility**: If `fecha` is null, the app falls back to the recurring `dia_semana` schedule.
- **Client Filtering**: The `CalendarioEntrenamiento` component checks `e.fecha === dateStr || (!e.fecha && e.dia_semana === dayName)`.
- **Admin Assignment**: Added a "Fechas" tab in `AsignarPlanForm` that renders a date picker `<input type="date">` for assigning specific dates. If set, it clears `dia_semana`.
