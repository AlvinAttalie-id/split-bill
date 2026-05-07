import { Trash2 } from 'lucide-react';
import { ReceiptItem } from '../types';
import { useStore } from '../store/useStore';
import { formatCurrency, calculatePerPerson } from '../utils/calculations';

interface ItemCardProps {
  item: ReceiptItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const { updateItem, removeItem } = useStore();

  const perPerson = calculatePerPerson(item.price, item.qty, item.split);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => updateItem(item.id, { name: e.target.value })}
          className="flex-1 px-3 h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Item name"
        />
        <button
          onClick={() => removeItem(item.id)}
          className="h-12 w-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Price</label>
          <input
            type="number"
            value={item.price}
            onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })}
            className="w-full px-3 h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Qty</label>
          <input
            type="number"
            value={item.qty}
            onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
            className="w-full px-3 h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Split</label>
          <input
            type="number"
            value={item.split}
            onChange={(e) => updateItem(item.id, { split: Number(e.target.value) })}
            className="w-full px-3 h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Per Person</span>
          <span className="font-semibold text-blue-600">{formatCurrency(perPerson)}</span>
        </div>
      </div>
    </div>
  );
}
