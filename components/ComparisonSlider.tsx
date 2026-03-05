import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppMode } from '../types';

interface ComparisonSliderProps {
  originalImage: string;
  generatedImage: string;
  mode?: AppMode;
}

const MODE_ACCENT = {
  [AppMode.CITY]: '#0071E3',
  [AppMode.HOME]: '#BF5AF2',
  [AppMode.REARRANGE]: '#34C759',
};

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalImage,
  generatedImage,
  mode = AppMode.CITY,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const accentColor = MODE_ACCENT[mode] || '#0071E3';

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasInteracted(true);
    updatePosition(e.clientX);
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) { setIsDragging(true); setHasInteracted(true); updatePosition(e.touches[0].clientX); }
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    updatePosition(e.touches[0].clientX);
  }, [isDragging, updatePosition]);

  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const preventScroll = (e: TouchEvent) => { if (isDragging) e.preventDefault(); };
    container.addEventListener('touchmove', preventScroll, { passive: false });
    return () => container.removeEventListener('touchmove', preventScroll);
  }, [isDragging]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1D1D1F]">
      <div
        ref={containerRef}
        className="relative w-full h-full select-none"
        style={{ touchAction: 'none', cursor: isDragging ? 'col-resize' : 'col-resize' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Generated (right side — base) */}
        <img
          src={generatedImage}
          alt="AI-transformed room"
          className="absolute top-0 left-0 w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />

        {/* Original (left side — clip) */}
        <div
          className="absolute top-0 left-0 w-full h-full select-none pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`, willChange: 'clip-path' }}
        >
          <img
            src={originalImage}
            alt="Original room"
            className="absolute top-0 left-0 w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-px pointer-events-none z-10"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translateX(-50%)',
            background: `linear-gradient(to bottom, transparent 0%, ${accentColor} 10%, ${accentColor} 90%, transparent 100%)`,
            willChange: 'left',
            opacity: 0.9,
          }}
        />

        {/* Handle */}
        <div
          className="absolute top-1/2 pointer-events-none z-20"
          style={{ left: `${sliderPosition}%`, transform: 'translate(-50%, -50%)', willChange: 'left' }}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-100 ${isDragging ? 'scale-110' : 'scale-100'}`}
            style={{
              background: 'rgba(255,255,255,0.95)',
              border: `2px solid ${accentColor}`,
              boxShadow: isDragging
                ? `0 0 0 4px ${accentColor}20, 0 4px 12px rgba(0,0,0,0.2)`
                : `0 2px 8px rgba(0,0,0,0.15), 0 0 0 2px ${accentColor}20`,
            }}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke={accentColor} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div
          className="absolute top-3 left-3 pointer-events-none select-none px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide uppercase"
          style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            color: '#1D1D1F',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          Before
        </div>
        <div
          className="absolute top-3 right-3 pointer-events-none select-none px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide uppercase text-white"
          style={{
            background: accentColor,
            backdropFilter: 'blur(12px)',
          }}
        >
          After
        </div>

        {/* Drag hint */}
        {!hasInteracted && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none select-none animate-pulse">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[10px] font-medium"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Drag to compare
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
