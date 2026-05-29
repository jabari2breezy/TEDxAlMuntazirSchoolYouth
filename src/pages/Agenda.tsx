import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import MaskReveal from '../components/MaskReveal';
import { ChevronDown, Clock, Users } from 'lucide-react';

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
  startMin: number;
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
      startMin: start,
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

const THEME_COLORS: Record<Theme, { accent: string; bg: string; dot: string; border: string }> = {
  past: { accent: 'text-brand-secondary', bg: 'bg-brand-secondary/5', dot: 'bg-brand-secondary', border: 'border-brand-secondary/20' },
  present: { accent: 'text-[#e62b1e]', bg: 'bg-[#e62b1e]/5', dot: 'bg-[#e62b1e]', border: 'border-[#e62b1e]/20' },
  future: { accent: 'text-brand-primary', bg: 'bg-brand-primary/5', dot: 'bg-brand-primary', border: 'border-brand-primary/20' },
};

const SECTION_META: Record<Theme, { label: string; title: string; time: string }> = {
  past: { label: 'Session 1', title: 'Echoes & Foundations', time: '10:20 – 11:30' },
  present: { label: 'Session 2', title: 'Presence & Power', time: '11:50 – 1:00' },
  future: { label: 'Session 3', title: 'Reimagining Systems', time: '2:00 – 4:00' },
};

