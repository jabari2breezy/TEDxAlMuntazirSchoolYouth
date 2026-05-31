import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set('.pl-ted-wrap', { yPercent: 0, opacity: 1 });
      gsap.set('.pl-x-wrap', { yPercent: 0, opacity: 1 });
      gsap.set('.pl-brand-name', { opacity: 0, y: 30, letterSpacing: '0.05em' });
      gsap.set('.pl-subtitle', { opacity: 0, y: 20 });
      gsap.set('.pl-divider', { scaleX: 0, transformOrigin: 'center' });
      gsap.set('.pl-progress-bar', { scaleX: 0, transformOrigin: 'left' });

      // Image reveal clip — starts fully hidden (clipPath covers the text)
      gsap.set('.pl-ted-clip', { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set('.pl-x-clip', { clipPath: 'inset(100% 0% 0% 0%)' });

      const counter = { val: 0 };
      const tl = gsap.timeline();

      // Phase 1: Reveal TED and x text from bottom (like image reveal)
      tl.to('.pl-ted-clip', {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: 'power4.inOut',
      }, 0);

      tl.to('.pl-x-clip', {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: 'power4.inOut',
        delay: 0.15,
      }, 0);

      // Phase 2: Animate divider line and brand name
      tl.to('.pl-divider', {
        scaleX: 1,
        duration: 0.7,
        ease: 'power3.inOut',
      }, 0.9);

      tl.to('.pl-brand-name', {
        opacity: 1,
        y: 0,
        letterSpacing: '0.35em',
        duration: 0.9,
        ease: 'power3.out',
      }, 1.0);

      tl.to('.pl-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, 1.3);

      // Phase 3: Progress bar loading
      tl.to(counter, {
        val: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate() {
          const el = document.querySelector('.pl-count');
          if (el) el.textContent = Math.round(counter.val).toString().padStart(3, '0');
          const bar = document.querySelector('.pl-progress-bar') as HTMLElement;
          if (bar) gsap.set(bar, { scaleX: counter.val / 100 });
        }
      }, 1.4);

      // Phase 4: Dramatic exit — TED lifts up, x drops down, brand name fades
      tl.to('.pl-ted-wrap', {
        yPercent: -110,
        duration: 0.9,
        ease: 'power4.inOut',
      }, '+=0.15');

      tl.to('.pl-x-wrap', {
        yPercent: 110,
        duration: 0.9,
        ease: 'power4.inOut',
      }, '<');

      tl.to('.pl-brand-name', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power3.in',
      }, '<+0.1');

      tl.to('.pl-subtitle', {
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
      }, '<');

      // Phase 5: Awwwards-style handoff — wipe + zoom blur, reveal home underneath
      tl.call(() => {
        onComplete();
      }, [], '+=0.1');

      tl.to(containerRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        scale: 1.08,
        filter: 'blur(12px)',
        duration: 1.15,
        ease: 'power4.inOut',
      }, 'exit');

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      }, 'exit+=0.75');

      tl.call(() => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        setIsMounted(false);
      }, [], 'exit+=1.05');

    }, containerRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto bg-[#050507]"
      style={{ height: '100dvh', clipPath: 'inset(0 0 0 0)' }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }}
      />

      {/* === MAIN LAYOUT === */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-0">

        {/* Top Half — TED panel (lifts UP on exit) */}
        <div className="pl-ted-wrap w-full flex justify-center overflow-hidden" style={{ lineHeight: 1 }}>
          {/* The clipped reveal element */}
          <div className="pl-ted-clip overflow-hidden" style={{ clipPath: 'inset(100% 0% 0% 0%)' }}>
            <span
              className="font-title font-black uppercase text-[#E02229] select-none"
              style={{
                fontSize: 'clamp(100px, 22vw, 240px)',
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                display: 'block',
              }}
            >
              TED
            </span>
          </div>
        </div>

        {/* Brand name row — center */}
        <div className="flex flex-col items-center py-3 md:py-5 w-full px-6">
          {/* Horizontal divider */}
          <div className="pl-divider w-full max-w-[280px] md:max-w-[420px] h-[1px] bg-white/20 mb-3 md:mb-5" />

          {/* "AL MUNTAZIR" — like "Ounx" in the reference */}
          <div
            className="pl-brand-name font-typewriter uppercase text-white/90 text-center"
            style={{
              fontSize: 'clamp(11px, 2.4vw, 24px)',
              letterSpacing: '0.35em',
            }}
          >
            AL MUNTAZIR
          </div>

          {/* Progress counter */}
          <div className="pl-subtitle flex items-center gap-3 mt-2 md:mt-3">
            <div className="w-20 md:w-32 h-[1px] bg-white/10 relative overflow-hidden">
              <div className="pl-progress-bar absolute inset-0 bg-white/40 h-full" />
            </div>
            <span className="pl-count font-typewriter text-xs md:text-sm text-white/30 tabular-nums">000</span>
            <span className="font-typewriter text-xs text-white/20">%</span>
          </div>
        </div>

        {/* Bottom Half — x panel (drops DOWN on exit) */}
        <div className="pl-x-wrap w-full flex justify-center overflow-hidden" style={{ lineHeight: 1 }}>
          <div className="pl-x-clip overflow-hidden" style={{ clipPath: 'inset(100% 0% 0% 0%)' }}>
            <span
              className="font-title font-black uppercase text-white select-none"
              style={{
                fontSize: 'clamp(100px, 22vw, 240px)',
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                display: 'block',
              }}
            >
              x
            </span>
          </div>
        </div>

      </div>

      {/* Bottom label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/20">
          [ BORROWED TIME // 2026 ]
        </span>
      </div>
    </div>
  );
}
