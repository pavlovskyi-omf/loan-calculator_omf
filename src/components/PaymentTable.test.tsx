import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { PaymentTable } from './PaymentTable'

describe('PaymentTable', () => {
  const mockTerms = [24, 36, 48, 60] as const
  const mockAmounts = [6000, 7000, 8000]
  const mockPayments = new Map([
    [
      24,
      new Map([
        [6000, 265],
        [7000, 309],
        [8000, 353],
      ]),
    ],
    [
      36,
      new Map([
        [6000, 184],
        [7000, 215],
        [8000, 245],
      ]),
    ],
  ])

  it('should render table with terms and amounts', () => {
    const mockOnTermSelect = vi.fn()

    render(
      <PaymentTable
        terms={mockTerms}
        amounts={mockAmounts}
        payments={mockPayments}
        selectedIndex={1}
        activeTerm={36}
        onTermSelect={mockOnTermSelect}
      />
    )

    expect(screen.getByText('24 months')).toBeInTheDocument()
    expect(screen.getByText('36 months')).toBeInTheDocument()
    expect(screen.getByText(/\$6,000/)).toBeInTheDocument()
    expect(screen.getByText(/\$7,000/)).toBeInTheDocument()
  })

  it('should call onTermSelect when row clicked', async () => {
    const user = userEvent.setup()
    const mockOnTermSelect = vi.fn()

    render(
      <PaymentTable
        terms={mockTerms}
        amounts={mockAmounts}
        payments={mockPayments}
        selectedIndex={1}
        activeTerm={36}
        onTermSelect={mockOnTermSelect}
      />
    )

    const row = screen.getByText('24 months').closest('tr')
    if (row) {
      await user.click(row)
    }

    expect(mockOnTermSelect).toHaveBeenCalledWith(24)
  })

  it('should display payment values correctly', () => {
    const mockOnTermSelect = vi.fn()

    render(
      <PaymentTable
        terms={mockTerms}
        amounts={mockAmounts}
        payments={mockPayments}
        selectedIndex={1}
        activeTerm={36}
        onTermSelect={mockOnTermSelect}
      />
    )

    expect(screen.getByText('$265')).toBeInTheDocument()
    expect(screen.getByText('$309')).toBeInTheDocument()
    expect(screen.getByText('$184')).toBeInTheDocument()
  })
})
