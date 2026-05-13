import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  fetchRates,
  getCachedRates,
  setCachedRates,
  isCacheValid,
  convertAmount,
  formatCurrencyWithCode,
  ensureRates,
  ExchangeRate,
} from './currency'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('currency rates domain', () => {
  it('convertAmount should convert using provided rates', () => {
    const rates: ExchangeRate = {
      base: 'USD',
      date: '2026-02-10',
      rates: { EUR: 0.9, UAH: 36.8 },
      fetchedAt: Date.now(),
    }

    expect(convertAmount(100, 'EUR', rates)).toBeCloseTo(90)
    expect(convertAmount(50, 'UAH', rates)).toBeCloseTo(50 * 36.8)
    expect(convertAmount(10, 'USD', rates)).toBe(10)
  })

  it('formatCurrencyWithCode should format values with currency symbol', () => {
    const v1 = formatCurrencyWithCode(90, 'EUR')
    expect(v1).toContain('90')
    // EUR symbol is commonly present
    expect(v1).toMatch(/€|EUR/)

    const v2 = formatCurrencyWithCode(1000, 'UAH')
    expect(v2).toContain('1,000')
    // UAH symbol (₴) or currency code
    expect(v2).toMatch(/₴|UAH/)
  })

  it('cache set/get and validation works', () => {
    const rates: ExchangeRate = {
      base: 'USD',
      date: '2026-02-10',
      rates: { EUR: 0.9 },
      fetchedAt: Date.now(),
    }
    expect(getCachedRates()).toBeNull()
    setCachedRates(rates)
    const got = getCachedRates()
    expect(got).not.toBeNull()
    expect(got?.base).toBe('USD')
    expect(isCacheValid(got)).toBe(true)
  })

  it('fetchRates normalizes API response', async () => {
    const mockResponse = {
      meta: { code: 200 },
      response: { date: '2026-02-10T00:00:00Z', base: 'USD', rates: { EUR: 0.9184, UAH: 36.6 } },
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockResponse }))

    const rates = await fetchRates({ apiKey: 'KEY', symbols: ['EUR', 'UAH'] })
    expect(rates.base).toBe('USD')
    expect(rates.rates.EUR).toBeCloseTo(0.9184)
    expect(typeof rates.fetchedAt).toBe('number')
  })

  it('ensureRates returns ok when fetch succeeds and caches result', async () => {
    const mockResponse = {
      meta: { code: 200 },
      response: { date: '2026-02-10T00:00:00Z', base: 'USD', rates: { EUR: 0.92 } },
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockResponse }))

    const res = await ensureRates({ apiKey: 'KEY', symbols: ['EUR'] }, 1000)
    expect(res.status).toBe('ok')
    expect(res.rates?.rates.EUR).toBeCloseTo(0.92)
    // Now cached
    const cached = getCachedRates()
    expect(cached).not.toBeNull()
  })

  it('ensureRates falls back to cache on fetch failure', async () => {
    // Seed cache with old rates
    const cachedRates: ExchangeRate = { base: 'USD', date: '2026-02-09', rates: { EUR: 0.5 }, fetchedAt: Date.now() - 1000 * 60 * 60 }
    setCachedRates(cachedRates)

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' }))

    const res = await ensureRates({ apiKey: 'KEY', symbols: ['EUR'] }, 1)
    expect(res.status).toBe('fallback')
    expect(res.rates).not.toBeNull()
    expect(res.rates?.rates.EUR).toBe(0.5)
  })

  it('ensureRates returns null when no cache and fetch fails', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' }))
    const res = await ensureRates({ apiKey: 'KEY', symbols: ['EUR'] }, 1)
    expect(res.status).toBe('fallback')
    expect(res.rates).toBeNull()
  })
})
