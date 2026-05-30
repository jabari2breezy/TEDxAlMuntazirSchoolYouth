import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronDown, Clock, ArrowUpRight, Zap } from 'lucide-react';
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
  { time: '12:15 – 12:30', duration: 15, title: 'Faizaan (Emerson)', topic: 'Finding Your Flow', theme: 'present', isSpeech: true, speakerSlug: 'faizaan-emerson', sub: 'Alum' },
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
        <span className="font-typewriter text-[9px] uppercase tracking-[0.3em] text-white/70">
          Session {activeSession + 1} / 3
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

/* ── Premium Session Section with Spatial Depth ── */
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
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  useEffect(() => {
    if (isInView) onInView();
  }, [isInView, onInView]);

  const isDark = session.theme === 'past' || session.theme === 'future';

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, ease: AGGRESSIVE_EASE }}
      className={`${session.bg} ${session.text} rounded-3xl md:rounded-[2rem] overflow-hidden border ${isDark ? 'border-white/5' : 'border-[#000839]/5'} shadow-2xl`}
    >
      {/* Session Header with kinetic interactions */}
      <motion.div
        className="px-6 md:px-12 py-8 md:py-12 cursor-pointer flex items-center justify-between relative overflow-hidden"
        onClick={() => setExpanded(!expanded)}
        onHoverStart={() => setIsHeaderHovered(true)}
        onHoverEnd={() => setIsHeaderHovered(false)}
      >
        {/* Background gradient on hover */}
        <motion.div
          className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-gradient-to-r from-brand-secondary/0 via-brand-secondary/5 to-brand-secondary/0' : 'bg-gradient-to-r from-brand-secondary/0 via-brand-secondary/3 to-brand-secondary/0'}`}
          initial={{ opacity: 0 }}
          animate={isHeaderHovered ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, ease: LUXURY_EASE }}
        />

        <div className="flex items-center gap-4 md:gap-8 relative z-10">
          <motion.span 
            className={`font-title text-5xl md:text-7xl font-black tracking-tighter ${isDark ? 'text-white/10' : 'text-[#000839]/10'}`}
            animate={isHeaderHovered ? { scale: 1.1, x: 10 } : {}}
            transition={{ duration: 0.3, ease: LUXURY_EASE }}
          >
            0{index + 1}
          </motion.span>
          <div>
            <motion.div 
              className="flex items-center gap-3 mb-1"
              animate={isHeaderHovered ? { x: 4 } : {}}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
            >
              <motion.div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: session.accent }}
                animate={isHeaderHovered ? { scale: 1.5, boxShadow: `0 0 15px ${session.accent}` } : {}}
                transition={{ duration: 0.3, ease: LUXURY_EASE }}
              />
              <span className={`font-typewriter text-[9px] uppercase tracking-[0.4em] ${isDark ? 'text-white/50' : 'text-[#000839]/50'}`}>
                {session.label}
              </span>
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-5xl font-title font-black uppercase tracking-tighter"
              animate={isHeaderHovered ? { letterSpacing: '0.05em' } : {}}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
            >
              {session.title}
            </motion.h2>
          </div>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.4, ease: LUXURY_EASE }}
          className={`w-10 h-10 rounded-full border ${isDark ? 'border-white/15' : 'border-[#000839]/15'} flex items-center justify-center relative z-10`}
          whileHover={{ scale: 1.1, borderColor: session.accent }}
        >
          <ChevronDown size={16} className={isDark ? 'text-white/40' : 'text-[#000839]/40'} />
        </motion.div>
      </motion.div>

      {/* Items with staggered reveal */}
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: AGGRESSIVE_EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-12 pb-8 md:pb-12">
              {/* Duration line with scale animation */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: AGGRESSIVE_EASE }}
                className={`h-px ${isDark ? 'bg-gradient-to-r from-white/0 via-white/20 to-white/0' : 'bg-gradient-to-r from-[#000839]/0 via-[#000839]/20 to-[#000839]/0'} mb-6 origin-left`}
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

