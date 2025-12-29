import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

interface ModeSwitcherProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onModeChange }) => {
    return (
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 shadow-lg">
            {/* City Vision Tab */}
            <button
                onClick={() => onModeChange(AppMode.CITY)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${currentMode === AppMode.CITY
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
            >
                {currentMode === AppMode.CITY && (
                    <motion.div
                        layoutId="mode-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                )}
                <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="hidden sm:inline">City Vision</span>
                    <span className="sm:hidden">City</span>
                </span>
            </button>

            {/* Home Vision Tab */}
            <button
                onClick={() => onModeChange(AppMode.HOME)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${currentMode === AppMode.HOME
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
            >
                {currentMode === AppMode.HOME && (
                    <motion.div
                        layoutId="mode-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                )}
                <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="hidden sm:inline">Home Vision</span>
                    <span className="sm:hidden">Home</span>
                </span>
            </button>
        </div>
    );
};
