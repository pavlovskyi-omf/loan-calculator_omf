# Contract: Translation File Schema

**Feature**: 004-i18n  
**Contract Type**: JSON File Format  
**Location**: `/public/locales/*.json`  
**Consumers**: i18next library, translators, build tooling  
**Version**: 1.0.0

## Purpose

Defines the authoritative JSON schema for all translation files. Ensures consistency across English, German, and Ukrainian translations.

## File Locations

```
public/locales/
├── en.json    # English (bundled with app)
├── de.json    # German (lazy-loaded)
└── uk.json    # Ukrainian (lazy-loaded)
```

## Schema Definition

### Root Structure

```typescript
interface TranslationFile {
  loanAmount: LoanAmountSection;
  apr: AprSection;
  table: TableSection;
  details: DetailsSection;
  validation: ValidationSection;
  currency: CurrencySection;
  language: LanguageSection;
  notifications: NotificationsSection;
}
```

### Section Schemas

#### 1. LoanAmount Section

```typescript
interface LoanAmountSection {
  label: string;        // Input label
  placeholder: string;  // Placeholder text (e.g., "$7,000")
  button: string;       // Calculate button text
}
```

**English Example**:
```json
{
  "loanAmount": {
    "label": "Loan Amount",
    "placeholder": "$7,000",
    "button": "Calculate"
  }
}
```

#### 2. APR Section

```typescript
interface AprSection {
  label: string;      // Main APR label
  decrease: string;   // ARIA label for minus button
  increase: string;   // ARIA label for plus button
}
```

**English Example**:
```json
{
  "apr": {
    "label": "Annual Percentage Rate",
    "decrease": "Decrease APR",
    "increase": "Increase APR"
  }
}
```

#### 3. Table Section

```typescript
interface TableSection {
  term: string;    // "Term" column header
  months: string;  // "months" suffix (e.g., "24 months")
}
```

**English Example**:
```json
{
  "table": {
    "term": "Term",
    "months": "months"
  }
}
```

#### 4. Details Section

```typescript
interface DetailsSection {
  heading: string;         // "Selected Scenario"
  loanAmount: string;      // "Loan Amount:" label
  term: string;            // "Term:" label
  monthlyPayment: string;  // "Monthly Payment:" label
  totalPaid: string;       // "Total Paid:" label
  totalInterest: string;   // "Total Interest:" label
}
```

**English Example**:
```json
{
  "details": {
    "heading": "Selected Scenario",
    "loanAmount": "Loan Amount:",
    "term": "Term:",
    "monthlyPayment": "Monthly Payment:",
    "totalPaid": "Total Paid:",
    "totalInterest": "Total Interest:"
  }
}
```

#### 5. Validation Section

```typescript
interface ValidationSection {
  tooLow: string;        // Supports {{min}} interpolation
  tooHigh: string;       // Supports {{max}} interpolation
  invalidFormat: string; // No interpolation
}
```

**English Example**:
```json
{
  "validation": {
    "tooLow": "Amount must be at least {{min}}",
    "tooHigh": "Amount must not exceed {{max}}",
    "invalidFormat": "Please enter a valid amount"
  }
}
```

**Interpolation Variables**:
- `{{min}}`: Minimum loan amount (pre-formatted with locale separators)
- `{{max}}`: Maximum loan amount (pre-formatted with locale separators)

#### 6. Currency Section

```typescript
interface CurrencySection {
  label: string;  // Currency dropdown label
}
```

**English Example**:
```json
{
  "currency": {
    "label": "Currency"
  }
}
```

#### 7. Language Section

```typescript
interface LanguageSection {
  label: string;    // Language selector label
  loading: string;  // Loading state message
  error: string;    // Error message for failed loading
}
```

**English Example**:
```json
{
  "language": {
    "label": "Language",
    "loading": "Loading language...",
    "error": "Failed to load language. Please try again."
  }
}
```

#### 8. Notifications Section

```typescript
interface NotificationsSection {
  ratesLoaded: string;  // Success message for exchange rates
  ratesError: string;   // Error message for exchange rates
  ratesStale: string;   // Warning for stale exchange rates
}
```

**English Example**:
```json
{
  "notifications": {
    "ratesLoaded": "Exchange rates updated successfully",
    "ratesError": "Failed to load exchange rates",
    "ratesStale": "Using cached exchange rates"
  }
}
```

---

## Complete English Reference (en.json)

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

---

## Validation Rules

### 1. Structural Validity

- ✅ Must be valid JSON (passes `JSON.parse()`)
- ✅ All sections must be present
- ✅ All keys within sections must be present
- ✅ No extra keys allowed (prevents typos)

### 2. Content Validity

- ✅ All strings must be non-empty (` "label": ""` is invalid)
- ✅ No HTML markup (plain text only)
- ✅ No script tags or executable code
- ✅ Unicode characters allowed (e.g., €, ₴, ü)

### 3. Interpolation Validity

- ✅ Variables must use `{{variableName}}` syntax
- ✅ `{{min}}` and `{{max}}` only in validation section
- ✅ Variable names must match across all languages
- ✅ No unmatched braces (e.g., `{min}}` invalid)

### 4. File Size

