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
