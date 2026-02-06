---
title: Personal Loan Calculator - Full Implementation
version: 1.0
date_created: 2026-02-06
last_updated: 2026-02-06
---

# Implementation Plan: Personal Loan Calculator

Build a client-side React web application that estimates monthly payments for personal loans. Users can adjust loan amount, APR, and repayment terms to see payment comparisons across different scenarios.

**Key requirements**:
- Currency input with validation ($1,500 - $100,000)
- APR control (0-36%) with slider and step buttons
- Payment comparison table showing 3 amounts × 4 terms
- Calculate button commits amount; APR updates instantly
- Pure domain logic with comprehensive unit tests
- MUI components styled to match product spec

## Architecture and design

### Layer separation
1. **Domain layer** (`src/domain/`): Pure TypeScript functions—no React imports
   - Loan payment calculations (including 0% APR edge case)
   - Currency formatting and parsing
   - Amount validation and clamping
   
2. **Component layer** (`src/components/`): Reusable UI elements
   - Each component receives props, minimal internal state
   - Focused responsibilities (single concern)
   
3. **App layer** (`src/app/`): State orchestration
   - Central state management (React hooks)
   - Derived data computation
   - Event handling coordination

### State model
```typescript
// Primary state
inputAmount: number | null          // User's current input
committedAmount: number              // Last calculated amount (used for table)
apr: number                          // 0-36
selectedAmountIndex: 0 | 1 | 2      // Which tab is active
activeTerm: 24 | 36 | 48 | 60       // Selected row for details

// Derived (computed)
comparisonAmounts: [number, number, number]
paymentGrid: Map<term, Map<amount, payment>>
selectedDetails: { monthlyPayment, totalPaid, totalInterest }
```

### Calculation trigger rules
- **Calculate button**: Commits `inputAmount` → `committedAmount`, recalculates table
- **APR change**: Instantly recalculates table using current `committedAmount`
- **Amount change** (typing): Updates `inputAmount` only, no table update until Calculate

### Tech setup
- **Build**: Vite + React + TypeScript
- **Styling**: Tailwind CSS (utility classes) + MUI (components)
- **Testing**: Vitest (unit tests) + React Testing Library (component tests)
- **Code quality**: ESLint + Prettier (pre-commit or CI)

## Tasks

### Phase 1: Project scaffolding & configuration
- [ ] **1.1** Initialize Vite project with React + TypeScript template
  - Run `npm create vite@latest . -- --template react-ts`
  - Preserve existing docs/ and .github/ folders
- [ ] **1.2** Install core dependencies
  - MUI: `@mui/material @emotion/react @emotion/styled`
  - Tailwind CSS: `tailwindcss postcss autoprefixer`
  - Testing: `vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom`
- [ ] **1.3** Configure Tailwind CSS
  - Run `npx tailwindcss init -p`
  - Update `tailwind.config.js` with content paths
  - Add Tailwind directives to `src/index.css`
- [ ] **1.4** Configure Vitest
  - Create `vitest.config.ts` with jsdom environment
  - Add test scripts to `package.json`
- [ ] **1.5** Configure ESLint + Prettier
  - Extend recommended TypeScript and React rules
  - Add format script
- [ ] **1.6** Create folder structure
  ```
  src/
    app/
      App.tsx
      App.css
    components/
      (empty for now)
    domain/
      (empty for now)
    styles/
      globals.css
  ```

### Phase 2: Domain logic & unit tests
Focus: Pure functions with zero UI dependencies. Full test coverage.

- [ ] **2.1** Create configuration file `src/domain/config.ts`
  - Export constants: `MIN_AMOUNT`, `MAX_AMOUNT`, `APR_MIN`, `APR_MAX`, `APR_STEP`, `TERMS`, `COMPARE_DELTA`
- [ ] **2.2** Implement `src/domain/loanMath.ts`
  - `calculateMonthlyPayment(principal: number, aprPercent: number, termMonths: number): number`
    - Standard amortization formula
    - Handle 0% APR edge case: `principal / termMonths`
    - Return unrounded result
  - `roundToWholeDollars(amount: number): number`
