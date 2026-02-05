import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmountTabs, { computeComparisonAmounts } from '../src/components/AmountTabs';
import { formatCurrency } from '../src/domain/currency';

describe('computeComparisonAmounts', () => {
  it('computes and clamps and dedupes amounts', () => {
    const amounts = computeComparisonAmounts(7000);
    expect(amounts).toEqual([6000, 7000, 8000]);

    const minCase = computeComparisonAmounts(1500);
    // raw would be [500,1500,2500] -> clamp to [1500,1500,2500] -> dedupe -> [1500,2500]
    expect(minCase).toEqual([1500, 2500]);
  });
});

describe('AmountTabs component', () => {
  it('renders tabs and calls onSelect with the index', async () => {
    const onSelect = vi.fn();
    const { container } = render(<AmountTabs committedAmount={7000} selectedIndex={1} onSelect={onSelect} />);

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toBeTruthy();

    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    expect(tabs.map((t) => t.textContent)).toEqual([
      formatCurrency(6000),
      formatCurrency(7000),
      formatCurrency(8000),
    ]);

    await userEvent.click(tabs[0]);
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it('dedupes identical clamped amounts', () => {
    const { container } = render(<AmountTabs committedAmount={1500} />);
    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    expect(tabs.map((t) => t.textContent)).toEqual([formatCurrency(1500), formatCurrency(2500)]);
  });
});
