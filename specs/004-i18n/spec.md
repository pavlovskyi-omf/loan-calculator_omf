# Feature Specification: Internationalization (i18n)

**Feature Branch**: `004-i18n`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "Implement i18n for the app. Implement the following localization languages: English, German, Ukrainian."

## Clarifications

### Session 2026-03-19

- Q: Should the app automatically detect and use the browser's language preference on first visit, or always default to English? → A: Always default to English regardless of browser settings
- Q: What number formatting conventions should be used for Ukrainian locale? → A: Space as thousands separator, comma as decimal separator
- Q: Should the i18n system support complex pluralization rules, or is simple string replacement adequate? → A: Simple string replacement only (no pluralization rules)
- Q: Should translations be lazy-loaded on demand or bundled in the initial application load? → A: Lazy-load translations - fetch language file only when selected

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View App in Native Language (Priority: P1)

Users can view and interact with the entire loan calculator application in their preferred language (English, German, or Ukrainian), ensuring they understand all functionality without language barriers.

**Why this priority**: Core value proposition of i18n - enables non-English speakers to use the application effectively. This is the foundation upon which all other localization features depend.

**Independent Test**: User selects German from language selector and verifies that all UI text (labels, buttons, table headers, validation messages, help text) displays in German. Calculations remain accurate regardless of language.

**Acceptance Scenarios**:

1. **Given** app is open in default language, **When** user opens the app for the first time, **Then** app displays in English (default)
2. **Given** user selects German as language, **When** UI re-renders, **Then** all text (labels, buttons, error messages, table headers) displays in German
3. **Given** user selects Ukrainian as language, **When** UI re-renders, **Then** all text displays in Ukrainian
4. **Given** user has selected a language, **When** user performs calculations, **Then** calculations work correctly and results display in selected language format
5. **Given** user enters invalid input, **When** validation error occurs, **Then** error message displays in the selected language

---

### User Story 2 - Language Persistence (Priority: P2)

Users' language selection persists across browser sessions so they don't need to re-select their language every time they visit the application.

**Why this priority**: Significantly improves user experience by respecting user preferences. Without persistence, users would need to change language on every visit, creating friction.

**Independent Test**: User selects German, closes browser completely, reopens app, and verifies language is still German.

**Acceptance Scenarios**:

1. **Given** user selects German language, **When** user closes and reopens browser, **Then** app displays in German
2. **Given** user selects Ukrainian language, **When** user refreshes the page, **Then** app remains in Ukrainian
3. **Given** user has never selected a language, **When** user opens app, **Then** app displays in English (default language)

---

### User Story 3 - Instant Language Switching (Priority: P3)

Users can switch between languages instantly without page reload, allowing them to compare terminology or verify understanding across languages if needed.

**Why this priority**: Improves usability for multilingual users or those learning a new language. Nice-to-have rather than essential functionality.

**Independent Test**: User switches from English to German to Ukrainian and back without any page reloads or loss of entered data. All language changes are immediate.

**Acceptance Scenarios**:

1. **Given** user has entered loan amount and APR, **When** user switches language, **Then** entered values are preserved and only UI text changes
2. **Given** user has selected specific comparison amount and term, **When** user switches language, **Then** selection is maintained
3. **Given** user switches to a new language, **When** translation file is loading, **Then** loading indicator is shown and UI updates once loaded
4. **Given** user switches to a previously loaded language, **When** UI updates, **Then** transition is instant from cache (no loading delay)

---

### User Story 4 - Localized Number and Currency Formatting (Priority: P2)

Users see numbers and currency values formatted according to their selected language's conventions (decimal separators, thousands separators, currency symbol placement).

**Why this priority**: Critical for user comprehension in non-English locales. German and Ukrainian use different number formatting conventions than English.

**Independent Test**: User selects German and verifies that numbers display with periods as thousands separators and commas as decimal separators (e.g., "7.000,50 €"). Same for Ukrainian conventions.

**Acceptance Scenarios**:

1. **Given** app is in English, **When** displaying $7,000.50, **Then** shows "7,000.50" with comma as thousands separator
2. **Given** app is in German, **When** displaying €7,000.50, **Then** shows "7.000,50" with period as thousands separator and comma as decimal separator
3. **Given** app is in Ukrainian, **When** displaying ₴7,000.50, **Then** shows "7 000,50" with space as thousands separator and comma as decimal separator
4. **Given** user switches language, **When** viewing payment table, **Then** all numbers in table update to new locale format instantly

---

### Edge Cases

