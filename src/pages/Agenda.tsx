import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronDown, Clock, ArrowUpRight } from 'lucide-react';
import MaskReveal from '../components/MaskReveal';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;
const AGGRESSIVE_EASE = [0.22, 1, 0.36, 1] as const;

type Theme = 'past' | 'present' | 'future';

interface AgendaItem {
  time: string;
  title: string;
  sub?: string;
  topic?: string;
  theme: Theme;
  isSpeech: boolean;
  speakerSlug?: string;
  duration: number;
}

const agendaItems: AgendaItem[] = [
  // Session 1: Past
  { time: '9:30 – 10:00', duration: 30, title: 'Registration', sub: 'Doors open at 9:30 AM', theme: 'past', isSpeech: false },
  { time: '10:00 – 10:07', duration: 7, title: 'Welcome Address', sub: 'Opening remarks', theme: 'past', isSpeech: false },
  { time: '10:07 – 10:20', duration: 13, title: 'Opening Video', sub: '', theme: 'past', isSpeech: false },
  { time: '10:20 – 10:35', duration: 15, title: 'Ridhwan Mohammed', topic: 'Borrowed Time, Borrowed Selves', theme: 'past', isSpeech: true, speakerSlug: 'ridhwan-mohammed', sub: 'Alum' },
  { time: '10:35 – 10:40', duration: 5, title: 'Break', sub: 'Short transition', theme: 'past', isSpeech: false },
  { time: '10:40 – 10:55', duration: 15, title: 'Anaya Rashid', topic: 'Culture of Time', theme: 'past', isSpeech: true, speakerSlug: 'anaya-rashid' },
  { time: '10:55 – 11:05', duration: 10, title: 'Game', sub: 'Interactive Session', theme: 'past', isSpeech: false },
  { time: '11:05 – 11:20', duration: 15, title: 'Zahra Datoo', topic: 'Nostalgia', theme: 'past', isSpeech: true, speakerSlug: 'zahra-datoo' },
  { time: '11:20 – 11:50', duration: 30, title: 'Tea Break', sub: 'Refreshments & networking', theme: 'past', isSpeech: false },
  
  // Session 2: Present
  { time: '11:50 – 12:05', duration: 15, title: 'Zahra Moledina', topic: 'The Best Thing Since Sliced Bread', theme: 'present', isSpeech: true, speakerSlug: 'zahra-moledina' },
  { time: '12:05 – 12:15', duration: 10, title: 'Kahoot / Blooket', sub: 'Interactive Quiz', theme: 'present', isSpeech: false },
  { time: '12:15 – 12:30', duration: 15, title: 'TBA', topic: 'TBA', theme: 'present', isSpeech: true },
  { time: '12:30 – 12:35', duration: 5, title: 'Game', sub: 'Quick Activity', theme: 'present', isSpeech: false },
  { time: '12:35 – 12:50', duration: 15, title: 'Hassan Abbas Muhammad', topic: 'Procrastination', theme: 'present', isSpeech: true, speakerSlug: 'hassan-abbas' },
  { time: '12:50 – 2:00', duration: 70, title: 'Salah & Food Break', sub: 'Prayer and lunch', theme: 'present', isSpeech: false },
  
  // Session 3: Future
  { time: '2:00 – 2:15', duration: 15, title: 'Yunus Osman', topic: 'The Art of Scheduling', theme: 'future', isSpeech: true, speakerSlug: 'yunus-osman', sub: 'Alum' },
  { time: '2:15 – 2:25', duration: 10, title: 'Game: Last Person Standing', sub: 'Find your soulmate', theme: 'future', isSpeech: false },
  { time: '2:25 – 2:40', duration: 15, title: 'Sada Mbaruk', topic: 'End of the World', theme: 'future', isSpeech: true, speakerSlug: 'sada-mbaruk' },
  { time: '2:40 – 2:50', duration: 10, title: 'Game', sub: 'Interactive Session', theme: 'future', isSpeech: false },
  { time: '2:50 – 3:05', duration: 15, title: 'Liyaan Karblekar', topic: 'How to Take Your Wealth With You', theme: 'future', isSpeech: true, speakerSlug: 'liyaan-karblekar' },
  { time: '3:05 – 4:00', duration: 55, title: 'Closing Ceremony', sub: 'Final remarks & wrap-up', theme: 'future', isSpeech: false },
];

const SESSIONS = [
  { label: 'Past', title: 'Echoes & Foundations', theme: 'past', bg: 'bg-[#0a0c12]', text: 'text-white', accent: '#006d38' },
  { label: 'Present', title: 'Presence & Power', theme: 'present', bg: 'bg-[#f7f4ee]', text: 'text-[#000839]', accent: '#006d38' },
  { label: 'Future', title: 'Reimagining Systems', theme: 'future', bg: 'bg-[#000839]', text: 'text-white', accent: '#006d38' },
];

