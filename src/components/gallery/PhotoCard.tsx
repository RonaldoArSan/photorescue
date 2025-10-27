"use client"

import React from 'react';
import { PhotoRestoration } from '../../types';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface PhotoCardProps {
  restoration: PhotoRestoration;
  onClick: () => void;
}

export default function PhotoCard({ restoration, onClick }: PhotoCardProps) {
  const getStatusIcon = () => {
    switch (restoration.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getStatusText = () => {
    switch (restoration.status) {
      case 'completed':
        return 'Concluída';
      case 'processing':
        return 'Processando...';
      case 'failed':
        return 'Falhou';
      default:
        return 'Concluída';
    }
  };

  const displayDate = restoration.created_date
    ? format(new Date(restoration.created_date), 'dd/MM/yyyy HH:mm')
    : 'Data desconhecida';

  return (
    <div
      onClick={onClick}
      className="clay-card bg-white/70 rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
    >
      <div className="clay-inset overflow-hidden relative aspect-4/3">
        <img
          src={restoration.restored_url || restoration.original_url}
          alt={restoration.original_filename || 'Foto restaurada'}
          className="w-full h-full object-cover"
        />
        {restoration.status === 'processing' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-white text-center">
              <Clock className="w-12 h-12 mx-auto mb-2 animate-spin" />
              <p className="font-bold">Processando...</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-800 truncate flex-1">
            {restoration.original_filename || 'foto.jpg'}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            {getStatusIcon()}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-1">{displayDate}</p>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{getStatusText()}</span>
          {restoration.processing_time && (
            <span className="text-gray-500">
              {restoration.processing_time.toFixed(1)}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
