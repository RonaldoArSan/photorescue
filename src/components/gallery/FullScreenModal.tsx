"use client"

import React from 'react';
import { PhotoRestoration } from '../../types';
import { X, Download } from 'lucide-react';
import BeforeAfterSlider from '../restore/BeforeAfterSlider';
import { Button } from '../ui/button';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-3xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 clay-button bg-white/90 hover:bg-white p-3 rounded-2xl shadow-lg"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {restoration.original_filename || 'Foto Restaurada'}
            </h2>
            {restoration.processing_time && (
              <p className="text-gray-600">
                Processado em {restoration.processing_time.toFixed(1)} segundos
              </p>
            )}
          </div>

          {restoration.restored_url && restoration.original_url ? (
            <BeforeAfterSlider
              beforeImage={restoration.original_url}
              afterImage={restoration.restored_url}
            />
          ) : (
            <div className="clay-inset rounded-3xl overflow-hidden">
              <img
                src={restoration.restored_url || restoration.original_url}
                alt={restoration.original_filename || 'Foto'}
                className="w-full h-auto"
              />
            </div>
          )}

          {restoration.analysis && (
            <div className="mt-8 clay-card bg-white/70 rounded-3xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">Análise da IA</h3>
              <p className="text-gray-700 whitespace-pre-line">{restoration.analysis}</p>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={onClose}
              variant="outline"
              className="clay-button bg-white/80 px-8 py-6 rounded-2xl text-lg font-bold hover:bg-white"
            >
              Fechar
            </Button>
            
            {restoration.restored_url && (
              <Button
                onClick={handleDownload}
                className="clay-button bg-linear-to-br from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 px-8 py-6 rounded-2xl text-lg font-bold text-white shadow-xl"
              >
                <Download className="w-6 h-6 inline mr-2" />
                Baixar Foto
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
