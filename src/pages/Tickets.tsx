import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Ticket as TicketIcon, Calendar, MapPin, ArrowUpRight, Zap, ShieldCheck, Star } from 'lucide-react';
import { TICKETS_URL } from '../constants';
import InteractiveBackground from '../components/InteractiveBackground';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

/* Glistening Stars — randomised positions, subtle twinkle, parallax on scroll */
function GlisteningStars({ count = 80, scrollProgress }: { count?: number; scrollProgress?: any }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      parallaxSpeed: (Math.random() * 0.6 + 0.2), // 0.2–0.8x scroll speed
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

function StarDot({ s, scrollProgress }: { s: { id: number; x: number; y: number; size: number; delay: number; duration: number; parallaxSpeed: number }; scrollProgress?: any }) {
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 25;
      const moveY = (clientY - window.innerHeight / 2) / 25;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ticket 3D Transforms
  const ticketRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -10]);
  const ticketRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 0, 15]);
  const ticketScale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [0.85, 1.1, 1, 0.9]);
  
  const ticketZ = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Section Opacities
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  
  const detailsOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const detailsX = useTransform(scrollYProgress, [0.3, 0.5], [50, 0]);

  return (
    <div className="bg-[#050507] text-white">
      {/* Grain texture overlay */}
      <div className="fixed inset-0 opacity-[0.12] pointer-events-none z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
      
      <div ref={containerRef} className="h-[250vh] relative">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1500px]">
          
          {/* Background Ambiance */}
          <motion.div className="absolute inset-0 z-0">
            <InteractiveBackground />
            <GlisteningStars count={100} scrollProgress={scrollYProgress} />
          </motion.div>

          {/* Floating Header (Larevoltosa style) */}
          <motion.div 
            style={{ opacity: headerOpacity, y: headerY }}
            className="absolute top-[15vh] text-center z-10"
          >
            <span className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary mb-4 block">Limited Release</span>
            <h1 className="text-6xl md:text-[10vw] font-title font-black uppercase tracking-tighter leading-none">
              THE <span className="italic font-editorial lowercase text-brand-secondary">Ticket.</span>
            </h1>
          </motion.div>

          {/* Main 3D Ticket (Oryzo/Larevoltosa style) */}
          <motion.div
            style={{
              rotateX: ticketRotateX,
              rotateY: ticketRotateY,
              scale: ticketScale,
              z: ticketZ,
              x: springX,
              y: springY,
              transformStyle: "preserve-3d"
            }}
            className="relative z-20 w-full max-w-[340px] md:max-w-lg pointer-events-auto group"
          >
            {/* Realistic 3D Ticket Shadow */}
            <div className="absolute -inset-10 bg-black/40 blur-[80px] rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative rounded-[2.5rem] overflow-hidden bg-[#f7f4ee] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10">
              {/* Ticket Top: Branding */}
              <div className="bg-[#000839] px-8 md:px-14 pt-12 md:pt-16 pb-14 md:pb-20 relative overflow-hidden">
                {/* Holographic Shimmer Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex-1">
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/30 block mb-3">
                      TEDxAlMuntazirSchoolsYouth
                    </span>
                    <h2 className="font-title font-black text-5xl md:text-7xl uppercase text-white tracking-tighter leading-[0.8]">
                      Borrowed<br/><span className="text-brand-secondary">Time</span>
                    </h2>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <TicketIcon size={24} className="text-brand-secondary" />
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8 relative z-10">
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-widest text-white/20 block mb-2">Access Level</span>
                    <p className="font-title font-bold text-white text-lg tracking-tight uppercase">Full Experience</p>
                  </div>
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-widest text-white/20 block mb-2">Location</span>
                    <p className="font-title font-bold text-white text-lg tracking-tight uppercase">Upanga, TZ</p>
                  </div>
                </div>
              </div>

              {/* Perforated Divider (Realistic) */}
              <div className="bg-[#000839] relative h-8 flex items-center">
                <div className="absolute left-0 w-8 h-16 bg-[#050507] rounded-full -translate-x-1/2 z-10 shadow-inner" />
                <div className="flex-1 mx-8 border-t-[3px] border-dashed border-white/10" />
                <div className="absolute right-0 w-8 h-16 bg-[#050507] rounded-full translate-x-1/2 z-10 shadow-inner" />
              </div>

              {/* Ticket Bottom: Price & CTA */}
              <div className="bg-[#f7f4ee] px-8 md:px-14 py-10 md:py-14 flex flex-col items-center gap-8 relative overflow-hidden">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-typewriter text-[10px] uppercase tracking-widest text-[#000839]/30">Admission Fee</span>
                  <div className="flex items-baseline gap-2 text-[#000839]">
                    <span className="font-typewriter text-xs uppercase opacity-40">Tsh</span>
                    <span className="font-title font-black text-6xl md:text-7xl tracking-tighter">30,000</span>
                  </div>
                </div>

                <motion.a
                  href="https://tukiio.com/event/tedxalmuntazirschoolsyouth"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, backgroundColor: '#000839', color: '#fff' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-6 bg-brand-secondary text-white rounded-2xl font-title font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl transition-all duration-300"
                >
                  Secure Seat
                  <ArrowUpRight size={24} />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Floating Details (Oryzo style) */}
          <motion.div 
            style={{ opacity: detailsOpacity, x: detailsX }}
            className="absolute right-[5vw] md:right-[10vw] top-1/2 -translate-y-1/2 w-full max-w-sm hidden lg:block z-30"
          >
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary">The Inclusion</span>
                <h3 className="text-4xl font-title font-black uppercase tracking-tighter leading-none">What's Inside</h3>
              </div>
              <div className="space-y-6">
                {INCLUDED_ITEMS.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-secondary/20 group-hover:border-brand-secondary transition-colors">
                      <item.icon size={18} className="text-brand-secondary" />
                    </div>
                    <span className="font-editorial text-xl italic text-white/70 group-hover:text-white transition-colors">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Features Grid (Oryzo style) */}
      <section className="py-32 px-6 md:px-16 bg-white text-[#000839]">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-3 gap-12 md:gap-24">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#000839] flex items-center justify-center text-white">
              <Calendar size={24} />
            </div>
            <h4 className="text-3xl font-title font-black uppercase tracking-tighter">The Date</h4>
            <p className="font-editorial text-xl italic opacity-60">June 14, 2026. A full day of unfolding ideas and borrowed moments.</p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#000839] flex items-center justify-center text-white">
              <MapPin size={24} />
            </div>
            <h4 className="text-3xl font-title font-black uppercase tracking-tighter">The Venue</h4>
            <p className="font-editorial text-xl italic opacity-60">Al Muntazir Nursery Campus, Upanga. Transformed into a cinematic stage.</p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#000839] flex items-center justify-center text-white">
              <Zap size={24} />
            </div>
            <h4 className="text-3xl font-title font-black uppercase tracking-tighter">The Vibe</h4>
            <p className="font-editorial text-xl italic opacity-60">High-end networking, student voices, and an award-winning atmosphere.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 text-center relative overflow-hidden bg-[#050507]">
        <motion.div 
          className="absolute inset-0 z-0 opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <InteractiveBackground />
        </motion.div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-[8vw] font-title font-black uppercase tracking-tighter leading-[0.8] mb-12">
            DON'T WAIT FOR <br/> <span className="text-brand-secondary italic font-editorial lowercase">someday.</span>
          </h2>
          <motion.a
            href="https://tukiio.com/event/tedxalmuntazirschoolsyouth"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-6 bg-white text-[#000839] px-12 md:px-20 py-8 rounded-full font-title font-black text-2xl uppercase tracking-widest shadow-2xl hover:bg-brand-secondary hover:text-white transition-all"
          >
            Buy Ticket Now
            <ArrowUpRight size={32} />
          </motion.a>
        </div>
      </section>
    </div>
  );
}
