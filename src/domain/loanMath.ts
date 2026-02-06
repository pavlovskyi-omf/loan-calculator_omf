/**
 * Calculate monthly payment for an amortizing loan
 * @param principal - Loan amount
 * @param aprPercent - Annual percentage rate (e.g., 10 for 10%)
 * @param termMonths - Loan term in months
 * @returns Monthly payment amount (unrounded)
 */
export function calculateMonthlyPayment(
  principal: number,
  aprPercent: number,
  termMonths: number
): number {
  // Handle 0% APR as simple division
  if (aprPercent === 0) {
    return principal / termMonths
  }

  // Convert APR to monthly rate
  const monthlyRate = aprPercent / 100 / 12

  // Standard amortization formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, termMonths)
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1

  return principal * (numerator / denominator)
}

/**
 * Round a number to the nearest whole dollar
 * @param amount - Dollar amount to round
 * @returns Rounded amount
 */
export function roundToWholeDollars(amount: number): number {
  return Math.round(amount)
}
