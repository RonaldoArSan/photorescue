
import { X, Download } from 'lucide-react';
import BeforeAfterSlider from '../restore/BeforeAfterSlider';
import AIAnalysisCard from './AIAnalysisCard';
import { PhotoRestoration } from '../../types';

interface FullScreenModalProps {
  restoration: PhotoRestoration;
  onClose: () => void;
}

export default function FullScreenModal({ restoration, onClose }: FullScreenModalProps) {
  const handleDownload = async () => {
    if (!restoration.restored_url) return;
    
    try {
      const response = await fetch(restoration.restored_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `restored-${restoration.original_filename || 'photo.jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="clay-card bg-white/95 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {restoration.original_filename || 'Foto Restaurada'}
          </h2>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="clay-button bg-linear-to-br from-purple-200 to-pink-200 px-6 py-3 rounded-2xl hover:from-purple-300 hover:to-pink-300 transition-all"
            >
              <Download className="w-5 h-5 text-purple-700 inline mr-2" />
              <span className="font-bold text-purple-700">Baixar</span>
            </button>
            
            <button
              onClick={onClose}
              className="clay-button bg-white/80 p-3 rounded-2xl hover:bg-red-50 transition-all"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        <BeforeAfterSlider
          beforeImage={restoration.original_url}
          afterImage={restoration.restored_url || ''}
        />

        <AIAnalysisCard
          analysis={restoration.analysis}
          suggestions={restoration.suggestions}
        />
      </div>
    </div>
  );
}