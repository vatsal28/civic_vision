import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppMode } from '../types';

interface ComparisonSliderProps {
  originalImage: string;
  generatedImage: string;
  mode?: AppMode;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalImage,
  generatedImage,
  mode = AppMode.CITY,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const accentColor = mode === AppMode.HOME ? '#ec4899' : '#4f7eff';

  // Calculate position from pointer/touch coordinates
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Pointer events for unified mouse/touch handling
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
    
    // Capture pointer for smooth dragging outside container
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Touch events as fallback for older devices
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    }
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    updatePosition(e.touches[0].clientX);
  }, [isDragging, updatePosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Prevent default touch behavior on the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      container.removeEventListener('touchmove', preventScroll);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full h-full bg-[#FFF9F5] overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full h-full select-none"
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* The Generated Image (Underneath, "Right" side) */}
        <img
          src={generatedImage}
          alt={`AI-transformed ${mode === AppMode.HOME ? 'interior room design' : 'urban space'} showing redesigned space with enhanced aesthetics`}
          className="absolute top-0 left-0 w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />

        {/* The Original Image (Overlay, "Left" side) */}
        <div
          className="absolute top-0 left-0 w-full h-full select-none pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            willChange: 'clip-path',
          }}
        >
          <img
            src={originalImage}
            alt={`Original ${mode === AppMode.HOME ? 'room' : 'urban space'} photo before AI transformation`}
            className="absolute top-0 left-0 w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Slider Handle Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 pointer-events-none z-10"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translateX(-50%)',
            backgroundColor: accentColor,
            boxShadow: `0 0 15px ${accentColor}80`,
            willChange: 'left',
          }}
        />

        {/* Slider Handle Button - Larger touch target on mobile */}
        <div
          className="absolute top-1/2 pointer-events-none z-20"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translate(-50%, -50%)',
            willChange: 'left',
          }}
        >
          {/* Invisible larger touch area */}
          <div className="absolute -inset-4 md:-inset-2" />
          
          {/* Visible handle */}
          <div
            className={`w-10 h-10 md:w-10 md:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center transition-transform duration-150 shadow-lg ${isDragging ? 'scale-110' : ''}`}
            style={{
              border: `2px solid ${accentColor}`,
              boxShadow: isDragging
                ? `0 0 30px ${accentColor}60, 0 0 60px ${accentColor}30`
                : `0 0 20px ${accentColor}40`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke={accentColor}
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-white/80 text-[#2D2A32] px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold tracking-wide backdrop-blur-md border border-black/10 pointer-events-none select-none shadow-sm">
          BEFORE
        </div>
        <div
          className="absolute top-3 md:top-4 right-3 md:right-4 text-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold tracking-wide backdrop-blur-md pointer-events-none select-none"
          style={{
            backgroundColor: `${accentColor}cc`,
            boxShadow: `0 0 15px ${accentColor}40`,
          }}
        >
          AFTER
        </div>

        {/* Drag hint - shows on first interaction */}
        {!isDragging && sliderPosition === 50 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#6B6574] text-xs pointer-events-none select-none animate-pulse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Drag to compare</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