- [ ] **2.3** Unit tests for `loanMath.ts` (Vitest)
  - Test typical APR (e.g., 10%, $10,000, 36 months)
  - Test 0% APR (should equal principal/term)
  - Test edge: 36% APR, 60 months
  - Test rounding: verify whole dollar output
- [ ] **2.4** Implement `src/domain/currency.ts`
  - `parseCurrencyInput(input: string): number | null`
    - Strip `$`, `,`, whitespace
    - Parse to float, return null if invalid
  - `formatCurrency(amount: number): string`
    - Return `$X,XXX` format
- [ ] **2.5** Unit tests for `currency.ts`
  - Parse: "7000", "7,000", "$7,000" → 7000
  - Parse invalid: "abc", "" → null
  - Format: 7000 → "$7,000"
- [ ] **2.6** Implement `src/domain/validation.ts`
  - `validateAmount(amount: number | null, min: number, max: number): { valid: boolean; message?: string }`
  - `clampAmount(amount: number, min: number, max: number): number`
  - `generateComparisonAmounts(committed: number, delta: number, min: number, max: number): [number, number, number]`
    - Return `[committed - delta, committed, committed + delta]` clamped to min/max
    - De-duplicate if clamping creates identical values
- [ ] **2.7** Unit tests for `validation.ts`
  - validateAmount: null, below min, above max, valid
  - clampAmount: below, above, within range
  - generateComparisonAmounts: typical, near boundaries

### Phase 3: Core UI components (unstyled prototypes)
Focus: Functional components with correct props. Minimal styling.

- [ ] **3.1** Create `src/components/LoanAmountInput.tsx`
  - Props: `value: string`, `onChange: (value: string) => void`, `onCalculate: () => void`, `error?: string`, `disabled: boolean`
  - MUI `TextField` with "Calculate" button
  - Show error message below input
- [ ] **3.2** Create `src/components/AprControl.tsx`
  - Props: `apr: number`, `onChange: (apr: number) => void`, `min: number`, `max: number`, `step: number`
  - Large APR display (e.g., "25%")
  - MUI `Slider`
  - Minus/plus buttons using MUI `IconButton`
- [ ] **3.3** Create `src/components/AmountTabs.tsx`
  - Props: `amounts: number[]`, `selectedIndex: number`, `onSelect: (index: number) => void`
  - MUI `Tabs` + `Tab` for each amount
  - Display formatted currency as tab label
- [ ] **3.4** Create `src/components/PaymentTable.tsx`
  - Props: `terms: number[]`, `amounts: number[]`, `payments: Map<term, Map<amount, payment>>`, `selectedIndex: number`, `activeTerm: number`, `onTermSelect: (term: number) => void`
  - Table structure: rows = terms, columns = amounts
  - Highlight column matching `selectedIndex`
  - Clickable rows to set `activeTerm`
- [ ] **3.5** Create `src/components/SelectedDetails.tsx`
  - Props: `amount: number`, `term: number`, `monthlyPayment: number`, `totalPaid: number`, `totalInterest: number`
  - Display: monthly payment, total paid, total interest
  - Show selected amount and term

### Phase 4: App state & wiring
Focus: Integrate components with central state. Implement calculation triggers.

- [ ] **4.1** Build `src/app/App.tsx` state layer
  - State: `inputAmount`, `committedAmount`, `apr`, `selectedAmountIndex`, `activeTerm`
  - Initialize: `committedAmount = 7000`, `apr = 10`, `activeTerm = 36`, `selectedAmountIndex = 1`
- [ ] **4.2** Implement derived data computations
  - `comparisonAmounts` from `committedAmount` using `generateComparisonAmounts`
  - `paymentGrid`: Map of term → Map of amount → payment (using `calculateMonthlyPayment` + `roundToWholeDollars`)
  - `selectedDetails`: compute total paid and interest for selected amount/term
