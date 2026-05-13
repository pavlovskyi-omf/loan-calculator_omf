import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import CurrencyDropdown from './CurrencyDropdown'

describe('CurrencyDropdown', () => {
  it('renders options and calls onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<CurrencyDropdown value="USD" onChange={onChange} />)

    const select = screen.getByLabelText(/select currency/i)
    expect(select).toBeInTheDocument()

    await user.selectOptions(select, 'EUR')
    expect(onChange).toHaveBeenCalledWith('EUR')
  })
})
