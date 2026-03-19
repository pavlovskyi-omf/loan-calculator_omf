import type { SupportedLanguage } from '../domain/config'

/**
 * Configuration for a specific locale including formatting rules.
 */
export interface LocaleConfig {
  code: SupportedLanguage
  name: string // Display name in native language
  localeCode: string // BCP 47 locale code for Intl APIs
  currencyCode: string // ISO 4217 currency code
  direction: 'ltr' | 'rtl' // Text direction
}

/**
 * Locale configurations for all supported languages.
 */
export const localeConfigs: Record<SupportedLanguage, LocaleConfig> = {
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
}
