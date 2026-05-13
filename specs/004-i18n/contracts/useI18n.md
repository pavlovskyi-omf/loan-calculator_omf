# Contract: useI18n Hook API

**Feature**: 004-i18n  
**Contract Type**: React Hook Interface  
**Consumers**: All React components needing translation or language switching  
**Version**: 1.0.0

## Purpose

Defines the public API contract for the `useI18n` custom hook, which provides translation functions and language management to components.

## Hook Signature

```typescript
function useI18n(): UseI18nReturn
```

## Return Type

```typescript
interface UseI18nReturn {
  // Translation function
  t: TFunction;
  
  // Current language state
  currentLanguage: SupportedLanguage;
  
  // Language switching
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Available languages
  languages: LocaleConfig[];
  
  // Locale formatting helpers
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
}
```

## API Members

### `t: TFunction`

Translation function for retrieving localized strings.

**Signature**:
```typescript
type TFunction = (key: string, options?: Record<string, any>) => string;
```

**Usage**:
```typescript
const { t } = useI18n();

// Simple translation
const label = t('loanAmount.label'); // "Loan Amount" (en) | "Kreditbetrag" (de)

// With interpolation
const error = t('validation.tooLow', { min: '1,500' }); 
// "Amount must be at least 1,500"

// Nested keys
const heading = t('details.heading'); // "Selected Scenario"
```

**Guarantees**:
- ✅ Always returns a string (never undefined/null)
- ✅ Falls back to key name if translation missing
- ✅ Interpolates variables via `{{variableName}}` syntax
- ✅ Re-renders component when language changes

**Error Handling**:
- Missing key → returns key name (e.g., `t('missing')` → `'missing'`)
- Invalid interpolation → returns string with placeholder intact
- Logs warning to console in development mode

---

### `currentLanguage: SupportedLanguage`

Currently active language code.

**Type**: `'en' | 'de' | 'uk'`

**Guarantees**:
- ✅ Never null/undefined
- ✅ Always one of three supported languages
- ✅ Updates immediately after successful `changeLanguage()`

**Usage**:
```typescript
const { currentLanguage } = useI18n();

// Conditional rendering
{currentLanguage === 'de' && <GermanSpecificFeature />}

// Display current language
<span>Current: {currentLanguage}</span>
```

---

### `changeLanguage: (lang: SupportedLanguage) => Promise<void>`

Asynchronously changes the active language.

**Parameters**:
- `lang`: Target language code (`'en'`, `'de'`, or `'uk'`)

**Behavior**:
1. Sets `isLoading` to `true`
2. Fetches translation file (if not cached)
3. Updates `currentLanguage` on success
4. Persists to localStorage
5. Sets `isLoading` to `false`
6. Triggers component re-render

**Return**: Promise that resolves when language change complete

**Guarantees**:
- ✅ Always resolves (never rejects)
- ✅ On error, reverts to fallback language (English)
- ✅ Sets `error` state if loading fails
- ✅ Persists language to localStorage on success
- ✅ Updates `document.documentElement.lang` attribute

**Error Handling**:
```typescript
const { changeLanguage, error } = useI18n();

await changeLanguage('de');
if (error) {
  // Network request failed, still on English
  console.error('Failed to load German:', error);
}
```

**Usage**:
```typescript
const { changeLanguage, isLoading } = useI18n();

const handleLanguageChange = async (lang: SupportedLanguage) => {
  await changeLanguage(lang);
  // Language changed, component re-rendered with new translations
};

// In JSX
<select 
  onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
  disabled={isLoading}
>
  {/* options */}
</select>
```

---

### `isLoading: boolean`

Indicates whether a language change is in progress.

**Values**:
- `true`: Translation file being fetched
- `false`: No active loading

**Guarantees**:
- ✅ Set to `true` immediately when `changeLanguage()` called
- ✅ Set to `false` when fetch completes (success or failure)
- ✅ Remains `false` when switching to cached language

**Usage**:
```typescript
const { isLoading } = useI18n();

{isLoading && <Spinner />}
<button disabled={isLoading}>Switch Language</button>
```

---

### `error: string | null`

Error message if language loading failed.

**Values**:
- `null`: No error
- `string`: Human-readable error message

**Guarantees**:
- ✅ Cleared on next successful language change
- ✅ Set when network request fails
- ✅ Set when translation file is invalid JSON
- ✅ Never contains sensitive information

**Error Messages**:
```typescript
"Failed to load translations for 'de'" // Network error
"Invalid translation file format"       // Parse error
```

**Usage**:
```typescript
const { error } = useI18n();

{error && (
  <Alert severity="error">
    {error}
    <button onClick={() => changeLanguage(currentLanguage)}>Retry</button>
  </Alert>
)}
```

---

### `languages: LocaleConfig[]`

Array of all supported languages with metadata.

**Type**: `LocaleConfig[]` (from data model)

