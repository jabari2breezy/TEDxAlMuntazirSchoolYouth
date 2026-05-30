import React, { useEffect, useRef, useState } from 'react';
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

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          setIsMounted(false);
          onComplete();
        }
      });

      // 1. Initial State
      gsap.set('.preloader-text-line span', { y: '100%' });
      gsap.set('.preloader-reveal-bg', { scaleY: 0 });

      // 2. Text Reveal (Inspired by Luke Baffait's smooth typography)
      tl.to('.preloader-text-line span', {
        y: '0%',
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1
      })
      
      // 3. Reveal Progress (Elegant 0-100)
      .fromTo('.preloader-progress-bar', 
        { scaleX: 0 },
        { scaleX: 1, duration: 2.5, ease: 'power2.inOut' },
        '-=0.8'
      )
      
      // 4. Update Counter
      const count = { val: 0 };
      tl.to(count, {
        val: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: function() {
          const el = document.querySelector('.preloader-percentage');
          if (el) el.textContent = Math.round(count.val).toString();
        }
      }, '<')

      // 5. Exit Animation: Cinematic Slide Up (Luke Baffait style)
      .to('.preloader-content', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.in'
      })
      .to(containerRef.current, {
        y: '-100%',
        duration: 1.2,
        ease: 'power4.inOut'
      }, '-=0.4');

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
      className="fixed inset-0 z-[9999] bg-[#050507] overflow-hidden flex flex-col items-center justify-center"
      style={{ height: '100dvh', willChange: 'transform' }}
    >
      <div className="preloader-content w-full max-w-screen-xl px-10 flex flex-col gap-8">
        {/* Cinematic Typography */}
        <div className="overflow-hidden">
          <h2 className="preloader-text-line font-title text-[8vw] md:text-[5vw] font-black uppercase leading-none tracking-tighter text-white">
            <span className="block">Borrowed</span>
          </h2>
        </div>
        <div className="overflow-hidden -mt-4 md:-mt-8">
          <h2 className="preloader-text-line font-title text-[8vw] md:text-[5vw] font-black uppercase leading-none tracking-tighter text-brand-secondary italic">
            <span className="block">Time.</span>
          </h2>
        </div>

        {/* Progress Section */}
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex justify-between items-end">
            <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-white/30">
              TEDxAlMuntazir
            </span>
            <div className="flex items-baseline gap-1">
              <span className="preloader-percentage font-title text-4xl md:text-6xl font-black text-white">0</span>
              <span className="font-typewriter text-xs text-white/30">%</span>
            </div>
          </div>
          <div className="relative w-full h-[1px] bg-white/10">
            <div className="preloader-progress-bar absolute top-0 left-0 h-full bg-brand-secondary origin-left w-full scale-x-0" />
          </div>
        </div>
      </div>

      {/* Background Decorative Layer */}
      <div className="absolute bottom-10 left-10 overflow-hidden">
        <p className="preloader-text-line font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/20">
          <span className="block">Dar Es Salaam / 2026</span>
        </p>
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
