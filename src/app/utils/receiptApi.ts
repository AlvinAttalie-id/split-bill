import { ReceiptItem } from '../types';

/**
 * Send a receipt image file to the backend OCR endpoint.
 * Returns validated ReceiptItem[] ready for state injection.
 *
 * The API key lives ONLY on the server — never exposed to the frontend.
 */
export async function scanReceipt(file: File): Promise<ReceiptItem[]> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/scan', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error ?? `Server error: ${res.status}`);
  }

  const data = await res.json();

  // Map server response → ReceiptItem (inject split = 1 per spec)
  const items: ReceiptItem[] = data.map(
    (item: { id: string; name: string; price: number; qty: number }) => ({
      ...item,
      split: 1,
    })
  );

  return items;
}
