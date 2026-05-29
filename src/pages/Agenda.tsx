import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronDown, Clock, ArrowUpRight } from 'lucide-react';
import MaskReveal from '../components/MaskReveal';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

type Theme = 'past' | 'present' | 'future';

interface AgendaSlot {
  duration: number;
  title: string;
  sub?: string;
  topic?: string;
  theme: Theme;
  isSpeech: boolean;
  speakerSlug?: string;
}

interface AgendaItem {
  time: string;
  title: string;
  sub?: string;
  topic?: string;
  theme: Theme;
  isSpeech: boolean;
  speakerSlug?: string;
}

function roundToNextFive(minutes: number): number {
  return Math.ceil(minutes / 5) * 5;
}

function formatClock(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}

function buildAgenda(slots: AgendaSlot[], startMinutes = 9 * 60 + 30): AgendaItem[] {
  let current = startMinutes;
  return slots.map((slot) => {
    const start = current;
    const rawEnd = start + slot.duration;
    const end = slot.isSpeech ? roundToNextFive(rawEnd) : rawEnd;
    current = end;
    return {
      time: `${formatClock(start)} – ${formatClock(end)}`,
      title: slot.title,
      sub: slot.sub,
      topic: slot.topic,
      theme: slot.theme,
      isSpeech: slot.isSpeech,
      speakerSlug: slot.speakerSlug,
    };
  });
}

