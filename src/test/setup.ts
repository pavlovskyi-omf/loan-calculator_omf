import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock i18n globally
vi.mock('../i18n/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    currentLanguage: 'en',
    changeLanguage: vi.fn().mockResolvedValue(undefined),
    isLoading: false,
    error: null,
    languages: {
      en: { code: 'en', name: 'English', localeCode: 'en-US', currencyCode: 'USD', direction: 'ltr' },
      de: { code: 'de', name: 'Deutsch', localeCode: 'de-DE', currencyCode: 'EUR', direction: 'ltr' },
      uk: { code: 'uk', name: 'Українська', localeCode: 'uk-UA', currencyCode: 'UAH', direction: 'ltr' },
    },
    formatNumber: (value: number) => value.toLocaleString('en-US'),
    formatCurrency: (value: number) => `$${value.toLocaleString('en-US')}`,
  }),
}))
