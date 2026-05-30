import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { ArrowRight, Clock, Zap, Infinity as InfinityIcon, ShieldCheck, Star, Sparkles } from 'lucide-react';
import { TICKETS_URL } from '../constants';
import InteractiveBackground from '../components/InteractiveBackground';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export default function Theme() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  // Scroll translations for Everswap-style parallax elements
  const ringRotate1 = useTransform(smoothProgress, [0, 1], [0, 360]);
  const ringRotate2 = useTransform(smoothProgress, [0, 1], [0, -360]);
  const logoScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.15, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      const { clientX, clientY } = e;
      const xPct = (clientX / window.innerWidth) * 100;
      const yPct = (clientY / window.innerHeight) * 100;
      gsap.to(spotlightRef.current, {
        background: `radial-gradient(circle 450px at ${xPct}% ${yPct}%, rgba(0, 109, 56, 0.12), transparent 80%)`,
        duration: 0.8,
        ease: 'power2.out'
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#050507] text-[#ECEBE8] overflow-x-hidden min-h-screen relative font-sans">
      
      {/* Everswap-style interactive spotlight overlay */}
      <div 
        ref={spotlightRef}
        className="fixed inset-0 pointer-events-none z-[1] opacity-75"
        style={{
          background: 'radial-gradient(circle 450px at 50% 50%, rgba(0, 109, 56, 0.08), transparent 80%)'
        }}
      />

      {/* Hero Section (Everswap inspired) */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden z-10">
        
        {/* Floating background graphic rings */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
          <motion.div 
            style={{ rotate: ringRotate1 }}
            className="absolute w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full border border-dashed border-white/5"
          />
          <motion.div 
            style={{ rotate: ringRotate2 }}
            className="absolute w-[60vw] h-[60vw] md:w-[35vw] md:h-[35vw] rounded-full border border-white/5"
          />
        </div>

        <div className="relative z-10 text-center space-y-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: LUXURY_EASE }}
            className="flex items-center justify-center gap-3"
          >
            <Sparkles size={12} className="text-brand-secondary animate-pulse" />
            <span className="font-typewriter text-[10px] md:text-[11px] uppercase tracking-[0.8em] text-brand-secondary font-bold">
              The Philosophy
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-[14vw] md:text-[10vw] font-title font-black uppercase leading-[0.75] tracking-tighter text-white select-none"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: LUXURY_EASE }}
          >
            BORROWED <br /> 
            <span className="text-brand-secondary italic font-editorial lowercase leading-none">Time.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="flex flex-col items-center gap-6 mt-12"
          >
            <p className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/30 animate-bounce">
              Scroll to enter the flow
            </p>
            <div className="relative w-px h-24 bg-white/10 overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 w-full h-1/2 bg-brand-secondary"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Concept: One Pool Every Function (Time at Peak) */}
      <section className="py-32 px-6 md:px-16 max-w-screen-2xl mx-auto z-10 relative border-t border-white/5 bg-[#08080a]">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-brand-secondary font-bold block">
                Peak Consciousness
              </span>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-title font-black uppercase tracking-tighter leading-[0.8]">
                TIME AT <br /> 
                <span className="text-brand-secondary">PEAK.</span>
              </h2>
              <p className="font-editorial text-2xl md:text-4xl italic text-white/60 leading-relaxed font-light">
                Unifying the past, present, and future through a single-sided experience of existence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2rem] bg-white/3 border border-white/5 space-y-4 hover:bg-white/5 hover:border-white/10 transition-all duration-500 group">
                <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary group-hover:scale-110 group-hover:bg-brand-secondary/20 transition-all duration-500">
                  <Clock size={22} />
                </div>
                <h3 className="text-xl font-title font-black uppercase tracking-tight text-white">The Inheritors</h3>
                <p className="font-sans text-xs md:text-sm text-white/50 leading-relaxed">
                  Navigating complex social systems we didn't build, borrowing against a heavy legacy we must now manage.
                </p>
              </div>

              <div className="p-8 rounded-[2rem] bg-white/3 border border-white/5 space-y-4 hover:bg-white/5 hover:border-white/10 transition-all duration-500 group">
                <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary group-hover:scale-110 group-hover:bg-brand-secondary/20 transition-all duration-500">
                  <Zap size={22} />
                </div>
                <h3 className="text-xl font-title font-black uppercase tracking-tight text-white">The Present</h3>
                <p className="font-sans text-xs md:text-sm text-white/50 leading-relaxed">
                  Maximizing the value and weight of 'now' before the liquidity of the moment evaporates forever.
                </p>
              </div>
            </div>
          </div>

          {/* Everswap-style WebGL/SVG Rotating Graphic Centerpiece */}
          <div className="relative aspect-square flex items-center justify-center max-w-md mx-auto w-full">
            <div className="absolute inset-0 border border-white/5 rounded-full pointer-events-none" />
            <motion.div 
              style={{ rotate: ringRotate1 }}
              className="absolute inset-10 rounded-full border border-dashed border-brand-secondary/20 flex items-center justify-center pointer-events-none"
            >
              <div className="w-4 h-4 rounded-full bg-brand-secondary/40 absolute -top-2 animate-ping" />
            </motion.div>
            
            <motion.div 
              style={{ rotate: ringRotate2 }}
              className="absolute inset-20 rounded-full border border-white/5 pointer-events-none"
            />
            
            <motion.div 
              style={{ scale: logoScale }}
              className="relative z-10 flex flex-col items-center gap-4 bg-white/3 border border-white/10 p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl hover:border-brand-secondary/40 transition-colors duration-700"
            >
              <InfinityIcon size={64} className="text-brand-secondary animate-pulse" />
              <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/40 text-center">
                Universal Flow
              </span>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Section 2: The Three Clocks (Premium Segmented Architecture) */}
      <section className="py-32 bg-[#faf8f4] text-[#000839] z-10 relative rounded-[3rem] md:rounded-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] border-y border-white/5">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16">
          <div className="mb-20 space-y-4">
            <span className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary font-bold block">
              System Architecture
            </span>
            <h2 className="text-5xl md:text-8xl font-title font-black uppercase tracking-tighter leading-none">
              THE <span className="italic font-editorial lowercase text-brand-secondary">Three</span> CLOCKS.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: '01', title: 'PAST', desc: 'Echoes of inherited systems, ancestral footprints, and the structural weight of history.', color: 'bg-[#000839] text-white' },
              { id: '02', title: 'PRESENT', desc: 'The immediate urgency of presence, confrontation of attention, and the friction of now.', color: 'bg-[#006d38] text-white' },
              { id: '03', title: 'FUTURE', desc: 'Designing the ecological, ethical, and creative legacy we leave for those who come after.', color: 'bg-[#ebe7df] text-[#000839] border border-[#000839]/5' }
            ].map((segment, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: LUXURY_EASE }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`${segment.color} p-12 rounded-[2.5rem] md:rounded-[3rem] space-y-16 flex flex-col justify-between aspect-[4/5] shadow-2xl transition-all duration-500`}
              >
                <span className="font-title text-6xl font-black opacity-15">{segment.id}</span>
                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl font-title font-black uppercase tracking-tighter">{segment.title}</h3>
                  <p className="font-editorial text-lg md:text-xl italic opacity-85 leading-relaxed">{segment.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Final Call to Action (Everswap unified Launch Summit) */}
      <section className="py-48 md:py-60 relative overflow-hidden flex flex-col items-center justify-center text-center px-6 z-10 bg-[#050507]">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-brand-secondary/30 to-transparent blur-[160px]" />
        </div>

        <div className="relative z-10 space-y-12 max-w-4xl">
          <h2 className="text-6xl md:text-[8vw] font-title font-black uppercase tracking-tighter leading-[0.8] text-white">
            JOIN THE <br /> 
            <span className="text-brand-secondary">SUMMIT.</span>
          </h2>
          <p className="font-editorial text-xl md:text-3xl italic text-white/50 max-w-2xl mx-auto leading-relaxed">
            Stay close to the flow. The clock is ticking, but the opportunity is now.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <motion.a
              href={TICKETS_URL}
              className="inline-flex items-center gap-6 bg-brand-secondary text-white px-14 py-7 md:px-20 md:py-8 rounded-full font-title font-black text-xl md:text-2xl uppercase tracking-widest shadow-[0_0_50px_rgba(0,109,56,0.3)] hover:shadow-[0_0_80px_rgba(0,109,56,0.6)] hover:bg-[#008746] transition-all duration-300"
            >
              Secure Seat
              <ArrowRight size={28} className="text-white animate-pulse" />
            </motion.a>
          </motion.div>
        </div>

        {/* Floating Footer Meta */}
        <div className="absolute bottom-10 w-full hidden md:flex justify-between px-16 opacity-20 font-typewriter text-[9px] uppercase tracking-[0.6em]">
          <span>Dar Es Salaam</span>
          <span>TEDxAlMuntazir 2026</span>
          <span>Borrowed Time</span>
        </div>
      </section>

      {/* Floating dot pattern background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #EBEBEB 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
}
