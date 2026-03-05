import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

interface BottomNavBarProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
    onUploadClick: () => void;
}

const TABS = [
    {
        mode: AppMode.CITY,
        label: 'City',
        accent: '#0071E3',
        icon: (stroke: number) => (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
    {
        mode: AppMode.HOME,
        label: 'Design',
        accent: '#BF5AF2',
        icon: (stroke: number) => (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        mode: AppMode.REARRANGE,
        label: 'Rearrange',
        accent: '#34C759',
        icon: (stroke: number) => (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
        ),
    },
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentMode, onModeChange, onUploadClick }) => {
    const currentAccent = TABS.find(t => t.mode === currentMode)?.accent || '#0071E3';

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div
                className="relative bottom-nav"
                style={{
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                }}
            >
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Left two tabs */}
                    {TABS.slice(0, 2).map(({ mode, label, accent, icon }) => {
                        const isActive = currentMode === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => onModeChange(mode)}
                                className="relative flex flex-col items-center justify-center w-16 h-full transition-colors"
                                style={{ color: isActive ? accent : '#AEAEB2' }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -top-px w-6 h-0.5 rounded-full"
                                        style={{ background: accent }}
                                        transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                                    />
                                )}
                                {icon(isActive ? 2 : 1.5)}
                                <span className="text-[9px] mt-1 font-medium tracking-tight">{label}</span>
                            </button>
                        );
                    })}

                    {/* FAB Upload */}
                    <div className="relative -mt-6 flex flex-col items-center">
                        <motion.button
                            onClick={onUploadClick}
                            className="w-13 h-13 rounded-full flex items-center justify-center text-white shadow-lg"
                            style={{
                                width: '52px',
                                height: '52px',
                                background: currentAccent,
                                boxShadow: `0 4px 14px ${currentAccent}40`,
                            }}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.04 }}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </motion.button>
                        <span className="text-[9px] mt-1.5 font-medium text-[#AEAEB2]">Upload</span>
                    </div>

                    {/* Rearrange tab */}
                    {TABS.slice(2).map(({ mode, label, accent, icon }) => {
                        const isActive = currentMode === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => onModeChange(mode)}
                                className="relative flex flex-col items-center justify-center w-16 h-full transition-colors"
                                style={{ color: isActive ? accent : '#AEAEB2' }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -top-px w-6 h-0.5 rounded-full"
                                        style={{ background: accent }}
                                        transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                                    />
                                )}
                                {icon(isActive ? 2 : 1.5)}
                                <span className="text-[9px] mt-1 font-medium tracking-tight">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
