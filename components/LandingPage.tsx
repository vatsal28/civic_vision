import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// ─── Logo mark ───────────────────────────────────────────────────────────────
// Two lines forming a room-corner perspective, terracotta stroke
const RoomCornerIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#D4542A',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    {/* vertical wall line */}
    <line x1="12" y1="4" x2="12" y2="20" />
    {/* left floor line */}
    <line x1="12" y1="20" x2="3" y2="14" />
    {/* right floor line */}
    <line x1="12" y1="20" x2="21" y2="14" />
  </svg>
);

// ─── Arrow icon ──────────────────────────────────────────────────────────────
const ArrowRight: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ─── Star icon ───────────────────────────────────────────────────────────────
const StarFilled: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// ─── Chevron left-right for slider ──────────────────────────────────────────
const ChevronLR: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 7l-5 5 5 5" />
    <path d="M15 7l5 5-5 5" />
  </svg>
);

// ─── Main component ──────────────────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Nav scroll detection ────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Slider drag ─────────────────────────────────────────────────────────
  const updateSlider = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onSliderMouseDown = useCallback(() => setIsDragging(true), []);
  const onSliderMouseUp = useCallback(() => setIsDragging(false), []);
  const onMouseMove = useCallback(
    (e: MouseEvent) => { if (isDragging) updateSlider(e.clientX); },
    [isDragging, updateSlider],
  );
  const onTouchMove = useCallback(
    (e: TouchEvent) => { if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX); },
    [isDragging, updateSlider],
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onSliderMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onSliderMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onSliderMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onSliderMouseUp);
    };
  }, [isDragging, onMouseMove, onSliderMouseUp, onTouchMove]);

  // ── Step card scroll animation ──────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        }),
      { threshold: 0.15 },
    );
    stepRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  // ─── Ticker items ───────────────────────────────────────────────────────
  const tickerItems = [
    'YOUR ROOM, REARRANGED',
    'SAME FURNITURE, NEW PERSPECTIVE',
    'SEE IT BEFORE YOU MOVE IT',
    'AI-POWERED LAYOUTS',
    'FIVE OPTIONS, INSTANTLY',
    'NO HEAVY LIFTING REQUIRED',
  ];

  return (
    <div
      className="landing-root"
      style={{
        minHeight: '100vh',
        background: '#FDFBF7',
        color: '#1A1714',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          1. NAV
      ══════════════════════════════════════════════════════════════ */}
      <nav
        className="landing-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          justifyContent: 'space-between',
          transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
          background: navScrolled ? 'rgba(253,251,247,0.92)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: navScrolled ? 'blur(12px)' : 'none',
          borderBottom: navScrolled ? '1px solid #E8E2D9' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <RoomCornerIcon size={22} color={navScrolled ? '#D4542A' : '#ffffff'} />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '22px',
              fontStyle: 'italic',
              fontWeight: 500,
              letterSpacing: '0.01em',
              color: navScrolled ? '#1A1714' : '#ffffff',
              lineHeight: 1,
            }}
          >
            redo
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 400,
              color: navScrolled ? '#6B6560' : 'rgba(255,255,255,0.7)',
              letterSpacing: '0.02em',
              marginLeft: '-2px',
              alignSelf: 'flex-end',
              paddingBottom: '2px',
            }}
          >
            .ai
          </span>
        </Link>

        {/* Nav links — right side, no CTA button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <a
            href="#how-it-works"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: navScrolled ? '#6B6560' : 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = navScrolled ? '#1A1714' : '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = navScrolled ? '#6B6560' : 'rgba(255,255,255,0.75)')}
          >
            How it works
          </a>
          <Link
            to="/app"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: navScrolled ? '#6B6560' : 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = navScrolled ? '#1A1714' : '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = navScrolled ? '#6B6560' : 'rgba(255,255,255,0.75)')}
          >
            Try free
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          2. HERO — full-bleed photo, massive headline
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: '640px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Full-bleed hero photo */}
        <img
          src="/images/redo-hero-room.png"
          alt="A beautifully lit living room"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />

        {/* Dark overlay — heavier at bottom, lighter at top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(26,23,20,0.18) 0%, rgba(26,23,20,0.35) 50%, rgba(26,23,20,0.72) 100%)',
          }}
        />

        {/* Headline + CTA — bottom-left anchored */}
        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '0 48px 72px',
            maxWidth: '900px',
          }}
        >
          {/* Eyebrow */}
          <p
            className="hero-animate"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 20px',
            }}
          >
            AI Furniture Rearrangement
          </p>

          {/* Massive headline — Montserrat ExtraLight ALL CAPS */}
          <h1
            className="hero-animate hero-animate-delay-1 hero-headline"
            style={{
              fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(64px, 10vw, 130px)',
              fontWeight: 200,
              letterSpacing: '-0.01em',
              lineHeight: 0.92,
              color: '#ffffff',
              margin: '0 0 32px',
              textTransform: 'uppercase',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            YOUR ROOM,<br />REARRANGED.
          </h1>

          {/* Tagline */}
          <p
            className="hero-animate hero-animate-delay-2"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.75)',
              margin: '0 0 36px',
              maxWidth: '440px',
            }}
          >
            Snap a photo. We'll show you five ways to rearrange what you already own — before you move a single thing.
          </p>

          {/* CTA row */}
          <div
            className="hero-animate hero-animate-delay-2"
            style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}
          >
            <Link
              to="/app"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#C4A044',
                color: '#1A1714',
                padding: '14px 28px',
                borderRadius: '2px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#B08E30')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#C4A044')}
            >
              Try my room
              <ArrowRight size={13} />
            </Link>

            <a
              href="#before-after"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            >
              See an example
            </a>
          </div>
        </div>

        {/* Floating stats card — bottom-right (RANTY-style) */}
        <div
          className="hero-animate hero-animate-delay-2 hero-stats-card"
          style={{
            position: 'absolute',
            bottom: '72px',
            right: '48px',
            zIndex: 3,
            background: 'rgba(253,251,247,0.12)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '2px',
            padding: '20px 24px',
            minWidth: '220px',
          }}
        >
          {/* Star row */}
          <div style={{ display: 'flex', gap: '3px', color: '#C4A044', marginBottom: '10px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarFilled key={i} size={11} />
            ))}
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '28px',
              fontWeight: 600,
              color: '#ffffff',
              margin: '0 0 4px',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            2,000+
          </p>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
            }}
          >
            Rooms rearranged
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. MARQUEE / TICKER STRIP
      ══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: '#1A1714',
          borderTop: '1px solid #2E2B28',
          borderBottom: '1px solid #2E2B28',
          padding: '14px 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <div className="marquee-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '32px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                fontWeight: 300,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                paddingRight: '48px',
              }}
            >
              {item}
              <span style={{ color: '#C4A044', fontSize: '8px' }}>&#9632;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. BEFORE / AFTER — two full photos side by side
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="before-after"
        style={{
          padding: '120px 0 0',
        }}
      >
        {/* Section intro */}
        <div
          className="section-mobile-pad"
          style={{
            padding: '0 48px 64px',
            maxWidth: '1040px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6B6560',
                margin: '0 0 16px',
              }}
            >
              The Difference
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(40px, 5vw, 64px)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#1A1714',
                margin: 0,
              }}
            >
              Same furniture.
              <br />
              <em>New perspective.</em>
            </h2>
          </div>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px',
              lineHeight: 1.7,
              color: '#6B6560',
              maxWidth: '340px',
              margin: 0,
            }}
          >
            You already own everything you need. Redo AI finds arrangements you haven't seen — because you've been standing in the same spot.
          </p>
        </div>

        {/* Photo pair — edge-to-edge */}
        <div
          className="before-after-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2px',
            width: '100%',
          }}
        >
          {/* BEFORE */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src="/images/redo-before-room.png"
              alt="Living room before rearrangement"
              style={{
                width: '100%',
                height: '640px',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
            {/* Label */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '40px 36px 28px',
                background: 'linear-gradient(to top, rgba(26,23,20,0.7) 0%, transparent 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  fontWeight: 300,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Before
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '72px',
                  fontWeight: 300,
                  lineHeight: 0.8,
                  color: 'rgba(255,255,255,0.08)',
                  letterSpacing: '-0.04em',
                  userSelect: 'none',
                }}
              >
                01
              </span>
            </div>
          </div>

          {/* AFTER */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src="/images/redo-after-room.png"
              alt="Living room after AI rearrangement"
              style={{
                width: '100%',
                height: '640px',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
            {/* Label */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '40px 36px 28px',
                background: 'linear-gradient(to top, rgba(26,23,20,0.7) 0%, transparent 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  fontWeight: 300,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                After
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '72px',
                  fontWeight: 300,
                  lineHeight: 0.8,
                  color: 'rgba(255,255,255,0.08)',
                  letterSpacing: '-0.04em',
                  userSelect: 'none',
                }}
              >
                02
              </span>
            </div>
          </div>
        </div>

        {/* Sub-caption below photos */}
        <div
          className="section-mobile-pad"
          style={{
            padding: '20px 48px',
            maxWidth: '1040px',
            margin: '0 auto',
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: '#9E9890',
              margin: 0,
            }}
          >
            Real room. Same furniture. Rearranged by AI.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. HOW IT WORKS — 01 / 02 / 03 horizontal editorial
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="section-mobile-pad section-vpad-large"
        style={{
          padding: '120px 48px',
          maxWidth: '1040px',
          margin: '0 auto',
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: '72px' }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6B6560',
              margin: '0 0 16px',
            }}
          >
            Process
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(40px, 5vw, 60px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#1A1714',
              margin: 0,
            }}
          >
            Three steps.
          </h2>
        </div>

        {/* Steps — 3-column grid */}
        <div
          className="steps-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: '#E8E2D9',
          }}
        >
          {[
            {
              num: '01',
              title: 'Photograph your room',
              body: 'Take a photo of the space you want to rearrange. Any angle, any phone.',
            },
            {
              num: '02',
              title: 'We map your furniture',
              body: 'AI identifies every piece you own and understands the room\'s dimensions.',
            },
            {
              num: '03',
              title: 'See your options',
              body: 'Five layout alternatives appear. Choose the one that feels right.',
            },
          ].map((step, i) => (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="step-card"
              style={{
                background: '#FDFBF7',
                padding: '48px 40px',
                position: 'relative',
              }}
            >
              {/* Ghost number */}
              <span
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '28px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '96px',
                  fontWeight: 600,
                  lineHeight: 1,
                  color: 'rgba(26,23,20,0.045)',
                  letterSpacing: '-0.04em',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {step.num}
              </span>

              {/* Step number — terracotta accent */}
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#D4542A',
                  marginBottom: '28px',
                }}
              >
                {step.num}
              </span>

              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '24px',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  color: '#1A1714',
                  margin: '0 0 16px',
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  color: '#6B6560',
                  margin: 0,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. SOCIAL PROOF — single large pull quote
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="section-mobile-pad section-vpad-large"
        style={{
          background: '#F5F1EA',
          borderTop: '1px solid #E8E2D9',
          borderBottom: '1px solid #E8E2D9',
          padding: '120px 48px',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Stars */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              color: '#C4A044',
              marginBottom: '36px',
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <StarFilled key={i} size={14} />
            ))}
          </div>

          {/* Large pull quote */}
          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              color: '#1A1714',
              margin: '0 0 40px',
            }}
          >
            "I kept thinking my sofa was the problem. Redo showed me I just had it facing the wrong wall."
          </blockquote>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '1px',
                height: '36px',
                background: '#D4542A',
              }}
            />
            <div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1A1714',
                  margin: '0 0 2px',
                }}
              >
                Sarah K.
              </p>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#9E9890',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                Homeowner, Dublin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. CTA — massive serif headline, warm background
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="section-mobile-pad section-vpad-large"
        style={{
          padding: '140px 48px',
          background: '#FDFBF7',
        }}
      >
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          {/* Asymmetric layout: headline left, CTA right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '60px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 500px' }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(52px, 7vw, 96px)',
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  color: '#1A1714',
                  margin: 0,
                }}
              >
                Stop imagining.
                <br />
                <em>Start seeing.</em>
              </h2>
            </div>

            <div
              style={{
                flex: '0 1 340px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#6B6560',
                  margin: 0,
                }}
              >
                Your dream room is two minutes away. No commitment, no download.
              </p>

              <Link
                to="/app"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#C4A044',
                  color: '#1A1714',
                  padding: '16px 32px',
                  borderRadius: '2px',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#B08E30')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#C4A044')}
              >
                Rearrange my room
                <ArrowRight size={14} />
              </Link>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  color: '#9E9890',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                Free to try. No account needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. FOOTER — minimal
      ══════════════════════════════════════════════════════════════ */}
      <footer
        className="section-mobile-pad"
        style={{
          borderTop: '1px solid #E8E2D9',
          padding: '32px 48px',
          background: '#FDFBF7',
        }}
      >
        <div
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <RoomCornerIcon size={18} color="#D4542A" />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '18px',
                fontStyle: 'italic',
                fontWeight: 500,
                color: '#1A1714',
              }}
            >
              redo
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '12px',
                color: '#9E9890',
                marginLeft: '-2px',
                alignSelf: 'flex-end',
                paddingBottom: '1px',
              }}
            >
              .ai
            </span>
          </Link>

          {/* Links */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: '13px',
                  color: '#9E9890',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1A1714')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9E9890')}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:contact@re-do.ai"
              style={{
                fontSize: '13px',
                color: '#9E9890',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1A1714')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9E9890')}
            >
              Contact
            </a>
          </div>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '12px',
              color: '#B8B2AA',
              margin: 0,
              letterSpacing: '0.04em',
            }}
          >
            2026 Re-do.ai
          </p>
        </div>
      </footer>
    </div>
  );
};
