import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { AprControl } from './AprControl'

describe('AprControl', () => {
  it('should render APR value', () => {
    const mockOnChange = vi.fn()

    render(<AprControl apr={10} onChange={mockOnChange} min={0} max={36} step={1} />)

    expect(screen.getByText('10%')).toBeInTheDocument()
    expect(screen.getByText(/annual percentage rate/i)).toBeInTheDocument()
  })

  it('should call onChange when plus button clicked', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()

    render(<AprControl apr={10} onChange={mockOnChange} min={0} max={36} step={1} />)

    const increaseButton = screen.getByLabelText(/increase apr/i)
    await user.click(increaseButton)

    expect(mockOnChange).toHaveBeenCalledWith(11)
  })

  it('should call onChange when minus button clicked', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()

    render(<AprControl apr={10} onChange={mockOnChange} min={0} max={36} step={1} />)

    const decreaseButton = screen.getByLabelText(/decrease apr/i)
    await user.click(decreaseButton)

    expect(mockOnChange).toHaveBeenCalledWith(9)
  })

  it('should disable minus button at minimum', () => {
    const mockOnChange = vi.fn()

    render(<AprControl apr={0} onChange={mockOnChange} min={0} max={36} step={1} />)

    const decreaseButton = screen.getByLabelText(/decrease apr/i)
    expect(decreaseButton).toBeDisabled()
  })

  it('should disable plus button at maximum', () => {
    const mockOnChange = vi.fn()

    render(<AprControl apr={36} onChange={mockOnChange} min={0} max={36} step={1} />)

    const increaseButton = screen.getByLabelText(/increase apr/i)
    expect(increaseButton).toBeDisabled()
  })
})
