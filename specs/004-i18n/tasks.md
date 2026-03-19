# Tasks: Internationalization (i18n)

**Input**: Design documents from `/specs/004-i18n/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Unit tests for domain functions and integration tests for language switching included per TDD approach.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [ ] T001 Install i18n dependencies: i18next@^24.3.0, react-i18next@^15.2.0, i18next-http-backend@^3.0.1
- [ ] T002 Install types: @types/i18next@^13.0.0 as devDependency
- [ ] T003 [P] Create src/i18n directory for i18n infrastructure
- [ ] T004 [P] Create src/locales directory for translation files
- [ ] T005 [P] Create public/locales directory for served translation files
- [ ] T006 [P] Create src/test/mocks directory for test utilities

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core i18n infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Add language constants to src/domain/config.ts (SUPPORTED_LANGUAGES: ['en', 'de', 'uk'], DEFAULT_LANGUAGE: 'en')
- [ ] T008 Create LocaleConfig type and locale configurations in src/i18n/config.ts
- [ ] T009 Create Translations interface in src/i18n/types.ts with TypeScript module augmentation
- [ ] T010 Initialize i18next with http-backend plugin in src/i18n/config.ts
- [ ] T011 Create I18nProvider context component in src/i18n/I18nProvider.tsx
- [ ] T012 Create useI18n custom hook in src/i18n/useI18n.ts providing t, changeLanguage, formatNumber, formatCurrency, state
- [ ] T013 Wrap App with I18nProvider in src/app/App.tsx
- [ ] T014 Create test mock for useI18n in src/test/mocks/useI18n.ts
- [ ] T015 Update src/test/setup.ts to mock i18next for all tests

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View App in Native Language (Priority: P1) 🎯 MVP

**Goal**: Enable users to view and interact with the entire loan calculator in English, German, or Ukrainian

**Independent Test**: User selects German from language selector, all UI text displays in German, calculations work correctly

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T016 [US1] Write integration test for language switching in src/i18n/integration.test.tsx (test German selection, UI updates, calculation accuracy)

### Domain Layer for User Story 1

- [ ] T017 [P] [US1] Create formatNumberByLocale function in src/domain/locale.ts (uses Intl.NumberFormat)
- [ ] T018 [P] [US1] Create formatCurrencyByLocale function in src/domain/locale.ts (uses Intl.NumberFormat with currency style)
- [ ] T019 [P] [US1] Write unit tests for locale formatting functions in src/domain/locale.test.ts (test en-US, de-DE, uk-UA)

### Translation Files for User Story 1

- [ ] T020 [P] [US1] Extract all hardcoded English strings and create public/locales/en.json (loanAmount, apr, table, details, validation, currency, language, notifications sections)
- [ ] T021 [P] [US1] Create public/locales/de.json with German translations (initial placeholders acceptable)
- [ ] T022 [P] [US1] Create public/locales/uk.json with Ukrainian translations (initial placeholders acceptable)

### Components for User Story 1

- [ ] T023 [US1] Create LanguageSelector component in src/components/LanguageSelector.tsx (dropdown with language options, onChange handler)
- [ ] T024 [US1] Add LanguageSelector to app header/navigation in src/app/App.tsx
- [ ] T025 [P] [US1] Update LoanAmountInput component in src/components/LoanAmountInput.tsx (use t() for label, placeholder, button)
- [ ] T026 [P] [US1] Update AprControl component in src/components/AprControl.tsx (use t() for label, ARIA labels)
- [ ] T027 [P] [US1] Update PaymentTable component in src/components/PaymentTable.tsx (use t() for headers, formatNumber for values)
- [ ] T028 [P] [US1] Update SelectedDetails component in src/components/SelectedDetails.tsx (use t() for all labels, formatCurrency for amounts)
- [ ] T029 [P] [US1] Update validation messages in src/domain/validation.ts to use translation keys with interpolation
- [ ] T030 [P] [US1] Update CurrencyDropdown component in src/components/CurrencyDropdown.tsx (use t() for label)
- [ ] T031 [P] [US1] Update RateStatusBadge component in src/components/RateStatusBadge.tsx (use t() for status messages)
- [ ] T032 [P] [US1] Update Notifications component in src/components/Notifications.tsx (use t() for notification messages)

### Tests for Components (User Story 1)

- [ ] T033 [US1] Write unit test for LanguageSelector in src/components/LanguageSelector.test.tsx (test dropdown rendering, selection handling)
- [ ] T034 [US1] Update existing component tests to use mocked useI18n hook

**Checkpoint**: At this point, User Story 1 should be fully functional - users can select any language and see all UI text translated

---

## Phase 4: User Story 4 - Localized Number and Currency Formatting (Priority: P2)

**Goal**: Display numbers and currency values with locale-specific formatting (separators, symbol placement)

**Independent Test**: User selects German and verifies numbers show "7.000,50" format, currency shows "7.000 €", same verification for Ukrainian

**Note**: This story is prioritized P2 but implemented before US2/US3 because US1 partially implements it; this completes the formatting

### Tests for User Story 4

- [ ] T035 [US4] Add test cases to src/domain/locale.test.ts for edge cases (zero, negative, very large numbers, rounding)
- [ ] T036 [US4] Write integration test in src/i18n/integration.test.tsx verifying formatting updates when language switches

### Implementation for User Story 4

- [ ] T037 [US4] Add getLocaleCode helper function in src/i18n/config.ts (maps language code to BCP 47 locale)
- [ ] T038 [US4] Enhance formatNumber and formatCurrency in useI18n hook to use current language's locale automatically
- [ ] T039 [US4] Update PaymentTable to use useI18n formatCurrency for all monetary values
- [ ] T040 [US4] Update AmountTabs component in src/components/AmountTabs.tsx (use formatCurrency for tab labels)
- [ ] T041 [US4] Verify all numeric displays across app use locale-aware formatting

**Checkpoint**: At this point, all numbers and currency are formatted according to selected locale conventions

---

## Phase 5: User Story 2 - Language Persistence (Priority: P2)

**Goal**: User's language selection persists across browser sessions using localStorage

**Independent Test**: User selects German, closes browser, reopens app, language is still German

### Tests for User Story 2

- [ ] T042 [US2] Write integration test in src/i18n/integration.test.tsx for localStorage persistence (select language, unmount, remount, verify language restored)
- [ ] T043 [US2] Write test for localStorage unavailable scenario (verify graceful degradation)

### Implementation for User Story 2

- [ ] T044 [US2] Add localStorage persistence to changeLanguage function in src/i18n/useI18n.ts (set 'app_language' key)
- [ ] T045 [US2] Add initial language load from localStorage in src/i18n/I18nProvider.tsx (getInitialLanguage function with validation)
- [ ] T046 [US2] Add error handling for localStorage quota exceeded in src/i18n/useI18n.ts (graceful degradation)

**Checkpoint**: At this point, language preference persists correctly across sessions

---

## Phase 6: User Story 3 - Instant Language Switching (Priority: P3)

**Goal**: Enable users to switch languages without page reload, with loading states and error handling

**Independent Test**: User switches from English → German → Ukrainian, no page reload, entered data preserved, loading indicators shown during fetch

### Tests for User Story 3

- [ ] T047 [US3] Write integration test in src/i18n/integration.test.tsx for data preservation during language switch (enter amount/APR, switch language, verify values unchanged)
- [ ] T048 [US3] Write integration test for loading state display during language fetch
- [ ] T049 [US3] Write integration test for error handling (mock failed translation fetch, verify error message, fallback to current language)
- [ ] T050 [US3] Write integration test for rapid language switching (cancel pending requests, load only latest selection)

### Implementation for User Story 3

- [ ] T051 [US3] Add loading state management to useI18n hook (isLoading flag toggled during changeLanguage)
- [ ] T052 [US3] Add error state management to useI18n hook (error message set on fetch failure, cleared on success)
- [ ] T053 [US3] Update LanguageSelector in src/components/LanguageSelector.tsx to show loading indicator (disable dropdown, show spinner)
- [ ] T054 [US3] Add error display to LanguageSelector with retry button
- [ ] T055 [US3] Implement request cancellation in useI18n for rapid language switching (abort previous pending requests)
- [ ] T056 [US3] Update document.documentElement.lang attribute when language changes in src/i18n/useI18n.ts

**Checkpoint**: At this point, language switching is fully robust with loading states, error handling, and data preservation

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, optimization, and documentation

- [ ] T057 [P] Create translation validation script in scripts/validate-translations.ts (check all keys present, no empty strings, file size <5KB)
- [ ] T058 [P] Add npm script "validate:translations" to package.json running the validation script
- [ ] T059 Run validation script against all translation files and fix any issues
- [ ] T060 [P] Add accessibility test in src/components/accessibility.test.tsx verifying LanguageSelector keyboard navigation
- [ ] T061 [P] Verify lang attribute updates in integration tests
- [ ] T062 Test app in all three languages manually (full user flow: amount input, APR adjustment, table interaction, details view)
- [ ] T063 [P] Update README.md with i18n usage section (how to add translations, how to use in components)
- [ ] T064 Review quickstart.md and ensure all examples are accurate
- [ ] T065 Run all existing tests to ensure no regressions introduced
- [ ] T066 [P] Code cleanup: remove any console.log statements, ensure consistent error handling
- [ ] T067 [P] Performance check: verify translation files <5KB, lazy-loading works, language switch <2 seconds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Must complete first - provides base translation infrastructure
  - US4 (P2): Can start after US1 (enhances formatting)
  - US2 (P2): Can start after US1 (adds persistence)
  - US3 (P3): Can start after US1 (adds loading/error handling)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: MUST complete first - foundational for all other stories
- **User Story 4 (P2)**: Depends on US1 (extends formatting capabilities)
- **User Story 2 (P2)**: Depends on US1 (adds persistence layer)
- **User Story 3 (P3)**: Depends on US1 (adds UX enhancements)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Domain functions before components (pure functions first)
- Translation files before component updates (components need translation keys)
- Core components before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004, T005, T006 can run in parallel

**Phase 2 (Foundational)**: No parallelization recommended - sequential setup is clearer

**User Story 1 Implementation**:
- T017, T018, T019 can run in parallel (domain functions and tests)
- T020, T021, T022 can run in parallel (translation files)
- T025-T032 can run in parallel (component updates - different files)

**User Story 4**: T039, T040, T041 can run in parallel (different components)

**Phase 7 (Polish)**: T057, T060, T063, T064, T066, T067 can run in parallel (different files/concerns)

---

## Parallel Example: User Story 1 Components

```bash
# After translation files are created, update all components in parallel:
Task T025: "Update LoanAmountInput in src/components/LoanAmountInput.tsx"
Task T026: "Update AprControl in src/components/AprControl.tsx"
Task T027: "Update PaymentTable in src/components/PaymentTable.tsx"
Task T028: "Update SelectedDetails in src/components/SelectedDetails.tsx"
Task T029: "Update validation in src/domain/validation.ts"
Task T030: "Update CurrencyDropdown in src/components/CurrencyDropdown.tsx"
Task T031: "Update RateStatusBadge in src/components/RateStatusBadge.tsx"
Task T032: "Update Notifications in src/components/Notifications.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup → Dependencies installed
2. Complete Phase 2: Foundational → i18n infrastructure ready
3. Complete Phase 3: User Story 1 → Full translation capability
4. **STOP and VALIDATE**: Test language switching, verify all components translated
5. Demo/Deploy MVP with English, German, Ukrainian support

