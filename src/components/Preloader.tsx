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

    // Griflan-style: Big agency preloader
    // 1. Large counter ticks up
    // 2. At 100%, text does a massive horizontal wipe
    // 3. Everything slides off-screen revealing the page underneath

    const ctx = gsap.context(() => {
      const counter = { val: 0 };

      // Start the counter bar thin, will expand
      gsap.set('.pl-progress-bar', { scaleX: 0, transformOrigin: 'left' });
      gsap.set('.pl-overlay', { opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          setIsMounted(false);
          onComplete();
        }
      });

      // Phase 1: Count up 0→100, widen the progress bar
      tl.to(counter, {
        val: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate() {
          const el = document.querySelector('.pl-count');
          if (el) el.textContent = Math.round(counter.val).toString().padStart(3, '0');
          const bar = document.querySelector('.pl-progress-bar') as HTMLElement;
          if (bar) gsap.set(bar, { scaleX: counter.val / 100 });
        }
      });

      // Phase 2: Brief pause, then slide the left panel UP and right panel DOWN
      tl.to('.pl-panel-left', {
        yPercent: -105,
        duration: 0.9,
        ease: 'power4.inOut',
      }, '+=0.1');

      tl.to('.pl-panel-right', {
        yPercent: 105,
        duration: 0.9,
        ease: 'power4.inOut',
      }, '<');

      tl.to('.pl-wordmark', {
        opacity: 0,
        duration: 0.3,
      }, '<+0.2');

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
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
      style={{ height: '100dvh' }}
    >
      {/* Two-panel split: top slides up, bottom slides down */}
      <div className="pl-panel-left absolute inset-x-0 top-0 h-1/2 bg-[#050507] z-20" />
      <div className="pl-panel-right absolute inset-x-0 bottom-0 h-1/2 bg-[#050507] z-20" />

      {/* Central Wordmark - sits between panels */}
      <div className="pl-wordmark absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 pointer-events-none">
        {/* Main headline */}
        <div className="flex items-baseline gap-4 md:gap-8">
          <span className="font-title font-black text-[14vw] md:text-[10vw] uppercase tracking-tighter leading-none text-[#E02229]">
            TEDX
          </span>
          <span className="font-title font-black text-[14vw] md:text-[10vw] uppercase tracking-tighter leading-none text-white">
            ALM
          </span>
        </div>

        {/* Progress Line */}
        <div className="w-full max-w-xs md:max-w-md mt-8 mb-4 relative">
          <div className="h-[1px] bg-white/10 w-full" />
          <div className="pl-progress-bar absolute inset-0 h-[1px] bg-brand-secondary" />
        </div>

        {/* Counter */}
        <div className="flex items-baseline gap-3">
          <span className="pl-count font-typewriter text-6xl md:text-8xl font-black tracking-tighter text-white tabular-nums">
            000
          </span>
          <span className="font-typewriter text-xl text-white/30">%</span>
        </div>

        <span className="font-typewriter text-[9px] uppercase tracking-[0.6em] text-white/30 mt-4">
          [ BORROWED TIME // 2026 ]
        </span>
      </div>
    </div>
  );
}
