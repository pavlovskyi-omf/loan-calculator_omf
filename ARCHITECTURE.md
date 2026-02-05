# Personal Loan Calculator - Architecture

## Overview
Personal Loan Calculator is a client-side web app that estimates monthly payments for a personal loan using:
- Loan amount (currency input)
- APR (slider + minus/plus step controls)
- Repayment terms (24/36/48/60 months)

It replicates the reference UI:
- Left panel: amount input + Calculate button, APR slider with minus/plus, large APR readout
- Right panel: “Estimated monthly payment” with 3 amount tabs and a grid of monthly payments
- Extra details section: total paid and total interest for the selected scenario

Target use: internal demo/prototype (no authentication, no backend).

## Tech stack
- Runtime: Node.js LTS
- Frontend: React + TypeScript + Vite
- Styling/layout: Tailwind CSS
- Component library: MUI (Material UI) for input, buttons, slider, tabs (styled to match reference)
- Testing: Vitest + React Testing Library
- Lint/format: ESLint + Prettier
- Deploy: GitHub Pages

## Architecture and boundaries
Single-page application with clear separation:
- UI layer (React components): rendering, user interactions
- Domain layer (pure functions): loan math, formatting, validation helpers
- State layer (hooks): app state, derived data, and event handlers

No server dependencies. All computations happen in the browser.

## Core domain logic
### Payment calculation
Use standard amortized loan payment:
- monthlyRate = (APR / 100) / 12
- n = termMonths
- P = principal
- payment = P * r * (1 + r)^n / ((1 + r)^n - 1)

APR interpretation: nominal APR compounded monthly (APR/12).

Edge case:
- If APR == 0%: payment = P / n

Rounding:
- Monthly payments displayed as whole dollars (rounded to nearest dollar)

### Comparison amounts
The 3 amount tabs are derived from the current input amount:
- A0 = amount - 1000
- A1 = amount
- A2 = amount + 1000
All amounts are clamped to the configured min/max. Duplicates after clamping are allowed but should be de-duplicated in display if they become identical.

### Recalculation behavior
- Clicking Calculate updates the comparison table based on the current loan amount.
- Changing APR via slider or minus/plus updates the table instantly.
- Changing the amount input does not update the table until Calculate is clicked.

## State model
Suggested state shape (React hook):
- inputAmount: number | null
- committedAmount: number (used for table; updated on Calculate)
- apr: number (0 to 36, step 1 via buttons; slider can still be continuous if desired but must align with the chosen step)
- selectedAmountIndex: 0 | 1 | 2 (tab selection)
- terms: [24, 36, 48, 60]

Derived data:
- comparisonAmounts: number[] from committedAmount
- paymentGrid: Map(term -> Map(amount -> payment))
- selectedScenario: { amount, term } (term chosen via row focus/click)
- selectedDetails: { monthlyPayment, totalPaid, totalInterest }

## UI component structure
Proposed folders:
- src/
  - app/
    - App.tsx
  - components/
    - LoanAmountInput.tsx
    - AprControl.tsx
    - AmountTabs.tsx
    - PaymentTable.tsx
    - SelectedDetails.tsx
  - domain/
    - loanMath.ts
    - currency.ts
    - validation.ts
  - styles/
    - globals.css

Component responsibilities:
- LoanAmountInput: currency input, validation, Calculate button
- AprControl: slider + minus/plus, large APR readout
- AmountTabs: 3 amount pills for selection
- PaymentTable: term rows x amount columns with highlighted column
- SelectedDetails: total paid + total interest for selected scenario

## Non-functional requirements
- Responsiveness: on mobile, stack left panel above right panel
- Accessibility: labels, keyboard navigation, focus states; slider usable with keyboard
- Deterministic math: domain functions unit-tested

## Configuration
Central config file in TypeScript:
- minAmount = 1500
- maxAmount = 100000
- aprMin = 0
- aprMax = 36
- aprStepButtons = 1
- terms = [24, 36, 48, 60]
- compareDelta = 1000

## Deployment
GitHub Pages:
- Build output from Vite
- Base path configured for repo name
- CI workflow runs: install, lint, test, build, deploy
