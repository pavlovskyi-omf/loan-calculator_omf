import type { SupportedLanguage } from '../domain/config'

/**
 * Complete translation dictionary for a language.
 */
export interface Translations {
  loanAmount: {
    label: string
    placeholder: string
    button: string
  }
  apr: {
    label: string
    decrease: string // ARIA label for decrease button
    increase: string // ARIA label for increase button
  }
  table: {
    term: string
    months: string // e.g., "months" suffix
  }
  details: {
    heading: string
    loanAmount: string
    term: string
    monthlyPayment: string
    totalPaid: string
    totalInterest: string
  }
  validation: {
    tooLow: string // Supports {{min}} interpolation
    tooHigh: string // Supports {{max}} interpolation
    invalidFormat: string
  }
  currency: {
    label: string
  }
  language: {
    label: string
    loading: string
    error: string
  }
  notifications: {
    ratesLoaded: string
    ratesError: string
    ratesStale: string
  }
}

/**
 * Runtime state of the i18n system.
 */
export interface I18nState {
  currentLanguage: SupportedLanguage
  isLoading: boolean
  error: string | null
  availableLanguages: SupportedLanguage[]
}
