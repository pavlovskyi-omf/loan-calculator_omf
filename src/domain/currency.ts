export function parseCurrency(input: string | null | undefined): number | null {
  if (input == null) return null;
  const cleaned = input.replace(/\$/g, '').replace(/,/g, '').trim();
  if (cleaned === '') return null;
  const n = Number(cleaned);
  if (Number.isNaN(n)) return null;
  // Round to nearest whole dollar for app consistency
  return Math.round(n);
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default { parseCurrency, formatCurrency };
