# Feature Specification: Dynamic Estimated Monthly Payment Options

**Feature Branch**: `001-dynamic-estimated-payment`  
**Created**: 2026-02-10  
**Status**: Draft  
**Input**: User description: "Dynamic Adjustment of Estimated Monthly Payment Options - When the Loan Amount reaches its defined minimum or maximum value, the system should dynamically shift the available Estimated Monthly Payment options to ensure that the selected value appears either at the beginning or at the end of the list, improving usability and clarity."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Boundary Value Display (Priority: P1)

When a user adjusts the loan amount to the minimum or maximum boundary, the system automatically shifts the estimated monthly payment options so that the selected amount is always visible and positioned appropriately (at the start or end of the list).

**Why this priority**: This is the core functionality of the feature - ensuring users always see relevant payment options at boundary values. Without this, the UI could display confusing or misleading payment options when amounts are at their limits.

**Independent Test**: Can be fully tested by setting loan amount to 1500 (minimum) and verifying the options display as [1500*, 2500, 3500], then setting to 100000 (maximum) and verifying [98000, 99000, 100000*]. Delivers value by ensuring boundary cases are handled gracefully.

**Acceptance Scenarios**:

1. **Given** the loan amount is set to the minimum value (1500), **When** the estimated monthly payment options are displayed, **Then** the list shows 1500 (active), 2500, 3500
2. **Given** the loan amount is set to the maximum value (100000), **When** the estimated monthly payment options are displayed, **Then** the list shows 98000, 99000, 100000 (active)
3. **Given** the loan amount is at any value between minimum and maximum (normal case), **When** the estimated monthly payment options are displayed, **Then** the list shows amount-1000, amount, amount+1000 with the middle value active

---

### User Story 2 - Dynamic Recalculation (Priority: P2)

As a user adjusts the loan amount slider or inputs a new value, the estimated monthly payment options update automatically without requiring manual intervention, ensuring the displayed options remain relevant and accurate.

**Why this priority**: Automatic updates enhance user experience by providing immediate feedback. This is secondary to the boundary display logic but essential for a seamless interaction.

**Independent Test**: Can be tested by changing the loan amount from 5000 to 1500 and observing that the options shift automatically from [4000, 5000*, 6000] to [1500*, 2500, 3500]. Delivers value by eliminating manual refresh requirements.

**Acceptance Scenarios**:

1. **Given** the loan amount is currently 5000 with options [4000, 5000*, 6000], **When** the user changes the amount to 1500, **Then** the options automatically update to [1500*, 2500, 3500]
2. **Given** the loan amount is currently 50000 with options [49000, 50000*, 51000], **When** the user changes the amount to 100000, **Then** the options automatically update to [98000, 99000, 100000*]
3. **Given** the loan amount is being adjusted, **When** the value changes, **Then** no manual refresh or button click is required to see updated options

---

### User Story 3 - Visual Highlighting (Priority: P3)

The active loan amount value is always visually distinguished from the other options through consistent styling (e.g., bolding, background color, or border), making it immediately clear which value is currently selected.

**Why this priority**: Visual feedback improves usability and reduces confusion, especially for users comparing multiple options. This is tertiary to the core logic but important for clarity.

**Independent Test**: Can be tested by selecting any loan amount and verifying the corresponding option in the list has distinct visual styling. Delivers value by improving visual comprehension and reducing user errors.

**Acceptance Scenarios**:

1. **Given** the loan amount is 1500, **When** the options are displayed as [1500*, 2500, 3500], **Then** the 1500 option has distinct visual styling indicating it is active
2. **Given** the loan amount is 100000, **When** the options are displayed as [98000, 99000, 100000*], **Then** the 100000 option has distinct visual styling indicating it is active
3. **Given** any loan amount is selected, **When** viewing the options list, **Then** exactly one option is visually highlighted as active

---

### Edge Cases

