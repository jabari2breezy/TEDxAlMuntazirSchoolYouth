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

    // Hide actual UI text initially
    gsap.set('.home-hero-almuntazir, .home-hero-suffix, #nav-logo-tedx', { opacity: 0 });
    // Keep .home-hero-tedx hidden entirely, since Navbar takes over
    gsap.set('.home-hero-tedx', { display: 'none' });

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          
          // Reveal the actual UI text
          gsap.set('.home-hero-almuntazir, .home-hero-suffix, #nav-logo-tedx', { opacity: 1 });
          
          setIsMounted(false);
          onComplete();
        }
      });

      // 1. Initial State: Centered Stacked Lockup
      // [ LINE 1 ] -> TEDX
      // [ LINE 2 ] -> ALMUNTAZIR
      gsap.set('.preloader-tedx', { 
        position: 'absolute',
        top: '40%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
      });
      gsap.set('.preloader-almuntazir', { 
        position: 'absolute',
        top: '60%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
      });

      // 2. Count to 100
      const count = { val: 0 };
      tl.to(count, {
        val: 100,
        duration: 3,
        ease: 'linear',
        onUpdate: function() {
          const el = document.querySelector('.preloader-counter');
          if (el) el.textContent = Math.round(count.val).toString().padStart(2, '0');
        }
      })
      
      // 3. Phase 2: Elastic Snap (Triggered at 100%)
      .add(() => {
        // Fade the counter
        gsap.to('.preloader-counter-container', { opacity: 0, duration: 0.3 });

        const targetNavLogo = document.getElementById('nav-logo-tedx');
        const targetHeroAlmuntazir = document.querySelector('.home-hero-almuntazir') as HTMLElement;
        
        if (targetNavLogo && targetHeroAlmuntazir) {
          const navRect = targetNavLogo.getBoundingClientRect();
          const heroRect = targetHeroAlmuntazir.getBoundingClientRect();
          
          // TEDX flies to top-left corner
          gsap.to('.preloader-tedx', {
            top: navRect.top + navRect.height / 2,
            left: navRect.left + navRect.width / 2,
            scale: 0.25, // Scale down heavily for Navbar
            letterSpacing: '0em',
            duration: 1.2,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
          });
          
          // ALMUNTAZIR flies to center and track-stretches
          gsap.to('.preloader-almuntazir', {
            top: heroRect.top + heroRect.height / 2,
            left: heroRect.left + heroRect.width / 2,
            scale: 0.8, // Adjust to hero size
            letterSpacing: '0.02em', // Stretches as it lands
            duration: 1.2,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
          });
        }
      })
      
      // Wait for flight
      .to({}, { duration: 1.2 })
      
      // 4. Phase 3: Ghost Reveal
      .to('.preloader-bg', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      })
      .to('.preloader-tedx, .preloader-almuntazir', {
        opacity: 0,
        duration: 0.1
      }, "-=0.2");

    }, containerRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      gsap.set('.home-hero-almuntazir, .home-hero-suffix, #nav-logo-tedx', { opacity: 1 });
      gsap.set('.home-hero-tedx', { display: 'none' });
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
      
      {/* Absolute Dark Mode Typography */}
      <div className="absolute inset-0 z-10 text-white font-title font-black uppercase tracking-tighter leading-none text-7xl md:text-[14vw] flex items-center justify-center whitespace-nowrap mix-blend-difference">
        <span className="preloader-tedx inline-block origin-center text-[#E02229]">TEDX</span>
        <span className="preloader-almuntazir inline-block origin-center">ALMUNTAZIR</span>
      </div>

      {/* Elite Monospaced Counter */}
      <div className="preloader-counter-container absolute bottom-[40%] left-1/2 -translate-x-1/2 z-10 text-white/40 font-typewriter text-[10px] uppercase tracking-[0.5em] mix-blend-difference text-center">
        [ SYSTEM INDEX // <span className="preloader-counter text-white">00</span>% ]
      </div>
    </div>
  );
}
