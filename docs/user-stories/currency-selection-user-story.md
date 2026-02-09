# User Story: Currency Selection for Payment and Scenario

## User Story

As a user of the Personal Loan Calculator,\
I want to select the currency used to display values in the Estimated
Monthly Payment section and the Selected Scenario section,\
so that I can view results in my preferred currency while keeping the
loan input base amount in USD.

------------------------------------------------------------------------

## Description

-   Add a currency dropdown in the Estimated Monthly Payment area (as
    shown in the provided screenshot).
-   The Loan Amount is the base value in USD.
-   All values displayed in:
    -   Estimated Monthly Payment section
    -   Selected Scenario section\
        must be converted to the selected currency.

------------------------------------------------------------------------

## Supported Currencies

-   USD (default)
-   EUR
-   UAH

------------------------------------------------------------------------

## Exchange Rates Integration

-   Use the Currency Beacon API.
-   API Key must be stored in `.env` file:

```{=html}
<!-- -->
```
    VITE_CURRENCYBEACON_KEY=api_key_here

-   Access the key via `import.meta.env`.

------------------------------------------------------------------------

## Acceptance Criteria

1.  A currency dropdown is visible in the Estimated Monthly Payment
    section.
2.  The dropdown contains: USD, EUR, UAH (USD is default).
3.  Changing the currency updates in real time:
    -   Estimated Monthly Payment values
    -   Selected Scenario values
4.  Exchange rates are retrieved from Currency Beacon API.
5.  If the API call fails:
    -   The last valid rates are used or USD is applied
    -   A non-blocking error message is shown.
6.  The application correctly loads environment variables using
    `import.meta.env`.

------------------------------------------------------------------------

## Technical Notes

-   Follow Vite environment variable naming conventions.
-   Handle API errors and caching responsibly.
-   Ensure conversion logic is centralized and reusable.