- What happens when the loan amount is exactly 1500 (minimum boundary)?
  - Options should display [1500*, 2500, 3500] with 1500 active
- What happens when the loan amount is exactly 100000 (maximum boundary)?
  - Options should display [98000, 99000, 100000*] with 100000 active
- What happens when the loan amount is 2500 (just above minimum)?
  - Options should display [1500, 2500*, 3500] with 2500 active (standard behavior, not boundary case)
- What happens when the loan amount is 99000 (just below maximum)?
  - Options should display [98000, 99000*, 100000] with 99000 active (standard behavior, not boundary case)
- What happens if the comparison delta (1000) exceeds the remaining range at boundaries?
  - At minimum: use fixed values [1500, 2500, 3500]
  - At maximum: use fixed values [98000, 99000, 100000]

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display exactly three loan amount options at all times
- **FR-002**: System MUST dynamically adjust the displayed options when the loan amount reaches the minimum value (1500) to show [1500, 2500, 3500]
- **FR-003**: System MUST dynamically adjust the displayed options when the loan amount reaches the maximum value (100000) to show [98000, 99000, 100000]
- **FR-004**: System MUST calculate options for non-boundary values as [amount-1000, amount, amount+1000]
- **FR-005**: System MUST visually highlight the active loan amount option to distinguish it from the other two options
- **FR-006**: System MUST automatically recalculate and update the displayed options whenever the loan amount changes, without requiring manual refresh
- **FR-007**: System MUST always include the currently selected loan amount as one of the three visible options
- **FR-008**: System MUST clamp option values to remain within the valid loan amount range (1500 to 100000)
- **FR-009**: System MUST position the active value at the start of the list when at minimum boundary and at the end of the list when at maximum boundary

### Key Entities

- **Loan Amount**: The currently selected loan amount value, ranging from 1500 (minimum) to 100000 (maximum). This is the primary driver for option calculation.
- **Payment Option**: A single loan amount value displayed in the options list. Each option represents a selectable loan amount and has an active/inactive state.
- **Options List**: A collection of exactly three payment options, dynamically calculated based on the current loan amount and boundary conditions.

### Architecture Considerations

**Domain Layer** (Pure functions in `src/domain/`):
- `calculateComparisonAmounts(amount: number): [number, number, number]` - Pure function that takes a loan amount and returns three comparison values accounting for boundary logic
- Validation: Ensure input amount is within valid range (1500-100000)
- Edge cases: Handle minimum boundary (1500), maximum boundary (100000), and normal cases
- Clamping logic: Ensure calculated options never exceed valid range
- Constants: Use centralized config for min/max loan amounts and comparison delta (1000)

**Component Layer** (UI in `src/components/`):
- `AmountTabs` or similar component that renders the three options as selectable tabs/buttons
- Props: `amounts: number[]`, `activeAmount: number`, `onAmountChange: (amount: number) => void`
- Visual styling: Active tab should have distinct appearance (border, background, bold text)
- Accessibility: Keyboard navigation, ARIA labels for screen readers

**App Layer** (Orchestration in `src/app/`):
- State: Maintain current loan amount
- Derived data: Compute comparison amounts from current loan amount using domain function
- Event handlers: Handle amount changes from both input/slider and amount tab selection
- Update flow: When loan amount changes → recalculate comparison amounts → re-render options

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view all three loan amount options at any selected loan amount value (100% visibility)
- **SC-002**: At minimum boundary (1500), options display correctly as [1500, 2500, 3500] with 1500 active (100% accuracy)
- **SC-003**: At maximum boundary (100000), options display correctly as [98000, 99000, 100000] with 100000 active (100% accuracy)
- **SC-004**: Options update automatically within 100ms of loan amount change without manual refresh (perceived as instant)
- **SC-005**: Active option is visually distinguishable from inactive options in all states (100% clarity)
- **SC-006**: Feature has zero user-reported issues regarding missing or incorrect loan amount options at boundaries
