import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// ─── Icon Library ───────────────────────────────────────────────────────────

const Icons = {
  ArrowRight: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Home: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Building: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </svg>
  ),
  Camera: ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Sparkles: ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  ),
  Sliders: ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
  ChevronLeftRight: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7l-5 5 5 5" />
      <path d="M15 7l5 5-5 5" />
    </svg>
  ),
  Check: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Sofa: ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <path d="M2 11a2 2 0 0 1 2-2 2 2 0 0 1 2 2v2H2v-2z" />
      <path d="M22 11a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2h4v-2z" />
      <path d="M4 13h16v3H4z" />
      <path d="M6 19v-3M18 19v-3" />
    </svg>
  ),
  Palette: ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  Leaf: ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  MapPin: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Star: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
};

// ─── Room SVG Illustration ──────────────────────────────────────────────────

const RoomIllustration: React.FC<{ variant: 'before' | 'after'; className?: string }> = ({ variant, className = '' }) => {
  if (variant === 'before') {
    return (
      <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`} aria-label="Room before redesign">
        {/* Wall & floor */}
        <rect width="400" height="280" fill="#E8E0D5" />
        <polygon points="0,200 400,200 400,280 0,280" fill="#C8B89A" />
        <polygon points="0,200 400,200 380,220 20,220" fill="#D4C5B0" />
        {/* Baseboard */}
        <rect x="0" y="197" width="400" height="4" fill="#BFA88C" />
        {/* Back wall shadow */}
        <rect x="0" y="0" width="400" height="200" fill="url(#wallGradBefore)" />
        <defs>
          <linearGradient id="wallGradBefore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DDD3C6" />
            <stop offset="100%" stopColor="#E8E0D5" />
          </linearGradient>
          <linearGradient id="wallGradAfter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0EAE0" />
            <stop offset="100%" stopColor="#F8F4EE" />
          </linearGradient>
        </defs>
        {/* Window */}
        <rect x="140" y="30" width="120" height="90" fill="#B8CDD8" rx="2" />
        <rect x="140" y="30" width="120" height="90" fill="none" stroke="#9EA8A0" strokeWidth="3" rx="2" />
        <line x1="200" y1="30" x2="200" y2="120" stroke="#9EA8A0" strokeWidth="2" />
        <line x1="140" y1="75" x2="260" y2="75" stroke="#9EA8A0" strokeWidth="2" />
        {/* Curtains */}
        <path d="M 135,25 Q 145,60 140,120" fill="#C4B49A" stroke="none" />
        <path d="M 265,25 Q 255,60 260,120" fill="#C4B49A" stroke="none" />
        {/* Sofa (old, boxy) */}
        <rect x="60" y="145" width="200" height="55" fill="#9E8E78" rx="4" />
        <rect x="60" y="135" width="200" height="18" fill="#8A7A64" rx="3" />
        <rect x="60" y="142" width="20" height="60" fill="#8A7A64" rx="2" />
        <rect x="240" y="142" width="20" height="60" fill="#8A7A64" rx="2" />
        <rect x="85" y="153" width="55" height="35" fill="#B4A48E" rx="2" />
        <rect x="145" y="153" width="55" height="35" fill="#B4A48E" rx="2" />
        <rect x="205" y="153" width="40" height="35" fill="#B4A48E" rx="2" />
        {/* Coffee table (cluttered) */}
        <rect x="100" y="195" width="120" height="8" fill="#7A6A56" rx="1" />
        <rect x="108" y="200" width="8" height="16" fill="#6A5C48" />
        <rect x="204" y="200" width="8" height="16" fill="#6A5C48" />
        {/* Clutter items on table */}
        <rect x="120" y="188" width="18" height="8" fill="#D4A882" rx="1" />
        <rect x="142" y="186" width="12" height="10" fill="#C49870" rx="1" />
        <circle cx="170" cy="190" r="5" fill="#BA8060" />
        {/* Side table */}
        <rect x="290" y="162" width="60" height="38" fill="#8A7860" rx="2" />
        <rect x="295" y="155" width="50" height="10" fill="#7A6850" rx="1" />
        {/* Lamp */}
        <rect x="310" y="110" width="8" height="50" fill="#A09080" />
        <path d="M 290,115 Q 314,95 338,115" fill="#D4C4A8" />
        {/* Rug (plain) */}
        <ellipse cx="180" cy="210" rx="110" ry="12" fill="#C4B49A" opacity="0.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`} aria-label="Room after redesign">
      {/* Lighter, warmer wall & floor */}
      <rect width="400" height="280" fill="#F8F4EE" />
      <polygon points="0,200 400,200 400,280 0,280" fill="#C4B898" />
      <polygon points="0,200 400,200 380,218 20,218" fill="#D8CCBC" />
      <rect x="0" y="197" width="400" height="4" fill="#C0AA8A" />
      <rect x="0" y="0" width="400" height="200" fill="url(#wallGradAfter)" />
      <defs>
        <linearGradient id="wallGradAfter2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0EAE0" />
          <stop offset="100%" stopColor="#F8F4EE" />
        </linearGradient>
      </defs>
      {/* Window (brighter light) */}
      <rect x="130" y="25" width="140" height="95" fill="#C8DCE8" rx="4" />
      <rect x="130" y="25" width="140" height="95" fill="none" stroke="#A8C0CC" strokeWidth="3" rx="4" />
      <line x1="200" y1="25" x2="200" y2="120" stroke="#A8C0CC" strokeWidth="2" />
      <line x1="130" y1="72" x2="270" y2="72" stroke="#A8C0CC" strokeWidth="2" />
      {/* Sun/light beam through window */}
      <polygon points="130,25 200,25 200,120 130,120" fill="rgba(255,230,150,0.12)" />
      {/* Linen curtains */}
      <path d="M 122,20 Q 135,70 130,125" fill="#E8DECC" stroke="none" />
      <path d="M 278,20 Q 265,70 270,125" fill="#E8DECC" stroke="none" />
      {/* Modern sofa (rounded, sage green) */}
      <rect x="50" y="150" width="220" height="50" fill="#7A9E8C" rx="12" />
      <rect x="50" y="140" width="220" height="18" fill="#6A8E7C" rx="8" />
      <rect x="50" y="143" width="22" height="58" fill="#5C8070" rx="8" />
      <rect x="248" y="143" width="22" height="58" fill="#5C8070" rx="8" />
      {/* Cushions */}
      <rect x="75" y="155" width="52" height="36" fill="#8AB8A0" rx="8" />
      <rect x="134" y="155" width="52" height="36" fill="#9EC8B4" rx="8" />
      <rect x="193" y="155" width="52" height="36" fill="#8AB8A0" rx="8" />
      {/* Modern coffee table */}
      <rect x="95" y="193" width="130" height="7" fill="#6A8070" rx="3" />
      <rect x="104" y="199" width="6" height="14" fill="#587060" />
      <rect x="210" y="199" width="6" height="14" fill="#587060" />
      {/* Decor on table (neat) */}
      <circle cx="130" cy="190" r="6" fill="#E8C090" />
      <rect x="148" y="184" width="14" height="9" fill="#A0C0A0" rx="2" />
      <circle cx="175" cy="188" r="4" fill="#D4A878" />
      {/* Plant (potted) */}
      <rect x="306" y="178" width="28" height="22" fill="#8A6848" rx="3" />
      <rect x="300" y="170" width="40" height="10" fill="#7A5C3C" rx="2" />
      <ellipse cx="320" cy="165" rx="22" ry="18" fill="#3A8050" />
      <ellipse cx="307" cy="158" rx="12" ry="16" fill="#4A9060" />
      <ellipse cx="333" cy="155" rx="10" ry="14" fill="#3A8050" />
      {/* Tall arc lamp */}
      <path d="M 340,200 Q 340,130 300,110" fill="none" stroke="#C4B8A8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="295" cy="108" r="18" fill="#F0E8D8" stroke="#C4B8A8" strokeWidth="2" />
      <circle cx="295" cy="108" r="10" fill="#FFF8E8" opacity="0.8" />
      {/* Rug (patterned) */}
      <ellipse cx="180" cy="210" rx="115" ry="13" fill="#D4C0A0" opacity="0.6" />
      <ellipse cx="180" cy="210" rx="90" ry="9" fill="none" stroke="#C4B090" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="180" cy="210" rx="65" ry="6" fill="none" stroke="#C4B090" strokeWidth="1" opacity="0.5" />
      {/* Wall art */}
      <rect x="30" y="50" width="70" height="85" fill="#EAE2D4" rx="4" stroke="#D4C8B8" strokeWidth="2" />
      <rect x="38" y="58" width="54" height="69" fill="#C8E4D8" rx="2" />
      <ellipse cx="65" cy="92" rx="18" ry="22" fill="#4A8C6A" opacity="0.6" />
      <circle cx="65" cy="78" r="8" fill="#FF8C50" opacity="0.7" />
    </svg>
  );
};

