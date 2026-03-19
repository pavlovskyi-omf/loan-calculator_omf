import { describe, it, expect } from 'vitest'
import { validateAmount, clampAmount, generateComparisonAmounts } from './validation'

describe('validateAmount', () => {
  const min = 1500
  const max = 100000

  it('should validate amount within range', () => {
    const result = validateAmount(7000, min, max)
    expect(result.valid).toBe(true)
    expect(result.message).toBeUndefined()
  })

  it('should invalidate null amount', () => {
    const result = validateAmount(null, min, max)
    expect(result.valid).toBe(false)
    expect(result.message).toBeDefined()
    expect(result.message).toContain('required')
    expect(result.translationKey).toBe('validation.invalidFormat')
  })

  it('should invalidate amount below minimum', () => {
    const result = validateAmount(1000, min, max)
    expect(result.valid).toBe(false)
    expect(result.message).toBeDefined()
    expect(result.message).toContain('$1,500')
    expect(result.translationKey).toBe('validation.tooLow')
    expect(result.translationValues).toEqual({ min: '$1,500' })
  })

  it('should invalidate amount above maximum', () => {
    const result = validateAmount(150000, min, max)
    expect(result.valid).toBe(false)
    expect(result.message).toBeDefined()
    expect(result.message).toContain('$100,000')
    expect(result.translationKey).toBe('validation.tooHigh')
    expect(result.translationValues).toEqual({ max: '$100,000' })
  })

  it('should validate amount at minimum boundary', () => {
    const result = validateAmount(1500, min, max)
    expect(result.valid).toBe(true)
  })

  it('should validate amount at maximum boundary', () => {
    const result = validateAmount(100000, min, max)
    expect(result.valid).toBe(true)
  })
})

describe('clampAmount', () => {
  const min = 1500
  const max = 100000

  it('should return amount within range unchanged', () => {
    expect(clampAmount(7000, min, max)).toBe(7000)
    expect(clampAmount(50000, min, max)).toBe(50000)
  })

  it('should clamp amount below minimum to minimum', () => {
    expect(clampAmount(1000, min, max)).toBe(1500)
    expect(clampAmount(0, min, max)).toBe(1500)
    expect(clampAmount(-100, min, max)).toBe(1500)
  })

  it('should clamp amount above maximum to maximum', () => {
    expect(clampAmount(150000, min, max)).toBe(100000)
    expect(clampAmount(200000, min, max)).toBe(100000)
  })

  it('should not clamp boundary values', () => {
    expect(clampAmount(1500, min, max)).toBe(1500)
    expect(clampAmount(100000, min, max)).toBe(100000)
  })
})

describe('generateComparisonAmounts', () => {
  const delta = 1000
  const min = 1500
  const max = 100000

  it('should generate three amounts for typical value', () => {
    const result = generateComparisonAmounts(7000, delta, min, max)
    expect(result).toEqual([6000, 7000, 8000])
  })

  it('should clamp low values to minimum', () => {
    const result = generateComparisonAmounts(2000, delta, min, max)
    expect(result).toEqual([1500, 2000, 3000])
  })

  it('should clamp high values to maximum', () => {
    const result = generateComparisonAmounts(99500, delta, min, max)
    expect(result).toEqual([98500, 99500, 100000])
  })

  it('should handle amount at minimum', () => {
    const result = generateComparisonAmounts(1500, delta, min, max)
    expect(result).toEqual([1500, 2500, 3500])
  })

  it('should handle amount at maximum', () => {
    const result = generateComparisonAmounts(100000, delta, min, max)
    expect(result).toEqual([98000, 99000, 100000])
  })

  it('should handle boundary values with distinct amounts', () => {
    // At minimum: boundary logic provides distinct values [1500, 2500, 3500]
    const minResult = generateComparisonAmounts(1500, delta, min, max)
    expect(minResult).toEqual([1500, 2500, 3500])
    // At maximum: boundary logic provides distinct values [98000, 99000, 100000]
    const maxResult = generateComparisonAmounts(100000, delta, min, max)
    expect(maxResult).toEqual([98000, 99000, 100000])
  })

  it('should generate correct amounts for middle range', () => {
    const result = generateComparisonAmounts(50000, delta, min, max)
    expect(result).toEqual([49000, 50000, 51000])
  })
})

describe('generateComparisonAmounts - boundary logic', () => {
  const delta = 1000
  const min = 1500
  const max = 100000

  it('at minimum boundary (1500) shows [1500, 2500, 3500]', () => {
    const result = generateComparisonAmounts(1500, delta, min, max)
    expect(result).toEqual([1500, 2500, 3500])
  })

  it('at maximum boundary (100000) shows [98000, 99000, 100000]', () => {
    const result = generateComparisonAmounts(100000, delta, min, max)
    expect(result).toEqual([98000, 99000, 100000])
  })

  it('normal mid-range (5000) shows [4000, 5000, 6000]', () => {
    const result = generateComparisonAmounts(5000, delta, min, max)
    expect(result).toEqual([4000, 5000, 6000])
  })

  it('near minimum (2500) uses standard logic', () => {
    const result = generateComparisonAmounts(2500, delta, min, max)
    expect(result).toEqual([1500, 2500, 3500])
  })

  it('near maximum (99000) uses standard logic', () => {
    const result = generateComparisonAmounts(99000, delta, min, max)
    expect(result).toEqual([98000, 99000, 100000])
  })
})
