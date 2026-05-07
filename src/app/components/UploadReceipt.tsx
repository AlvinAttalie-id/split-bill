import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { scanReceipt } from '../utils/receiptApi';

export function UploadReceipt() {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    if (file && isImageFile(file)) {
      handleFile(file);
    } else {
      toast.error('Only JPG, PNG, or WebP images are accepted');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const isImageFile = (file: File) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScanReceipt = async () => {
    if (!selectedFile) {
      toast.error('Please select a receipt image first');
      return;
    }

    setIsScanning(true);

    try {
      const items = await scanReceipt(selectedFile);

      if (items.length === 0) {
        toast.warning('No items found in receipt. Try a clearer image.');
        setItems([]);
        return;
      }

      setItems(items);
      toast.success(`✅ Found ${items.length} item${items.length > 1 ? 's' : ''} from receipt`);
    } catch (err) {
      console.error('Scan failed:', err);
      toast.error('Failed to scan receipt. Please try again.');
      setItems([]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRemove = () => {
    setReceiptImage(null);
    setSelectedFile(null);
    setItems([]);
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <p className="mb-2">Drag &amp; drop receipt image here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button
            id="choose-file-btn"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose File
          </button>
          <p className="text-xs text-gray-400 mt-2">JPG, PNG, or WebP</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
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
            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
                <p className="text-white font-medium text-sm">Scanning receipt with AI…</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              id="scan-receipt-btn"
              onClick={handleScanReceipt}
              disabled={isScanning}
              className="flex-1 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Scan Receipt
                </>
              )}
            </button>

            <button
              id="remove-receipt-btn"
              onClick={handleRemove}
              disabled={isScanning}
              className="px-6 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
