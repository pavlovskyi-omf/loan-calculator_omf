import { vi, describe, it, expect, beforeEach } from 'vitest'
import { fetchRates } from './currency'

describe('currency dev logs', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('warns when VITE_CURRENCYBEACON_KEY is missing', async () => {
    const mockResponse = { response: { base: 'USD', date: '2026-02-10', rates: { EUR: 0.9 } } }
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) }))
    // Ensure import.meta.env has no key during this test
    const originalEnv = (import.meta as any).env
    ;(import.meta as any).env = {}

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const res = await fetchRates({ apiKey: '' as any })
    expect(res.rates.EUR).toBe(0.9)
    expect(warn).toHaveBeenCalled()

    warn.mockRestore()
    ;(import.meta as any).env = originalEnv
  })

  it('warns when API returns 401 (invalid key)', async () => {
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 401, statusText: 'Unauthorized' }))

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await expect(fetchRates({ apiKey: 'bad-key' })).rejects.toThrow()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
