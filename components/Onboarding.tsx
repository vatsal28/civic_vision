import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Onboarding.css';

interface OnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
}

interface Step {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
    highlight?: string;
}

const STEPS: Step[] = [
    {
        id: 0,
        icon: (
            <svg className="w-16 h-16 md:w-20 md:h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        title: "Welcome to Redo AI",
        description: "Transform cities and interiors with AI-powered visualization. Let's take a quick tour!",
        highlight: 'welcome'
    },
    {
        id: 1,
        icon: (
            <svg className="w-12 h-12 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ),
        title: "Choose Your Mode",
        description: "Switch between City Mode for urban renewal or Home Mode for interior design transformations.",
        highlight: 'mode'
    },
    {
        id: 2,
        icon: (
            <svg className="w-12 h-12 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: "Upload Your Image",
        description: "Upload a city street, neighborhood, or room interior you want to transform.",
        highlight: 'uploader'
    },
    {
        id: 3,
        icon: (
            <svg className="w-12 h-12 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        ),
        title: "Select Improvements",
        description: "City: remove trash, add greenery, fresh paint. Home: change style, add plants, upgrade furniture!",
        highlight: 'filters'
    },
    {
        id: 4,
        icon: (
            <svg className="w-12 h-12 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "Transform with AI",
        description: "Hit 'Transform Image' and watch AI work its magic to create a cleaner, better vision.",
        highlight: 'transform'
    },
    {
        id: 5,
        icon: (
            <svg className="w-12 h-12 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
        ),
        title: "Compare Before & After",
        description: "Drag the slider left and right to reveal the stunning transformation.",
        highlight: 'slider'
    },
    {
        id: 6,
        icon: (
            <svg className="w-12 h-12 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
        ),
        title: "Download & Share",
        description: "Save your transformed image and share your vision of a better space!",
        highlight: 'download'
    },
    {
        id: 7,
        icon: (
            <svg className="w-16 h-16 md:w-20 md:h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "You're All Set!",
        description: "Start transforming spaces now. Click the '?' button in the top bar anytime to replay this tour.",
        highlight: 'complete'
    }
];

// Floating particles for welcome/complete screens
const FloatingParticles: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
                initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                    y: [null, Math.random() * -200 - 100],
                    opacity: [0.3, 0.8, 0],
                }}
                transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    delay: Math.random() * 2,
                }}
            />
        ))}
    </div>
);

