# Summary
Provide a short description of the changes in this PR.

## What changed
- Add currency selection (USD/EUR/UAH) and exchange-rate support
- Domain changes: `src/domain/currency.ts` (fetch, cache, convert)
- UI changes: `src/components/CurrencyDropdown.tsx`, `RateStatusBadge.tsx`, `Notifications.tsx`, and wiring in `src/app/App.tsx`

## Why
Support multi-currency display for estimated monthly payments and improved UX when rates are unavailable.

## How to test
1. Run `npm install`
2. Copy `.env.example` to `.env` and set `VITE_CURRENCYBEACON_KEY` (optional for tests)
3. Run `npm test -- --run` — all tests should pass
4. Run `npm run dev` and verify currency dropdown and badges in UI

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated (`README.md`, `.env.example`, `CHANGELOG.md`)
- [ ] QA/accessibility checks performed

## Notes for reviewers
Any special notes or potential follow-ups.