/* ── Kinetic Floating Badge with Magnetic Attraction ── */
function FloatingBadge({ activeSession }: { activeSession: number }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!badgeRef.current) return;
      const rect = badgeRef.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        setMousePos({ x: dx * 0.15, y: dy * 0.15 });
      } else {
        setMousePos({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={badgeRef}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: LUXURY_EASE }}
      style={{ x: mousePos.x, y: mousePos.y }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div 
        className="flex items-center gap-2 px-6 py-3 bg-[#000839]/95 backdrop-blur-xl rounded-full border border-brand-secondary/30 shadow-2xl"
        whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(0, 109, 56, 0.3)' }}
        transition={{ duration: 0.3, ease: LUXURY_EASE }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Clock size={12} className="text-brand-secondary" />
        </motion.div>
        <span className="font-title text-xl md:text-2xl uppercase tracking-widest text-white font-bold">
          AGENDA
        </span>
        <div className="w-px h-3 bg-white/20" />
        <span className="font-typewriter text-[9px] uppercase tracking-[0.2em] text-brand-secondary font-bold">
          {SESSIONS[activeSession]?.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ── Premium Agenda Item with Kinetic Typography ── */
function AgendaItemRow({
  item,
  index,
  isDark,
}: {
  item: AgendaItem;
  index: number;
  isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [isHovered, setIsHovered] = useState(false);

  const speakerLink = item.isSpeech && item.speakerSlug
    ? `/speakers`
    : undefined;

  const content = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, x: -20 }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08, ease: AGGRESSIVE_EASE }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative border-t ${isDark ? 'border-white/8' : 'border-[#000839]/10'} py-8 md:py-12 first:border-t-0 overflow-hidden`}
    >
      {/* Kinetic background shimmer on hover */}
      <motion.div
        className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-gradient-to-r from-transparent via-brand-secondary/5 to-transparent' : 'bg-gradient-to-r from-transparent via-brand-secondary/3 to-transparent'}`}
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : {}}
        transition={{ duration: 0.8, ease: LUXURY_EASE }}
      />

      {/* Animated pulsing dot for speeches */}
      {item.isSpeech && (
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(50%+1px)]"
          animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: LUXURY_EASE }}
        >
          <motion.div 
            className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-brand-secondary' : 'bg-brand-secondary'}`}
            animate={isHovered ? { boxShadow: '0 0 20px rgba(0, 109, 56, 0.8)' } : {}}
          >
            <motion.div 
              className="absolute inset-0 rounded-full bg-brand-secondary/40"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 relative z-10">
        {/* Time with kinetic tracking */}
        <motion.span
          style={{ y: isInView ? 0 : 10 }}
          transition={{ duration: 0.5, delay: index * 0.04, ease: LUXURY_EASE }}
          className={`font-typewriter text-lg md:text-2xl font-bold ${isDark ? 'text-white/40' : 'text-[#000839]/40'} group-hover:text-brand-secondary transition-colors duration-500 shrink-0 w-36 md:w-48`}
          animate={isHovered ? { letterSpacing: '0.08em' } : {}}
        >
          {item.time}
        </motion.span>

        {/* Content with masked reveals */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <motion.h3 
              className={`text-2xl md:text-4xl font-title font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#000839]'}`}
              animate={isHovered ? { scale: 1.02, x: 4 } : {}}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
            >
              {item.title}
            </motion.h3>
            {item.isSpeech && item.speakerSlug && (
              <motion.div
                animate={isHovered ? { x: 2, y: -2 } : {}}
                transition={{ duration: 0.3, ease: LUXURY_EASE }}
              >
                <ArrowUpRight size={14} className={`${isDark ? 'text-white/20' : 'text-[#000839]/20'} group-hover:text-brand-secondary transition-all`} />
              </motion.div>
            )}
          </div>
          {item.topic && (
            <motion.p 
              className={`font-editorial text-lg md:text-2xl italic ${isDark ? 'text-brand-secondary/80' : 'text-brand-secondary/90'} leading-tight`}
              animate={isHovered ? { x: 2 } : {}}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
            >
              {item.topic}
            </motion.p>
          )}
          {item.sub && (
            <motion.p 
              className={`font-typewriter text-xs md:text-sm uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-[#000839]/40'}`}
              animate={isHovered ? { letterSpacing: '0.3em' } : {}}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
            >
              {item.sub}
            </motion.p>
          )}
        </div>

        {/* Duration badge with glow */}
        <motion.div 
          className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full ${isDark ? 'bg-white/5 border border-white/10' : 'bg-[#000839]/5 border border-[#000839]/10'}`}
          animate={isHovered ? { 
            scale: 1.1,
            boxShadow: isDark ? '0 0 20px rgba(255, 255, 255, 0.1)' : '0 0 20px rgba(0, 8, 57, 0.1)'
          } : {}}
          transition={{ duration: 0.3, ease: LUXURY_EASE }}
        >
          <span className={`font-typewriter text-[9px] uppercase tracking-wider font-bold ${isDark ? 'text-white/40' : 'text-[#000839]/40'}`}>
            {item.duration}min
          </span>
        </motion.div>
      </div>
    </motion.div>
  );

  if (speakerLink) {
    return (
      <Link to={speakerLink} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

/* ── Premium Session Section with Adaptive Layout ── */
function SessionSection({
  session,
  items,
  index,
  onInView,
}: {
  session: typeof SESSIONS[0];
  items: AgendaItem[];
  index: number;
  onInView: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-40%' });

  useEffect(() => {
    if (isInView) onInView();
  }, [isInView, onInView]);

  const isDark = session.theme === 'past' || session.theme === 'future';

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, ease: LUXURY_EASE }}
      className={`${session.bg} ${session.text} rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5`}
    >
      {/* Session Header with Magnetic Effect */}
      <motion.div
        className="px-6 md:px-12 py-10 md:py-16 cursor-pointer flex items-center justify-between group"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,8,57,0.02)' }}
      >
        <div className="flex items-center gap-4 md:gap-12">
          <motion.span 
            className={`font-title text-6xl md:text-9xl font-black tracking-tighter ${isDark ? 'text-white/5' : 'text-[#000839]/5'}`}
            animate={expanded ? { scale: 1.1, opacity: 0.1 } : { scale: 1, opacity: 0.05 }}
          >
            0{index + 1}
          </motion.span>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: session.accent }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className={`font-typewriter text-[10px] uppercase tracking-[0.5em] ${isDark ? 'text-white/40' : 'text-[#000839]/40'}`}>
                {session.label}
              </span>
            </div>
            <h2 className="text-4xl md:text-7xl font-title font-black uppercase tracking-tighter leading-[0.85]">
              {session.title}
            </h2>
          </div>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0, scale: expanded ? 1.1 : 1 }}
          transition={{ duration: 0.5, ease: LUXURY_EASE }}
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full border ${isDark ? 'border-white/10' : 'border-[#000839]/10'} flex items-center justify-center group-hover:border-brand-secondary transition-colors`}
        >
          <ChevronDown size={20} className={isDark ? 'text-white/30' : 'text-[#000839]/30'} />
        </motion.div>
      </motion.div>

      {/* Items List with Kinetic Stagger */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: LUXURY_EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-12 pb-12 md:pb-20">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: LUXURY_EASE }}
                className={`h-px ${isDark ? 'bg-white/10' : 'bg-[#000839]/10'} mb-8 origin-left`}
              />
              {items.map((item, i) => (
                <AgendaItemRow key={i} item={item} index={i} isDark={isDark} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ── Main Agenda Page ── */
export default function Agenda() {
  const [activeSession, setActiveSession] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const pastItems = agendaItems.filter(i => i.theme === 'past');
  const presentItems = agendaItems.filter(i => i.theme === 'present');
  const futureItems = agendaItems.filter(i => i.theme === 'future');

  return (
    <div ref={containerRef} className="relative bg-[#f7f4ee]">
      <FloatingBadge activeSession={activeSession} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: LUXURY_EASE }}
        className="pt-40 pb-32"
      >
        <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
          {/* Kinetic Header Inspired by Award Sites */}
          <header className="mb-24 md:mb-40 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: AGGRESSIVE_EASE }}
              className="flex flex-col gap-6 items-center"
            >
              <MaskReveal delay={0.1}>
                <span className="font-typewriter text-[11px] text-brand-secondary tracking-[1.2em] uppercase font-bold">The Assembly</span>
              </MaskReveal>
              <MaskReveal delay={0.2}>
                <h1 className="text-8xl md:text-[15vw] font-title font-black tracking-tighter uppercase leading-[0.75] text-brand-primary">
                  AGENDA
                </h1>
              </MaskReveal>
              <MaskReveal delay={0.4}>
                <p className="font-editorial text-2xl md:text-4xl italic text-brand-secondary mt-4">
                  Time Unfolding.
                </p>
              </MaskReveal>
            </motion.div>

            {/* Quick Jump Magnetic Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: LUXURY_EASE }}
              className="flex items-center gap-4 mt-16"
            >
              {SESSIONS.map((s, i) => (
                <motion.button
                  key={s.label}
                  onClick={() => {
                    setActiveSession(i);
                    document.getElementById(`session-${i}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full font-typewriter text-[10px] uppercase tracking-[0.4em] border transition-all duration-500 ${
                    activeSession === i
                      ? 'bg-[#000839] text-white border-[#000839] shadow-xl'
                      : 'border-[#000839]/10 text-[#000839]/40 hover:border-[#000839]/30 hover:text-[#000839]'
                  }`}
                >
                  0{i + 1} / {s.label}
                </motion.button>
              ))}
            </motion.div>
          </header>

          {/* Sessions Stack */}
          <div className="space-y-12 md:space-y-24">
            <div id="session-0">
              <SessionSection 
                session={SESSIONS[0]} 
                items={pastItems} 
                index={0} 
                onInView={() => setActiveSession(0)} 
              />
            </div>
            <div id="session-1">
              <SessionSection 
                session={SESSIONS[1]} 
                items={presentItems} 
                index={1} 
                onInView={() => setActiveSession(1)} 
              />
            </div>
            <div id="session-2">
              <SessionSection 
                session={SESSIONS[2]} 
                items={futureItems} 
                index={2} 
                onInView={() => setActiveSession(2)} 
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
