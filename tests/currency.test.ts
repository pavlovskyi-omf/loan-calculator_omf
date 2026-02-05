import { describe, it, expect } from 'vitest';
import { parseCurrency, formatCurrency } from '../src/domain/currency';

describe('currency utils', () => {
  it('parses various currency inputs', () => {
    expect(parseCurrency('$7,000')).toBe(7000);
    expect(parseCurrency('7000')).toBe(7000);
    expect(parseCurrency('7000.49')).toBe(7000);
    expect(parseCurrency('7000.5')).toBe(7001);
    expect(parseCurrency('')).toBeNull();
    expect(parseCurrency('abc')).toBeNull();
  });

  it('formats currency as whole dollars', () => {
    expect(formatCurrency(7000)).toBe('$7,000');
  });
});
