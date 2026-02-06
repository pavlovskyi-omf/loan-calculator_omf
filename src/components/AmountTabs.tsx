import { Tabs, Tab } from '@mui/material'
import { formatCurrency } from '../domain/currency'

interface AmountTabsProps {
  amounts: number[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export function AmountTabs({ amounts, selectedIndex, onSelect }: AmountTabsProps) {
  return (
    <Tabs
      value={selectedIndex}
      onChange={(_, newValue) => onSelect(newValue)}
      aria-label="Loan amount options"
      variant="fullWidth"
    >
      {amounts.map((amount, index) => (
        <Tab key={index} label={formatCurrency(amount)} />
      ))}
    </Tabs>
  )
}
