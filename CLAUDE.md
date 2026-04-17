# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Dev server at http://localhost:5173
npm run build    # tsc + Vite production build
npm run preview  # Preview production build
```

No test runner or linter is configured.

## Architecture

Single-page React trip planner deployed to GitHub Pages at `https://markristian-cmd.github.io/Trippy/`. All logic lives in [src/App.tsx](src/App.tsx) — one component handles form state, trip list state, and rendering. No component decomposition, no external state management, no backend.

**Data flow:**
- Controlled form inputs → `destination`, `startDate`, `endDate`, `notes` state
- `canAdd` boolean gates the submit button (destination + both dates required)
- "Add trip" prepends a new `TripItem` to `trips` via `setTrips(current => [item, ...current])`
- Summary line recalculates via `useMemo` — filters for upcoming trips, sorts by start date, shows the nearest one

**Key types:** `TripItem` in [src/App.tsx](src/App.tsx) — `{ id, destination, startDate, endDate, notes }`. IDs use `crypto.randomUUID()`.

**Helpers in App.tsx:**
- `formatDate(iso)` — formats ISO date strings as "Apr 17, 2026"
- `getDuration(start, end)` — returns human-readable trip length ("5 days")

**Styling:** Vanilla CSS in [src/styles.css](src/styles.css). Dark luxury theme with CSS variables in `:root`. Google Fonts loaded via `@import` (Cormorant Garamond for headings, DM Sans for body). Responsive CSS Grid with 900px breakpoint; trip cards switch to multi-column above that breakpoint.

## Conventions

- New fields: add to `TripItem`, add `useState` + `<input>` in `App.tsx`, include in trip object construction and form reset
- New components: `.tsx` files in `src/`, imported into `App.tsx`, data passed via props
- CSS class naming: BEM-adjacent (`.planner-form`, `.trip-card-header`)
- Theme colors: always use `var(--accent)`, `var(--surface)`, etc. — never hardcode hex values
