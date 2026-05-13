import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RateStatusBadge from './RateStatusBadge'

describe('RateStatusBadge', () => {
  it('renders nothing when status empty', () => {
    const { container } = render(<RateStatusBadge status={''} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders live, cached, and unavailable states', () => {
    const { rerender } = render(<RateStatusBadge status={'ok'} />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'exchange-rates-ok')
    expect(screen.getByText(/Rates: Live/i)).toBeInTheDocument()

    rerender(<RateStatusBadge status={'cached'} />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'exchange-rates-cached')

    rerender(<RateStatusBadge status={'fallback'} />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'exchange-rates-fallback')
  })
})