- [ ] **4.3** Wire input handlers
  - `handleAmountChange`: update `inputAmount`, validate
  - `handleCalculate`: copy `inputAmount` → `committedAmount` if valid
  - `handleAprChange`: update `apr` (triggers instant recalculation)
  - `handleAmountTabSelect`: update `selectedAmountIndex`
  - `handleTermSelect`: update `activeTerm`
- [ ] **4.4** Render component tree
  - Left panel: `<LoanAmountInput>` + `<AprControl>`
  - Right panel: `<AmountTabs>` + `<PaymentTable>` + `<SelectedDetails>`
  - Pass props and handlers to each component
- [ ] **4.5** Verify calculation behavior
  - Manual test: change amount, click Calculate → table updates
  - Manual test: change APR → table updates instantly without Calculate
  - Manual test: change amount input → table does NOT update until Calculate

### Phase 5: Styling & layout polish
Focus: Match product spec. Responsive design. Tailwind + MUI theming.

- [ ] **5.1** Apply Tailwind layout utilities
  - Two-column layout on desktop (grid or flex)
  - Stack on mobile (single column)
  - Padding, margins, spacing between components
- [ ] **5.2** Style `<LoanAmountInput>`
  - Material input with currency icon or prefix
  - Error state: red border, error message
  - Calculate button: primary color, disabled state
- [ ] **5.3** Style `<AprControl>`
  - Large APR value (e.g., `text-5xl font-bold`)
  - Slider with custom track/thumb colors
  - Minus/plus buttons: consistent sizing and spacing
- [ ] **5.4** Style `<AmountTabs>`
  - Tab pills with active state
  - Highlight selected tab (background color or underline)
- [ ] **5.5** Style `<PaymentTable>`
  - Table borders, cell padding
  - Highlight selected column (background or border)
  - Hover state on rows
  - Active term indication (bold or checkmark)
- [ ] **5.6** Style `<SelectedDetails>`
  - Card or panel with border
  - Clear labels and values
  - Good visual hierarchy (larger monthly payment)
- [ ] **5.7** Responsive adjustments
  - Mobile: stack left and right panels vertically
  - Tablet: adjust widths
  - Test on viewport widths: 375px, 768px, 1024px

### Phase 6: Testing & validation
Focus: Component tests, integration tests, edge cases.

- [ ] **6.1** Component test: `<LoanAmountInput>`
  - Render and type valid amount → no error
  - Type invalid amount → error message appears, button disabled
  - Click Calculate → onCalculate called
- [ ] **6.2** Component test: `<AprControl>`
  - Render with initial APR
  - Click plus → APR increases by step
  - Click minus → APR decreases by step
  - Change slider → onChange called with new value
- [ ] **6.3** Component test: `<PaymentTable>`
  - Render grid with correct payments
  - Click row → onTermSelect called
  - Verify highlighted column matches selectedIndex
- [ ] **6.4** Integration test: App calculation flow
  - User enters amount, clicks Calculate → table updates
  - User changes APR → table updates without Calculate
  - User enters invalid amount → Calculate disabled
- [ ] **6.5** Edge case testing
  - Amount at min/max boundaries
  - APR at 0% and 36%
  - Comparison amounts clamped correctly
  - De-duplication of identical amounts after clamping

### Phase 7: Accessibility & polish
Focus: Keyboard navigation, ARIA labels, focus management.

- [ ] **7.1** Keyboard navigation
  - Tab through all interactive elements in logical order
  - Enter key triggers Calculate button
  - Arrow keys navigate slider and tabs
- [ ] **7.2** ARIA labels
  - Input field: `aria-label="Loan amount"`
  - Slider: `aria-label="Annual percentage rate"`
  - Tabs: `aria-label` for each amount
  - Table rows: `aria-label` for each term
- [ ] **7.3** Focus management
  - Visible focus indicators (outline or ring)
  - Focus moves logically through form
- [ ] **7.4** Semantic HTML
  - Use `<button>`, `<input>`, `<table>` appropriately
  - Heading hierarchy for sections
- [ ] **7.5** Screen reader testing
  - Test with NVDA/JAWS (Windows) or VoiceOver (Mac)
  - Ensure all interactive elements are announced
  - Ensure calculation results are announced on change

