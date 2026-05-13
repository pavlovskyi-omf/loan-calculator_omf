import { useTranslation } from 'react-i18next'
import { useMemo, useCallback } from 'react'
import type { SupportedLanguage } from '../domain/config'
import { localeConfigs } from './config'

export interface UseI18nReturn {
  // Translation function
  t: (key: string, options?: Record<string, unknown>) => string
  
  // Current language state
  currentLanguage: SupportedLanguage
  
  // Language switching
  changeLanguage: (lang: SupportedLanguage) => Promise<void>
  
  // Loading state
  isLoading: boolean
  
  // Error state
  error: string | null
  
  // Available languages
  languages: typeof localeConfigs
  
  // Locale formatting helpers
  formatNumber: (value: number) => string
  formatCurrency: (value: number) => string
}

/**
 * Custom hook for internationalization.
 * Provides translation, language switching, and locale formatting.
 */
export function useI18n(): UseI18nReturn {
  const { t, i18n } = useTranslation()
  
  const currentLanguage = (i18n.language || 'en') as SupportedLanguage
  const isLoading = false // i18n is always ready since English is bundled
  
  // Change language and persist to localStorage
  const changeLanguage = useCallback(async (lang: SupportedLanguage) => {
    try {
      await i18n.changeLanguage(lang)
      localStorage.setItem('app_language', lang)
      document.documentElement.lang = lang
    } catch (err) {
      console.error(`Failed to change language to '${lang}':`, err)
      throw err
    }
  }, [i18n])
  
  // Get current locale config
  const currentLocaleConfig = useMemo(
    () => localeConfigs[currentLanguage],
    [currentLanguage]
  )
  
  // Format number according to current locale
  const formatNumber = useCallback(
    (value: number): string => {
      try {
        return new Intl.NumberFormat(currentLocaleConfig.localeCode, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value)
      } catch {
        return '0'
      }
    },
    [currentLocaleConfig]
  )
  
  // Format currency according to current locale
  const formatCurrency = useCallback(
    (value: number): string => {
      try {
        return new Intl.NumberFormat(currentLocaleConfig.localeCode, {
          style: 'currency',
          currency: currentLocaleConfig.currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)
      } catch {
        return '$0'
      }
    },
    [currentLocaleConfig]
  )
  
  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoading,
    error: null, // i18next doesn't expose errors directly, handle via events
    languages: localeConfigs,
    formatNumber,
    formatCurrency,
  }
}
