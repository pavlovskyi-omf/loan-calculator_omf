import { describe, it, expect } from 'vitest';
import { validateAmount, MIN_AMOUNT, MAX_AMOUNT } from '../src/domain/validation';

describe('validateAmount', () => {
  it('rejects null/undefined', () => {
    expect(validateAmount(null).valid).toBe(false);
    expect(validateAmount(undefined).valid).toBe(false);
  });

  it('enforces min and max', () => {
    expect(validateAmount(MIN_AMOUNT - 1).valid).toBe(false);
    expect(validateAmount(MAX_AMOUNT + 1).valid).toBe(false);
    expect(validateAmount(MIN_AMOUNT).valid).toBe(true);
    expect(validateAmount(MAX_AMOUNT).valid).toBe(true);
  });
});
