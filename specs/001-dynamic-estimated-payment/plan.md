# Implementation Plan: Dynamic Estimated Monthly Payment Options

**Branch**: `001-dynamic-estimated-payment` | **Date**: 2026-02-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-dynamic-estimated-payment/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Modify the `generateComparisonAmounts` function in `src/domain/validation.ts` to dynamically adjust the three displayed loan amount options based on boundary conditions. When the committed amount is at minimum (1500), display [1500, 2500, 3500]. When at maximum (100000), display [98000, 99000, 100000]. For non-boundary values, maintain the current behavior of [amount-1000, amount, amount+1000]. This ensures users always see relevant comparison options at boundary cases while maintaining the existing component structure and state management.

## Technical Context

**Language/Version**: TypeScript 5.9+ with React 19.2.0  
**Primary Dependencies**: React, Material-UI 6.3.0, Vite 7+  
**Storage**: N/A (client-side only, no persistence)  
**Testing**: Vitest 2.1+ with React Testing Library 16+  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: React SPA (single-page application) with domain layer  
**Performance Goals**: <100ms response time for amount changes, instant UI updates  
**Constraints**: Pure functions in domain layer (no React dependencies), 100% domain test coverage, client-side only  
**Scale/Scope**: Single-feature enhancement to existing loan calculator app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Domain Purity**: ✅
- [x] All business logic in pure functions (no framework dependencies)
  - Modification to `generateComparisonAmounts` remains a pure function
  - Takes primitive inputs (amount, delta, min, max), returns tuple
  - No React imports or framework dependencies
- [x] Domain functions independently testable
  - Can test boundary logic with simple function calls
  - No UI harness required for validation
- [x] Explicit TypeScript types for public APIs
  - Return type: `[number, number, number]` (tuple)
  - All parameters explicitly typed

**Test-First Development**: ✅  
- [x] Domain layer has 100% test coverage plan
  - Add tests for minimum boundary (1500 → [1500, 2500, 3500])
  - Add tests for maximum boundary (100000 → [98000, 99000, 100000])
  - Add tests for normal cases (e.g., 5000 → [4000, 5000, 6000])
  - Add tests for near-boundary cases (e.g., 2500, 99000)
  - Existing test file: `src/domain/validation.test.ts`
- [x] Tests written before/alongside implementation
  - TDD approach: write failing tests first, then implement
- [x] Edge cases and boundary conditions covered
  - Minimum (1500), maximum (100000), near-boundaries, normal range

**UI/Logic Separation**: ✅
- [x] Clear layer boundaries (domain/component/app)
  - Domain: `generateComparisonAmounts` (calculation)
  - Component: `AmountTabs` (presentation, unchanged)
  - App: `App.tsx` (orchestration, unchanged)
- [x] Components delegate to domain functions
  - App.tsx already calls `generateComparisonAmounts` 
  - No changes to component delegation pattern
- [x] No business logic in UI components
  - AmountTabs remains presentational
  - All logic stays in domain layer

**Configuration-Driven**: ✅
- [x] Constants centralized in config
  - Uses existing `MIN_AMOUNT`, `MAX_AMOUNT`, `COMPARE_DELTA` from `src/domain/config.ts`
  - No new configuration needed
- [x] No magic numbers in components
  - All boundary values sourced from config
  - Function receives min/max as parameters
- [x] Business rules documented in config
  - Boundary values (1500, 100000) already documented
  - Delta value (1000) already centralized

**Accessibility & UX**: ✅
- [x] Keyboard navigation planned
  - No changes needed; AmountTabs already uses MUI Tabs with keyboard support
- [x] ARIA attributes for screen readers
  - Existing `aria-label="Loan amount options"` maintained
  - Active tab state already communicated via MUI
- [x] Responsive design considerations
  - AmountTabs uses `variant="fullWidth"` (already responsive)
  - No layout changes required
- [x] Form validation with inline feedback
  - N/A for this feature (no form inputs changed)

**Overall Assessment**: ✅ PASS - No constitutional violations. Feature implementation aligns with all five core principles.

## Project Structure

### Documentation (this feature)

