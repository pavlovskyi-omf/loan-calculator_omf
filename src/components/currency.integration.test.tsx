import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import App from '../app/App'

describe('Currency integration (rates loading)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('shows live rates badge when fetch succeeds', async () => {
    const mockResponse = {
      response: {
        base: 'USD',
        date: '2026-02-10',
        rates: { EUR: 0.9, UAH: 36 },
      },
    }

    // @ts-ignore - polyfill for global.fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) })
    ) as any

    render(<App />)

    const badge = await screen.findByLabelText('exchange-rates-ok')
    expect(badge).toBeInTheDocument()
  })

  it('shows fallback badge and notification when fetch returns 500', async () => {
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500, statusText: 'Server Error' })) as any

    render(<App />)

    const badge = await screen.findByLabelText('exchange-rates-fallback')
    expect(badge).toBeInTheDocument()

    const note = await screen.findByText(/Exchange rates unavailable/i)
    expect(note).toBeInTheDocument()
  })

  it('shows fallback badge and notification when fetch throws', async () => {
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.reject(new TypeError('NetworkError'))) as any

    render(<App />)

    const badge = await screen.findByLabelText('exchange-rates-fallback')
    expect(badge).toBeInTheDocument()

    const note = await screen.findByText(/Exchange rates unavailable/i)
    expect(note).toBeInTheDocument()
  })

  it('uses cached rates when available and shows cached badge', async () => {
    const cached = {
      base: 'USD',
      date: '2026-02-10',
      rates: { EUR: 0.92, UAH: 38 },
      fetchedAt: Date.now(),
    }
    localStorage.setItem('exchange_rates_v1', JSON.stringify(cached))

    const fetchSpy = vi.spyOn(global as any, 'fetch')

    render(<App />)

    const badge = await screen.findByLabelText('exchange-rates-cached')
    expect(badge).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
