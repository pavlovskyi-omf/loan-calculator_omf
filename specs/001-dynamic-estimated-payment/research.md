# Research: Dynamic Estimated Monthly Payment Options

**Phase**: Phase 0 - Technical Discovery  
**Date**: 2026-02-10  
**Feature**: [Dynamic Estimated Monthly Payment Options](spec.md)

## Research Questions & Findings

### 1. Current Implementation Analysis

**Question**: How does the existing `generateComparisonAmounts` function work?

**Investigation**:
- Located in: `src/domain/validation.ts` (lines 68-79)
- Current logic:
  ```typescript
  const low = clampAmount(committed - delta, min, max)
  const mid = committed
  const high = clampAmount(committed + delta, min, max)
  return [low, mid, high]
  ```
- Behavior: Subtracts/adds delta, clamps to min/max range
- Problem: At boundaries, clamping creates duplicates
  - At min (1500): returns `[1500, 1500, 2500]` instead of `[1500, 2500, 3500]`
  - At max (100000): returns `[99000, 100000, 100000]` instead of `[98000, 99000, 100000]`

**Conclusion**: Need to add boundary detection and special-case logic to produce distinct values at limits.

---

### 2. Boundary Detection Strategy

**Question**: How should we detect when a value is at minimum or maximum boundary?

**Options Considered**:

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| Exact equality (`===`) | Simple, explicit, no ambiguity | None for integer values | ✅ **SELECTED** |
| Threshold-based (`<= min + epsilon`) | Handles floating-point drift | Unnecessary complexity for integers, arbitrary epsilon | ❌ Rejected |
| Try-catch clamping | Detect duplicate results post-clamp | Inefficient, obscures intent | ❌ Rejected |

**Decision**: Use direct equality comparison
- Rationale: Loan amounts are integers, no floating-point precision issues
- Implementation: `if (committed === min)` and `if (committed === max)`
- Clarity: Intent is immediately obvious to code reviewers

**Code Pattern**:
```typescript
if (committed === min) {
  return [min, min + delta, min + 2 * delta]
}
if (committed === max) {
  return [max - 2 * delta, max - delta, max]
}
// Normal case
return [clampAmount(committed - delta, min, max), committed, clampAmount(committed + delta, min, max)]
```

---

### 3. Test Coverage Strategy

**Question**: What test cases ensure correctness across all scenarios?

**Test Matrix**:

| Scenario | Input Amount | Expected Output | Rationale |
|----------|--------------|-----------------|-----------|
| Minimum boundary | 1500 | `[1500, 2500, 3500]` | Active at start of list |
| Maximum boundary | 100000 | `[98000, 99000, 100000]` | Active at end of list |
| Near minimum | 2500 | `[1500, 2500, 3500]` | Standard logic (not boundary case) |
| Near maximum | 99000 | `[98000, 99000, 100000]` | Standard logic (not boundary case) |
| Normal mid-range | 5000 | `[4000, 5000, 6000]` | Standard delta logic |
| Normal mid-range | 50000 | `[49000, 50000, 51000]` | Standard delta logic |

**Coverage Goals**:
- ✅ Boundary conditions (min/max)
- ✅ Near-boundary conditions (ensure normal logic applies)
- ✅ Normal range scenarios (backward compatibility)
- ✅ Edge case: Resulting values stay within bounds

**Test Implementation Plan**:
- Location: Add to existing `src/domain/validation.test.ts`
- Structure: New `describe('generateComparisonAmounts - boundary logic', () => {...})`
- Assertions: Use `expect(result).toEqual([expected1, expected2, expected3])`

---

### 4. Backward Compatibility Analysis

**Question**: Will changes break existing behavior for non-boundary cases?

**Analysis**:
- **Component Impact**: None
  - `AmountTabs.tsx` receives `amounts: number[]` prop (unchanged interface)
  - `App.tsx` calls `generateComparisonAmounts` with same signature (unchanged)
- **Behavior Impact**: Zero for normal cases
  - Normal range values (e.g., 5000) continue to produce `[4000, 5000, 6000]`
  - Only boundary cases (1500, 100000) get new behavior
- **Type Safety**: Maintained
  - Return type remains `[number, number, number]` tuple
  - All callsites continue to work without modification

**Verification**:
- Run existing test suite: `npm test` (all tests should pass after implementation)
- Manual smoke test: Load app with amount=5000, verify standard behavior

**Conclusion**: ✅ Changes are backward compatible. No breaking changes to API or component contracts.

---

### 5. Alternative Approaches Considered

**Question**: Are there alternative implementations that would be simpler or more maintainable?

**Alternatives Evaluated**:

#### Option A: Modify at App Layer Instead of Domain
- **Approach**: Keep `generateComparisonAmounts` unchanged, add boundary logic in `App.tsx`
- **Pros**: Domain function stays simple
- **Cons**: Violates domain purity principle, logic harder to test, duplicates boundary knowledge
- **Decision**: ❌ Rejected - Violates constitutional principle II (UI/Logic Separation)

#### Option B: Separate Function for Boundary Detection
- **Approach**: Create `isBoundaryAmount(amount, min, max): boolean` helper
- **Pros**: Single Responsibility Principle, testable in isolation
- **Cons**: Adds function for trivial logic, over-engineering
- **Decision**: ⚠️ Consider for future refactoring if more boundary types emerge, but not needed for initial implementation

#### Option C: Configuration-Driven Boundary Values
- **Approach**: Define `[1500, 2500, 3500]` and `[98000, 99000, 100000]` in config
- **Pros**: Easy to change boundary values
- **Cons**: Hardcodes specific values, loses algorithmic flexibility, doesn't scale to different deltas
- **Decision**: ❌ Rejected - Less flexible than algorithmic approach

**Selected Approach**: Algorithmic boundary detection within `generateComparisonAmounts` (inline logic)
- Balances simplicity with flexibility
- Keeps related logic co-located
- Maintains single source of truth for comparison amounts

---

## Research Summary

### Key Technical Decisions

1. **Boundary Detection**: Direct equality check (`committed === min` or `committed === max`)
2. **Return Format**: Maintain `[number, number, number]` tuple type for backward compatibility
3. **Test Location**: Extend existing `src/domain/validation.test.ts` with boundary test suite
4. **Implementation Scope**: Surgical modification to one domain function, no component changes

### Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Boundary logic has off-by-one errors | Low | Medium | Comprehensive test coverage with exact value assertions |
| Breaking existing normal-case behavior | Very Low | High | Run full test suite, manual smoke testing |
| Performance degradation from extra conditionals | Very Low | Low | Two additional equality checks (~negligible overhead) |

### Dependencies & Assumptions

**Dependencies**:
- Existing `MIN_AMOUNT` and `MAX_AMOUNT` constants in `src/domain/config.ts`
- Existing `COMPARE_DELTA` constant (1000)
- Existing `clampAmount` helper function (for normal cases)

**Assumptions**:
- Loan amounts are always integers (no floating-point precision issues)
- Delta value (1000) is appropriate for boundary spacing (1500→2500→3500)
- Three options are always displayed (not dynamic count)
- Boundary values (1500, 100000) won't change frequently

### Next Steps

✅ **Phase 0 Complete** - Ready to proceed to Phase 1 (Design & Contracts)

**Artifacts to Generate in Phase 1**:
- `data-model.md` - Document Comparison Amounts entity structure
- `contracts/generateComparisonAmounts.ts` - Updated function signature with JSDoc
- `quickstart.md` - Testing instructions for developers
