import { RotateCcw, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, calculatePerPerson, calculateItemTotal } from '../utils/calculations';

export function Summary() {
  const { items, reset } = useStore();

  const grandTotal = items.reduce(
    (sum, item) => sum + calculateItemTotal(item.price, item.qty),
    0
  );

  const totalPerPerson = items.reduce(
    (sum, item) => sum + calculatePerPerson(item.price, item.qty, item.split),
    0
  );

  const handleExportJson = () => {
    const data = {
      items,
      grandTotal,
      totalPerPerson,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `splitbill-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Total per Person</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalPerPerson)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Grand Total</div>
            <div className="text-xl font-semibold">{formatCurrency(grandTotal)}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportJson}
            className="flex-1 h-12 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export JSON
          </button>
          <button
            onClick={reset}
            className="h-12 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
