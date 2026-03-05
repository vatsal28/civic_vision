import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  mode?: AppMode;
}

// Mode config
const modeConfig = {
  [AppMode.CITY]: {
    accent: '#0071E3',
    accentSoft: 'rgba(0,113,227,0.06)',
    accentBorder: 'rgba(0,113,227,0.2)',
    label: 'Upload a city or street photo',
    exampleImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80',
    exampleAlt: 'Example city street photo',
    icon: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  [AppMode.HOME]: {
    accent: '#BF5AF2',
    accentSoft: 'rgba(191,90,242,0.06)',
    accentBorder: 'rgba(191,90,242,0.2)',
    label: 'Upload a room photo',
    exampleImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
    exampleAlt: 'Example interior room photo',
    icon: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
  },
  [AppMode.REARRANGE]: {
    accent: '#34C759',
    accentSoft: 'rgba(52,199,89,0.06)',
    accentBorder: 'rgba(52,199,89,0.2)',
    label: 'Upload a room to rearrange',
    exampleImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80',
    exampleAlt: 'Example room for rearrangement',
    icon: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, mode = AppMode.CITY }) => {
  const [isDragging, setIsDragging] = useState(false);
  const config = modeConfig[mode];

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
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <div className="w-full relative">
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
        style={{
          aspectRatio: '16/7',
          minHeight: '260px',
          background: isDragging ? config.accentSoft : 'rgba(255,255,255,0.8)',
          border: `1.5px dashed ${isDragging ? config.accent : 'rgba(0,0,0,0.1)'}`,
          boxShadow: isDragging
            ? `0 0 0 3px ${config.accentBorder}, 0 4px 16px rgba(0,0,0,0.04)`
            : '0 1px 4px rgba(0,0,0,0.04)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Preview cards — desktop only */}
        <div className="absolute left-8 xl:left-16 top-1/2 -translate-y-1/2 w-36 xl:w-48 aspect-video rounded-xl overflow-hidden hidden md:block pointer-events-none opacity-25 group-hover:opacity-50 transition-all duration-500 rotate-[-6deg]"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <img src={config.exampleImage} alt={config.exampleAlt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        <div className="absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 w-36 xl:w-48 aspect-video rounded-xl overflow-hidden hidden md:block pointer-events-none opacity-25 group-hover:opacity-50 transition-all duration-500 rotate-[6deg]"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <img
            src={mode === AppMode.HOME || mode === AppMode.REARRANGE
              ? 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80'
              : 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=500&q=80'
            }
            alt="Example transformation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none p-6 text-center">
          <motion.div
            className="mb-4 p-3.5 rounded-2xl transition-transform"
            style={{
              background: isDragging ? config.accentSoft : 'rgba(255,255,255,0.9)',
              border: `1px solid ${isDragging ? config.accentBorder : 'rgba(0,0,0,0.06)'}`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
            animate={isDragging ? { scale: 1.08 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {config.icon(isDragging ? config.accent : '#6E6E73')}
          </motion.div>

          <p className="text-sm font-semibold text-[#1D1D1F] mb-1" style={{ letterSpacing: '-0.01em' }}>
            {config.label}
          </p>
          <p className="text-xs text-[#AEAEB2] mb-5">
            {isDragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
          </p>

          <div className="flex items-center gap-2">
            {['JPG', 'PNG', 'WEBP', 'HEIC'].map(fmt => (
              <span key={fmt} className="text-[10px] font-medium text-[#AEAEB2] px-2 py-0.5 rounded-md bg-white/80 border border-black/[0.06]">
                {fmt}
              </span>
            ))}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </motion.div>

      {/* Browse button below */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-3 flex justify-center"
      >
        <label className="relative cursor-pointer">
          <span
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-[0.97]"
            style={{ background: config.accent, color: '#fff', boxShadow: `0 2px 8px ${config.accent}30` }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Choose Photo
          </span>
          <input type="file" accept="image/*" onChange={handleInputChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </label>
      </motion.div>
    </div>
  );
};
