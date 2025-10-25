import React, { useState } from 'react';
import { Download, Eye, Calendar, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PhotoRestoration } from '../../types';

interface PhotoCardProps {
  restoration: PhotoRestoration;
  onClick: () => void;
}

export default function PhotoCard({ restoration, onClick }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="clay-card bg-white/70 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={restoration.restored_url}
          alt={restoration.original_filename}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-linear-to-t from-purple-900/90 via-purple-900/50 to-transparent flex items-end justify-between p-6 animate-in fade-in duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="clay-button bg-white/90 p-3 rounded-2xl hover:bg-white transition-all"
            >
              <Eye className="w-5 h-5 text-purple-700" />
            </button>
            
            <button
              onClick={handleDownload}
              className="clay-button bg-linear-to-br from-purple-200 to-pink-200 px-5 py-3 rounded-2xl hover:from-purple-300 hover:to-pink-300 transition-all"
            >
              <Download className="w-5 h-5 text-purple-700 inline mr-2" />
              <span className="text-sm font-bold text-purple-700">Baixar</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-bold text-gray-800 mb-2 truncate">
          {restoration.original_filename || 'Foto Restaurada'}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {restoration.created_date && format(new Date(restoration.created_date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>

        {restoration.processing_time && (
          <div className="clay-inset bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl px-3 py-2 mt-3 inline-block">
            <span className="text-xs font-medium text-purple-700">
              Processado em {restoration.processing_time.toFixed(1)}s
            </span>
          </div>
        )}

        {restoration.analysis && (
          <div className="clay-inset bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Análise da IA</span>
            </div>
            <p className="text-xs text-blue-600 line-clamp-2">
              {restoration.analysis}
            </p>
            {restoration.suggestions && restoration.suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {restoration.suggestions.slice(0, 3).map((suggestion, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}