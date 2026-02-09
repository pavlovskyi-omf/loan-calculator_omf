# User Story: Dynamic Adjustment of Estimated Monthly Payment Options

## Title

Dynamic Shift of Estimated Monthly Payment Options Based on Loan Amount

## User Story

As a user, I want the "Estimated Monthly Payment" options to
automatically adjust when the "Loan Amount" is set to its minimum or
maximum value, So that the selected amount is always displayed in a
meaningful and intuitive position.

## Description

When the Loan Amount reaches its defined minimum or maximum value, the
system should dynamically shift the available Estimated Monthly Payment
options. This ensures that the selected value appears either at the
beginning or at the end of the list, improving usability and clarity.

## Business Value

-   Improves user experience by keeping relevant values visible
-   Reduces confusion at boundary values
-   Ensures consistent behavior at minimum and maximum limits

## Acceptance Criteria

### Scenario 1: Minimum Loan Amount

Given the Loan Amount is set to the minimum value (1500)\
When the Estimated Monthly Payment options are displayed\
Then the list should be:

-   1500 (active)
-   2500
-   3500

### Scenario 2: Maximum Loan Amount

Given the Loan Amount is set to the maximum value (100000)\
When the Estimated Monthly Payment options are displayed\
Then the list should be:

-   98000
-   99000
-   100000 (active)

### General Rules

-   The active value must always match the selected Loan Amount
-   The active value must be visually highlighted
-   The list must contain exactly three values
-   The values must be recalculated automatically when Loan Amount
    changes
-   No manual refresh should be required

## Definition of Done

-   Behavior is implemented for minimum and maximum Loan Amount values
-   Acceptance criteria are met
-   Unit tests cover boundary conditions
-   Feature is verified in UI and responsive views
-   Code is reviewed and approved

## Notes

-   Logic should be reusable for future boundary-based adjustments
-   Edge cases near minimum and maximum should be validated
-   Configuration values should be centralized
