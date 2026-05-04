import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockOcr } from '../utils/mockOcr';

export function UploadReceipt() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { receiptImage, setReceiptImage, setItems } = useStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScanReceipt = () => {
    const items = mockOcr();
    setItems(items);
  };

  return (
    <div className="space-y-4">
      {!receiptImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="mb-2">Drag & drop receipt image here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose File
          </button>
          <p className="text-xs text-gray-400 mt-2">JPG or PNG only</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-100">
            <img
              src={receiptImage}
              alt="Receipt preview"
              className="w-full h-64 object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleScanReceipt}
              className="flex-1 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-5 h-5" />
              Scan Receipt
            </button>
            <button
              onClick={() => setReceiptImage(null)}
              className="px-6 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
