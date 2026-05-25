import { motion } from 'motion/react';
import type { FC, ReactNode } from 'react';
import { resolveSpeakerVisual, type SpeakerVisualKey } from './speakerVisuals';

interface SpeakerTopicVisualProps {
  name: string;
  topic: string;
  image?: string;
}

/** Frosted exhibition case — high contrast on light backgrounds */
function Vitrine({
  label,
  children,
  image,
}: {
  label: string;
  children: ReactNode;
  image?: string;
}) {
  return (
    <div className="relative w-full max-w-[340px] mx-auto">
      {/* Plinth */}
      <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-b from-white/80 to-brand-surface/60 border border-white/90 shadow-[0_28px_80px_rgba(0,8,57,0.12)]" />

      <div className="relative rounded-[1.5rem] border border-brand-primary/10 bg-gradient-to-br from-brand-primary/[0.06] via-white/70 to-brand-secondary/[0.08] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
        <div className="absolute inset-0 opacity-[0.35] pointer-events-none bg-[linear-gradient(rgba(0,8,57,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,8,57,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative px-5 pt-5 pb-6 min-h-[280px] md:min-h-[300px] flex flex-col">
          <span className="font-typewriter text-[8px] uppercase tracking-[0.45em] text-brand-primary/45 mb-4">
            {label}
          </span>

          <div className="flex-1 flex items-center justify-center py-2">{children}</div>

          {image && (
            <div className="absolute bottom-4 right-4 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-white shadow-lg ring-1 ring-brand-primary/10">
              <img src={image} alt="" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/30 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeritageArt() {
  return (
    <div className="relative w-56 h-44">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-4 right-4 h-24 rounded-md border border-brand-primary/15 bg-gradient-to-br from-white to-brand-surface shadow-md"
          style={{ top: i * 14, zIndex: 3 - i }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <svg className="absolute bottom-0 right-2 w-16 h-16 text-brand-primary" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
        <path d="M32 10v22l14 8" stroke="#006d38" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CultureTimeArt() {
  return (
    <motion.div
      className="relative w-48 h-48"
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-brand-primary/20" />
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-[46%] h-px bg-brand-primary/25 origin-left"
          style={{ transform: `rotate(${i * 45}deg)` }}
        />
      ))}
      <div className="absolute inset-5 rounded-full bg-white border-2 border-brand-secondary/30 shadow-inner flex items-center justify-center">
        <span className="font-typewriter text-[9px] text-brand-primary uppercase tracking-[0.35em]">Culture</span>
      </div>
    </motion.div>
  );
}

function NostalgiaArt() {
  return (
    <div className="flex items-end justify-center gap-2 h-44 w-56">
      {[72, 100, 56, 88].map((h, i) => (
        <motion.div
          key={i}
          className="w-9 rounded-t-sm bg-gradient-to-t from-brand-primary/40 to-white border border-brand-primary/20 shadow-lg"
          style={{ height: h }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.5, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function CapitalismArt() {
  return (
    <div className="relative w-44 h-44">
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#000839" strokeWidth="2" opacity="0.25" />
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="60"
            y1="14"
            x2="60"
            y2="22"
            stroke="#000839"
            strokeWidth="1.5"
            opacity="0.35"
            transform={`rotate(${i * 30} 60 60)`}
          />
        ))}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '60px 60px' }}
        >
          <line x1="60" y1="60" x2="60" y2="28" stroke="#006d38" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
        <text x="60" y="68" textAnchor="middle" fontSize="22" fill="#000839" fontWeight="700">
          $
        </text>
      </svg>
    </div>
  );
}

function ProcrastinationArt() {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-40 h-40">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#000839" strokeWidth="2" strokeDasharray="6 8" opacity="0.35" />
        <line x1="50" y1="50" x2="70" y2="36" stroke="#006d38" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <motion.span
        className="absolute top-2 right-6 font-title text-3xl text-brand-primary/25"
        animate={{ opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        zzz
      </motion.span>
      <span className="absolute bottom-6 left-6 px-3 py-1.5 rounded-full bg-white border border-brand-outline/30 font-typewriter text-[8px] uppercase tracking-widest text-brand-primary/60 shadow-sm">
        Later
      </span>
    </div>
  );
}

function SchedulingArt() {
  return (
    <div className="grid grid-cols-4 gap-2 w-52">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={`aspect-square rounded-md border shadow-sm ${
            i % 4 === 0
              ? 'bg-brand-secondary/25 border-brand-secondary/40'
              : 'bg-white border-brand-primary/15'
          }`}
          animate={i % 4 === 0 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, delay: i * 0.08, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function ThreeClocksArt() {
  const items = [
    { label: 'Climate', color: '#006d38' },
    { label: 'Life', color: '#000839' },
    { label: 'AI', color: '#767681' },
  ];
  return (
    <div className="flex gap-5 items-end justify-center">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.8, delay: i * 0.35, repeat: Infinity }}
        >
          <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-white border-2 border-brand-primary/15 shadow-lg flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <circle cx="20" cy="20" r="15" fill="none" stroke={item.color} strokeWidth="1.5" />
              <line x1="20" y1="20" x2="20" y2="9" stroke={item.color} strokeWidth="2" />
            </svg>
          </div>
          <span className="font-typewriter text-[7px] uppercase tracking-widest text-brand-primary/50">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function LegacyArt() {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-brand-secondary/30 bg-brand-secondary/5"
          style={{ width: 48 + i * 32, height: 48 + i * 32 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.2, 0.55] }}
          transition={{ duration: 3.5, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
      <div className="relative z-10 w-12 h-12 rounded-full bg-brand-secondary/30 border-2 border-brand-secondary shadow-md" />
    </div>
  );
}

function DefaultArt({ image }: { image?: string }) {
  if (image) {
    return (
      <div className="w-40 h-52 rounded-2xl overflow-hidden border-2 border-white shadow-xl ring-1 ring-brand-primary/10">
        <img src={image} alt="" className="w-full h-full object-cover object-top" />
      </div>
    );
  }
  return (
    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/15" />
  );
}

const ART: Record<SpeakerVisualKey, FC<{ image?: string }>> = {
  heritage: () => <HeritageArt />,
  'culture-time': () => <CultureTimeArt />,
  nostalgia: () => <NostalgiaArt />,
  'capitalism-clock': () => <CapitalismArt />,
  procrastination: () => <ProcrastinationArt />,
  scheduling: () => <SchedulingArt />,
  'three-clocks': () => <ThreeClocksArt />,
  legacy: () => <LegacyArt />,
  default: DefaultArt,
};

const LABELS: Record<SpeakerVisualKey, string> = {
  heritage: 'Echoes / Past',
  'culture-time': 'Culture of Time',
  nostalgia: 'Architecture of Nostalgia',
  'capitalism-clock': "Capitalism's Clock",
  procrastination: 'The Paradox',
  scheduling: 'Art of Scheduling',
  'three-clocks': 'Three Clocks',
  legacy: 'Legacy & Wealth',
  default: 'Speaker',
};

export default function SpeakerTopicVisual({ name, topic, image }: SpeakerTopicVisualProps) {
  const key = resolveSpeakerVisual(name, topic);
  const Art = ART[key];
  const showPortrait = key !== 'default' && !!image;

  return (
    <motion.div
      className="w-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Vitrine label={LABELS[key]} image={showPortrait ? image : undefined}>
        <Art image={image} />
      </Vitrine>
    </motion.div>
  );
}
