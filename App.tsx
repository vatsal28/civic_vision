import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { FilterControls } from './components/FilterControls';
import { ComparisonSlider } from './components/ComparisonSlider';
import { PricingModal } from './components/PricingModal';
import { ShareModal } from './components/ShareModal';
import { AuthScreen } from './components/AuthScreen';
import { generateIdealImage } from './services/geminiService';
import { createCompositeImage } from './utils/imageUtils';
import { AppState, AuthMode } from './types';
import { FILTERS } from './constants';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { user, credits, loading, signInWithGoogle, signOut } = useAuth();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  // BYOK State
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [showPricing, setShowPricing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
  };

  const handleManualKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById('apiKeyInput') as HTMLInputElement).value;
    if (input.trim().length > 10) {
      setUserApiKey(input.trim());
      setAuthMode(AuthMode.BYOK);
      sessionStorage.setItem('civic_vision_key', input.trim());
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
        return;
      }
    }

    setAppState(AppState.GENERATING);
    setError(null);

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
    } catch (err: any) {
      console.error(err);

      const errorMessage = err.message || JSON.stringify(err);
      if (
        errorMessage.includes('403') ||
        errorMessage.includes('PERMISSION_DENIED') ||
        errorMessage.includes('API Key is missing') ||
        errorMessage.includes('unauthenticated') ||
        errorMessage.includes('resource-exhausted')
      ) {
        if (authMode === AuthMode.BYOK) {
          setError("Invalid API Key. Please check your key.");
          setAuthMode(null); // Reset to allow re-entry
          sessionStorage.removeItem('civic_vision_key');
        } else if (errorMessage.includes('resource-exhausted')) {
          setError("Insufficient credits. Please purchase more credits.");
          setShowPricing(true);
        } else {
          setError("Service temporarily unavailable. Please try using your own API Key.");
        }
      } else {
        setError("Something went wrong while generating the image. Please try again.");
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

  const handleShareImage = () => {
    if (!originalImage || !generatedImage) return;
    setShowShareModal(true);
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
    <div className="flex h-screen w-full flex-col md:flex-row bg-[#0f172a] text-white overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#172554] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>

      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          onPurchase={handlePurchase}
        />
      )}

      {/* Sidebar Controls */}
      <div className={`
        ${appState === AppState.IDLE ? 'hidden' : ''}
        ${appState === AppState.COMPARING ? 'hidden md:flex' : 'flex'}
        flex-col flex-shrink-0 transition-all duration-300 z-20 relative
        h-[55vh] md:h-full md:max-h-full
      `}>
        <FilterControls
          selectedFilters={selectedFilters}
          onToggleFilter={handleToggleFilter}
          onGenerate={handleGenerate}
          isGenerating={appState === AppState.GENERATING}
          onReset={handleReset}
        />
      </div>

      <main className="flex-1 relative flex flex-col h-full overflow-hidden z-10">

        {/* Top Bar: Credits or Logout */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-3">
          {authMode === AuthMode.GUEST && (
            <>
              <button
                onClick={() => setShowPricing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {credits} Credits
                <span className="bg-white/20 px-1.5 rounded text-[10px] ml-1">TOP UP</span>
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
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg transition-all"
                  title="Sign out"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
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
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/90 backdrop-blur-md border border-red-500/50 text-red-100 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-lg animate-fade-in-down">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 w-full h-full p-4 md:p-12 flex flex-col items-center justify-center relative">

          {appState === AppState.IDLE && (
            <div className="w-full max-w-6xl mx-auto flex flex-col items-center animate-fade-in">
              <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-sm">
                  Transform Cityscapes
                </h1>
                <p className="text-lg text-slate-400 font-light">
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
            <div className="w-full max-w-6xl h-full max-h-[85vh] flex flex-col animate-fade-in">
              <div className="flex-1 relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.1)] border border-slate-700/50 bg-slate-900/50">
                <ComparisonSlider
                  originalImage={originalImage}
                  generatedImage={generatedImage}
                />
              </div>

              <div className="mt-6 flex flex-wrap justify-center items-center gap-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-xl">
                {/* Mobile-only Adjust Filters */}
                <button
                  onClick={() => setAppState(AppState.READY)}
                  className="md:hidden px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm font-medium border border-slate-700 hover:border-slate-500 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Filters
                </button>

                <div className="w-px h-6 bg-slate-700 mx-2 hidden md:block"></div>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors hover:bg-white/5 rounded-lg"
                >
                  Upload New
                </button>

                <div className="w-px h-6 bg-slate-700 mx-2 hidden sm:block"></div>

                <a
                  href={generatedImage}
                  download="civic-vision-result.jpg"
                  className="px-4 py-2 text-white hover:text-cyan-300 text-sm font-medium transition-colors flex items-center gap-2 hover:bg-white/5 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </a>

                <button
                  onClick={handleShareImage}
                  disabled={isSharing}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-cyan-900/40 transition-all flex items-center gap-2"
                >
                  {isSharing ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  )}
                  Share
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

      {showShareModal && originalImage && generatedImage && (
        <ShareModal
          originalImage={originalImage}
          generatedImage={generatedImage}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default App;