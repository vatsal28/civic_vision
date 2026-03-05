import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AuthMode } from '../types';

interface AuthScreenProps {
    onSelectAuthMode: (mode: AuthMode) => void;
    onManualKeySubmit: (e: React.FormEvent) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSelectAuthMode, onManualKeySubmit }) => {
    const { signInWithGoogle } = useAuth();

    return (
        <div
            className="flex h-[100dvh] items-center justify-center p-4 relative overflow-y-auto"
            style={{
                background: '#F5F5F7',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            }}
        >
            {/* Subtle radial background */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,113,227,0.05) 0%, transparent 60%)',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Logo + Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, #0071E3 0%, #34C759 100%)',
                        }}
                    >
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </motion.div>

                    <h1
                        className="text-2xl font-semibold text-[#1D1D1F] mb-1.5"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        Welcome to re-do.ai
                    </h1>
                    <p className="text-sm text-[#6E6E73] leading-relaxed">
                        Transform any space with AI.
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl p-6 space-y-4"
                    style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)',
                    }}
                >
                    {/* Google Sign-In */}
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                            try {
                                await signInWithGoogle();
                                onSelectAuthMode(AuthMode.GUEST);
                            } catch (error) {
                                console.error('Sign in failed:', error);
                                alert('Sign in failed. Please try again.');
                            }
                        }}
                        className="w-full py-3 px-4 text-[#1D1D1F] font-semibold rounded-xl transition-all flex items-center justify-center gap-3 text-sm"
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid rgba(0,0,0,0.12)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        }}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </motion.button>

                    {/* Credits badge */}
                    <div
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl"
                        style={{ background: 'rgba(52,199,89,0.06)', border: '1px solid rgba(52,199,89,0.15)' }}
                    >
                        <svg className="w-3.5 h-3.5 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="text-xs font-medium text-[#1D1D1F]">
                            Sign in and get <strong className="text-[#34C759]">2 free credits</strong>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 h-px bg-black/[0.06]" />
                        <span className="text-[11px] text-[#AEAEB2] font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-black/[0.06]" />
                    </div>

                    {/* BYOK */}
                    <div className="rounded-xl p-4 space-y-3" style={{ background: '#F5F5F7' }}>
                        <p className="text-[11px] font-medium text-[#6E6E73] uppercase tracking-wide">Use your own key</p>
                        <form onSubmit={onManualKeySubmit} className="space-y-2.5">
                            <input
                                id="apiKeyInput"
                                type="password"
                                placeholder="AIzaSy..."
                                className="w-full bg-white text-[#1D1D1F] text-sm rounded-xl px-3.5 py-2.5 placeholder-[#AEAEB2] outline-none transition-all"
                                style={{
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                }}
                                onFocus={(e) => { e.target.style.border = '1px solid #0071E3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'; }}
                                onBlur={(e) => { e.target.style.border = '1px solid rgba(0,0,0,0.1)'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'; }}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full py-2.5 px-4 text-[#1D1D1F] font-medium rounded-xl transition-all text-sm"
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                }}
                            >
                                Use My Key (Unlimited)
                            </button>
                        </form>
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#0071E3] hover:underline inline-flex items-center gap-1"
                        >
                            Get a free key from Google AI Studio
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-5 text-center text-[11px] text-[#AEAEB2]">
                    By continuing, you agree to our{' '}
                    <a href="/terms-of-service" className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Terms</a>
                    {' '}and{' '}
                    <a href="/privacy-policy" className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Privacy Policy</a>
                </p>
            </motion.div>
        </div>
    );
};
