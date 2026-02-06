/**
 * Validation result for amount input
 */
export interface ValidationResult {
  valid: boolean
  message?: string
}

/**
 * Validate that an amount is within the specified range
 * @param amount - Amount to validate (can be null)
 * @param min - Minimum allowed amount
 * @param max - Maximum allowed amount
 * @returns Validation result with optional error message
 */
export function validateAmount(
  amount: number | null,
  min: number,
  max: number
): ValidationResult {
  if (amount === null) {
    return {
      valid: false,
      message: 'Amount is required',
    }
  }

  if (amount < min) {
    return {
      valid: false,
      message: `Amount must be at least $${min.toLocaleString()}`,
    }
  }

  if (amount > max) {
    return {
      valid: false,
      message: `Amount must not exceed $${max.toLocaleString()}`,
    }
  }

  return {
    valid: true,
  }
}

/**
 * Clamp an amount to be within the specified range
 * @param amount - Amount to clamp
 * @param min - Minimum allowed amount
 * @param max - Maximum allowed amount
 * @returns Clamped amount
 */
export function clampAmount(amount: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, amount))
}

/**
 * Generate three comparison amounts for the payment table
 * Returns [committed - delta, committed, committed + delta], all clamped to min/max
 * @param committed - The committed loan amount
 * @param delta - The difference to add/subtract (typically 1000)
 * @param min - Minimum allowed amount
 * @param max - Maximum allowed amount
 * @returns Array of three amounts (may contain duplicates if clamped)
 */
export function generateComparisonAmounts(
  committed: number,
  delta: number,
  min: number,
  max: number
): [number, number, number] {
  const low = clampAmount(committed - delta, min, max)
  const mid = committed
  const high = clampAmount(committed + delta, min, max)

  return [low, mid, high]
}
