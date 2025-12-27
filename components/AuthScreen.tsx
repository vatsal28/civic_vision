import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthMode } from '../types';

interface AuthScreenProps {
    onSelectAuthMode: (mode: AuthMode) => void;
    onManualKeySubmit: (e: React.FormEvent) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSelectAuthMode, onManualKeySubmit }) => {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="flex h-[100dvh] items-start md:items-center justify-center bg-slate-900 p-3 md:p-6 pt-16 md:pt-6 relative overflow-y-auto font-sans">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>

            <div className="w-full max-w-lg bg-slate-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl p-4 md:p-8 text-center border border-slate-700 relative z-10 animate-fade-in">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Welcome to CivicVision</h1>
                <p className="text-slate-400 mb-6 md:mb-8 text-xs md:text-sm px-2">
                    Visualize improved urban spaces using AI. Sign in to get 1 free credit.
                </p>

                <div className="space-y-3 md:space-y-4">
                    {/* Google Sign-In */}
                    <button
                        onClick={async () => {
                            try {
                                await signInWithGoogle();
                                onSelectAuthMode(AuthMode.GUEST);
                            } catch (error) {
                                console.error('Sign in failed:', error);
                                alert('Sign in failed. Please try again.');
                            }
                        }}
                        className="w-full py-2.5 md:py-3 px-3 md:px-4 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 md:gap-3 shadow-lg text-sm md:text-base"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="truncate">Sign in with Google</span>
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-700"></div>
                        <span className="flex-shrink mx-2 md:mx-4 text-slate-500 text-[10px] md:text-xs whitespace-nowrap">OR USE YOUR OWN KEY</span>
                        <div className="flex-grow border-t border-slate-700"></div>
                    </div>

                    {/* BYOK Option */}
                    <div className="bg-slate-900/50 p-3 md:p-4 rounded-xl border border-slate-700/50">
                        <form onSubmit={onManualKeySubmit} className="space-y-2 md:space-y-3">
                            <input
                                id="apiKeyInput"
                                type="password"
                                placeholder="Enter Gemini API Key (AIzaSy...)"
                                className="w-full bg-slate-800 border border-slate-700 text-white text-xs md:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2 md:p-2.5 placeholder-slate-500 outline-none transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full py-2 md:py-2.5 px-3 md:px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors border border-slate-600 text-sm md:text-base"
                            >
                                Use My API Key
                            </button>
                        </form>
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs text-cyan-400 hover:underline mt-2 inline-block">Get a free key</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
