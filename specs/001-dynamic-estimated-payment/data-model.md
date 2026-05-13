# Data Model: Dynamic Estimated Monthly Payment Options

**Phase**: Phase 1 - Design  
**Date**: 2026-02-10  
**Feature**: [Dynamic Estimated Monthly Payment Options](spec.md)

## Entities

### Comparison Amounts

**Description**: A set of three loan amount values displayed to users for comparing monthly payment options. The amounts dynamically adjust based on the currently committed loan amount and boundary conditions.

**Type**: Value tuple - `[number, number, number]`

**Constraints**:
- Must contain exactly three numeric values
- All values must be within valid loan amount range: `[MIN_AMOUNT, MAX_AMOUNT]` = `[1500, 100000]`
- Values should be distinct (no duplicates) when possible
- Middle value position semantics:
  - At minimum boundary: committed value appears at index 0 (start)
  - At maximum boundary: committed value appears at index 2 (end)
  - Normal case: committed value appears at index 1 (middle)

**Calculation Rules**:

| Condition | Formula | Example (delta=1000) |
|-----------|---------|----------------------|
| `committed === MIN_AMOUNT` | `[min, min + delta, min + 2*delta]` | `[1500, 2500, 3500]` |
| `committed === MAX_AMOUNT` | `[max - 2*delta, max - delta, max]` | `[98000, 99000, 100000]` |
| Normal case | `[committed - delta, committed, committed + delta]` | `[4000, 5000, 6000]` |

**State Diagram**:

```
                    ┌─────────────────────┐
                    │  Committed Amount   │
                    │     (1500-100000)   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼───────┐ ┌───▼───────┐ ┌───▼────────┐
        │ At Minimum?   │ │ At Maximum?│ │ Normal?    │
        │ (== 1500)     │ │ (== 100000)│ │ (other)    │
        └───────┬───────┘ └─────┬─────┘ └─────┬──────┘
                │               │              │
                ▼               ▼              ▼
        ┌───────────────┐ ┌────────────┐ ┌──────────────┐
        │ [1500,        │ │ [98000,    │ │ [amount-1000,│
        │  2500,        │ │  99000,    │ │  amount,     │
        │  3500]        │ │  100000]   │ │  amount+1000]│
        └───────────────┘ └────────────┘ └──────────────┘
```

**Domain Invariants**:
1. `amounts[0] >= MIN_AMOUNT` (low boundary respected)
2. `amounts[2] <= MAX_AMOUNT` (high boundary respected)
3. `amounts[0] < amounts[1] < amounts[2]` when possible (monotonic increase)
4. At least one amount equals the committed amount (active selection)

**Examples**:

```typescript
// Minimum boundary
const committed = 1500
const amounts = [1500, 2500, 3500]
// Active tab: index 0 (first position)

// Maximum boundary  
const committed = 100000
const amounts = [98000, 99000, 100000]
// Active tab: index 2 (last position)

// Normal mid-range
const committed = 5000
const amounts = [4000, 5000, 6000]
// Active tab: index 1 (middle position)

// Near minimum (standard logic applies)
const committed = 2500
const amounts = [1500, 2500, 3500]
// Active tab: index 1 (middle position)

// Near maximum (standard logic applies)
const committed = 99000
const amounts = [98000, 99000, 100000]
// Active tab: index 1 (middle position)
```

---

## Relationships

### Comparison Amounts → Committed Amount

**Relationship**: Derived from / Depends on  
**Cardinality**: 1 committed amount : 3 comparison amounts  
**Description**: The comparison amounts tuple is derived from the committed amount using boundary-aware logic. The committed amount is always present in the tuple.

**Derivation Function**: `generateComparisonAmounts(committed, delta, min, max)`

---

### Comparison Amounts → Payment Grid

**Relationship**: Input to  
**Cardinality**: 3 amounts : M×N payments (M amounts × N terms)  
**Description**: Each comparison amount is used to calculate monthly payments across all available loan terms (24, 36, 48, 60 months). The payment grid is recalculated whenever comparison amounts change.

