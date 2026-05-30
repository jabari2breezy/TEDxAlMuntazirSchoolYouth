import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

const AGENDA_ITEMS = [
  {
    id: '01',
    time: '08:00 AM',
    title: 'THE ARRIVAL',
    speaker: 'Registration',
    desc: 'Enter the monolithic space and receive your credentials. Access the primary viewing arrays and prepare for the temporal shift.',
    duration: '60M',
    type: 'EXPERIENCE'
  },
  {
    id: '02',
    time: '09:00 AM',
    title: 'INTRO',
    speaker: 'Opening Address',
    desc: 'The beginning of the end. An orientation to the systems and structures of Borrowed Time.',
    duration: '30M',
    type: 'KEYNOTE'
  },
  {
    id: '03',
    time: '09:30 AM',
    title: 'THE INHERITORS',
    speaker: 'Liyaan Karbelkar',
    desc: 'Exploring the systems we must now manage. A deep dive into the socio-economic debts passed down to the youth.',
    duration: '90M',
    type: 'KEYNOTE'
  },
  {
    id: '04',
    time: '11:00 AM',
    title: 'LIQUIDITY BREAK',
    speaker: 'Networking',
    desc: 'Fluid environments and ambient networking. Secure resources and exchange temporal insights.',
    duration: '30M',
    type: 'BREAK'
  },
  {
    id: '05',
    time: '11:30 AM',
    title: 'THE PRESENT TENSE',
    speaker: 'Hassan Abbas',
    desc: 'Dissecting the procrastination paradox. Why we borrow against our own future and how to stop.',
    duration: '90M',
    type: 'KEYNOTE'
  },
  {
    id: '06',
    time: '01:00 PM',
    title: 'MID-DAY PAUSE',
    speaker: 'Lunch & Activations',
    desc: 'Curated nutrition and partner ecosystem activations.',
    duration: '60M',
    type: 'LUNCH'
  },
  {
    id: '07',
    time: '02:00 PM',
    title: 'FUTURE LEGACIES',
    speaker: 'Sada Mbaruk Said',
    desc: 'Designing the architecture of tomorrow using the three clocks mechanism.',
    duration: '90M',
    type: 'KEYNOTE'
  },
];

