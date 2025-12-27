import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

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
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full aspect-[21/9] min-h-[300px] md:min-h-[400px] rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 border overflow-hidden
          ${isDragging
            ? 'bg-slate-800/80 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.3)]'
            : 'bg-slate-900/60 backdrop-blur-xl border-cyan-500/30 hover:border-cyan-500/60'
          }
        `}
      >
        {/* Decorative Grid Background inside the card */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        {/* Decorative Thumbnails (Slider Previews) */}

        {/* Left Preview Card */}
        <div className="absolute left-6 lg:left-16 top-1/2 -translate-y-1/2 w-48 lg:w-64 aspect-video rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-600/50 hidden md:block pointer-events-none rotate-[-6deg] opacity-40 group-hover:opacity-80 transition-opacity duration-500 bg-slate-800 z-0">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80" alt="Preview 1" className="w-full h-full object-cover opacity-80" />
          </div>
          {/* Split line simulation */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/40 -translate-x-1/2"></div>
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900/40 backdrop-blur-md rounded-full border border-white/60 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          </div>
          {/* Subtle gradient to simulate before/after difference */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none"></div>
        </div>

        {/* Right Preview Card */}
        <div className="absolute right-6 lg:right-16 top-1/2 -translate-y-1/2 w-48 lg:w-64 aspect-video rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-600/50 hidden md:block pointer-events-none rotate-[6deg] opacity-40 group-hover:opacity-80 transition-opacity duration-500 bg-slate-800 z-0">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=500&q=80" alt="Preview 2" className="w-full h-full object-cover opacity-80" />
          </div>
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/40 -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900/40 backdrop-blur-md rounded-full border border-white/60 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-cyan-400/10 to-transparent pointer-events-none"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none p-4 md:p-6 text-center">
          <div className={`p-3 md:p-5 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 mb-4 md:mb-6 transition-transform duration-300 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] ${isDragging ? 'scale-110' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-cyan-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 tracking-wide drop-shadow-md px-2">
            Drag and Drop Your Image Here
          </h3>
          <p className="text-xs md:text-base text-slate-400 mb-6 md:mb-8 font-light px-2">
            or click to browse. Supports JPEG, PNG, WEBP
          </p>

          <div className="flex gap-4 md:gap-8 opacity-60">
            <div className="h-1 w-8 md:w-12 bg-slate-700 rounded-full"></div>
            <div className="h-1 w-8 md:w-12 bg-slate-700 rounded-full"></div>
            <div className="h-1 w-8 md:w-12 bg-slate-700 rounded-full"></div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Fake progress bar decoration from screenshot */}
        <div className="absolute bottom-8 right-12 w-32 flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-cyan-400"></div>
          </div>
          <span className="text-xs text-slate-500 font-mono">0%</span>
        </div>
      </div>
    </div>
  );
};