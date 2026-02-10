import { formatCurrency, formatCurrencyWithCode, convertAmount } from '../domain/currency'
import type { ExchangeRate } from '../domain/currency'

interface PaymentTableProps {
  terms: readonly number[]
  amounts: number[]
  payments: Map<number, Map<number, number>>
  selectedIndex: number
  activeTerm: number
  onTermSelect: (term: number) => void
  selectedCurrency?: string
  rates?: ExchangeRate | null
}

export function PaymentTable({
  terms,
  amounts,
  payments,
  selectedIndex,
  activeTerm,
  onTermSelect,
  selectedCurrency,
  rates,
}: PaymentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-50 p-3 text-left">Term</th>
                {amounts.map((amount, index) => (
              <th
                key={index}
                className={`border border-gray-300 p-3 text-center ${
                  index === selectedIndex ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                    {selectedCurrency && selectedCurrency !== 'USD' && rates
                      ? formatCurrencyWithCode(convertAmount(amount, selectedCurrency, rates), selectedCurrency)
                      : formatCurrency(amount)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {terms.map((term) => {
            const termPayments = payments.get(term)
            const isActive = term === activeTerm

            return (
              <tr
                key={term}
                onClick={() => onTermSelect(term)}
                className={`cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-blue-50' : ''}`}
              >
                <td className="border border-gray-300 p-3 font-medium">{term} months</td>
                {amounts.map((amount, index) => {
                  const payment = termPayments?.get(amount) ?? 0
                  return (
                    <td
                      key={index}
                      className={`border border-gray-300 p-3 text-center ${
                        index === selectedIndex ? 'bg-blue-50 font-semibold' : ''
                      }`}
                    >
                      {selectedCurrency && selectedCurrency !== 'USD' && rates
                        ? formatCurrencyWithCode(convertAmount(payment, selectedCurrency, rates), selectedCurrency)
                        : formatCurrency(payment)}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
