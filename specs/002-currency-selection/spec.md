# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)
# Feature Specification: Currency Selection for Payment and Scenario

**Feature Branch**: `002-currency-selection`  
**Created**: 2026-02-10  
**Status**: Draft  
**Input**: User description: "Add a currency dropdown in the Estimated Monthly Payment area. The Loan Amount remains the base value in USD. Supported currencies: USD (default), EUR, UAH. Use Currency Beacon API with key stored in VITE_CURRENCYBEACON_KEY and accessed via import.meta.env. Handle API errors, caching, and fallback to last valid rates or USD."

## Clarifications

### Session 2026-02-10

- Q: Should the selected currency preference be persisted across reloads/sessions? → A: Persist selection in localStorage (survives reloads & sessions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select display currency (Priority: P1)

As a user, I can select a currency (USD, EUR, UAH) from a dropdown in the Estimated Monthly Payment area so that all displayed monetary values (Estimated Monthly Payment and Selected Scenario) update to my chosen currency in real time.

**Why this priority**: Core user-facing requirement — without it users cannot view results in their preferred currency.

**Independent Test**: Open the app, locate the Estimated Monthly Payment area, change the currency dropdown from USD to EUR and UAH and verify that all amounts in Estimated Monthly Payment and Selected Scenario convert appropriately and instantly.

**Acceptance Scenarios**:

1. **Given** the app is open and default currency is USD, **When** the user selects EUR, **Then** Estimated Monthly Payment and Selected Scenario values are shown in EUR and reflect converted amounts.
2. **Given** the user selects UAH, **When** rates are available, **Then** values update to UAH using current exchange rates.

---

### User Story 2 - Robust rates & fallback (Priority: P2)

As a user, if the Currency Beacon API is unavailable or fails, I still see sensible values — the app uses the last known rates (if available) or falls back to USD and shows a non-blocking error message.

**Why this priority**: Ensures reliability and avoids blocking core functionality when external API fails.

**Independent Test**: Simulate API failure (network offline or API returns error). Verify that the app uses cached rates if present; otherwise, values display in USD and a transient, non-blocking notification informs the user the conversion is unavailable.

**Acceptance Scenarios**:

1. **Given** cached rates exist and the API fails, **When** the user changes currency, **Then** conversions use cached rates and no blocking errors occur.
2. **Given** no cached rates and API fails, **When** the user changes currency, **Then** values display in USD and a subtle non-blocking message is shown.

---

### User Story 3 - Environment configuration & security (Priority: P3)

As a developer or deployer, I can provide the Currency Beacon API key through environment variables following Vite conventions (VITE_CURRENCYBEACON_KEY) so that secrets are not hard-coded.

**Why this priority**: Security and deployment correctness; required for production API access.

**Independent Test**: Verify that when VITE_CURRENCYBEACON_KEY is present in the environment, the app includes it via import.meta.env and the API calls succeed; when absent, app behaves with cached/USD fallback and logs a clear developer-facing warning.

**Acceptance Scenarios**:

1. **Given** VITE_CURRENCYBEACON_KEY is set, **When** code runs, **Then** API requests include the key and rates are retrieved.
2. **Given** VITE_CURRENCYBEACON_KEY is not set, **When** code runs, **Then** no secret is exposed and the app falls back to cached rates or USD.

---

### Edge Cases

- API returns partial data (missing currency): treat missing currency as unavailable and fall back per fallback rules.
- Rapid currency toggles: ensure UI updates are debounced or rate-limited to avoid excessive API calls.
- Extremely large or small monetary values: ensure conversion preserves numeric correctness and formatting.
- Timezone/locale differences: display currency symbol and formatting consistent with selected currency (but do not modify base loan amount which remains in USD).
- No internet on first run (no cached rates): default to USD and show non-blocking message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The UI MUST display a currency dropdown in the Estimated Monthly Payment area containing USD, EUR, and UAH with USD as the default.
- **FR-002**: When the user changes the selected currency, the Estimated Monthly Payment values and Selected Scenario values MUST update in real time to reflect converted amounts.
- **FR-003**: The system MUST retrieve exchange rates from the Currency Beacon API using an API key provided via `import.meta.env.VITE_CURRENCYBEACON_KEY`.
- **FR-004**: If the API call fails, the system MUST use the last valid cached rates if available; otherwise, it MUST display values in USD.
- **FR-005**: If the API call fails, the system MUST show a non-blocking, user-visible notification indicating conversion rates are unavailable.
- **FR-006**: Conversion and formatting logic MUST be centralized in a reusable domain function/module (e.g., `src/domain/currency.ts`).
- **FR-007**: The system MUST cache retrieved exchange rates with a configurable TTL and persist them such that they survive page reloads (e.g., localStorage or indexedDB).
- **FR-008**: The application MUST correctly load environment variables according to Vite conventions and not expose the raw API key to client-side logs.
- **FR-009**: The selected currency preference MUST persist across page reloads and browser sessions (e.g., stored in `localStorage`).

### Key Entities *(include if feature involves data)*

- **Currency**: Supported currency code (USD, EUR, UAH) and display metadata (symbol, locale-formatting hints).
- **ExchangeRate**: Mapping from currency code to rate relative to USD and a timestamp for TTL/caching.
- **ExchangeRateCache**: Persisted store of recent rates and metadata (fetchedAt, source).
- **SelectedScenario**: UI model representing the chosen scenario with amounts formatted to the currently selected currency.

### Architecture Considerations *(for React projects)*

**Domain Layer** (Pure functions in `src/domain/`):
- `convertAmount(amountUsd: number, targetCurrency: string, rates: ExchangeRate): number` — pure function that converts USD base amount to target currency and applies rounding/formatting rules.
- `fetchRates(apiKey: string): Promise<ExchangeRate>` — fetch wrapper that handles API response normalization and errors.
- `getCachedRates()` / `setCachedRates()` — cache read/write operations with TTL handling.

**Component Layer** (UI in `src/components/`):
- `CurrencyDropdown` — dropdown component placed in Estimated Monthly Payment area (props: `value`, `onChange`, `options`).
- `EstimatedMonthlyPayment` and `SelectedDetails` components must consume selected currency and converted amounts.
- Ensure components are accessible (keyboard, ARIA) and visually indicate when a conversion fallback is in effect.

**App Layer** (Orchestration in `src/app/`):
- State: `selectedCurrency`, `exchangeRates`, `ratesStatus` (ok/cached/fallback/error), `ratesFetchedAt`.
- Flow: On app start, attempt to load cached rates -> if key present attempt fetch -> update state and cache. On currency change, derive converted amounts from domain functions.
- Error handling: Non-blocking UI notifications for rate errors; developer-visible log for missing API key.
 - Persistence: `selectedCurrency` SHOULD be persisted in `localStorage` and restored on app start so the user's preference survives reloads and sessions. If `localStorage` is unavailable, default to USD.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A currency dropdown is visible in the Estimated Monthly Payment area and contains USD, EUR, UAH (USD default) (verification: visual check) — 100% presence.
- **SC-002**: Changing the currency updates Estimated Monthly Payment and Selected Scenario values within 200ms from user action when rates are cached or available (verification: instrumented timing in dev build).
- **SC-003**: If the Currency Beacon API fails, the app uses cached rates when available or displays values in USD and shows a non-blocking notification (verification: simulate API failure).
- **SC-004**: Environment variable `VITE_CURRENCYBEACON_KEY` is read via `import.meta.env` in the deployed app (verification: review build-time/env docs and e2e test for missing key behavior).
- **SC-005**: Conversion logic is test-covered: unit tests for `convertAmount` across typical values, zero interest/no-change edge cases, and rounding behavior (verification: vitest tests pass).

```