// Step indicator dots
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
    currentStep,
    totalSteps,
}) => (
    <div className="flex gap-2 justify-center">
        {[...Array(totalSteps)].map((_, i) => (
            <motion.div
                key={i}
                className={`h-2 rounded-full transition-colors ${i === currentStep
                    ? 'bg-cyan-400 w-6'
                    : i < currentStep
                        ? 'bg-cyan-600 w-2'
                        : 'bg-slate-600 w-2'
                    }`}
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        ))}
    </div>
);

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = STEPS.length;
    const step = STEPS[currentStep];
    const isWelcome = currentStep === 0;
    const isComplete = currentStep === totalSteps - 1;

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
    };

    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        if (newDirection > 0 && currentStep < totalSteps - 1) {
            setPage([page + 1, 1]);
            setCurrentStep(currentStep + 1);
        } else if (newDirection < 0 && currentStep > 0) {
            setPage([page - 1, -1]);
            setCurrentStep(currentStep - 1);
        } else if (newDirection > 0 && currentStep === totalSteps - 1) {
            onComplete();
        }
    };

    return (
        <motion.div
            className="onboarding-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Animated background */}
            <div className="onboarding-bg" />

            {/* Floating particles for welcome/complete */}
            {(isWelcome || isComplete) && <FloatingParticles />}

            {/* Main content card */}
            <div className="onboarding-container">
                {/* Skip button (not shown on complete screen) */}
                {!isComplete && (
                    <motion.button
                        className="onboarding-skip"
                        onClick={onSkip}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Skip Tour
                    </motion.button>
                )}

                {/* Progress bar */}
                <div className="onboarding-progress">
                    <motion.div
                        className="onboarding-progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                </div>

                {/* Step content with animation */}
                <div className="onboarding-content">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="onboarding-step"
                        >
                            {/* Icon with glow effect */}
                            <motion.div
                                className={`onboarding-icon ${isWelcome || isComplete ? 'onboarding-icon-large' : ''}`}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                            >
                                {step.icon}
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                className="onboarding-title"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {step.title}
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                className="onboarding-description"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {step.description}
                            </motion.p>

                            {/* Feature preview illustration for middle steps */}
                            {!isWelcome && !isComplete && (
                                <motion.div
                                    className="onboarding-illustration"
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className={`onboarding-demo onboarding-demo-${step.highlight}`}>
                                        {step.highlight === 'mode' && (
                                            <div className="demo-mode">
                                                <div className="demo-mode-switcher">
                                                    <motion.div
                                                        className="demo-mode-option demo-mode-city"
                                                        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                                                        transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                                                    >
                                                        <span className="demo-mode-icon">🏙️</span>
                                                        <span>City</span>
                                                    </motion.div>
                                                    <motion.div
                                                        className="demo-mode-option demo-mode-home"
                                                        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                                                        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                                                    >
                                                        <span className="demo-mode-icon">🏠</span>
                                                        <span>Home</span>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        )}
                                        {step.highlight === 'uploader' && (
                                            <div className="demo-upload">
                                                <motion.div
                                                    className="demo-upload-icon"
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                >
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </motion.div>
                                                <span className="text-xs text-slate-400">Drag & drop or click</span>
                                            </div>
                                        )}
                                        {step.highlight === 'filters' && (
                                            <div className="demo-filters">
                                                {[
                                                    { label: 'Remove Trash', mode: 'city' },
                                                    { label: 'Add Greenery', mode: 'city' },
                                                    { label: 'Modern Style', mode: 'home' },
                                                    { label: 'Add Plants', mode: 'home' }
                                                ].map((filter, i) => (
                                                    <motion.div
                                                        key={filter.label}
                                                        className={`demo-filter-item ${filter.mode === 'home' ? 'demo-filter-home' : ''}`}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.5 + i * 0.12 }}
                                                    >
                                                        <motion.div
                                                            className={`demo-checkbox ${filter.mode === 'home' ? 'demo-checkbox-home' : ''}`}
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.25 }}
                                                        >
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </motion.div>
                                                        <span>{filter.label}</span>
                                                        <span className={`demo-filter-badge ${filter.mode === 'home' ? 'demo-filter-badge-home' : ''}`}>
                                                            {filter.mode === 'city' ? '🏙️' : '🏠'}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                        {step.highlight === 'transform' && (
                                            <div className="demo-transform">
                                                <motion.div
                                                    className="demo-button"
                                                    animate={{
                                                        boxShadow: [
                                                            '0 0 20px rgba(34, 211, 238, 0.3)',
                                                            '0 0 40px rgba(34, 211, 238, 0.6)',
                                                            '0 0 20px rgba(34, 211, 238, 0.3)'
                                                        ]
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Transform Image
                                                </motion.div>
                                            </div>
                                        )}
                                        {step.highlight === 'slider' && (
                                            <div className="demo-slider">
                                                <div className="demo-slider-container">
                                                    <div className="demo-before">BEFORE</div>
                                                    <motion.div
                                                        className="demo-slider-handle"
                                                        animate={{ x: [-20, 20, -20] }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                                    />
                                                    <div className="demo-after">AFTER</div>
                                                </div>
                                            </div>
                                        )}
                                        {step.highlight === 'download' && (
                                            <div className="demo-download">
                                                <motion.div
                                                    className="demo-download-btn"
                                                    animate={{ y: [0, 3, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Celebration animation for complete screen */}
                            {isComplete && (
                                <motion.div
                                    className="onboarding-celebration"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="celebration-particle"
                                            style={{
                                                background: ['#22d3ee', '#3b82f6', '#8b5cf6', '#ec4899'][i % 4],
                                            }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0, 1, 0],
                                                x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                                                y: Math.sin((i * 30 * Math.PI) / 180) * 80,
                                            }}
                                            transition={{
                                                duration: 1,
                                                delay: 0.4 + i * 0.05,
                                                ease: 'easeOut',
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Step indicator */}
                <div className="onboarding-indicators">
                    <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
                </div>

                {/* Navigation buttons */}
                <div className="onboarding-navigation">
                    {!isWelcome && (
                        <motion.button
                            className="onboarding-btn onboarding-btn-secondary"
                            onClick={() => paginate(-1)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </motion.button>
                    )}

                    <motion.button
                        className={`onboarding-btn onboarding-btn-primary ${isWelcome ? 'onboarding-btn-full' : ''}`}
                        onClick={() => paginate(1)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isWelcome ? "Let's Go!" : isComplete ? 'Start Creating' : 'Next'}
                        {!isComplete && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
