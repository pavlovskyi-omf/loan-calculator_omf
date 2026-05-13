# Research: Internationalization (i18n) Implementation

**Feature**: 004-i18n  
**Date**: 2026-03-19  
**Phase**: 0 - Research & Technology Selection

## Overview

This document consolidates research on implementing i18n for the Personal Loan Calculator, covering library selection, lazy-loading strategies, locale formatting, and testing approaches.

## Decision 1: i18n Library Selection

### Options Evaluated

**Option A: react-i18next + i18next**
- **Pros**:
  - Industry standard with 11k+ GitHub stars
  - Built-in lazy-loading support via i18next-http-backend
  - React hooks API (`useTranslation`)
  - TypeScript support with type-safe keys
  - Automatic re-rendering on language change
  - Namespace support for organizing translations
  - Fallback language handling
  - Small bundle: ~12KB minified + gzipped for core
- **Cons**:
  - Additional dependency (~2)
  - Slightly more complex setup than minimal solutions

**Option B: react-intl (Format.js)**
- **Pros**:
  - Part of Format.js ecosystem
  - Built-in ICU message format
  - Strong pluralization support
  - Date/time formatting included
- **Cons**:
  - Heavier bundle (~30KB)
  - More complex API
  - Overkill for simple string replacement (no dates/complex plurals in our app)

**Option C: Custom Context + fetch**
- **Pros**:
  - Zero dependencies
  - Full control
  - Minimal bundle impact
- **Cons**:
  - Must implement: loading, caching, error handling, fallbacks
  - No type safety for translation keys
  - Maintenance burden
  - No hook ecosystem

### **Decision: react-i18next + i18next**

**Rationale**:
- Best balance of features vs. complexity
- Lazy-loading built-in via `i18next-http-backend` plugin
- Hook-based API fits existing React patterns
- Type-safe translation keys via TypeScript module augmentation
- Automatic component re-rendering on language change
- Fallback to English handled automatically
- Well-documented with large community

**Alternatives Rejected**:
- react-intl: Too heavy and feature-rich for our needs (no ICU pluralization required)
- Custom solution: Reinventing the wheel; testing burden too high

---

## Decision 2: Lazy-Loading Strategy

### Approach

Use `i18next-http-backend` to load translation files from `/locales/` directory:

```typescript
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    react: {
      useSuspense: false, // Handle loading manually
    },
  });
```

### Caching

- i18next automatically caches loaded translations in memory
- No re-fetch on subsequent language switches to same language
- Survives component unmounts but not page refresh (by design)

### Loading States

Use `i18next.isInitialized` and `i18next.isLoading` to show loading indicator:

```typescript
const { t, i18n } = useTranslation();
const [loading, setLoading] = useState(false);

const changeLanguage = async (lng: string) => {
  setLoading(true);
  await i18n.changeLanguage(lng);
  setLoading(false);
};
```

### Error Handling

```typescript
i18next.on('failedLoading', (lng, ns, msg) => {
  console.error(`Failed loading ${lng}:`, msg);
  // Show error notification, maintain current language
});
```

**Rationale**: Leverages battle-tested library features rather than custom implementation.

---

## Decision 3: Locale Number/Currency Formatting

### Approach

Use native JavaScript `Intl.NumberFormat` API (already partially in codebase):

```typescript
// src/domain/locale.ts

export function formatNumberByLocale(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrencyByLocale(value: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
```

### Locale-to-Format Mapping

| Language | Locale Code | Thousands | Decimal | Example     |
|----------|-------------|-----------|---------|-------------|
| English  | `en-US`     | `,`       | `.`     | 7,000.50    |
| German   | `de-DE`     | `.`       | `,`     | 7.000,50    |
| Ukrainian| `uk-UA`     | ` ` (space) | `,`   | 7 000,50    |

**Note**: `Intl.NumberFormat` handles these conventions automatically when passed correct locale code.

**Rationale**:
- Zero external dependencies
- Browser-native support (Chrome 24+, Firefox 29+, Safari 10+, Edge 12+)
- Automatic handling of locale-specific formatting
- Already present in codebase (`src/domain/currency.ts`)

---

## Decision 4: Language Persistence Strategy

### Approach

Store selected language in `localStorage` with key `'app_language'`:

```typescript
// On language change
localStorage.setItem('app_language', selectedLang);

// On app initialization
const savedLang = localStorage.getItem('app_language') || 'en';
i18next.changeLanguage(savedLang);
```

### Fallback Behavior