**Usage in App**:
```typescript
const paymentGrid = useMemo(() => {
  const grid = new Map<number, Map<number, number>>()
  for (const term of TERMS) {
    const termMap = new Map<number, number>()
    for (const amount of comparisonAmounts) {  // <-- Uses comparison amounts
      const payment = calculateMonthlyPayment(amount, apr, term)
      termMap.set(amount, roundToWholeDollars(payment))
    }
    grid.set(term, termMap)
  }
  return grid
}, [comparisonAmounts, apr])
```

---

### Comparison Amounts → Amount Tabs (UI)

**Relationship**: Renders as  
**Cardinality**: 3 amounts : 3 tabs  
**Description**: Each comparison amount is rendered as a selectable tab in the AmountTabs component. The tab corresponding to the committed amount is visually highlighted.

**Component Interface**:
```typescript
<AmountTabs
  amounts={comparisonAmounts}           // [low, mid, high]
  selectedIndex={selectedAmountIndex}    // 0, 1, or 2
  onSelect={(index) => { ... }}
/>
```

---

## Data Flow

```
User Action (adjust loan amount)
    ↓
Update committed amount
    ↓
generateComparisonAmounts(committed, delta, min, max)
    ↓
[low, mid, high] comparison amounts tuple
    ↓
    ├─→ Render AmountTabs (visual display)
    └─→ Calculate Payment Grid (monthly payments for all terms)
            ↓
        Render PaymentTable (comparison matrix)
```

---

## Validation Rules

### Input Validation (committed amount)
- Must be a number (not null, not NaN, not undefined)
- Must be >= `MIN_AMOUNT` (1500)
- Must be <= `MAX_AMOUNT` (100000)
- Should be an integer (no fractional cents)

### Output Validation (comparison amounts)
- Must return exactly 3 values
- All values must be numbers (not null, not NaN)
- All values must be within `[MIN_AMOUNT, MAX_AMOUNT]`
- At least one value must equal the committed amount
- Values should be in ascending order: `amounts[0] <= amounts[1] <= amounts[2]`

---

## Testing Checklist

**Unit Tests** (domain layer):
- [ ] Minimum boundary (1500) → `[1500, 2500, 3500]`
- [ ] Maximum boundary (100000) → `[98000, 99000, 100000]`
- [ ] Normal case (5000) → `[4000, 5000, 6000]`
- [ ] Near-minimum (2500) → `[1500, 2500, 3500]` (standard logic)
- [ ] Near-maximum (99000) → `[98000, 99000, 100000]` (standard logic)
- [ ] Values stay within bounds (no negative, no exceeding max)

**Integration Tests** (component layer):
- [ ] AmountTabs renders 3 tabs for any committed amount
- [ ] Active tab highlights the committed amount
- [ ] Tab selection updates the selected amount index

**End-to-End Tests** (user flows):
- [ ] Set amount to 1500 → see options [1500*, 2500, 3500]
- [ ] Set amount to 100000 → see options [98000, 99000, 100000*]
- [ ] Change amount from 5000 to 1500 → see options update automatically
- [ ] Click on different amount tabs → payment table updates

---

## Configuration

**Constants** (from `src/domain/config.ts`):
- `MIN_AMOUNT = 1500` - Minimum loan amount boundary
- `MAX_AMOUNT = 100000` - Maximum loan amount boundary
- `COMPARE_DELTA = 1000` - Delta between comparison amounts

**Design Decision**: Delta is fixed at 1000 for simplicity. Future enhancement could make delta dynamic (e.g., 5% of committed amount) if needed.

---

## Performance Considerations

**Recalculation Frequency**: Comparison amounts recalculated on every committed amount change
- Frequency: Typically 1-10 times per user session (each "Calculate" button click)
- Complexity: O(1) - three simple arithmetic operations
- Impact: Negligible (<1ms)

**Memoization**: Already implemented in `App.tsx` via `useMemo`
```typescript
const comparisonAmounts = useMemo(
  () => generateComparisonAmounts(committedAmount, COMPARE_DELTA, MIN_AMOUNT, MAX_AMOUNT),
  [committedAmount]
)
```

**Optimization**: No further optimization needed. Function is pure and deterministic.
