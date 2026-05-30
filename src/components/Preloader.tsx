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

    // Hide the actual home text initially
    gsap.set('.home-hero-tedx, .home-hero-almuntazir, .home-hero-suffix', { opacity: 0 });

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          
          // Reveal the actual home text
          gsap.set('.home-hero-tedx, .home-hero-almuntazir, .home-hero-suffix', { opacity: 1 });
          
          setIsMounted(false);
          onComplete();
        }
      });

      // 1. Initial State: Centered Lockup
      gsap.set('.preloader-tedx, .preloader-almuntazir', { 
        xPercent: -50, 
        yPercent: -50,
        top: '50%',
        left: '50%',
        position: 'absolute'
      });
      // Offset them so they sit next to each other dead center
      gsap.set('.preloader-tedx', { x: -140 });
      gsap.set('.preloader-almuntazir', { x: 120 });

      // 2. Count to 100
      const count = { val: 0 };
      tl.to(count, {
        val: 100,
        duration: 3,
        ease: 'linear', // subtle monospaced tick-clock
        onUpdate: function() {
          const el = document.querySelector('.preloader-counter');
          if (el) el.textContent = Math.round(count.val).toString().padStart(3, '0');
        }
      })
      
      // 3. Phase 2: The Character Breakdown & Dispersal
      // Calculate target coordinates from the invisible home text
      .add(() => {
        const targetTedx = document.querySelector('.home-hero-tedx') as HTMLElement;
        const targetAlmuntazir = document.querySelector('.home-hero-almuntazir') as HTMLElement;
        
        if (targetTedx && targetAlmuntazir) {
          const rect1 = targetTedx.getBoundingClientRect();
          const rect2 = targetAlmuntazir.getBoundingClientRect();
          
          gsap.to('.preloader-tedx', {
            top: rect1.top + rect1.height / 2,
            left: rect1.left + rect1.width / 2,
            x: 0,
            scale: 0.6,
            letterSpacing: '0.05em',
            duration: 1.2,
            ease: 'power4.out' // aggressive ease-out cubic-bezier
          });
          
          gsap.to('.preloader-almuntazir', {
            top: rect2.top + rect2.height / 2,
            left: rect2.left + rect2.width / 2,
            x: 0,
            scale: 0.6,
            letterSpacing: '0.05em',
            duration: 1.2,
            ease: 'power4.out'
          });
        }
      })
      
      // Wait for dispersal
      .to({}, { duration: 1.2 })
      
      // 4. Phase 3: The Homepage Anchor (Backdrop vanishes)
      .to('.preloader-bg', {
        yPercent: 100, // slides down like a curtain
        duration: 0.8,
        ease: 'power3.inOut'
      })
      .to('.preloader-tedx, .preloader-almuntazir, .preloader-counter', {
        opacity: 0,
        duration: 0.2
      }, "-=0.4");

    }, containerRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      gsap.set('.home-hero-tedx, .home-hero-almuntazir, .home-hero-suffix', { opacity: 1 });
    };
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
      style={{ height: '100dvh' }}
    >
      <div className="preloader-bg absolute inset-0 bg-black" />
      
      {/* Monolithic Lockup Text */}
      <div className="absolute inset-0 z-10 text-white font-title font-black uppercase tracking-tighter leading-none text-7xl md:text-8xl flex items-center justify-center whitespace-nowrap mix-blend-difference">
        <span className="preloader-tedx inline-block">TEDX</span>
        <span className="preloader-almuntazir inline-block">ALMUNTAZIR</span>
      </div>

      {/* Subtle Counter in bottom corner */}
      <div className="absolute bottom-8 right-8 z-10 text-white/50 font-typewriter text-sm tracking-widest mix-blend-difference">
        [<span className="preloader-counter">000</span>]
      </div>
    </div>
  );
}
