import React, { useState, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const accentColor = mode === AppMode.HOME ? '#ec4899' : '#4f7eff';
  const isHomeMode = mode === AppMode.HOME;

  return (
    <div className="relative w-full h-full bg-[#0a0f1a] overflow-hidden">
      <div ref={containerRef} className="relative w-full h-full">

        {/* The Generated Image (Underneath, "Right" side) */}
        <img
          src={generatedImage}
          alt="Transformed Version"
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
          className="absolute top-0 bottom-0 w-0.5 cursor-ew-resize pointer-events-none z-10"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translateX(-50%)',
            backgroundColor: accentColor,
            boxShadow: `0 0 15px ${accentColor}80`,
          }}
        />

        {/* Slider Handle Button Graphic */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-[#151c2c]/80 backdrop-blur-md rounded-full flex items-center justify-center pointer-events-none z-20"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translate(-50%, -50%)',
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 20px ${accentColor}40`,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={accentColor} className="w-4 h-4 md:w-5 md:h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </div>

        {/* Labels */}
        <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#151c2c]/80 text-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold tracking-wide backdrop-blur-md border border-[#252f3f] pointer-events-none select-none">
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
