import { ReceiptItem } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockOcr = (): ReceiptItem[] => {
  return [
    {
      id: generateId(),
      name: 'Nasi Goreng Special',
      price: 45000,
      qty: 2,
      split: 1,
    },
    {
      id: generateId(),
      name: 'Es Teh Manis',
      price: 8000,
      qty: 3,
      split: 1,
    },
    {
      id: generateId(),
      name: 'Ayam Bakar',
      price: 35000,
      qty: 1,
      split: 1,
    },
    {
      id: generateId(),
      name: 'Sate Kambing',
      price: 50000,
      qty: 2,
      split: 1,
    },
    {
      id: generateId(),
      name: 'Jus Alpukat',
      price: 15000,
      qty: 2,
      split: 1,
    },
  ];
};

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

export const calculatePerPerson = (price: number, qty: number, split: number): number => {
  if (split === 0) return 0;
  return (price * qty) / split;
};
