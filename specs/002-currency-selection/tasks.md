```markdown
# Tasks: Currency Selection for Payment and Scenario

**Input**: `spec.md`, `plan.md`, `research.md` in `specs/002-currency-selection/`

**Prerequisites**: Vite env access (`VITE_CURRENCYBEACON_KEY`), existing domain and UI structure in `src/domain` and `src/components`.

**TDD requirement**: Domain functions MUST have unit tests written first (red → green → refactor).

## Format: `[ID] [P?] [Area] Short description (files)`

- **[P]**: Can run in parallel
- Include exact file paths where changes will occur

---

## Phase: Setup

- [x] S001 [Setup] Add `.env.example` with `VITE_CURRENCYBEACON_KEY` and docs (ROOT: `.env.example`, `README.md`)

---

## Phase: Domain & Tests (Priority: P1)

Purpose: Implement pure conversion + fetch + cache logic in `src/domain/currency.ts` with full unit coverage.

- [x] D001 [P] [Domain Tests] Add unit tests for `convertAmount`, `formatCurrency`, cache TTL logic, and error cases (tests: `src/domain/currency.test.ts`)
- [x] D002 [Domain] Implement types and constants: `ExchangeRate`, `RatesStatus`, `EXCHANGE_CACHE_KEY`, TTL default (file: `src/domain/currency.ts`, `src/domain/config.ts` if needed)
- [x] D003 [Domain] Implement `fetchRates(opts)` calling `GET /latest?base=USD&symbols=EUR,UAH` and normalize response (file: `src/domain/currency.ts`)
- [x] D004 [Domain] Implement `getCachedRates()` / `setCachedRates()` (localStorage) and `isCacheValid()` (file: `src/domain/currency.ts`)
- [x] D005 [Domain] Implement `convertAmount(amountUsd, targetCurrency, rates)` and `formatCurrency(amount, currencyCode, locale)` (file: `src/domain/currency.ts`)
- [x] D006 [Domain] Implement `ensureRates(opts, ttlMs)` orchestration function that returns `{ rates, status }` (file: `src/domain/currency.ts`)
- [x] D007 [Domain] Run tests and achieve coverage for domain functions (command: `npm test src/domain/currency.test.ts`) — tests passed locally

---

## Phase: Cache & Persistence

- [x] C001 [Cache] Implement exchange rate cache in `localStorage` with configurable TTL and migration safety (file: `src/domain/currency.ts`)
- [x] C002 [Cache] Persist `selectedCurrency` preference to `localStorage` and restore on app start (files: `src/app/App.tsx`, `src/domain/currency.ts` helpers)

---

## Phase: Components & Wiring

- [x] U001 [UI] Create `CurrencyDropdown` component (accessible) and story/test (file: `src/components/CurrencyDropdown.tsx`, test: `src/components/CurrencyDropdown.test.tsx`)
- [x] U002 [UI] Place `CurrencyDropdown` in Estimated Monthly Payment area and lift `selectedCurrency` state to `src/app/App.tsx` (files: `src/app/App.tsx`, `src/components/EstimatedMonthlyPayment.tsx` or existing component)
- [x] U003 [UI] Update `EstimatedMonthlyPayment` and `SelectedDetails` to accept `selectedCurrency` and use `convertAmount` + `formatCurrency` to display values (files: `src/components/EstimatedMonthlyPayment.tsx`, `src/components/SelectedDetails.tsx`)
 - [x] U004 [UI] Add visual indicator in UI when rates are stale or fallback used (small non-blocking badge or tooltip) (files: `src/components/EstimatedMonthlyPayment.tsx`, `src/components/SelectedDetails.tsx`)

---

## Phase: Error Handling & Developer Logs

 - [x] E001 [Error] Show non-blocking notification when API fetch fails and cache is used or when no cache exists and USD fallback is applied (files: `src/app/App.tsx`, `src/components/Notifications.tsx`)
 - [x] E002 [Dev] Add developer log warnings when `VITE_CURRENCYBEACON_KEY` missing or invalid (file: `src/domain/currency.ts`)

---

## Phase: Tests & Integration

 - [x] T001 [Tests] Add unit tests for UI behavior (dropdown selection changes values) using React Testing Library (files: `src/components/CurrencyDropdown.test.tsx`, `src/components/EstimatedMonthlyPayment.test.tsx`)
 - [x] T002 [Tests] Add integration test: simulate API success, cached rates, and API failure flows (file: `test/currency.integration.test.ts`)
 - [x] T003 [Tests] Run full test suite and ensure no regressions: `npm test`

---

## Phase: Docs, Examples & CI

 - [x] Docs001 [Docs] Add `.env.example` (if not done), update README with setup instructions for `VITE_CURRENCYBEACON_KEY` and testing notes (files: `.env.example`, `README.md`)
- [ ] CI001 [CI] Ensure tests run in CI and environment variables are optional (mock rates) for test runs (files: `vitest.config.ts`, CI pipeline config if present)

---

## Phase: Polish, Accessibility & Release

- [ ] P001 [Polish] Accessibility pass (keyboard, ARIA labels) for `CurrencyDropdown` and notifications
- [ ] P002 [Polish] Performance check: conversion and rendering <200ms in common cases
- [ ] P003 [Polish] Cross-browser manual checks (Chrome, Firefox, Edge, Safari)
- [ ] P004 [Release] Prepare changelog and PR description, open PR for review (PR branch: `002-currency-selection`) (files: `CHANGELOG.md`, PR)

---

## Execution Order & Parallelism

- Domain tests (D001) must be written before domain implementation (D002-D006) — TDD red/green cycle.
- Cache and persistence (C001,C002) can be implemented after D006 or in parallel with UI wiring if API shapes are mocked.
- UI component creation (U001) and tests (T001) can run in parallel with domain implementation provided tests mock domain functions.
- Error handling and logs (E001,E002) implemented during wiring and polish stages.

---

## Quick commands

Run unit tests for domain:

```bash
npm test src/domain/currency.test.ts
```

Run full test suite:

```bash
npm test
```

```
