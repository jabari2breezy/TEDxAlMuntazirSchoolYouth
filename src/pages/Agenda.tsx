import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { TICKETS_URL } from '../constants';

const AGENDA_ITEMS = [
  {
    id: '01',
    time: '08:00 AM',
    title: 'Registration & Immersive Welcome',
    desc: 'Begin the journey. Enter the dark monolithic space and receive your credentials.',
    duration: '60 MINS',
    type: 'EXPERIENCE'
  },
  {
    id: '02',
    time: '09:00 AM',
    title: 'Session 01: The Inheritors',
    desc: 'Exploring the systems we did not build, but must now manage. Features talks from Anaya Rashid and Zahra Datoo on cultural and architectural legacies.',
    duration: '90 MINS',
    type: 'KEYNOTE'
  },
  {
    id: '03',
    time: '10:30 AM',
    title: 'The Liquidity Break',
    desc: 'Networking and ambient experiences in the courtyard.',
    duration: '30 MINS',
    type: 'BREAK'
  },
  {
    id: '04',
    time: '11:00 AM',
    title: 'Session 02: The Present Tense',
    desc: 'Maximizing the value of "now". Hassan Abbas and Zahra Moledina dissect procrastination and the economic realities of time.',
    duration: '90 MINS',
    type: 'KEYNOTE'
  },
  {
    id: '05',
    time: '12:30 PM',
    title: 'The Mid-Day Pause',
    desc: 'Curated lunch experience and partner activations.',
    duration: '60 MINS',
    type: 'LUNCH'
  },
  {
    id: '06',
    time: '01:30 PM',
    title: 'Session 03: Future Legacies',
    desc: 'Designing the architecture of tomorrow. Liyaan Karbelkar and Sada Mbaruk Said close the loop on what we leave behind.',
    duration: '90 MINS',
    type: 'KEYNOTE'
  },
];

export default function Agenda() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Fluid blob tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springConfig = { stiffness: 50, damping: 20 };
  const fluidX = useSpring(0, springConfig);
  const fluidY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      fluidX.set(e.clientX - window.innerWidth / 2);
      fluidY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [fluidX, fluidY]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Parallax the intro text
  const introY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Make list slide up
  const listY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);
  const listOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <div ref={containerRef} className="bg-[#050507] text-white min-h-[250vh] relative">
      
      {/* GLOBAL AMBIENT FLUID & FROSTED GLASS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* The Blob */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-brand-secondary opacity-30 mix-blend-screen"
          style={{ x: fluidX, y: fluidY, filter: 'blur(100px)' }}
        />
        {/* Deep frosted glass */}
        <div className="absolute inset-0 backdrop-blur-[80px] bg-[#050507]/40" />
      </div>

      {/* FIXED COORDINATE INTRO */}
      <motion.div 
        style={{ y: introY, opacity: introOpacity }}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6"
      >
        <div className="absolute top-32 left-6 md:left-12 font-typewriter text-[9px] uppercase tracking-widest text-white/40">
          -06.7924° S <br/> 39.2083° E
        </div>
        <div className="absolute top-32 right-6 md:right-12 font-typewriter text-[9px] uppercase tracking-widest text-white/40 text-right">
          Temporal <br/> Alignment
        </div>
        
        <h1 className="text-[12vw] md:text-[10vw] font-editorial italic tracking-tight text-white mix-blend-overlay">
          THE CHRONOLOGY
        </h1>
      </motion.div>

      {/* THE AGENDA LIST */}
      <div className="absolute top-[100vh] w-full z-20 px-4 md:px-16 pb-40">
        <motion.div style={{ y: listY, opacity: listOpacity }} className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col">
            {AGENDA_ITEMS.map((item) => (
              <motion.div 
                layoutId={`row-${item.id}`}
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setActiveItem(item.id)}
                className={`
                  relative cursor-pointer py-12 md:py-16 border-b border-white/10 group transition-all duration-500
                  ${hoveredItem && hoveredItem !== item.id ? 'opacity-20 blur-[4px]' : 'opacity-100'}
                `}
              >
                {/* Localized Hover Fluid */}
                <div className={`
                  absolute inset-0 bg-brand-secondary/5 rounded-3xl blur-[40px] transition-opacity duration-500 pointer-events-none
                  ${hoveredItem === item.id ? 'opacity-100' : 'opacity-0'}
                `} />

                <div className="relative z-10 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-16">
                  <div className="w-full md:w-1/4 font-typewriter text-sm tracking-widest text-brand-secondary">
                    {item.time}
                  </div>
                  <div className="w-full md:w-3/4 flex justify-between items-baseline">
                    <h2 className="text-3xl md:text-5xl font-title font-black uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                      {item.title}
                    </h2>
                    
                    {/* Mobile 3D Lens Simulation */}
                    <div className="md:hidden w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* DEEP NARRATIVE ACCORDION (MODAL) */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 md:p-12"
          >
            {/* Darker backdrop to hide the main list completely */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#050507]/95 backdrop-blur-2xl" 
              onClick={() => setActiveItem(null)}
            />

            {AGENDA_ITEMS.map((item) => item.id === activeItem && (
              <motion.div 
                key={`modal-${item.id}`}
                layoutId={`row-${item.id}`}
                className="relative w-full max-w-7xl h-full max-h-[80vh] bg-[#0a0a0d] border border-white/10 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 overflow-hidden shadow-[0_0_100px_rgba(0,109,56,0.1)]"
              >
                {/* Structural Nodes (Left) */}
                <div className="w-full md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-12">
                  <div className="space-y-6">
                    <span className="font-typewriter text-[10px] uppercase tracking-widest text-brand-secondary">
                      [ NODE: {item.id} ]
                    </span>
                    <h3 className="text-5xl md:text-7xl font-title font-black uppercase tracking-tighter leading-none">
                      {item.time}
                    </h3>
                  </div>
                  
                  <div className="space-y-4 pt-8 md:pt-0">
                    <div className="font-typewriter text-[9px] uppercase tracking-[0.3em] text-white/40">
                      [ DURATION: {item.duration} ]
                    </div>
                    <div className="font-typewriter text-[9px] uppercase tracking-[0.3em] text-white/40">
                      [ PROTOCOL: {item.type} ]
                    </div>
                  </div>
                </div>

                {/* Expansive Typography (Right) */}
                <div className="w-full md:w-2/3 flex flex-col justify-between pt-4 md:pt-0">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                  >
                    <h2 className="text-4xl md:text-6xl font-title font-black uppercase tracking-tighter leading-[0.9]">
                      {item.title}
                    </h2>
                    <p className="font-editorial text-2xl md:text-4xl italic text-white/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-end pt-12"
                  >
                    <a 
                      href={TICKETS_URL}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-4 text-brand-secondary font-typewriter text-[11px] uppercase tracking-widest hover:text-white transition-colors group"
                    >
                      Secure Access
                      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </motion.div>
                </div>

                <button 
                  onClick={() => setActiveItem(null)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/50" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
