import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import ScrollHint from '../components/ScrollHint';
import { TICKETS_URL } from '../constants';
import MaskReveal from '../components/MaskReveal';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export default function Theme() {
  const topHalfControls = useAnimation();
  const bottomHalfControls = useAnimation();
  const manifestoControls = useAnimation();
  const [fractureComplete, setFractureComplete] = useState(false);

  useEffect(() => {
    const runSequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      topHalfControls.start({ 
        y: '-35vh', 
        transition: { duration: 2, ease: [0.85, 0, 0.15, 1] } 
      });
      await bottomHalfControls.start({ 
        y: '35vh', 
        transition: { duration: 2, ease: [0.85, 0, 0.15, 1] } 
      });

      setFractureComplete(true);

      await manifestoControls.start({ 
        opacity: 1, 
        scale: 1, 
        filter: "blur(0px)",
        transition: { duration: 1.5, ease: "easeOut" } 
      });
    };

    runSequence();
  }, [topHalfControls, bottomHalfControls, manifestoControls]);

  return (
    <div className="bg-brand-background min-h-screen text-brand-primary font-sans overflow-x-hidden">
      
      {/* THE FRACTURE SEQUENCE HERO */}
      <section className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden bg-[#EAEBE8]">
        {/* Grainy overlay */}
        <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] z-0 pointer-events-none" />
        
        {/* TOP HALF TEXT */}
        <motion.div 
          animate={topHalfControls}
          initial={{ y: 0 }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden z-20 pointer-events-none"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
        >
          <h1 className="text-[16vw] md:text-[14vw] font-title font-black uppercase leading-none tracking-tighter text-[#000839]">
            Borrowed<br/>Time.
          </h1>
        </motion.div>

        {/* BOTTOM HALF TEXT */}
        <motion.div 
          animate={bottomHalfControls}
          initial={{ y: 0 }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden z-20 pointer-events-none"
          style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}
        >
          <h1 className="text-[16vw] md:text-[14vw] font-title font-black uppercase leading-none tracking-tighter text-[#000839]">
            Borrowed<br/>Time.
          </h1>
        </motion.div>

        {/* GLOWING CRACK (Reveals during fracture) */}
        <motion.div
          animate={manifestoControls}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 bg-[#EAEBE8]/80 backdrop-blur-sm"
        >
          <span className="font-typewriter text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#006d38] mb-6 border border-[#006d38]/30 px-4 py-1 rounded-full bg-[#006d38]/10">
            The Philosophy
          </span>
          <p className="font-editorial text-3xl md:text-5xl lg:text-6xl max-w-5xl text-center text-[#000839] italic leading-tight">
            "None of us choose our arrival and departure in this world. Between those two moments lies everything."
          </p>
        </motion.div>

        <ScrollHint
          show={fractureComplete}
          target="#theme-content"
          label="Scroll to explore"
          className="text-[#000839]"
          placementClassName="bottom-8 md:bottom-12"
        />
      </section>

      <section
        id="theme-content"
        className="py-32 px-4 md:px-12 max-w-screen-2xl mx-auto space-y-24 md:space-y-40 scroll-mt-8"
      >
        
        {/* Intro Block */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.85, ease: LUXURY_EASE }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-block px-6 py-2 bg-brand-surface rounded-full border border-brand-outline">
            <span className="font-typewriter text-[10px] uppercase tracking-widest font-bold">What It Means</span>
          </div>
          <div className="overflow-hidden">
            <MaskReveal>
              <h2 className="text-4xl md:text-6xl font-title font-black uppercase tracking-tighter leading-[0.9]">
                We Are Living On <br/> Borrowed Time
              </h2>
            </MaskReveal>
          </div>
          <MaskReveal delay={0.1}>
            <p className="font-editorial text-xl md:text-3xl text-brand-primary/60 italic leading-relaxed">
              Simply put: the world we live in today was built by people who came before us. We inherited their systems, their environment, and their mistakes. Now, the clock is ticking for us to decide what we do next.
            </p>
          </MaskReveal>
        </motion.div>

        {/* Heavy Offset Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.85, ease: LUXURY_EASE }}
            className="bg-brand-surface rounded-[2.5rem] p-10 md:p-16 border border-brand-outline relative overflow-hidden group hover:bg-white hover:text-black transition-colors duration-500"
          >
            <div className="flex justify-between items-start mb-20 md:mb-32">
              <span className="text-7xl md:text-9xl font-title font-black opacity-[0.03] group-hover:opacity-10 transition-opacity absolute top-10 left-10">01</span>
              <div className="relative z-10 px-5 py-2 bg-brand-secondary/20 text-brand-secondary rounded-full font-typewriter text-[10px] font-bold uppercase group-hover:bg-black group-hover:text-white transition-colors">
                The Past
              </div>
            </div>
            <h3 className="text-3xl md:text-5xl font-title font-bold uppercase mb-6 tracking-tighter leading-none relative z-10">
              Inherited Systems
            </h3>
            <p className="font-editorial text-lg md:text-2xl opacity-70 group-hover:opacity-100 transition-opacity relative z-10 leading-relaxed">
              We did not choose to be born into an era of rapid AI development or a warming planet. But we did inherit these realities. This segment breaks down how we navigate a world built by past generations, and whether we should maintain or completely rebuild these legacy systems.
            </p>
          </motion.div>

          {/* Card 2 (Offset lower) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.85, ease: LUXURY_EASE, delay: 0.15 }}
            className="bg-[#006d38] text-white rounded-[2.5rem] p-10 md:p-16 border border-brand-outline relative overflow-hidden md:mt-32 group hover:bg-[#000839] hover:text-white transition-colors duration-500"
          >
            <div className="flex justify-between items-start mb-20 md:mb-32">
              <span className="text-7xl md:text-9xl font-title font-black opacity-[0.1] group-hover:opacity-20 transition-opacity absolute top-10 left-10">02</span>
              <div className="relative z-10 px-5 py-2 bg-white/20 text-white rounded-full font-typewriter text-[10px] font-bold uppercase group-hover:bg-white group-hover:text-black transition-colors">
                The Present
              </div>
            </div>
            <h3 className="text-3xl md:text-5xl font-title font-bold uppercase mb-6 tracking-tighter leading-none relative z-10 text-white">
              The Value of Now
            </h3>
            <p className="font-editorial text-lg md:text-2xl opacity-90 group-hover:opacity-100 transition-opacity relative z-10 leading-relaxed text-white">
              Society tells us that "time is money," treating every hour as something that must be productive. We challenge this relentless demand for efficiency. We will explore how true value isn't found in productivity, but in presence, connection, and experiencing the current moment.
            </p>
          </motion.div>

          {/* Card 3 (Full width) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.85, ease: LUXURY_EASE, delay: 0.1 }}
            className="md:col-span-2 bg-gradient-to-br from-brand-surface to-[#0a0c10] rounded-[2.5rem] p-10 md:p-20 border border-brand-outline relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-16 md:mb-24">
              <span className="text-7xl md:text-9xl font-title font-black opacity-[0.02] absolute top-10 left-10">03</span>
              <div className="relative z-10 px-5 py-2 bg-brand-primary/10 text-brand-primary rounded-full font-typewriter text-[10px] font-bold uppercase">
                The Future
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-end relative z-10">
              <h3 className="text-4xl md:text-7xl font-title font-bold uppercase tracking-tighter leading-none">
                The Legacy <br className="hidden md:block" /> We Leave
              </h3>
              <p className="font-editorial text-xl md:text-3xl opacity-70 leading-relaxed">
                When our time is up, what remains? Every small, seemingly insignificant decision we make today is actively shaping the world that the next generation will inherit. The future is simply the consequence of today's actions.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Massive CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.85, ease: LUXURY_EASE }}
          className="bg-brand-primary text-brand-background rounded-[3rem] p-12 md:p-32 text-center relative overflow-hidden"
        >
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] z-0 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-6xl md:text-[8rem] font-title font-black uppercase tracking-tighter leading-[0.8] mb-12">
              The Clock <br/> Is Ticking
            </h2>
            <p className="font-editorial text-2xl md:text-4xl italic opacity-70 mb-16 max-w-3xl mx-auto leading-relaxed">
              Join us to rethink the systems we've inherited, and actively design the ones we leave behind.
            </p>
            <a 
              href={TICKETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-6 bg-brand-secondary text-brand-background px-12 md:px-16 py-6 md:py-8 rounded-full font-title font-bold text-xl md:text-3xl uppercase tracking-widest hover:bg-black hover:text-white transition-all hover:scale-105 active:scale-95 group shadow-2xl"
            >
              Secure Your Seat 
              <ArrowRight size={36} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </motion.div>

      </section>
    </div>
  );
}
