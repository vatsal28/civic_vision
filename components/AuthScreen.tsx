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
        <div className="flex h-[100dvh] items-center justify-center bg-[#FFF9F5] p-4 relative overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {/* Floating blobs */}
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />

            <style>{`
                .blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.15;
                    pointer-events: none;
                    z-index: 0;
                }
                .blob-1 {
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, #89D4BB, #C9B8DB);
                    top: -100px;
                    left: -100px;
                    animation: float 20s ease-in-out infinite;
                }
                .blob-2 {
                    width: 350px;
                    height: 350px;
                    background: linear-gradient(135deg, #FF8A80, #FCB69F);
                    bottom: -100px;
                    right: -100px;
                    animation: float 25s ease-in-out infinite reverse;
                }
                .blob-3 {
                    width: 300px;
                    height: 300px;
                    background: linear-gradient(135deg, #C9B8DB, #89D4BB);
                    top: 50%;
                    left: 50%;
                    animation: float 30s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(30px, -30px); }
                    66% { transform: translate(-20px, 20px); }
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 text-center border border-black/10 relative z-10"
            >
                {/* Logo/Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#89D4BB] to-[#C9B8DB] rounded-2xl flex items-center justify-center shadow-lg"
                >
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </motion.div>

                <h1 className="text-2xl font-bold text-[#2D2A32] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                    Welcome to Re-do.ai
                </h1>
                <p className="text-[#6B6574] mb-8 text-sm">
                    Transform any space with AI. Sign in to get started.
                </p>

                <div className="space-y-4">
                    {/* Google Sign-In */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
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
                        className="w-full py-3 px-4 bg-[#2D2A32] hover:bg-[#3D3A42] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Sign in with Google</span>
                    </motion.button>

                    {/* Free generations text */}
                    <div className="bg-gradient-to-r from-[#FF8A80]/10 to-[#FCB69F]/10 border border-[#FF8A80]/20 rounded-full px-4 py-2">
                        <p className="text-center text-sm font-semibold bg-gradient-to-r from-[#FF8A80] to-[#FCB69F] bg-clip-text text-transparent">
                            Sign in and get 2 free credits!
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-black/10"></div>
                        <span className="flex-shrink mx-4 text-[#6B6574] text-xs uppercase tracking-wider">Or use your own key</span>
                        <div className="flex-grow border-t border-black/10"></div>
                    </div>

                    {/* BYOK Option */}
                    <div className="bg-[#FFF9F5]/80 p-4 rounded-xl border border-black/10">
                        <form onSubmit={onManualKeySubmit} className="space-y-3">
                            <input
                                id="apiKeyInput"
                                type="password"
                                placeholder="Enter Gemini API Key (AIzaSy...)"
                                className="w-full bg-white border border-black/10 text-[#2D2A32] text-sm rounded-xl focus:ring-2 focus:ring-[#89D4BB] focus:border-transparent block p-3 placeholder-[#6B6574]/50 outline-none transition-all"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-white hover:bg-[#f5f5f5] text-[#2D2A32] font-medium rounded-full transition-all border border-black/10 shadow-sm hover:shadow-md"
                            >
                                Use My API Key
                            </button>
                        </form>
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#6B6574] hover:text-[#2D2A32] hover:underline mt-3 inline-block transition-colors"
                        >
                            Get a free key from Google AI Studio →
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-[10px] text-[#6B6574]">
                    By signing in, you agree to our{' '}
                    <a
                        href="/terms-of-service"
                        className="text-[#2D2A32] hover:underline font-medium"
                    >
                        Terms of Service
                    </a>
                    {' '}and{' '}
                    <a
                        href="/privacy-policy"
                        className="text-[#2D2A32] hover:underline font-medium"
                    >
                        Privacy Policy
                    </a>
                </p>
            </motion.div>
        </div>
    );
};
