"use client"

import React, { useState } from 'react';
import { nanoBanana } from '../../api/nanoBananaClient';
import { useQuery } from '@tanstack/react-query';
import { ImageOff, Sparkles } from 'lucide-react';
import PhotoCard from '../../components/gallery/PhotoCard';
import FullScreenModal from '../../components/gallery/FullScreenModal';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { PhotoRestoration } from '../../types';

export default function GalleryClient() {
  const [selectedRestoration, setSelectedRestoration] = useState<PhotoRestoration | null>(null);

  const { data: restorations, isLoading } = useQuery({
    queryKey: ['restorations'],
    queryFn: () => nanoBanana.getRestorations(),
    initialData: [],
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="clay-button bg-linear-to-br from-blue-200 to-teal-200 w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center float-animation">
          <Sparkles className="w-10 h-10 text-blue-700" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
          Galeria de Restaurações
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Todas as suas fotos restauradas em um só lugar
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="clay-card bg-white/70 rounded-3xl overflow-hidden">
              <Skeleton className="aspect-4/3 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : restorations.length === 0 ? (
        <div className="clay-card bg-white/70 rounded-3xl p-16 text-center max-w-2xl mx-auto">
          <div className="clay-inset bg-gray-100 w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Nenhuma foto restaurada ainda
          </h3>
          <p className="text-gray-600 mb-6">
            Comece enviando sua primeira foto para restaurar
          </p>
          <Link
            href="/"
            className="clay-button bg-linear-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-2xl font-bold text-white inline-block"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Restaurar Primeira Foto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restorations.map((restoration) => (
            <PhotoCard
              key={restoration.id}
              restoration={restoration}
              onClick={() => setSelectedRestoration(restoration)}
            />
          ))}
        </div>
      )}

      {selectedRestoration && (
        <FullScreenModal
          restoration={selectedRestoration}
          onClose={() => setSelectedRestoration(null)}
        />
      )}

      {restorations.length > 0 && (
        <div className="mt-12 text-center">
          <div className="clay-inset bg-white/60 rounded-3xl px-8 py-6 inline-block">
            <p className="text-gray-600 font-medium">
              Total de restaurações: <span className="font-bold text-purple-600">{restorations.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}