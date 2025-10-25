"use client"

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function UploadZone({ onFileSelect, isProcessing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFile) {
      onFileSelect(imageFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isProcessing && fileInputRef.current?.click()}
      className={`clay-card cursor-pointer relative overflow-hidden transition-all duration-300 ${
        isDragging 
          ? 'bg-linear-to-br from-purple-100 to-pink-100 border-4 border-purple-300' 
          : 'bg-white/70 border-4 border-white/50'
      } rounded-3xl p-16 text-center ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="relative z-10">
        <div className="clay-button bg-linear-to-br from-purple-200 to-pink-200 w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center float-animation">
          {isDragging ? (
            <ImageIcon className="w-12 h-12 text-purple-700" />
          ) : (
            <Upload className="w-12 h-12 text-purple-700" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {isDragging ? 'Solte sua foto aqui!' : 'Envie sua foto'}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Arraste e solte ou clique para selecionar uma foto antiga que você deseja restaurar
        </p>

        <div className="clay-inset bg-white/60 rounded-2xl px-6 py-4 inline-block">
          <p className="text-sm text-gray-500 font-medium">
            Suporta: JPG, PNG, WEBP
          </p>
        </div>
      </div>
    </div>
  );
}