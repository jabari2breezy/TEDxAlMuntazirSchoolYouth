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
      gsap.set('.preloader-percentage-container', { scale: 1, opacity: 1 });
      gsap.set('.preloader-bg', { scaleY: 1, transformOrigin: 'top' });

      // 2. Count to 100
      const count = { val: 0 };
      tl.to(count, {
        val: 100,
        duration: 3,
        ease: 'power3.inOut',
        onUpdate: function() {
          const el = document.querySelector('.preloader-percentage');
          if (el) el.textContent = Math.round(count.val).toString();
        }
      })
      
      // 3. The Morph / Scale up (Luke Baffait style)
      .to('.preloader-percentage-container', {
        scale: 30, // massive scale
        opacity: 0, // fade out while scaling to reveal hero
        duration: 1.5,
        ease: 'power4.inOut'
      }, "+=0.2")
      
      // Slide background up
      .to('.preloader-bg', {
        scaleY: 0,
        duration: 1.2,
        ease: 'power4.inOut'
      }, "-=1.0");

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
      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center pointer-events-none"
      style={{ height: '100dvh' }}
    >
      <div className="preloader-bg absolute inset-0 bg-[#050507] origin-top" />
      
      <div className="preloader-percentage-container relative z-10 flex items-baseline justify-center mix-blend-difference text-white">
        <span className="preloader-percentage font-title font-black text-[30vw] leading-none tracking-tighter">
          0
        </span>
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
