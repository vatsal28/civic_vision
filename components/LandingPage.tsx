import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// SVG Icon Components
const Icons = {
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Camera: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Sliders: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronLeftRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7l-5 5 5 5" />
      <path d="M15 7l5 5-5 5" />
    </svg>
  ),
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Brush: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </svg>
  ),
  Building2: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    </svg>
  ),
  HomeIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Leaf: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  Brain: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  Wand: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9h2" />
      <path d="M20 9h2" />
      <path d="M17.8 11.8L19 13" />
      <path d="M15 9h0" />
      <path d="M17.8 6.2L19 5" />
      <path d="m3 21 9-9" />
      <path d="M12.2 6.2L11 5" />
    </svg>
  ),
  Rainbow: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 17a10 10 0 0 0-20 0" />
      <path d="M6 17a6 6 0 0 1 12 0" />
      <path d="M10 17a2 2 0 0 1 4 0" />
    </svg>
  ),
};

export const LandingPage: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeMode, setActiveMode] = useState<'city' | 'home'>('city');
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const useCases = [
    { icon: <Icons.MapPin />, label: 'Urban planners' },
    { icon: <Icons.Brush />, label: 'Interior designers' },
    { icon: <Icons.Building2 />, label: 'Real estate agents' },
    { icon: <Icons.HomeIcon />, label: 'Homeowners' },
    { icon: <Icons.Leaf />, label: 'Sustainability advocates' },
    { icon: <Icons.Brain />, label: 'Curious minds' },
  ];

  return (
    <div
      className="relative min-h-screen"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: 'linear-gradient(180deg, #FFF5F0 0%, #FFF0F5 50%, #F0F5FF 100%)',
      }}
    >
      {/* Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top right pink/purple blob */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-70"
          style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #C44FFF 50%, #7B61FF 100%)', filter: 'blur(80px)' }}
        />
        {/* Left green blob */}
        <div
          className="absolute top-[30%] -left-32 w-[400px] h-[600px] rounded-full opacity-60"
          style={{ background: 'linear-gradient(180deg, #4ADE80 0%, #22D3EE 100%)', filter: 'blur(80px)' }}
        />
        {/* Bottom right orange/pink blob */}
        <div
          className="absolute bottom-[20%] -right-20 w-[350px] h-[350px] rounded-full opacity-70"
          style={{ background: 'linear-gradient(135deg, #FB923C 0%, #F472B6 100%)', filter: 'blur(60px)' }}
        />
        {/* Bottom left yellow/green blob */}
        <div
          className="absolute -bottom-20 left-[20%] w-[400px] h-[300px] rounded-full opacity-60"
          style={{ background: 'linear-gradient(135deg, #FDE047 0%, #4ADE80 100%)', filter: 'blur(70px)' }}
        />
        {/* Center pink accent */}
        <div
          className="absolute top-[60%] left-[40%] w-[200px] h-[200px] rounded-full opacity-50"
          style={{ background: 'linear-gradient(135deg, #F472B6 0%, #A855F7 100%)', filter: 'blur(50px)' }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Icons.Home />
            </div>
            <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Re-do.ai
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <a href="#features" className="hidden sm:block text-gray-600 no-underline text-sm font-medium hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how" className="hidden sm:block text-gray-600 no-underline text-sm font-medium hover:text-gray-900 transition-colors">
              How it works
            </a>
            <Link
              to="/app"
              className="flex items-center gap-1.5 bg-gray-900 text-white pl-4 pr-3 py-2 rounded-full text-sm font-medium no-underline hover:bg-gray-800 transition-colors"
            >
              <Icons.Wand />
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-12 sm:pt-20 pb-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] mb-6 text-gray-900"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Transform any space<br />
            into{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(90deg, #FF6B9D 0%, #C44FFF 50%, #7B61FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              something beautiful
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47 2 153 2 199 5.5" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#FF6B9D"/>
                    <stop offset="0.5" stopColor="#C44FFF"/>
                    <stop offset="1" stopColor="#7B61FF"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Upload a photo of any city street or room. Watch AI reimagine it with greenery, better design, and endless possibilities.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium text-sm no-underline hover:bg-gray-800 transition-all hover:scale-105"
            >
              Try it free
              <Icons.ArrowRight />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full font-medium text-sm no-underline border border-gray-200 hover:bg-white transition-all hover:scale-105"
            >
              See examples
            </a>
          </div>

          <p className="text-sm text-gray-500">
            <span className="text-pink-500 font-medium">2 free generations</span>
            <span className="mx-2">·</span>
            No credit card needed
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative z-10 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-purple-500/5 border border-white/50">
            {/* Mode Tabs */}
            <div className="flex mb-4 border-b border-gray-100">
              <button
                onClick={() => { setActiveMode('city'); setSliderPosition(50); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                  activeMode === 'city'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icons.Building />
                City Mode
              </button>
              <button
                onClick={() => { setActiveMode('home'); setSliderPosition(50); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                  activeMode === 'home'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icons.Home />
                Home Mode
              </button>
            </div>

            {/* Comparison Slider */}
            <div
              ref={sliderRef}
              className="rounded-2xl overflow-hidden relative aspect-[16/10] bg-gray-100 select-none cursor-ew-resize"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              {activeMode === 'city' ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/demos/city-after.png)' }}
                  />
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'url(/images/demos/city-before.jpg)',
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                    }}
                  />
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/demos/home-after.png)' }}
                  />
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'url(/images/demos/home-before.png)',
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                    }}
                  />
                </>
              )}

              {/* Labels */}
              <span className="absolute top-3 left-3 text-xs font-semibold uppercase px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white">
                Before
              </span>
              <span className="absolute top-3 right-3 text-xs font-semibold uppercase px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-gray-900">
                After
              </span>

              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
                style={{ left: `${sliderPosition}%`, boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}
              />

              {/* Slider Handle */}
              <div
                className="absolute top-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-20 cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
                style={{ left: `${sliderPosition}%`, transform: `translate(-50%, -50%)` }}
              >
                <Icons.ChevronLeftRight />
              </div>

              {/* Instruction */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-1">
                <span>←</span> Drag to compare <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 mb-3 uppercase tracking-wide">
              <span className="text-yellow-500">✦</span> Two powerful modes
            </p>
            <h2
              className="text-3xl sm:text-4xl font-semibold mb-4 text-gray-900"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Outdoors or indoors. You choose.
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Whether it's a city block or your living room, we've got you covered with specialized models for every space.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* City Mode */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg overflow-hidden">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)' }}
              >
                <Icons.Building />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                City Mode
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Reimagine urban spaces. Clean up streets, add bike lanes, plant trees, and see what your neighborhood could become.
              </p>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="/images/demos/city-after.png"
                  alt="City transformation example"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Home Mode */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg overflow-hidden">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #F472B6 0%, #A855F7 100%)' }}
              >
                <Icons.Home />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                Home Mode
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Transform any room. Try new furniture styles, change colors, and plants — all before buying anything.
              </p>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="/images/demos/home-after.png"
                  alt="Home transformation example"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative z-10 px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 mb-3 uppercase tracking-wide">
              <span className="text-yellow-500">✦</span> Super simple
            </p>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-gray-900"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Three steps. That's it.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-12 left-[20%] right-[20%] border-t-2 border-dashed border-gray-300" />

            {[
              {
                icon: <Icons.Camera />,
                title: 'Upload a photo',
                description: 'Snap a pic of any street, building, or room you want to transform.',
                gradient: 'linear-gradient(135deg, #FDE047 0%, #FB923C 100%)',
              },
              {
                icon: <Icons.Sliders />,
                title: 'Pick your filters',
                description: 'Choose what to change — add greenery, remove clutter, new style.',
                gradient: 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)',
              },
              {
                icon: <Icons.Sparkles />,
                title: 'See the magic',
                description: 'AI transforms your space in seconds. Compare, download, share!',
                gradient: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)',
              },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="relative inline-block mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                    style={{ background: step.gradient }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #C44FFF 100%)' }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 mb-3 uppercase tracking-wide">
            <span className="text-yellow-500">✦</span> Perfect for
          </p>
          <h2
            className="text-3xl sm:text-4xl font-semibold mb-10 text-gray-900"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Dreamers, planners, and doers
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {useCases.map((useCase, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full text-sm font-medium text-gray-700 border border-gray-200/50 hover:bg-white hover:shadow-md transition-all"
              >
                <span className="text-pink-500">{useCase.icon}</span>
                {useCase.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-[2rem] px-8 py-12 sm:px-12 sm:py-16 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FDE047 0%, #4ADE80 25%, #22D3EE 50%, #A855F7 75%, #F472B6 100%)',
            }}
          >
            {/* Inner white card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-10 sm:px-10">
              <div
                className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FDE047 0%, #4ADE80 50%, #22D3EE 100%)' }}
              >
                <Icons.Rainbow />
              </div>

              <h2
                className="text-2xl sm:text-3xl font-semibold mb-3 text-gray-900"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Ready to see what's possible?
              </h2>
              <p className="text-gray-600 mb-8">
                Start with 2 free transformations. No strings attached.
              </p>

              <Link
                to="/app"
                className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full font-semibold text-base no-underline transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #C44FFF 50%, #7B61FF 100%)' }}
              >
                Start transforming
                <Icons.ArrowRight />
              </Link>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-sm text-gray-500">
                {['No signup required', 'Works on mobile', 'BYOK supported'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-green-500"><Icons.Check /></span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-gray-200/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Icons.Home />
            </div>
            <span className="text-base font-semibold text-gray-900" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Re-do.ai
            </span>
          </Link>

          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-500 no-underline text-sm hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-500 no-underline text-sm hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <a href="mailto:contact@re-do.ai" className="text-gray-500 no-underline text-sm hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>

          <p className="text-sm text-gray-400">© 2026 Re-do.ai</p>
        </div>
      </footer>
    </div>
  );
};
