# loan-calculator_omf
Responsive web app that calculates and displays estimated monthly loan payments.

## Development

Install dependencies and run tests:

```bash
npm install
npm test
```

Project structure (key files):
- `src/App.tsx` — app shell wiring components and state
- `src/components` — React components (LoanAmountInput, AprControl, AmountTabs, PaymentTable, SelectedDetails)
- `src/domain` — pure domain utilities (`loanMath.ts`, `currency.ts`, `validation.ts`)
- `tests/` — Vitest + React Testing Library tests

Notes:
- The project uses TypeScript and Vitest for testing. UI is unstyled (focus is on behavior); Tailwind/MUI can be added for styling.