// ─── City SVG Illustration ──────────────────────────────────────────────────

const CityIllustration: React.FC<{ variant: 'before' | 'after'; className?: string }> = ({ variant, className = '' }) => {
  if (variant === 'before') {
    return (
      <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`} aria-label="City street before">
        {/* Sky */}
        <rect width="400" height="280" fill="#C8D4DC" />
        {/* Ground */}
        <rect x="0" y="210" width="400" height="70" fill="#9A9890" />
        {/* Road */}
        <rect x="0" y="195" width="400" height="85" fill="#808878" />
        <rect x="0" y="218" width="400" height="4" fill="#70786A" />
        {/* Lane markings */}
        {[20, 60, 100, 140, 180, 220, 260, 300, 340].map(x => (
          <rect key={x} x={x} y="226" width="24" height="4" fill="#B8B8A0" />
        ))}
        {/* Buildings */}
        <rect x="20" y="60" width="80" height="150" fill="#A8A0A0" />
        <rect x="100" y="90" width="60" height="120" fill="#B8B2B0" />
        <rect x="160" y="40" width="90" height="170" fill="#A0A4A8" />
        <rect x="250" y="70" width="70" height="140" fill="#ACA8A4" />
        <rect x="320" y="100" width="60" height="110" fill="#B4B0AC" />
        {/* Windows (grey, uniform) */}
        {[25, 45, 65].map(x => [70, 90, 110, 130].map(y => (
          <rect key={`${x}-${y}`} x={x} y={y} width="14" height="12" fill="#8890A0" />
        )))}
        {/* Parked cars */}
        <rect x="60" y="198" width="55" height="22" fill="#686060" rx="3" />
        <rect x="190" y="198" width="55" height="22" fill="#5A6060" rx="3" />
        <rect x="300" y="198" width="55" height="22" fill="#646460" rx="3" />
        {/* No trees */}
        {/* Cracked sidewalk */}
        <rect x="0" y="186" width="400" height="12" fill="#908888" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`} aria-label="City street after redesign">
      {/* Brighter sky */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8CCE0" />
          <stop offset="100%" stopColor="#D0E8F0" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#skyGrad)" />
      {/* Ground */}
      <rect x="0" y="210" width="400" height="70" fill="#8CB890" />
      {/* Road (narrower) */}
      <rect x="0" y="195" width="400" height="85" fill="#7A8878" />
      {/* Bike lane */}
      <rect x="0" y="195" width="45" height="85" fill="#6A9870" opacity="0.4" />
      <rect x="355" y="195" width="45" height="85" fill="#6A9870" opacity="0.4" />
      {/* Lane markings */}
      {[70, 110, 150, 190, 230, 270, 310].map(x => (
        <rect key={x} x={x} y="228" width="20" height="3" fill="#A0A890" />
      ))}
      {/* Buildings (same base, new details) */}
      <rect x="20" y="60" width="80" height="150" fill="#D4CCC0" />
      <rect x="100" y="90" width="60" height="120" fill="#DDD6C8" />
      <rect x="160" y="40" width="90" height="170" fill="#D0C8BE" />
      <rect x="250" y="70" width="70" height="140" fill="#CCC4B8" />
      <rect x="320" y="100" width="60" height="110" fill="#D8D0C4" />
      {/* Windows (warm, some lit) */}
      {[25, 45, 65].map(x => [70, 90, 110, 130].map(y => (
        <rect key={`${x}-${y}`} x={x} y={y} width="14" height="12" fill="#F0E8D0" rx="1" />
      )))}
      {/* Street trees */}
      <rect x="75" y="175" width="8" height="30" fill="#6A5040" />
      <circle cx="79" cy="158" r="24" fill="#4A9058" />
      <circle cx="68" cy="152" r="16" fill="#5AA068" />
      <rect x="195" y="175" width="8" height="30" fill="#6A5040" />
      <circle cx="199" cy="158" r="24" fill="#3E8850" />
      <circle cx="210" cy="150" r="18" fill="#4A9058" />
      <rect x="315" y="175" width="8" height="30" fill="#6A5040" />
      <circle cx="319" cy="158" r="22" fill="#4A9058" />
      {/* Cycle lane markers */}
      <text x="14" y="238" fontSize="14" fill="#A8D098">🚲</text>
      <text x="362" y="238" fontSize="14" fill="#A8D098">🚲</text>
      {/* Planter boxes */}
      <rect x="50" y="186" width="35" height="12" fill="#8A6848" rx="2" />
      <ellipse cx="67" cy="183" rx="18" ry="8" fill="#5A9068" />
      <rect x="280" y="186" width="35" height="12" fill="#8A6848" rx="2" />
      <ellipse cx="297" cy="183" rx="18" ry="8" fill="#5A9068" />
      {/* Clean sidewalk */}
      <rect x="0" y="183" width="400" height="14" fill="#C8C0B0" />
    </svg>
  );
};

// ─── Main Landing Page ──────────────────────────────────────────────────────

export const LandingPage: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeMode, setActiveMode] = useState<'home' | 'city'>('home');
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = useCallback(() => setIsDragging(true), []);
  const onMouseUp = useCallback(() => setIsDragging(false), []);
  const onMouseMove = useCallback((e: MouseEvent) => { if (isDragging) updateSlider(e.clientX); }, [isDragging, updateSlider]);
  const onTouchMove = useCallback((e: TouchEvent) => { if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX); }, [isDragging, updateSlider]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp, onTouchMove]);

  const handleModeSwitch = (mode: 'home' | 'city') => {
    setActiveMode(mode);
    setSliderPos(50);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAFAF8',
        fontFamily: '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: '#1A1A1A',
      }}
    >
      {/* ── Navigation ───────────────────────────────────────── */}
      <nav
        className="nav-blur sticky top-0 z-50"
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, #E8621A 0%, #F0A020 100%)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
            }}>
              <Icons.Home size={16} />
            </div>
            <span style={{ fontSize: '17px', fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.02em' }}>
              Re-do.ai
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#how-it-works" style={{ display: 'none', fontSize: '14px', color: '#4A4A4A', textDecoration: 'none', fontWeight: 500 }}
               className="sm:block">
              How it works
            </a>
            <a href="#features" style={{ fontSize: '14px', color: '#4A4A4A', textDecoration: 'none', fontWeight: 500 }}
               className="hidden sm:block">
              Features
            </a>
            <Link
              to="/app"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: '#1A1A1A',
                color: 'white',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#333')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1A1A1A')}
            >
              Try free
              <Icons.ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle warm background circles */}
        <div style={{
          position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(232,98,26,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#FEF0E6',
            border: '1px solid #F0C8A0',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#C04010',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}>
            <span style={{ color: '#E8621A' }}>✦</span>
            AI furniture & room redesign
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 60px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            color: '#1A1A1A',
          }}>
            Rearrange your room
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #E8621A 0%, #C84010 60%, #A83000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              before moving a single thing
            </span>
          </h1>

          {/* Sub-headline */}
          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#4A4A4A',
            maxWidth: '520px',
            margin: '0 auto 36px',
            fontWeight: 400,
          }}>
            Take a photo of any room. Tell Redo AI what you want. See a realistic preview — instantly.
            No guessing. No moving furniture twice.
          </p>

          {/* CTA group */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Link
              to="/app"
              className="cta-button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #E8621A 0%, #C84010 100%)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '999px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(232,98,26,0.28)',
                letterSpacing: '-0.01em',
              }}
            >
              Try it free
              <Icons.ArrowRight size={15} />
            </Link>
            <a
              href="#demo"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#FFFFFF',
                color: '#1A1A1A',
                padding: '14px 24px',
                borderRadius: '999px',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid #E8E2D8',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#C4B8A8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E2D8')}
            >
              See examples ↓
            </a>
          </div>

          {/* Social proof line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F0A020' }}>
              {[1,2,3,4,5].map(i => <span key={i}><Icons.Star size={13} /></span>)}
            </div>
            <span style={{ fontSize: '13px', color: '#8A8580' }}>
              2 free generations · No credit card needed
            </span>
          </div>
        </div>
      </section>

      {/* ── Interactive Demo ──────────────────────────────────── */}
      <section id="demo" style={{ padding: '24px 24px 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Mode tabs */}
          <div style={{
            display: 'flex',
            gap: '4px',
            background: '#F0EDE6',
            borderRadius: '14px',
            padding: '4px',
            width: 'fit-content',
            margin: '0 auto 20px',
          }}>
            {(['home', 'city'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => handleModeSwitch(mode)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeMode === mode ? '#FFFFFF' : 'transparent',
                  color: activeMode === mode ? '#1A1A1A' : '#8A8580',
                  boxShadow: activeMode === mode ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {mode === 'home' ? <Icons.Home size={15} /> : <Icons.Building size={15} />}
                {mode === 'home' ? 'Home Mode' : 'City Mode'}
              </button>
            ))}
          </div>

          {/* Demo card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '12px',
            border: '1px solid #E8E2D8',
            boxShadow: '0 4px 40px rgba(0,0,0,0.06)',
          }}>
            {/* Comparison Slider */}
            <div
              ref={sliderRef}
              onMouseDown={onMouseDown}
              onTouchStart={onMouseDown}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '16/10',
                background: '#F5F3EE',
                cursor: 'ew-resize',
                userSelect: 'none',
              }}
            >
              {/* After (full width, underneath) */}
              <div style={{ position: 'absolute', inset: 0 }}>
                {activeMode === 'home'
                  ? <RoomIllustration variant="after" />
                  : <CityIllustration variant="after" />
                }
              </div>

              {/* Before (clipped to left) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
              }}>
                {activeMode === 'home'
                  ? <RoomIllustration variant="before" />
                  : <CityIllustration variant="before" />
                }
              </div>

              {/* Labels */}
              <span style={{
                position: 'absolute', top: 12, left: 12,
                background: 'rgba(0,0,0,0.55)',
                color: 'white',
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '6px',
                backdropFilter: 'blur(4px)',
              }}>
                Before
              </span>
              <span style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(255,255,255,0.9)',
                color: '#1A1A1A',
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '6px',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              }}>
                After
              </span>

              {/* Divider line */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${sliderPos}%`,
                width: '2px',
                background: 'white',
                boxShadow: '0 0 12px rgba(0,0,0,0.25)',
                pointerEvents: 'none',
              }} />

              {/* Handle */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: `${sliderPos}%`,
                transform: 'translate(-50%, -50%)',
                width: '44px', height: '44px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 16px rgba(0,0,0,0.16)',
                cursor: 'grab',
                zIndex: 10,
                transition: isDragging ? 'none' : 'transform 0.1s ease',
              }}>
                <Icons.ChevronLeftRight size={17} />
              </div>

              {/* Instruction */}
              <div style={{
                position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.92)',
                color: '#4A4A4A',
                fontSize: '12px', fontWeight: 500,
                padding: '5px 14px',
                borderRadius: '999px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
              }}>
                ← drag to compare →
              </div>
            </div>

            {/* Caption */}
            <div style={{ padding: '12px 4px 2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '13px', color: '#8A8580', margin: 0 }}>
                {activeMode === 'home'
                  ? 'Living room · Neutral → Sage green refresh'
                  : 'Street · Grey concrete → Green + bike lanes'}
              </p>
              <Link to="/app" style={{
                fontSize: '13px', fontWeight: 600, color: '#E8621A',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                Try yours <Icons.ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '32px 24px 80px', background: '#F5F3EE' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div className="pill-badge" style={{ display: 'inline-block', marginBottom: '16px' }}>
              How it works
            </div>
            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#1A1A1A',
              margin: 0,
            }}>
              Three steps to a new room
            </h2>
          </div>

          {/* Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                number: '01',
                icon: <Icons.Camera size={24} />,
                color: '#E8621A',
                softColor: '#FEF0E6',
                title: 'Snap a photo',
                desc: 'Take or upload a photo of the room you want to transform. Any angle, any lighting.',
              },
              {
                number: '02',
                icon: <Icons.Sliders size={24} />,
                color: '#1A6EE8',
                softColor: '#E6F0FE',
                title: 'Pick a style',
                desc: 'Choose your vibe — Scandinavian minimal, cosy warm, modern bold. Or just describe it.',
              },
              {
                number: '03',
                icon: <Icons.Sparkles size={24} />,
                color: '#4A8C6A',
                softColor: '#EBF5F0',
                title: 'See the result',
                desc: 'AI generates a photorealistic redesign in seconds. Compare, download, or try again.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8E2D8',
                  borderRadius: '20px',
                  padding: '28px 24px',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '52px', height: '52px',
                  background: step.softColor,
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: step.color,
                  marginBottom: '20px',
                }}>
                  {step.icon}
                </div>
                {/* Step label */}
                <div style={{ fontSize: '11px', fontWeight: 700, color: step.color, letterSpacing: '0.06em', marginBottom: '8px' }}>
                  STEP {step.number}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 10px', color: '#1A1A1A' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#6A6A6A', margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ───────────────────────────────── */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="pill-badge" style={{ display: 'inline-block', marginBottom: '16px' }}>
              What you can do
            </div>
            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#1A1A1A',
              margin: 0,
            }}>
              Every room, every style
            </h2>
          </div>

          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              {
                icon: <Icons.Sofa size={22} />,
                color: '#E8621A',
                softColor: '#FEF0E6',
                title: 'Furniture rearrangement',
                desc: 'See exactly how different layouts work before you pull out your back.',
              },
              {
                icon: <Icons.Palette size={22} />,
                color: '#1A6EE8',
                softColor: '#E6F0FE',
                title: 'Color & paint preview',
                desc: 'Try any wall color without buying a sample pot. Instant, realistic preview.',
              },
              {
                icon: <Icons.Leaf size={22} />,
                color: '#4A8C6A',
                softColor: '#EBF5F0',
                title: 'Add plants & decor',
                desc: 'See how plants, art, and accessories change the whole feel of a room.',
              },
              {
                icon: <Icons.Building size={22} />,
                color: '#8A6040',
                softColor: '#F5EDE0',
                title: 'City mode (bonus)',
                desc: 'Reimagine urban spaces too — green streets, better cycling infrastructure.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  background: '#FAFAF8',
                  border: '1px solid #E8E2D8',
                  borderRadius: '18px',
                  padding: '24px 20px',
                }}
              >
                <div style={{
                  width: '44px', height: '44px',
                  background: f.softColor,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color,
                  marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 8px', color: '#1A1A1A' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#6A6A6A', margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases / Who It's For ─────────────────────────── */}
      <section style={{ padding: '24px 24px 80px', background: '#F5F3EE' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 30px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: '32px',
            color: '#1A1A1A',
          }}>
            Loved by renters, homeowners, and designers
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {[
              { icon: '🛋️', label: 'First-time renters' },
              { icon: '🏡', label: 'New homeowners' },
              { icon: '✏️', label: 'Interior designers' },
              { icon: '📸', label: 'Airbnb hosts' },
              { icon: '🏢', label: 'Real estate agents' },
              { icon: '🌿', label: 'Urban planners' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #E8E2D8',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#2A2A2A',
                  transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            background: '#1A1A1A',
            borderRadius: '28px',
            padding: 'clamp(40px, 6vw, 64px) clamp(32px, 5vw, 56px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Warm glow */}
            <div style={{
              position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
              width: '400px', height: '300px',
              background: 'radial-gradient(ellipse, rgba(232,98,26,0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '56px', height: '56px',
                background: 'linear-gradient(135deg, #E8621A, #F0A020)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '26px',
              }}>
                ✨
              </div>

              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                margin: '0 0 14px',
                lineHeight: 1.15,
              }}>
                Stop imagining. Start seeing.
              </h2>
              <p style={{ fontSize: '16px', color: '#A0998E', lineHeight: 1.6, margin: '0 0 32px' }}>
                Your dream room is two minutes away. No commitment, no download.
              </p>

              <Link
                to="/app"
                className="cta-button"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #E8621A 0%, #C84010 100%)',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: '999px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 24px rgba(232,98,26,0.4)',
                  letterSpacing: '-0.01em',
                }}
              >
                Redesign my room — free
                <Icons.ArrowRight size={15} />
              </Link>

              {/* Trust badges */}
              <div style={{
                display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap',
                marginTop: '24px',
              }}>
                {[
                  { icon: <Icons.Check size={13} />, text: 'No account needed' },
                  { icon: <Icons.Check size={13} />, text: '2 free generations' },
                  { icon: <Icons.Check size={13} />, text: 'Works on mobile' },
                ].map((badge, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '13px', color: '#706860',
                  }}>
                    <span style={{ color: '#4A8C6A' }}>{badge.icon}</span>
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #E8E2D8',
        padding: '32px 24px',
      }}>
        <div style={{
          maxWidth: '1080px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center',
          gap: '20px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
            <div style={{
              width: '30px', height: '30px',
              background: 'linear-gradient(135deg, #E8621A 0%, #F0A020 100%)',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}>
              <Icons.Home size={14} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.01em' }}>
              Re-do.ai
            </span>
          </Link>

          {/* Links */}
          <div style={{ display: 'flex', gap: '28px' }}>
            {[
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{ fontSize: '14px', color: '#8A8580', textDecoration: 'none', transition: 'color 0.15s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A1A1A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8580')}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:contact@re-do.ai"
              style={{ fontSize: '14px', color: '#8A8580', textDecoration: 'none', transition: 'color 0.15s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1A1A1A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8A8580')}
            >
              Contact
            </a>
          </div>

          <p style={{ fontSize: '13px', color: '#A8A09A', margin: 0 }}>
            © 2026 Re-do.ai
          </p>
        </div>
      </footer>
    </div>
  );
};
