import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className="clay-card relative rounded-3xl overflow-hidden aspect-4/3 bg-gray-100 select-none"
    >
      {/* Before Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={beforeImage} 
          alt="Antes" 
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* After Image with Clip */}
      <div 
        className="absolute inset-0 z-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={afterImage} 
          alt="Depois" 
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Labels - fora do clip path */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-4 left-4 clay-button bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl">
          <span className="text-sm font-bold text-gray-700">Antes</span>
        </div>
        
        <div className="absolute top-4 right-4 clay-button bg-linear-to-br from-purple-200 to-pink-200 backdrop-blur-sm px-4 py-2 rounded-2xl">
          <span className="text-sm font-bold text-purple-700">Depois</span>
        </div>
      </div>

      {/* Slider */}
      <div
        className="absolute inset-y-0 cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute inset-y-0 w-1 bg-white shadow-lg -ml-0.5" />
        
        <div className="clay-button absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-3 rounded-2xl cursor-grab active:cursor-grabbing shadow-xl hover:scale-110 transition-transform">
          <MoveHorizontal className="w-5 h-5 text-purple-600" />
        </div>
      </div>
    </div>
  );
}