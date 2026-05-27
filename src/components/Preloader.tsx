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

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsMounted(false);
          onComplete();
        }
      });

      // 1. Counter animation
      tl.to(".loading-counter", {
        innerHTML: 100,
        duration: 2.5,
        ease: "power3.inOut",
        snap: { innerHTML: 1 },
        onUpdate: function() {
          const targets = this.targets();
          if (targets[0]) targets[0].innerHTML = Math.round(targets[0].innerHTML).toString().padStart(3, '0');
        }
      })
      // Fade out the counter and the lines
      .to(".preloader-ui", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power2.inOut"
      }, "+=0.2")
      
      // 2. The Reveal Mask expands revealing "BORROWED TIME"
      .to(".mask-layer", {
        clipPath: "circle(150% at 50% 50%)",
        duration: 1.8,
        ease: "power4.inOut"
      }, "-=0.4")
      
      // 3. Typography scales slightly for impact
      .fromTo(".hero-text-anim", 
        { scale: 0.85, opacity: 0, filter: "blur(10px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", stagger: 0.15 },
        "-=1.4"
      )

      // 4. The Exit: Slide the entire preloader UP
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut"
      }, "+=0.8");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#050507] overflow-hidden flex items-center justify-center pointer-events-auto will-change-transform"
    >
      {/* Background grain texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Center UI (Counter) */}
      <div className="preloader-ui absolute z-20 flex flex-col items-center justify-center gap-6">
        <div className="w-px h-12 bg-white/20" />
        <div className="flex items-baseline gap-2 text-white font-typewriter">
          <span className="text-sm opacity-50 tracking-[0.3em]">LOADING</span>
          <span className="loading-counter text-6xl md:text-8xl font-light tracking-tighter">000</span>
          <span className="text-sm opacity-50 tracking-[0.3em]">SYS</span>
        </div>
        <div className="w-px h-12 bg-white/20" />
      </div>

      {/* The Masking Layer containing the big typography */}
      <div className="mask-layer absolute inset-0 bg-[#000839] flex flex-col justify-center px-6 md:px-16" style={{ clipPath: "circle(0% at 50% 50%)" }}>
        {/* Subtle grid in background of the mask layer */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="hero-text-anim text-[16vw] md:text-[12vw] font-title font-black uppercase text-white leading-[0.85] tracking-tighter mix-blend-screen">
            BORROWED
          </h1>
          <h1 className="hero-text-anim text-[16vw] md:text-[12vw] font-title font-black uppercase text-[#e62b1e] leading-[0.85] tracking-tighter mix-blend-screen -mt-2 md:-mt-6">
            TIME
          </h1>
        </div>
      </div>
    </div>
  );
}
