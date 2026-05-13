import { describe, it, expect } from 'vitest'
import { calculateMonthlyPayment, roundToWholeDollars } from './loanMath'

describe('calculateMonthlyPayment', () => {
  it('should calculate monthly payment for typical APR', () => {
    // $10,000 loan at 10% APR for 36 months
    const result = calculateMonthlyPayment(10000, 10, 36)
    // Expected: ~$322.67 per month
    expect(result).toBeCloseTo(322.67, 1)
  })

  it('should handle 0% APR as simple division', () => {
    // $10,000 loan at 0% APR for 36 months
    const result = calculateMonthlyPayment(10000, 0, 36)
    expect(result).toBeCloseTo(277.78, 2)
  })

  it('should calculate payment for high APR', () => {
    // $50,000 loan at 36% APR for 60 months
    const result = calculateMonthlyPayment(50000, 36, 60)
    // Expected: ~$1,807 per month (high APR results in high payment)
    expect(result).toBeCloseTo(1807, 0)
  })

  it('should calculate payment for 24 month term', () => {
    // $7,000 loan at 15% APR for 24 months
    const result = calculateMonthlyPayment(7000, 15, 24)
    // Expected: ~$339 per month
    expect(result).toBeCloseTo(339, 0)
  })

  it('should calculate payment for 48 month term', () => {
    // $25,000 loan at 8% APR for 48 months
    const result = calculateMonthlyPayment(25000, 8, 48)
    // Expected: ~$610 per month
    expect(result).toBeCloseTo(610, 0)
  })

  it('should handle minimum loan amount', () => {
    // $1,500 at 12% APR for 36 months
    const result = calculateMonthlyPayment(1500, 12, 36)
    expect(result).toBeGreaterThan(0)
    expect(result).toBeCloseTo(49.85, 1)
  })

  it('should handle maximum loan amount', () => {
    // $100,000 at 5% APR for 60 months
    const result = calculateMonthlyPayment(100000, 5, 60)
    expect(result).toBeGreaterThan(0)
    expect(result).toBeCloseTo(1887, 0)
  })
})

describe('roundToWholeDollars', () => {
  it('should round to nearest whole dollar', () => {
    expect(roundToWholeDollars(322.67)).toBe(323)
    expect(roundToWholeDollars(322.49)).toBe(322)
    expect(roundToWholeDollars(322.5)).toBe(323)
  })

  it('should handle already whole numbers', () => {
    expect(roundToWholeDollars(100)).toBe(100)
    expect(roundToWholeDollars(0)).toBe(0)
  })

  it('should handle negative numbers', () => {
    expect(roundToWholeDollars(-10.5)).toBe(-10)
    expect(roundToWholeDollars(-10.6)).toBe(-11)
  })
})
