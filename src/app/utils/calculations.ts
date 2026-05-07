/**
 * Pure calculation utilities — no side effects, no AI calls.
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const calculateItemTotal = (price: number, qty: number): number => {
  return price * qty;
};

export const calculatePerPerson = (
  price: number,
  qty: number,
  split: number
): number => {
  if (split <= 0) return 0;
  return (price * qty) / split;
};
