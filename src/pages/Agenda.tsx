import { motion } from 'motion/react';
import MaskReveal from '../components/MaskReveal';

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

type Theme = 'past' | 'present' | 'future';

interface AgendaSlot {
  duration: number;
  title: string;
  sub?: string;
  topic?: string;
  theme: Theme;
  isSpeech: boolean;
}

interface AgendaItem {
  time: string;
  title: string;
  sub?: string;
  topic?: string;
  theme: Theme;
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
    };
  });
}

const agendaItems = buildAgenda([
  // Registration + Intro
  { duration: 30, title: 'Registration', sub: 'Doors open at 9:30 AM', theme: 'past', isSpeech: false },
  { duration: 7, title: 'Welcome Address', sub: 'Opening remarks', theme: 'past', isSpeech: false },
  { duration: 10, title: 'Opening Video', sub: '', theme: 'past', isSpeech: false },

  // Session 1: 10:20 – 11:30
  { duration: 18, title: 'Ridhwan Mohammed', topic: 'Borrowed Time, Borrowed Selves', theme: 'past', isSpeech: true },
  { duration: 5, title: 'Nasheed', sub: 'Musical performance', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Anaya Rashid', topic: 'The Culture of Time', theme: 'past', isSpeech: true },
  { duration: 10, title: 'Game', sub: '', theme: 'past', isSpeech: false },
  { duration: 18, title: 'Zahra Datoo', topic: 'Nostalgia', theme: 'past', isSpeech: true },

  // Tea Break: 11:30 – 11:50
  { duration: 20, title: 'Tea Break', sub: 'Refreshments & networking', theme: 'past', isSpeech: false },

  // Session 2: 11:50 – 1:00
  { duration: 18, title: 'Zahra Moledina', topic: 'The Best Thing Since Sliced Bread', theme: 'present', isSpeech: true },
  { duration: 10, title: 'Kahoot / Blooket', sub: '', theme: 'present', isSpeech: false },
  { duration: 18, title: 'Speaker TBA', topic: 'Topic to be announced', theme: 'present', isSpeech: true },
  { duration: 5, title: 'Game', sub: '', theme: 'present', isSpeech: false },
  { duration: 18, title: 'Hassan Abbas Muhammad', topic: 'The Procrastination Paradox', theme: 'present', isSpeech: true },

  // Salah & Food Break: 1:00 – 2:00
  { duration: 60, title: 'Salah & Food Break', sub: 'Prayer and lunch', theme: 'present', isSpeech: false },

  // Session 3: 2:00 – 4:00
  { duration: 18, title: 'Yunus Osman', topic: 'The Art of Scheduling', theme: 'future', isSpeech: true },
  { duration: 10, title: 'Game', sub: '', theme: 'future', isSpeech: false },
  { duration: 18, title: 'Sada Mbaruk', topic: 'End of the World', theme: 'future', isSpeech: true },
  { duration: 10, title: 'Imposter Game', sub: '', theme: 'future', isSpeech: false },
  { duration: 18, title: 'Liyaan Karbelkar', topic: 'How to Take Your Wealth With You', theme: 'future', isSpeech: true },

  // Closing
  { duration: 45, title: 'Closing Ceremony', sub: '', theme: 'future', isSpeech: false },
]);

export default function Agenda() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="pt-40 pb-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] as const }}
        className="px-6 md:px-16 max-w-screen-2xl mx-auto"
      >
        <header className="mb-24 border-b border-brand-outline/30 pb-12 flex flex-col items-center text-center">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] as const }}
          className="space-y-48"
        >
          {[
            { label: 'Past', title: 'Echoes & Foundations', items: agendaItems.filter(i => i.theme === 'past') },
            { label: 'Present', title: 'Presence & Power', items: agendaItems.filter(i => i.theme === 'present') },
            { label: 'Future', title: 'Reimagining Systems', items: agendaItems.filter(i => i.theme === 'future') }
          ].map((section, sIndex) => (
            <div key={section.label} className="space-y-16 border-t border-brand-outline/20 pt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] as const }}
                className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12"
              >
                <span className="font-title text-5xl md:text-7xl font-black uppercase text-brand-secondary tracking-tighter shrink-0">0{sIndex + 1} — {section.label}</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] as const }}
                  className="h-px bg-brand-outline flex-grow origin-left"
                />
                <h2 className="text-3xl md:text-4xl font-title font-black uppercase text-brand-primary tracking-tighter shrink-0">{section.title}</h2>
              </motion.div>

              <div className="py-10 space-y-0">
                {section.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: i * 0.05, duration: 0.6 }}
                    className="relative group border-t border-brand-outline/15 py-16 first:border-t-0"
                  >
                    <div className="space-y-6">
                      <MaskReveal delay={i * 0.05}>
                        <span className="font-typewriter text-2xl md:text-4xl text-brand-primary/20 group-hover:text-brand-secondary transition-colors duration-500">
                          {item.time}
                        </span>
                      </MaskReveal>
                      <div className="space-y-3 overflow-hidden">
                        <MaskReveal delay={0.08 + i * 0.05}>
                          <h3 className="text-4xl md:text-7xl font-title font-black uppercase text-brand-primary tracking-tight">
                            {item.title}
                          </h3>
                        </MaskReveal>
                        {item.topic && (
                          <MaskReveal delay={0.1 + i * 0.05}>
                            <p className="font-editorial text-2xl md:text-4xl text-brand-secondary/90 italic leading-tight max-w-4xl">
                              {item.topic}
                            </p>
                          </MaskReveal>
                        )}
                        {item.sub && (
                          <MaskReveal delay={0.12 + i * 0.05}>
                            <p className="font-typewriter text-sm md:text-base uppercase tracking-[0.25em] text-brand-primary/40">
                              {item.sub}
                            </p>
                          </MaskReveal>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
