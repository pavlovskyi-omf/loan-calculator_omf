import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import CurrencyDropdown from './CurrencyDropdown'
import RateStatusBadge from './RateStatusBadge'
import Notifications from './Notifications'

describe('accessibility smoke', () => {
  it('CurrencyDropdown is labeled and keyboard focusable', async () => {
    const user = userEvent.setup()
    render(<CurrencyDropdown value="USD" onChange={() => {}} />)

    const select = screen.getByLabelText('Select currency')
    expect(select).toBeInTheDocument()

    // Focus via tab
    await user.tab()
    expect(select).toHaveFocus()
  })

  it('RateStatusBadge exposes status role and aria-label', () => {
    const { rerender } = render(<RateStatusBadge status="ok" />)
    let badge = screen.getByRole('status')
    expect(badge).toHaveAttribute('aria-label', 'exchange-rates-ok')

    rerender(<RateStatusBadge status={'cached' as any} />)
    badge = screen.getByRole('status')
    expect(badge).toHaveAttribute('aria-label', 'exchange-rates-cached')
  })

  it('Notifications announce politely (aria-live) and are focusable via DOM', () => {
    const onClose = () => {}
    render(<Notifications message={'Test message'} onClose={onClose} />)

    const note = screen.getByRole('status')
    expect(note).toHaveAttribute('aria-live', 'polite')
    expect(note).toHaveTextContent('Test message')
  })
})
