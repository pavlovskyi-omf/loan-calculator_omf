/**
 * Contract: generateComparisonAmounts
 * 
 * Generate three comparison amounts for the payment table with boundary-aware logic.
 * 
 * PURPOSE:
 * Provides three distinct loan amount values for users to compare monthly payments.
 * Ensures meaningful comparison options at boundary values (minimum and maximum).
 * 
 * BOUNDARY BEHAVIOR:
 * - At minimum (1500): returns [1500, 2500, 3500] with active at index 0
 * - At maximum (100000): returns [98000, 99000, 100000] with active at index 2
 * - Normal case: returns [committed-delta, committed, committed+delta] with active at index 1
 * 
 * ALGORITHM:
 * 1. If committed === min, return [min, min + delta, min + 2*delta]
 * 2. If committed === max, return [max - 2*delta, max - delta, max]
 * 3. Otherwise, return [clamp(committed - delta), committed, clamp(committed + delta)]
 * 
 * CONSTRAINTS:
 * - All returned values must be within [min, max] range
 * - Tuple must contain exactly three values
 * - Values should be distinct when possible
 * - Committed amount must appear in the result
 * 
 * @param committed - The committed loan amount (must be within [min, max])
 * @param delta - The difference to add/subtract (typically 1000)
 * @param min - Minimum allowed amount (typically 1500)
 * @param max - Maximum allowed amount (typically 100000)
 * 
 * @returns Tuple of three amounts: [low, mid, high] (or boundary-adjusted)
 * 
 * @throws Never throws - function is total (defined for all valid inputs)
 * 
 * @example
 * // At minimum boundary
 * generateComparisonAmounts(1500, 1000, 1500, 100000) 
 * // Returns: [1500, 2500, 3500]
 * // Usage: User sees [1500*, 2500, 3500] with 1500 active at start
 * 
 * @example
 * // At maximum boundary
 * generateComparisonAmounts(100000, 1000, 1500, 100000)
 * // Returns: [98000, 99000, 100000]
 * // Usage: User sees [98000, 99000, 100000*] with 100000 active at end
 * 
 * @example
 * // Normal case (mid-range)
 * generateComparisonAmounts(5000, 1000, 1500, 100000)
 * // Returns: [4000, 5000, 6000]
 * // Usage: User sees [4000, 5000*, 6000] with 5000 active in middle
 * 
 * @example
 * // Near minimum (standard logic applies, not boundary case)
 * generateComparisonAmounts(2500, 1000, 1500, 100000)
 * // Returns: [1500, 2500, 3500]
 * // Usage: User sees [1500, 2500*, 3500] with 2500 active in middle
 * 
 * @example
 * // Near maximum (standard logic applies, not boundary case)
 * generateComparisonAmounts(99000, 1000, 1500, 100000)
 * // Returns: [98000, 99000, 100000]
 * // Usage: User sees [98000, 99000*, 100000] with 99000 active in middle
 * 
 * PRECONDITIONS:
 * - min < max (valid range)
 * - min <= committed <= max (committed is within valid range)
 * - delta > 0 (positive spacing)
 * - delta * 2 <= (max - min) (delta fits within range)
 * 
 * POSTCONDITIONS:
 * - result.length === 3 (exactly three values)
 * - result[0] >= min (low boundary respected)
 * - result[2] <= max (high boundary respected)
 * - result[0] <= result[1] <= result[2] (monotonic non-decreasing)
 * - result.includes(committed) === true (committed amount present)
 * 
 * INVARIANTS:
 * - Pure function (no side effects, deterministic)
 * - Referential transparency (same inputs → same output)
 * - No framework dependencies (works in any JavaScript/TypeScript environment)
 * 
 * TYPE SIGNATURE:
 */
// export function generateComparisonAmounts(
//   committed: number,
//   delta: number,
//   min: number,
//   max: number
// ): [number, number, number]

/**
 * TEST CASES (expected in src/domain/validation.test.ts):
 * 
 * describe('generateComparisonAmounts - boundary logic', () => {
 *   test('minimum boundary (1500)', () => {
 *     expect(generateComparisonAmounts(1500, 1000, 1500, 100000))
 *       .toEqual([1500, 2500, 3500])
 *   })
 * 
 *   test('maximum boundary (100000)', () => {
 *     expect(generateComparisonAmounts(100000, 1000, 1500, 100000))
 *       .toEqual([98000, 99000, 100000])
 *   })
 * 
 *   test('normal mid-range (5000)', () => {
 *     expect(generateComparisonAmounts(5000, 1000, 1500, 100000))
 *       .toEqual([4000, 5000, 6000])
 *   })
 * 
 *   test('near minimum (2500) - standard logic', () => {
 *     expect(generateComparisonAmounts(2500, 1000, 1500, 100000))
 *       .toEqual([1500, 2500, 3500])
 *   })
 * 
 *   test('near maximum (99000) - standard logic', () => {
 *     expect(generateComparisonAmounts(99000, 1000, 1500, 100000))
 *       .toEqual([98000, 99000, 100000])
 *   })
 * })
 */
