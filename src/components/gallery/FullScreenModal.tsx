import React from 'react';
import { X, Download } from 'lucide-react';
import { PhotoRestoration } from '../../types';
import BeforeAfterSlider from '../restore/BeforeAfterSlider';

interface FullScreenModalProps {
  restoration: PhotoRestoration;
  onClose: () => void;
}

export default function FullScreenModal({ restoration, onClose }: FullScreenModalProps) {
  const handleDownload = () => {
    if (restoration.restored_url) {
      const link = document.createElement('a');
      link.href = restoration.restored_url;
      link.download = `restored_${restoration.original_filename || 'photo.jpg'}`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {restoration.original_filename || 'Foto Restaurada'}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="clay-button bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="clay-button bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {restoration.restored_url ? (
            <BeforeAfterSlider
              beforeImage={restoration.original_url}
              afterImage={restoration.restored_url}
            />
          ) : (
            <img
              src={restoration.original_url}
              alt="Foto"
              className="w-full h-auto rounded-2xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}