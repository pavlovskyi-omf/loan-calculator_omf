# Tasks: Dynamic Estimated Monthly Payment Options

**Input**: Design documents from `/specs/001-dynamic-estimated-payment/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Domain layer tests are NON-NEGOTIABLE and MUST achieve 100% coverage per constitution. This feature uses TDD approach.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a React SPA project with domain layer structure:
- Domain: `src/domain/` (pure functions, calculations, validation)
- Components: `src/components/` (presentational UI)
- App: `src/app/` (state orchestration)

---

## Phase 1: User Story 1 - Boundary Value Display (Priority: P1) 🎯 MVP

**Goal**: Implement boundary-aware comparison amounts that shift the displayed loan amount options to meaningful positions when at minimum (1500) or maximum (100000) boundaries.

**Independent Test**: Set loan amount to 1500 and verify options display as [1500*, 2500, 3500]. Set to 100000 and verify [98000, 99000, 100000*]. Set to 5000 and verify [4000, 5000*, 6000].

### Tests for User Story 1 🧪

> **CRITICAL: Domain tests are MANDATORY (100% coverage). Write tests FIRST per TDD constitution principle, ensure they FAIL before implementation**

- [X] T001 [P] [US1] Add test for minimum boundary case (1500 → [1500, 2500, 3500]) in src/domain/validation.test.ts
- [X] T002 [P] [US1] Add test for maximum boundary case (100000 → [98000, 99000, 100000]) in src/domain/validation.test.ts
- [X] T003 [P] [US1] Add test for normal mid-range case (5000 → [4000, 5000, 6000]) in src/domain/validation.test.ts
- [X] T004 [P] [US1] Add test for near-minimum case (2500 → [1500, 2500, 3500]) in src/domain/validation.test.ts
- [X] T005 [P] [US1] Add test for near-maximum case (99000 → [98000, 99000, 100000]) in src/domain/validation.test.ts
- [X] T006 [US1] Run tests to verify they FAIL (TDD red phase) using: npm test src/domain/validation.test.ts

### Implementation for User Story 1

- [X] T007 [US1] Implement boundary detection logic in generateComparisonAmounts function in src/domain/validation.ts
  - Add check for `committed === min` to return `[min, min + delta, min + 2*delta]`
  - Add check for `committed === max` to return `[max - 2*delta, max - delta, max]`
  - Keep existing normal case logic for non-boundary values
- [X] T008 [US1] Run tests to verify they PASS (TDD green phase) using: npm test src/domain/validation.test.ts
- [X] T009 [US1] Verify all existing tests still pass (backward compatibility) using: npm test

### Manual Verification for User Story 1

- [X] T010 [US1] Start dev server and manually test minimum boundary (1500)
  - Action: Set loan amount to 1500, click Calculate
  - Expected: AmountTabs show [1500* (active), 2500, 3500]
  - Expected: Payment table shows three columns for these amounts
- [X] T011 [US1] Manually test maximum boundary (100000)
  - Action: Set loan amount to 100000, click Calculate
  - Expected: AmountTabs show [98000, 99000, 100000* (active)]
  - Expected: Payment table shows three columns for these amounts
- [X] T012 [US1] Manually test normal mid-range case (5000)
  - Action: Set loan amount to 5000, click Calculate
  - Expected: AmountTabs show [4000, 5000* (active), 6000]
  - Expected: Standard behavior maintained (backward compatibility)

**Checkpoint**: At this point, User Story 1 should be fully functional and independently testable. The core boundary logic is complete.

---

## Phase 2: User Story 2 - Dynamic Recalculation (Priority: P2)

**Goal**: Verify that comparison amounts update automatically when loan amount changes, without requiring manual intervention.

**Independent Test**: Change loan amount from 5000 to 1500 and observe automatic update from [4000, 5000*, 6000] to [1500*, 2500, 3500].

**Note**: This user story requires NO implementation - the automatic recalculation is already handled by React's `useMemo` in App.tsx (see plan.md line 42). These tasks verify existing functionality works correctly with the new boundary logic.

### Verification for User Story 2

- [X] T013 [US2] Manually verify dynamic transition from normal to minimum boundary
  - Action: Set loan amount to 5000, Calculate, observe [4000, 5000*, 6000]
  - Action: Change to 1500, Calculate
  - Expected: Options automatically update to [1500*, 2500, 3500] without page refresh
- [X] T014 [US2] Manually verify dynamic transition from normal to maximum boundary
  - Action: Set loan amount to 50000, Calculate, observe [49000, 50000*, 51000]
  - Action: Change to 100000, Calculate
  - Expected: Options automatically update to [98000, 99000, 100000*] without page refresh
- [X] T015 [US2] Verify APR changes trigger instant payment recalculation at boundary
  - Action: Set loan amount to 100000, Calculate (options: [98000, 99000, 100000*])
  - Action: Adjust APR slider from 10% to 15%
  - Expected: Payment table updates instantly without clicking Calculate
  - Expected: AmountTabs remain [98000, 99000, 100000*] (unchanged)

**Checkpoint**: User Story 2 is verified complete. The automatic update behavior works correctly at boundaries.

---

## Phase 3: User Story 3 - Visual Highlighting (Priority: P3)

**Goal**: Verify that the active loan amount option is always visually distinguished from inactive options through consistent styling.

**Independent Test**: Select any loan amount and verify the corresponding option in AmountTabs has distinct visual styling (MUI Tabs active state).

**Note**: This user story requires NO implementation - visual highlighting is already implemented via MUI Tabs `value` prop (see plan.md line 97). These tasks verify existing functionality.

### Verification for User Story 3

- [X] T016 [US3] Verify active tab visual styling at minimum boundary
  - Action: Set loan amount to 1500, Calculate
  - Expected: The 1500 tab has distinct MUI active styling (highlighted/selected appearance)
  - Expected: The 2500 and 3500 tabs have inactive styling
- [X] T017 [US3] Verify active tab visual styling at maximum boundary
  - Action: Set loan amount to 100000, Calculate
  - Expected: The 100000 tab has distinct MUI active styling (highlighted/selected appearance)
  - Expected: The 98000 and 99000 tabs have inactive styling
- [X] T018 [US3] Verify active tab visual styling in normal range
  - Action: Set loan amount to 5000, Calculate
  - Expected: The 5000 tab (middle position) has distinct MUI active styling
  - Expected: Exactly one tab is visually highlighted at all times
- [X] T019 [US3] Verify keyboard navigation and accessibility
  - Action: Use Tab key to navigate to AmountTabs
  - Expected: Focus ring visible on tabs, arrow keys work to switch between tabs
  - Expected: ARIA attributes present (aria-label="Loan amount options")

**Checkpoint**: All user stories (US1, US2, US3) are now complete and verified. The feature is fully functional.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Quality checks and validation across all user stories

- [X] T020 [P] Run full test suite to ensure no regressions: npm test
- [X] T021 [P] Run type checking to ensure TypeScript correctness: npm run build
- [X] T022 [P] Run linting to ensure code quality: npm run lint
- [X] T023 [P] Run code formatting: npm run format
- [X] T024 Validate feature against quickstart.md manual testing scenarios
- [X] T025 Test browser compatibility (Chrome, Firefox, Safari, Edge)
- [X] T026 Verify responsive behavior on mobile viewport (320px, 768px, 1024px)
- [X] T027 Check console for errors or warnings during all test scenarios
- [X] T028 Verify performance: comparison amounts calculation <1ms (check DevTools Performance tab)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1)**: No dependencies - can start immediately (MVP)
- **Phase 2 (US2)**: Depends on Phase 1 completion (verifies US1 logic works with React state)
- **Phase 3 (US3)**: Depends on Phase 1 completion (verifies US1 logic works with MUI styling)
- **Phase 4 (Polish)**: Depends on all desired phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: INDEPENDENT - No dependencies on other stories. Core boundary logic.
- **User Story 2 (P2)**: DEPENDS on US1 - Verifies that US1's boundary logic integrates with React automatic updates
- **User Story 3 (P3)**: DEPENDS on US1 - Verifies that US1's boundary logic works with existing MUI visual highlighting

**Critical Path**: US1 → (US2 + US3 in parallel) → Polish

### Within User Story 1 (Phase 1)

1. **Tests (T001-T005)**: Can all run in PARALLEL (marked [P]) - write all 5 tests simultaneously in describe block
2. **Verify Fail (T006)**: MUST run after tests are written - confirms TDD red phase
3. **Implementation (T007)**: MUST run after tests fail - TDD green phase
4. **Verify Pass (T008)**: MUST run after implementation - confirms tests now pass
5. **Regression Check (T009)**: MUST run after new tests pass - ensures no breaking changes
6. **Manual Testing (T010-T012)**: Can run in PARALLEL after T009 - different test scenarios

### Parallel Opportunities

**Within Phase 1 (User Story 1)**:
```bash
# Write all 5 tests in parallel (T001-T005):
Task: "Add test for minimum boundary case in src/domain/validation.test.ts"
Task: "Add test for maximum boundary case in src/domain/validation.test.ts"  
Task: "Add test for normal mid-range case in src/domain/validation.test.ts"
Task: "Add test for near-minimum case in src/domain/validation.test.ts"
Task: "Add test for near-maximum case in src/domain/validation.test.ts"

