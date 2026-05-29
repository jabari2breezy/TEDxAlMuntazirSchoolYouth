import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { ArrowUpRight } from 'lucide-react';
import FloatingBackground from '../components/FloatingBackground';

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio: string;
  talk_description: string;
}

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

const bgCream = '#f7f4ee';
const bgNavy = '#000839';
const brandGreen = '#006d38';

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
  const accentColor = isEven ? 'text-brand-secondary' : 'text-brand-secondary';
  const borderColor = isEven ? 'border-white/10' : 'border-[#000839]/10';

  const cardProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <div ref={sectionRef} className="relative h-[300dvh]">
      <div className="sticky top-0 h-dvh overflow-hidden" style={{ backgroundColor: bg }}>
        {/* Decorative watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="text-[32vw] md:text-[22vw] font-title font-black uppercase leading-none tracking-tighter whitespace-nowrap"
            style={{ color: isEven ? 'rgba(255,255,255,0.03)' : 'rgba(0,8,57,0.04)' }}
          >
            {speaker.name}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 max-w-8xl mx-auto">
          <div className="w-full max-w-5xl mx-auto">
            {/* Top: Segment + Number */}
            <StaggerLine
              progress={cardProgress}
              offsetStart={0}
              offsetEnd={0.08}
              className="flex items-center gap-3 mb-6 md:mb-10"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: brandGreen }}
              />
              <span
                className={`font-typewriter text-[9px] md:text-[11px] uppercase tracking-[0.35em] ${mutedColor} font-semibold`}
              >
                {String(segmentIdx).padStart(2, '0')} / {segmentLabel}
              </span>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: isEven ? 'rgba(255,255,255,0.08)' : 'rgba(0,8,57,0.08)' }}
              />
              <span className={`font-typewriter text-[8px] md:text-[10px] tracking-[0.2em] ${mutedColor}`}>
                0{index + 1} / 0{total}
              </span>
            </StaggerLine>

            {/* Name with word-by-word pop-up (matveyan style) */}
            <WordPop
              text={speaker.name}
              progress={cardProgress}
              offsetStart={0.06}
              wordDelay={0.04}
              className={`text-[12vw] md:text-[7vw] lg:text-[6vw] font-title font-black uppercase leading-[0.82] tracking-tighter ${textColor} block`}
            />

            {/* Topic quote */}
            <StaggerLine
              progress={cardProgress}
              offsetStart={0.35}
              offsetEnd={0.48}
              className="mt-4 md:mt-6 mb-6 md:mb-10"
            >
              <div
                className="relative pl-4 md:pl-6 border-l-2"
                style={{ borderColor: brandGreen }}
              >
                <p
                  className={`font-editorial italic text-base md:text-2xl lg:text-3xl leading-snug ${
                    isEven ? 'text-white/60' : 'text-[#000839]/60'
                  }`}
                >
                  &ldquo;{speaker.topic}&rdquo;
                </p>
              </div>
            </StaggerLine>

            {/* Bio + Talk Description - Grid on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16">
              <StaggerLine
                progress={cardProgress}
                offsetStart={0.45}
                offsetEnd={0.6}
                className="space-y-3 md:space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.3em] ${mutedColor}`}
                  >
                    The <span className="font-editorial italic lowercase" style={{ color: brandGreen }}>biography</span>
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: isEven ? 'rgba(255,255,255,0.06)' : 'rgba(0,8,57,0.06)' }}
                  />
                </div>
                <p
                  className={`font-sans text-sm md:text-base leading-[1.7] ${
                    isEven ? 'text-white/70' : 'text-[#000839]/70'
                  }`}
                >
                  {speaker.bio}
                </p>
              </StaggerLine>

              <StaggerLine
                progress={cardProgress}
                offsetStart={0.55}
                offsetEnd={0.7}
                className="space-y-3 md:space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.3em] ${mutedColor}`}
                  >
                    About the <span className="font-editorial italic lowercase" style={{ color: brandGreen }}>discourse</span>
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: isEven ? 'rgba(255,255,255,0.06)' : 'rgba(0,8,57,0.06)' }}
                  />
                </div>
                <p
                  className={`font-editorial italic text-sm md:text-base leading-[1.8] ${
                    isEven ? 'text-white/80' : 'text-[#000839]/80'
                  }`}
                >
                  {speaker.talk_description}
                </p>
              </StaggerLine>
            </div>

            {/* Bottom accent */}
            <StaggerLine
              progress={cardProgress}
              offsetStart={0.72}
              offsetEnd={0.85}
              className="mt-6 md:mt-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-[2px]" style={{ backgroundColor: brandGreen }} />
                <span className={`font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] ${mutedColor}`}>
                  TEDxAlMuntazirSchoolYouth 2026
                </span>
              </div>
            </StaggerLine>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <FloatingBackground />

      {/* ═══ HERO SECTION (matarellis-style pinned intro) ═══ */}
      <HeroSection mounted={mounted} speakersCount={speakersData.length} />

      {/* ═══ SPEAKER CHAPTERS (each as a pinned scroll narrative) ═══ */}
      {speakersData.map((speaker, i) => {
        const seg = speaker ? SEGMENTS.find(s => s.id === speaker.segmentId) : null;
        const segLabel = seg?.title || '';
        const segIdx = speaker ? SEGMENTS.findIndex(s => s.id === speaker.segmentId) + 1 : 0;
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

      {/* ═══ END SECTION ═══ */}
      <section
        className="relative h-dvh flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{ backgroundColor: bgCream }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="text-[28vw] font-title font-black uppercase leading-none tracking-tighter whitespace-nowrap"
            style={{ color: 'rgba(0,8,57,0.03)' }}
          >
            The End
          </span>
        </div>
        <div className="relative z-10 text-center max-w-lg">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-brand-secondary block mb-4"
          >
            Global Assembly
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
            className="mt-6 font-sans text-sm text-[#000839]/50 leading-relaxed"
          >
            Every speaker represents a thread in the fabric of borrowed time.
          </motion.p>
        </div>
      </section>
    </div>
  );
}

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

  const titleWords = 'Global Assembly'.split(' ');
  const subtitle = `${speakersCount} Speakers, One Stage`;

  return (
    <div ref={heroRef} className="relative h-[200dvh]">
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="sticky top-0 h-dvh flex flex-col justify-center items-center px-6 overflow-hidden"
      >
        {/* Pinned background */}
        <div className="absolute inset-0 bg-brand-primary" />
        <FloatingBackground />

        {/* Decorative Watermark */}
        {mounted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[30vw] md:text-[20vw] font-title font-black uppercase leading-none tracking-tighter text-white whitespace-nowrap opacity-[0.04]">
              2026
            </span>
          </div>
        )}

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-secondary" />
            <span className="font-typewriter text-[9px] md:text-[11px] uppercase tracking-[0.45em] text-white/40 font-semibold">
              {subtitle}
            </span>
          </motion.div>

          {/* Title with word-by-word pop-up (matveyan style on mount) */}
          <h1 className="overflow-hidden">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.4 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block text-[14vw] md:text-[8vw] lg:text-[6.5vw] font-title font-black uppercase leading-[0.82] tracking-tighter text-white mr-[0.15em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-editorial italic text-lg md:text-2xl lg:text-3xl text-white/50"
          >
            &ldquo;Time is the currency of attention&rdquo;
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="font-typewriter text-[7px] uppercase tracking-[0.4em] text-white/20">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-6"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
