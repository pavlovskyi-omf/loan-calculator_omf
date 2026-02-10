# PR Draft: Currency Selection (002-currency-selection)

Branch: `002-currency-selection` (already created by feature-init)

Summary:
Implement currency selection and exchange rate support for Estimated Monthly Payment area; supports USD, EUR, UAH with caching and graceful fallbacks.

Files of interest:
- `src/domain/currency.ts` — core fetch/convert/cache
- `src/components/CurrencyDropdown.tsx`, `RateStatusBadge.tsx`, `Notifications.tsx`
- `src/app/App.tsx` — wiring, selected currency persistence
- `src/components/currency.integration.test.tsx` — integration tests
- `.env.example`, `README.md`, `CHANGELOG.md`

Testing:
- All unit and integration tests pass locally (`npm test`)

Checklist before merge:
- [ ] Add CI secret for production key if needed
- [ ] Accessibility review for dropdown and notifications
- [ ] Confirm no leaking of sensitive keys in build

Suggested reviewers: @team-frontend