**Structure**:
```typescript
[
  { code: 'en', name: 'English', localeCode: 'en-US', currencyCode: 'USD', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', localeCode: 'de-DE', currencyCode: 'EUR', direction: 'ltr' },
  { code: 'uk', name: 'Українська', localeCode: 'uk-UA', currencyCode: 'UAH', direction: 'ltr' },
]
```

**Guarantees**:
- ✅ Always contains exactly 3 elements
- ✅ Array is immutable (does not change)
- ✅ Ordered: English, German, Ukrainian

**Usage**:
```typescript
const { languages, currentLanguage } = useI18n();

<select value={currentLanguage}>
  {languages.map(lang => (
    <option key={lang.code} value={lang.code}>
      {lang.name}
    </option>
  ))}
</select>
```

---

### `formatNumber: (value: number) => string`

Formats a number according to current locale conventions.

**Parameters**:
- `value`: Number to format

**Returns**: Locale-formatted string

**Behavior**:
- Uses current language's locale code
- Applies locale-specific thousands/decimal separators
- Rounds to 0-2 decimal places

**Examples**:
```typescript
const { formatNumber, currentLanguage } = useI18n();

// currentLanguage = 'en'
formatNumber(7000.5);  // "7,000.5"

// currentLanguage = 'de'
formatNumber(7000.5);  // "7.000,5"

// currentLanguage = 'uk'
formatNumber(7000.5);  // "7 000,5"
```

**Guarantees**:
- ✅ Always returns a string
- ✅ Never throws errors (returns "0" for invalid input)
- ✅ Updates automatically when language changes

---

### `formatCurrency: (value: number) => string`

Formats a currency amount according to current locale and currency.

**Parameters**:
- `value`: Amount to format (in base currency units)

**Returns**: Locale-formatted currency string

**Behavior**:
- Uses current language's locale and currency code
- Applies currency symbol placement per locale
- Rounds to whole numbers (no cents)

**Examples**:
```typescript
const { formatCurrency, currentLanguage } = useI18n();

// currentLanguage = 'en' (USD)
formatCurrency(7000);  // "$7,000"

// currentLanguage = 'de' (EUR)
formatCurrency(7000);  // "7.000 €"

// currentLanguage = 'uk' (UAH)
formatCurrency(7000);  // "7 000 ₴"
```

**Guarantees**:
- ✅ Always returns a string
- ✅ Currency symbol positioned according to locale rules
- ✅ Never throws errors (returns "$0" for invalid input)

---

## Usage Examples

### Basic Translation

```typescript
import { useI18n } from '@/i18n/useI18n';

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

### Language Selector

```typescript
function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages, isLoading } = useI18n();
  
  return (
    <select 
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
      disabled={isLoading}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

### Formatted Numbers

```typescript
function PaymentTable() {
  const { formatCurrency } = useI18n();
  
  return (
    <table>
      <tbody>
        {payments.map(payment => (
          <td key={payment}>{formatCurrency(payment)}</td>
        ))}
      </tbody>
    </table>
  );
}
```

### Error Handling

```typescript
function LanguageSwitcher() {
  const { changeLanguage, error, isLoading } = useI18n();
  const [showError, setShowError] = useState(false);
  
  const handleChange = async (lang: SupportedLanguage) => {
    setShowError(false);
    await changeLanguage(lang);
    if (error) {
      setShowError(true);
    }
  };
  
  return (
    <>
      <select onChange={(e) => handleChange(e.target.value as SupportedLanguage)}>
        {/* options */}
      </select>
      {showError && <Alert>{error}</Alert>}
      {isLoading && <Spinner />}
    </>
  );
}
```

---

## Breaking Changes Policy

This is a **public API contract**. Any changes to method signatures, return types, or behavior guarantees constitute breaking changes and require:

1. Major version bump
2. Migration guide
3. Deprecation warnings (if possible)
4. Update to this contract document

**Non-breaking changes**:
- Adding new optional properties
- Adding new methods
- Internal implementation changes
- Performance improvements

**Breaking changes**:
- Changing method signatures
- Removing methods or properties
- Changing return types
- Changing error behavior

---

## Testing Requirements

All consumers of this hook must be able to:

1. Mock `useI18n` in unit tests
2. Provide test translations
3. Assert on translation keys used
4. Simulate loading states
5. Simulate error states

**Test Helper**:
```typescript
// src/test/mocks/useI18n.ts
export const mockUseI18n = (overrides?: Partial<UseI18nReturn>): UseI18nReturn => ({
  t: (key: string) => key, // Return key as-is for testing
  currentLanguage: 'en',
  changeLanguage: vi.fn().mockResolvedValue(undefined),
  isLoading: false,
  error: null,
  languages: mockLanguages,
  formatNumber: (n) => n.toString(),
  formatCurrency: (n) => `$${n}`,
  ...overrides,
});
```

---

**Contract Version**: 1.0.0  
**Stability**: Stable  
**Last Updated**: 2026-03-19
