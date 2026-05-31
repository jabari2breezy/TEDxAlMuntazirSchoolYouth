import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const duration = 1800;
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
            containerRef.current.style.transition = 'opacity 0.5s ease-out, filter 0.5s ease-out';
            containerRef.current.style.opacity = '0';
            containerRef.current.style.filter = 'blur(4px)';
          }
          setTimeout(() => {
            onComplete();
            setIsMounted(false);
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
          }, 500);
        }, 150);
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
      {/* Subtle grid pattern — 4wide.jp inspired */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Center content — casadisolare.com inspired minimalism */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* TEDx mark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-[#e62b1e] font-solare text-5xl md:text-6xl font-black italic tracking-tighter">TED</span>
            <span className="text-[#e62b1e] font-solare text-3xl md:text-4xl font-black">x</span>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="font-solare font-bold text-lg md:text-xl tracking-[0.25em] text-white/90 uppercase">
            Al Muntazir
          </div>
          <div className="font-solare font-normal text-xs tracking-[0.4em] text-white/40 uppercase mt-2">
            Schools Youth
          </div>
        </motion.div>

        {/* Thin progress line */}
        <div className="w-32 md:w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-white/60"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Percentage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 font-typewriter text-xs text-white/25 tabular-nums"
        >
          {Math.round(progress * 100)}
        </motion.div>

        {/* Bottom label */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/10">
            [ BORROWED TIME // 2026 ]
          </span>
        </div>
      </div>
    </div>
  );
}
