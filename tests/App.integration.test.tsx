import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { calculateMonthlyPayment } from '../src/domain/loanMath';
import { formatCurrency } from '../src/domain/currency';

describe('App integration', () => {
  it('Calculate commits amount and updates tabs', async () => {
    const { container } = render(<App />);
    const input = container.querySelector('#loan-amount') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement; // first button is Calculate in LoanAmountInput

    await userEvent.clear(input);
    await userEvent.type(input, '$9,000');
    await userEvent.click(button);

    // After calculate, tabs should show $8,000 $9,000 $10,000
    expect(container.textContent).toContain(formatCurrency(9000));
  });

  it('APR changes update SelectedDetails instantly', async () => {
    const { container } = render(<App />);
    // find increase APR button (in AprControlNew)
    const inc = container.querySelector('[aria-label="increase-apr"]') as HTMLButtonElement;
    // click once to change apr from 5 to 6
    await userEvent.click(inc);

    // selected amount default is middle of 7000 (i.e., 7000) and term 36
    const expected = calculateMonthlyPayment(7000, 6, 36);
    expect(container.textContent).toContain(formatCurrency(expected));
  });
});
