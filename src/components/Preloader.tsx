import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lukeRef = useRef<HTMLDivElement>(null);
  const baffaitRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const tPanelRedRef = useRef<HTMLDivElement>(null);
  const tPanelDarkRef = useRef<HTMLDivElement>(null);

  // Helper to split text into animated characters
  const renderChars = (text: string, className: string = '') => {
    return [...text].map((char, index) => (
      <span key={index} className="inline-block overflow-hidden vertical-align-top">
        <span className={`char-span inline-block ${className}`} style={{ willChange: 'transform' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      </span>
    ));
  };

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    // Lock page scrolling initially
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';

    const pContent = contentRef.current;
    const pLogo = logoRef.current!;
    const pLuke = lukeRef.current!;
    const pBaffait = baffaitRef.current!;
    const pDot = dotRef.current!;
    const tPanelRed = tPanelRedRef.current!;
    const tPanelDark = tPanelDarkRef.current!;

    // Precise calculations to place words absolutely relative to each other
    const layoutNames = () => {
      const fs = parseFloat(getComputedStyle(pBaffait).fontSize);
      if (!fs) return;
      const baselineOffset = -0.02; // relative em for nice baseline alignment

      const logoW = pLogo.offsetWidth;
      const lukeW = pLuke.offsetWidth;
      const gapPx = fs * 0.12; // gap size

      // Place "EDx" next to "T"
      pLuke.style.left = `${logoW / fs}em`;
      pLuke.style.top = `${baselineOffset}em`;

      // Place " AlMuntazir" next to "EDx"
      const baffaitLeftPx = logoW + lukeW + gapPx;
      pBaffait.style.left = `${baffaitLeftPx / fs}em`;
      pBaffait.style.top = `${baselineOffset}em`;

      // Place "." next to " AlMuntazir"
      const dotLeftPx = baffaitLeftPx + pBaffait.offsetWidth;
      pDot.style.left = `${dotLeftPx / fs}em`;
      pDot.style.top = `${baselineOffset}em`;
    };

    const getCharGap = () => {
      return parseFloat(getComputedStyle(pBaffait).fontSize) * 0.12;
    };

    const getTotalWidth = () => {
      return pLogo.offsetWidth + pLuke.offsetWidth + getCharGap() + pBaffait.offsetWidth + pDot.offsetWidth;
    };

    // Calculate centering offset so only the first letter "T" is exactly centered on screen at start
    const alignLogoCentered = () => {
      layoutNames();
      const totalW = getTotalWidth();
      const logoW = pLogo.offsetWidth;
      const startX = -(totalW / 2 - logoW / 2);
      gsap.set(pContent, { x: startX, y: 0 });
    };

    // Run initial alignment
    alignLogoCentered();

    // Re-align on resize
    const handleResize = () => {
      alignLogoCentered();
    };
    window.addEventListener('resize', handleResize);

    // Initial setups
    gsap.set([pLogo, pLuke, pBaffait, pDot], { opacity: 1 });
    gsap.set('.char-span', { yPercent: 110 });
    gsap.set(pDot, { opacity: 0 });
    gsap.set([pContent, tPanelRed, tPanelDark], { willChange: 'transform' });

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Unlock scrolling
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          setIsMounted(false);
          onComplete();
        }
      });

      // 1. Stagger letters up (Cinematic Typography Reveal)
      tl.to('.char-span', {
        yPercent: 0,
        duration: 0.8,
        ease: 'power4.out',
        stagger: { each: 0.03, from: 'center' }
      })

      // 2. Reveal dot
      .to(pDot, {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      }, '-=0.2')

      // 3. Scale down and slide to bottom of screen (Docking Transition)
      .add(() => {
        const isMobile = window.innerWidth <= 768;
        const pad = isMobile ? 24 : 64;
        const currentW = getTotalWidth();
        const viewportW = window.innerWidth;
        const targetW = viewportW - pad * 2;
        const scale = targetW / currentW;

        const vh = window.innerHeight;
        const bottomPad = isMobile ? Math.max(vh * 0.12, 80) : 80;
        
        const rect = pContent.getBoundingClientRect();
        const curCenterY = rect.top + pContent.offsetHeight / 2;
        const targetCenterY = vh - bottomPad - (pContent.offsetHeight * scale / 2);
        const deltaY = targetCenterY - curCenterY;

        // Animate content scaling down and sliding to bottom
        gsap.to(pContent, {
          scale: scale,
          y: `+=${deltaY}`,
          duration: 1.0,
          ease: 'power3.inOut'
        });

        // Simultaneously slide up dark transition panel to cover viewport
        gsap.to(tPanelDark, {
          y: '0%',
          duration: 0.8,
          ease: 'power3.inOut'
        });

        // Slide up red transition panel slightly offset
        gsap.to(tPanelRed, {
          y: '0%',
          duration: 0.8,
          ease: 'power3.inOut',
          delay: 0.15
        });
      }, '+=0.4')

      // 4. Wipe Out (Wipe reveal of the main site)
      .to({}, { duration: 1.1 }) // Wait for panels to settle
      .set(containerRef.current, { background: 'transparent' }) // make preloader wrapper see-through
      .to(tPanelRed, {
        y: '-100%',
        duration: 0.8,
        ease: 'power3.inOut'
      })
      .to(tPanelDark, {
        y: '-100%',
        duration: 0.8,
        ease: 'power3.inOut'
      }, '-=0.65');

    }, containerRef);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
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
      style={{ height: '100vh', width: '100vw', willChange: 'transform, background-color' }}
    >
      {/* Cinematic Logo/Typography Layer */}
      <div className="name-layer fixed inset-0 z-[10005] flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          ref={contentRef}
          className="preloader-content flex items-baseline relative transform-origin-center"
        >
          <div
            ref={logoRef}
            className="font-title text-[9vw] md:text-[6vw] font-black uppercase leading-none tracking-tighter text-white"
          >
            {renderChars("T")}
          </div>
          <div
            ref={lukeRef}
            className="font-title text-[9vw] md:text-[6vw] font-black uppercase leading-none tracking-tighter text-white absolute whitespace-nowrap"
          >
            {renderChars("EDx")}
          </div>
          <div
            ref={baffaitRef}
            className="font-editorial text-[9vw] md:text-[6vw] font-medium leading-none tracking-tighter text-brand-secondary italic absolute whitespace-nowrap"
          >
            {renderChars(" AlMuntazir")}
          </div>
          <div
            ref={dotRef}
            className="font-editorial text-[9vw] md:text-[6vw] font-black leading-none text-brand-secondary absolute"
          >
            {renderChars(".")}
          </div>
        </div>
      </div>

      {/* Screen-Wipe Transition Panels */}
      <div className="transition-panel fixed inset-0 z-[10002] pointer-events-none">
        <div
          ref={tPanelDarkRef}
          className="absolute inset-0 bg-[#000839] translate-y-full will-change-transform"
        />
        <div
          ref={tPanelRedRef}
          className="absolute inset-0 bg-[#e62b1e] translate-y-full will-change-transform"
        />
      </div>

      {/* Film Grain Texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[10008]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
