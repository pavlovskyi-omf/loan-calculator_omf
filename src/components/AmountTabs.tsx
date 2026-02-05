import React from 'react';
import { formatCurrency } from '../domain/currency';
import { MIN_AMOUNT, MAX_AMOUNT } from '../domain/validation';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

type Props = {
  committedAmount: number;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
};

export function computeComparisonAmounts(committed: number): number[] {
  const delta = 1000;
  const raw = [committed - delta, committed, committed + delta];
  const clamped = raw.map((a) => Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, a)));
  // dedupe preserving order
  const seen = new Set<number>();
  const unique: number[] = [];
  for (const a of clamped) {
    if (!seen.has(a)) {
      seen.add(a);
      unique.push(a);
    }
  }
  return unique;
}

const AmountTabs: React.FC<Props> = ({ committedAmount, selectedIndex = 0, onSelect }) => {
  const amounts = computeComparisonAmounts(committedAmount);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    onSelect?.(newValue);
  };

  return (
    <Tabs
      value={selectedIndex}
      onChange={handleChange}
      aria-label="Amount selector"
      variant="scrollable"
      scrollButtons="auto"
    >
      {amounts.map((amt, idx) => (
        <Tab key={amt} label={formatCurrency(amt)} id={`amount-tab-${idx}`} />
      ))}
    </Tabs>
  );
};

export default AmountTabs;