/* ── Main Agenda Page with Unified Spatial Canvas ── */
export default function Agenda() {
  const [activeSession, setActiveSession] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const pastItems = agendaItems.filter(i => i.theme === 'past');
  const presentItems = agendaItems.filter(i => i.theme === 'present');
  const futureItems = agendaItems.filter(i => i.theme === 'future');

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-secondary via-brand-secondary to-transparent origin-left z-50"
        style={{ scaleX: progressScale }}
      />

      {/* Floating badge */}
      <FloatingBadge activeSession={activeSession} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.85, ease: LUXURY_EASE }}
        className="pt-40 pb-32"
      >
        <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
          {/* Premium Header with masked reveals */}
          <header className="mb-16 md:mb-24 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.9, y: 100, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
              className="flex flex-col gap-6 overflow-hidden items-center"
            >
              <MaskReveal delay={0.1}>
                <motion.span 
                  className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase font-bold flex items-center gap-2"
                  animate={{ letterSpacing: '0.15em' }}
                  transition={{ duration: 0.8, ease: LUXURY_EASE }}
                >
                  <Zap size={12} />
                  The assembly
                </motion.span>
              </MaskReveal>
              <MaskReveal delay={0.2}>
                <motion.h1 
                  className="text-7xl md:text-[10vw] font-title font-black tracking-tighter uppercase leading-[0.8] text-brand-primary flex flex-col items-center"
                  animate={{ letterSpacing: '-0.02em' }}
                  transition={{ duration: 1, ease: LUXURY_EASE }}
                >
                  <motion.span
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: AGGRESSIVE_EASE }}
                  >
                    Agenda.
                  </motion.span>
                  <motion.span 
                    className="italic font-editorial lowercase text-brand-secondary"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: AGGRESSIVE_EASE }}
                  >
                    Time Unfolding.
                  </motion.span>
                </motion.h1>
              </MaskReveal>
            </motion.div>

            {/* Session quick-jump pills with kinetic hover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: LUXURY_EASE }}
              className="flex items-center gap-3 mt-12 flex-wrap justify-center"
            >
              {SESSIONS.map((s, i) => (
                <motion.button
                  key={s.label}
                  onClick={() => {
                    setActiveSession(i);
                    document.getElementById(`session-${i}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-5 py-2.5 rounded-full font-typewriter text-[9px] uppercase tracking-[0.3em] border transition-all duration-300 font-bold ${
                    activeSession === i
                      ? 'bg-[#000839] text-white border-[#000839] shadow-lg'
                      : 'border-[#000839]/15 text-[#000839]/50 hover:border-[#000839]/30 hover:text-[#000839]/70'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: LUXURY_EASE }}
                >
                  0{i + 1} / {s.label}
                </motion.button>
              ))}
            </motion.div>
          </header>

          {/* Sessions with spatial depth */}
          <div className="space-y-8 md:space-y-12">
            <motion.div 
              id="session-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
            >
              <SessionSection
                session={SESSIONS[0]}
                items={pastItems}
                index={0}
                onInView={() => setActiveSession(0)}
              />
            </motion.div>
            <motion.div 
              id="session-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
            >
              <SessionSection
                session={SESSIONS[1]}
                items={presentItems}
                index={1}
                onInView={() => setActiveSession(1)}
              />
            </motion.div>
            <motion.div 
              id="session-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
            >
              <SessionSection
                session={SESSIONS[2]}
                items={futureItems}
                index={2}
                onInView={() => setActiveSession(2)}
              />
            </motion.div>
          </div>

          {/* Premium Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: AGGRESSIVE_EASE }}
            className="mt-20 md:mt-32 text-center"
          >
            <motion.p 
              className="font-editorial text-xl md:text-2xl italic text-[#000839]/50 mb-10"
              animate={{ letterSpacing: '0.02em' }}
              transition={{ duration: 0.8, ease: LUXURY_EASE }}
            >
              9 speakers. 3 sessions. 1 day that matters.
            </motion.p>
            <Link to="/tickets" className="inline-block">
              <motion.button
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#000839] text-white rounded-full font-typewriter text-[10px] uppercase tracking-[0.3em] font-bold border border-[#000839] shadow-lg"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 20px 60px rgba(0, 8, 57, 0.4)',
                  backgroundColor: '#006d38',
                  borderColor: '#006d38'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: LUXURY_EASE }}
              >
                Secure Your Seat
                <motion.div
                  animate={{ x: 2, y: -2 }}
                  transition={{ duration: 0.3, ease: LUXURY_EASE }}
                >
                  <ArrowUpRight size={14} />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
