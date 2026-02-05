import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaymentTable from '../src/components/PaymentTable';
import { formatCurrency } from '../src/domain/currency';

describe('PaymentTable', () => {
  it('renders header and payment cells for terms and amounts', () => {
    const terms = [24, 36];
    const amounts = [6000, 7000];
    render(<PaymentTable terms={terms} amounts={amounts} aprPercent={5} selectedAmountIndex={1} />);

    // header shows amounts
    expect(screen.getByText(formatCurrency(6000))).toBeTruthy();
    expect(screen.getByText(formatCurrency(7000))).toBeTruthy();

    // rows for terms
    expect(screen.getByText('24 months')).toBeTruthy();
    expect(screen.getByText('36 months')).toBeTruthy();

    // one payment cell: ensure currency formatting present
    const paymentCell = screen.getAllByText(/\$/)[0];
    expect(paymentCell).toBeTruthy();
  });
});
