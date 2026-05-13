import { useI18n } from '../i18n'
import type { SupportedLanguage } from '../domain/config'

export function LanguageSelector() {
  const { t, currentLanguage, changeLanguage, languages, isLoading } = useI18n()
  
  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value as SupportedLanguage
    await changeLanguage(lang)
  }
  
  return (
    <label className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('language.label')}:</span>
      <select
        aria-label={t('language.label')}
        value={currentLanguage}
        onChange={handleChange}
        disabled={isLoading}
        className="ml-2 border rounded px-2 py-1"
      >
        {Object.values(languages).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguageSelector
