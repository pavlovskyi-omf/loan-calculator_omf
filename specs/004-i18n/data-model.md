# Data Model: i18n Translation Structure

**Feature**: 004-i18n  
**Date**: 2026-03-19  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data structures for translations, locale configuration, and i18n state management.

## Core Entities

### 1. SupportedLanguage

Represents a language supported by the application.

**Structure**:
```typescript
type SupportedLanguage = 'en' | 'de' | 'uk';
```

**Values**:
- `'en'`: English (default, bundled)
- `'de'`: German (Deutsch, lazy-loaded)
- `'uk'`: Ukrainian (Українська, lazy-loaded)

**Validation Rules**:
- Must be one of the three supported values
- Case-sensitive (lowercase ISO 639-1 codes)

---

### 2. LocaleConfig

Configuration for a specific locale including formatting rules.

**Structure**:
```typescript
interface LocaleConfig {
  code: SupportedLanguage;           // Language code
  name: string;                      // Display name in native language
  localeCode: string;                // BCP 47 locale code for Intl APIs
  currencyCode: string;              // ISO 4217 currency code
  direction: 'ltr' | 'rtl';          // Text direction (all 'ltr' for our languages)
}
```

**Examples**:
```typescript
const localeConfigs: Record<SupportedLanguage, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    localeCode: 'en-US',
    currencyCode: 'USD',
    direction: 'ltr',
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    localeCode: 'de-DE',
    currencyCode: 'EUR',
    direction: 'ltr',
  },
  uk: {
    code: 'uk',
    name: 'Українська',
    localeCode: 'uk-UA',
    currencyCode: 'UAH',
    direction: 'ltr',
  },
};
```

**Relationships**:
- `localeCode` maps to `Intl.NumberFormat` locale parameter
- `currencyCode` used for currency symbol display

---

### 3. Translations

Complete translation dictionary for a language.

**Structure**:
```typescript
interface Translations {
  loanAmount: {
    label: string;
    placeholder: string;
    button: string;
  };
  apr: {
    label: string;
    decrease: string;  // ARIA label for decrease button
    increase: string;  // ARIA label for increase button
  };
  table: {
    term: string;
    months: string;    // e.g., "months" suffix
  };
  details: {
    heading: string;
    loanAmount: string;
    term: string;
    monthlyPayment: string;
    totalPaid: string;
    totalInterest: string;
  };
  validation: {
    tooLow: string;    // Supports {{min}} interpolation
    tooHigh: string;   // Supports {{max}} interpolation
    invalidFormat: string;
  };
  currency: {
    label: string;
  };
  language: {
    label: string;
    loading: string;
    error: string;
  };
  notifications: {
    ratesLoaded: string;
    ratesError: string;
    ratesStale: string;
  };
}
```

**Interpolation Variables**:
- `{{min}}`: Minimum loan amount (formatted)
- `{{max}}`: Maximum loan amount (formatted)
- Used in validation messages

**Validation Rules**:
- All keys must be present in all language files (no partial translations)
- Strings cannot be empty
- Interpolation variables must match across languages
- No HTML markup allowed (plain text only)

---

### 4. I18nState

Runtime state of the i18n system.

**Structure**:
```typescript
interface I18nState {
  currentLanguage: SupportedLanguage;   // Currently active language
  isLoading: boolean;                    // True when fetching translation file
  error: string | null;                  // Error message if loading failed
  availableLanguages: SupportedLanguage[]; // All supported languages
}
```

**State Transitions**:
```
Initial (en, !loading, null error)
    ↓
Language Change Requested (en, loading, null error)
    ↓
  Success: (de, !loading, null error)
  Failure: (en, !loading, "error message")
```

**Business Rules**:
- `currentLanguage` must always be a valid `SupportedLanguage`
- `isLoading` true only during fetch operation
- On error, `currentLanguage` remains unchanged (fallback behavior)
- `error` cleared on next successful language change

---

### 5. Translation File Schema (JSON)

Physical structure of translation files in `/locales/*.json`.