- ✅ Each file must be <5KB uncompressed
- ✅ Target: 2-3KB per file

### 5. Encoding

- ✅ UTF-8 encoding required
- ✅ No BOM (Byte Order Mark)

---

## Translation Guidelines for Translators

### General Rules

1. **Preserve Interpolation Variables**: `{{min}}` must remain as-is
2. **Maintain Tone**: Professional but approachable
3. **Keep Length Reasonable**: German can expand 20-30%, but avoid overly verbose translations
4. **Use Native Terms**: Don't transliterate English terms unless standard in target language

### Context Notes

| Key | Context | Notes for Translators |
|-----|---------|----------------------|
| `loanAmount.placeholder` | Input field | Include currency symbol appropriate for language |
| `apr.decrease/increase` | Screen reader only | Must be descriptive for accessibility |
| `table.months` | Follows number (e.g., "24 months") | Consider grammar/declension in target language |
| `validation.tooLow/tooHigh` | Error message | `{{min}}`/`{{max}}` will be replaced with formatted number |

### Example: German Declension

English: "24 months"  
German: "24 Monate" (not "24 Monat")

Ensure plural form is used in `table.months` since all terms (24/36/48/60) are plural.

---

## Version Control

### Change Process

1. **New Key Addition**:
   - Update this contract first
   - Add key to all 3 language files
   - Update TypeScript interface in codebase

2. **Key Removal**:
   - Remove from all 3 language files simultaneously
   - Update contract documentation
   - Update TypeScript interface

3. **Key Renaming**:
   - Treat as removal + addition
   - Use git rename detection for history

### Breaking vs Non-Breaking Changes

**Non-Breaking**:
- Updating translation text (same key)
- Fixing typos
- Improving wording

**Breaking**:
- Adding/removing keys
- Renaming keys
- Changing interpolation variables

---

## Testing & Validation

### Automated Validation Script

```typescript
// scripts/validate-translations.ts

import fs from 'fs';
import { TranslationFile } from '../src/i18n/types';

const LANGUAGES = ['en', 'de', 'uk'];
const MAX_SIZE_KB = 5;

function validateTranslations(): void {
  const errors: string[] = [];
  
  // Load English as reference
  const enPath = './public/locales/en.json';
  const enContent = fs.readFileSync(enPath, 'utf-8');
  const enTranslations: TranslationFile = JSON.parse(enContent);
  const enKeys = extractAllKeys(enTranslations);
  
  for (const lang of LANGUAGES) {
    const path = `./public/locales/${lang}.json`;
    
    // Check file exists
    if (!fs.existsSync(path)) {
      errors.push(`Missing file: ${path}`);
      continue;
    }
    
    // Check file size
    const stats = fs.statSync(path);
    if (stats.size / 1024 > MAX_SIZE_KB) {
      errors.push(`${path} exceeds ${MAX_SIZE_KB}KB limit`);
    }
    
    // Check JSON validity
    const content = fs.readFileSync(path, 'utf-8');
    let translations: TranslationFile;
    try {
      translations = JSON.parse(content);
    } catch (e) {
      errors.push(`${path} is not valid JSON: ${e.message}`);
      continue;
    }
    
    // Check all keys present
    const langKeys = extractAllKeys(translations);
    const missing = enKeys.filter(k => !langKeys.includes(k));
    const extra = langKeys.filter(k => !enKeys.includes(k));
    
    if (missing.length > 0) {
      errors.push(`${path} missing keys: ${missing.join(', ')}`);
    }
    if (extra.length > 0) {
      errors.push(`${path} has extra keys: ${extra.join(', ')}`);
    }
    
    // Check no empty strings
    const empty = findEmptyStrings(translations);
    if (empty.length > 0) {
      errors.push(`${path} has empty strings: ${empty.join(', ')}`);
    }
  }
  
  if (errors.length > 0) {
    console.error('Translation validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  
  console.log('✅ All translations valid');
}

function extractAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object') {
      keys = keys.concat(extractAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function findEmptyStrings(obj: any, prefix = ''): string[] {
  let empty: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object') {
      empty = empty.concat(findEmptyStrings(value, fullKey));
    } else if (typeof value === 'string' && value.trim() === '') {
      empty.push(fullKey);
    }
  }
  return empty;
}

validateTranslations();
```

**Run**: `npm run validate:translations` (add to CI/CD)

---

## Migration & Backwards Compatibility

### Initial Implementation

English translations will be extracted from current hardcoded strings:

```typescript
// Before
<label>Loan Amount</label>

// After
<label>{t('loanAmount.label')}</label>
```

German and Ukrainian translations provided by:
1. Professional translation service (preferred)
2. Initial placeholder translations (for development)
3. Machine translation + manual review (acceptable for demo)

### Handling Missing Keys

If a key is missing from a translation file (bug/incomplete translation):

1. i18next falls back to English translation
2. Warning logged to console (development)
3. Error reported to monitoring (production)

**Example**:
```
// de.json missing "newFeature.label"
t('newFeature.label') // Returns English value + logs warning
```

---

**Contract Version**: 1.0.0  
**Stability**: Stable  
**Last Updated**: 2026-03-19  
**Next Review**: After initial implementation