1. Check `localStorage.getItem('app_language')`
2. If not found → use English (default)
3. **No browser language detection** (per clarification #1)

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| localStorage disabled | App works, preference doesn't persist |
| Invalid language code in storage | Fall back to English, log warning |
| Storage quota exceeded | Catch error, proceed without persistence |

**Rationale**:
- Simple, reliable, synchronous API
- Supported in all modern browsers
- ~5-10MB quota per origin (more than sufficient for single string)
- No asynchronous complexity

**Alternative Rejected**: sessionStorage (doesn't persist across sessions), cookies (overkill, GDPR concerns)

---

## Decision 5: Testing Strategy

### Unit Tests (Domain Layer)

Test pure formatting functions in `src/domain/locale.ts`:

```typescript
describe('formatNumberByLocale', () => {
  it('formats English with comma thousands separator', () => {
    expect(formatNumberByLocale(7000.5, 'en-US')).toBe('7,000.5');
  });

  it('formats German with period thousands separator', () => {
    expect(formatNumberByLocale(7000.5, 'de-DE')).toBe('7.000,5');
  });

  it('formats Ukrainian with space thousands separator', () => {
    expect(formatNumberByLocale(7000.5, 'uk-UA')).toBe('7 000,5');
  });
});
```

### Integration Tests (Component Layer)

Test i18n hooks and language switching:

```typescript
describe('Language Switching', () => {
  it('changes all UI text when language switched', async () => {
    render(<App />);
    
    await userEvent.selectOptions(screen.getByLabelText('Language'), 'de');
    await waitFor(() => {
      expect(screen.getByText('Kreditbetrag')).toBeInTheDocument();
    });
  });

  it('persists language selection to localStorage', async () => {
    render(<App />);
    
    await userEvent.selectOptions(screen.getByLabelText('Language'), 'uk');
    
    expect(localStorage.getItem('app_language')).toBe('uk');
  });

  it('falls back to English for missing keys', () => {
    // Mock translation with missing key
    const { t } = useTranslation();
    expect(t('doesNotExist')).toBe('doesNotExist'); // i18next default
  });
});
```

### Test Setup

Mock i18next in test setup (`src/test/setup.ts`):

```typescript
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: { /* ... minimal test translations ... */ } },
      de: { translation: { /* ... minimal test translations ... */ } },
      uk: { translation: { /* ... minimal test translations ... */ } },
    },
    react: {
      useSuspense: false,
    },
  });
```

**Rationale**:
- Unit tests ensure locale formatting correctness (fast, isolated)
- Integration tests verify user-facing behavior (language switching, persistence)
- Mock i18next in tests to avoid network requests and ensure deterministic results

---

## Decision 6: Translation Key Organization

### Namespace Structure

```json
{
  "loanAmount": {
    "label": "Loan Amount",
    "placeholder": "$7,000",
    "button": "Calculate"
  },
  "apr": {
    "label": "Annual Percentage Rate",
    "decrease": "Decrease APR",
    "increase": "Increase APR"
  },
  "table": {
    "term": "Term",
    "months": "months"
  },
  "details": {
    "heading": "Selected Scenario",
    "loanAmount": "Loan Amount:",
    "term": "Term:",
    "monthlyPayment": "Monthly Payment:",
    "totalPaid": "Total Paid:",
    "totalInterest": "Total Interest:"
  },
  "validation": {
    "tooLow": "Amount must be at least {{min}}",
    "tooHigh": "Amount must not exceed {{max}}",
    "invalidFormat": "Please enter a valid amount"
  },
  "currency": {
    "label": "Currency"
  },
  "language": {
    "label": "Language",
    "loading": "Loading language...",
    "error": "Failed to load language. Please try again."
  }
}
```

### Key Naming Convention

- Use dot notation: `<section>.<element>`
- Descriptive names: `loanAmount.label` not `la.l`
- Consistent casing: camelCase throughout
- Variable interpolation: `{{variableName}}` for dynamic content

**Rationale**: Clear hierarchical structure makes translations maintainable and prevents naming collisions.

---

## Summary of Key Decisions

| # | Decision | Choice | Justification |
|---|----------|--------|---------------|
| 1 | i18n Library | react-i18next + i18next | Industry standard, lazy-loading, type-safety, hooks API |
| 2 | Lazy-Loading | i18next-http-backend plugin | Built-in, caching included, error handling |
| 3 | Number Formatting | Intl.NumberFormat (native) | Zero dependencies, browser-native, automatic locale rules |
| 4 | Persistence | localStorage | Simple, synchronous, sufficient quota |
| 5 | Testing | Vitest + mocked i18next | Fast unit tests, integration tests with React Testing Library |
| 6 | Key Organization | Dot-notation namespaces | Clear hierarchy, prevents collisions |

---

## Implementation Notes

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

### Bundle Size Impact

- i18next core: ~8KB gzipped
- react-i18next: ~3KB gzipped
- i18next-http-backend: ~2KB gzipped
- **Total**: ~13KB (within acceptable range)

### Migration Path

1. Add dependencies
2. Create i18n infrastructure (`config.ts`, `I18nProvider.tsx`, hooks)
3. Create English translation file (extract all strings)
4. Update one component at a time (start with LanguageSelector)
5. Create German and Ukrainian translations (via translators or initial placeholders)
6. Update all components
7. Add integration tests

### Performance Considerations

- English bundled with app (no network delay on first load)
- German/Ukrainian lazy-loaded (2s constraint allows for 5KB file on slow 3G)
- i18next caches translations after first load
- No re-renders except when language actually changes (React.Context optimized)

---

**Phase 0 Complete**: All technical decisions resolved. Ready for Phase 1 (Design & Contracts).
