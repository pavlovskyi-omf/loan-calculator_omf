// Configuration constants for the loan calculator
export const MIN_AMOUNT = 1500
export const MAX_AMOUNT = 100000
export const APR_MIN = 0
export const APR_MAX = 36
export const APR_STEP = 1
export const TERMS = [24, 36, 48, 60] as const
export const COMPARE_DELTA = 1000

// i18n configuration
export const SUPPORTED_LANGUAGES = ['en', 'de', 'uk'] as const
export const DEFAULT_LANGUAGE = 'en' as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]
