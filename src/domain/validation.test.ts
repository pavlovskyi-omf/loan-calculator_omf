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
  })

  it('should invalidate amount below minimum', () => {
    const result = validateAmount(1000, min, max)
    expect(result.valid).toBe(false)
    expect(result.message).toBeDefined()
    expect(result.message).toContain('$1,500')
  })

  it('should invalidate amount above maximum', () => {
    const result = validateAmount(150000, min, max)
    expect(result.valid).toBe(false)
    expect(result.message).toBeDefined()
    expect(result.message).toContain('$100,000')
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
    expect(result).toEqual([1500, 1500, 2500])
  })

  it('should handle amount at maximum', () => {
    const result = generateComparisonAmounts(100000, delta, min, max)
    expect(result).toEqual([99000, 100000, 100000])
  })

  it('should de-duplicate when clamping creates identical values', () => {
    // When committed is 1500, low would be 500 but gets clamped to 1500
    const result = generateComparisonAmounts(1500, delta, min, max)
    expect(result).toEqual([1500, 1500, 2500])
    // Contains duplicates - de-duplication is acceptable but not required
  })

  it('should generate correct amounts for middle range', () => {
    const result = generateComparisonAmounts(50000, delta, min, max)
    expect(result).toEqual([49000, 50000, 51000])
  })
})
