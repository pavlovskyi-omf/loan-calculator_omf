# Implementation Plan: Internationalization (i18n)

**Branch**: `004-i18n` | **Date**: 2026-03-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-i18n/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement internationalization (i18n) support for the Personal Loan Calculator to enable users to view and interact with the application in English, German, or Ukrainian. The solution will use lazy-loaded translation files for German and Ukrainian (English bundled), React Context for state management, and Intl APIs for locale-specific number/currency formatting. All UI text will be extracted to translation keys, with language selection persisting in localStorage.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19  
**Primary Dependencies**: react-i18next ^15.x (to be added), i18next ^24.x (to be added)  
**Storage**: localStorage for language preference persistence  
**Testing**: Vitest 2.1 + React Testing Library 16  
**Target Platform**: Modern browsers (Chrome 100+, Firefox 100+, Safari 16+, Edge 100+)  
**Project Type**: Client-side web application (SPA)  
**Performance Goals**: Language switching complete within 2 seconds (including network fetch), translation file <5KB uncompressed  
**Constraints**: Lazy-load translations (German/Ukrainian), English bundled with app, zero impact on existing functionality  
**Scale/Scope**: 3 languages, ~50-75 translation keys covering all UI text, no external API dependencies

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Domain Purity
- ✅ **PASS**: Locale formatting logic will remain in `src/domain/` as pure functions
- ✅ **PASS**: Translation key selection (string lookup) is presentation logic, belongs in components/hooks
- ✅ **PASS**: No React dependencies in domain functions maintained

### II. Test-First Development
- ✅ **PASS**: Unit tests required for locale formatting functions
- ✅ **PASS**: Integration tests for language switching, persistence, and fallback behavior
- ⚠️ **WARNING**: Translation file loading (async) requires careful test mocking strategy

### III. UI/Logic Separation
- ✅ **PASS**: i18n hooks/context in component layer
- ✅ **PASS**: Number/currency formatting functions in domain layer
- ✅ **PASS**: Translation management separate from business logic

### IV. Configuration-Driven Design
- ✅ **PASS**: Supported languages will be defined in `src/domain/config.ts`
- ✅ **PASS**: Default language, fallback language configured centrally
- ✅ **PASS**: Translation key namespaces organized logically

### V. Accessibility & User Experience
- ✅ **PASS**: Language selector will be keyboard-accessible dropdown
- ✅ **PASS**: Loading states for language switching announced to screen readers
- ✅ **PASS**: Language preference respects user choice and persists
- ⚠️ **NOTE**: Ensure `lang` attribute on `<html>` updates when language changes

**GATES PASSED**: All constitutional principles satisfied. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/004-i18n/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - i18n library comparison and locale formatting research
├── data-model.md        # Phase 1 output - translation structure, locale data model
├── quickstart.md        # Phase 1 output - adding new translations, using i18n in components
├── contracts/           # Phase 1 output - translation file schema, i18n hook API
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── i18n/
│   ├── config.ts              # i18n initialization, supported languages
│   ├── I18nProvider.tsx       # React context provider
│   ├── useI18n.ts             # Hook for accessing translations
│   └── loadTranslations.ts    # Lazy-loading logic with caching
├── locales/
│   ├── en.json                # English translations (bundled)
│   ├── de.json                # German translations (lazy-loaded)
│   └── uk.json                # Ukrainian translations (lazy-loaded)
├── domain/
│   ├── config.ts              # Add SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE constants
│   └── locale.ts              # New: pure functions for number/currency formatting per locale
├── components/
│   ├── LanguageSelector.tsx   # New: dropdown for language selection
│   ├── LoanAmountInput.tsx    # Update: use i18n for labels/buttons
│   ├── AprControl.tsx         # Update: use i18n for labels
│   ├── PaymentTable.tsx       # Update: use i18n for headers and number formatting
│   ├── SelectedDetails.tsx    # Update: use i18n for labels
│   └── [other components]     # Update: replace hardcoded strings with i18n
├── app/
│   └── App.tsx                # Wrap with I18nProvider
└── test/
    └── setup.ts               # Update: mock i18n for tests

