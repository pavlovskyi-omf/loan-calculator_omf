import { useState, useMemo } from 'react'
import { LoanAmountInput } from '../components/LoanAmountInput'
import { AprControl } from '../components/AprControl'
import { AmountTabs } from '../components/AmountTabs'
import { PaymentTable } from '../components/PaymentTable'
import { SelectedDetails } from '../components/SelectedDetails'
import {
  MIN_AMOUNT,
  MAX_AMOUNT,
  APR_MIN,
  APR_MAX,
  APR_STEP,
  TERMS,
  COMPARE_DELTA,
} from '../domain/config'
import { parseCurrencyInput } from '../domain/currency'
import { validateAmount, generateComparisonAmounts } from '../domain/validation'
import { calculateMonthlyPayment, roundToWholeDollars } from '../domain/loanMath'
import './App.css'

function App() {
  // Primary state
  const [inputValue, setInputValue] = useState<string>('7000')
  const [committedAmount, setCommittedAmount] = useState<number>(7000)
  const [apr, setApr] = useState<number>(10)
  const [selectedAmountIndex, setSelectedAmountIndex] = useState<number>(1)
  const [activeTerm, setActiveTerm] = useState<number>(36)

  // Parse input amount
  const inputAmount = useMemo(() => parseCurrencyInput(inputValue), [inputValue])

  // Validate input amount
  const validation = useMemo(
    () => validateAmount(inputAmount, MIN_AMOUNT, MAX_AMOUNT),
    [inputAmount]
  )

  // Generate comparison amounts
  const comparisonAmounts = useMemo(
    () => generateComparisonAmounts(committedAmount, COMPARE_DELTA, MIN_AMOUNT, MAX_AMOUNT),
    [committedAmount]
  )

  // Calculate payment grid
  const paymentGrid = useMemo(() => {
    const grid = new Map<number, Map<number, number>>()

    for (const term of TERMS) {
      const termMap = new Map<number, number>()
      for (const amount of comparisonAmounts) {
        const payment = calculateMonthlyPayment(amount, apr, term)
        termMap.set(amount, roundToWholeDollars(payment))
      }
      grid.set(term, termMap)
    }

    return grid
  }, [comparisonAmounts, apr])

  // Calculate selected details
  const selectedDetails = useMemo(() => {
    const amount = comparisonAmounts[selectedAmountIndex]
    const termPayments = paymentGrid.get(activeTerm)
    const monthlyPayment = termPayments?.get(amount) ?? 0
    const totalPaid = monthlyPayment * activeTerm
    const totalInterest = totalPaid - amount

    return {
      amount,
      term: activeTerm,
      monthlyPayment,
      totalPaid,
      totalInterest,
    }
  }, [comparisonAmounts, selectedAmountIndex, activeTerm, paymentGrid])

  // Handlers
  const handleAmountChange = (value: string) => {
    setInputValue(value)
  }

  const handleCalculate = () => {
    if (validation.valid && inputAmount !== null) {
      setCommittedAmount(inputAmount)
    }
  }

  const handleAprChange = (newApr: number) => {
    setApr(newApr)
  }

  const handleAmountTabSelect = (index: number) => {
    setSelectedAmountIndex(index)
  }

  const handleTermSelect = (term: number) => {
    setActiveTerm(term)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Personal Loan Calculator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <LoanAmountInput
                value={inputValue}
                onChange={handleAmountChange}
                onCalculate={handleCalculate}
                error={validation.valid ? undefined : validation.message}
                disabled={!validation.valid}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <AprControl
                apr={apr}
                onChange={handleAprChange}
                min={APR_MIN}
                max={APR_MAX}
                step={APR_STEP}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Estimated Monthly Payment
              </h2>

              <AmountTabs
                amounts={comparisonAmounts}
                selectedIndex={selectedAmountIndex}
                onSelect={handleAmountTabSelect}
              />

              <div className="mt-6">
                <PaymentTable
                  terms={TERMS}
                  amounts={comparisonAmounts}
                  payments={paymentGrid}
                  selectedIndex={selectedAmountIndex}
                  activeTerm={activeTerm}
                  onTermSelect={handleTermSelect}
                />
              </div>

              <SelectedDetails
                amount={selectedDetails.amount}
                term={selectedDetails.term}
                monthlyPayment={selectedDetails.monthlyPayment}
                totalPaid={selectedDetails.totalPaid}
                totalInterest={selectedDetails.totalInterest}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
