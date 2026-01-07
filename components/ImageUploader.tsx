import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  mode?: AppMode;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, mode = AppMode.CITY }) => {
  const [isDragging, setIsDragging] = useState(false);

  const isHomeMode = mode === AppMode.HOME;
  const accentColor = isHomeMode ? '#ec4899' : '#4f7eff';

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full relative group">
      {/* Glow effect behind the card */}
      <div 
        className="absolute -inset-1 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"
        style={{ background: `linear-gradient(135deg, ${accentColor}, ${isHomeMode ? '#f472b6' : '#6366f1'})` }}
      />

      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[280px] md:min-h-[400px] rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 border overflow-hidden
          ${isDragging
            ? 'bg-white/90 backdrop-blur-sm border-2'
            : 'bg-white/60 backdrop-blur-sm border-black/10 hover:border-black/20'
          }
        `}
        style={{
          borderColor: isDragging ? accentColor : undefined,
          boxShadow: isDragging ? `0 0 40px ${accentColor}30` : '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(45,42,50,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(45,42,50,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Decorative Preview Cards - Desktop only */}
        <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 w-40 lg:w-56 aspect-video rounded-xl overflow-hidden shadow-2xl border border-black/10 hidden md:block pointer-events-none rotate-[-8deg] opacity-30 group-hover:opacity-60 transition-all duration-500 bg-white/90">
          <img 
            src={isHomeMode 
              ? "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80"
              : "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80"
            } 
            alt="Preview 1" 
            className="w-full h-full object-cover opacity-70" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full border border-black/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-[#2D2A32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          </div>
        </div>

        <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 w-40 lg:w-56 aspect-video rounded-xl overflow-hidden shadow-2xl border border-black/10 hidden md:block pointer-events-none rotate-[8deg] opacity-30 group-hover:opacity-60 transition-all duration-500 bg-white/90">
          <img 
            src={isHomeMode 
              ? "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80"
              : "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=500&q=80"
            } 
            alt="Preview 2" 
            className="w-full h-full object-cover opacity-70" 
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{ background: `linear-gradient(135deg, ${accentColor}40, transparent)` }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none p-4 md:p-6 text-center">
          <motion.div 
            className={`p-4 md:p-5 rounded-2xl mb-5 md:mb-6 border transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${accentColor}15, ${isHomeMode ? '#f472b6' : '#6366f1'}15)`,
              borderColor: `${accentColor}30`,
              boxShadow: `0 0 30px ${accentColor}15`,
            }}
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke={accentColor}
              className="w-8 h-8 md:w-10 md:h-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </motion.div>

          <h3 className="text-lg md:text-2xl font-bold text-[#2D2A32] mb-2 tracking-wide">
            {isHomeMode ? 'Upload Your Room Photo' : 'Upload Your City Photo'}
          </h3>
          <p className="text-sm md:text-base text-[#6B6574] mb-6 md:mb-8 font-light max-w-xs">
            Drag and drop or click to browse
          </p>

          {/* File type indicators */}
          <div className="flex gap-2 opacity-50">
            <span className="text-[10px] bg-white px-2 py-1 rounded text-[#6B6574] border border-black/10">JPG</span>
            <span className="text-[10px] bg-white px-2 py-1 rounded text-[#6B6574] border border-black/10">PNG</span>
            <span className="text-[10px] bg-white px-2 py-1 rounded text-[#6B6574] border border-black/10">WEBP</span>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </motion.div>
    </div>
  );
};
