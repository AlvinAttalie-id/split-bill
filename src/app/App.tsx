import { Receipt } from 'lucide-react';
import { UploadReceipt } from './components/UploadReceipt';
import { ItemsList } from './components/ItemsList';
import { Summary } from './components/Summary';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <header className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Receipt className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">SplitBill AI</h1>
          </div>
          <p className="text-gray-600">Upload receipt, split the bill instantly</p>
        </header>

        <UploadReceipt />

        <ItemsList />

        <Summary />
      </div>
    </div>
  );
}