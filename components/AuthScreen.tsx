import React from 'react';
import { motion } from 'framer-motion';

interface AuthScreenProps {
    onManualKeySubmit: (e: React.FormEvent) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onManualKeySubmit }) => {
    return (
        <div className="flex h-[100dvh] items-center justify-center bg-[#FFF9F5] p-4 relative overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />

            <style>{`
                .blob { position: fixed; border-radius: 50%; filter: blur(60px); opacity: 0.15; pointer-events: none; z-index: 0; }
                .blob-1 { width: 400px; height: 400px; background: linear-gradient(135deg, #89D4BB, #C9B8DB); top: -100px; left: -100px; animation: float 20s ease-in-out infinite; }
                .blob-2 { width: 350px; height: 350px; background: linear-gradient(135deg, #FF8A80, #FCB69F); bottom: -100px; right: -100px; animation: float 25s ease-in-out infinite reverse; }
                .blob-3 { width: 300px; height: 300px; background: linear-gradient(135deg, #C9B8DB, #89D4BB); top: 50%; left: 50%; animation: float 30s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(30px, -30px); } 66% { transform: translate(-20px, 20px); } }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 text-center border border-black/10 relative z-10"
            >
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
                    CivicVision
                </h1>
                <p className="text-[#6B6574] mb-6 text-sm">
                    Run the app locally with your own Gemini API key. The key stays in this browser session and is never committed to the repo.
                </p>

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
                        className="w-full py-3 px-4 bg-[#2D2A32] hover:bg-[#3D3A42] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl"
                    >
                        Use My Key
                    </button>
                </form>

                <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#6B6574] hover:text-[#2D2A32] hover:underline mt-4 inline-block transition-colors"
                >
                    Get a Gemini key from Google AI Studio →
                </a>

                <p className="mt-6 text-[10px] text-[#6B6574]">
                    By using the app, you call Google Gemini directly from your browser with your own key. Do not paste keys into machines or browsers you do not trust.
                </p>
            </motion.div>
        </div>
    );
};
