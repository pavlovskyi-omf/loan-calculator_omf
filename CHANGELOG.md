# Changelog

All notable changes to this project will be documented in this file.

Unreleased
----------

### Added
- Currency selection feature (USD, EUR, UAH) with live exchange rates via Currency Beacon API.
- Domain: `src/domain/currency.ts` — fetchRates, caching (localStorage), convert/format helpers, ensureRates orchestration.
- UI: `src/components/CurrencyDropdown.tsx`, `RateStatusBadge.tsx`, `Notifications.tsx` and wiring in `src/app/App.tsx`.
- Integration tests for API success, server error, network failure, and cached-rate flow: `src/components/currency.integration.test.tsx`.
- Developer warnings for missing/invalid `VITE_CURRENCYBEACON_KEY` and documentation: `.env.example`, README updates.

### Fixed
- Various test and component fixes to support currency-aware rendering and resilient fallback behavior.

### Notes
- `VITE_CURRENCYBEACON_KEY` is optional for development and testing; when absent the app falls back to cached rates or USD. Client-side keys are embedded in the bundle; consider a server-side proxy or restricted key for production.
