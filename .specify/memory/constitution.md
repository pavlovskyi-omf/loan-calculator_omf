<!--
Sync Impact Report:
- Version: 1.0.0 (Initial constitution creation)
- Ratification: 2026-02-10
- Principles established:
  I. Domain Purity
  II. Test-First Development
  III. UI/Logic Separation
  IV. Configuration-Driven Design
  V. Accessibility & User Experience
- Templates requiring validation: ✅ All templates will be validated for alignment
- Follow-up: None (initial creation)
-->

# Personal Loan Calculator Constitution

## Core Principles

### I. Domain Purity
All business logic MUST reside in `src/domain/*` as pure TypeScript functions with zero React dependencies. Domain functions MUST:
- Accept inputs as parameters and return deterministic outputs
- Have no side effects (no I/O, no mutations of external state, no framework imports)
- Be independently testable without UI harness
- Include comprehensive unit tests achieving 100% coverage
- Export explicit TypeScript types for all public function signatures

**Rationale**: Pure domain logic enables confident refactoring, fast test execution, framework independence, and reliable reuse across components or future platforms.

### II. Test-First Development (NON-NEGOTIABLE)
Unit tests for domain logic MUST be written before or alongside implementation. Test coverage gates:
- Domain layer (`src/domain/*`): 100% line and branch coverage REQUIRED
- Component layer (`src/components/*`): Key interaction paths and edge cases tested
- Tests MUST cover: standard cases, boundary conditions (0% APR, min/max amounts), rounding behavior, clamping logic

TDD cycle enforced:
1. Write failing test for new behavior
2. Implement minimal code to pass
3. Refactor while keeping tests green
4. Repeat

**Rationale**: Tests document intent, prevent regressions, and ensure domain correctness which is critical for a financial calculator.

### III. UI/Logic Separation
The application MUST maintain strict layering:
- **Domain layer** (`src/domain/`): Pure functions, calculations, validation, formatting
- **Component layer** (`src/components/`): Presentational components, receive props, minimal internal state, reusable UI elements
- **App layer** (`src/app/`): State orchestration, derived data computation, event handlers, integration of components

Components MUST NOT contain business logic. Calculations, validations, and formatting MUST be delegated to domain functions.

**Rationale**: Clear boundaries make each layer independently testable, enable UI replacement without logic changes, and improve code comprehensibility.

### IV. Configuration-Driven Design
All configuration constants MUST be centralized in `src/domain/config.ts`. No magic numbers or business rules scattered in components. Configuration MUST include:
- Loan amount boundaries (min/max)
- APR range and step values
- Available term options
- Comparison delta for amount tabs
- Validation rules

Hard-coded values in components are FORBIDDEN except for purely presentational concerns (spacing, colors derived from theme).

**Rationale**: Centralized configuration enables quick adjustments without code archaeology, reduces duplication, and documents business rules in one authoritative location.

### V. Accessibility & User Experience
The application MUST be fully accessible and responsive:
- **Keyboard navigation**: All interactive elements accessible via Tab, Enter, Arrow keys
- **ARIA attributes**: Proper labels, roles, and states for screen readers
- **Form validation**: Inline error messages, disabled states for invalid inputs
- **Responsive layout**: Mobile-first design, stacked layout on small screens
- **Visual feedback**: Focus states, hover effects, loading indicators where appropriate
- **Slider accessibility**: Keyboard-operable with arrow keys and screen-reader announcements

**Rationale**: Accessibility is a fundamental requirement, not an afterthought. Responsive design ensures usability across all devices for this demo application.

## Technology Standards

### Required Stack
- **Runtime**: Node.js 18+ LTS
- **Frontend**: React 19+ with TypeScript 5.9+
- **Build**: Vite 7+ (fast dev server, optimized production builds)
- **Styling**: Tailwind CSS 3.4+ for layout/spacing; Material-UI 6+ for primitives (styled to match reference)
- **Testing**: Vitest 2.1+ with React Testing Library 16+
- **Code Quality**: ESLint (errors must be fixed, warnings minimized), Prettier (enforced formatting)

### Technology Constraints
- NO server-side dependencies (client-side only)
- NO external data fetching or authentication
- NO class components (functional components with hooks only)
- NO `any` types (use `unknown` with type narrowing when truly dynamic)
- NO inline styles (use Tailwind utilities or MUI sx prop)

**Rationale**: Consistent tooling reduces onboarding friction, improves build reliability, and ensures modern React best practices.

## Quality Gates

### Pre-Commit Requirements
All code committed MUST pass:
1. **Linting**: `npm run lint` with zero errors
2. **Formatting**: `npm run format` applied
3. **Type checking**: `tsc --noEmit` with zero errors
4. **Unit tests**: `npm test -- --run` with all tests passing
5. **Build validation**: `npm run build` succeeds

### Test Coverage Thresholds
- Domain layer: 100% line, branch, function coverage (enforced)
- Component layer: Key interactions tested (Calculate button, APR updates, input validation)
- Integration: End-to-end user flows validated (amount input → calculate → APR adjust → table updates)

### Code Review Checklist
Pull requests MUST verify:
- [ ] New domain functions include unit tests
- [ ] No React imports in `src/domain/*`
- [ ] Configuration constants used (no magic numbers)
- [ ] TypeScript types explicit for public APIs
- [ ] Accessibility attributes present for new UI elements
- [ ] Mobile responsiveness verified
- [ ] All quality gates passed

**Rationale**: Automated gates prevent technical debt accumulation and ensure consistent code quality across all contributions.

## Governance

### Amendment Process
This constitution is the authoritative source for project standards. Amendments require:
1. Documented rationale for the change
2. Impact assessment on existing code and templates
3. Update to `CONSTITUTION_VERSION` following semantic versioning:
   - **MAJOR**: Breaking changes to principles, removal of constraints
   - **MINOR**: New principles added, expanded guidance
   - **PATCH**: Clarifications, typo fixes, non-semantic refinements
4. Synchronization of dependent templates (`spec-template.md`, `plan-template.md`, `tasks-template.md`)
5. Update of `LAST_AMENDED_DATE` to change date

### Compliance & Review
- All development work MUST align with constitutional principles
- Code reviews MUST explicitly verify compliance
- Violations MUST be flagged and corrected before merge
- Complexity or deviations MUST be justified in PR descriptions
- Unjustified violations will be rejected

### Runtime Guidance
For AI-assisted development, runtime guidance is maintained in `.github/copilot-instructions.md`. This file provides:
- Tactical implementation details
- Common patterns and antipatterns
- Step-by-step deliverable order
- Quick reference for architecture boundaries

The constitution (this document) takes precedence over runtime guidance when conflicts arise.

**Version**: 1.0.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-10
