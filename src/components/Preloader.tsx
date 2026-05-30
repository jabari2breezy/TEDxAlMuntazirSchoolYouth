import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';

    const ctx = gsap.context(() => {
      gsap.set([
        '.preloader-title-line span',
        '.preloader-meta-line span',
        '.preloader-stat',
      ], { y: '110%' });
      gsap.set('.preloader-progress-fill', { scaleX: 0 });
      gsap.set('.preloader-ring', { scale: 0.75, opacity: 0 });

      const count = { value: 0 };
      const timeline = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          setIsMounted(false);
          onComplete();
        },
      });

      timeline
        .to('.preloader-ring', {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
        })
        .to('.preloader-title-line span', {
          y: '0%',
          duration: 1,
          stagger: 0.08,
          ease: 'power4.out',
        }, '-=0.4')
        .to('.preloader-meta-line span', {
          y: '0%',
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
        }, '-=0.7')
        .to('.preloader-stat', {
          y: '0%',
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.55')
        .fromTo('.preloader-progress-fill', { scaleX: 0 }, { scaleX: 1, duration: 2.8, ease: 'power2.inOut' }, '-=0.3')
        .to(count, {
          value: 100,
          duration: 2.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            const el = document.querySelector('.preloader-percentage');
            if (el) el.textContent = `${Math.round(count.value)}`;
          },
        }, '<')
        .to('.preloader-eyebrow', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=2.2')
        .to('.preloader-copy', {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        }, '-=1.9')
        .to('.preloader-content', {
          y: -70,
          opacity: 0,
          duration: 0.8,
          ease: 'power4.in',
        }, '>-0.2')
        .to(containerRef.current, {
          y: '-100%',
          duration: 1.05,
          ease: 'power4.inOut',
        }, '-=0.3');
    }, containerRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#050507] text-white"
      style={{ height: '100dvh', willChange: 'transform' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,109,56,0.14),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(255,255,255,0.06),transparent_25%),linear-gradient(180deg,#050507_0%,#08080a_100%)]" />

      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="preloader-ring absolute h-[40vw] w-[40vw] max-h-[540px] max-w-[540px] rounded-full border border-brand-secondary/20"
        />
        <motion.div
          className="preloader-ring absolute h-[24vw] w-[24vw] max-h-[320px] max-w-[320px] rounded-full border border-white/10"
        />
      </div>

      <div className="preloader-content relative z-10 mx-auto flex h-full w-full max-w-screen-2xl flex-col justify-between px-6 py-8 md:px-16 md:py-12">
        <div className="flex items-start justify-between gap-8">
          <div className="space-y-2">
            <div className="overflow-hidden">
              <p className="preloader-eyebrow translate-y-6 opacity-0 font-typewriter text-[10px] uppercase tracking-[0.75em] text-white/35">
                TEDxAlMuntazirSchoolsYouth / 2026
              </p>
            </div>
            <div className="overflow-hidden">
              <p className="preloader-copy translate-y-6 opacity-0 font-editorial text-lg italic text-white/55">
                Smooth reveal, sharp type, and a little ceremonial movement.
              </p>
            </div>
          </div>
          <div className="hidden md:block overflow-hidden">
            <p className="preloader-meta-line font-typewriter text-[9px] uppercase tracking-[0.55em] text-white/25">
              <span className="block">PREPARING THE SCROLL JOURNEY</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 md:gap-8">
          <div className="grid gap-2 overflow-hidden">
            <h2 className="preloader-title-line font-title text-[15vw] md:text-[8vw] font-black uppercase leading-[0.78] tracking-tighter">
              <span className="block">Borrowed</span>
            </h2>
            <h2 className="preloader-title-line font-title text-[15vw] md:text-[8vw] font-black uppercase leading-[0.78] tracking-tighter text-brand-secondary">
              <span className="block">Time.</span>
            </h2>
          </div>

          <div className="max-w-2xl space-y-4">
            <div className="flex items-end justify-between gap-6">
              <span className="preloader-stat overflow-hidden font-typewriter text-[9px] uppercase tracking-[0.6em] text-white/25">
                <span className="block">LOADING THE EXPERIENCE</span>
              </span>
              <div className="flex items-baseline gap-2">
                <span className="preloader-percentage font-title text-5xl md:text-7xl font-black tabular-nums">0</span>
                <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-white/30">%</span>
              </div>
            </div>
            <div className="relative h-px w-full overflow-hidden bg-white/10">
              <motion.div className="preloader-progress-fill absolute inset-0 origin-left bg-brand-secondary" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="overflow-hidden">
            <p className="preloader-meta-line font-typewriter text-[9px] uppercase tracking-[0.45em] text-white/25">
              <span className="block">DYNAMIC / EDITORIAL / 3D</span>
            </p>
          </div>
          <div className="overflow-hidden">
            <p className="preloader-meta-line font-typewriter text-[9px] uppercase tracking-[0.45em] text-white/25">
              <span className="block">SCROLL WHEN READY</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
