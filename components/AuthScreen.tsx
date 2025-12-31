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
        <div className="flex h-[100dvh] items-center justify-center bg-[#0a0f1a] p-4 relative overflow-y-auto font-sans">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#111827] to-[#0f172a] z-0" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0 pointer-events-none mix-blend-overlay" />
            
            {/* Decorative blurs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4f7eff]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ec4899]/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#151c2c] backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 text-center border border-[#252f3f] relative z-10"
            >
                {/* Logo/Icon */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #4f7eff20, #6366f120)',
                        border: '1px solid #4f7eff30',
                        boxShadow: '0 0 30px #4f7eff20'
                    }}
                >
                    <svg className="w-8 h-8 text-[#4f7eff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </motion.div>

                <h1 className="text-2xl font-bold text-white mb-2">Welcome to Redo AI</h1>
                <p className="text-gray-400 mb-8 text-sm">
                    Redo your city & home with Redo AI. Sign in to get started.
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
                        className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg"
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
                    <p className="text-center text-sm text-[#4f7eff] font-medium">
                        Login and get 2 generations for free!
                    </p>

                    {/* Divider */}
                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-[#252f3f]"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider">Or use your own key</span>
                        <div className="flex-grow border-t border-[#252f3f]"></div>
                    </div>

                    {/* BYOK Option */}
                    <div className="bg-[#0f1520] p-4 rounded-xl border border-[#252f3f]">
                        <form onSubmit={onManualKeySubmit} className="space-y-3">
                            <input
                                id="apiKeyInput"
                                type="password"
                                placeholder="Enter Gemini API Key (AIzaSy...)"
                                className="w-full bg-[#151c2c] border border-[#252f3f] text-white text-sm rounded-xl focus:ring-[#4f7eff] focus:border-[#4f7eff] block p-3 placeholder-gray-500 outline-none transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-[#1e2638] hover:bg-[#252f3f] text-white font-medium rounded-xl transition-colors border border-[#252f3f]"
                            >
                                Use My API Key
                            </button>
                        </form>
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-[#4f7eff] hover:underline mt-3 inline-block"
                        >
                            Get a free key from Google AI Studio →
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-[10px] text-gray-600">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
};
