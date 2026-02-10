import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Notifications from './Notifications'

describe('Notifications', () => {
  it('does not render when message is null', () => {
    const { container } = render(<Notifications message={null} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders message and calls onClose after timeout', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<Notifications message={'Test message'} onClose={onClose} />)
    expect(screen.getByRole('status')).toHaveTextContent('Test message')
    vi.advanceTimersByTime(5000)
    expect(onClose).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