```text
specs/001-dynamic-estimated-payment/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (boundary logic patterns)
├── data-model.md        # Phase 1 output (comparison amounts entity)
├── quickstart.md        # Phase 1 output (how to test the feature)
├── contracts/           # Phase 1 output (TypeScript function signatures)
│   └── generateComparisonAmounts.ts
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
src/
├── domain/                    # Pure functions: calculations, validation, formatting
│   ├── config.ts              # [EXISTING] Configuration constants
│   ├── validation.ts          # [MODIFY] Contains generateComparisonAmounts
│   ├── validation.test.ts     # [MODIFY] Add boundary tests
│   ├── loanMath.ts            # [EXISTING] Payment calculations (unchanged)
│   ├── loanMath.test.ts       # [EXISTING] (unchanged)
│   ├── currency.ts            # [EXISTING] Formatting (unchanged)
│   └── currency.test.ts       # [EXISTING] (unchanged)
│
├── components/                # Presentational UI components
│   ├── AmountTabs.tsx         # [EXISTING] Renders options (unchanged)
│   ├── LoanAmountInput.tsx    # [EXISTING] (unchanged)
│   ├── AprControl.tsx         # [EXISTING] (unchanged)
│   ├── PaymentTable.tsx       # [EXISTING] (unchanged)
│   └── SelectedDetails.tsx    # [EXISTING] (unchanged)
│
└── app/                       # State orchestration, integration
    └── App.tsx                # [EXISTING] Uses generateComparisonAmounts (unchanged)
```

**Structure Decision**: This feature uses the existing React SPA with domain layer structure (Option 4 from template). The modification is isolated to the domain layer (`src/domain/validation.ts` and its test), with no changes required to components or app orchestration. This maintains architectural boundaries and ensures testability.

## Complexity Tracking

> **No violations detected** - All constitutional principles satisfied. No complexity justification required.

---

## Phase 0: Research & Technical Discovery

**Objective**: Resolve all technical unknowns and establish implementation patterns for boundary logic in calculation functions.

### Research Tasks

1. **Review existing comparison amounts logic**
   - Question: How does the current `generateComparisonAmounts` function work?
   - Finding: Currently returns `[committed-delta, committed, committed+delta]` with clamping
   - Implication: Need to add boundary detection and special-case logic

2. **Boundary detection patterns**
   - Question: How should we detect when a value is at minimum or maximum boundary?
   - Decision: Direct equality check (`committed === min` or `committed === max`)
   - Rationale: Simple, explicit, no floating-point issues with integer amounts
   - Alternative considered: Threshold-based detection (within epsilon) - rejected as unnecessarily complex for integer amounts

3. **Test coverage strategy**
   - Question: What test cases ensure correctness?
   - Decision: Test minimum boundary, maximum boundary, near-boundaries, and normal range
   - Test cases identified:
     - `amount = 1500` → `[1500, 2500, 3500]`
     - `amount = 100000` → `[98000, 99000, 100000]`
     - `amount = 2500` → `[1500, 2500, 3500]` (near-min, standard behavior)
     - `amount = 99000` → `[98000, 99000, 100000]` (near-max, standard behavior)
     - `amount = 5000` → `[4000, 5000, 6000]` (normal case)

4. **Backward compatibility**
   - Question: Will changes break existing behavior for non-boundary cases?
   - Finding: No - standard cases maintain `[amount-delta, amount, amount+delta]` behavior
   - Implication: App.tsx and AmountTabs.tsx require no changes

### Research Summary

**Key Findings**:
- Feature is a surgical modification to one domain function
- Boundary logic requires three code paths: (1) at minimum, (2) at maximum, (3) normal
- No new dependencies or patterns needed
- Existing test infrastructure sufficient (Vitest + domain test files)

**Decision Log**:
- **Boundary detection**: Use exact equality comparison (`===`)
- **Return format**: Maintain existing `[number, number, number]` tuple type
- **Test location**: Add tests to existing `src/domain/validation.test.ts`
- **No changes needed**: Components, App orchestration, configuration

**Output Artifact**: [research.md](research.md)

---

## Phase 1: Design & Contracts

**Objective**: Define data structures, function signatures, and implementation approach.

### Data Model

**Entity: Comparison Amounts**
- Represents the three loan amount options displayed to users
- Structure: Tuple of three numbers `[low, mid, high]`
- Constraints:
  - All values must be within `[MIN_AMOUNT, MAX_AMOUNT]`
  - Middle value must equal the committed amount
  - At minimum boundary: `[min, min+1000, min+2000]`
  - At maximum boundary: `[max-2000, max-1000, max]`
  - Normal case: `[committed-delta, committed, committed+delta]`

