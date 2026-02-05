import React, { useState } from 'react';
import { parseCurrency, formatCurrency } from '../domain/currency';
import { validateAmount } from '../domain/validation';

type Props = {
  initial?: number;
  onCommit?: (amount: number) => void;
};

export const LoanAmountInput: React.FC<Props> = ({ initial, onCommit }) => {
  const [text, setText] = useState<string>(initial ? String(initial) : '');
  const parsed = parseCurrency(text);
  const validation = validateAmount(parsed ?? undefined);

  const handleCalculate = () => {
    if (!validation.valid || parsed == null) return;
    onCommit?.(parsed);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="loan-amount" className="block text-sm font-medium text-gray-700">Loan amount</label>
      <input
        id="loan-amount"
        aria-describedby="loan-amount-help loan-amount-error"
        inputMode="numeric"
        pattern="[0-9,\s$\.]*"
        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-invalid={!validation.valid}
      />
      <div id="loan-amount-help" className="text-xs text-gray-500">Enter amount e.g. 7000 or $7,000</div>
      {!validation.valid && <div id="loan-amount-error" role="alert" className="text-sm text-red-600">{validation.message}</div>}
      <button className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={handleCalculate} disabled={!validation.valid}>
        Calculate
      </button>
    </div>
  );
};

export default LoanAmountInput;