/* ── Floating Session Badge ── */
function FloatingBadge({ activeSection }: { activeSection: Theme | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-24 left-6 md:left-10 z-50"
    >
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3, ease: LUXURY_EASE }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${THEME_COLORS[activeSection].border} bg-white/80 backdrop-blur-md shadow-sm`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${THEME_COLORS[activeSection].dot}`} />
            <span className="font-typewriter text-[9px] uppercase tracking-[0.2em] text-brand-primary/60">
              {SECTION_META[activeSection].label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Agenda Item Row ── */
function AgendaRow({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: AgendaItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const colors = THEME_COLORS[item.theme];
  const isSpeaker = item.isSpeech;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: LUXURY_EASE }}
      className={`relative group border-t ${colors.border} ${isSpeaker ? 'py-8 md:py-10' : 'py-5 md:py-6'}`}
    >
      <div className="flex items-start gap-4 md:gap-8">
        {/* Timeline dot */}
        <div className="flex flex-col items-center pt-2 shrink-0">
          <motion.div
            whileInView={{ scale: [0, 1.3, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.04 + 0.2 }}
            className={`w-2 h-2 rounded-full ${colors.dot} ${isSpeaker ? 'shadow-[0_0_8px_rgba(0,109,56,0.3)]' : ''}`}
          />
          {isSpeaker && (
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.04 + 0.3 }}
              className={`w-px ${colors.dot} opacity-20 mt-2`}
            />
          )}
        </div>

        {/* Time — parallax effect */}
        <motion.div
          className="w-24 md:w-32 shrink-0 pt-0.5"
          whileInView={{ x: [10, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.04 + 0.1, ease: LUXURY_EASE }}
        >
          <span className="font-typewriter text-sm md:text-base text-brand-primary/25 group-hover:text-brand-primary/50 transition-colors duration-300">
            {item.time.split(' – ')[0]}
          </span>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className={`flex items-start justify-between gap-4 ${isSpeaker ? 'cursor-pointer' : ''}`}
            onClick={isSpeaker ? onToggle : undefined}
          >
            <div className="min-w-0">
              <MaskReveal delay={index * 0.04}>
                <h3 className={`font-title font-black uppercase tracking-tight leading-none ${
                  isSpeaker ? 'text-xl md:text-3xl text-brand-primary' : 'text-base md:text-lg text-brand-primary/50'
                }`}>
                  {item.title}
                </h3>
              </MaskReveal>
              {item.topic && (
                <MaskReveal delay={0.05 + index * 0.04}>
                  <p className={`font-editorial italic mt-1 ${
                    isSpeaker ? 'text-base md:text-xl text-brand-secondary/80' : 'text-sm text-brand-primary/30'
                  }`}>
                    {item.topic}
                  </p>
                </MaskReveal>
              )}
              {item.sub && !item.topic && (
                <MaskReveal delay={0.05 + index * 0.04}>
                  <p className="font-typewriter text-xs uppercase tracking-[0.2em] text-brand-primary/30 mt-1">
                    {item.sub}
                  </p>
                </MaskReveal>
              )}
            </div>

            {/* Expand arrow for speakers */}
            {isSpeaker && item.speakerSlug && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: LUXURY_EASE }}
                className="shrink-0 mt-1"
              >
                <ChevronDown size={16} className="text-brand-primary/20" />
              </motion.div>
            )}
          </div>

          {/* Expanded speaker details */}
          <AnimatePresence>
            {isExpanded && isSpeaker && item.speakerSlug && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: LUXURY_EASE }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 flex items-center gap-4">
                  <Link
                    to="/speakers"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${colors.border} ${colors.accent} font-typewriter text-[9px] uppercase tracking-[0.2em] hover:bg-brand-secondary/10 transition-all duration-300`}
                  >
                    <Users size={12} />
                    View Speaker Profile
                  </Link>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-brand-primary/20" />
                    <span className="font-typewriter text-[9px] text-brand-primary/30">
                      {item.duration} mins
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Agenda Page ── */
export default function Agenda() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<Theme | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sections: { theme: Theme; items: AgendaItem[] }[] = [
    { theme: 'past', items: agendaItems.filter(i => i.theme === 'past') },
    { theme: 'present', items: agendaItems.filter(i => i.theme === 'present') },
    { theme: 'future', items: agendaItems.filter(i => i.theme === 'future') },
  ];

  return (
    <div ref={containerRef} className="relative">
      <FloatingBadge activeSection={activeSection} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.85, ease: LUXURY_EASE }}
        className="pt-40 pb-32"
      >
        <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
          {/* Header */}
          <header className="mb-20 md:mb-32 border-b border-brand-outline/30 pb-12 flex flex-col items-center text-center">
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

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-6 md:gap-10 mt-10"
            >
              {[
                { label: 'Sessions', value: '3' },
                { label: 'Speakers', value: '9' },
                { label: 'Duration', value: '6.5h' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="font-title text-2xl md:text-3xl font-black text-brand-primary">{stat.value}</span>
                  <span className="block font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/30 mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </header>

          {/* Sections */}
          <div className="max-w-4xl mx-auto space-y-20 md:space-y-32">
            {sections.map((section, sIndex) => {
              const meta = SECTION_META[section.theme];
              const colors = THEME_COLORS[section.theme];
              return (
                <SectionBlock
                  key={section.theme}
                  section={section}
                  meta={meta}
                  colors={colors}
                  sIndex={sIndex}
                  expandedItem={expandedItem}
                  onToggle={(idx) => setExpandedItem(expandedItem === idx ? null : idx)}
                  onInView={(theme) => setActiveSection(theme)}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Section Block with scroll-driven bg shift ── */
function SectionBlock({
  section,
  meta,
  colors,
  sIndex,
  expandedItem,
  onToggle,
  onInView,
}: {
  section: { theme: Theme; items: AgendaItem[] };
  meta: { label: string; title: string; time: string };
  colors: { accent: string; bg: string; dot: string; border: string };
  sIndex: number;
  expandedItem: number;
  onToggle: (idx: number) => void;
  onInView: (theme: Theme) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      onViewportEnter={() => onInView(section.theme)}
      viewport={{ once: false, margin: '-40%' }}
      className="relative"
    >
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 mb-10 md:mb-16">
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: LUXURY_EASE }}
            className="font-title text-4xl md:text-6xl font-black tracking-tighter"
          >
            <span className={colors.accent}>0{sIndex + 1}</span>
          </motion.span>
          <div className="flex flex-col">
            <MaskReveal delay={0.1}>
              <span className={`font-typewriter text-[9px] uppercase tracking-[0.3em] ${colors.accent}`}>
                {meta.label}
              </span>
            </MaskReveal>
            <MaskReveal delay={0.15}>
              <h2 className="text-2xl md:text-3xl font-title font-black uppercase text-brand-primary tracking-tighter">
                {meta.title}
              </h2>
            </MaskReveal>
          </div>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.2 }}
          className="h-px bg-brand-outline flex-grow origin-left hidden md:block"
        />
        <MaskReveal delay={0.25}>
          <span className="font-typewriter text-[10px] text-brand-primary/30 shrink-0">
            {meta.time}
          </span>
        </MaskReveal>
      </div>

      {/* Items */}
      <div className="relative">
        {section.items.map((item, i) => (
          <AgendaRow
            key={`${section.theme}-${i}`}
            item={item}
            index={i}
            isExpanded={expandedItem === (sIndex * 100 + i)}
            onToggle={() => onToggle(sIndex * 100 + i)}
          />
        ))}
      </div>
    </motion.div>
  );
}
