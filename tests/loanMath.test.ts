import { describe, it, expect } from 'vitest';
import { calculateMonthlyPayment } from '../src/domain/loanMath';

describe('calculateMonthlyPayment', () => {
  it('calculates payment for zero APR as principal / months (rounded)', () => {
    const payment = calculateMonthlyPayment(10000, 0, 36);
    // 10000 / 36 = 277.777... rounds to 278
    expect(payment).toBe(278);
  });

  it('calculates payment for non-zero APR', () => {
    const payment = calculateMonthlyPayment(10000, 5, 36);
    // known approximate result is about $299.6 -> 300
    expect(payment).toBe(300);
  });

  it('returns 0 for non-positive principal', () => {
    expect(calculateMonthlyPayment(0, 5, 36)).toBe(0);
  });
});
