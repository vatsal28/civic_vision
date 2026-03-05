import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppMode } from '../types';

interface GeneratingModalProps {
    isOpen: boolean;
    mode: AppMode;
}

// Fun messages for City mode
const CITY_MESSAGES = [
    { text: "Cleaning up the streets...", emoji: "🧹" },
    { text: "Planting some trees...", emoji: "🌳" },
    { text: "Adding a fresh coat of paint...", emoji: "🎨" },
    { text: "Removing that graffiti...", emoji: "✨" },
    { text: "Making the grass greener...", emoji: "🌿" },
    { text: "Fixing those potholes...", emoji: "🛠️" },
    { text: "Installing bike lanes...", emoji: "🚴" },
    { text: "Polishing the sidewalks...", emoji: "💎" },
    { text: "Trimming the hedges...", emoji: "✂️" },
    { text: "Chasing away the pigeons...", emoji: "🐦" },
    { text: "Watering the flowers...", emoji: "🌸" },
    { text: "Hanging up fairy lights...", emoji: "✨" },
    { text: "Summoning the clean-up crew...", emoji: "🦸" },
    { text: "Casting beautification spell...", emoji: "🪄" },
    { text: "Consulting the architects...", emoji: "📐" },
];

// Fun messages for Home mode
const HOME_MESSAGES = [
    { text: "Rearranging the furniture...", emoji: "🛋️" },
    { text: "Picking the perfect plants...", emoji: "🌿" },
    { text: "Adjusting the lighting...", emoji: "💡" },
    { text: "Fluffing the pillows...", emoji: "🛏️" },
    { text: "Choosing the color palette...", emoji: "🎨" },
    { text: "Hanging some art...", emoji: "🖼️" },
    { text: "Adding cozy textures...", emoji: "🧶" },
    { text: "Polishing the floors...", emoji: "✨" },
    { text: "Styling the shelves...", emoji: "📚" },
    { text: "Setting the mood...", emoji: "🕯️" },
    { text: "Consulting the feng shui...", emoji: "☯️" },
    { text: "Unleashing the interior designer...", emoji: "👩‍🎨" },
    { text: "Making it Pinterest-worthy...", emoji: "📌" },
    { text: "Adding that wow factor...", emoji: "🌟" },
    { text: "Brewing some design magic...", emoji: "🪄" },
];

export const GeneratingModal: React.FC<GeneratingModalProps> = ({ isOpen, mode }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const messages = mode === AppMode.HOME ? HOME_MESSAGES : CITY_MESSAGES;
    
    // Rotate messages every 2.5 seconds
    useEffect(() => {
        if (!isOpen) {
            setCurrentMessageIndex(0);
            return;
        }

        // Start with a random message
        setCurrentMessageIndex(Math.floor(Math.random() * messages.length));

        const interval = setInterval(() => {
            setCurrentMessageIndex(prev => {
                let next = Math.floor(Math.random() * messages.length);
                // Avoid showing the same message twice in a row
                while (next === prev && messages.length > 1) {
                    next = Math.floor(Math.random() * messages.length);
                }
                return next;
            });
        }, 2500);

        return () => clearInterval(interval);
    }, [isOpen, messages.length]);

    const currentMessage = messages[currentMessageIndex];
    const accentColor = mode === AppMode.HOME ? '#BF5AF2' : mode === AppMode.REARRANGE ? '#34C759' : '#0071E3';
    const gradientFrom = mode === AppMode.HOME ? '#BF5AF2' : mode === AppMode.REARRANGE ? '#34C759' : '#0071E3';
    const gradientTo = mode === AppMode.HOME ? '#AF52DE' : mode === AppMode.REARRANGE ? '#30D158' : '#0077ED';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-[#F5F5F7]/92 backdrop-blur-xl" />

                    {/* Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto"
                    >
                        {/* Animated orb/glow */}
                        <div className="relative mb-8">
                            {/* Outer glow rings */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
                                    width: 160,
                                    height: 160,
                                    marginLeft: -40,
                                    marginTop: -40,
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                            
                            {/* Second ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
                                    width: 200,
                                    height: 200,
                                    marginLeft: -60,
                                    marginTop: -60,
                                }}
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />

                            {/* Main spinning circle */}
                            <motion.div
                                className="relative w-20 h-20 rounded-full flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                                    boxShadow: `0 0 40px ${accentColor}60`,
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                {/* Inner circle with emoji */}
                                <motion.div
                                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
                                    animate={{ rotate: -360 }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={currentMessageIndex}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 180 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-3xl"
                                        >
                                            {currentMessage.emoji}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>

                            {/* Floating particles */}
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full"
                                    style={{
                                        background: accentColor,
                                        left: 40,
                                        top: 40,
                                    }}
                                    animate={{
                                        x: Math.cos((i * 60 * Math.PI) / 180) * (50 + Math.random() * 20),
                                        y: Math.sin((i * 60 * Math.PI) / 180) * (50 + Math.random() * 20),
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: 'easeOut',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Text content */}
                        <div className="space-y-3">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentMessageIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-xl md:text-2xl font-semibold text-[#1D1D1F]"
                                    style={{ letterSpacing: '-0.01em' }}
                                >
                                    {currentMessage.text}
                                </motion.p>
                            </AnimatePresence>

                            <p className="text-sm text-[#6E6E73]">
                                This usually takes 15–30 seconds
                            </p>

                            {/* Progress dots */}
                            <div className="flex justify-center gap-1.5 pt-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: accentColor }}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 1, 0.3],
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

