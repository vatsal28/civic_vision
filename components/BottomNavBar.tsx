import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

interface BottomNavBarProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
    onUploadClick: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
    currentMode,
    onModeChange,
    onUploadClick
}) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Gradient blur background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9F5] via-[#FFF9F5]/98 to-transparent pointer-events-none" style={{ height: '120%', top: '-20%' }} />

            <div className="relative bg-white/95 backdrop-blur-xl border-t border-black/10 bottom-nav shadow-lg">
                <div className="flex items-center justify-around h-16 px-4">
                    {/* City Tab */}
                    <button
                        onClick={() => onModeChange(AppMode.CITY)}
                        className={`relative flex flex-col items-center justify-center w-16 h-full transition-colors ${
                            currentMode === AppMode.CITY ? 'text-[#4f7eff]' : 'text-[#6B6574]'
                        }`}
                    >
                        {currentMode === AppMode.CITY && (
                            <motion.div
                                layoutId="nav-indicator"
                                className="absolute -top-0.5 w-8 h-1 bg-[#4f7eff] rounded-full"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                            />
                        )}
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentMode === AppMode.CITY ? 2 : 1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-[10px] mt-0.5 font-medium">City</span>
                    </button>

                    {/* FAB Upload Button */}
                    <div className="relative -mt-8">
                        <motion.button
                            onClick={onUploadClick}
                            className="fab-button w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </motion.button>
                    </div>

                    {/* Home Tab */}
                    <button
                        onClick={() => onModeChange(AppMode.HOME)}
                        className={`relative flex flex-col items-center justify-center w-16 h-full transition-colors ${
                            currentMode === AppMode.HOME ? 'text-[#ec4899]' : 'text-[#6B6574]'
                        }`}
                    >
                        {currentMode === AppMode.HOME && (
                            <motion.div
                                layoutId="nav-indicator"
                                className="absolute -top-0.5 w-8 h-1 bg-[#ec4899] rounded-full"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                            />
                        )}
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentMode === AppMode.HOME ? 2 : 1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-[10px] mt-0.5 font-medium">Home</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};


