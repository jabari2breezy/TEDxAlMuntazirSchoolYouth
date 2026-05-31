import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourglassRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(hourglassRef.current, { scale: 0.3, opacity: 0, rotation: -90 });
      gsap.set(textRef.current, { opacity: 0, y: 30, letterSpacing: '0.2em' });
      gsap.set(counterRef.current, { opacity: 0, y: 20 });
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left' });

      const counter = { val: 0 };
      const tl = gsap.timeline();

      // Phase 1: Hourglass expands from center
      tl.to(hourglassRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.6,
        ease: 'power4.out',
      }, 0);

      // Phase 2: Text reveal
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        letterSpacing: '0.35em',
        duration: 1,
        ease: 'power3.out',
      }, 0.5);

      // Phase 3: Counter and progress bar
      tl.to(counterRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, 0.7);

      tl.to(barRef.current, {
        scaleX: 1,
        duration: 2,
        ease: 'power2.inOut',
      }, 0.8);

      tl.to(counter, {
        val: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate() {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counter.val).toString().padStart(3, '0');
          }
        }
      }, 0.8);

      // Phase 4: Hold
      tl.to({}, { duration: 0.4 });

      // Phase 5: Exit — hourglass collapses
      tl.to(hourglassRef.current, {
        scale: 1.3,
        opacity: 0,
        rotation: 45,
        duration: 0.8,
        ease: 'power3.in',
      }, 'exit');

      tl.to(textRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.in',
      }, 'exit+=0.1');

      tl.to(counterRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
      }, 'exit+=0.15');

      tl.to(barRef.current, {
        scaleX: 0,
        duration: 0.4,
        ease: 'power2.in',
      }, 'exit+=0.1');

      // Phase 6: Handoff
      tl.call(() => {
        onComplete();
      }, [], 'exit+=0.3');

      tl.to(containerRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        scale: 1.05,
        filter: 'blur(8px)',
        duration: 1,
        ease: 'power4.inOut',
      }, 'exit+=0.4');

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, 'exit+=1.1');

      tl.call(() => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        setIsMounted(false);
      }, [], 'exit+=1.3');

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
        className="absolute inset-0 z-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Hourglass SVG */}
        <svg
          ref={hourglassRef}
          viewBox="0 0 100 160"
          className="w-32 h-48 md:w-40 md:h-60 mb-8"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Top triangle */}
          <path d="M20 10 L80 10 L50 70 Z" />
          {/* Bottom triangle */}
          <path d="M20 150 L80 150 L50 90 Z" />
          {/* Connecting lines */}
          <line x1="50" y1="70" x2="50" y2="90" />
          {/* Sand flow */}
          <path d="M50 75 L50 85" strokeWidth="1" opacity="0.5" />
        </svg>

        {/* Brand text */}
        <div
          ref={textRef}
          className="text-center mb-8"
        >
          <div className="font-title font-black uppercase text-white/90 text-center"
            style={{
              fontSize: 'clamp(14px, 3vw, 28px)',
              letterSpacing: '0.35em',
            }}
          >
            TEDx AL MUNTAZIR
          </div>
          <div className="font-typewriter text-[10px] text-white/30 uppercase tracking-[0.5em] mt-3">
            Schools Youth
          </div>
        </div>

        {/* Progress section */}
        <div
          ref={counterRef}
          className="flex items-center gap-4"
        >
          <div className="w-32 md:w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              ref={barRef}
              className="absolute inset-0 bg-white/30 h-full"
              style={{ transformOrigin: 'left' }}
            />
          </div>
          <span className="font-typewriter text-sm md:text-base text-white/40 tabular-nums">000</span>
          <span className="font-typewriter text-xs text-white/20">%</span>
        </div>

        {/* Bottom label */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/15">
            [ BORROWED TIME // 2026 ]
          </span>
        </div>
      </div>
    </div>
  );
}
