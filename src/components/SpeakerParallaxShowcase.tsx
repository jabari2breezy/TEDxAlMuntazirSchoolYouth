import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import StructuralForeground from './StructuralForeground';

interface SpeakerParallaxShowcaseProps {
  name: string;
  topic: string;
  image?: string;
  segmentLabel?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export default function SpeakerParallaxShowcase({
  name,
  topic,
  image,
  segmentLabel,
  scrollContainerRef,
}: SpeakerParallaxShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  });

  const textX = useTransform(scrollYProgress, [0, 0.5, 1], ['-8%', '2%', '10%']);
  const fgY = useTransform(scrollYProgress, [0, 1], [16, -28]);
  const fgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 1.02]);

  const nameParts = name.split(' ');

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[440px] md:min-h-[500px] rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-brand-surface via-white to-brand-surface/80 border border-brand-outline/20 shadow-[0_24px_64px_rgba(0,8,57,0.08)]"
    >
      {/* Layer 1 — frosted base */}
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,8,57,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,8,57,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {segmentLabel && (
          <span className="absolute top-5 left-6 md:left-8 font-typewriter text-[9px] uppercase tracking-[0.5em] text-brand-primary/45 z-10">
            {segmentLabel}
          </span>
        )}
      </div>

      {/* Layer 2 — background typography */}
      <motion.div
        className="absolute inset-0 z-[1] flex items-center overflow-hidden pointer-events-none select-none pt-8"
        style={{ x: textX }}
      >
        <div className="flex flex-col leading-[0.78] px-6 md:px-10 w-max">
          {nameParts.map((part, i) => (
            <span
              key={part + i}
              className={`block font-title font-black uppercase tracking-tighter whitespace-nowrap text-brand-primary/[0.12] ${
                i === 0 ? 'text-[16vw] md:text-[10vw]' : 'text-[12vw] md:text-[8vw] self-end -mt-[0.04em]'
              }`}
            >
              {part}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Layer 3 — topic sculpture (must not clip) */}
      <motion.div
        className="relative z-20 flex items-center justify-center px-4 pt-16 pb-28 min-h-[360px] md:min-h-[400px]"
        style={{ y: fgY, scale: fgScale, willChange: 'transform' }}
      >
        <StructuralForeground name={name} topic={topic} image={image} />
      </motion.div>

      {/* Topic */}
      <div className="absolute bottom-0 inset-x-0 z-30 p-6 md:p-8 bg-gradient-to-t from-white via-white/95 to-white/0 border-t border-brand-outline/10 rounded-b-[inherit]">
        <p className="font-editorial text-xl md:text-2xl italic text-brand-primary/80 max-w-lg leading-tight">
          &ldquo;{topic}&rdquo;
        </p>
      </div>
    </div>
  );
}
