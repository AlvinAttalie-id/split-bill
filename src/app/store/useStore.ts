import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, ReceiptItem } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      receiptImage: null,
      items: [],

      setReceiptImage: (image) => set({ receiptImage: image }),

      setItems: (items) => set({ items }),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      addItem: () =>
        set((state) => ({
          items: [
            ...state.items,
            {
              id: generateId(),
              name: 'New Item',
              price: 0,
              qty: 1,
              split: 1,
            },
          ],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      reset: () => set({ receiptImage: null, items: [] }),
    }),
    {
      name: 'splitbill-storage',
    }
  )
);
