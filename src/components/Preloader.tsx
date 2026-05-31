import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const duration = 2200;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.transition = 'opacity 0.6s ease-out, filter 0.6s ease-out';
            containerRef.current.style.opacity = '0';
            containerRef.current.style.filter = 'blur(8px)';
          }
          setTimeout(() => {
            onComplete();
            setIsMounted(false);
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
          }, 600);
        }, 200);
      }
    };

    requestAnimationFrame(tick);

    return () => {
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
      style={{ height: '100dvh' }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-[#e62b1e] font-sans font-black text-4xl md:text-5xl tracking-tighter">TED</span>
            <span className="text-[#e62b1e] font-sans font-black text-2xl md:text-3xl">x</span>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="font-sans font-bold text-lg md:text-xl tracking-[0.3em] text-white/90 uppercase">
            Al Muntazir
          </div>
          <div className="font-sans font-normal text-xs tracking-[0.5em] text-white/40 uppercase mt-2">
            Schools Youth
          </div>
        </motion.div>

        {/* Progress line */}
        <div className="w-48 md:w-64 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div
            ref={lineRef}
            className="absolute inset-y-0 left-0 bg-white/60"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Percentage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 font-typewriter text-sm text-white/30 tabular-nums"
        >
          {Math.round(progress * 100)}
        </motion.div>

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
