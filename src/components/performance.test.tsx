import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PaymentTable } from './PaymentTable'
import { SelectedDetails } from './SelectedDetails'

// Lightweight performance measurement for render times
describe('performance: render timings', () => {
  it('measures avg render time for PaymentTable + SelectedDetails', () => {
    const TERMS = [24, 36, 48, 60]
    const amounts = [6000, 7000, 8000]

    // Mock a payments grid: Map<term, Map<amount, payment>>
    const payments = new Map<number, Map<number, number>>()
    for (const term of TERMS) {
      const m = new Map<number, number>()
      for (const a of amounts) m.set(a, Math.round((a * 0.01) * term / 12))
      payments.set(term, m)
    }

    const iterations = 30
    const times: number[] = []

    for (let i = 0; i < iterations; i++) {
      const t0 = performance.now()

      const { unmount } = render(
        <div>
          <PaymentTable
            terms={TERMS}
            amounts={amounts}
            payments={payments as any}
            selectedIndex={1}
            activeTerm={36}
            onTermSelect={() => {}}
            selectedCurrency="USD"
            rates={null}
          />
          <SelectedDetails
            amount={amounts[1]}
            term={36}
            monthlyPayment={payments.get(36)?.get(amounts[1]) ?? 0}
            totalPaid={(payments.get(36)?.get(amounts[1]) ?? 0) * 36}
            totalInterest={0}
            selectedCurrency="USD"
            rates={null}
          />
        </div>
      )

      const t1 = performance.now()
      times.push(t1 - t0)

      unmount()
      cleanup()
    }

    const avg = times.reduce((s, v) => s + v, 0) / times.length
    // Log results for developer inspection (test runner will show console output)
    // eslint-disable-next-line no-console
    console.log(`performance: avg render time over ${iterations} runs = ${avg.toFixed(2)} ms`)

    // Lightweight assertion to catch gross regressions — allow generous threshold
    expect(avg).toBeLessThan(1000)
  })
})
