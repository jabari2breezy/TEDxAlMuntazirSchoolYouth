import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import StructuralForeground from './StructuralForeground';

interface SpeakerParallaxShowcaseProps {
  name: string;
  topic: string;
  image?: string;
  segmentLabel?: string;
  segmentColor?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export default function SpeakerParallaxShowcase({
  name,
  topic,
  image,
  segmentLabel,
  segmentColor = '#006d38',
  scrollContainerRef,
}: SpeakerParallaxShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  });

  const textX = useTransform(scrollYProgress, [0, 0.5, 1], ['-12%', '4%', '14%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.5]);
  const fgY = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const fgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 1.04]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 25]);

  const nameParts = name.split(' ');

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[min(72vh,640px)] min-h-[420px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] isolate"
    >
      {/* Layer 1 — frosted glass */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 bg-white/[0.08] backdrop-blur-3xl border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 via-transparent to-brand-secondary/20" />
        {segmentLabel && (
          <span className="absolute top-6 left-6 md:top-8 md:left-8 font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/40">
            {segmentLabel}
          </span>
        )}
      </motion.div>

      {/* Layer 2 — massive typography (parallax middle) */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center overflow-hidden pointer-events-none select-none"
        style={{ x: textX, opacity: textOpacity, willChange: 'transform, opacity' }}
      >
        <div className="flex flex-col leading-[0.78] px-4 md:px-8 w-max">
          {nameParts.map((part, i) => (
            <span
              key={part + i}
              className={`block font-title font-black uppercase text-white tracking-tighter whitespace-nowrap ${
                i === 0
                  ? 'text-[18vw] md:text-[11vw]'
                  : 'text-[14vw] md:text-[9vw] text-white/90 self-end -mt-[0.05em]'
              }`}
              style={{ WebkitTextStroke: i === 0 ? '0px' : undefined }}
            >
              {part}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Layer 3 — 3D structural foreground */}
      <motion.div
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        style={{ y: fgY, scale: fgScale, willChange: 'transform' }}
      >
        <StructuralForeground image={image} segmentColor={segmentColor} />
      </motion.div>

      {/* Topic strip — sits above glass, below close controls */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-6 md:p-10 bg-gradient-to-t from-[#050507]/90 via-[#050507]/50 to-transparent">
        <p className="font-editorial text-xl md:text-3xl italic text-white/70 max-w-lg leading-tight">
          &ldquo;{topic}&rdquo;
        </p>
      </div>
    </div>
  );
}
