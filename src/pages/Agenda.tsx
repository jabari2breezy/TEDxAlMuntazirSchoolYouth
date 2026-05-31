import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

type AgendaItem = {
  id: string;
  time: string;
  title: string;
  speaker: string;
  desc: string;
  duration: string;
  type: 'KEYNOTE' | 'BREAK' | 'EXPERIENCE' | 'LUNCH' | 'GAME' | 'SESSION' | 'CEREMONY' | 'VIDEO';
  sub?: AgendaItem[];
};

const AGENDA_ITEMS: AgendaItem[] = [
  {
    id: '00',
    time: '09:30 AM',
    title: 'REGISTRATION',
    speaker: 'Welcome Desk',
    desc: 'Enter the monolithic space and receive your credentials. Access the primary viewing arrays and prepare for the temporal shift.',
    duration: '30M',
    type: 'EXPERIENCE'
  },
  {
    id: '01',
    time: '10:00 AM',
    title: 'INTRO SESSION',
    speaker: 'Opening',
    desc: 'The beginning of the end. An orientation to the systems and structures of Borrowed Time.',
    duration: '20M',
    type: 'SESSION',
    sub: [
      { id: '01a', time: '10:00', title: 'Welcome Address', speaker: 'Hosts', desc: 'Opening welcome to all attendees and a framing of the day ahead.', duration: '10M', type: 'EXPERIENCE' },
      { id: '01b', time: '10:10', title: 'Intro Video', speaker: 'Screen', desc: 'A cinematic video setting the tone for the Borrowed Time theme.', duration: '10M', type: 'VIDEO' },
    ]
  },
  {
    id: '02',
    time: '10:20 AM',
    title: 'SESSION 1',
    speaker: '3 Speakers + Game',
    desc: 'The first block of ideas worth spreading, featuring three transformative speakers and an interactive game.',
    duration: '70M',
    type: 'SESSION',
    sub: [
      { id: '02a', time: '10:20', title: 'Speaker 1: Ridhwan Mohammed', speaker: 'Alumni Speaker', desc: 'An alumni perspective on borrowed time and life beyond school walls.', duration: '15M', type: 'KEYNOTE' },
      { id: '02b', time: '10:35', title: 'Short Break', speaker: '', desc: 'A brief reset between speakers.', duration: '5M', type: 'BREAK' },
      { id: '02c', time: '10:40', title: 'Speaker 2: Anaya Rashid', speaker: 'Culture of Time', desc: 'Exploring how different cultures perceive, value, and manage their time differently across the globe.', duration: '15M', type: 'KEYNOTE' },
      { id: '02d', time: '10:55', title: 'Interactive Game', speaker: 'Audience', desc: 'A fast-paced interactive game connecting the audience to the theme.', duration: '10M', type: 'GAME' },
      { id: '02e', time: '11:05', title: 'Speaker 3: Zahra Datoo', speaker: 'Nostalgia', desc: 'A deep exploration of nostalgia — why we look back, what it costs us, and what it can teach us.', duration: '15M', type: 'KEYNOTE' },
    ]
  },
  {
    id: '03',
    time: '11:30 AM',
    title: 'TEA BREAK',
    speaker: 'Refreshments',
    desc: 'Curated refreshments and ambient networking. Recharge, connect, and exchange ideas.',
    duration: '20M',
    type: 'BREAK'
  },
  {
    id: '04',
    time: '11:50 AM',
    title: 'SESSION 2',
    speaker: '3 Speakers + Game',
    desc: 'The second block of ideas — exploring innovation, urgency, and the cost of procrastination.',
    duration: '70M',
    type: 'SESSION',
    sub: [
      { id: '04a', time: '11:50', title: 'Speaker 4: Zahra Moledina', speaker: 'The Best Thing Since Sliced Bread', desc: 'How breakthroughs happen, why we miss them, and why the next big thing is already here.', duration: '15M', type: 'KEYNOTE' },
      { id: '04b', time: '12:05', title: 'Kahoot / Blooket', speaker: 'Audience', desc: 'An energizing quiz game to test and celebrate knowledge from the sessions so far.', duration: '10M', type: 'GAME' },
      { id: '04c', time: '12:15', title: 'Speaker 5: TBD', speaker: 'Speaker', desc: 'A surprise talk from a yet-to-be-announced speaker — the unknown is part of the borrowed time experience.', duration: '18M', type: 'KEYNOTE' },
      { id: '04d', time: '12:33', title: 'Mini Game', speaker: 'Audience', desc: 'A short interactive game before the final speaker of the session.', duration: '5M', type: 'GAME' },
      { id: '04e', time: '12:38', title: 'Speaker 6: Hassan Abbas Muhammad', speaker: 'Procrastination', desc: 'Dissecting the procrastination paradox — why we borrow against our own future and how to finally stop.', duration: '15M', type: 'KEYNOTE' },
      { id: '04f', time: '12:53', title: '[ Buffer ]', speaker: '', desc: 'Schedule buffer to ensure the session finishes on time.', duration: '7M', type: 'BREAK' },
    ]
  },
  {
    id: '05',
    time: '01:00 PM',
    title: 'SALAH & LUNCH',
    speaker: 'Prayer + Food',
    desc: 'Salah break followed by a curated lunch experience and partner activations. Refuel for the final session.',
    duration: '60M',
    type: 'LUNCH'
  },
  {
    id: '06',
    time: '02:00 PM',
    title: 'SESSION 3',
    speaker: '3 Speakers + 2 Games',
    desc: 'The grand finale — three visionary speakers and two games bring the Borrowed Time theme to its crescendo.',
    duration: '75M',
    type: 'SESSION',
    sub: [
      { id: '06a', time: '02:00', title: 'Speaker 7: Yunus Osman', speaker: 'The Art of Scheduling (Alumni)', desc: 'An alumni master-class on how to design your time intentionally and build systems that work.', duration: '15M', type: 'KEYNOTE' },
      { id: '06b', time: '02:15', title: 'Interactive Game', speaker: 'Audience', desc: 'An audience game to reset energy before the next speaker.', duration: '10M', type: 'GAME' },
      { id: '06c', time: '02:25', title: 'Speaker 8: Sada Mbaruk', speaker: 'End of the World', desc: 'A provocative exploration of what happens when we run out of borrowed time — individually and globally.', duration: '15M', type: 'KEYNOTE' },
      { id: '06d', time: '02:40', title: 'Imposter Game', speaker: 'Audience', desc: 'The iconic imposter social deduction game — who can you trust with your time?', duration: '10M', type: 'GAME' },
      { id: '06e', time: '02:50', title: 'Speaker 9: Liyaan Karbelkar', speaker: 'How to Take Your Wealth With You', desc: 'How to build legacy, purpose, and impact that outlasts the finite window of your borrowed time.', duration: '15M', type: 'KEYNOTE' },
      { id: '06f', time: '03:05', title: '[ Buffer ]', speaker: '', desc: 'Schedule buffer to ensure clean handoff to closing.', duration: '10M', type: 'BREAK' },
    ]
  },
  {
    id: '07',
    time: '03:15 PM',
    title: 'CLOSING CEREMONY',
    speaker: 'All',
    desc: 'The temporal window closes. Awards, acknowledgements, and the final message — make the most of your borrowed time.',
    duration: '45M',
    type: 'CEREMONY'
  },
];

