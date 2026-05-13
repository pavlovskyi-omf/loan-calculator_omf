import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LoanAmountInput } from './LoanAmountInput'

describe('LoanAmountInput', () => {
  it('should render input and calculate button', () => {
    const mockOnChange = vi.fn()
    const mockOnCalculate = vi.fn()

    render(
      <LoanAmountInput
        value="7000"
        onChange={mockOnChange}
        onCalculate={mockOnCalculate}
        disabled={false}
      />
    )

    expect(screen.getByLabelText(/loan amount/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument()
  })

  it('should call onChange when typing', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    const mockOnCalculate = vi.fn()

    render(
      <LoanAmountInput
        value=""
        onChange={mockOnChange}
        onCalculate={mockOnCalculate}
        disabled={false}
      />
    )

    const input = screen.getByLabelText(/loan amount/i)
    await user.type(input, '5000')

    expect(mockOnChange).toHaveBeenCalled()
  })

  it('should call onCalculate when button clicked', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    const mockOnCalculate = vi.fn()

    render(
      <LoanAmountInput
        value="7000"
        onChange={mockOnChange}
        onCalculate={mockOnCalculate}
        disabled={false}
      />
    )

    const button = screen.getByRole('button', { name: /calculate/i })
    await user.click(button)

    expect(mockOnCalculate).toHaveBeenCalledOnce()
  })

  it('should show error message when provided', () => {
    const mockOnChange = vi.fn()
    const mockOnCalculate = vi.fn()

    render(
      <LoanAmountInput
        value="100"
        onChange={mockOnChange}
        onCalculate={mockOnCalculate}
        error="Amount must be at least $1,500"
        disabled={true}
      />
    )

    expect(screen.getByText(/amount must be at least/i)).toBeInTheDocument()
  })

  it('should disable button when disabled prop is true', () => {
    const mockOnChange = vi.fn()
    const mockOnCalculate = vi.fn()

    render(
      <LoanAmountInput
        value="100"
        onChange={mockOnChange}
        onCalculate={mockOnCalculate}
        error="Error"
        disabled={true}
      />
    )

    const button = screen.getByRole('button', { name: /calculate/i })
    expect(button).toBeDisabled()
  })
})
