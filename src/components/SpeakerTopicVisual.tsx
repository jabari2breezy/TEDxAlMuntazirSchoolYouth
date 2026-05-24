import { motion } from 'motion/react';
import type { ReactNode, FC } from 'react';
import { resolveSpeakerVisual, type SpeakerVisualKey } from './speakerVisuals';

interface SpeakerTopicVisualProps {
  name: string;
  topic: string;
  image?: string;
}

const glass =
  'bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_rgba(0,8,57,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]';

function VisualFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className={`relative w-full h-full rounded-2xl ${glass} overflow-hidden`}>
      <span className="absolute top-3 left-4 font-typewriter text-[7px] uppercase tracking-[0.4em] text-brand-primary/35 z-10">
        {label}
      </span>
      <div className="absolute inset-0 flex items-center justify-center p-6 pt-8">{children}</div>
    </div>
  );
}

function HeritageVisual() {
  return (
    <VisualFrame label="Echoes / Past">
      <div className="relative w-full h-48" style={{ transformStyle: 'preserve-3d' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-x-4 h-28 rounded-lg bg-gradient-to-br from-white/80 to-brand-surface/90 border border-white/70 shadow-lg"
            style={{ transform: `translateZ(${i * 28}px) translateY(${i * -10}px) rotateX(${8 - i * 2}deg)` }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <svg viewBox="0 0 80 80" className="absolute bottom-2 right-4 w-14 h-14 text-brand-primary/25">
          <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M40 12 L40 40 L56 48" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </VisualFrame>
  );
}

function CultureTimeVisual() {
  return (
    <VisualFrame label="Culture / Time">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        className="relative w-44 h-44"
      >
        <div className="absolute inset-0 rounded-full border border-brand-primary/15" />
        {[0, 45, 90, 135].map((deg) => (
          <div
            key={deg}
            className="absolute top-1/2 left-1/2 w-1/2 h-px bg-brand-primary/20 origin-left"
            style={{ transform: `rotate(${deg}deg)` }}
          />
        ))}
        <div className="absolute inset-6 rounded-full bg-white/60 border border-white/80 shadow-inner flex items-center justify-center">
          <span className="font-typewriter text-[8px] text-brand-primary/50 uppercase tracking-widest">TZ · UTC</span>
        </div>
      </motion.div>
    </VisualFrame>
  );
}

function NostalgiaVisual() {
  return (
    <VisualFrame label="Architecture">
      <div className="flex gap-3 items-end h-40" style={{ transformStyle: 'preserve-3d', perspective: '800px' }}>
        {[1, 0.75, 0.55, 0.85].map((scale, i) => (
          <motion.div
            key={i}
            className="w-10 bg-gradient-to-t from-brand-primary/25 to-white/90 border border-white/80 rounded-t-sm shadow-md"
            style={{ height: `${scale * 100}%`, transform: `translateZ(${i * 12}px)` }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
        <div className="absolute -top-2 right-2 w-16 h-16 border border-brand-primary/10 rotate-45 opacity-40" />
      </div>
    </VisualFrame>
  );
}

function CapitalismClockVisual() {
  return (
    <VisualFrame label="The Clock">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-brand-primary/30">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" />
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="14"
              x2="50"
              y2="18"
              stroke="currentColor"
              strokeWidth="1"
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ originX: '50%', originY: '50%' }}>
            <line x1="50" y1="50" x2="50" y2="28" stroke="#006d38" strokeWidth="2" />
          </motion.g>
          <text x="50" y="58" textAnchor="middle" fontSize="14" fill="currentColor" className="font-title font-bold">
            $
          </text>
        </svg>
      </div>
    </VisualFrame>
  );
}

function ProcrastinationVisual() {
  return (
    <VisualFrame label="The Paradox">
      <div className="relative w-44 h-44">
        <svg viewBox="0 0 100 100" className="w-full h-full text-brand-primary/25">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="50" y1="50" x2="72" y2="38" stroke="#006d38" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
        <motion.span
          className="absolute top-2 right-4 font-title text-2xl text-brand-primary/20"
          animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          zzz
        </motion.span>
        <motion.div
          className="absolute bottom-4 left-4 px-2 py-1 rounded bg-white/70 border border-white text-[8px] font-typewriter uppercase tracking-widest text-brand-primary/50"
          animate={{ scale: [1, 0.96, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          Later
        </motion.div>
      </div>
    </VisualFrame>
  );
}

function SchedulingVisual() {
  return (
    <VisualFrame label="The Grid">
      <div className="grid grid-cols-4 gap-1.5 w-44" style={{ transformStyle: 'preserve-3d' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-sm bg-white/70 border border-white/90 shadow-sm"
            style={{ transform: `translateZ(${i % 3 === 0 ? 16 : 4}px)` }}
            animate={{ opacity: i % 4 === 0 ? [0.5, 1, 0.5] : 1 }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
      </div>
    </VisualFrame>
  );
}

function ThreeClocksVisual() {
  const clocks = ['Climate', 'Life', 'AI'];
  return (
    <VisualFrame label="Three Clocks">
      <div className="flex gap-4 items-center">
        {clocks.map((label, i) => (
          <motion.div
            key={label}
            className="flex flex-col items-center gap-2"
            style={{ transform: `translateZ(${20 - i * 6}px)` }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
          >
            <div className="w-16 h-16 rounded-full bg-white/75 border border-white/90 shadow-md flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10 text-brand-primary/30">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" />
                <line x1="20" y1="20" x2="20" y2="10" stroke="#006d38" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="font-typewriter text-[6px] uppercase tracking-widest text-brand-primary/40">{label}</span>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

function LegacyVisual() {
  return (
    <VisualFrame label="Ripples">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-brand-primary/15 bg-white/30"
            style={{ width: 40 + i * 28, height: 40 + i * 28 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
        <div className="relative z-10 w-10 h-10 rounded-full bg-brand-secondary/20 border border-brand-secondary/30" />
      </div>
    </VisualFrame>
  );
}

function DefaultVisual({ image }: { image?: string }) {
  return (
    <VisualFrame label="Speaker">
      <div className="relative w-36 h-44 rounded-xl overflow-hidden border border-white/80 shadow-lg">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover grayscale-[30%]" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-brand-surface to-white/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
      </div>
    </VisualFrame>
  );
}

const VISUALS: Record<SpeakerVisualKey, FC<{ image?: string }>> = {
  heritage: HeritageVisual,
  'culture-time': CultureTimeVisual,
  nostalgia: NostalgiaVisual,
  'capitalism-clock': CapitalismClockVisual,
  procrastination: ProcrastinationVisual,
  scheduling: SchedulingVisual,
  'three-clocks': ThreeClocksVisual,
  legacy: LegacyVisual,
  default: DefaultVisual,
};

export default function SpeakerTopicVisual({ name, topic, image }: SpeakerTopicVisualProps) {
  const key = resolveSpeakerVisual(name, topic);
  const Visual = VISUALS[key];

  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[260px]" style={{ perspective: '1000px' }}>
      <motion.div
        className="w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: [-4, 4, -4], rotateX: [1, -1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Visual image={image} />
      </motion.div>
    </div>
  );
}