### Phase 8: Documentation & deployment prep
Focus: README, CI/CD, build optimization.

- [ ] **8.1** Update README.md
  - Project description
  - Setup instructions: `npm install`, `npm run dev`
  - Build: `npm run build`
  - Test: `npm test`
  - Tech stack overview
- [ ] **8.2** Add scripts to package.json
  - `dev`: Vite dev server
  - `build`: Production build
  - `preview`: Preview production build
  - `test`: Run Vitest
  - `test:ui`: Vitest UI
  - `lint`: ESLint check
  - `format`: Prettier write
- [ ] **8.3** GitHub Pages deployment setup
  - Create `.github/workflows/deploy.yml`
  - CI: install → lint → test → build → deploy to gh-pages branch
  - Configure Vite base path for repo name
- [ ] **8.4** Optimize bundle
  - Check bundle size with `vite preview` + network tab
  - Code split if needed (lazy load components)
  - Minification + tree-shaking (default in Vite)
- [ ] **8.5** Final QA checklist
  - [ ] All tests pass
  - [ ] No console errors
  - [ ] Works in Chrome, Firefox, Safari, Edge
  - [ ] Responsive on mobile, tablet, desktop
  - [ ] Accessible via keyboard
  - [ ] Calculations match manual verification

## Open questions

1. **APR slider granularity**: Should the slider support fractional APR (e.g., 10.5%) or only whole numbers? The spec mentions "APR step buttons = 1" but doesn't explicitly constrain the slider. 
   - **Recommendation**: Allow slider to use continuous values (0.1 step) for better UX, but buttons increment by 1.

2. **Duplicate amounts handling**: When comparison amounts are clamped and become identical (e.g., inputting $1,500 results in [$1,500, $1,500, $2,500]), should we show 2 tabs or 3?
   - **Recommendation**: Show 3 tabs but visually indicate duplicates or de-duplicate to 2 unique tabs for clarity.

3. **Default term selection**: Should the app pre-select a term (e.g., 36 months) on first load to populate the SelectedDetails panel, or wait for user interaction?
   - **Recommendation**: Default to 36 months (middle option) on load to immediately show a concrete example in the details panel.

---

## Implementation notes

### Recommended task order
Follow phases sequentially, but within Phase 2 (domain logic), implement and test each module before moving to the next. This ensures a solid foundation before building UI.

### Testing strategy
- **Unit tests**: 100% coverage for domain layer (loanMath, currency, validation)
- **Component tests**: Render + user interaction for each component
- **Integration tests**: Full app flow (amount → Calculate → APR change → verify table)
- **Manual tests**: Responsive design, accessibility, cross-browser

### Pairing opportunities
If working in a team, consider pairing on:
- Phase 2: Domain logic (TDD pair programming)
- Phase 5: Styling & layout (design + dev pairing)
- Phase 7: Accessibility (dev + QA pairing)

### Estimated effort (single developer)
- Phase 1: 2-3 hours
- Phase 2: 4-6 hours (TDD is thorough but slow)
- Phase 3: 3-4 hours
- Phase 4: 2-3 hours
- Phase 5: 4-5 hours
- Phase 6: 3-4 hours
- Phase 7: 2-3 hours
- Phase 8: 2-3 hours
- **Total**: 22-31 hours (~3-4 days)

### Dependencies & blockers
- **Blocker**: No known blockers. All tech is well-documented and stable.
- **External**: None. No backend APIs or third-party services.
- **Internal**: Phases 3-8 depend on Phase 2 completion (domain logic).

### Success criteria checklist
- [ ] All unit tests pass (domain layer)
- [ ] All component tests pass (UI layer)
- [ ] Integration test passes (full calculation flow)
- [ ] Manually verified: Calculate commits amount, APR updates instantly
- [ ] Manually verified: Input validation prevents invalid amounts
- [ ] Manually verified: Responsive on mobile, tablet, desktop
- [ ] Manually verified: Keyboard accessible
- [ ] Deployed to GitHub Pages successfully
