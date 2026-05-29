import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import MaskReveal from '../components/MaskReveal';
import { SPEAKERS } from '../constants';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

type Theme = 'past' | 'present' | 'future';

interface AgendaSlot {
  duration: number;
  title: string;
  sub?: string;
  topic?: string;
  theme: Theme;
  isSpeech: boolean;
  speakerId?: string;
}

interface AgendaItem {
  time: string;
  title: string;
  sub?: string;
  topic?: string;
  theme: Theme;
  isSpeech: boolean;
  speakerId?: string;
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
      speakerId: slot.speakerId,
    };
  });
}

const agendaItems = buildAgenda([
  { duration: 30, title: 'Registration', sub: 'Doors open at 9:30 AM', theme: 'past', isSpeech: false },
  { duration: 7, title: 'Welcome Address', sub: 'Opening remarks', theme: 'past', isSpeech: false },
  { duration: 10, title: 'Opening Video', sub: '', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Ridhwan Mohammed', topic: 'Borrowed Time, Borrowed Selves', theme: 'past', isSpeech: true, speakerId: '1' },
  { duration: 5, title: 'Nasheed', sub: 'Musical performance', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Anaya Rashid', topic: 'The Culture of Time', theme: 'past', isSpeech: true, speakerId: '2' },
  { duration: 10, title: 'Game', sub: '', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Zahra Datoo', topic: 'Nostalgia', theme: 'past', isSpeech: true, speakerId: '3' },
  { duration: 20, title: 'Tea Break', sub: 'Refreshments & networking', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Zahra Moledina', topic: 'The Best Thing Since Sliced Bread', theme: 'present', isSpeech: true, speakerId: '4' },
  { duration: 10, title: 'Kahoot / Blooket', sub: '', theme: 'present', isSpeech: false },
  { duration: 18, title: 'Speaker TBA', topic: 'Topic to be announced', theme: 'present', isSpeech: true },
  { duration: 5, title: 'Game', sub: '', theme: 'present', isSpeech: false },
  { duration: 18, title: 'Hassan Abbas Muhammad', topic: 'The Procrastination Paradox', theme: 'present', isSpeech: true, speakerId: '5' },
  { duration: 60, title: 'Salah & Food Break', sub: 'Prayer and lunch', theme: 'present', isSpeech: false },
  { duration: 18, title: 'Yunus Osman', topic: 'The Art of Scheduling', theme: 'future', isSpeech: true, speakerId: '6' },
  { duration: 10, title: 'Game', sub: '', theme: 'future', isSpeech: false },
  { duration: 18, title: 'Sada Mbaruk', topic: 'End of the World', theme: 'future', isSpeech: true, speakerId: '7' },
  { duration: 10, title: 'Imposter Game', sub: '', theme: 'future', isSpeech: false },
  { duration: 18, title: 'Liyaan Karbelkar', topic: 'How to Take Your Wealth With You', theme: 'future', isSpeech: true, speakerId: '8' },
  { duration: 45, title: 'Closing Ceremony', sub: '', theme: 'future', isSpeech: false },
]);

const SESSION_CONFIG = {
  past: { label: 'Session 1', title: 'Echoes & Foundations', color: '#006d38', bg: 'bg-brand-secondary/5', border: 'border-brand-secondary/30', dot: 'bg-brand-secondary', text: 'text-brand-secondary' },
  present: { label: 'Session 2', title: 'Presence & Power', color: '#000839', bg: 'bg-brand-primary/5', border: 'border-brand-primary/30', dot: 'bg-brand-primary', text: 'text-brand-primary' },
  future: { label: 'Session 3', title: 'Reimagining Systems', color: '#8a5a44', bg: 'bg-amber-800/5', border: 'border-amber-800/30', dot: 'bg-amber-800', text: 'text-amber-800' },
};

/* ── Floating Session Badge ── */
function FloatingBadge({ activeSession }: { activeSession: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-white/90 backdrop-blur-md border border-brand-outline/20 rounded-full px-6 py-2.5 shadow-lg shadow-brand-primary/5">
        <span className="font-typewriter text-[9px] uppercase tracking-[0.3em] text-brand-primary/60">
          Session {activeSession} / 3
        </span>
      </div>
    </motion.div>
  );
}

/* ── Timeline Line (animated on scroll) ── */
function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-brand-outline/10">
      <motion.div
        className="w-full bg-brand-secondary/40 origin-top"
        style={{ height }}
      />
    </div>
  );
}

/* ── Agenda Item Component ── */
function AgendaItemCard({
  item,
  index,
  globalIndex,
}: {
  item: AgendaItem;
  index: number;
  globalIndex: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const speaker = item.speakerId ? SPEAKERS.find(s => s.id === item.speakerId) : null;
  const config = SESSION_CONFIG[item.theme];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: LUXURY_EASE }}
      className="relative pl-12 md:pl-20 group"
      onMouseEnter={() => item.isSpeech && setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Timeline dot */}
      <div className={`absolute left-2.5 md:left-6.5 top-6 w-3 h-3 rounded-full ${config.dot} border-2 border-white z-10 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(0,109,56,0.4)]`}>
        {item.isSpeech && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.dot}`}
            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Content card */}
      <div
        className={`relative rounded-2xl border ${config.border} ${config.bg} backdrop-blur-sm p-5 md:p-7 transition-all duration-500 cursor-default ${
          item.isSpeech ? 'hover:shadow-lg hover:shadow-brand-primary/5 hover:border-brand-secondary/40 hover:scale-[1.01]' : ''
        }`}
        onClick={() => item.isSpeech && setExpanded(!expanded)}
      >
        {/* Time */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`font-typewriter text-xs md:text-sm ${config.text} opacity-60 tracking-wider`}>
            {item.time}
          </span>
          {item.isSpeech && speaker && (
            <span className="font-typewriter text-[8px] uppercase tracking-[0.2em] text-brand-primary/20">
              Speaker
            </span>
          )}
        </div>

        {/* Title row with avatar */}
        <div className="flex items-center gap-4">
          {speaker && (
            <Link to={`/speakers`} className="shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-brand-secondary/50 transition-all duration-300">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-3xl font-title font-black uppercase text-brand-primary tracking-tight leading-tight truncate">
              {item.title}
            </h3>
            {item.topic && (
              <p className="font-editorial text-sm md:text-xl text-brand-secondary/80 italic mt-1 leading-tight">
                {item.topic}
              </p>
            )}
            {item.sub && !item.topic && (
              <p className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-primary/35 mt-1">
                {item.sub}
              </p>
            )}
          </div>
        </div>

        {/* Expandable description */}
        <AnimatePresence>
          {expanded && speaker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: LUXURY_EASE }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-brand-outline/10">
                <p className="font-sans text-xs md:text-sm text-brand-primary/50 leading-relaxed line-clamp-3">
                  {speaker.bio}
                </p>
                <Link
                  to={`/speakers`}
                  className="inline-flex items-center gap-1.5 mt-3 font-typewriter text-[9px] uppercase tracking-[0.2em] text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  View full profile →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint for speeches */}
        {item.isSpeech && !expanded && (
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="font-typewriter text-[8px] uppercase tracking-[0.2em] text-brand-primary/20">
              Hover to preview
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Agenda Component ── */
export default function Agenda() {
  const [activeSession, setActiveSession] = useState(1);
  const session1Ref = useRef<HTMLDivElement>(null);
  const session2Ref = useRef<HTMLDivElement>(null);
  const session3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const session = entry.target.getAttribute('data-session');
            if (session) setActiveSession(Number(session));
          }
        });
      },
      { threshold: 0.3 }
    );

    [session1Ref, session2Ref, session3Ref].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const sessions = [
    { ref: session1Ref, session: 1, label: 'Session 1', title: 'Echoes & Foundations', theme: 'past' as Theme, items: agendaItems.filter(i => i.theme === 'past') },
    { ref: session2Ref, session: 2, label: 'Session 2', title: 'Presence & Power', theme: 'present' as Theme, items: agendaItems.filter(i => i.theme === 'present') },
    { ref: session3Ref, session: 3, label: 'Session 3', title: 'Reimagining Systems', theme: 'future' as Theme, items: agendaItems.filter(i => i.theme === 'future') },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Floating session badge */}
      <FloatingBadge activeSession={activeSession} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.85, ease: LUXURY_EASE }}
        className="pt-32 md:pt-40 pb-32"
      >
        <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
          {/* Header */}
          <header className="mb-16 md:mb-24 border-b border-brand-outline/30 pb-12 flex flex-col items-center text-center">
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
          </header>

          {/* Sessions */}
          <div className="space-y-24 md:space-y-40">
            {sessions.map((s) => {
              const config = SESSION_CONFIG[s.theme];
              return (
                <div key={s.session} ref={s.ref} data-session={s.session} className="relative">
                  {/* Session header */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.8, ease: LUXURY_EASE }}
                    className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 mb-12 md:mb-16"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${config.dot}`} />
                      <span className={`font-title text-4xl md:text-6xl font-black uppercase ${config.text} tracking-tighter`}>
                        {s.label}
                      </span>
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: LUXURY_EASE, delay: 0.2 }}
                      className={`h-px flex-grow origin-left`}
                      style={{ backgroundColor: `${config.color}30` }}
                    />
                    <h2 className="text-2xl md:text-3xl font-title font-black uppercase text-brand-primary tracking-tighter shrink-0">
                      {s.title}
                    </h2>
                  </motion.div>

                  {/* Timeline */}
                  <div className="relative">
                    <TimelineLine />
                    <div className="space-y-4 md:space-y-6">
                      {s.items.map((item, i) => (
                        <AgendaItemCard
                          key={i}
                          item={item}
                          index={i}
                          globalIndex={agendaItems.indexOf(item)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
