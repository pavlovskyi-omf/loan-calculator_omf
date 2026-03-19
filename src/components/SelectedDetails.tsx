import type { ExchangeRate } from '../domain/currency'
import { formatCurrency, formatCurrencyWithCode, convertAmount } from '../domain/currency'
import { useI18n } from '../i18n'

interface SelectedDetailsProps {
  amount: number
  term: number
  monthlyPayment: number
  totalPaid: number
  totalInterest: number
  selectedCurrency?: string
  rates?: ExchangeRate | null
}

export function SelectedDetails({
  amount,
  term,
  monthlyPayment,
  totalPaid,
  totalInterest,
  selectedCurrency,
  rates,
}: SelectedDetailsProps) {
  const { t } = useI18n()
  
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white space-y-4 mt-6">
      <h3 className="text-xl font-semibold text-gray-900">{t('details.heading')}</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('details.loanAmount')}</span>
          <span className="font-medium">
            {selectedCurrency && selectedCurrency !== 'USD' && rates
              ? formatCurrencyWithCode(convertAmount(amount, selectedCurrency, rates), selectedCurrency)
              : formatCurrency(amount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">{t('details.term')}</span>
          <span className="font-medium">{term} {t('table.months')}</span>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        <div className="flex justify-between">
          <span className="text-gray-600">{t('details.monthlyPayment')}</span>
          <span className="text-2xl font-bold text-blue-600">
            {selectedCurrency && selectedCurrency !== 'USD' && rates
              ? formatCurrencyWithCode(convertAmount(monthlyPayment, selectedCurrency, rates), selectedCurrency)
              : formatCurrency(monthlyPayment)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">{t('details.totalPaid')}</span>
          <span className="font-medium">
            {selectedCurrency && selectedCurrency !== 'USD' && rates
              ? formatCurrencyWithCode(convertAmount(totalPaid, selectedCurrency, rates), selectedCurrency)
              : formatCurrency(totalPaid)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">{t('details.totalInterest')}</span>
          <span className="font-medium text-red-600">
            {selectedCurrency && selectedCurrency !== 'USD' && rates
              ? formatCurrencyWithCode(convertAmount(totalInterest, selectedCurrency, rates), selectedCurrency)
              : formatCurrency(totalInterest)}
          </span>
        </div>
      </div>
    </div>
  )
}
