import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="relative bg-[#FFF9F5] text-[#2D2A32] overflow-x-hidden min-h-screen" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Floating blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex justify-between items-center bg-[rgba(255,249,245,0.8)] backdrop-blur-[20px] border-b border-black/5">
        <Link to="/" className="flex items-center gap-2 no-underline text-[#2D2A32]">
          <div className="w-10 h-10 bg-gradient-to-br from-[#89D4BB] to-[#C9B8DB] rounded-xl flex items-center justify-center text-xl">
            🏠
          </div>
          <span className="text-xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
            Re-do.ai
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <a href="#features" className="text-[#6B6574] no-underline font-medium text-[15px] transition-colors hover:text-[#2D2A32] hidden md:block">
            Features
          </a>
          <a href="#how" className="text-[#6B6574] no-underline font-medium text-[15px] transition-colors hover:text-[#2D2A32] hidden md:block">
            How it works
          </a>
          <Link
            to="/app"
            className="bg-[#2D2A32] text-white px-6 py-3 rounded-full font-medium text-[15px] no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 pt-32 pb-16 relative text-center">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-tight mb-6 max-w-[700px] animate-slideUp" style={{ fontFamily: "'Fraunces', serif" }}>
          Transform any space<br />into{' '}
          <span className="bg-gradient-to-r from-[#FF8A80] to-[#FCB69F] bg-clip-text text-transparent">
            something beautiful
          </span>
        </h1>

        <p className="text-xl text-[#6B6574] max-w-[500px] mb-10 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          Upload a photo of any city street or room. Watch AI reimagine it with greenery, better design, and endless possibilities.
        </p>

        <div className="flex gap-4 flex-wrap justify-center animate-slideUp mb-6" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-[#2D2A32] text-white px-8 py-4 rounded-full font-semibold text-base no-underline transition-all hover:-translate-y-1 hover:shadow-xl shadow-[0_4px_16px_rgba(45,42,50,0.2)]"
          >
            Try it free
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 bg-white text-[#2D2A32] px-8 py-4 rounded-full font-semibold text-base no-underline transition-all border-2 border-black/8 hover:border-[#2D2A32]"
          >
            See examples
          </a>
        </div>

        <p className="text-sm text-[#6B6574] animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <span className="text-[#89D4BB] font-semibold">2 free generations</span> · No credit card needed
        </p>
      </section>

      {/* Demo Card - Interactive Slider with Tabs */}
      <section id="demo" className="px-8 pb-24 relative">
        <div className="max-w-[900px] mx-auto bg-white rounded-[32px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.02),0_12px_24px_rgba(0,0,0,0.04),0_24px_48px_rgba(0,0,0,0.06)] animate-slideUp" style={{ animationDelay: '0.4s' }}>
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-4 p-1.5 bg-[#FFF9F5] rounded-2xl">
            <button
              onClick={() => {
                setActiveMode('city');
                setSliderPosition(50);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeMode === 'city'
                  ? 'bg-gradient-to-r from-[#89D4BB] to-[#C9B8DB] text-white shadow-sm'
                  : 'text-[#6B6574] hover:text-[#2D2A32]'
              }`}
            >
              <span className="text-lg">🏙️</span>
              City Mode
            </button>
            <button
              onClick={() => {
                setActiveMode('home');
                setSliderPosition(50);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeMode === 'home'
                  ? 'bg-gradient-to-r from-[#FCB69F] to-[#FF8A80] text-white shadow-sm'
                  : 'text-[#6B6574] hover:text-[#2D2A32]'
              }`}
            >
              <span className="text-lg">🛋️</span>
              Home Mode
            </button>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="rounded-3xl overflow-hidden relative aspect-video bg-gradient-to-r from-[#FFECD2] via-[#D4F1E8] to-[#E8E0F0] select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {activeMode === 'city' ? (
              <>
                {/* City Mode - After Image (Full Width) */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/images/demos/city-after.png)' }}
                >
                  <span className="absolute top-4 right-4 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white">
                    After
                  </span>
                </div>

                {/* City Mode - Before Image (Clipped by slider position) */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(/images/demos/city-before.jpg)',
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                  }}
                >
                  <span className="absolute top-4 left-4 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white">
                    Before
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Home Mode - After Image (Full Width) */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/images/demos/home-after.png)' }}
                >
                  <span className="absolute top-4 right-4 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white">
                    After
                  </span>
                </div>

                {/* Home Mode - Before Image (Clipped by slider position) */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(/images/demos/home-before.png)',
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                  }}
                >
                  <span className="absolute top-4 left-4 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white">
                    Before
                  </span>
                </div>
              </>
            )}

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white z-10 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            />

            {/* Slider Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg z-20 cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
              style={{ left: `${sliderPosition}%`, transform: `translate(-50%, -50%)` }}
            >
              <svg className="w-6 h-6 text-[#2D2A32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>

            {/* Drag instruction hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#6B6574] bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none">
              ← Drag to compare →
            </div>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section id="features" className="py-24 px-8 relative">
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF8A80] mb-4 uppercase tracking-wide">
            ✨ Two powerful modes
          </p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-semibold mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
            Outdoors or indoors. You choose.
          </h2>
          <p className="text-lg text-[#6B6574] max-w-[500px] mx-auto">
            Whether it's a city block or your living room, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
          {/* City Mode */}
          <article className="bg-white rounded-[28px] p-10 relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#89D4BB] to-[#C9B8DB]" />
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#D4F1E8] to-[#89D4BB] flex items-center justify-center text-3xl mb-6">
              🏙️
            </div>
            <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
              City Mode
            </h3>
            <p className="text-[#6B6574] mb-6 leading-relaxed">
              Reimagine urban spaces. Clean up streets, add bike lanes, plant trees, and see what your neighborhood could become.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[13px] font-medium px-4 py-2 rounded-full bg-[#FFF9F5] text-[#6B6574]">Remove trash</span>
              <span className="text-[13px] font-medium px-4 py-2 rounded-full bg-[#FFF9F5] text-[#6B6574]">Add greenery</span>
              <span className="text-[13px] font-medium px-4 py-2 rounded-full bg-[#FFF9F5] text-[#6B6574]">Bike lanes</span>
              <span className="text-[13px] font-medium px-4 py-2 rounded-full bg-[#FFF9F5] text-[#6B6574]">Fresh paint</span>
            </div>
          </article>

          {/* Home Mode */}
          <article className="bg-white rounded-[28px] p-10 relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FCB69F] to-[#FF8A80]" />
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#FFECD2] to-[#FCB69F] flex items-center justify-center text-3xl mb-6">
              🛋️
            </div>
            <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
              Home Mode
            </h3>
            <p className="text-[#6B6574] mb-6 leading-relaxed">
              Transform any room. Try new furniture styles, change wall colors, add plants — all before buying anything.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[13px] font-medium px-4 py-2 rounded-full bg-[#FFF9F5] text-[#6B6574]">Modern furniture</span>
              <span className="text-[13px] font-medium px-4 py-2 rounded-full bg-[#FFF9F5] text-[#6B6574]">Indoor plants</span>
              <span className="text-[13px] font-medium px-4 py-2 rounded-full bg-[#FFF9F5] text-[#6B6574]">Warm lighting</span>
              <span className="text-[13px] font-medium px-4 py-2 rounded-full bg-[#FFF9F5] text-[#6B6574]">New colors</span>
            </div>
          </article>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-8 bg-white relative">
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF8A80] mb-4 uppercase tracking-wide">
            🎯 Super simple
          </p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
            Three steps. That's it.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-[1000px] mx-auto">
          <div className="text-center relative">
            <div className="w-[100px] h-[100px] mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FFECD2] to-[#FCB69F] flex items-center justify-center text-[2.5rem] relative">
              📸
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#2D2A32] text-white rounded-full text-sm font-bold flex items-center justify-center">
                1
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Upload a photo
            </h3>
            <p className="text-[#6B6574] text-[15px]">
              Snap a pic of any street, building, or room you want to transform.
            </p>
          </div>

          <div className="text-center relative">
            <div className="w-[100px] h-[100px] mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4F1E8] to-[#89D4BB] flex items-center justify-center text-[2.5rem] relative">
              🎨
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#2D2A32] text-white rounded-full text-sm font-bold flex items-center justify-center">
                2
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Pick your filters
            </h3>
            <p className="text-[#6B6574] text-[15px]">
              Choose what to change — add greenery, remove clutter, new style.
            </p>
          </div>

          <div className="text-center relative">
            <div className="w-[100px] h-[100px] mx-auto mb-6 rounded-full bg-gradient-to-br from-[#E8E0F0] to-[#C9B8DB] flex items-center justify-center text-[2.5rem] relative">
              ✨
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#2D2A32] text-white rounded-full text-sm font-bold flex items-center justify-center">
                3
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              See the magic
            </h3>
            <p className="text-[#6B6574] text-[15px]">
              AI transforms your space in seconds. Compare, download, share!
            </p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-8 relative">
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF8A80] mb-4 uppercase tracking-wide">
            💡 Perfect for
          </p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
            Dreamers, planners, and doers
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-[800px] mx-auto">
          {[
            { icon: '🏛️', label: 'Urban planners' },
            { icon: '🎨', label: 'Interior designers' },
            { icon: '🏘️', label: 'Real estate agents' },
            { icon: '🏠', label: 'Homeowners' },
            { icon: '🌱', label: 'Sustainability advocates' },
            { icon: '💭', label: 'Curious minds' }
          ].map((useCase, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white px-6 py-4 rounded-full font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-2xl">{useCase.icon}</span>
              {useCase.label}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 text-center relative">
        <div className="max-w-[700px] mx-auto bg-gradient-to-r from-[#D4F1E8] via-[#E8E0F0] to-[#FFECD2] rounded-[40px] px-12 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

          <div className="text-[3.5rem] mb-6 relative">🌈</div>
          <h2 className="text-[clamp(2rem,5vw,2.75rem)] font-semibold mb-4 relative" style={{ fontFamily: "'Fraunces', serif" }}>
            Ready to see what's possible?
          </h2>
          <p className="text-lg text-[#2D2A32] opacity-80 mb-8 relative">
            Start with 2 free transformations. No strings attached.
          </p>

          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-[#2D2A32] text-white px-10 py-[1.125rem] rounded-full font-semibold text-lg no-underline transition-all hover:-translate-y-1 hover:shadow-xl shadow-[0_4px_16px_rgba(45,42,50,0.2)] relative"
          >
            Start transforming
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <div className="flex justify-center gap-8 mt-8 relative flex-wrap">
            {['No signup required', 'Works on mobile', 'BYOK supported'].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-[15px] font-medium">
                <svg className="w-5 h-5 text-[#2D2A32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-black/6">
        <div className="max-w-[1000px] mx-auto flex justify-between items-center flex-wrap gap-6">
          <Link to="/" className="flex items-center gap-2 no-underline text-[#2D2A32]">
            <div className="w-10 h-10 bg-gradient-to-br from-[#89D4BB] to-[#C9B8DB] rounded-xl flex items-center justify-center text-xl">
              🏠
            </div>
            <span className="text-xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
              Re-do.ai
            </span>
          </Link>

          <div className="flex gap-8">
            <Link to="/privacy" className="text-[#6B6574] no-underline text-[15px] transition-colors hover:text-[#2D2A32]">
              Privacy
            </Link>
            <Link to="/terms" className="text-[#6B6574] no-underline text-[15px] transition-colors hover:text-[#2D2A32]">
              Terms
            </Link>
            <a href="mailto:contact@re-do.ai" className="text-[#6B6574] no-underline text-[15px] transition-colors hover:text-[#2D2A32]">
              Contact
            </a>
          </div>

          <p className="text-sm text-[#6B6574]">© 2026 Re-do.ai</p>
        </div>
      </footer>

      <style>{`
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.6;
          pointer-events: none;
          animation: float 20s ease-in-out infinite;
        }

        .blob-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .blob-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #D4F1E8 0%, #89D4BB 100%);
          top: 40%;
          left: -150px;
          animation-delay: -5s;
        }

        .blob-3 {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #E8E0F0 0%, #C9B8DB 100%);
          bottom: 10%;
          right: -100px;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 30px) scale(1.02); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out both;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
};
