import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface SpeakerParallaxShowcaseProps {
  name: string;
  topic: string;
  segmentLabel?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

const glowGreen = {
  color: '#a7f3c9',
  textShadow: [
    '0 0 8px rgba(167, 243, 201, 1)',
    '0 0 22px rgba(74, 222, 128, 0.95)',
    '0 0 48px rgba(34, 197, 94, 0.75)',
    '0 0 80px rgba(16, 185, 129, 0.45)',
    '0 2px 0 rgba(6, 95, 70, 0.9)',
    '0 6px 0 rgba(4, 78, 58, 0.75)',
    '0 12px 24px rgba(0, 8, 57, 0.35)',
  ].join(', '),
};

export default function SpeakerParallaxShowcase({
  name,
  topic,
  segmentLabel,
  scrollContainerRef,
}: SpeakerParallaxShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  });

  const textX = useTransform(scrollYProgress, [0, 0.5, 1], ['-6%', '0%', '8%']);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, -4]);
  const depthZ = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const nameParts = name.split(' ');

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[380px] md:min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-brand-primary/20 bg-[#030712]"
      style={{ perspective: '1200px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/80 via-[#050a14] to-[#020617]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 45%, rgba(74, 222, 128, 0.22) 0%, transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74,222,128,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {segmentLabel && (
        <span className="absolute top-5 left-6 md:left-8 font-typewriter text-[9px] uppercase tracking-[0.5em] text-emerald-200/50 z-20">
          {segmentLabel}
        </span>
      )}

      {/* 3D glowing name — parallax layer */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center px-6 py-20 pointer-events-none select-none"
        style={{
          x: textX,
          rotateY,
          rotateX,
          translateZ: depthZ,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div className="flex flex-col items-center leading-[0.82] text-center" style={{ transformStyle: 'preserve-3d' }}>
          {nameParts.map((part, i) => (
            <motion.span
              key={part + i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              className={`block font-title font-black uppercase tracking-tighter whitespace-nowrap ${
                i === 0
                  ? 'text-[14vw] md:text-[8vw]'
                  : 'text-[11vw] md:text-[6.5vw] -mt-[0.03em]'
              }`}
              style={{
                ...glowGreen,
                transform: `translateZ(${24 - i * 8}px)`,
                WebkitTextStroke: '1px rgba(187, 247, 208, 0.35)',
              }}
            >
              {part}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Topic */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-6 md:p-8 bg-gradient-to-t from-[#030712] via-[#030712]/95 to-transparent border-t border-emerald-500/15">
        <p className="font-editorial text-xl md:text-2xl italic text-emerald-100/70 max-w-lg leading-tight">
          &ldquo;{topic}&rdquo;
        </p>
      </div>
    </div>
  );
}
