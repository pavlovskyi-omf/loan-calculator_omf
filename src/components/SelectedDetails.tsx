import React from 'react';
import calculateMonthlyPayment from '../domain/loanMath';
import { formatCurrency } from '../domain/currency';

type Props = {
  amount: number;
  aprPercent: number;
  termMonths: number;
};

const SelectedDetails: React.FC<Props> = ({ amount, aprPercent, termMonths }) => {
  const monthly = calculateMonthlyPayment(amount, aprPercent, termMonths);
  const totalPaid = monthly * termMonths;
  const totalInterest = totalPaid - amount;

  return (
    <div aria-live="polite" aria-atomic="true" className="flex flex-col sm:flex-row sm:justify-between gap-2">
      <div className="flex-1">Monthly payment: <strong className="ml-2">{formatCurrency(monthly)}</strong></div>
      <div className="flex-1">Total paid: <strong className="ml-2">{formatCurrency(totalPaid)}</strong></div>
      <div className="flex-1">Total interest: <strong className="ml-2">{formatCurrency(totalInterest)}</strong></div>
    </div>
  );
};

export default SelectedDetails;
