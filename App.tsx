import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { FilterControls } from './components/FilterControls';
import { ComparisonSlider } from './components/ComparisonSlider';
import { PricingModal } from './components/PricingModal';
import { AuthScreen } from './components/AuthScreen';
import { generateIdealImage } from './services/geminiService';
import { createCompositeImage } from './utils/imageUtils';
import { AppState, AuthMode } from './types';
import { FILTERS } from './constants';
import { useAuth } from './contexts/AuthContext';
import * as analytics from './services/analyticsService';

const App: React.FC = () => {
  const { user, credits, loading, signInWithGoogle, signOut } = useAuth();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  // BYOK State
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [showPricing, setShowPricing] = useState(false);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    FILTERS.filter(f => f.isDefault).map(f => f.id)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Auto-set authMode to GUEST when user signs in
  React.useEffect(() => {
    if (user && !authMode) {
      setAuthMode(AuthMode.GUEST);
    }
  }, [user, authMode]);

  // Auth Handlers
  const handleSelectAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    analytics.trackAuthModeSelected(mode === AuthMode.GUEST ? 'guest' : 'byok');
  };

  const handleManualKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById('apiKeyInput') as HTMLInputElement).value;
    if (input.trim().length > 10) {
      setUserApiKey(input.trim());
      setAuthMode(AuthMode.BYOK);
      sessionStorage.setItem('civic_vision_key', input.trim());
      analytics.trackAuthModeSelected('byok');
    }
  };

  const handleConnectAiStudio = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // In AI Studio context, we treat this as BYOK but the key is in env
        setAuthMode(AuthMode.BYOK);
        setUserApiKey(import.meta.env.VITE_GEMINI_API_KEY || '');
      } catch (e) {
        console.error("Failed to select key", e);
      }
    }
  };

  // Image & Filter Handlers
  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setAppState(AppState.READY);
    setError(null);
    analytics.trackImageUploaded();
  };

  const handleToggleFilter = (id: string) => {
    setSelectedFilters(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const handlePurchase = (amount: number, cost: number) => {
    // MOCK PAYMENT INTEGRATION
    // In a real app, this would trigger Razorpay/Stripe
    // await razorpay.open({ amount: cost * 100 ... })

    // Simulate API delay
    const btn = document.activeElement as HTMLButtonElement;
    if (btn) btn.disabled = true;

    setTimeout(() => {
      // setCredits(prev => prev + amount); // TODO: Will be handled by Cloud Function
      setShowPricing(false);
      alert(`Payment Successful! Added ${amount} credits.`);
      if (btn) btn.disabled = false;
    }, 1500);
  };

  const handleGenerate = async () => {
    if (!originalImage || selectedFilters.length === 0) return;

    // Check Credits if in Guest Mode
    if (authMode === AuthMode.GUEST) {
      if (credits <= 0) {
        setShowPricing(true);
        analytics.trackCreditsExhausted();
        return;
      }
    }

    setAppState(AppState.GENERATING);
    setError(null);

    const authModeStr = authMode === AuthMode.GUEST ? 'guest' : 'byok';
    analytics.trackGenerateStarted(selectedFilters.length, authModeStr);
    analytics.trackFiltersSelected(selectedFilters, selectedFilters.length);

    try {
      const base64Data = originalImage.split(',')[1];
      const activeFilters = FILTERS.filter(f => selectedFilters.includes(f.id));

      let resultBase64: string;

      if (authMode === AuthMode.GUEST && user) {
        // GUEST MODE: Call Cloud Function (secure, server-side)
        const { getFunctions, httpsCallable } = await import('firebase/functions');
        const functions = getFunctions();
        const generateImageFn = httpsCallable(functions, 'generateImage');

        const response = await generateImageFn({
          base64Image: base64Data,
          filters: activeFilters,
        });

        const data = response.data as { success: boolean; generatedImage: string; credits: number };
        if (!data.success) {
          throw new Error('Failed to generate image');
        }

        resultBase64 = data.generatedImage;
        // Credits are automatically updated via Firestore listener in AuthContext
      } else {
        // BYOK MODE: Call Gemini API directly with user's key
        const keyToUse = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;
        if (!keyToUse) {
          throw new Error("API Key is missing configuration.");
        }
        resultBase64 = await generateIdealImage(base64Data, activeFilters, keyToUse);
      }

      setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
      setAppState(AppState.COMPARING);
      analytics.trackGenerateSuccess(selectedFilters.length, authModeStr);
    } catch (err: any) {
      console.error(err);

      const errorMessage = err.message || JSON.stringify(err);

      // Track error type for analytics
      let errorType = 'unknown';
      if (errorMessage.includes('INVALID_API_KEY')) {
        errorType = 'invalid_key';
      } else if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('MODEL_NOT_AVAILABLE')) {
        errorType = 'permission_denied';
      } else if (errorMessage.includes('QUOTA_EXCEEDED') || errorMessage.includes('resource-exhausted')) {
        errorType = 'quota_exceeded';
      } else if (errorMessage.includes('CONTENT_BLOCKED')) {
        errorType = 'content_blocked';
      }
      analytics.trackGenerateError(errorType, authModeStr);

      // Handle specific error codes from geminiService
      if (errorMessage.includes('INVALID_API_KEY')) {
        setError("Invalid API Key. Please check your key and try again.");
        if (authMode === AuthMode.BYOK) {
          setAuthMode(null);
          sessionStorage.removeItem('civic_vision_key');
        }
      } else if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('MODEL_NOT_AVAILABLE')) {
        setError("Model access denied. Please enable billing in Google AI Studio: aistudio.google.com");
        if (authMode === AuthMode.BYOK) {
          setAuthMode(null);
          sessionStorage.removeItem('civic_vision_key');
        }
      } else if (errorMessage.includes('QUOTA_EXCEEDED') || errorMessage.includes('resource-exhausted')) {
        if (authMode === AuthMode.BYOK) {
          setError("Daily quota exceeded (~2 images/day free). Try again tomorrow or enable billing.");
        } else {
          setError("Insufficient credits. Please purchase more credits.");
          setShowPricing(true);
        }
      } else if (errorMessage.includes('CONTENT_BLOCKED')) {
        setError("Image blocked by safety filters. Please try a different image.");
      } else if (errorMessage.includes('403') || errorMessage.includes('unauthenticated')) {
        setError("API Key authentication failed. Please check your key.");
        if (authMode === AuthMode.BYOK) {
          setAuthMode(null);
          sessionStorage.removeItem('civic_vision_key');
        }
      } else {
        setError("Something went wrong. Please try again or use a different image.");
      }
      setAppState(AppState.READY);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  const handleDownloadComposite = async () => {
    if (!originalImage || !generatedImage) return;
    const blob = await createCompositeImage(originalImage, generatedImage);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'civic-vision-transformation.jpg';
      a.click();
      URL.revokeObjectURL(url);
      analytics.trackImageDownloaded();
    }
  };

  const handleOpenComposite = async () => {
    if (!originalImage || !generatedImage) return;
    try {
      const blob = await createCompositeImage(originalImage, generatedImage);
      if (blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (e) {
      console.error("Error opening image:", e);
    }
  };

  // --- RENDER: AUTHENTICATION SCREEN ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user && !authMode) {
    return <AuthScreen onSelectAuthMode={handleSelectAuthMode} onManualKeySubmit={handleManualKeySubmit} />;
  }

  // --- RENDER: MAIN APP ---
  // --- RENDER: MAIN APP ---
  return (
    <div className="flex h-[100dvh] w-full flex-col md:flex-row bg-[#0f172a] text-white overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#172554] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>

      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          onPurchase={handlePurchase}
        />
      )}

      {/* Sidebar Controls - Full screen on mobile when visible */}
      <div className={`
        ${appState === AppState.IDLE ? 'hidden' : ''}
        ${appState === AppState.COMPARING ? 'hidden md:flex' : 'flex'}
        flex-col flex-shrink-0 transition-all duration-300 z-20 relative
        h-full md:h-full md:max-h-full overflow-y-auto
      `}>
        <FilterControls
          selectedFilters={selectedFilters}
          onToggleFilter={handleToggleFilter}
          onGenerate={handleGenerate}
          isGenerating={appState === AppState.GENERATING}
          onReset={handleReset}
        />
      </div>

      <main className="flex-1 relative flex flex-col h-full overflow-y-auto z-10">

        {/* Top Bar: Credits or Logout */}
        <div className="absolute top-2 md:top-4 right-2 md:right-4 z-40 flex items-center gap-1.5 md:gap-3 flex-wrap justify-end max-w-[calc(100vw-1rem)]">
          {authMode === AuthMode.GUEST && (
            <>
              <button
                onClick={() => {
                  setShowPricing(true);
                  analytics.trackPricingModalOpened(credits);
                }}
                className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105 whitespace-nowrap"
              >
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span className="hidden sm:inline">{credits} Credits</span>
                <span className="sm:hidden">{credits}</span>
                <span className="bg-white/20 px-1 md:px-1.5 rounded text-[8px] md:text-[10px]">TOP UP</span>
              </button>
              {user && (
                <button
                  onClick={async () => {
                    await signOut();
                    setAuthMode(null);
                    setOriginalImage(null);
                    setGeneratedImage(null);
                    setAppState(AppState.IDLE);
                  }}
                  className="flex items-center gap-1 md:gap-2 bg-slate-700 hover:bg-slate-600 text-white text-[10px] md:text-xs font-medium px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg transition-all whitespace-nowrap"
                  title="Sign out"
                >
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={() => {
              setAuthMode(null);
              setUserApiKey('');
              setAppState(AppState.IDLE);
              sessionStorage.removeItem('civic_vision_key');
            }}
            className="text-xs text-slate-500 hover:text-white transition-colors bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700/50"
          >
            {authMode === AuthMode.BYOK ? 'Remove Key' : 'Switch Mode'}
          </button>
        </div>

        {error && (
          <div className="absolute top-12 md:top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/90 backdrop-blur-md border border-red-500/50 text-red-100 px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-2xl flex items-center gap-2 md:gap-3 max-w-[90vw] md:max-w-lg animate-fade-in-down">
            <span className="text-xs md:text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 w-full h-full p-3 md:p-12 pt-12 md:pt-12 flex flex-col items-center justify-start md:justify-center relative min-h-0 overflow-y-auto">

          {appState === AppState.IDLE && (
            <div className="w-full max-w-6xl mx-auto flex flex-col items-center animate-fade-in px-2 mt-4 md:mt-0">
              <div className="text-center mb-4 md:mb-10 space-y-2 md:space-y-4">
                <h1 className="text-2xl md:text-5xl font-bold text-white tracking-tight drop-shadow-sm">
                  Transform Cityscapes
                </h1>
                <p className="text-sm md:text-lg text-slate-400 font-light px-4">
                  Upload a photo to see a cleaner, greener future.
                </p>
              </div>
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          )}

          {(appState === AppState.READY || appState === AppState.GENERATING) && originalImage && (
            <div className="w-full max-w-5xl flex flex-col items-center animate-fade-in h-full justify-center">
              <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm group max-h-[30vh] md:max-h-full">
                <img
                  src={originalImage}
                  alt="Original"
                  className={`w-full h-full object-contain transition-all duration-700 ${appState === AppState.GENERATING ? 'scale-[1.02] opacity-40 blur-sm' : 'opacity-100'}`}
                />

                {appState === AppState.GENERATING && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
                      <div className="relative w-20 h-20 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-8 tracking-wide">Refining Visuals...</h3>
                    <p className="text-cyan-400/80 mt-2 font-mono text-sm">Applying {selectedFilters.length} aesthetic improvements</p>
                  </div>
                )}
              </div>

              {appState === AppState.READY && (
                <p className="mt-6 text-slate-400 text-center animate-pulse hidden md:block">
                  Select your improvements in the sidebar and click
                  <span className="text-cyan-400 font-bold mx-1">Transform Image</span>
                </p>
              )}
            </div>
          )}

          {appState === AppState.COMPARING && originalImage && generatedImage && (
            <div className="w-full max-w-6xl h-full flex flex-col animate-fade-in p-2 md:p-4">
              <div className="flex-1 relative rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.1)] border border-slate-700/50 bg-slate-900/50 min-h-0">
                <ComparisonSlider
                  originalImage={originalImage}
                  generatedImage={generatedImage}
                />
              </div>

              <div className="mt-3 md:mt-6 flex flex-wrap justify-center items-center gap-2 md:gap-4 bg-slate-900/60 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-700/50 shadow-xl flex-shrink-0">
                {/* Mobile-only Adjust Filters */}
                <button
                  onClick={() => setAppState(AppState.READY)}
                  className="md:hidden px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 hover:border-slate-500 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Filters
                </button>

                <button
                  onClick={handleReset}
                  className="px-3 md:px-4 py-1.5 md:py-2 text-slate-400 hover:text-white text-xs md:text-sm font-medium transition-colors hover:bg-white/5 rounded-lg"
                >
                  Upload New
                </button>

                <div className="w-px h-5 md:h-6 bg-slate-700 mx-1 md:mx-2 hidden sm:block"></div>

                <button
                  onClick={handleDownloadComposite}
                  className="px-4 md:px-5 py-1.5 md:py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg shadow-cyan-900/40 transition-all flex items-center gap-1.5 md:gap-2"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          onPurchase={(amount, cost) => {
            console.log(`Purchasing ${amount} credits for ₹${cost}`);
          }}
        />
      )}
    </div>
  );
};

export default App;