# Manual verification scenarios can run together (T010-T012):
Task: "Manually test minimum boundary (1500)"
Task: "Manually test maximum boundary (100000)"
Task: "Manually test normal mid-range (5000)"
```

**Within Phase 4 (Polish)**:
```bash
# All quality checks can run in parallel (T020-T023):
Task: "Run full test suite: npm test"
Task: "Run type checking: npm run build"
Task: "Run linting: npm run lint"  
Task: "Run formatting: npm run format"
```

---

## Parallel Example: User Story 1 Test Writing

```bash
# Launch test writing for all boundary cases simultaneously:
# All 5 tests go in the same describe block but can be written concurrently
# since they're independent test cases with different input/output scenarios

describe('generateComparisonAmounts - boundary logic', () => {
  test('minimum boundary') { ... }      # T001
  test('maximum boundary') { ... }      # T002
  test('normal mid-range') { ... }      # T003
  test('near-minimum') { ... }          # T004
  test('near-maximum') { ... }          # T005
})
```

---

## Implementation Strategy

### TDD Approach (Constitutional Requirement)

1. **Red Phase**: Write all 5 tests (T001-T005), run tests to verify they FAIL (T006)
2. **Green Phase**: Implement boundary logic (T007), run tests to verify they PASS (T008)
3. **Refactor Phase**: Verify no regressions (T009), perform manual testing (T010-T012)

### MVP First (User Story 1 Only)

1. Complete Phase 1: User Story 1 (Tasks T001-T012)
2. **STOP and VALIDATE**: Test US1 independently (minimum/maximum/normal boundaries work)
3. Deploy/demo if ready - core feature is complete

### Incremental Delivery

1. **MVP**: User Story 1 → Boundary logic works → Deploy (Tasks T001-T012)
2. **Enhanced**: Add User Story 2 verification → Automatic updates confirmed → Deploy (Tasks T013-T015)
3. **Complete**: Add User Story 3 verification → Visual styling confirmed → Deploy (Tasks T016-T019)
4. **Polished**: Quality checks → Production-ready → Deploy (Tasks T020-T028)

### Single Developer Strategy

**Estimated Time**: 30-45 minutes total

1. **10-15 min**: Write all 5 tests (T001-T005), verify they fail (T006)
2. **5-10 min**: Implement boundary logic (T007), verify tests pass (T008-T009)
3. **5-10 min**: Manual browser testing (T010-T012)
4. **5-10 min**: Verification of US2 and US3 (T013-T019)
5. **5 min**: Quality checks (T020-T024)

---

## Notes

- [P] tasks = different files or independent scenarios, no dependencies between them
- [Story] label maps task to specific user story (US1, US2, US3) for traceability
- Each user story should be independently completable and testable
- **User Story 1** is the ONLY story requiring code changes (domain function modification)
- **User Stories 2 & 3** are verification-only (features already exist, just need confirmation)
- This is a surgical feature - only 1 function in 1 file needs modification
- Tests are written BEFORE implementation (TDD constitutional requirement)
- Stop at Phase 1 checkpoint for MVP (boundary logic complete and functional)
- Phases 2-3 add verification but no new code (automatic updates and visual styling already work)

---

## File Modifications Summary

**Files MODIFIED**:
1. `src/domain/validation.ts` - Add boundary detection to `generateComparisonAmounts` function (Task T007)
2. `src/domain/validation.test.ts` - Add 5 new tests in describe block (Tasks T001-T005)
3. `src/app/App.tsx` - Add `useEffect` to sync `selectedAmountIndex` with committed amount position (Bug fix)
4. `eslint.config.js` - Update `globalIgnores` to exclude build artifacts (.vite, node_modules, etc.)

**Files UNCHANGED**:
- `src/components/AmountTabs.tsx` - Already handles dynamic amounts and visual highlighting
- `src/domain/config.ts` - Constants already defined (MIN_AMOUNT, MAX_AMOUNT, COMPARE_DELTA)
- All other component and domain files remain untouched

**Total Code Changes**: ~20 lines of test code + ~10 lines of domain implementation + ~8 lines of state sync = ~38 lines total

---

## Quickstart Reference

For detailed implementation instructions, see [quickstart.md](quickstart.md):
- Step-by-step TDD implementation guide
- Exact test code to add
- Exact implementation code to add
- Manual testing procedures
- Troubleshooting guide
- Performance validation steps
