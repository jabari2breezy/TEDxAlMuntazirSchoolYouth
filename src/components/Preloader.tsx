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

      // 1. Corner metadata fades in
      tl.fromTo('.preloader-meta',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      )

      // 2. Counter animates 0 → 100
      const count = { val: 0 };
      tl.to(count, {
        val: 100,
        duration: 2.2,
        ease: 'power3.inOut',
        onUpdate: function() {
          const el = document.querySelector('.loading-counter');
          if (el) el.textContent = String(Math.round(count.val)).padStart(3, '0');
        }
      }, '-=0.3')

      // 3. Top/bottom lines expand
      .fromTo('.preloader-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power3.inOut', stagger: 0.1 },
        '-=1.5'
      )

      // 4. Center text reveal — masked upward
      .fromTo('.preloader-title-word',
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.9, ease: [0.16, 1, 0.3, 1], stagger: 0.12 },
        '-=1.2'
      )

      // 5. Subtitle fades in
      .fromTo('.preloader-subtitle',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.5'
      )

      // 6. Hold for a beat
      .to({}, { duration: 0.6 })

      // 7. Everything fades out
      .to('.preloader-content', {
        opacity: 0,
        y: -30,
        duration: 0.7,
        ease: 'power3.inOut'
      })

      // 8. Container slides up
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1.0,
        ease: [0.76, 0, 0.24, 1]
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
      className="fixed inset-0 z-[9999] bg-[#050507] overflow-hidden flex items-center justify-center"
      style={{ height: '100dvh', willChange: 'transform' }}
    >
      {/* Corner metadata — jasminegunarto.com style */}
      <div className="preloader-meta absolute top-6 left-6 md:top-8 md:left-10 z-20 opacity-0">
        <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/25">
          TEDxAlMuntazirSchoolsYouth
        </span>
      </div>
      <div className="preloader-meta absolute top-6 right-6 md:top-8 md:right-10 z-20 opacity-0">
        <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/25">
          2026
        </span>
      </div>
      <div className="preloader-meta absolute bottom-6 left-6 md:bottom-8 md:left-10 z-20 opacity-0">
        <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/25">
          Dar Es Salaam, Tanzania
        </span>
      </div>
      <div className="preloader-meta absolute bottom-6 right-6 md:bottom-8 md:right-10 z-20 opacity-0">
        <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/25">
          Loading
        </span>
      </div>

      {/* Top line */}
      <div className="preloader-line absolute top-0 left-0 right-0 h-px bg-white/10 origin-left" />
      {/* Bottom line */}
      <div className="preloader-line absolute bottom-0 left-0 right-0 h-px bg-white/10 origin-right" />

      {/* Center content */}
      <div className="preloader-content relative z-10 flex flex-col items-center text-center px-6">
        {/* Counter */}
        <div className="flex items-baseline gap-1 mb-8">
          <span className="loading-counter font-title text-[12vw] md:text-[8vw] font-black text-white tracking-tighter leading-none">
            000
          </span>
          <span className="font-typewriter text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/30">
            %
          </span>
        </div>

        {/* Title — masked reveal */}
        <div className="overflow-hidden mb-3">
          <div className="preloader-title-word font-title text-[11vw] md:text-[7vw] font-black uppercase text-white leading-[0.85] tracking-tighter">
            Borrowed
          </div>
        </div>
        <div className="overflow-hidden mb-6">
          <div className="preloader-title-word font-title text-[11vw] md:text-[7vw] font-black uppercase text-brand-secondary leading-[0.85] tracking-tighter">
            Time
          </div>
        </div>

        {/* Subtitle */}
        <div className="preloader-subtitle opacity-0">
          <span className="font-editorial italic text-sm md:text-base text-white/40">
            Ideas worth holding onto
          </span>
        </div>
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
