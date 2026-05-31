import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { ArrowDown } from 'lucide-react';
import FloatingBackground from '../components/FloatingBackground';
import { WarpShaderBackground } from '../components/ui/wrap-shader';
import { MaskedReveal, MicroTag, IndexNumber, StaggerContainer, StaggerItem, LUXURY_EASE } from '../components/KineticTypography';
import HeroScrollAnimation from '../components/ui/hero-scroll-animation';

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio: string;
  talk_description: string;
}

/* ────────── Scroll-driven text reveal ────────── */

function StaggerLine({
  children,
  progress,
  offsetStart = 0,
  offsetEnd = 0.2,
  className = '',
}: {
  children: React.ReactNode;
  progress: any;
  offsetStart?: number;
  offsetEnd?: number;
  className?: string;
}) {
  const opacity = useTransform(progress, [offsetStart, offsetEnd], [0, 1]);
  const y = useTransform(progress, [offsetStart, offsetEnd], [40, 0]);
  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

function WordPop({
  text,
  progress,
  offsetStart = 0,
  wordDelay = 0.04,
  className = '',
}: {
  text: string;
  progress: any;
  offsetStart?: number;
  wordDelay?: number;
  className?: string;
}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => {
        const s = offsetStart + i * wordDelay;
        const e = s + 0.1;
        const opacity = useTransform(progress, [s, e], [0, 1]);
        const y = useTransform(progress, [s, e], [30, 0]);
        return (
          <motion.span
            key={i}
            style={{ opacity, y }}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

/* ────────── Floating background objects (topic-themed) ────────── */

const floaters: Record<string, { shape: string; x: string; y: string; size: number; delay: number; duration: number; rotation?: number }[]> = {
  '1': [
    { shape: 'circle', x: '10%', y: '20%', size: 18, delay: 0, duration: 14 },
    { shape: 'square', x: '85%', y: '30%', size: 14, delay: 2, duration: 18, rotation: 45 },
    { shape: 'line', x: '75%', y: '70%', size: 40, delay: 1, duration: 12 },
    { shape: 'dot', x: '20%', y: '75%', size: 6, delay: 3, duration: 16 },
    { shape: 'ring', x: '50%', y: '15%', size: 22, delay: 4, duration: 20 },
  ],
  '2': [
    { shape: 'circle', x: '15%', y: '25%', size: 16, delay: 0, duration: 15 },
    { shape: 'ring', x: '80%', y: '20%', size: 24, delay: 1, duration: 19 },
    { shape: 'dot', x: '60%', y: '80%', size: 5, delay: 2, duration: 13 },
    { shape: 'line', x: '30%', y: '65%', size: 35, delay: 3, duration: 17 },
    { shape: 'square', x: '90%', y: '60%', size: 10, delay: 4, duration: 21, rotation: 30 },
  ],
  '3': [
    { shape: 'ring', x: '12%', y: '30%', size: 20, delay: 0, duration: 16 },
    { shape: 'dot', x: '88%', y: '25%', size: 7, delay: 1, duration: 14 },
    { shape: 'circle', x: '65%', y: '70%', size: 12, delay: 2, duration: 18 },
    { shape: 'line', x: '25%', y: '80%', size: 30, delay: 3, duration: 15 },
    { shape: 'square', x: '45%', y: '15%', size: 8, delay: 4, duration: 20, rotation: 60 },
  ],
  '4': [
    { shape: 'square', x: '8%', y: '20%', size: 14, delay: 0, duration: 17, rotation: 15 },
    { shape: 'circle', x: '82%', y: '35%', size: 18, delay: 1, duration: 13 },
    { shape: 'ring', x: '55%', y: '75%', size: 20, delay: 2, duration: 19 },
    { shape: 'dot', x: '35%', y: '15%', size: 5, delay: 3, duration: 15 },
    { shape: 'line', x: '70%', y: '65%', size: 38, delay: 4, duration: 16 },
  ],
  '5': [
    { shape: 'ring', x: '20%', y: '18%', size: 22, delay: 0, duration: 14 },
    { shape: 'square', x: '78%', y: '28%', size: 12, delay: 1, duration: 18, rotation: 40 },
    { shape: 'circle', x: '40%', y: '78%', size: 10, delay: 2, duration: 16 },
    { shape: 'line', x: '85%', y: '68%', size: 32, delay: 3, duration: 13 },
    { shape: 'dot', x: '10%', y: '65%', size: 6, delay: 4, duration: 20 },
  ],
  '6': [
    { shape: 'dot', x: '15%', y: '22%', size: 5, delay: 0, duration: 15 },
    { shape: 'ring', x: '80%', y: '18%', size: 18, delay: 1, duration: 17 },
    { shape: 'line', x: '50%', y: '72%', size: 36, delay: 2, duration: 14 },
    { shape: 'square', x: '25%', y: '82%', size: 10, delay: 3, duration: 19, rotation: 25 },
    { shape: 'circle', x: '70%', y: '35%', size: 14, delay: 4, duration: 16 },
  ],
  '7': [
    { shape: 'line', x: '10%', y: '28%', size: 44, delay: 0, duration: 13 },
    { shape: 'circle', x: '85%', y: '22%', size: 16, delay: 1, duration: 18 },
    { shape: 'ring', x: '60%', y: '75%', size: 20, delay: 2, duration: 15 },
    { shape: 'square', x: '30%', y: '65%', size: 8, delay: 3, duration: 20, rotation: 50 },
    { shape: 'dot', x: '75%', y: '80%', size: 6, delay: 4, duration: 17 },
  ],
  '8': [
    { shape: 'ring', x: '18%', y: '25%', size: 24, delay: 0, duration: 16 },
    { shape: 'dot', x: '82%', y: '30%', size: 7, delay: 1, duration: 14 },
    { shape: 'circle', x: '45%', y: '80%', size: 12, delay: 2, duration: 18 },
    { shape: 'line', x: '65%', y: '18%', size: 34, delay: 3, duration: 15 },
    { shape: 'square', x: '25%', y: '70%', size: 10, delay: 4, duration: 19, rotation: 35 },
  ],
};

function FloatingElements({ speakerId, isNavy }: { speakerId: string; isNavy: boolean }) {
  const items = floaters[speakerId] || floaters['1'];
  const color = isNavy ? 'rgba(255,255,255,0.06)' : 'rgba(0,8,57,0.05)';

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            opacity: 0,
            animation: `floatIn 1.2s ease-out ${item.delay * 0.3}s forwards, floatDrift ${item.duration}s ease-in-out ${item.delay}s infinite`,
          }}
        >
          {item.shape === 'circle' && (
            <div
              className="rounded-full w-full h-full"
              style={{ border: `1.5px solid ${color}` }}
            />
          )}
          {item.shape === 'square' && (
            <div
              className="w-full h-full"
              style={{
                border: `1.5px solid ${color}`,
                transform: `rotate(${item.rotation || 0}deg)`,
              }}
            />
          )}
          {item.shape === 'ring' && (
            <div
              className="rounded-full w-full h-full"
              style={{ border: `1px solid ${color}` }}
            />
          )}
          {item.shape === 'dot' && (
            <div
              className="rounded-full w-full h-full"
              style={{ backgroundColor: color }}
            />
          )}
          {item.shape === 'line' && (
            <div
              className="h-px w-full"
              style={{ backgroundColor: color, transform: `rotate(${item.rotation || 0}deg)` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ────────── Colors ────────── */

const bgCream = '#f7f4ee';
const bgNavy = '#000839';
const brandGreen = '#006d38';

/* ────────── Speaker Chapter ────────── */

function SpeakerChapter({
  speaker,
  index,
  segmentLabel,
  segmentIdx,
  total,
}: {
  speaker: Speaker;
  index: number;
  segmentLabel: string;
  segmentIdx: number;
  total: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const isEven = index % 2 === 0;
  const bg = isEven ? bgNavy : bgCream;
  const textColor = isEven ? 'text-white' : 'text-[#000839]';
  const mutedColor = isEven ? 'text-white/40' : 'text-[#000839]/40';
  const lineColor = isEven ? 'rgba(255,255,255,0.08)' : 'rgba(0,8,57,0.08)';

  const cardProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <div ref={sectionRef} className="relative h-[300dvh]">
      <div className="sticky top-0 h-dvh overflow-hidden" style={{ backgroundColor: bg }}>

        {/* Floating objects */}
        <FloatingElements speakerId={speaker.id} isNavy={isEven} />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="text-[32vw] md:text-[22vw] font-title font-black uppercase leading-none tracking-tighter whitespace-nowrap"
            style={{ color: isEven ? 'rgba(255,255,255,0.03)' : 'rgba(0,8,57,0.04)' }}
          >
            {speaker.name}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 max-w-8xl mx-auto">
          <div className="w-full max-w-5xl mx-auto">

            {/* Segment + Number — editorial micro tags */}
            <StaggerLine
              progress={cardProgress}
              offsetStart={0}
              offsetEnd={0.08}
              className="flex items-center gap-3 mb-4 md:mb-10"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: brandGreen }} />
              <IndexNumber number={index + 1} />
              <span className={`font-typewriter text-[10px] md:text-[11px] uppercase tracking-[0.35em] ${mutedColor} font-semibold`}>
                {segmentLabel}
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: lineColor }} />
              <span className={`font-typewriter text-[9px] md:text-[10px] tracking-[0.2em] ${mutedColor}`}>
                0{index + 1} / 0{total}
              </span>
            </StaggerLine>

            {/* Name — big on mobile */}
            <WordPop
              text={speaker.name}
              progress={cardProgress}
              offsetStart={0.06}
              wordDelay={0.04}
              className={`text-[13vw] md:text-[7vw] lg:text-[6vw] font-title font-black uppercase leading-[0.82] tracking-tighter ${textColor} block`}
            />

            {/* Topic — bigger on mobile */}
            <StaggerLine
              progress={cardProgress}
              offsetStart={0.35}
              offsetEnd={0.48}
              className="mt-3 md:mt-6 mb-5 md:mb-10"
            >
              <div className="relative pl-4 md:pl-6 border-l-2" style={{ borderColor: brandGreen }}>
                <p className={`font-editorial italic text-xl md:text-2xl lg:text-3xl leading-snug ${isEven ? 'text-white/60' : 'text-[#000839]/60'}`}>
                  &ldquo;{speaker.topic}&rdquo;
                </p>
              </div>
            </StaggerLine>

            {/* Bio + Discourse — bigger text on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 lg:gap-16">

              {/* Bio — SHORT */}
              <StaggerLine
                progress={cardProgress}
                offsetStart={0.45}
                offsetEnd={0.6}
                className="space-y-2 md:space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.3em] ${mutedColor}`}>
                    The <span className="font-editorial italic lowercase" style={{ color: brandGreen }}>biography</span>
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: lineColor }} />
                </div>
                <p className={`font-sans text-base md:text-base lg:text-lg leading-[1.6] ${isEven ? 'text-white/65' : 'text-[#000839]/65'}`}>
                  {speaker.bio}
                </p>
              </StaggerLine>

              {/* Discourse — LONGER */}
              <StaggerLine
                progress={cardProgress}
                offsetStart={0.55}
                offsetEnd={0.7}
                className="space-y-2 md:space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.3em] ${mutedColor}`}>
                    About the <span className="font-editorial italic lowercase" style={{ color: brandGreen }}>discourse</span>
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: lineColor }} />
                </div>
                <p className={`font-editorial italic text-lg md:text-lg lg:text-xl leading-[1.7] ${isEven ? 'text-white/80' : 'text-[#000839]/80'}`}>
                  {speaker.talk_description}
                </p>
              </StaggerLine>
            </div>

            {/* Bottom accent */}
            <StaggerLine
              progress={cardProgress}
              offsetStart={0.72}
              offsetEnd={0.85}
              className="mt-5 md:mt-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-[2px]" style={{ backgroundColor: brandGreen }} />
                <span className={`font-typewriter text-[8px] md:text-[8px] uppercase tracking-[0.25em] ${mutedColor}`}>
                  TEDx Al Muntazir Schools Youth 2026
                </span>
              </div>
            </StaggerLine>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────── Main Page ────────── */

export default function Speakers() {
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSpeakersData(SPEAKERS as Speaker[]);
    setMounted(true);
  }, []);

  if (speakersData.length === 0) {
    return (
      <div className="h-dvh w-full bg-brand-primary flex items-center justify-center">
        <div className="font-typewriter text-white/20 animate-pulse tracking-[0.5em] uppercase text-sm">
          Loading the assembly...
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-brand-primary">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <WarpShaderBackground />
      </div>

      <HeroSection mounted={mounted} speakersCount={speakersData.length} />

      {/* Scroll-driven transition between hero and speakers */}
      <HeroScrollAnimation />

      {speakersData.map((speaker, i) => {
        const seg = SEGMENTS.find(s => s.id === speaker.segmentId);
        const segLabel = seg?.title || '';
        const segIdx = SEGMENTS.findIndex(s => s.id === speaker.segmentId) + 1;
        return (
          <SpeakerChapter
            key={speaker.id}
            speaker={speaker}
            index={i}
            segmentLabel={segLabel}
            segmentIdx={segIdx}
            total={speakersData.length}
          />
        );
      })}

      {/* End section */}
      <section
        className="relative h-dvh flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{ backgroundColor: bgCream }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[28vw] font-title font-black uppercase leading-none tracking-tighter whitespace-nowrap" style={{ color: 'rgba(0,8,57,0.03)' }}>
            The End
          </span>
        </div>
        <div className="relative z-10 text-center max-w-lg">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-brand-secondary block mb-4"
          >
            The Assembly
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-title font-black uppercase tracking-tighter text-[#000839] leading-[0.9]"
          >
            Voices That
            <br />
            <span className="italic font-editorial lowercase text-brand-secondary">Resonate.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 font-sans text-base text-[#000839]/50 leading-relaxed"
          >
            Every speaker represents a thread in the fabric of borrowed time.
          </motion.p>
        </div>
      </section>
    </div>
  );
}

/* ────────── Hero ────────── */

function HeroSection({
  mounted,
  speakersCount,
}: {
  mounted: boolean;
  speakersCount: number;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 0.5, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 0.92, 0.88]);
  const heroY = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 0, -40, -80]);

  const titleWords = 'The Assembly'.split(' ');
  const subtitle = `${speakersCount} Speakers, One Stage`;

  return (
    <div ref={heroRef} className="relative h-[200dvh]">
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="sticky top-0 h-dvh flex flex-col justify-center items-center px-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-primary" />
        <FloatingBackground />

        {mounted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[30vw] md:text-[20vw] font-title font-black uppercase leading-none tracking-tighter text-white whitespace-nowrap opacity-[0.04]">
              2026
            </span>
          </div>
        )}

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-secondary" />
            <span className="font-typewriter text-[10px] md:text-[11px] uppercase tracking-[0.45em] text-white/40 font-semibold">
              {subtitle}
            </span>
          </motion.div>

          <h1 className="overflow-hidden">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%', opacity: 0 }}
                animate={mounted ? { y: '0%', opacity: 1 } : {}}
                transition={{
                  duration: 0.85,
                  delay: 0.4 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block text-[14vw] md:text-[8vw] lg:text-[6.5vw] font-title font-black uppercase leading-[0.82] tracking-tighter text-white mr-[0.15em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-editorial italic text-xl md:text-2xl lg:text-3xl text-white/50"
          >
            &ldquo;Time is the currency of attention&rdquo;
          </motion.p>

          {/* Scroll arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-16 md:mt-24 flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={20} className="text-white/25" strokeWidth={1.5} />
            </motion.div>
            <span className="font-typewriter text-[7px] uppercase tracking-[0.5em] text-white/15">
              Scroll
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
