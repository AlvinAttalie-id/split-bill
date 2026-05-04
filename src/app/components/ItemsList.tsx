import { Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ItemCard } from './ItemCard';

export function ItemsList() {
  const { items, addItem } = useStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No items yet. Upload and scan a receipt to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-32">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}

      <button
        onClick={addItem}
        className="w-full h-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <Plus className="w-5 h-5" />
        Add Item
      </button>
    </div>
  );
}
