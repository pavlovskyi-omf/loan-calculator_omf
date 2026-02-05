import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanAmountInput from '../src/components/LoanAmountInput';

describe('LoanAmountInput', () => {
  it('shows validation and disables Calculate when amount is invalid', async () => {
    const { container } = render(<LoanAmountInput />);
    const input = container.querySelector('#loan-amount') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    await userEvent.clear(input);
    await userEvent.type(input, '100');

    expect(button.disabled).toBe(true);
    expect(container.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('enables Calculate when amount is valid and calls onCommit with parsed whole dollars', async () => {
    const onCommit = vi.fn();
    const { container } = render(<LoanAmountInput onCommit={onCommit} />);
    const input = container.querySelector('#loan-amount') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    await userEvent.clear(input);
    await userEvent.type(input, '$7,500.49');
    expect(button.disabled).toBe(false);

    await userEvent.click(button);
    expect(onCommit).toHaveBeenCalledWith(7500);
  });
});
