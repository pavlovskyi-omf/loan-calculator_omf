import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SelectedDetails from '../src/components/SelectedDetails';
import { formatCurrency } from '../src/domain/currency';

describe('SelectedDetails', () => {
  it('shows monthly payment, total paid and total interest', () => {
    // For APR 0, payment = principal / months
    render(<SelectedDetails amount={10000} aprPercent={0} termMonths={36} />);

    const monthly = Math.round(10000 / 36);
    const totalPaid = monthly * 36;
    const totalInterest = totalPaid - 10000;

    expect(screen.getByText(formatCurrency(monthly))).toBeTruthy();
    expect(screen.getByText(formatCurrency(totalPaid))).toBeTruthy();
    expect(screen.getByText(formatCurrency(totalInterest))).toBeTruthy();
  });
});
