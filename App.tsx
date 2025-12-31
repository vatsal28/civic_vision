import React, { useState, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageUploader } from './components/ImageUploader';
import { FilterControls } from './components/FilterControls';
import { ComparisonSlider } from './components/ComparisonSlider';
import { PricingModal } from './components/PricingModal';
import { ShareModal } from './components/ShareModal';
import { AuthScreen } from './components/AuthScreen';
import { Onboarding } from './components/Onboarding';
import { BottomNavBar } from './components/BottomNavBar';
import { generateIdealImage } from './services/geminiService';
import { createCompositeImage } from './utils/imageUtils';
import { AppState, AuthMode, AppMode } from './types';
import { CITY_FILTERS, HOME_FILTERS } from './constants';
import { useAuth } from './contexts/AuthContext';
import * as analytics from './services/analyticsService';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { ModeSwitcher } from './components/ModeSwitcher';

const App: React.FC = () => {
  const { user, credits, loading, signInWithGoogle, signOut } = useAuth();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.CITY);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // BYOK State
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [showPricing, setShowPricing] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  // Get default filters based on current mode
  const currentFilters = appMode === AppMode.CITY ? CITY_FILTERS : HOME_FILTERS;
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    CITY_FILTERS.filter(f => f.isDefault).map(f => f.id)
  );
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Demo mode for Razorpay KYC review
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoCredits, setDemoCredits] = useState(3);

  // Pull to refresh for mobile
  const { isPulling, pullDistance, progress } = usePullToRefresh();

  // Check for demo mode URL parameter (?demo=razorpay)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get('demo');
    if (demoParam === 'razorpay') {
      setIsDemoMode(true);
      setAuthMode(AuthMode.GUEST);
      // Show onboarding for demo users too
      const completed = localStorage.getItem('civic_vision_demo_onboarding');
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, []);

  // Auto-set authMode to GUEST when user signs in
  React.useEffect(() => {
    if (user && !authMode && !isDemoMode) {
      setAuthMode(AuthMode.GUEST);
    }
  }, [user, authMode, isDemoMode]);

  // Check if user needs onboarding (first time)
  React.useEffect(() => {
    if ((user || isDemoMode) && authMode && !loading) {
      const storageKey = isDemoMode ? 'civic_vision_demo_onboarding' : 'civic_vision_onboarding_complete';
      const completed = localStorage.getItem(storageKey);
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, [user, authMode, loading, isDemoMode]);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem('civic_vision_onboarding_complete', 'true');
    setShowOnboarding(false);
    analytics.trackOnboardingCompleted();
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('civic_vision_onboarding_complete', 'true');
    setShowOnboarding(false);
    analytics.trackOnboardingSkipped();
  };

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

  const handleModeChange = (newMode: AppMode) => {
    if (newMode !== appMode) {
      setAppMode(newMode);
      // Reset filters to new mode's defaults
      const newFilters = newMode === AppMode.CITY ? CITY_FILTERS : HOME_FILTERS;
      setSelectedFilters(newFilters.filter(f => f.isDefault).map(f => f.id));
      // Reset image state when switching modes
      setOriginalImage(null);
      setGeneratedImage(null);
      setAppState(AppState.IDLE);
      setError(null);
    }
  };

  const handleUploadClick = () => {
    // Trigger file input click for mobile FAB
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePurchase = (amount: number, cost: number) => {
    const btn = document.activeElement as HTMLButtonElement;
    if (btn) btn.disabled = true;

    setTimeout(() => {
      setShowPricing(false);
      alert(`Payment Successful! Added ${amount} credits.`);
      if (btn) btn.disabled = false;
    }, 1500);
  };

  const handleGenerate = async () => {
    if (!originalImage || selectedFilters.length === 0) return;

    // Check Credits if in Guest Mode (or Demo Mode)
    if (authMode === AuthMode.GUEST) {
      const currentCredits = isDemoMode ? demoCredits : credits;
      if (currentCredits <= 0) {
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
      const activeFilters = currentFilters.filter(f => selectedFilters.includes(f.id));

      let resultBase64: string;

      if (isDemoMode) {
        const keyToUse = import.meta.env.VITE_GEMINI_API_KEY;
        if (!keyToUse) {
          throw new Error("Demo mode API Key is not configured.");
        }
        resultBase64 = await generateIdealImage(base64Data, activeFilters, keyToUse, appMode);
        setDemoCredits(prev => Math.max(0, prev - 1));
      } else if (authMode === AuthMode.GUEST && user) {
        const { getFunctions, httpsCallable } = await import('firebase/functions');
        const functions = getFunctions();
        const generateImageFn = httpsCallable(functions, 'generateImage');

        const response = await generateImageFn({
          base64Image: base64Data,
          filters: activeFilters,
          mode: appMode,
        });

        const data = response.data as { success: boolean; generatedImage: string; credits: number };
        if (!data.success) {
          throw new Error('Failed to generate image');
        }

        resultBase64 = data.generatedImage;
      } else {
        const keyToUse = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;
        if (!keyToUse) {
          throw new Error("API Key is missing configuration.");
        }
        resultBase64 = await generateIdealImage(base64Data, activeFilters, keyToUse, appMode);
      }

      setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
      setAppState(AppState.COMPARING);
      analytics.trackGenerateSuccess(selectedFilters.length, authModeStr);
    } catch (err: any) {
      console.error(err);

      const errorMessage = err.message || JSON.stringify(err);

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

      if (errorMessage.includes('INVALID_API_KEY')) {
        setError("API Key issue. Please verify your key is valid and has billing enabled.");
      } else if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('MODEL_NOT_AVAILABLE')) {
        setError("Model access denied. Please enable billing in Google AI Studio.");
      } else if (errorMessage.includes('QUOTA_EXCEEDED') || errorMessage.includes('resource-exhausted')) {
        if (authMode === AuthMode.BYOK) {
          setError("Daily quota exceeded. Try again tomorrow or enable billing.");
        } else {
          setError("Insufficient credits. Please purchase more credits.");
          setShowPricing(true);
        }
      } else if (errorMessage.includes('CONTENT_BLOCKED')) {
        setError("Image blocked by safety filters. Please try a different image.");
      } else if (errorMessage.includes('403') || errorMessage.includes('unauthenticated')) {
        setError("API Key authentication failed. Please verify your key.");
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

  const handleBack = () => {
    if (appState === AppState.COMPARING) {
      setAppState(AppState.READY);
    } else {
      handleReset();
    }
  };

  const handleReupload = (base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null);
    setAppState(AppState.READY);
    setError(null);
    analytics.trackImageUploaded();
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

  // --- RENDER: LOADING ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f1a]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // --- RENDER: AUTHENTICATION SCREEN ---
  if (!authMode && !isDemoMode) {
    return <AuthScreen onSelectAuthMode={handleSelectAuthMode} onManualKeySubmit={handleManualKeySubmit} />;
  }

  const isHomeMode = appMode === AppMode.HOME;
  const accentColor = isHomeMode ? '#ec4899' : '#4f7eff';

  // --- RENDER: MAIN APP ---
  return (
    <div className="flex h-[100dvh] w-full flex-col md:flex-row bg-[#0a0f1a] text-white overflow-hidden font-sans">
      {/* Hidden file input for mobile FAB */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#111827] to-[#0f172a] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0 pointer-events-none mix-blend-overlay" />

      {/* Onboarding Tour */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          onPurchase={handlePurchase}
        />
      )}

      {/* Share Modal */}
      {showShare && originalImage && generatedImage && (
        <ShareModal
          originalImage={originalImage}
          generatedImage={generatedImage}
          onClose={() => setShowShare(false)}
          mode={appMode}
        />
      )}

      {/* Pull to Refresh Indicator */}
      {isPulling && (
        <div
          className="fixed left-0 right-0 flex justify-center items-center z-50 pointer-events-none md:hidden"
          style={{ 
            top: `env(safe-area-inset-top, 0px)`,
            height: `${pullDistance}px`, 
            maxHeight: '100px' 
          }}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[#151c2c] shadow-lg transition-transform ${progress >= 1 ? 'border-green-400 bg-green-500' : ''}`}
            style={{ 
              borderColor: progress >= 1 ? '#4ade80' : accentColor,
              transform: `rotate(${progress * 360}deg)` 
            }}
          >
            {progress >= 1 ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Controls - Desktop: visible when image uploaded, Mobile: full screen overlay */}
      <AnimatePresence mode="wait">
        {(appState === AppState.READY || appState === AppState.GENERATING || appState === AppState.COMPARING) && (
          <motion.div
            key="filter-controls"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`flex flex-col flex-shrink-0 z-20 relative h-full overflow-hidden
              ${appState === AppState.COMPARING 
                ? 'hidden md:flex' 
                : 'fixed inset-0 md:relative md:inset-auto'
              }`}
          >
            <FilterControls
              selectedFilters={selectedFilters}
              onToggleFilter={handleToggleFilter}
              onGenerate={handleGenerate}
              isGenerating={appState === AppState.GENERATING}
              onReset={handleReset}
              onBack={handleBack}
              onReupload={handleReupload}
              originalImage={originalImage}
              generatedImage={generatedImage}
              mode={appMode}
              showResult={appState === AppState.COMPARING}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden z-10">
        {/* Top Bar: Credits, Settings */}
        <div className="absolute right-3 md:right-4 z-40 flex items-center gap-2 flex-wrap justify-end" style={{ top: `max(env(safe-area-inset-top, 0px), 0.75rem)` }}>
          {(authMode === AuthMode.GUEST || isDemoMode) && (
            <>
              {isDemoMode && (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full border border-amber-500/30">
                  DEMO
                </span>
              )}
              <button
                onClick={() => {
                  setShowPricing(true);
                  analytics.trackPricingModalOpened(isDemoMode ? demoCredits : credits);
                }}
                className="flex items-center gap-1.5 text-white text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transition-all transform hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${accentColor}, ${isHomeMode ? '#f472b6' : '#6366f1'})`,
                  boxShadow: `0 4px 15px ${accentColor}40`
                }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{isDemoMode ? demoCredits : credits}</span>
                <span className="bg-white/20 px-1.5 rounded text-[9px]">TOP UP</span>
              </button>
            </>
          )}

          <button
            onClick={async () => {
              await signOut();
              setAuthMode(null);
              setUserApiKey('');
              setOriginalImage(null);
              setGeneratedImage(null);
              setAppState(AppState.IDLE);
              sessionStorage.removeItem('civic_vision_key');
            }}
            className="text-[11px] text-gray-500 hover:text-white transition-colors bg-[#151c2c] px-3 py-1.5 rounded-full border border-[#252f3f]"
          >
            {authMode === AuthMode.BYOK ? 'Remove Key' : 'Sign Out'}
          </button>

          <button
            onClick={() => setShowOnboarding(true)}
            className="p-1.5 text-gray-500 hover:text-white transition-colors bg-[#151c2c] rounded-full border border-[#252f3f]"
            title="Replay tour"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-1/2 transform -translate-x-1/2 z-50 bg-red-900/90 backdrop-blur-md border border-red-500/50 text-red-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-[90vw] md:max-w-lg"
              style={{ top: `max(calc(env(safe-area-inset-top, 0px) + 3.5rem), 3.5rem)` }}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs md:text-sm font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Container */}
        <div className="flex-1 w-full h-full p-4 md:p-8 pb-24 md:pb-8 flex flex-col items-center justify-start md:justify-center relative min-h-0 overflow-y-auto" style={{ paddingTop: `max(calc(env(safe-area-inset-top, 0px) + 3.5rem), 3.5rem)` }}>
          
          {/* IDLE STATE: Upload Screen */}
          {appState === AppState.IDLE && (
            <motion.div 
              className="w-full max-w-5xl mx-auto flex flex-col items-center px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Mode Switcher - Desktop only */}
              <div className="mb-6 md:mb-10">
                <ModeSwitcher currentMode={appMode} onModeChange={handleModeChange} />
              </div>

              <div className="text-center mb-6 md:mb-10 space-y-2 md:space-y-3">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  {isHomeMode ? 'Reimagine Your Space' : 'Transform Cityscapes'}
                </h1>
                <p className="text-sm md:text-lg text-gray-400 font-light max-w-lg mx-auto">
                  {isHomeMode
                    ? 'Upload a room photo to see stunning design possibilities.'
                    : 'Upload a photo to see a cleaner, greener future.'}
                </p>
              </div>
              
              <ImageUploader onImageSelected={handleImageSelected} mode={appMode} />
            </motion.div>
          )}

          {/* COMPARING STATE: Results */}
          {appState === AppState.COMPARING && originalImage && generatedImage && (
            <motion.div 
              className="w-full max-w-6xl flex flex-col h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#252f3f] bg-[#151c2c] flex-1 min-h-0">
                <ComparisonSlider
                  originalImage={originalImage}
                  generatedImage={generatedImage}
                  mode={appMode}
                />
              </div>

              {/* Action Bar */}
              <div className="mt-4 flex flex-wrap justify-center items-center gap-3 bg-[#151c2c] p-4 rounded-xl border border-[#252f3f] flex-shrink-0">
                {/* Mobile only: Adjust Filters button */}
                <button
                  onClick={() => setAppState(AppState.READY)}
                  className="md:hidden px-4 py-2 bg-[#1e2638] text-gray-300 hover:text-white rounded-lg text-sm font-medium border border-[#252f3f] hover:border-gray-500 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Adjust Filters
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Upload New
                </button>

                <div className="w-px h-6 bg-[#252f3f] mx-1 hidden sm:block" />

                <button
                  onClick={() => {
                    setShowShare(true);
                    analytics.trackShareModalOpened();
                  }}
                  className="px-5 py-2 text-white text-sm font-bold rounded-lg shadow-lg transition-all flex items-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, ${isHomeMode ? '#f472b6' : '#6366f1'})`,
                    boxShadow: `0 4px 15px ${accentColor}40`
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>

                <button
                  onClick={handleDownloadComposite}
                  className="px-5 py-2 bg-[#1e2638] text-gray-300 hover:text-white text-sm font-medium rounded-lg border border-[#252f3f] hover:border-gray-500 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {appState === AppState.IDLE && (
        <BottomNavBar
          currentMode={appMode}
          onModeChange={handleModeChange}
          onUploadClick={handleUploadClick}
        />
      )}

      <Analytics />
    </div>
  );
};

export default App;
