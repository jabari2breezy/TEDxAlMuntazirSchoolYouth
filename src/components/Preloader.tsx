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
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      )

      // 2. Counter flickers in — rapid opacity flicker like jasminegunarto.com
      .fromTo('.loading-counter',
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.1, ease: 'steps(1)' }
      )
      .to('.loading-counter', { opacity: 0.3, duration: 0.05 })
      .to('.loading-counter', { opacity: 1, duration: 0.05 })
      .to('.loading-counter', { opacity: 0.5, duration: 0.05 })
      .to('.loading-counter', { opacity: 1, duration: 0.05 })
      .to('.loading-counter', { opacity: 0.2, duration: 0.05 })
      .to('.loading-counter', { opacity: 1, duration: 0.05 })

      // 3. Counter animates 0 → 100 — smooth, elegant buildup
      const count = { val: 0 };
      tl.to(count, {
        val: 100,
        duration: 2.4,
        ease: 'power2.inOut',
        onUpdate: function() {
          const el = document.querySelector('.loading-counter');
          if (el) el.textContent = String(Math.round(count.val)).padStart(3, '0');
        }
      }, '-=0.1')

      // 4. Top/bottom lines expand
      .fromTo('.preloader-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'power3.inOut', stagger: 0.08 },
        '-=1.8'
      )

      // 5. Hold for a beat
      .to({}, { duration: 0.6 })

      // 7. Everything fades out
      .to('.preloader-content', {
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut'
      })

      // 8. Container fades out — reveals home page hero text underneath
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      }, '-=0.2');

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
      {/* Corner metadata */}
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
        <div className="flex items-baseline gap-1">
          <span className="loading-counter font-title text-[14vw] md:text-[10vw] font-black text-white tracking-tighter leading-none">
            000
          </span>
          <span className="font-typewriter text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/30">
            %
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
