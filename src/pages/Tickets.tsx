import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Ticket as TicketIcon, Calendar, MapPin, ArrowUpRight, Zap, ShieldCheck, Star, ChevronDown } from 'lucide-react';
import { GradientBackground } from '@/components/ui/gradient-background';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

const INCLUDED_ITEMS = [
  { text: 'Full access to all live speaker sessions', icon: Zap },
  { text: 'Interactive workshop zones', icon: Star },
  { text: 'Premium networking breaks', icon: ShieldCheck },
  { text: 'Official TEDx Al Muntazir merch', icon: Zap },
  { text: 'Curated lunch & refreshments', icon: Star }
];

function TickSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="inline-block shrink-0 text-brand-secondary" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CurveSVG() {
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="inline-block shrink-0 text-white/30">
      <path d="M0 12 Q12 0 24 12 Q36 24 48 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function DiamondSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block shrink-0 text-brand-secondary/60">
      <path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" />
    </svg>
  );
}

function DotsSVG() {
  return (
    <svg width="40" height="12" viewBox="0 0 40 12" fill="none" className="inline-block shrink-0 text-white/20">
      <circle cx="6" cy="6" r="2" fill="currentColor" />
      <circle cx="20" cy="6" r="2" fill="currentColor" />
      <circle cx="34" cy="6" r="2" fill="currentColor" />
    </svg>
  );
}