const TYPE_COLORS: Record<string, string> = {
  KEYNOTE: '#006d38',
  SESSION: '#000839',
  BREAK: '#767681',
  EXPERIENCE: '#4e5a98',
  LUNCH: '#767681',
  GAME: '#006d38',
  CEREMONY: '#000839',
  VIDEO: '#4e5a98',
};

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

  const xTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-82%"]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

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
      
      {/* 500vh Scroll Container */}
      <div ref={containerRef} className="h-[500vh] relative">
        
        {/* Sticky Viewport (100dvh) */}
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050507]">
          
          {/* Background Grid Matrix & Noise */}
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

          {/* Left Anchor Elements */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-16 z-10 pointer-events-none">
            <span className="font-typewriter text-[8px] md:text-xs uppercase tracking-[0.5em] text-brand-secondary block mb-2 md:mb-4">
              [ TRACK // 2026 ]
            </span>
            <h1 
              className="text-4xl md:text-8xl font-title font-black uppercase tracking-tighter leading-none text-white/90"
              style={{ writingMode: isMobile ? 'vertical-lr' : 'horizontal-tb', transform: isMobile ? 'rotate(180deg)' : 'none' }}
            >
              THE <br className="hidden md:block" /> TIMELINE
            </h1>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/50">Scroll to Explore</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-brand-secondary to-transparent" />
          </motion.div>

          {/* Horizontal Train Wrapper */}
          <motion.div 
            className="absolute top-0 h-full flex items-center pt-24 pb-12"
            style={{ x: xTranslate, paddingLeft: isMobile ? '30vw' : '40vw' }}
          >
            <div className="flex gap-4 md:gap-8 items-stretch px-8 h-[65vh] md:h-[72vh]">
              {AGENDA_ITEMS.map((item) => (
                <AgendaCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => setSelectedId(item.id)} 
                  isSelected={selectedId === item.id}
                />
              ))}
              {/* Buffer element */}
              <div className="w-[50vw] shrink-0 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Click Expansion Detail */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="fixed inset-0 z-[200] flex flex-col md:flex-row bg-[#050507]">
            
            {/* Expanded Card */}
            <motion.div 
              layoutId={`card-${selectedItem.id}`}
              className="relative w-full md:w-2/5 h-[42dvh] md:h-full bg-neutral-900 flex flex-col justify-between p-6 md:p-14 border-r border-b md:border-b-0 border-brand-secondary overflow-y-auto"
            >
              <motion.div layoutId={`card-time-${selectedItem.id}`} className="font-title font-black text-5xl md:text-7xl tracking-tighter uppercase text-white leading-none">
                {selectedItem.time}
              </motion.div>
              
              <div>
                <motion.div layoutId={`card-type-${selectedItem.id}`} className="font-typewriter text-[10px] uppercase tracking-[0.5em] mb-2" style={{ color: TYPE_COLORS[selectedItem.type] }}>
                  {selectedItem.type} // {selectedItem.duration}
                </motion.div>
                <motion.div layoutId={`card-title-${selectedItem.id}`} className="font-title font-bold text-2xl md:text-4xl uppercase text-white mb-3">
                  {selectedItem.title}
                </motion.div>
                <motion.div layoutId={`card-speaker-${selectedItem.id}`} className="font-editorial text-xl md:text-2xl italic text-white/70">
                  {selectedItem.speaker}
                </motion.div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <span className="font-typewriter text-[9px] tracking-widest uppercase">Esc</span>
              </button>
            </motion.div>

            {/* Detail Pane */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-3/5 h-[58dvh] md:h-full overflow-y-auto custom-scrollbar"
            >
              <div className="p-6 md:p-14 flex flex-col gap-8">
                <div>
                  <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-white/30 block mb-4">
                    [ SESSION ABSTRACT // {selectedItem.id} ]
                  </span>
                  <p className="font-editorial text-xl md:text-3xl italic text-white/90 leading-relaxed">
                    {selectedItem.desc}
                  </p>
                </div>

                {/* Sub-items breakdown */}
                {selectedItem.sub && selectedItem.sub.length > 0 && (
                  <div className="space-y-3">
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/30 block">
                      [ FULL BREAKDOWN ]
                    </span>
                    {selectedItem.sub.map((sub) => (
                      <div key={sub.id} className="border border-white/10 p-4 md:p-5 hover:border-brand-secondary/40 transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className="font-typewriter text-[9px] uppercase tracking-widest block mb-1" style={{ color: TYPE_COLORS[sub.type] }}>
                              {sub.time} — {sub.type} // {sub.duration}
                            </span>
                            <p className="font-title font-bold text-lg uppercase text-white">{sub.title}</p>
                            {sub.speaker && <p className="font-editorial text-base italic text-white/50">{sub.speaker}</p>}
                          </div>
                        </div>
                        <p className="font-sans text-sm text-white/40 leading-relaxed mt-2">{sub.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-10 border-t border-white/10 pt-6">
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.5em] text-white/30 block mb-2">Status</span>
                    <span className="font-sans font-bold text-xs uppercase text-brand-secondary">Confirmed</span>
                  </div>
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.5em] text-white/30 block mb-2">Location</span>
                    <span className="font-sans font-bold text-xs uppercase text-white">Main Stage</span>
                  </div>
                  <div>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.5em] text-white/30 block mb-2">Duration</span>
                    <span className="font-sans font-bold text-xs uppercase text-white">{selectedItem.duration}</span>
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

function AgendaCard({ item, onClick, isSelected }: { item: AgendaItem, onClick: () => void, isSelected: boolean }) {
  const typeColor = TYPE_COLORS[item.type];
  
  // Width varies by type
  const isSession = item.type === 'SESSION';
  const isBreak = item.type === 'BREAK' || item.type === 'LUNCH';
  
  const widthClass = isSession
    ? 'w-[55vw] md:w-[30vw]'
    : isBreak
      ? 'w-[35vw] md:w-[18vw]'
      : 'w-[45vw] md:w-[22vw]';

  return (
    <motion.div
      layoutId={`card-${item.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative shrink-0 ${widthClass} h-full bg-neutral-900 border ${isSelected ? 'border-transparent' : 'border-white/10 hover:border-brand-secondary'} transition-colors duration-500 flex flex-col justify-between p-4 md:p-8 cursor-pointer overflow-hidden`}
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${typeColor}10)` }} />

      {/* Top: Time */}
      <motion.div layoutId={`card-time-${item.id}`} className="font-title font-black text-3xl md:text-5xl tracking-tighter uppercase text-white/90 group-hover:text-white transition-colors leading-none relative z-10 whitespace-pre-wrap">
        {item.time.replace(' ', '\n')}
      </motion.div>
      
      {/* Bottom: Details */}
      <div className="relative z-10 flex flex-col gap-1">
        <motion.div layoutId={`card-type-${item.id}`} className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] mb-1" style={{ color: typeColor }}>
          {item.type}
        </motion.div>
        
        <div className="overflow-hidden">
          <motion.div layoutId={`card-title-${item.id}`} className="font-title font-bold text-base md:text-2xl uppercase text-white leading-tight">
            {item.title}
          </motion.div>
        </div>

        {/* Roll Reveal */}
        <div className="h-0 group-hover:h-6 md:group-hover:h-8 overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1]">
          <motion.div layoutId={`card-speaker-${item.id}`} className="font-editorial text-sm md:text-lg italic text-white/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
            {item.speaker}
          </motion.div>
        </div>

        {/* Sub-items indicator */}
        {item.sub && item.sub.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.sub.map((sub) => (
              <span key={sub.id} className="font-typewriter text-[7px] uppercase tracking-widest border border-white/10 px-1.5 py-0.5" style={{ color: TYPE_COLORS[sub.type], borderColor: `${TYPE_COLORS[sub.type]}40` }}>
                {sub.type}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
