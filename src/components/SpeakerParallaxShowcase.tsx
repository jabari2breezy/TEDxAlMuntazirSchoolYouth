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

  const textX = useTransform(scrollYProgress, [0, 0.5, 1], ['-10%', '3%', '12%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.35, 1, 1, 0.45]);
  const fgY = useTransform(scrollYProgress, [0, 1], [24, -40]);
  const fgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 1.03]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 18]);

  const nameParts = name.split(' ');

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[min(70vh,600px)] min-h-[400px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] isolate bg-brand-surface/80"
    >
      {/* Layer 1 — frosted glass (light, page-matched) */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 bg-gradient-to-br from-white/90 via-brand-surface/95 to-white/70 backdrop-blur-2xl border border-brand-outline/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]"
      >
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,8,57,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,8,57,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {segmentLabel && (
          <span className="absolute top-6 left-6 md:top-8 md:left-8 font-typewriter text-[9px] uppercase tracking-[0.5em] text-brand-primary/40">
            {segmentLabel}
          </span>
        )}
      </motion.div>

      {/* Layer 2 — massive typography */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center overflow-hidden pointer-events-none select-none"
        style={{ x: textX, opacity: textOpacity, willChange: 'transform, opacity' }}
      >
        <div className="flex flex-col leading-[0.78] px-4 md:px-8 w-max">
          {nameParts.map((part, i) => (
            <span
              key={part + i}
              className={`block font-title font-black uppercase tracking-tighter whitespace-nowrap text-brand-primary/10 ${
                i === 0 ? 'text-[18vw] md:text-[11vw]' : 'text-[14vw] md:text-[9vw] self-end -mt-[0.05em]'
              }`}
            >
              {part}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Layer 3 — topic 3D render */}
      <motion.div
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-4"
        style={{ y: fgY, scale: fgScale, willChange: 'transform' }}
      >
        <StructuralForeground name={name} topic={topic} image={image} />
      </motion.div>

      {/* Topic strip */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-6 md:p-8 bg-gradient-to-t from-white via-white/90 to-transparent border-t border-brand-outline/10">
        <p className="font-editorial text-xl md:text-2xl italic text-brand-primary/70 max-w-lg leading-tight">
          &ldquo;{topic}&rdquo;
        </p>
      </div>
    </div>
  );
}