tests/ (integration tests for i18n)
└── i18n.integration.test.tsx  # Language switching, persistence, loading
```

**Structure Decision**: Single project structure maintained. New `src/i18n/` directory for i18n infrastructure, `src/locales/` for translation files. Locale formatting functions added to domain layer to maintain domain purity. All existing components updated to consume i18n.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitutional violations. All principles satisfied.*

---

## Phase Summary

### Phase 0: Research & Technology Selection ✅ COMPLETE

**Artifacts Created**:
- [research.md](research.md)

**Key Decisions**:
1. **i18n Library**: react-i18next + i18next (industry standard, type-safe, lazy-loading built-in)
2. **Loading Strategy**: Lazy-load German/Ukrainian via i18next-http-backend, bundle English with app
3. **Number Formatting**: Native Intl.NumberFormat API (zero dependencies, browser-native)
4. **Persistence**: localStorage with `'app_language'` key
5. **Testing**: Vitest with mocked i18next for deterministic tests
6. **Key Organization**: Dot-notation namespaces for clarity

**Bundle Impact**: ~13KB (i18next ecosystem)

---

### Phase 1: Design & Contracts ✅ COMPLETE

**Artifacts Created**:
- [data-model.md](data-model.md) - Translation structure, locale configuration, state management
- [contracts/useI18n.md](contracts/useI18n.md) - React hook API contract
- [contracts/translation-schema.md](contracts/translation-schema.md) - JSON file format validation rules
- [quickstart.md](quickstart.md) - Developer guide for using i18n

**Data Model Highlights**:
- `SupportedLanguage`: Type-safe language codes (`'en' | 'de' | 'uk'`)
- `LocaleConfig`: Metadata for each language (locale codes, currency, direction)
- `Translations`: Complete translation dictionary interface
- `I18nState`: Runtime state (current language, loading, error)

**Contract Highlights**:
- `useI18n` hook provides: `t()`, `changeLanguage()`, `formatNumber()`, `formatCurrency()`, state
- Translation files: 8 sections, 50-75 keys total, <5KB each
- Type-safe translation keys via TypeScript module augmentation
- Automated validation script for translation file consistency

**Constitutional Re-Check**: ✅ All gates still passing

---

### Phase 2: Task Breakdown (Next Step)

Run `/speckit.tasks` to generate actionable implementation tasks covering:
1. Dependencies installation
2. i18n infrastructure setup
3. Domain layer additions (locale formatting functions)
4. Component updates (extract strings, add i18n hooks)
5. Translation file creation (English, German, Ukrainian)
6. Integration testing
7. Documentation

---

## Implementation Readiness

### Dependencies to Add

```json
{
  "dependencies": {
    "i18next": "^24.3.0",
    "react-i18next": "^15.2.0",
    "i18next-http-backend": "^3.0.1"
  },
  "devDependencies": {
    "@types/i18next": "^13.0.0"
  }
}
```

### Files to Create

**New Files** (14):
- `src/i18n/config.ts`
- `src/i18n/I18nProvider.tsx`
- `src/i18n/useI18n.ts`
- `src/i18n/types.ts`
- `src/domain/locale.ts`
- `src/components/LanguageSelector.tsx`
- `public/locales/en.json`
- `public/locales/de.json`
- `public/locales/uk.json`
- `src/test/mocks/useI18n.ts`
- `scripts/validate-translations.ts`
- Tests: `src/domain/locale.test.ts`, `src/components/LanguageSelector.test.tsx`, `src/i18n/integration.test.tsx`

**Files to Update** (7):
- `src/domain/config.ts` (add language constants)
- `src/app/App.tsx` (wrap with I18nProvider)
- `src/components/LoanAmountInput.tsx` (replace strings with i18n)
- `src/components/AprControl.tsx` (replace strings with i18n)
- `src/components/PaymentTable.tsx` (replace strings with i18n)
- `src/components/SelectedDetails.tsx` (replace strings with i18n)
- `src/test/setup.ts` (add i18n mock)

### Critical Path

1. Install dependencies
2. Create i18n infrastructure (config, provider, hooks)
3. Create English translation file (extract all current UI strings)
4. Update one component (smoke test)
5. Update all remaining components
6. Add German and Ukrainian translations (initial/placeholder)
7. Add integration tests
8. Validate all translation files

### Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Translation files too large | Low | Medium | Monitor file sizes, use short keys, validate <5KB |
| Breaking existing tests | Medium | Medium | Update test setup first, run tests after each component |
| Missing translation keys | Medium | Low | Use validation script, TypeScript types |
| Poor translation quality | High | Medium | Start with placeholders, get professional translations later |
| Lazy-loading failures | Low | Medium | Comprehensive error handling, fallback to English |

---

## Success Criteria Mapping

| Spec Success Criterion | Plan Coverage |
|------------------------|---------------|
| SC-001: Complete tasks in all languages | ✅ Full UI translation, formatting per locale |
| SC-002: Zero hardcoded English text | ✅ All strings extracted to translation files |
| SC-003: Language switch <2 seconds | ✅ Lazy-loading with caching, <5KB files |
| SC-004: 100% translation coverage | ✅ Validation script checks all keys |
| SC-005: Language preference persists | ✅ localStorage persistence |
| SC-006: Numbers/currency formatted correctly | ✅ Intl.NumberFormat per locale |
| SC-007: Graceful fallback to English | ✅ i18next built-in fallback |
| SC-008: Bundle size <50KB | ✅ ~13KB for libraries, 2-3KB per translation file |
| SC-009: Current language identifiable | ✅ LanguageSelector shows native name |
| SC-010: All validation messages translated | ✅ Validation section in translation files |

---

## Next Steps

1. **Run**: `/speckit.tasks` to generate detailed task breakdown
2. **Review**: Generated tasks for dependency order and completeness
3. **Execute**: Implement tasks incrementally with TDD approach
4. **Validate**: Run `npm run validate:translations` after each translation update

---

**Planning Phase Complete**: Ready for task generation and implementation.  
**Branch**: `004-i18n`  
**Artifacts**: research.md, data-model.md, quickstart.md, contracts/  
**Status**: All constitutional gates passed, design validated, contracts defined
