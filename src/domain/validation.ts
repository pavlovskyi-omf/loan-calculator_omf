export const MIN_AMOUNT = 1500;
export const MAX_AMOUNT = 100000;

export function validateAmount(amount: number | null | undefined): { valid: boolean; message?: string } {
  if (amount == null) return { valid: false, message: 'Enter an amount' };
  if (!Number.isFinite(amount)) return { valid: false, message: 'Invalid amount' };
  if (amount < MIN_AMOUNT) return { valid: false, message: `Minimum amount is $${MIN_AMOUNT}` };
  if (amount > MAX_AMOUNT) return { valid: false, message: `Maximum amount is $${MAX_AMOUNT}` };
  return { valid: true };
}

export default validateAmount;
