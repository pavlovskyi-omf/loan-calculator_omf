# Personal Loan Calculator - Product

## Purpose
A lightweight internal demo web app for estimating personal loan monthly payments. Users can explore how APR, loan amount, and term affect payment size.

## Key features
1) Loan amount input
- Currency input that accepts: 7000, 7,000, $7,000
- Limits: min $1,500 and max $100,000
- Inline validation: show message and disable Calculate when invalid

2) APR adjustment
- Range: 0% to 36%
- Slider for quick changes
- Minus and plus buttons adjust APR by 1% per click
- Large APR value displayed (example: 25%)

3) Monthly payment comparison table
- Header: “Estimated monthly payment”
- Amount selector tabs: three values derived from the committed amount:
  - committed - 1000, committed, committed + 1000
- Terms shown as rows: 24, 36, 48, 60 months
- Grid shows monthly payments for each term and amount
- Selected amount tab highlights the corresponding column

4) Calculation behavior
- Calculate button commits the current amount and updates the table
- APR changes update results instantly (no Calculate required)
- Display rounding: monthly payments are whole dollars

5) Selected scenario details (extra)
For the currently selected amount tab and an active term selection:
- Monthly payment (whole dollars)
- Total paid = monthlyPayment * termMonths
- Total interest = totalPaid - principal

Term selection UX:
- Default active term: 36 months (or first term) on first load
- Clicking a row sets the active term and updates the details panel

## Assumptions
- Loan is fully amortizing with fixed APR and fixed term
- APR is nominal and applied as APR/12 monthly rate
- If APR is 0%, payment is principal divided by months
- This is an estimator, not a loan offer

## Out of scope for v1
- User accounts, saving profiles
- Backend APIs
- Credit checks or eligibility logic
- Amortization schedule export

## Success criteria (v1)
- UI closely matches the reference layout and interaction model
- Results update correctly and consistently with the defined triggers
- Input validation prevents misleading outputs
- Works well on mobile with stacked layout

## Implementation notes (current)

- Domain utilities implemented and tested: `loanMath.ts`, `currency.ts`, `validation.ts`.
- Components implemented (behavior-first, unstyled):
  - `LoanAmountInput` — currency parsing, inline validation, Calculate button commits amount
  - `AprControl` (`AprControlNew.tsx`) — slider + +/- buttons, integer stepping
  - `AmountTabs` — three comparison amounts (committed - 1000, committed, committed + 1000) with clamping and deduping
  - `PaymentTable` — grid of monthly payments for each term and amount
  - `SelectedDetails` — monthly payment, total paid, total interest for selected scenario
- `App.tsx` wired the components and state: `committedAmount`, `apr`, `selectedAmountIndex`, `selectedTerm`.
- Tests: Vitest + React Testing Library tests cover domain logic, components, and an integration test. All tests in the repo currently pass.

## Known limitations & next steps

- Styling: UI is functionally complete but unstyled. Add Tailwind CSS and MUI theming to match the reference layout.
- Accessibility: basic ARIA attributes added; run an a11y audit and improve keyboard/visual focus styles.
- No build or CI pipeline configured (skipped per request). Add GitHub Actions for builds and deploy to GitHub Pages when ready.
- Mobile polish: responsive layout assumed in architecture; finalize CSS and test on real devices.

