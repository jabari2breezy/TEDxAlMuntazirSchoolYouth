import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { Ticket as TicketIcon, Calendar, MapPin, ArrowUpRight, Zap, ShieldCheck, Star } from 'lucide-react';
import InteractiveBackground from '../components/InteractiveBackground';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

function GlisteningStars({ count = 80, scrollProgress }: { count?: number; scrollProgress?: any }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      parallaxSpeed: (Math.random() * 0.6 + 0.2),
    })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(s => (
        <StarDot key={s.id} s={s} scrollProgress={scrollProgress} />
      ))}
    </div>
  );
}

function StarDot({ s, scrollProgress }: { s: any; scrollProgress?: any }) {
  const parallaxY = scrollProgress
    ? useTransform(scrollProgress, [0, 1], [s.parallaxSpeed * 50, -s.parallaxSpeed * 50])
    : undefined;

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        left: `${s.x}%`,
        top: `${s.y}%`,
        width: s.size,
        height: s.size,
        opacity: 0,
        boxShadow: `0 0 ${s.size * 2}px ${s.size}px rgba(255,255,255,0.15)`,
        y: parallaxY,
        animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
      }}
    />
  );
}

const INCLUDED_ITEMS = [
  { text: 'Full access to all live speaker sessions', icon: Zap },
  { text: 'Interactive workshop zones', icon: Star },
  { text: 'Premium networking breaks', icon: ShieldCheck },
  { text: 'Official TEDxAlmuntazir merch', icon: Zap },
  { text: 'Curated lunch & refreshments', icon: Star }
];

