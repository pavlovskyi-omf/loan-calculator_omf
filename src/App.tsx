import React, { useState } from 'react';
import './styles/globals.css';
import LoanAmountInput from './components/LoanAmountInput';
import AprControl from './components/AprControlNew';
import AmountTabs, { computeComparisonAmounts } from './components/AmountTabs';
import PaymentTable from './components/PaymentTable';
import SelectedDetails from './components/SelectedDetails';

const TERMS = [24, 36, 48, 60];

export const App: React.FC = () => {
  const [committedAmount, setCommittedAmount] = useState<number>(7000);
  const [apr, setApr] = useState<number>(5);
  const [selectedAmountIndex, setSelectedAmountIndex] = useState<number>(1);
  const [selectedTerm, setSelectedTerm] = useState<number>(36);

  const amounts = computeComparisonAmounts(committedAmount);
  const selectedAmount = amounts[selectedAmountIndex] ?? amounts[0];

  return (
    <main className="container" role="main">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="panel">
          <LoanAmountInput initial={committedAmount} onCommit={(a) => setCommittedAmount(a)} />
          <div className="mt-4">
            <AprControl apr={apr} onChange={(v) => setApr(v)} />
          </div>
        </div>

        <div className="panel">
          <h2 className="text-lg font-semibold mb-2">Estimated monthly payment</h2>
          <AmountTabs committedAmount={committedAmount} selectedIndex={selectedAmountIndex} onSelect={setSelectedAmountIndex} />
          <div className="mt-4">
            <PaymentTable terms={TERMS} amounts={amounts} aprPercent={apr} selectedAmountIndex={selectedAmountIndex} selectedTerm={selectedTerm} onSelectTerm={setSelectedTerm} />
          </div>
        </div>
      </div>

      <div className="panel">
        <SelectedDetails amount={selectedAmount} aprPercent={apr} termMonths={selectedTerm} />
      </div>
    </main>
  );
};

export default App;
