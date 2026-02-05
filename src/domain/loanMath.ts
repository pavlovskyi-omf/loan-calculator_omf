export function monthlyRateFromApr(aprPercent: number): number {
  return (aprPercent / 100) / 12;
}

export function calculateMonthlyPayment(principal: number, aprPercent: number, termMonths: number): number {
  if (termMonths <= 0) throw new Error('termMonths must be > 0');
  if (principal <= 0) return 0;

  const r = monthlyRateFromApr(aprPercent);
  const n = termMonths;

  // Edge case: zero APR
  if (Math.abs(r) < 1e-12) {
    return Math.round(principal / n);
  }

  const pow = Math.pow(1 + r, n);
  const payment = principal * r * pow / (pow - 1);
  return Math.round(payment);
}

export default calculateMonthlyPayment;
