import { Tabs, Tab } from '@mui/material'
import { formatCurrency, formatCurrencyWithCode } from '../domain/currency'
import type { ExchangeRate } from '../domain/currency'

interface AmountTabsProps {
  amounts: number[]
  selectedIndex: number
  onSelect: (index: number) => void
  selectedCurrency?: string
  rates?: ExchangeRate | null
}

export function AmountTabs({ amounts, selectedIndex, onSelect, selectedCurrency, rates }: AmountTabsProps) {
  return (
    <Tabs
      value={selectedIndex}
      onChange={(_, newValue) => onSelect(newValue)}
      aria-label="Loan amount options"
      variant="fullWidth"
    >
      {amounts.map((amount, index) => (
        <Tab
          key={index}
          label={selectedCurrency && selectedCurrency !== 'USD' && rates ? formatCurrencyWithCode(amount * (rates.rates[selectedCurrency] ?? 1), selectedCurrency) : formatCurrency(amount)}
        />
      ))}
    </Tabs>
  )
}