- What happens when browser language is set to a language we don't support (e.g., French)? → Default to English
- How does the system handle partially loaded translations (missing keys)? → Fall back to English text for missing keys + log warning
- What happens if localStorage is disabled or unavailable? → App works normally but language preference doesn't persist
- What happens when translation file fails to load due to network error? → Show error notification, maintain current language, allow user to retry
- What happens when user rapidly switches between languages before loading completes? → Cancel pending requests, only load the most recently selected language
- What happens when translation file is corrupted or invalid JSON? → Show error notification, fall back to English, log error for debugging
- How are pluralization rules handled (e.g., "1 month" vs "2 months")? → Simple string replacement only; no pluralization engine needed since UI only displays multi-month terms ("24 months", "36 months", etc.)
- What happens with very long translations that don't fit in UI? → Design must accommodate 30% text expansion for German
- How are date/time formats handled if displayed? → Currently no dates displayed in app
- What happens with right-to-left languages if we add them later? → Out of scope for this feature, but design should not prevent future RTL support

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide translation support for all user-visible text in English, German, and Ukrainian languages
- **FR-002**: System MUST provide a language selector dropdown in the UI header/navigation area
- **FR-003**: System MUST apply selected language to all UI elements including: labels, buttons, placeholders, error messages, validation text, table headers, help text, tooltips
- **FR-004**: System MUST persist user's language selection across browser sessions using browser storage
- **FR-005**: System MUST update entire UI when language is changed without requiring page reload
- **FR-006**: System MUST format numbers according to selected locale conventions (thousands separator, decimal separator)
- **FR-007**: System MUST format currency values according to selected locale conventions (symbol placement, spacing)
- **FR-008**: System MUST fall back to English text for any missing translation keys
- **FR-009**: System MUST preserve all entered data (loan amount, APR, selected cell) when language is changed
- **FR-010**: System MUST support the following specific UI text elements:
  - Loan amount input label and placeholder
  - Calculate button
  - APR control label and description
  - Payment table headers ("Term", amount columns)
  - Payment table rows (month labels)
  - Selected details section (all labels: "Selected Scenario", "Loan Amount", "Term", "Monthly Payment", "Total Paid", "Total Interest")
  - Currency dropdown label
  - Rate status badge messages
  - Notification messages
  - All validation error messages
- **FR-011**: System MUST allow developers to add new translatable strings without modifying component logic
- **FR-012**: System MUST lazy-load translation files on demand when a language is selected (not bundle all languages in initial load)
- **FR-013**: System MUST display a loading indicator when fetching a new language file
- **FR-014**: System MUST handle translation file loading failures gracefully by showing error message and maintaining current language
- **FR-015**: System MUST cache loaded translation files to avoid re-fetching on subsequent selections of the same language

### Key Entities *(include if feature involves data)*

- **Translation Key**: Unique identifier for each translatable text string (e.g., "loanAmount.label", "calculate.button", "validation.tooLow")
- **Translation Value**: Localized text for a specific key in a specific language
- **Locale**: Language/region identifier (e.g., "en", "de", "uk") with associated translations and formatting rules
- **Translation File**: Collection of key-value pairs for a specific language (e.g., en.json, de.json, uk.json)
- **Number Format Rules**: Locale-specific rules for thousands separator, decimal separator, and digit grouping
- **Currency Format Rules**: Locale-specific rules for currency symbol, symbol placement, and spacing

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete all core tasks (enter amount, adjust APR, calculate payment, view results) successfully in any of the three supported languages
- **SC-002**: Zero hardcoded English text remains in component files - all user-facing strings use translation system
- **SC-003**: Language switching completes within 2 seconds on typical network conditions (including translation file fetch and UI update)
- **SC-004**: All three languages (English, German, Ukrainian) have 100% translation coverage for all defined keys
- **SC-005**: Language preference persists correctly in 100% of test cases across browser restarts
- **SC-006**: Numbers and currency display correctly formatted for each locale in 100% of test cases
- **SC-007**: When translation key is missing, system gracefully falls back to English and logs the missing key (testable via missing key injection)
- **SC-008**: Each individual translation file is less than 5KB uncompressed (English translation bundled with app, German and Ukrainian lazy-loaded)
- **SC-009**: Users can identify their current language from the language selector without needing to click it
- **SC-010**: All validation error messages display appropriate translations in all three languages

## Assumptions & Constraints

### Assumptions

- English is the default language and primary development language
- All three languages use left-to-right text direction
- Translation text will not contain HTML or executable code
- German translations may be 20-30% longer than English equivalents
- Users have JavaScript enabled and modern browsers (ES2020+)
- Translation accuracy is provided by stakeholders/professional translators (not developers)

### Technical Constraints

- Must integrate with existing React + TypeScript codebase
- Must maintain current component structure and styling
- Must not break existing tests
- Must support tree-shaking to avoid loading unused language files
- Must be compatible with Vite build system

### Out of Scope

- Right-to-left language support (Arabic, Hebrew, etc.)
- Languages beyond English, German, Ukrainian
- Translation management UI or CMS
- Automatic translation or machine translation integration
- User-editable translations
- Translation of dynamically generated content from external APIs
- Localization of date/time formats (no dates currently in app)
- Regional variants (e.g., en-US vs en-GB, de-DE vs de-AT)
- Accessibility enhancements specific to non-English languages (handled separately)
