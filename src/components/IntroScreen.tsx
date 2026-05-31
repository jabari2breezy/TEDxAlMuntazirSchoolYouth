'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function IntroScreen() {
  const [phase, setPhase] = useState<'converge' | 'hold' | 'reveal'>('converge');
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 2200);
    const t2 = setTimeout(() => setPhase('reveal'), 3200);
    const t3 = setTimeout(() => navigate('/'), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigate]);

  const letters = 'TEDx YOUTH'.split('');

  return (
    <AnimatePresence>
      {phase !== 'reveal' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Converging letters */}
          <div className="relative flex items-center justify-center">
            {letters.map((char, i) => {
              const isSpace = char === ' ';
              const angle = (i / letters.length) * Math.PI * 2;
              const radius = phase === 'converge' ? 300 : 0;

              return (
                <motion.span
                  key={i}
                  initial={{
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    opacity: 0,
                    scale: 0.5,
                    rotate: Math.random() * 30 - 15,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    duration: 1.8,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block font-title font-black tracking-tighter ${
                    isSpace ? 'w-4 md:w-8' : ''
                  }`}
                  style={{
                    fontSize: 'clamp(3rem, 12vw, 10rem)',
                    color: i < 4 ? '#fff' : '#00ff88',
                    textShadow: i < 4
                      ? '0 0 40px rgba(255,255,255,0.3)'
                      : '0 0 40px rgba(0,255,136,0.4)',
                  }}
                >
                  {isSpace ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </div>

          {/* Bottom line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/30"
          >
            Entering the experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
