import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { DEFAULT_LANGUAGE } from '../domain/config'

interface I18nProviderProps {
  children: ReactNode
}

/**
 * Provides i18n context to the application.
 * Initializes i18next and restores saved language preference.
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    // Wait for i18next to initialize
    if (i18n.isInitialized) {
      // Restore saved language from localStorage
      const savedLanguage = localStorage.getItem('app_language')
      if (savedLanguage && savedLanguage !== DEFAULT_LANGUAGE) {
        i18n.changeLanguage(savedLanguage).then(() => {
          document.documentElement.lang = savedLanguage
          setIsReady(true)
        })
      } else {
        document.documentElement.lang = DEFAULT_LANGUAGE
        setIsReady(true)
      }
    } else {
      // Wait for initialization
      i18n.on('initialized', () => {
        const savedLanguage = localStorage.getItem('app_language')
        if (savedLanguage && savedLanguage !== DEFAULT_LANGUAGE) {
          i18n.changeLanguage(savedLanguage).then(() => {
            document.documentElement.lang = savedLanguage
            setIsReady(true)
          })
        } else {
          document.documentElement.lang = DEFAULT_LANGUAGE
          setIsReady(true)
        }
      })
    }
  }, [])
  
  // Show nothing until i18next is ready
  if (!isReady) {
    return null
  }
  
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
