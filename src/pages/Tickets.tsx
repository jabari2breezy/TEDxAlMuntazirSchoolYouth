import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Ticket as TicketIcon, Calendar, MapPin } from 'lucide-react';
import { TICKETS_URL } from '../constants';
import InteractiveBackground from '../components/InteractiveBackground';

const INCLUDED_ITEMS = [
  'Full access to all live speaker sessions',
  'Interactive workshop zones',
  'Premium networking breaks',
  'Official TEDxAlmuntazirSchoolYouth merch',
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
  const targetY = isMobile ? -150 : 0;
  
  const ticketX = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, targetX]);
  const ticketY = useTransform(scrollYProgress, [0, 0.2, 0.5], [50, -20, targetY]);

  // Section Opacities
  const section1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const section2Opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  const section4Opacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);

  // Background Colors
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ['#f3f3f4', '#050507', '#050507', '#000839']
  );

  const section2TextColor = '#ffffff';

  return (
    <div className="bg-brand-background">
      <div ref={containerRef} className="h-[400vh] relative">
        <motion.div 
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1200px]"
          style={{ backgroundColor: bgColor }}
        >
          {/* Decorative Background Elements */}
          <motion.div style={{ opacity: useTransform(scrollYProgress, [0.5, 0.6], [0, 1]) }} className="absolute inset-0 pointer-events-none z-0">
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
            className="relative z-20 w-full max-w-[340px] md:max-w-md mx-6 pointer-events-auto"
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
            {/* Section 1: Intro */}
            <motion.div 
              style={{ opacity: section1Opacity }}
              className="absolute inset-0 flex flex-col items-center justify-start pt-[15vh]"
            >
              <h1 className="text-6xl md:text-[8vw] font-title font-black tracking-tighter uppercase text-[#000839] leading-[0.85] text-center drop-shadow-sm">
                The Ultimate<br/><span className="italic font-editorial lowercase text-brand-secondary">Experience.</span>
              </h1>
              <p className="mt-6 font-typewriter text-xs uppercase tracking-[0.3em] text-[#000839]/50">Scroll to explore</p>
            </motion.div>

            {/* Section 2: What's Included */}
            <motion.div 
              style={{ opacity: section2Opacity, color: section2TextColor }}
              className="absolute inset-0 flex flex-col md:flex-row items-center justify-end px-6 md:px-24"
            >
              <div className="w-full md:w-[45%] lg:w-[40%] space-y-6 pt-[50vh] md:pt-0">
                <h3 className="font-title font-black text-4xl uppercase tracking-tighter">What's<br/>Included</h3>
                <ul className="space-y-4">
                  {INCLUDED_ITEMS.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-2 shrink-0" />
                      <span className="font-sans text-sm md:text-base font-medium opacity-80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Event Details removed entirely */}

            {/* Section 4: Final CTA */}
            <motion.div 
              style={{ opacity: section4Opacity }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
            >
              <div className="absolute inset-0 bg-[#000839]/80 backdrop-blur-md pointer-events-auto" />
              <div className="relative z-10 flex flex-col items-center gap-12 pointer-events-auto mt-[20vh] md:mt-0">
                <h2 className="text-5xl md:text-8xl font-title font-black tracking-tighter uppercase text-center drop-shadow-2xl text-white leading-[0.8]">
                  Don't Waste<br/>
                  <span className="italic font-editorial lowercase text-brand-secondary">Your Time.</span>
                </h2>
                <a 
                  href={TICKETS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-12 py-6 bg-white text-[#000839] rounded-full overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-brand-secondary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1]" />
                  <span className="relative z-10 font-typewriter text-sm uppercase tracking-[0.3em] font-bold group-hover:text-white transition-colors duration-500">
                    Secure Your Spot
                  </span>
                </a>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
