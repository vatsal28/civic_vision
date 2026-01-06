import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeMode, setActiveMode] = useState<'city' | 'home'>('city');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchActive, setGlitchActive] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Track mouse position for magnetic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Periodic glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  };

  const handleModeChange = (mode: 'city' | 'home') => {
    setActiveMode(mode);
    setSliderPosition(50);
  };

  return (
    <div className="relative bg-black text-white overflow-x-hidden min-h-screen" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(#00D9FF 1px, transparent 1px),
            linear-gradient(90deg, #00D9FF 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Scanning Line Animation */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent opacity-50 animate-scan pointer-events-none z-50" />

      {/* Custom Cursor */}
      <div
        className="hidden md:block fixed w-8 h-8 border-2 border-[#00D9FF] pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100"
        style={{
          left: `${mousePosition.x - 16}px`,
          top: `${mousePosition.y - 16}px`,
          transform: isDragging ? 'scale(1.5)' : 'scale(1)'
        }}
      />

      <style>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .glitch {
          animation: glitch 0.3s linear;
        }
      `}</style>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-4 border-white bg-black">
          <div className="container mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00D9FF] border-4 border-white flex items-center justify-center font-bold text-black text-xl">
                R
              </div>
              <span className="text-2xl font-bold tracking-tight">RE-DO.AI</span>
            </div>
            <Link
              to="/app"
              className="group relative px-8 py-4 bg-[#00D9FF] text-black font-bold text-lg border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200"
            >
              LAUNCH APP
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Glitch Effect on Headline */}
              <h1 className={`text-6xl md:text-8xl font-bold leading-none ${glitchActive ? 'glitch' : ''}`}>
                <span className="block text-white">TRANSFORM</span>
                <span className="block text-[#00D9FF] mt-2">ANY SPACE</span>
                <span className="block text-white mt-2 text-5xl md:text-6xl">WITH AI</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed border-l-4 border-[#00D9FF] pl-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {'>'} Beautify any urban space - streets, parks, buildings
                <br />
                {'>'} Redecorate any room - empty or furnished
                <br />
                {'>'} Powered by advanced AI vision
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/app"
                  className="group relative px-10 py-5 bg-[#00D9FF] text-black font-bold text-xl border-4 border-white shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200"
                >
                  START TRANSFORMING →
                </Link>
                <a
                  href="#demo"
                  className="px-10 py-5 bg-black text-white font-bold text-xl border-4 border-white shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200"
                >
                  VIEW DEMO ↓
                </a>
              </div>
            </div>

            {/* Hero Features */}
            <div className="space-y-6">
              {[
                { icon: '⚡', label: 'INSTANT', desc: 'Results in 30 seconds' },
                { icon: '🤖', label: 'AI-POWERED', desc: 'Advanced vision models' },
                { icon: '🎯', label: '2K QUALITY', desc: 'High-res outputs' },
                { icon: '🆓', label: 'FREE START', desc: '2 credits included' }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-black border-4 border-white p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,217,255,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200"
                >
                  <div className="w-16 h-16 bg-[#00D9FF] border-4 border-white flex items-center justify-center text-3xl flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-white mb-1">{feature.label}</div>
                    <div className="text-sm text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {feature.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Before/After Section */}
        <section id="demo" className="bg-white text-black py-20 border-y-8 border-black">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-bold mb-4">
                SEE THE <span className="text-[#00D9FF]">MAGIC</span>
              </h2>
              <p className="text-xl" style={{ fontFamily: "'JetBrains Mono', monospace" }}>DRAG THE SLIDER TO COMPARE</p>
            </div>

            {/* Mode Tabs */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => handleModeChange('city')}
                className={`px-8 py-4 font-bold text-lg border-4 border-black transition-all duration-200 ${
                  activeMode === 'city'
                    ? 'bg-[#00D9FF] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                🏙️ CITY MODE
              </button>
              <button
                onClick={() => handleModeChange('home')}
                className={`px-8 py-4 font-bold text-lg border-4 border-black transition-all duration-200 ${
                  activeMode === 'home'
                    ? 'bg-[#00D9FF] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                🏠 HOME MODE
              </button>
            </div>

            {/* Slider */}
            <div className="max-w-4xl mx-auto">
              <div
                ref={sliderRef}
                className="relative aspect-[4/3] overflow-hidden cursor-crosshair border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={handleMouseUp}
                onTouchMove={handleTouchMove}
              >
                {activeMode === 'city' ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: 'url(/images/demos/city-after.png)' }}
                    >
                      <span className="absolute top-6 right-6 px-4 py-2 bg-[#00D9FF] text-black font-bold text-sm border-4 border-black">
                        AFTER
                      </span>
                    </div>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: 'url(/images/demos/city-before.jpg)',
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                      }}
                    >
                      <span className="absolute top-6 left-6 px-4 py-2 bg-white text-black font-bold text-sm border-4 border-black">
                        BEFORE
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: 'url(/images/demos/home-after.png)' }}
                    >
                      <span className="absolute top-6 right-6 px-4 py-2 bg-[#00D9FF] text-black font-bold text-sm border-4 border-black">
                        AFTER
                      </span>
                    </div>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: 'url(/images/demos/home-before.png)',
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                      }}
                    >
                      <span className="absolute top-6 left-6 px-4 py-2 bg-white text-black font-bold text-sm border-4 border-black">
                        BEFORE
                      </span>
                    </div>
                  </>
                )}

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-[#00D9FF] cursor-ew-resize z-20"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#00D9FF] border-4 border-black flex items-center justify-center">
                    <div className="text-black font-bold">⟷</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-16">
            HOW IT <span className="text-[#00D9FF]">WORKS</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'UPLOAD', desc: 'Drop your image of any space' },
              { num: '02', title: 'SELECT', desc: 'Choose transformation filters' },
              { num: '03', title: 'DOWNLOAD', desc: 'Get your AI-enhanced result' }
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="border-4 border-white bg-black p-8 shadow-[12px_12px_0px_0px_rgba(0,217,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,217,255,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200">
                  <div className="text-6xl font-bold text-[#00D9FF] mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{step.num}</div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="bg-[#00D9FF] text-black py-20 border-y-8 border-white">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-16">
              USE <span className="bg-black text-white px-4">CASES</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { icon: '🏗️', title: 'URBAN PLANNING', desc: 'Visualize city improvements' },
                { icon: '🏠', title: 'REAL ESTATE', desc: 'Stage properties instantly' },
                { icon: '🎨', title: 'INTERIOR DESIGN', desc: 'Preview room makeovers' },
                { icon: '🏛️', title: 'ARCHITECTURE', desc: 'Present renovation concepts' }
              ].map((useCase) => (
                <div key={useCase.title} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
                  <div className="text-5xl mb-4">{useCase.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{useCase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-32 text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-8">
            READY TO
            <br />
            <span className="text-[#00D9FF]">TRANSFORM?</span>
          </h2>
          <p className="text-2xl mb-12 text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Start with 2 free credits. No credit card required.
          </p>
          <Link
            to="/app"
            className="inline-block px-16 py-6 bg-[#00D9FF] text-black font-bold text-2xl border-4 border-white shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[8px] hover:translate-y-[8px] transition-all duration-200"
          >
            LAUNCH APP NOW →
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t-4 border-white bg-black py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#00D9FF] border-4 border-white flex items-center justify-center font-bold text-black">
                    R
                  </div>
                  <span className="text-xl font-bold">RE-DO.AI</span>
                </div>
                <p className="text-gray-400 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  AI-powered space transformation platform
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-[#00D9FF]">PRODUCT</h4>
                <ul className="space-y-2 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <li><Link to="/app" className="hover:text-[#00D9FF] transition-colors">Launch App</Link></li>
                  <li><a href="#pricing" className="hover:text-[#00D9FF] transition-colors">Pricing</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-[#00D9FF]">LEGAL</h4>
                <ul className="space-y-2 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <li><Link to="/privacy-policy" className="hover:text-[#00D9FF] transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms-of-service" className="hover:text-[#00D9FF] transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t-2 border-white pt-8 text-center">
              <p className="text-gray-400 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                © 2026 RE-DO.AI • Built with AI • Made for Creators
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
