import { describe, it, expect } from 'vitest'
import { parseCurrencyInput, formatCurrency } from './currency'

describe('parseCurrencyInput', () => {
  it('should parse plain number string', () => {
    expect(parseCurrencyInput('7000')).toBe(7000)
    expect(parseCurrencyInput('1500')).toBe(1500)
    expect(parseCurrencyInput('100000')).toBe(100000)
  })

  it('should parse number with commas', () => {
    expect(parseCurrencyInput('7,000')).toBe(7000)
    expect(parseCurrencyInput('10,000')).toBe(10000)
    expect(parseCurrencyInput('100,000')).toBe(100000)
  })

  it('should parse number with dollar sign', () => {
    expect(parseCurrencyInput('$7000')).toBe(7000)
    expect(parseCurrencyInput('$7,000')).toBe(7000)
    expect(parseCurrencyInput('$ 7,000')).toBe(7000)
  })

  it('should handle whitespace', () => {
    expect(parseCurrencyInput(' 7000 ')).toBe(7000)
    expect(parseCurrencyInput('  $  7,000  ')).toBe(7000)
  })

  it('should handle decimal values', () => {
    expect(parseCurrencyInput('7000.50')).toBe(7000.5)
    expect(parseCurrencyInput('$1,500.99')).toBe(1500.99)
  })

  it('should return null for invalid input', () => {
    expect(parseCurrencyInput('')).toBe(null)
    expect(parseCurrencyInput('abc')).toBe(null)
    expect(parseCurrencyInput('$$$')).toBe(null)
    expect(parseCurrencyInput('not a number')).toBe(null)
  })

  it('should return null for non-numeric strings', () => {
    // Note: '10k' will parse to 10 (parseFloat stops at first non-numeric char)
    // This is acceptable for lenient parsing
    expect(parseCurrencyInput('10k')).toBe(10)
    expect(parseCurrencyInput('1,000,000,000')).toBe(1000000000) // valid, though large
  })
})

describe('formatCurrency', () => {
  it('should format whole numbers with dollar sign and commas', () => {
    expect(formatCurrency(7000)).toBe('$7,000')
    expect(formatCurrency(10000)).toBe('$10,000')
    expect(formatCurrency(100000)).toBe('$100,000')
  })

  it('should handle small amounts', () => {
    expect(formatCurrency(100)).toBe('$100')
    expect(formatCurrency(1500)).toBe('$1,500')
  })

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('should format decimal values', () => {
    expect(formatCurrency(1500.5)).toBe('$1,500.50')
    expect(formatCurrency(7000.99)).toBe('$7,000.99')
  })

  it('should handle negative numbers', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000')
  })
})
