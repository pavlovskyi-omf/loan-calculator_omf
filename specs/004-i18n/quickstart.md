# Quickstart: Using i18n in the Loan Calculator

**Feature**: 004-i18n  
**Audience**: Developers working on the Personal Loan Calculator  
**Last Updated**: 2026-03-19

## Overview

This guide shows you how to use the i18n (internationalization) system to add translations to components and manage multiple languages in the application.

---

## Table of Contents

1. [Adding Translations to Components](#adding-translations-to-components)
2. [Adding New Translation Keys](#adding-new-translation-keys)
3. [Formatting Numbers and Currency](#formatting-numbers-and-currency)
4. [Creating the Language Selector](#creating-the-language-selector)
5. [Testing i18n Components](#testing-i18n-components)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Adding Translations to Components

### Step 1: Import the Hook

```typescript
import { useI18n } from '@/i18n/useI18n';
```

### Step 2: Use the Translation Function

```typescript
function LoanAmountInput() {
  const { t } = useI18n();
  
  return (
    <div>
      <label>{t('loanAmount.label')}</label>
      <input placeholder={t('loanAmount.placeholder')} />
      <button>{t('loanAmount.button')}</button>
    </div>
  );
}
```

### Before and After Example

**Before (hardcoded strings)**:
```typescript
function AprControl() {
  return (
    <div>
      <div className="text-sm">Annual Percentage Rate</div>
      <IconButton aria-label="Decrease APR">
        <Remove />
      </IconButton>
      <IconButton aria-label="Increase APR">
        <Add />
      </IconButton>
    </div>
  );
}
```

**After (with i18n)**:
```typescript
function AprControl() {
  const { t } = useI18n();
  
  return (
    <div>
      <div className="text-sm">{t('apr.label')}</div>
      <IconButton aria-label={t('apr.decrease')}>
        <Remove />
      </IconButton>
      <IconButton aria-label={t('apr.increase')}>
        <Add />
      </IconButton>
    </div>
  );
}
```

---

## Adding New Translation Keys

### Step 1: Update Translation Files

Add the key to **all three** language files:

**`public/locales/en.json`**:
```json
{
  "myNewFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

**`public/locales/de.json`**:
```json
{
  "myNewFeature": {
    "title": "Neue Funktion",
    "description": "Dies ist eine neue Funktion"
  }
}
```

**`public/locales/uk.json`**:
```json
{
  "myNewFeature": {
    "title": "Нова функція",
    "description": "Це нова функція"
  }
}
```

### Step 2: Update TypeScript Types (Optional but Recommended)

Add to `src/i18n/types.ts`:

```typescript
interface Translations {
  // ... existing keys ...
  myNewFeature: {
    title: string;
    description: string;
  };
}
```

This gives you autocomplete and type-safety:

```typescript
const { t } = useI18n();
t('myNewFeature.title'); // ✅ Autocomplete works
t('myNewFeature.typo');  // ❌ TypeScript error
```

### Step 3: Use in Components

```typescript
function MyNewFeature() {
  const { t } = useI18n();
  
  return (
    <div>
      <h2>{t('myNewFeature.title')}</h2>
      <p>{t('myNewFeature.description')}</p>
    </div>
  );
}
```

---

## Formatting Numbers and Currency

### Formatting Numbers

Use `formatNumber` for values without currency symbols:

```typescript
function PaymentTable() {
  const { formatNumber } = useI18n();
  
  const interestRate = 10.5;
  
  return <div>{formatNumber(interestRate)}%</div>;
  // English: "10.5%"
  // German: "10,5%"
  // Ukrainian: "10,5%"
}
```

### Formatting Currency

Use `formatCurrency` for monetary values:

```typescript
function SelectedDetails({ monthlyPayment }: { monthlyPayment: number }) {
  const { formatCurrency } = useI18n();
  
  return (
    <div>
      <span>Monthly Payment:</span>
      <span className="text-2xl font-bold">
        {formatCurrency(monthlyPayment)}
      </span>
    </div>
  );
  // English: "$450"
  // German: "450 €"
  // Ukrainian: "450 ₴"
}
```

### Using Domain Functions (Alternative)

For more control, use domain functions directly:

```typescript
import { formatNumberByLocale, formatCurrencyByLocale } from '@/domain/locale';
import { useI18n } from '@/i18n/useI18n';

function CustomFormat() {
  const { currentLanguage } = useI18n();
  const localeCode = getLocaleCode(currentLanguage); // 'en-US', 'de-DE', 'uk-UA'
  
  const formatted = formatNumberByLocale(7000.5, localeCode);
  return <div>{formatted}</div>;
}
```

---

## Creating the Language Selector

### Basic Dropdown

```typescript
import { useI18n } from '@/i18n/useI18n';

function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages } = useI18n();
  
  return (
    <select 
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

### With Loading State

```typescript
function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages, isLoading, t } = useI18n();
  
  return (
    <div>
      <label>{t('language.label')}</label>
      <select 
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
        disabled={isLoading}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      {isLoading && <span>{t('language.loading')}</span>}
    </div>
  );
}
```

### With Error Handling

```typescript
function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages, error, t } = useI18n();
  const [showError, setShowError] = useState(false);
  
  const handleChange = async (lang: SupportedLanguage) => {
    setShowError(false);
    await changeLanguage(lang);
    if (error) {
      setShowError(true);
    }
  };
  
  return (
    <div>
      <select 
        value={currentLanguage}
        onChange={(e) => handleChange(e.target.value as SupportedLanguage)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      
      {showError && (
        <div className="error">
          {t('language.error')}
          <button onClick={() => handleChange(currentLanguage)}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Testing i18n Components

### Mocking useI18n Hook

Create a test helper (`src/test/mocks/useI18n.ts`):

```typescript
import { vi } from 'vitest';
import type { UseI18nReturn } from '@/i18n/useI18n';

export const mockUseI18n = (overrides?: Partial<UseI18nReturn>): UseI18nReturn => ({
  t: (key: string) => key, // Return key as translation for testing
  currentLanguage: 'en',
  changeLanguage: vi.fn().mockResolvedValue(undefined),
  isLoading: false,
  error: null,
  languages: [
    { code: 'en', name: 'English', localeCode: 'en-US', currencyCode: 'USD', direction: 'ltr' },
    { code: 'de', name: 'Deutsch', localeCode: 'de-DE', currencyCode: 'EUR', direction: 'ltr' },
    { code: 'uk', name: 'Українська', localeCode: 'uk-UA', currencyCode: 'UAH', direction: 'ltr' },
  ],
  formatNumber: (n) => n.toLocaleString('en-US'),
  formatCurrency: (n) => `$${n.toLocaleString('en-US')}`,
  ...overrides,
});
```

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { LoanAmountInput } from './LoanAmountInput';
import * as useI18nModule from '@/i18n/useI18n';
import { mockUseI18n } from '@/test/mocks/useI18n';

describe('LoanAmountInput', () => {
  beforeEach(() => {
    vi.spyOn(useI18nModule, 'useI18n').mockReturnValue(mockUseI18n());
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('displays translated label', () => {
    render(<LoanAmountInput value="" onChange={vi.fn()} />);
    
    expect(screen.getByText('loanAmount.label')).toBeInTheDocument();
  });
  
  it('uses translation for button', () => {
    render(<LoanAmountInput value="" onChange={vi.fn()} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('loanAmount.button');
  });
});
```

### Integration Test Example

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('Language Switching', () => {
  it('changes UI text when language is switched', async () => {
    render(<App />);
    
    // Initial language is English
    expect(screen.getByText('Loan Amount')).toBeInTheDocument();
    
    // Switch to German
    const languageSelector = screen.getByLabelText('Language');
    await userEvent.selectOptions(languageSelector, 'de');
    
    // Wait for German translations to load
    await waitFor(() => {
      expect(screen.getByText('Kreditbetrag')).toBeInTheDocument();
    });
  });
  
  it('persists language selection', async () => {
    const { unmount } = render(<App />);
    
    // Switch to Ukrainian
    await userEvent.selectOptions(screen.getByLabelText('Language'), 'uk');
    
    // Check localStorage
    expect(localStorage.getItem('app_language')).toBe('uk');
    
    // Unmount and remount
    unmount();
    render(<App />);
    
    // Should still be Ukrainian
    await waitFor(() => {
      expect(screen.getByText('Сума кредиту')).toBeInTheDocument();
    });
  });
});
```

---

## Common Patterns

### Pattern 1: Validation Messages with Interpolation

```typescript
function validateAmount(amount: number, min: number, max: number) {
  const { t, formatCurrency } = useI18n();
  
  if (amount < min) {
    return {
      isValid: false,
      message: t('validation.tooLow', { min: formatCurrency(min) })
    };
  }
  
  if (amount > max) {
    return {
      isValid: false,
      message: t('validation.tooHigh', { max: formatCurrency(max) })
    };
  }
  
  return { isValid: true, message: '' };
}
```

### Pattern 2: Conditional Text

```typescript
function PaymentSummary({ term }: { term: number }) {
  const { t } = useI18n();
  
  // Use translation key based on condition
  const termLabel = t('table.months'); // Always plural in our case
  
  return <div>{term} {termLabel}</div>;
}
```

### Pattern 3: List Rendering

```typescript
function PaymentTable({ terms }: { terms: number[] }) {
  const { t, formatCurrency } = useI18n();
  
  return (
    <table>
      <thead>
        <tr>
          <th>{t('table.term')}</th>
          {/* other headers */}
        </tr>
      </thead>
      <tbody>
        {terms.map((term) => (
          <tr key={term}>
            <td>{term} {t('table.months')}</td>
            {/* other cells */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Pattern 4: Dynamic Content

```typescript
function DetailsSection({ details }: DetailsProps) {
  const { t, formatCurrency } = useI18n();
  
  const rows = [
    { label: t('details.loanAmount'), value: formatCurrency(details.amount) },
    { label: t('details.term'), value: `${details.term} ${t('table.months')}` },
    { label: t('details.monthlyPayment'), value: formatCurrency(details.monthly) },
    { label: t('details.totalPaid'), value: formatCurrency(details.total) },
    { label: t('details.totalInterest'), value: formatCurrency(details.interest) },
  ];
  
  return (
    <div>
      {rows.map(({ label, value }) => (
        <div key={label}>
          <span>{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## Troubleshooting

### Issue: Translation key returns the key itself

**Symptom**: `t('loanAmount.label')` returns `"loanAmount.label"` instead of translation

**Causes**:
1. Key missing from current language file
2. Translation file failed to load
3. i18n not initialized

**Solution**:
```typescript
// Check if translation exists in file
// public/locales/en.json should have:
{
  "loanAmount": {
    "label": "Loan Amount"
  }
}

// Check browser console for warnings
// i18next will log missing keys in development
```

### Issue: Numbers not formatting correctly

**Symptom**: Numbers show as "7000.5" in all languages

**Cause**: Using `toString()` instead of `formatNumber()`

**Solution**:
```typescript
// ❌ Wrong
<div>{amount.toString()}</div>

// ✅ Correct
const { formatNumber } = useI18n();
<div>{formatNumber(amount)}</div>
```

### Issue: Language doesn't change

**Symptom**: Selecting language doesn't update UI

**Causes**:
1. Not awaiting `changeLanguage()`
2. Component not using `useI18n` hook
3. Translation file failed to load

**Solution**:
```typescript
// Make sure you await
const handleChange = async (lang: SupportedLanguage) => {
  await changeLanguage(lang);
  // Check error state
  if (error) {
    console.error('Failed to load language:', error);
  }
};

// Check browser Network tab for 404s on /locales/*.json
```

### Issue: Language doesn't persist

**Symptom**: Language resets to English on page refresh

**Causes**:
1. localStorage disabled
2. Private browsing mode
3. localStorage quota exceeded

**Solution**:
```typescript
// Check if localStorage available
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage available');
} catch (e) {
  console.error('localStorage not available:', e);
}

// App should still work without persistence (graceful degradation)
```

### Issue: Tests failing with i18n

**Symptom**: Test errors about missing `useI18n` hook

**Solution**: Mock the hook in your test setup

```typescript
// src/test/setup.ts
import { vi } from 'vitest';
import * as useI18nModule from '@/i18n/useI18n';
import { mockUseI18n } from '@/test/mocks/useI18n';

// Global mock for tests
vi.spyOn(useI18nModule, 'useI18n').mockReturnValue(mockUseI18n());
```

---

## Quick Reference

### Import Statement
```typescript
import { useI18n } from '@/i18n/useI18n';
```

### Hook Destructuring
```typescript
const { t, currentLanguage, changeLanguage, isLoading, error, languages, formatNumber, formatCurrency } = useI18n();
```

### Common Operations
```typescript
// Translate
t('loanAmount.label')

// Translate with variables
t('validation.tooLow', { min: '1,500' })

// Format number
formatNumber(7000.5) // "7,000.5" (en) | "7.000,5" (de) | "7 000,5" (uk)

// Format currency
formatCurrency(7000) // "$7,000" (en) | "7.000 €" (de) | "7 000 ₴" (uk)

// Change language
await changeLanguage('de')

// Check loading
{isLoading && <Spinner />}

// Check error
{error && <Alert>{error}</Alert>}
```

---

## Next Steps

1. **Review existing components** and identify hardcoded strings
2. **Extract strings** to translation files (start with English)
3. **Update components** to use `useI18n` hook
4. **Add tests** for i18n behavior
5. **Get professional translations** for German and Ukrainian
6. **Validate** all translations match schema

For detailed contracts and API documentation, see:
- [useI18n Hook Contract](contracts/useI18n.md)
- [Translation Schema](contracts/translation-schema.md)
- [Data Model](data-model.md)

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-19