### Incremental Delivery

1. Setup + Foundational → Foundation ready (30 min)
2. Add User Story 1 → Test independently → **MVP READY** (4-6 hours)
3. Add User Story 4 → Locale formatting complete → Deploy (1-2 hours)
4. Add User Story 2 → Persistence working → Deploy (1 hour)
5. Add User Story 3 → Robust UX with loading/errors → Deploy (2-3 hours)
6. Polish → Production-ready (2-3 hours)

**Total Estimated Time**: 12-16 hours for full implementation

### TDD Approach

1. Write integration test (e.g., T016) → Test FAILS (no translation yet)
2. Write domain unit tests (e.g., T019) → Tests FAIL (no functions yet)
3. Implement domain functions (e.g., T017, T018) → Domain tests PASS
4. Create translation files (e.g., T020-T022) → Files exist
5. Update components (e.g., T025-T032) → Components use translations
6. Run integration test → Test PASSES (full flow works)

---

## Task Count Summary

- **Total Tasks**: 67
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 9 tasks (BLOCKS all stories)
- **Phase 3 (US1)**: 19 tasks (MVP delivery)
- **Phase 4 (US4)**: 7 tasks
- **Phase 5 (US2)**: 4 tasks
- **Phase 6 (US3)**: 6 tasks
- **Phase 7 (Polish)**: 11 tasks