export default function Agenda() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  // Calculate massive horizontal translate based on vertical scroll
  // We have 7 items, let's move it left by roughly -300vw
  const xTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

  // We lock scroll if an item is selected by applying overflow hidden to body
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedId]);

  const selectedItem = AGENDA_ITEMS.find(item => item.id === selectedId);

  return (
    <div className="bg-[#050507] text-white">
      
      {/* 400vh Scroll Container */}
      <div ref={containerRef} className="h-[400vh] relative">
        
        {/* Sticky Viewport (100dvh) */}
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050507]">
          
          {/* Phase 1: Background Grid Matrix & Noise */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '4rem 4rem'
            }}
          />
          <div className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} 
          />

          {/* Phase 1: Left Anchor Elements */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-16 z-10 pointer-events-none">
            <span className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.5em] text-brand-secondary block mb-4">
              [ TRACK // 2026 ]
            </span>
            <h1 className="text-6xl md:text-8xl font-title font-black uppercase tracking-tighter leading-none text-white/90" style={{ writingMode: isMobile ? 'vertical-lr' : 'horizontal-tb', transform: isMobile ? 'rotate(180deg)' : 'none' }}>
              THE <br className="hidden md:block" /> TIMELINE
            </h1>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          >
            <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/50">Scroll to Explore</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-brand-secondary to-transparent" />
          </motion.div>

          {/* Phase 2: Horizontal Train Wrapper */}
          <motion.div 
            className="absolute top-0 h-full flex items-center pt-24 pb-12"
            style={{ x: xTranslate, paddingLeft: isMobile ? '35vw' : '45vw' }}
          >
            <div className="flex gap-8 md:gap-16 items-center px-12">
              {AGENDA_ITEMS.map((item) => (
                <AgendaCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => setSelectedId(item.id)} 
                  isSelected={selectedId === item.id}
                />
              ))}
              {/* Buffer element at the end so last card reaches center */}
              <div className="w-[50vw] shrink-0 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Phase 3: Absolute Click Expansion Detail */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="fixed inset-0 z-[200] flex flex-col md:flex-row bg-[#050507]">
            
            {/* The Expanded Card Component */}
            <motion.div 
              layoutId={`card-${selectedItem.id}`}
              className="relative w-full md:w-1/2 h-[40dvh] md:h-full bg-neutral-900 flex flex-col justify-between p-8 md:p-16 border-r border-b md:border-b-0 border-[#E02229]"
            >
              <motion.div layoutId={`card-time-${selectedItem.id}`} className="font-title font-black text-6xl md:text-8xl tracking-tighter uppercase text-white leading-none">
                {selectedItem.time}
              </motion.div>
              
              <div>
                <motion.div layoutId={`card-type-${selectedItem.id}`} className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.5em] text-[#E02229] mb-2">
                  {selectedItem.type} // {selectedItem.duration}
                </motion.div>
                <motion.div layoutId={`card-title-${selectedItem.id}`} className="font-title font-bold text-3xl md:text-5xl uppercase text-white mb-4">
                  {selectedItem.title}
                </motion.div>
                <motion.div layoutId={`card-speaker-${selectedItem.id}`} className="font-editorial text-xl md:text-3xl italic text-white/70">
                  {selectedItem.speaker}
                </motion.div>
              </div>

              {/* Close Button Inside Card */}
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <span className="font-typewriter text-[10px] tracking-widest uppercase">Esc</span>
              </button>
            </motion.div>

            {/* The Text Content Pane (Fades In) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 h-[60dvh] md:h-full p-8 md:p-24 overflow-y-auto flex flex-col justify-center custom-scrollbar"
            >
              <div className="max-w-xl">
                <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-white/30 block mb-6">
                  [ SESSION ABSTRACT // {selectedItem.id} ]
                </span>
                <p className="font-editorial text-2xl md:text-4xl italic text-white/90 leading-relaxed">
                  {selectedItem.desc}
                </p>
                
                <div className="mt-16 flex gap-12 border-t border-white/10 pt-8">
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.5em] text-white/30 block mb-2">Status</span>
                    <span className="font-sans font-bold text-xs uppercase text-brand-secondary">Confirmed</span>
                  </div>
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.5em] text-white/30 block mb-2">Location</span>
                    <span className="font-sans font-bold text-xs uppercase text-white">Main Stage</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgendaCard({ item, onClick, isSelected }: { item: any, onClick: () => void, isSelected: boolean }) {
  return (
    <motion.div
      layoutId={`card-${item.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative shrink-0 h-[60vh] md:h-[70vh] aspect-[3/4] bg-neutral-900 border ${isSelected ? 'border-transparent' : 'border-white/10 hover:border-[#E02229]'} transition-colors duration-500 flex flex-col justify-between p-6 md:p-10 cursor-pointer overflow-hidden`}
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E02229]/0 to-[#E02229]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Top: Massive Compressed Time */}
      <motion.div layoutId={`card-time-${item.id}`} className="font-title font-black text-6xl md:text-7xl tracking-tighter uppercase text-white/90 group-hover:text-white transition-colors leading-none relative z-10">
        {item.time.replace(' ', '\n')}
      </motion.div>
      
      {/* Bottom: Details with Hover Roll Reveal */}
      <div className="relative z-10 flex flex-col">
        <motion.div layoutId={`card-type-${item.id}`} className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-[#E02229] mb-2">
          {item.type}
        </motion.div>
        
        <div className="overflow-hidden">
          <motion.div layoutId={`card-title-${item.id}`} className="font-title font-bold text-2xl md:text-3xl uppercase text-white">
            {item.title}
          </motion.div>
        </div>

        {/* The Roll Reveal Mask */}
        <div className="h-0 group-hover:h-8 md:group-hover:h-12 overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1] mt-0 group-hover:mt-2">
          <motion.div layoutId={`card-speaker-${item.id}`} className="font-editorial text-lg md:text-2xl italic text-white/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
            {item.speaker}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
