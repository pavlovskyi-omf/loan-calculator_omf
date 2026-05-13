import i18next from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../domain/config'
import { enTranslations } from '../locales/en'

/**
 * Initialize i18next with HTTP backend for lazy-loading translations.
 * 
 * Configuration:
 * - Default language: English (bundled inline)
 * - Fallback language: English
 * - Lazy-load German and Ukrainian from /locales/
 * - No browser language detection (always default to English)
 */
i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    
    // Bundle English translations inline for immediate availability
    resources: {
      en: {
        translation: enTranslations,
      },
    },
    
    // Tell i18next that only some languages are bundled, others need loading
    partialBundledLanguages: true,
    
    // Only lazy-load non-English languages (use Vite base URL)
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}.json`,
    },
    
    react: {
      useSuspense: false, // Handle loading manually
    },
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Disable debug mode in production
    debug: import.meta.env.DEV,
  })

// Error handling for failed translations
i18next.on('failedLoading', (lng, _ns, msg) => {
  console.error(`Failed loading language '${lng}':`, msg)
})

export default i18next
