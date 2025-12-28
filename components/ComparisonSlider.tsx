import React, { useState, useRef } from 'react';

interface ComparisonSliderProps {
  originalImage: string;
  generatedImage: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalImage,
  generatedImage,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      <div ref={containerRef} className="relative w-full h-full">

        {/* The Generated Image (Underneath, "Right" side) */}
        <img
          src={generatedImage}
          alt="Clean Version"
          className="absolute top-0 left-0 w-full h-full object-contain select-none"
        />

        {/* The Original Image (Overlay, "Left" side) */}
        <div
          className="absolute top-0 left-0 w-full h-full select-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <img
            src={originalImage}
            alt="Original Version"
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        </div>

        {/* Slider Handle Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 md:w-1 bg-cyan-400 cursor-ew-resize shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-none z-10"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translateX(-50%)',
          }}
        />

        {/* Slider Handle Button Graphic */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-slate-900/50 backdrop-blur-md rounded-full border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] pointer-events-none z-20"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#22d3ee" className="w-4 h-4 md:w-5 md:h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </div>

        {/* Labels */}
        <div className="absolute top-3 md:top-6 left-3 md:left-6 bg-black/40 text-white px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wide backdrop-blur-md border border-white/10 pointer-events-none select-none">
          BEFORE
        </div>
        <div className="absolute top-3 md:top-6 right-3 md:right-6 bg-cyan-500/80 text-white px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wide backdrop-blur-md border border-cyan-400/20 pointer-events-none select-none shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          FIX MY CITY
        </div>

        {/* Invisible Range Input for Interaction */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0 p-0 appearance-none touch-none"
        />
      </div>
    </div>
  );
};