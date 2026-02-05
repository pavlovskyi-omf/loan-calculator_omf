# GitHub Copilot Agent - Project Instructions (Persistent)

## Goals
- Replicate the reference UI and interaction model precisely.
- Keep business logic testable and isolated from UI.
- Prefer simple, readable code over abstractions.

## Tech constraints
- React + TypeScript + Vite
- Tailwind CSS for layout and spacing
- MUI for UI primitives (Input, Button, Slider, Tabs) with styling to match the reference
- Vitest + React Testing Library for tests

## Architecture rules
- Put pure loan math and formatting in `src/domain/*`:
  - `loanMath.ts` must export pure functions with no React imports.
  - Include unit tests for payment calculations and edge cases.
- UI components live in `src/components/*` and should be reusable.
- App composition and state orchestration live in `src/app/App.tsx` (or `src/app/*`).

## Product rules
- Amount input:
  - Accept currency-like typing and paste.
  - Validate min $1500, max $100000.
  - Show inline error message and disable Calculate when invalid.
- APR:
  - Range 0 to 36.
  - Minus/plus buttons change APR by 1.
  - Slider changes update results instantly.
- Recalculation:
  - Amount changes only update the table after Calculate is clicked.
- Table:
  - Show 3 amount columns: committed-1000, committed, committed+1000 (clamped).
  - Rows: 24/36/48/60 months.
  - Display monthly payments as whole dollars.

## Code style
- TypeScript:
  - Use explicit types for public functions.
  - Avoid `any`, prefer `unknown` with narrowing.
- React:
  - Prefer functional components, hooks.
  - Keep derived data computed via memoization where helpful, but do not overuse useMemo.
- Formatting:
  - Prettier enforced.
  - ESLint warnings should be fixed, not ignored.

## Testing expectations
- Add tests for:
  - `calculateMonthlyPayment` for typical APR, 0% APR, and rounding behavior.
  - Amount clamping and compare amounts generation.
  - Calculate-button commit behavior versus instant APR updates.

## Deliverables order
1) Domain functions + unit tests
2) UI skeleton matching layout
3) Wiring state and interactions
4) Styling polish to match reference
5) Accessibility pass