function TickerTape() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!trackRef.current || !sectionRef.current) return;

      const track = trackRef.current;
      const width = track.scrollWidth - window.innerWidth;

      gsap.fromTo(track,
        { x: window.innerWidth * 0.3 },
        {
          x: -width - window.innerWidth * 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        }
      );
    });

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-dvh overflow-hidden flex items-center">
        <div ref={trackRef} className="flex items-center gap-6 md:gap-10 whitespace-nowrap will-change-transform px-4">
          <span className="text-[7vw] md:text-[5vw] font-title font-black uppercase tracking-tighter text-white/90 leading-none">
            are you ready for
          </span>
          <CurveSVG />
          <span className="text-[7vw] md:text-[5vw] font-title font-black uppercase tracking-tighter text-brand-secondary leading-none">
            TEDxALMUNTAZIR
          </span>
          <DotsSVG />
          <span className="text-[7vw] md:text-[5vw] font-title font-black uppercase tracking-tighter text-white/90 leading-none">
            SCHOOLS
          </span>
          <span className="text-[7vw] md:text-[5vw] font-title font-black uppercase tracking-tighter text-white/40 leading-none">
            YOUTH
          </span>
          <span className="text-[7vw] md:text-[5vw] font-title font-black uppercase tracking-tighter text-brand-secondary leading-none">
            ?
          </span>
          <DiamondSVG />
          <span className="text-[7vw] md:text-[5vw] font-title font-black uppercase tracking-tighter text-white/90 leading-none">
            buy your ticket
          </span>
          <CurveSVG />
          <span className="text-[7vw] md:text-[5vw] font-title font-black uppercase tracking-tighter text-brand-secondary leading-none">
            NOW
          </span>
          <span className="text-[7vw] md:text-[5vw] font-title font-black uppercase tracking-tighter text-white/90 leading-none">
            !!
          </span>
          <TickSVG />
        </div>
      </div>
    </section>
  );
}

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

  const ticketY = useTransform(scrollYProgress,
    [0, 0.15, 0.25, 0.35],
    [0, 120, 120, 0]
  );
  const rotateY = useTransform(scrollYProgress,
    [0, 0.25, 0.35, 0.65, 0.7, 1],
    [0, 0, 0, 360, 360, 360]
  );
  const rotateX = useTransform(scrollYProgress,
    [0, 0.25, 0.35, 0.65, 0.7, 1],
    [0, 0, 0, 0, 0, 0]
  );
  const scale = useTransform(scrollYProgress,
    [0, 0.25, 0.35, 0.65, 0.7, 0.8, 0.9, 1],
    [0.9, 1, 1, 1, 1, 1.05, 0.98, 1]
  );

  const detailsOpacity = useTransform(scrollYProgress,
    [0, 0.1, 0.25, 0.35],
    [0, 1, 1, 0.3]
  );

  const [isPhase3, setIsPhase3] = useState(false);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setIsPhase3(v >= 0.7);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <div className="text-white">
      <GradientBackground
        className="fixed inset-0 -z-10"
        gradients={[
          "linear-gradient(135deg, #0a4d2e 0%, #0d2b4e 100%)",
          "linear-gradient(135deg, #000000 0%, #0d2b4e 50%, #0a6b3c 100%)",
          "linear-gradient(135deg, #0a6b3c 0%, #000000 100%)",
          "linear-gradient(135deg, #0d2b4e 0%, #0a4d2e 50%, #000000 100%)",
          "linear-gradient(135deg, #000000 0%, #0a6b3c 50%, #0d2b4e 100%)",
        ]}
        overlay
        overlayOpacity={0.4}
      />

      <div className="fixed inset-0 opacity-[0.12] pointer-events-none z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />

      <TickerTape />

      <div ref={containerRef} className="h-[400vh] relative">
        <div
          className="sticky top-0 w-full flex items-center justify-center overflow-hidden"
          style={{ height: '100dvh', perspective: '1500px' }}
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-[60vw] h-[60vh] rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, rgba(0,109,56,0.4) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
            <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, rgba(0,8,57,0.5) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />
          </div>

          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-white/60">Scroll to Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={24} className="text-brand-secondary" />
            </motion.div>
          </motion.div>

          {isMobile && (
            <>
              <motion.div
                style={{ opacity: detailsOpacity }}
                className="absolute z-10 top-[3vh] left-0 right-0 px-5 pointer-events-auto"
              >
                <div className="space-y-3">
                  <div>
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-brand-secondary">The Inclusion</span>
                    <h3 className="text-3xl font-title font-black uppercase tracking-tighter leading-none mt-1">Event Details</h3>
                    <p className="font-editorial text-base italic text-white/60 mt-1">June 14, 2026. Al Muntazir Nursery Campus.</p>
                  </div>
                  <div className="space-y-2 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                    {INCLUDED_ITEMS.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <item.icon size={11} className="text-brand-secondary" />
                        </div>
                        <span className="font-sans text-xs text-white/80">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  scale,
                  y: ticketY,
                  transformStyle: "preserve-3d"
                }}
                className="absolute z-20 w-full max-w-[280px] bottom-[5vh] pointer-events-auto group cursor-pointer"
                onClick={() => { if (isPhase3) window.open('https://tukiio.com/event/tedxalmuntazirschoolsyouth', '_blank'); }}
              >
                <TicketCard isPhase3={isPhase3} />
              </motion.div>
            </>
          )}

          {!isMobile && (
            <>
              <motion.div
                style={{ opacity: detailsOpacity }}
                className="absolute z-10 w-full max-w-xl px-6 left-[8vw] pointer-events-auto"
              >
                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary">The Inclusion</span>
                    <h3 className="text-6xl font-title font-black uppercase tracking-tighter leading-none">Event Details</h3>
                    <p className="font-editorial text-xl italic text-white/60">June 14, 2026. Al Muntazir Nursery Campus.</p>
                  </div>
                  <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                    {INCLUDED_ITEMS.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <item.icon size={14} className="text-brand-secondary" />
                        </div>
                        <span className="font-sans text-base text-white/80">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary">Instructions</span>
                    <p className="text-sm text-white/60 leading-relaxed font-typewriter">
                      Proceeding to checkout will redirect you to the Tukiio portal. Please have your M-Pesa or card details ready.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  scale,
                  y: ticketY,
                  transformStyle: "preserve-3d"
                }}
                className="relative z-20 w-full max-w-[400px] pointer-events-auto group cursor-pointer"
                onClick={() => { if (isPhase3) window.open('https://tukiio.com/event/tedxalmuntazirschoolsyouth', '_blank'); }}
              >
                <TicketCard isPhase3={isPhase3} />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketCard({ isPhase3 }: { isPhase3: boolean }) {
  return (
    <div className={`relative rounded-[2.5rem] overflow-hidden bg-[#f7f4ee] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-500 ${isPhase3 ? 'ring-4 ring-brand-secondary ring-offset-4 ring-offset-[#050507]' : ''}`}>
      <div className="bg-[#000839] px-8 md:px-14 pt-10 md:pt-16 pb-12 md:pb-14 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div className="flex-1">
            <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/30 block mb-3">
              TEDx Al Muntazir
            </span>
            <h2 className="font-title font-black text-4xl md:text-6xl uppercase text-white tracking-tighter leading-[0.8]">
              Borrowed<br/><span className="text-brand-secondary">Time</span>
            </h2>
          </div>
        </div>
        <div className="mt-6 md:mt-8 grid grid-cols-2 gap-4 relative z-10">
          <div>
            <span className="font-typewriter text-[8px] uppercase tracking-widest text-white/20 block mb-1">Access</span>
            <p className="font-title font-bold text-white text-sm md:text-base uppercase">Full Event</p>
          </div>
          <div>
            <span className="font-typewriter text-[8px] uppercase tracking-widest text-white/20 block mb-1">Date</span>
            <p className="font-title font-bold text-white text-sm md:text-base uppercase">14.06.26</p>
          </div>
        </div>
      </div>
      <div className="bg-[#000839] relative h-8 flex items-center">
        <div className="absolute left-0 w-8 h-16 bg-[#050507] rounded-full -translate-x-1/2 z-10 shadow-inner" />
        <div className="flex-1 mx-8 border-t-[3px] border-dashed border-white/10" />
        <div className="absolute right-0 w-8 h-16 bg-[#050507] rounded-full translate-x-1/2 z-10 shadow-inner" />
      </div>
      <div className={`bg-[#f7f4ee] px-8 py-8 md:py-12 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${isPhase3 ? 'bg-brand-secondary text-white' : 'text-[#000839]'}`}>
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
                <span className="font-title font-black text-4xl md:text-5xl tracking-tighter">30,000</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="buy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 py-2"
            >
              <span className="font-title font-black text-4xl md:text-5xl uppercase tracking-widest text-white">
                BUY NOW
              </span>
              <ArrowUpRight size={36} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
