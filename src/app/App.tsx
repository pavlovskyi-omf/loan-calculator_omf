import React, { useState, useMemo, useEffect } from 'react'
import { LoanAmountInput } from '../components/LoanAmountInput'
import { AprControl } from '../components/AprControl'
import { AmountTabs } from '../components/AmountTabs'
import { PaymentTable } from '../components/PaymentTable'
import { SelectedDetails } from '../components/SelectedDetails'
import CurrencyDropdown from '../components/CurrencyDropdown'
import LanguageSelector from '../components/LanguageSelector'
import RateStatusBadge from '../components/RateStatusBadge'
import Notifications from '../components/Notifications'
import { useI18n } from '../i18n'
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
  const { t } = useI18n()
  
  // Primary state
  const [inputValue, setInputValue] = useState<string>('7000')
  const [committedAmount, setCommittedAmount] = useState<number>(7000)
  const [apr, setApr] = useState<number>(10)
  const [selectedAmountIndex, setSelectedAmountIndex] = useState<number>(1)
  const [activeTerm, setActiveTerm] = useState<number>(36)
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
    try {
      return localStorage.getItem('selected_currency') || 'USD'
    } catch (e) {
      return 'USD'
    }
  })
  const [rates, setRates] = useState<any>(null)
  const [ratesStatus, setRatesStatus] = useState<string>('')
  const [notification, setNotification] = useState<string | null>(null)

  // Parse input amount
  const inputAmount = useMemo(() => parseCurrencyInput(inputValue), [inputValue])

  // Validate input amount
  const validation = useMemo(
    () => validateAmount(inputAmount, MIN_AMOUNT, MAX_AMOUNT),
    [inputAmount]
  )
  
  // Translate validation error message
  const validationError = useMemo(() => {
    if (validation.valid || !validation.translationKey) return undefined
    return t(validation.translationKey, validation.translationValues)
  }, [validation, t])

  // Generate comparison amounts
  const comparisonAmounts = useMemo(
    () => generateComparisonAmounts(committedAmount, COMPARE_DELTA, MIN_AMOUNT, MAX_AMOUNT),
    [committedAmount]
  )

  // Sync selectedAmountIndex with committedAmount position
  useEffect(() => {
    const index = comparisonAmounts.indexOf(committedAmount)
    if (index !== -1) {
      setSelectedAmountIndex(index)
    }
  }, [committedAmount, comparisonAmounts])

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

  // Persist selected currency
  useEffect(() => {
    try {
      localStorage.setItem('selected_currency', selectedCurrency)
    } catch (e) {
      // ignore
    }
  }, [selectedCurrency])

  // Load rates on start (attempt) and when key present
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { ensureRates } = await import('../domain/currency')
        const res = await ensureRates({ symbols: ['EUR', 'UAH'] })
        if (!mounted) return
        setRates(res.rates)
        setRatesStatus(res.status)
        if (res.status === 'fallback') {
          setNotification(t('notifications.ratesStale'))
        }
        if (res.status === 'error') {
          setNotification(t('notifications.ratesError'))
        }
      } catch (e) {
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Personal Loan Calculator</h1>
          <React.Suspense fallback={null}>
            <LanguageSelector />
          </React.Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <LoanAmountInput
                value={inputValue}
                onChange={handleAmountChange}
                onCalculate={handleCalculate}
                error={validationError}
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

                <div className="flex items-center justify-end mb-2 space-x-3">
                  <React.Suspense fallback={null}>
                    <CurrencyDropdown value={selectedCurrency} onChange={(v) => setSelectedCurrency(v)} />
                  </React.Suspense>
                  <RateStatusBadge status={ratesStatus as any} />
                </div>
                <Notifications message={notification} onClose={() => setNotification(null)} />

              <AmountTabs
                amounts={comparisonAmounts}
                selectedIndex={selectedAmountIndex}
                onSelect={handleAmountTabSelect}
                selectedCurrency={selectedCurrency}
                rates={rates}
              />

              <div className="mt-6">
                <PaymentTable
                  terms={TERMS}
                  amounts={comparisonAmounts}
                  payments={paymentGrid}
                  selectedIndex={selectedAmountIndex}
                  activeTerm={activeTerm}
                  onTermSelect={handleTermSelect}
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                />
              </div>

              <SelectedDetails
                amount={selectedDetails.amount}
                term={selectedDetails.term}
                monthlyPayment={selectedDetails.monthlyPayment}
                totalPaid={selectedDetails.totalPaid}
                totalInterest={selectedDetails.totalInterest}
                selectedCurrency={selectedCurrency}
                rates={rates}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