const agendaItems = buildAgenda([
  { duration: 30, title: 'Registration', sub: 'Doors open at 9:30 AM', theme: 'past', isSpeech: false },
  { duration: 7, title: 'Welcome Address', sub: 'Opening remarks', theme: 'past', isSpeech: false },
  { duration: 10, title: 'Opening Video', sub: '', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Ridhwan Mohammed', topic: 'Borrowed Time, Borrowed Selves', theme: 'past', isSpeech: true, speakerSlug: 'ridhwan-mohamed' },
  { duration: 5, title: 'Nasheed', sub: 'Musical performance', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Anaya Rashid', topic: 'The Culture of Time', theme: 'past', isSpeech: true, speakerSlug: 'anaya-rashid' },
  { duration: 10, title: 'Game', sub: '', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Zahra Datoo', topic: 'Nostalgia', theme: 'past', isSpeech: true, speakerSlug: 'zahra-datoo' },
  { duration: 20, title: 'Tea Break', sub: 'Refreshments & networking', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Zahra Moledina', topic: 'The Best Thing Since Sliced Bread', theme: 'present', isSpeech: true, speakerSlug: 'zahra-moledina' },
  { duration: 10, title: 'Kahoot / Blooket', sub: '', theme: 'present', isSpeech: false },
  { duration: 18, title: 'Speaker TBA', topic: 'Topic to be announced', theme: 'present', isSpeech: true },
  { duration: 5, title: 'Game', sub: '', theme: 'present', isSpeech: false },
  { duration: 18, title: 'Hassan Abbas Muhammad', topic: 'The Procrastination Paradox', theme: 'present', isSpeech: true, speakerSlug: 'hassan-abbas' },
  { duration: 60, title: 'Salah & Food Break', sub: 'Prayer and lunch', theme: 'present', isSpeech: false },
  { duration: 18, title: 'Yunus Osman', topic: 'The Art of Scheduling', theme: 'future', isSpeech: true, speakerSlug: 'yunus-osman' },
  { duration: 10, title: 'Game', sub: '', theme: 'future', isSpeech: false },
  { duration: 18, title: 'Sada Mbaruk', topic: 'End of the World', theme: 'future', isSpeech: true, speakerSlug: 'sada-mbaruk-said' },
  { duration: 10, title: 'Imposter Game', sub: '', theme: 'future', isSpeech: false },
  { duration: 18, title: 'Liyaan Karbelkar', topic: 'How to Take Your Wealth With You', theme: 'future', isSpeech: true, speakerSlug: 'liyaan-karbelkar' },
  { duration: 45, title: 'Closing Ceremony', sub: '', theme: 'future', isSpeech: false },
]);

const SESSIONS = [
  { label: 'Past', title: 'Echoes & Foundations', theme: 'past', bg: 'bg-[#0a0c12]', text: 'text-white', accent: '#006d38' },
  { label: 'Present', title: 'Presence & Power', theme: 'present', bg: 'bg-[#f7f4ee]', text: 'text-[#000839]', accent: '#006d38' },
  { label: 'Future', title: 'Reimagining Systems', theme: 'future', bg: 'bg-[#000839]', text: 'text-white', accent: '#006d38' },
];

/* ── Floating Session Badge ── */
function FloatingBadge({ activeSession }: { activeSession: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[#000839]/90 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
        <Clock size={12} className="text-brand-secondary" />
        <span className="font-typewriter text-[9px] uppercase tracking-[0.3em] text-white/60">
          Session {activeSession + 1} / 3
        </span>
        <div className="w-px h-3 bg-white/20" />
        <span className="font-typewriter text-[9px] uppercase tracking-[0.2em] text-brand-secondary">
          {SESSIONS[activeSession]?.label}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Agenda Item ── */
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

  const speakerLink = item.isSpeech && item.speakerSlug
    ? `/speakers`
    : undefined;

  const content = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.06, ease: LUXURY_EASE }}
      className={`group relative border-t ${isDark ? 'border-white/8' : 'border-[#000839]/10'} py-8 md:py-12 first:border-t-0`}
    >
      {/* Pulsing dot for speeches */}
      {item.isSpeech && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(50%+1px)]">
          <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-brand-secondary' : 'bg-brand-secondary'}`}>
            <div className="absolute inset-0 rounded-full bg-brand-secondary/40 animate-ping" />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8">
        {/* Time — parallax effect via slight y-shift */}
        <motion.span
          style={{ y: isInView ? 0 : 10 }}
          transition={{ duration: 0.5, delay: index * 0.04 }}
          className={`font-typewriter text-lg md:text-2xl ${isDark ? 'text-white/25' : 'text-[#000839]/25'} group-hover:text-brand-secondary transition-colors duration-500 shrink-0 w-36 md:w-48`}
        >
          {item.time}
        </motion.span>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className={`text-2xl md:text-4xl font-title font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#000839]'}`}>
              {item.title}
            </h3>
            {item.isSpeech && item.speakerSlug && (
              <ArrowUpRight size={14} className={`${isDark ? 'text-white/20' : 'text-[#000839]/20'} group-hover:text-brand-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`} />
            )}
          </div>
          {item.topic && (
            <p className={`font-editorial text-lg md:text-2xl italic ${isDark ? 'text-brand-secondary/80' : 'text-brand-secondary/90'} leading-tight`}>
              {item.topic}
            </p>
          )}
          {item.sub && (
            <p className={`font-typewriter text-xs md:text-sm uppercase tracking-[0.2em] ${isDark ? 'text-white/30' : 'text-[#000839]/30'}`}>
              {item.sub}
            </p>
          )}
        </div>

        {/* Duration badge */}
        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full ${isDark ? 'bg-white/5' : 'bg-[#000839]/5'}`}>
          <span className={`font-typewriter text-[9px] uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-[#000839]/30'}`}>
            {item.duration}min
          </span>
        </div>
      </div>
    </motion.div>
  );

  if (speakerLink) {
    return (
      <Link to={speakerLink} className="block hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }
  return content;
}

/* ── Session Section ── */
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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, ease: LUXURY_EASE }}
      className={`${session.bg} ${session.text} rounded-3xl md:rounded-[2rem] overflow-hidden`}
    >
      {/* Session Header */}
      <div
        className="px-6 md:px-12 py-8 md:py-12 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 md:gap-8">
          <span className={`font-title text-5xl md:text-7xl font-black tracking-tighter ${isDark ? 'text-white/10' : 'text-[#000839]/10'}`}>
            0{index + 1}
          </span>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: session.accent }} />
              <span className={`font-typewriter text-[9px] uppercase tracking-[0.4em] ${isDark ? 'text-white/40' : 'text-[#000839]/40'}`}>
                {session.label}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-title font-black uppercase tracking-tighter">
              {session.title}
            </h2>
          </div>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-10 h-10 rounded-full border ${isDark ? 'border-white/15' : 'border-[#000839]/15'} flex items-center justify-center`}
        >
          <ChevronDown size={16} className={isDark ? 'text-white/40' : 'text-[#000839]/40'} />
        </motion.div>
      </div>

      {/* Items */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: LUXURY_EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-12 pb-8 md:pb-12">
              {/* Duration line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: LUXURY_EASE }}
                className={`h-px ${isDark ? 'bg-white/8' : 'bg-[#000839]/8'} mb-4 origin-left`}
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

/* ── Main Page ── */
export default function Agenda() {
  const [activeSession, setActiveSession] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const pastItems = agendaItems.filter(i => i.theme === 'past');
  const presentItems = agendaItems.filter(i => i.theme === 'present');
  const futureItems = agendaItems.filter(i => i.theme === 'future');

  return (
    <div ref={containerRef} className="relative">
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
          {/* Header */}
          <header className="mb-16 md:mb-24 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.9, y: 100, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="flex flex-col gap-4 overflow-hidden items-center"
            >
              <MaskReveal delay={0.1}>
                <span className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase">The assembly</span>
              </MaskReveal>
              <MaskReveal delay={0.2}>
                <h1 className="text-7xl md:text-[10vw] font-title font-black tracking-tighter uppercase leading-[0.8] text-brand-primary flex flex-col items-center">
                  <span>Agenda.</span>
                  <span className="italic font-editorial lowercase text-brand-secondary">Time Unfolding.</span>
                </h1>
              </MaskReveal>
            </motion.div>

            {/* Session quick-jump pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center gap-3 mt-10"
            >
              {SESSIONS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setActiveSession(i);
                    document.getElementById(`session-${i}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 rounded-full font-typewriter text-[9px] uppercase tracking-[0.3em] border transition-all duration-300 ${
                    activeSession === i
                      ? 'bg-[#000839] text-white border-[#000839]'
                      : 'border-[#000839]/15 text-[#000839]/50 hover:border-[#000839]/30'
                  }`}
                >
                  0{i + 1} / {s.label}
                </button>
              ))}
            </motion.div>
          </header>

          {/* Sessions */}
          <div className="space-y-6 md:space-y-10">
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

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: LUXURY_EASE }}
            className="mt-16 md:mt-24 text-center"
          >
            <p className="font-editorial text-xl md:text-2xl italic text-[#000839]/40 mb-8">
              9 speakers. 3 sessions. 1 day that matters.
            </p>
            <Link
              to="/tickets"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#000839] text-white rounded-full font-typewriter text-[10px] uppercase tracking-[0.3em] hover:bg-brand-secondary transition-colors duration-500"
            >
              Secure Your Seat
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
