import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Ticket as TicketIcon, Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { TICKETS_URL } from '../constants';
import InteractiveBackground from '../components/InteractiveBackground';

const INCLUDED_ITEMS = [
  'Full access to all live speaker sessions',
  'Interactive workshop zones',
  'Premium networking breaks',
  'Official TEDxAlmuntazirSchoolsYouth merch',
  'Curated lunch & refreshments experience'
];

export default function Tickets() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Ticket 3D Transforms (Stops at 0.5)
  const ticketRotateX = useTransform(scrollYProgress, [0, 0.2, 0.5], [15, -10, 0]);
  const ticketRotateY = useTransform(scrollYProgress, [0, 0.2, 0.5], [-15, 15, 0]);
  const ticketScale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 1.1, 1, 1, 0.9]);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const targetX = isMobile ? 0 : -250;
  const targetY = isMobile ? -140 : 0;
  
  const ticketX = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, targetX]);
  const ticketY = useTransform(scrollYProgress, [0, 0.2, 0.5], [50, -20, targetY]);

  // Section Opacities
  // section1 must hit 0 well before ticket settles (at 0.5)
  const section1Opacity = useTransform(scrollYProgress, [0, 0.07, 0.14, 1], [1, 1, 0, 0]);
  const section1Y = useTransform(scrollYProgress, [0, 0.14], [0, -80]);
  const section1PointerEvents = useTransform(scrollYProgress, [0, 0.07], ['auto', 'none']);
  const section2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.95], [0, 1, 1]);

  // Background Colors
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ['#f3f3f4', '#050507', '#050507', '#050507']
  );

  return (
    <div className="bg-[#050507]">
      {/* Scroll-hijacked 3D ticket experience */}
      <div ref={containerRef} className="h-[300vh] relative">
        <motion.div 
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1200px]"
          style={{ backgroundColor: bgColor }}
        >
          {/* Decorative Background Elements */}
          <motion.div style={{ opacity: useTransform(scrollYProgress, [0.4, 0.5], [0, 1]) }} className="absolute inset-0 pointer-events-none z-0">
            <InteractiveBackground />
          </motion.div>

          {/* The Main Ticket Product (Center Stage) */}
          <motion.div
            style={{
              x: ticketX,
              rotateX: ticketRotateX,
              rotateY: ticketRotateY,
              scale: ticketScale,
              y: ticketY,
              transformStyle: "preserve-3d"
            }}
            className="relative z-20 w-full max-w-[320px] md:max-w-md mx-6 pointer-events-auto"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_32px_128px_rgba(0,8,57,0.3)] bg-white">
              {/* Top navy section */}
              <div className="bg-[#000839] px-6 md:px-12 pt-10 md:pt-12 pb-12 md:pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, transparent 70%)' }} />
                <div className="flex items-start justify-between mb-8 md:mb-12 gap-4 relative z-10">
                  <div className="flex-1 min-w-0">
                    <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-widest md:tracking-[0.4em] text-white/40 block mb-2 truncate">
                      TEDxAlMuntazirSchoolsYouth
                    </span>
                    <h2 className="font-title font-black text-4xl md:text-5xl uppercase text-white tracking-tighter leading-none break-words">
                      Borrowed<br/>Time
                    </h2>
                  </div>
                  <TicketIcon size={32} className="text-[#e62b1e] shrink-0 mt-1 md:w-10 md:h-10" />
                </div>

                <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-widest text-white/40 block mb-1">Date</span>
                    <p className="font-sans font-bold text-white text-sm">March 2026</p>
                  </div>
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-widest text-white/40 block mb-1">Location</span>
                    <p className="font-sans font-bold text-white text-sm">Al Muntazir Nursery</p>
                  </div>
                </div>
              </div>

              {/* Perforated divider */}
              <div className="bg-[#000839] relative flex items-center">
                <div className="absolute left-0 w-6 h-12 bg-white rounded-r-full -translate-x-1 shadow-inner" />
                <div className="flex-1 mx-6 border-t-2 border-dashed border-white/20" />
                <div className="absolute right-0 w-6 h-12 bg-white rounded-l-full translate-x-1 shadow-inner" />
              </div>

              {/* Bottom section */}
              <div className="bg-white px-6 md:px-12 py-8 flex flex-col items-center">
                <div className="flex items-end gap-2 text-[#000839]">
                  <span className="font-typewriter text-[10px] uppercase tracking-widest opacity-40 pb-2">Tsh</span>
                  <span className="font-title font-black text-5xl tracking-tighter">30,000</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* OVERLAYS (Floating Content Sections) */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {/* Section 1: Intro — fades out + slides up early */}
            <motion.div 
              style={{ opacity: section1Opacity, y: section1Y, pointerEvents: section1PointerEvents }}
              className="absolute inset-0 flex flex-col items-center justify-start pt-[15vh]"
            >
              <h1 className="text-5xl md:text-[8vw] font-title font-black tracking-tighter uppercase text-[#000839] leading-[0.85] text-center drop-shadow-sm">
                The Ultimate<br/><span className="italic font-editorial lowercase text-brand-secondary">Experience.</span>
              </h1>
              <p className="mt-6 font-typewriter text-xs uppercase tracking-[0.3em] text-[#000839]/50">Scroll to explore</p>
            </motion.div>

            {/* Section 2: What's Included */}
            <motion.div 
              style={{ opacity: section2Opacity }}
              className="absolute inset-x-0 bottom-6 md:bottom-auto md:right-24 md:left-auto md:top-1/2 md:-translate-y-1/2 flex flex-col items-center md:items-start px-6 md:px-0 z-30 pointer-events-none"
            >
              <div className="w-full max-w-[320px] md:max-w-md space-y-4 md:space-y-6 text-white pointer-events-auto bg-black/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-6 md:p-0 rounded-2xl border border-white/10 md:border-none shadow-lg md:shadow-none">
                <h3 className="font-title font-black text-2xl md:text-5xl uppercase tracking-tighter leading-none text-center md:text-left text-white">
                  What's<br className="hidden md:block"/><span className="text-brand-secondary md:text-white"> Included</span>
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {INCLUDED_ITEMS.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e62b1e] mt-2 shrink-0 animate-pulse" />
                      <span className="font-sans text-xs md:text-base font-medium text-white/90 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Static CTA Section (Directly above the footer and 100% visible) */}
      <section className="relative min-h-[80vh] bg-[#050507] flex flex-col items-center justify-center px-6 py-24 overflow-hidden border-t border-white/5 z-20">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-brand-secondary/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="space-y-4"
          >
            <span className="font-typewriter text-xs md:text-sm uppercase tracking-[0.4em] text-brand-secondary">TEDxAlmuntazirSchoolsYouth</span>
            <h2 className="text-5xl md:text-8xl font-title font-black tracking-tighter uppercase text-white leading-[0.85] drop-shadow-2xl">
              Don't Waste<br/>
              <span className="italic font-editorial lowercase text-[#e62b1e]">Your Time.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-md font-sans text-sm md:text-base text-white/80 leading-relaxed"
          >
            Be part of the defining youth conference. Engage with powerful voices, explore fresh ideas, and secure your place in history.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="w-full flex justify-center"
          >
            <a 
              href="https://tukiio.com/event/tedxalmuntazirschoolsyouth"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-4 px-10 md:px-14 py-5 md:py-6 bg-[#e62b1e] text-white rounded-full overflow-hidden shadow-[0_0_50px_rgba(230,43,30,0.3)] hover:shadow-[0_0_80px_rgba(230,43,30,0.5)] transition-all duration-500 hover:scale-105 active:scale-98"
            >
              {/* Liquid overlay sliding up on hover */}
              <div className="absolute inset-0 bg-[#000839] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1]" />
              
              <span className="relative z-10 font-typewriter text-xs md:text-sm uppercase tracking-[0.25em] font-black transition-colors duration-500 group-hover:text-white">
                BUY TICKETS ON TUKIIO
              </span>
              <ArrowUpRight size={18} className="relative z-10 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 text-white shrink-0" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