**Parallel Task Count**: 37 tasks marked [P] (55% parallelizable within phases)

---

## Success Criteria Checklist

After completing all tasks, verify:

- [ ] Users can view app in English, German, Ukrainian
- [ ] All UI text translates (labels, buttons, errors, table headers, help text)
- [ ] Numbers formatted per locale (comma/period/space separators)
- [ ] Currency formatted per locale (symbol placement)
- [ ] Language selection persists across browser sessions
- [ ] Language switching <2 seconds including network fetch
- [ ] Loading indicators shown during language fetch
- [ ] Error messages shown if translation load fails
- [ ] Entered data preserved during language switch
- [ ] All translation files <5KB
- [ ] No hardcoded English text in components
- [ ] Translation validation script passes
- [ ] All existing tests still pass (no regressions)
- [ ] Constitution principles maintained (domain purity, test-first, UI/logic separation)

---

## Notes

- Follow TDD: Write tests first, watch them fail, then implement
- Each user story should be independently deployable
- Mark tasks complete as you finish them using `- [x]` checkbox syntax
- Commit after each logical group of tasks
- Run `npm test` after component updates to catch regressions early
- Run `npm run validate:translations` before considering tasks complete
- Translation quality can start with placeholders - professional translations can be added later
- Ukrainian translations may need native speaker review for accuracy
