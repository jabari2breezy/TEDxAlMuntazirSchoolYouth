import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
import FloatingBackground from '../components/FloatingBackground';
import FluidBackground from '../components/FluidBackground';
import Countdown from '../components/Countdown';
import PrecisionButton from '../components/PrecisionButton';
import { TICKETS_URL, SOCIALS } from '../constants';

const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const transition = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const titleVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.1, 
      delay: 0
    }
  }
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

function TiltCard({ children, className = "" }: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 60, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 60, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        const xPct = Math.max(-1, Math.min(1, e.gamma / 30));
        const yPct = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
        x.set(xPct * 0.5);
        y.set(yPct * 0.5);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [x, y]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const width = rect.width;
    const height = rect.height;
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

interface EventStatus {
  status: 'upcoming' | 'live';
  eventDate: string;
  daysRemaining: number;
  secondsRemaining: number;
}

interface TicketStatus {
  remaining: number;
  total: number;
  status: string;
}

interface Update {
  id: string;
  title: string;
  date: string;
  content: string;
}

function ParallaxIcon({ icon: Icon, speed, left, top, delay = 0, size = 120 }: {
  icon: any, speed: number, left: string, top: string, delay?: number, size?: number
}) {
  if (isMobile) return null;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * 600]);
  return (
    <motion.div style={{ y, left, top, position: 'absolute', willChange: 'transform' }}
      className="pointer-events-none text-white/20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.03 }}
        transition={{ duration: 1, delay }}>
        <Icon size={size} strokeWidth={0.5} />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eventStatus, setEventStatus] = useState<EventStatus | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = isMobile
    ? scrollYProgress
    : useSpring(scrollYProgress, { stiffness: 30, damping: 25 });

  const heroY = isMobile ? useMotionValue(0) : useTransform(smoothProgress, [0, 0.3], [0, 30]);
  const liquidY = isMobile ? useMotionValue('0%') : useTransform(smoothProgress, [0, 1], ['0%', '15%']);
  const heroSlideY = isMobile ? useMotionValue(0) : useTransform(smoothProgress, [0, 0.3], [0, -100]);
  const hourglassBottom = isMobile ? useMotionValue('0%') : useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    fetch('/api/event-status')
      .then(res => res.json())
      .then(setEventStatus);
    
    fetch('/api/updates')
      .then(res => res.json())
      .then(setUpdates);
  }, []);

  const hapticTick = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const lastDragPos = useRef(0);
  const handleDrag = (_: any, info: any) => {
    const threshold = 60;
    if (Math.abs(info.point.x - lastDragPos.current) > threshold) {
      hapticTick();
      lastDragPos.current = info.point.x;
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="relative pt-4 bg-[#08080a] text-[#EBEBEB]"
      ref={containerRef}
    >
      {/* High-End Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-secondary z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Tiny Background Blur Layer */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none backdrop-blur-[1px]"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [0, 1]) }}
      />
      {/* Universal Floating Background */}
      <FloatingBackground />

      {/* Hero Section */}
      <motion.div
        className="min-h-screen flex flex-col relative overflow-hidden bg-[#050507] text-white"
        initial={{ opacity: 0, scale: 1.06, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        <div className="absolute inset-0 z-0 bg-[#08080a]">
          <FluidBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/90 via-[#050507]/50 to-[#050507]" />
        </div>
        
        {/* Large Decorative "X" Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05] select-none">
          <span className="text-[100vw] font-title font-black text-white leading-none">X</span>
        </div>

        <div className="flex-1 w-full max-w-screen-2xl mx-auto px-6 md:px-16 pt-40 pb-20 relative z-10 flex flex-col justify-center items-center text-center">
          <motion.div
            variants={titleVariants}
            className="max-w-7xl mb-12 flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="sr-only">TEDx Al Muntazir Schools Youth 2026</h1>
            <div className="flex flex-col items-center gap-1 md:gap-2 w-full mix-blend-difference">
              <div className="flex flex-wrap justify-center items-center">
<span className="font-['Helvetica'] text-[16vw] md:text-[14vw] font-bold italic tracking-tighter text-[#e62b1e] leading-none">TED</span>
<span className="font-['Helvetica'] text-[16vw] md:text-[14vw] font-bold italic tracking-tighter text-white leading-none">x</span>
                <span className="font-solare text-[16vw] md:text-[14vw] font-black tracking-tighter text-brand-secondary leading-none ml-[0.15em]">AL MUNTAZIR</span>
              </div>
              <span className="font-solare text-[10vw] md:text-[8vw] font-black tracking-tighter text-white leading-none mt-2">
                SCHOOLS YOUTH
              </span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.35, y: 0 }}
                transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-title font-black text-[clamp(1.5rem,7vw,4rem)] tracking-tighter text-white mt-2"
              >
                2026
              </motion.span>
            </div>
          </motion.div>

          <>
              <motion.div variants={itemVariants} className="max-w-3xl mb-16">
                 <p className="hero-text font-editorial text-4xl md:text-6xl text-white/50 italic leading-[1.1]">
                   We're living on <span className="text-white font-medium">BORROWED TIME.</span>
                 </p>
              </motion.div>

              <motion.div variants={itemVariants} className="hero-text mb-20">
                <Countdown />
              </motion.div>

              <motion.div variants={itemVariants} className="hero-text flex flex-col md:flex-row gap-8 items-center mb-8 md:mb-0">
                <PrecisionButton to={TICKETS_URL} variant="light">
                  Get Your Tickets
                </PrecisionButton>
                <Link to="/theme" className="group flex items-center gap-4 font-typewriter text-[11px] uppercase tracking-[0.4em] text-white hover:text-brand-secondary transition-colors">
                  Explore the Theme
                  <div className="w-12 h-[1px] bg-white/20 group-hover:bg-brand-secondary group-hover:w-16 transition-all" />
                </Link>
              </motion.div>
            </>
          
          {/* Scroll Indicator (Mobile / Bottom Hero) */}
          <motion.div 
            className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          >
            <span className="font-typewriter text-[8px] uppercase tracking-[0.5em] text-white/50">Scroll Down</span>
            <div className="w-[1px] h-6 bg-gradient-to-b from-brand-secondary to-transparent" />
          </motion.div>
        </div>

        {/* Bottom Bar Info */}
        <div className="w-full border-t border-white/5 py-12 px-6 md:px-16 relative z-10 bg-[#08080a]">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex gap-16 items-center">
              <div className="space-y-1">
                <span className="block font-typewriter text-[9px] uppercase tracking-widest text-white/50">The Date</span>
                <span className="block font-sans font-bold text-white text-lg">JUNE 14, 2026</span>
              </div>
              <div className="flex-shrink-0 w-[1px] h-10 bg-white/10" />
              <div className="space-y-1">
                <span className="block font-typewriter text-[9px] uppercase tracking-widest text-white/50">The Venue</span>
                <span className="block font-sans font-bold text-white text-lg uppercase">Nursery Campus, Upanga</span>
              </div>
            </div>

            <div className="flex gap-12 items-center opacity-60">
              <div className="text-right">
                <span className="block font-typewriter text-[9px] uppercase tracking-widest text-white">9 Speakers</span>
                <span className="block font-typewriter text-[9px] uppercase tracking-widest text-white">1 Inspiring Day</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hourglass Scroll Interaction Indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 h-40 w-1 bg-white/10 z-[60] hidden xl:block overflow-hidden rounded-full">
        <motion.div 
          className="w-full bg-brand-secondary origin-top"
          style={{ height: hourglassBottom }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 font-typewriter text-[8px] uppercase tracking-widest text-white/40 vertical-text -translate-y-12">
          Time Spent
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="bg-[#050507] py-8 overflow-hidden relative z-20">
        <div className="flex gap-12 whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0 animate-marquee text-[10px] font-typewriter uppercase tracking-[0.5em] text-white items-center">
              <span>ANAYA RASHID · THE CULTURE OF TIME</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span>ZAHRA DATOO · ARCHITECTURE OF NOSTALGIA</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span>HASSAN ABBAS · THE PROCRASTINATION PARADOX</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span>ZAHRA MOLEDINA · CAPITALISM'S CLOCK</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span>LIYAAN KARBELKAR · THE LEGACY WE LEAVE</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span>SADA MBARUK SAID · THREE CLOCKS</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
            </div>
          ))}
        </div>
      </div>

      {/* Sectors Removed */}



      {/* Social Call to Action */}
      <section className="py-40 bg-[#0a0a0d] border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 liquid-bg opacity-[0.02] pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-12"
          >
            <div className="space-y-4">
              <span className="font-typewriter text-xs uppercase tracking-[0.5em] text-white/30">Spread the Idea</span>
              <h2 className="text-5xl md:text-8xl font-title font-black uppercase text-white leading-none tracking-tighter">
                Share with someone living on <br />
                <span className="text-brand-secondary italic font-serif lowercase">borrowed time.</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               <a 
                 href={`https://wa.me/?text=${encodeURIComponent("Join us at TEDx Al Muntazir Schools Youth 2026: Borrowed Time. June 14, 2026. " + window.location.origin)}`} 
                 target="_blank" rel="noopener noreferrer"
                 className="px-12 py-5 bg-transparent border border-white/20 text-white rounded-full font-typewriter text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-xl shadow-black/5"
               >
                 WhatsApp
               </a>
                 <a 
                   href={`https://instagram.com/${SOCIALS.instagram.replace('@','')}`} 
                   target="_blank" rel="noopener noreferrer"
                   className="px-12 py-5 bg-transparent border border-white/20 text-white rounded-full font-typewriter text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-xl shadow-black/5"
                 >
                   Instagram
                 </a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="pt-20" />
    </motion.div>
  );
}