**Schema**:
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
  },
  "notifications": {
    "ratesLoaded": "Exchange rates updated successfully",
    "ratesError": "Failed to load exchange rates",
    "ratesStale": "Using cached exchange rates"
  }
}
```

**File Naming**:
- `en.json`: English (bundled with app, served from build output)
- `de.json`: German (lazy-loaded via HTTP request to `/locales/de.json`)
- `uk.json`: Ukrainian (lazy-loaded via HTTP request to `/locales/uk.json`)

**Validation**:
- Valid JSON required
- Must match `Translations` interface structure
- File size target: <5KB uncompressed per file

---

## Data Relationships

```
LocaleConfig
    ↓ (provides locale code)
Intl.NumberFormat → Number Formatting
    ↓
Component Display

I18nState
    ↓ (current language)
Translation File (JSON)
    ↓ (loaded via i18next)
Translations (in-memory)
    ↓ (accessed via useTranslation hook)
Component Text
```

---

## Persistence Schema

### localStorage

**Key**: `'app_language'`  
**Value**: `SupportedLanguage` (string: `'en'`, `'de'`, or `'uk'`)  
**Example**: `localStorage.setItem('app_language', 'de')`

**Read Logic**:
```typescript
function getInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem('app_language');
  if (stored === 'en' || stored === 'de' || stored === 'uk') {
    return stored;
  }
  return 'en'; // fallback
}
```

**Write Logic**:
```typescript
function persistLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem('app_language', lang);
  } catch (error) {
    console.warn('Failed to persist language preference:', error);
    // Continue without persistence (graceful degradation)
  }
}
```

---

## Number/Currency Formatting Data

### Formatting Parameters

**Structure**:
```typescript
interface NumberFormatOptions {
  locale: string;                    // BCP 47 locale code (e.g., 'de-DE')
  minimumFractionDigits: number;     // e.g., 0 for whole dollar payments
  maximumFractionDigits: number;     // e.g., 2 for precise amounts
}

interface CurrencyFormatOptions extends NumberFormatOptions {
  style: 'currency';
  currency: string;                  // ISO 4217 code (e.g., 'EUR')
}
```

**Locale-Specific Results**:

| Locale   | Input    | Number Output | Currency Output (USD/EUR/UAH) |
|----------|----------|---------------|-------------------------------|
| `en-US`  | 7000.5   | 7,000.5       | $7,001                        |
| `de-DE`  | 7000.5   | 7.000,5       | 7.001 €                       |
| `uk-UA`  | 7000.5   | 7 000,5       | 7 001 ₴                       |

*Note*: Currency formatting automatically uses appropriate separators and symbol placement per locale.

---

## Type Safety

### TypeScript Module Augmentation

Extend i18next types for autocomplete and type-checking:

```typescript
// src/i18n/types.ts
import 'react-i18next';
import type { Translations } from './translations';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: Translations;
    };
  }
}
```

**Benefits**:
- Autocomplete for translation keys: `t('loanAmount.label')`
- Compile-time errors for missing/typo'd keys
- Refactoring safety (rename key → TypeScript error if not updated)

---

## Validation Rules Summary

### Translation Files
- ✅ Must be valid JSON
- ✅ Must contain all keys from `Translations` interface
- ✅ No empty strings
- ✅ Interpolation variables must match (e.g., `{{min}}` present where expected)
- ✅ Plain text only (no HTML)
- ✅ <5KB uncompressed

### Language Codes
- ✅ Must be one of: `'en'`, `'de'`, `'uk'`
- ✅ Lowercase only
- ✅ Stored in localStorage as-is

### Locale Codes
- ✅ Must be valid BCP 47 codes
- ✅ Used with `Intl.NumberFormat` and `Intl.DateTimeFormat`

### State Management
- ✅ `currentLanguage` never null/undefined
- ✅ `error` cleared on successful language switch
- ✅ `isLoading` true only during async fetch

---

## Migration & Compatibility

### Existing Code Impact

**`src/domain/currency.ts`**:
- Already uses `Intl.NumberFormat` ✅
- Will add locale parameter to formatting functions
- Backward compatible: defaults to `'en-US'` if locale not provided

**Components**:
- Replace hardcoded strings: `"Loan Amount"` → `t('loanAmount.label')`
- Add `useTranslation()` hook
- No changes to logic, only presentation

**Tests**:
- Mock i18next in `test/setup.ts`
- Existing tests continue to work with English defaults
- Add new tests for language switching

---

**Phase 1 Data Model Complete**: Entity definitions, relationships, and validation rules established. Ready for contract definition.
