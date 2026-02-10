/**
 * Parse currency input string to a number
 * Accepts formats like: 7000, 7,000, $7,000, $ 7,000
 * @param input - String to parse
 * @returns Parsed number or null if invalid
 */
export function parseCurrencyInput(input: string): number | null {
  // Remove whitespace, dollar signs, and commas
  const cleaned = input.trim().replace(/[$,\s]/g, '')

  // Return null if empty after cleaning
  if (cleaned === '') {
    return null
  }

  // Try to parse as float
  const parsed = parseFloat(cleaned)

  // Return null if NaN
  if (isNaN(parsed)) {
    return null
  }

  return parsed
}

/**
 * Format a number as currency with dollar sign and commas
 * @param amount - Number to format
 * @returns Formatted currency string (e.g., "$7,000")
 */
export function formatCurrency(amount: number): string {
  const isNegative = amount < 0
  const absAmount = Math.abs(amount)

  // Determine if we need decimal places
  const hasDecimals = absAmount % 1 !== 0

  // Use Intl.NumberFormat for proper comma formatting
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(absAmount)

  // Handle negative numbers
  return isNegative ? `-${formatted}` : formatted
}

// --- Exchange rates and conversion helpers ---
export type ExchangeRate = {
  base: string
  date: string
  rates: Record<string, number>
  fetchedAt: number
}

export type RatesStatus = 'ok' | 'cached' | 'fallback' | 'error'

export type FetchOptions = {
  apiKey?: string
  base?: string
  symbols?: string[]
}

const BASE_URL = 'https://api.currencybeacon.com/v1'
const EXCHANGE_CACHE_KEY = 'exchange_rates_v1'
const DEFAULT_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

/**
 * Fetch latest rates from CurrencyBeacon and normalize response
 */
export async function fetchRates(opts: FetchOptions = {}): Promise<ExchangeRate> {
  const apiKey = opts.apiKey ?? (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_CURRENCYBEACON_KEY : undefined)
  const base = opts.base ?? 'USD'
  const symbols = opts.symbols && opts.symbols.length ? opts.symbols.join(',') : undefined

  // Developer warning when API key not provided — helpful during local dev.
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.warn(
      'VITE_CURRENCYBEACON_KEY is not set. Currency Beacon requests will run without an API key — this may fail in production. Add VITE_CURRENCYBEACON_KEY to your .env for live rates.'
    )
  }

  const url = new URL(`${BASE_URL}/latest`)
  url.searchParams.set('base', base)
  if (symbols) url.searchParams.set('symbols', symbols)
  if (apiKey) url.searchParams.set('api_key', apiKey)

  const res = await fetch(url.toString(), { method: 'GET' })
  if (!res.ok) {
    // Detect invalid API key (401/403) and emit a developer warning
    if (res.status === 401 || res.status === 403) {
      // eslint-disable-next-line no-console
      console.warn(
        `Currency Beacon API returned ${res.status}. This may indicate an invalid or restricted VITE_CURRENCYBEACON_KEY.`
      )
    }

    const err = new Error(`fetchRates failed: ${res.status} ${res.statusText}`)
    ;(err as any).status = res.status
    throw err
  }

  const body = await res.json()
  const payload = body?.response
  if (!payload || !payload.rates) throw new Error('Invalid rates response')

  return {
    base: payload.base,
    date: payload.date,
    rates: payload.rates,
    fetchedAt: Date.now(),
  }
}

export function getCachedRates(): ExchangeRate | null {
  try {
    const raw = localStorage.getItem(EXCHANGE_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ExchangeRate
    return parsed
  } catch (e) {
    return null
  }
}

export function setCachedRates(rates: ExchangeRate): void {
  try {
    localStorage.setItem(EXCHANGE_CACHE_KEY, JSON.stringify(rates))
  } catch (e) {
    // ignore storage errors
  }
}

export function isCacheValid(rates: ExchangeRate | null, ttlMs = DEFAULT_TTL_MS): boolean {
  if (!rates) return false
  return Date.now() - rates.fetchedAt <= ttlMs
}

export function convertAmount(amountUsd: number, targetCurrency: string, rates: ExchangeRate): number {
  if (targetCurrency === 'USD') return amountUsd
  const rate = rates.rates[targetCurrency]
  if (typeof rate !== 'number') throw new Error(`Rate for ${targetCurrency} not available`)
  return +(amountUsd * rate)
}

export function formatCurrencyWithCode(amount: number, currencyCode: string, locale = 'en-US'): string {
  const isNegative = amount < 0
  const absAmount = Math.abs(amount)
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: absAmount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  const formatted = formatter.format(absAmount)
  return isNegative ? `-${formatted}` : formatted
}

export async function ensureRates(opts: FetchOptions = {}, ttlMs = DEFAULT_TTL_MS): Promise<{ rates: ExchangeRate | null; status: RatesStatus }> {
  const cached = getCachedRates()
  if (isCacheValid(cached, ttlMs)) return { rates: cached, status: 'cached' }

  try {
    const fetched = await fetchRates(opts)
    setCachedRates(fetched)
    return { rates: fetched, status: 'ok' }
  } catch (e) {
    if (cached) return { rates: cached, status: 'fallback' }
    return { rates: null, status: 'fallback' }
  }
}
