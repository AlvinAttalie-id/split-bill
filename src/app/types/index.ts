export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  split: number;
}

export interface AppState {
  receiptImage: string | null;
  items: ReceiptItem[];
  setReceiptImage: (image: string | null) => void;
  setItems: (items: ReceiptItem[]) => void;
  updateItem: (id: string, updates: Partial<ReceiptItem>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  reset: () => void;
}