export default function Tickets() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Ticket 3D Transforms
  // Phase 1 (0 - 0.2): 360 degree showcase rotation
  // Phase 2 (0.2 - 0.8): Settled at angle
  // Phase 3 (0.8 - 1.0): Snap flat to 0
  
  const rotateY = useTransform(scrollYProgress, 
    [0, 0.2, 0.3, 0.8, 0.9, 1], 
    [0, 360, 345, 345, 360, 360]
  );
  
  const rotateX = useTransform(scrollYProgress,
    [0, 0.2, 0.3, 0.8, 0.9, 1],
    [0, 0, 10, 10, 0, 0]
  );

  // Translate ticket
  // Phase 1: Center (0)
  // Phase 2: Shift Right (Desktop: 25vw, Mobile: 0) / Shift Up (Mobile: -25vh)
  // Phase 3: Center (0)
  const xMovementDesktop = useTransform(scrollYProgress,
    [0, 0.2, 0.3, 0.8, 0.9, 1],
    [0, 0, 250, 250, 0, 0] // pixels or vw
  );
  const yMovementMobile = useTransform(scrollYProgress,
    [0, 0.2, 0.3, 0.8, 0.9, 1],
    [0, 0, -250, -250, 0, 0]
  );

  const ticketX = isMobile ? 0 : xMovementDesktop;
  const ticketY = isMobile ? yMovementMobile : 0;

  // Scale ticket
  const ticketScale = useTransform(scrollYProgress,
    [0, 0.2, 0.3, 0.8, 0.9, 1],
    [1, 1, 0.8, 0.8, 1.2, 1.2] // massive scale at the end
  );

  // Content Opacity (Phase 2)
  const centerContentOpacity = useTransform(scrollYProgress,
    [0.25, 0.35, 0.75, 0.85],
    [0, 1, 1, 0]
  );
  
  const centerContentY = useTransform(scrollYProgress,
    [0.25, 0.35, 0.75, 0.85],
    [50, 0, 0, -50]
  );

  // Phase 3 text swap
  const [isPhase3, setIsPhase3] = useState(false);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setIsPhase3(v >= 0.88);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <div className="bg-[#050507] text-white">
      <div className="fixed inset-0 opacity-[0.12] pointer-events-none z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
      
      {/* 300vh scroll container for the 3 phases */}
      <div ref={containerRef} className="h-[400vh] relative">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1500px]">
          
          <motion.div className="absolute inset-0 z-0">
            <InteractiveBackground />
            <GlisteningStars count={100} scrollProgress={scrollYProgress} />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          >
            <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/50">Scroll to Explore</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-brand-secondary to-transparent" />
          </motion.div>

          {/* Center Details Content (Phase 2) */}
          <motion.div 
            style={{ opacity: centerContentOpacity, y: centerContentY }}
            className={`absolute z-10 w-full max-w-xl px-6 pointer-events-auto ${isMobile ? 'bottom-[5%] top-auto flex flex-col justify-end' : 'left-[10vw]'}`}
          >
            <div className="space-y-4 md:space-y-8">
              <div className="space-y-1 md:space-y-2">
                <span className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-brand-secondary">The Inclusion</span>
                <h3 className="text-3xl md:text-6xl font-title font-black uppercase tracking-tighter leading-none">Event Details</h3>
                <p className="font-editorial text-lg md:text-xl italic text-white/60">June 14, 2026. Al Muntazir Nursery Campus.</p>
              </div>
              <div className="space-y-2 md:space-y-4 bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl backdrop-blur-md">
                {INCLUDED_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 md:gap-4 group">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <item.icon size={12} className="text-brand-secondary" />
                    </div>
                    <span className="font-sans text-xs md:text-base text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-1 md:space-y-2 hidden md:block">
                <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary">Instructions</span>
                <p className="text-sm text-white/60 leading-relaxed font-typewriter">
                  Proceeding to checkout will redirect you to the Tukiio portal. Please have your M-Pesa or card details ready.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main 3D Ticket */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale: ticketScale,
              x: ticketX,
              y: ticketY,
              transformStyle: "preserve-3d"
            }}
            className="relative z-20 w-full max-w-[320px] md:max-w-[400px] pointer-events-auto group cursor-pointer"
            onClick={() => {
              if (isPhase3) {
                window.open('https://tukiio.com/event/tedxalmuntazirschoolsyouth', '_blank');
              }
            }}
          >
            <div className={`relative rounded-[2.5rem] overflow-hidden bg-[#f7f4ee] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-500 ${isPhase3 ? 'ring-4 ring-brand-secondary ring-offset-4 ring-offset-[#050507]' : ''}`}>
              
              {/* Ticket Top */}
              <div className="bg-[#000839] px-8 md:px-14 pt-12 md:pt-16 pb-14 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex-1">
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/30 block mb-3">
                      TEDxAlMuntazir
                    </span>
                    <h2 className="font-title font-black text-5xl md:text-6xl uppercase text-white tracking-tighter leading-[0.8]">
                      Borrowed<br/><span className="text-brand-secondary">Time</span>
                    </h2>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-widest text-white/20 block mb-1">Access</span>
                    <p className="font-title font-bold text-white text-base uppercase">Full Event</p>
                  </div>
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-widest text-white/20 block mb-1">Date</span>
                    <p className="font-title font-bold text-white text-base uppercase">14.06.26</p>
                  </div>
                </div>
              </div>

              {/* Perforated Divider */}
              <div className="bg-[#000839] relative h-8 flex items-center">
                <div className="absolute left-0 w-8 h-16 bg-[#050507] rounded-full -translate-x-1/2 z-10 shadow-inner" />
                <div className="flex-1 mx-8 border-t-[3px] border-dashed border-white/10" />
                <div className="absolute right-0 w-8 h-16 bg-[#050507] rounded-full translate-x-1/2 z-10 shadow-inner" />
              </div>

              {/* Ticket Bottom - Morphs to BUY NOW */}
              <div className={`bg-[#f7f4ee] px-8 py-10 md:py-12 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${isPhase3 ? 'bg-brand-secondary text-white' : 'text-[#000839]'}`}>
                <AnimatePresence mode="wait">
                  {!isPhase3 ? (
                    <motion.div 
                      key="price"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="font-typewriter text-[10px] uppercase tracking-widest opacity-40">Admission Fee</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-typewriter text-xs uppercase opacity-40">Tsh</span>
                        <span className="font-title font-black text-5xl tracking-tighter">30,000</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="buy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-4 py-2"
                    >
                      <span className="font-title font-black text-5xl uppercase tracking-widest text-white">
                        BUY NOW
                      </span>
                      <ArrowUpRight size={40} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
