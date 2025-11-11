import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { PhotoRestoration } from '../../types';

interface PhotoCardProps {
  restoration: PhotoRestoration;
  onClick: () => void;
}

export default function PhotoCard({ restoration, onClick }: PhotoCardProps) {
  return (
    <div 
      className="clay-card bg-white/70 rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={onClick}
    >
      <div className="aspect-4/3 relative overflow-hidden">
        <img
          src={restoration.restored_url || restoration.original_url}
          alt={restoration.original_filename || 'Foto restaurada'}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-gray-800 mb-2 truncate">
          {restoration.original_filename || 'Foto sem nome'}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          {restoration.created_date ? new Date(restoration.created_date).toLocaleDateString() : 'Data não disponível'}
        </div>
        {restoration.processing_time && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {restoration.processing_time}s
          </div>
        )}
      </div>
    </div>
  );
}