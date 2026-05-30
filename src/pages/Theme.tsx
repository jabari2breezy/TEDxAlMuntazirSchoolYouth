import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { ArrowRight, Clock, Zap, Infinity, Share2 } from 'lucide-react';
import { TICKETS_URL } from '../constants';
import MaskReveal from '../components/MaskReveal';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export default function Theme() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="bg-[#050507] text-white overflow-x-hidden">
      {/* Hero Section (Everswap inspired) */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full bg-brand-secondary/5 blur-[120px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: LUXURY_EASE }}
          >
            <span className="font-typewriter text-[11px] uppercase tracking-[0.8em] text-brand-secondary font-bold">The Philosophy</span>
          </motion.div>
          
          <motion.h1 
            className="text-[15vw] md:text-[12vw] font-title font-black uppercase leading-[0.75] tracking-tighter"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: LUXURY_EASE }}
          >
            BORROWED <br/> <span className="text-brand-secondary italic font-editorial lowercase">Time.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-white/30">Scroll to enter the flow</p>
            <motion.div 
              className="w-px h-20 bg-gradient-to-b from-brand-secondary to-transparent"
              animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Concept: One Pool Every Function (Everswap style applied to Time) */}
      <section className="py-40 px-6 md:px-16 max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-8xl font-title font-black uppercase tracking-tighter leading-[0.85]">
                TIME AT <br/> <span className="text-brand-secondary">PEAK.</span>
              </h2>
              <p className="font-editorial text-2xl md:text-4xl italic text-white/60 leading-relaxed">
                Unifying the past, present, and future through a single-sided experience of existence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-brand-secondary/20 flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-transform">
                  <Clock size={24} />
                </div>
                <h3 className="text-2xl font-title font-bold uppercase tracking-tight">The Inheritors</h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">Navigating systems we didn't build, borrowing against a legacy we must now manage.</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-brand-secondary/20 flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-title font-bold uppercase tracking-tight">The Present</h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">Maximizing the value of 'now' before the liquidity of the moment evaporates.</p>
              </div>
            </div>
          </div>

          {/* Abstract Visual (Everswap style) */}
          <div className="relative aspect-square flex items-center justify-center">
            <motion.div 
              className="absolute inset-0 rounded-full border border-white/5"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-10 rounded-full border border-brand-secondary/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <Infinity size={80} className="text-brand-secondary" />
              <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-white/40">Universal Flow</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Clocks (Segmented Display) */}
      <section className="py-40 bg-white text-[#000839]">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16">
          <div className="mb-24 space-y-4">
            <span className="font-typewriter text-[11px] uppercase tracking-[0.6em] text-brand-secondary font-bold">System Architecture</span>
            <h2 className="text-5xl md:text-8xl font-title font-black uppercase tracking-tighter leading-none">
              THE <span className="italic font-editorial lowercase">Three</span> CLOCKS.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: '01', title: 'PAST', desc: 'Echoes of inherited systems and the weight of history.', color: 'bg-[#000839] text-white' },
              { id: '02', title: 'PRESENT', desc: 'The urgency of presence in a world of constant demand.', color: 'bg-brand-secondary text-white' },
              { id: '03', title: 'FUTURE', desc: 'Designing the legacy that we leave for those who follow.', color: 'bg-[#f7f4ee] text-[#000839]' }
            ].map((segment, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`${segment.color} p-12 rounded-[3rem] space-y-12 flex flex-col justify-between aspect-[4/5] shadow-2xl`}
              >
                <span className="font-title text-6xl font-black opacity-20">{segment.id}</span>
                <div className="space-y-6">
                  <h3 className="text-4xl md:text-5xl font-title font-black uppercase tracking-tighter">{segment.title}</h3>
                  <p className="font-editorial text-xl italic opacity-80 leading-relaxed">{segment.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA (Everswap style) */}
      <section className="py-60 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          className="absolute inset-0 z-0 opacity-30"
          style={{ y: useTransform(smoothProgress, [0.8, 1], [0, -100]) }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-brand-secondary/20 to-transparent blur-[150px]" />
        </div >

        <div className="relative z-10 space-y-12">
          <h2 className="text-6xl md:text-[10vw] font-title font-black uppercase tracking-tighter leading-[0.8]">
            JOIN THE <br/> <span className="text-brand-secondary">SUMMIT.</span>
          </h2>
          <p className="font-editorial text-2xl md:text-4xl italic text-white/50 max-w-3xl mx-auto">
            Stay close to the flow. The clock is ticking, but the opportunity is now.
          </p>
          <motion.a
            href={TICKETS_URL}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-6 bg-brand-secondary text-white px-12 md:px-20 py-8 rounded-full font-title font-black text-2xl uppercase tracking-widest shadow-[0_0_50px_rgba(0,109,56,0.3)] hover:shadow-[0_0_80px_rgba(0,109,56,0.5)] transition-all"
          >
            Secure Seat
            <ArrowRight size={32} />
          </motion.a>
        </div>

        {/* Floating Footer Meta */}
        <div className="absolute bottom-10 w-full flex justify-between px-10 opacity-20 font-typewriter text-[9px] uppercase tracking-[0.5em]">
          <span>Dar Es Salaam</span>
          <span>TEDxAlMuntazir 2026</span>
          <span>Borrowed Time</span>
        </div>
      </section>
    </div>
  );
}
