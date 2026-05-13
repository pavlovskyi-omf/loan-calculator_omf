
import { useI18n } from '../i18n'

interface CurrencyDropdownProps {
  value: string
  onChange: (value: string) => void
  options?: string[]
}

export function CurrencyDropdown({ value, onChange, options = ['USD', 'EUR', 'UAH'] }: CurrencyDropdownProps) {
  const { t } = useI18n()
  
  return (
    <label className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('currency.label')}:</span>
      <select
        aria-label="Select currency"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ml-2 border rounded px-2 py-1"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}

export default CurrencyDropdown
