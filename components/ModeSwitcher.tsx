import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

interface ModeSwitcherProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const MODES = [
    {
        mode: AppMode.CITY,
        label: 'City Vision',
        accent: '#0071E3',
        icon: (stroke: number) => (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
    {
        mode: AppMode.HOME,
        label: 'Home Design',
        accent: '#BF5AF2',
        icon: (stroke: number) => (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        mode: AppMode.REARRANGE,
        label: 'Rearrange',
        accent: '#34C759',
        icon: (stroke: number) => (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
        ),
    },
];

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onModeChange }) => {
    const currentModeConfig = MODES.find(m => m.mode === currentMode);

    return (
        <div
            className="hidden md:flex items-center justify-center p-1 rounded-full"
            style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
        >
            {MODES.map(({ mode, label, accent, icon }) => {
                const isActive = currentMode === mode;
                return (
                    <button
                        key={mode}
                        onClick={() => onModeChange(mode)}
                        className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                        style={{ color: isActive ? '#fff' : '#6E6E73' }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="mode-indicator"
                                className="absolute inset-0 rounded-full"
                                style={{ background: accent }}
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                            {icon(isActive ? 2 : 1.5)}
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
