import React, { useState, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageUploader } from './components/ImageUploader';
import { FilterControls } from './components/FilterControls';
import { ComparisonSlider } from './components/ComparisonSlider';
import { ShareModal } from './components/ShareModal';
import { AuthScreen } from './components/AuthScreen';
import { Onboarding } from './components/Onboarding';
import { BottomNavBar } from './components/BottomNavBar';
import { ValidationWarningBanner } from './components/ValidationWarningBanner';
import { FeedbackButtons } from './components/FeedbackButtons';
import { generateIdealImage } from './services/geminiService';
import { createCompositeImage } from './utils/imageUtils';
import { validateRoomStructure } from './services/roomValidationService';
import { AppState, AppMode } from './types';
import { CITY_FILTERS, HOME_FILTERS } from './constants';
import * as analytics from './services/analyticsService';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { ModeSwitcher } from './components/ModeSwitcher';
import { GeneratingModal } from './components/GeneratingModal';

const SESSION_KEY = 'civic_vision_gemini_key';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.CITY);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userApiKey, setUserApiKey] = useState<string>(() => sessionStorage.getItem(SESSION_KEY) || '');
  const [showShare, setShowShare] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    CITY_FILTERS.filter(f => f.isDefault).map(f => f.id)
  );
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [validationWarning, setValidationWarning] = useState<{
    show: boolean;
    issues: string[];
    confidence: number;
    explanation: string;
  } | null>(null);
  const [offerFreeRetry, setOfferFreeRetry] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const { isPulling, pullDistance, progress } = usePullToRefresh();

  React.useEffect(() => {
    if (userApiKey) {
      const completed = localStorage.getItem('civic_vision_onboarding_complete');
      if (!completed) setShowOnboarding(true);
    }
  }, [userApiKey]);

  const handleManualKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById('apiKeyInput') as HTMLInputElement).value.trim();
    if (input.length <= 10) {
      setError('Enter a valid Gemini API key.');
      return;
    }
    setUserApiKey(input);
    sessionStorage.setItem(SESSION_KEY, input);
    setError(null);
    analytics.trackAuthModeSelected('byok');
  };

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

  const currentFilters = appMode === AppMode.CITY ? CITY_FILTERS : HOME_FILTERS;
  const isHomeMode = appMode === AppMode.HOME;
  const accentColor = isHomeMode ? '#ec4899' : '#4f7eff';

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setAppState(AppState.READY);
    setError(null);
    analytics.trackImageUploaded();
  };

  const handleToggleFilter = (id: string) => {
    const filter = currentFilters.find(f => f.id === id);
    const isRoomType = filter?.category === 'roomType';

    setSelectedFilters(prev => {
      const isCurrentlySelected = prev.includes(id);
      if (isRoomType) {
        if (isCurrentlySelected) return prev.filter(f => f !== id);
        const allRoomTypeIds = currentFilters.filter(f => f.category === 'roomType').map(f => f.id);
        return [...prev.filter(fId => !allRoomTypeIds.includes(fId)), id];
      }
      return prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
    });
  };

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === appMode) return;
    setAppMode(newMode);
    const newFilters = newMode === AppMode.CITY ? CITY_FILTERS : HOME_FILTERS;
    setSelectedFilters(newFilters.filter(f => f.isDefault).map(f => f.id));
    setOriginalImage(null);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setError(null);
    setValidationWarning(null);
    setOfferFreeRetry(false);
    setFeedbackGiven(false);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = event => handleImageSelected(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!originalImage || selectedFilters.length === 0) return;
    if (!userApiKey) {
      setError('Add your Gemini API key first.');
      return;
    }

    setAppState(AppState.GENERATING);
    setError(null);
    setFeedbackGiven(false);
    setValidationWarning(null);

    analytics.trackGenerateStarted(selectedFilters.length, 'byok');
    analytics.trackFiltersSelected(selectedFilters, selectedFilters.length);

    try {
      const base64Data = originalImage.split(',')[1] || originalImage;
      const activeFilters = currentFilters.filter(f => selectedFilters.includes(f.id));
      const resultBase64 = await generateIdealImage(base64Data, activeFilters, userApiKey, appMode);

      setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);

      if (appMode === AppMode.HOME) {
        try {
          analytics.trackValidationStarted('HOME');
          const validation = await validateRoomStructure(
            originalImage,
            `data:image/jpeg;base64,${resultBase64}`,
            userApiKey
          );
          analytics.trackValidationResult(validation.isValid, validation.confidence, validation.issues);
          if (!validation.isValid || validation.confidence < 70) {
            setValidationWarning({
              show: true,
              issues: validation.issues,
              confidence: validation.confidence,
              explanation: validation.explanation,
            });
            setOfferFreeRetry(true);
          }
        } catch (err) {
          console.error('Validation error:', err);
        }
      }

      setAppState(AppState.COMPARING);
      analytics.trackGenerateSuccess(selectedFilters.length, 'byok');
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || JSON.stringify(err);
      let errorType = 'unknown';
      if (errorMessage.includes('INVALID_API_KEY')) errorType = 'invalid_key';
      else if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('MODEL_NOT_AVAILABLE')) errorType = 'permission_denied';
      else if (errorMessage.includes('QUOTA_EXCEEDED') || errorMessage.includes('resource-exhausted')) errorType = 'quota_exceeded';
      else if (errorMessage.includes('CONTENT_BLOCKED')) errorType = 'content_blocked';
      analytics.trackGenerateError(errorType, 'byok');

      if (errorMessage.includes('INVALID_API_KEY')) setError('API key issue. Verify the key is valid.');
      else if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('MODEL_NOT_AVAILABLE')) setError('Model access denied. Enable billing/model access in Google AI Studio.');
      else if (errorMessage.includes('QUOTA_EXCEEDED') || errorMessage.includes('resource-exhausted')) setError('Quota exceeded. Try again later or use another key.');
      else if (errorMessage.includes('CONTENT_BLOCKED')) setError('Image blocked by safety filters. Try a different image.');
      else setError('Something went wrong. Please try again or use a different image.');
      setAppState(AppState.READY);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setValidationWarning(null);
    setOfferFreeRetry(false);
    setFeedbackGiven(false);
  };

  const handleBack = () => {
    if (appState === AppState.COMPARING) setAppState(AppState.READY);
    else handleReset();
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
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'civic-vision-transformation.jpg';
    a.click();
    URL.revokeObjectURL(url);
    analytics.trackImageDownloaded();
  };

  const handleValidationRetry = () => {
    if (validationWarning) analytics.trackValidationRetry(validationWarning.issues);
    setValidationWarning(null);
    setOfferFreeRetry(false);
    handleGenerate();
  };

  const handleValidationDismiss = () => {
    if (validationWarning) analytics.trackValidationDismissed(validationWarning.confidence);
    setValidationWarning(null);
    setOfferFreeRetry(false);
  };

  const handleFeedback = (rating: 'good' | 'bad') => {
    setFeedbackGiven(true);
    analytics.trackUserFeedback({
      rating,
      mode: appMode === AppMode.CITY ? 'CITY' : 'HOME',
      filterCount: selectedFilters.length,
      timestamp: new Date().toISOString(),
    });
    if (rating === 'bad') analytics.trackFeedbackRetryOffered();
  };

  if (!userApiKey) {
    return <AuthScreen onManualKeySubmit={handleManualKeySubmit} />;
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col md:flex-row bg-[#FFF9F5] text-[#2D2A32] overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

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

      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />}
      </AnimatePresence>

      {showShare && originalImage && generatedImage && (
        <ShareModal originalImage={originalImage} generatedImage={generatedImage} onClose={() => setShowShare(false)} mode={appMode} />
      )}

      <GeneratingModal isOpen={appState === AppState.GENERATING} mode={appMode} />

      {isPulling && (
        <div className="fixed left-0 right-0 flex justify-center items-center z-50 pointer-events-none md:hidden" style={{ top: `env(safe-area-inset-top, 0px)`, height: `${pullDistance}px`, maxHeight: '100px' }}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white shadow-lg transition-transform ${progress >= 1 ? 'border-green-400 bg-green-500' : ''}`} style={{ borderColor: progress >= 1 ? '#4ade80' : accentColor, transform: `rotate(${progress * 360}deg)` }}>
            {progress >= 1 ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            )}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {(appState === AppState.READY || appState === AppState.GENERATING || appState === AppState.COMPARING) && (
          <motion.div
            key="filter-controls"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`flex flex-col flex-shrink-0 z-20 relative h-full overflow-hidden ${appState === AppState.COMPARING ? 'hidden md:flex' : 'fixed inset-0 md:relative md:inset-auto'}`}
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

      <main className="flex-1 relative flex flex-col h-full overflow-hidden z-10">
        <div className="absolute right-3 md:right-4 z-40 flex items-center gap-2 flex-wrap justify-end" style={{ top: `max(env(safe-area-inset-top, 0px), 0.75rem)` }}>
          <button
            onClick={() => {
              setUserApiKey('');
              sessionStorage.removeItem(SESSION_KEY);
              handleReset();
            }}
            className="text-[11px] text-[#6B6574] hover:text-[#2D2A32] transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black/10 shadow-sm"
          >
            Remove Key
          </button>
          <button onClick={() => setShowOnboarding(true)} className="p-1.5 text-[#6B6574] hover:text-[#2D2A32] transition-colors bg-white/80 backdrop-blur-sm rounded-full border border-black/10 shadow-sm" title="Replay tour">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute left-1/2 transform -translate-x-1/2 z-50 bg-red-50 backdrop-blur-md border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-[90vw] md:max-w-lg" style={{ top: `max(calc(env(safe-area-inset-top, 0px) + 3.5rem), 3.5rem)` }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="text-xs md:text-sm font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 w-full h-full p-4 md:p-8 pb-24 md:pb-8 flex flex-col items-center justify-start md:justify-center relative min-h-0 overflow-y-auto" style={{ paddingTop: `max(calc(env(safe-area-inset-top, 0px) + 3.5rem), 3.5rem)` }}>
          {appState === AppState.IDLE && (
            <motion.div className="w-full max-w-5xl mx-auto flex flex-col items-center px-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6 md:mb-10"><ModeSwitcher currentMode={appMode} onModeChange={handleModeChange} /></div>
              <div className="text-center mb-6 md:mb-10 space-y-2 md:space-y-3">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#2D2A32] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                  {isHomeMode ? 'Redo Your Space' : 'Redo Your Neighborhood'}
                </h1>
                <p className="text-sm md:text-lg text-[#6B6574] font-light max-w-lg mx-auto">
                  {isHomeMode ? 'Upload a room photo to see design possibilities.' : 'Upload a photo to see a cleaner, greener future.'}
                </p>
              </div>
              <ImageUploader onImageSelected={handleImageSelected} mode={appMode} />
            </motion.div>
          )}

          {appState === AppState.COMPARING && originalImage && generatedImage && (
            <motion.div className="w-full max-w-6xl flex flex-col h-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              {validationWarning?.show && (
                <ValidationWarningBanner issues={validationWarning.issues} confidence={validationWarning.confidence} explanation={validationWarning.explanation} onRetry={handleValidationRetry} onDismiss={handleValidationDismiss} />
              )}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-[#f5f5f5] flex-1 min-h-0">
                <ComparisonSlider originalImage={originalImage} generatedImage={generatedImage} mode={appMode} />
              </div>
              <div className="mt-4 flex flex-wrap justify-center items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-black/10 shadow-lg flex-shrink-0">
                <button onClick={() => setAppState(AppState.READY)} className="md:hidden px-3 py-2 bg-[#2D2A32] text-white hover:bg-[#3D3A42] rounded-full text-xs md:text-sm font-medium transition-all shadow-sm flex items-center gap-1.5">Filters</button>
                <button onClick={handleReset} className="px-3 md:px-4 py-2 text-[#6B6574] hover:text-[#2D2A32] text-xs md:text-sm font-medium transition-colors">Upload New</button>
                {!feedbackGiven && <><div className="w-px h-6 bg-black/10 mx-1 hidden sm:block" /><FeedbackButtons mode={appMode === AppMode.CITY ? 'CITY' : 'HOME'} filterCount={selectedFilters.length} onFeedback={handleFeedback} /></>}
                <div className="w-px h-6 bg-black/10 mx-1 hidden sm:block" />
                <button onClick={() => { setShowShare(true); analytics.trackShareModalOpened(); }} className="px-4 md:px-5 py-2 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg transition-all flex items-center gap-1.5 md:gap-2 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${accentColor}, ${isHomeMode ? '#f472b6' : '#6366f1'})`, boxShadow: `0 4px 15px ${accentColor}40` }}>Share</button>
                <button onClick={handleDownloadComposite} className="px-4 md:px-5 py-2 bg-[#2D2A32] text-white hover:bg-[#3D3A42] text-xs md:text-sm font-medium rounded-full transition-all shadow-sm flex items-center gap-1.5 md:gap-2 flex-shrink-0">Download</button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {appState === AppState.IDLE && <BottomNavBar currentMode={appMode} onModeChange={handleModeChange} onUploadClick={handleUploadClick} />}
      <Analytics />
    </div>
  );
};

export default App;