**Output Artifact**: [data-model.md](data-model.md)

### Contracts

**Function Signature** (modified):

```typescript
/**
 * Generate three comparison amounts for the payment table.
 * 
 * Boundary Behavior:
 * - At minimum (1500): returns [1500, 2500, 3500]
 * - At maximum (100000): returns [98000, 99000, 100000]
 * - Normal case: returns [committed-delta, committed, committed+delta]
 * 
 * @param committed - The committed loan amount
 * @param delta - The difference to add/subtract (typically 1000)
 * @param min - Minimum allowed amount (1500)
 * @param max - Maximum allowed amount (100000)
 * @returns Array of three amounts: [low, committed, high] (or boundary-adjusted)
 * 
 * @example
 * // At minimum boundary
 * generateComparisonAmounts(1500, 1000, 1500, 100000) 
 * // Returns: [1500, 2500, 3500]
 * 
 * @example
 * // At maximum boundary
 * generateComparisonAmounts(100000, 1000, 1500, 100000)
 * // Returns: [98000, 99000, 100000]
 * 
 * @example
 * // Normal case
 * generateComparisonAmounts(5000, 1000, 1500, 100000)
 * // Returns: [4000, 5000, 6000]
 */
export function generateComparisonAmounts(
  committed: number,
  delta: number,
  min: number,
  max: number
): [number, number, number]
```

**Output Artifact**: [contracts/generateComparisonAmounts.ts](contracts/generateComparisonAmounts.ts)

### Implementation Approach

1. **Modify `generateComparisonAmounts` function**:
   - Add boundary detection (check if `committed === min` or `committed === max`)
   - If at minimum: return `[min, min + delta, min + 2*delta]`
   - If at maximum: return `[max - 2*delta, max - delta, max]`
   - Otherwise: return existing logic `[clamp(committed - delta), committed, clamp(committed + delta)]`

2. **Update test file** (`src/domain/validation.test.ts`):
   - Add `describe` block for boundary logic
   - Test minimum boundary case
   - Test maximum boundary case
   - Test near-boundary cases (to ensure they use normal logic)
   - Verify existing tests still pass (backward compatibility)

3. **No component changes required**:
   - `AmountTabs.tsx` already handles dynamic amounts array
   - `App.tsx` already calls `generateComparisonAmounts` correctly
   - Visual highlighting already implemented via MUI Tabs `value` prop

### Quickstart Guide

**How to test this feature**:

1. **Manual testing**:
   ```bash
   npm run dev
   ```
   - Set loan amount to 1500 → verify tabs show [1500*, 2500, 3500]
   - Set loan amount to 100000 → verify tabs show [98000, 99000, 100000*]
   - Set loan amount to 5000 → verify tabs show [4000, 5000*, 6000]

2. **Automated testing**:
   ```bash
   npm test src/domain/validation.test.ts
   ```
   - All boundary tests should pass
   - Existing validation tests should remain green

**Output Artifact**: [quickstart.md](quickstart.md)

---

## Phase 2: Task Generation

**Objective**: Break down implementation into actionable, dependency-ordered tasks.

**Note**: Task generation is performed by the `/speckit.tasks` command, NOT by `/speckit.plan`. This phase serves as a placeholder to indicate that task breakdown will follow this planning phase.

**Expected Task Structure** (preview):
1. Write failing tests for minimum boundary case
2. Write failing tests for maximum boundary case
3. Write failing tests for near-boundary cases
4. Implement boundary detection logic in `generateComparisonAmounts`
5. Verify all tests pass (TDD green phase)
6. Manual testing in browser (dev server)
7. Code review and merge

**Output Artifact**: `tasks.md` (generated by `/speckit.tasks` command)

---

## Constitution Re-Check (Post-Design)

**Re-evaluation after Phase 1 design**:

- **Domain Purity**: ✅ Maintained - function remains pure with no framework dependencies
- **Test-First Development**: ✅ Maintained - TDD approach with boundary tests
- **UI/Logic Separation**: ✅ Maintained - no component changes required
- **Configuration-Driven**: ✅ Maintained - uses existing config constants
- **Accessibility & UX**: ✅ Maintained - no accessibility impact

**Final Gate Status**: ✅ PASS - Design maintains all constitutional principles. Ready for task generation and implementation.
