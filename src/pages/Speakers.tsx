import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SPEAKERS, SEGMENTS, TICKETS_URL } from '../constants';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
};

const fadeUpDelayed = (delay: number) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] } },
});

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
};

export default function Speakers() {
  const pageRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });

  // Horizontal scroll mapping for the speakers section
  // The section provides scroll room from ~15% to ~45% of total page scroll
  const speakerCount = SPEAKERS.length;
  const cardWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? 90 : 40; // vw units
  const totalTranslate = speakerCount * cardWidth;
  const xPercent = useTransform(
    scrollYProgress,
    [0.15, 0.45],
    [0, -(totalTranslate - 100)]
  );

  // Opacity for sections
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.95]);

  return (
    <div ref={pageRef} className="bg-brand-primary text-white font-sans overflow-x-hidden">
      
      {/* ═══ HERO SECTION ═══ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-[100dvh] w-full flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Large ambient background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[40vw] md:text-[28vw] font-title font-black uppercase leading-none tracking-tighter text-white/[0.03]">
            Voices
          </span>
        </div>

        <div className="relative z-10 text-center space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <span className="inline-block font-typewriter text-[10px] md:text-xs uppercase tracking-[0.35em] text-brand-secondary/80 mb-6 md:mb-8 border border-brand-secondary/20 px-4 py-1.5 rounded-full">
              Segment 0{SEGMENTS.length} &middot; TEDxAlMuntazirSchoolYouth
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
            className="text-[18vw] md:text-[10vw] lg:text-[8vw] font-title font-black uppercase leading-[0.85] tracking-tighter"
          >
            Global
            <br />
            <span className="text-brand-secondary italic font-editorial lowercase not-italic tracking-normal">Voices</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-editorial italic text-base md:text-2xl text-white/50 max-w-md mx-auto leading-relaxed"
          >
            Time is the currency we borrow. These voices exchange it for insight.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white/25">
            Scroll
          </span>
          <div className="w-px h-12 md:h-16 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ═══ STATEMENT DIVIDER ═══ */}
      <section className="relative py-32 md:py-48 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="font-editorial italic text-3xl md:text-5xl lg:text-6xl text-white/80 leading-snug"
          >
            Each speaker carries a distinct relationship with time —{' '}
            <span className="text-brand-secondary not-italic font-title uppercase">a borrowed perspective</span>{' '}
            that shapes how we understand our past, navigate our present, and build our future.
          </motion.p>
        </div>
      </section>

      {/* ═══ ABOUT SECTION (TWO COLUMNS) ═══ */}
      <section className="border-t border-white/5 py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <span className="font-typewriter text-[9px] md:text-[11px] uppercase tracking-[0.35em] text-white/30 mb-6 block">
              The Assembly
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-title font-black uppercase tracking-tighter leading-[0.85]">
              Nine minds.
              <br />
              <span className="text-brand-secondary italic font-editorial lowercase not-italic">one stage.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-8"
          >
            <p className="font-sans text-sm md:text-base text-white/60 leading-relaxed">
              From the archives of memory to the frontier of innovation, our speakers traverse the full
              spectrum of human experience. Each talk is a meditation on time — how we measure it, how we
              waste it, how we transcend it.
            </p>
            <p className="font-sans text-sm md:text-base text-white/50 leading-relaxed">
              Spanning three segments — The Past, The Present, The Future — this assembly brings together
              young leaders, thinkers, and creators who are shaping the narrative of our generation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ SPEAKERS HORIZONTAL SCROLL SECTION ═══ */}
      <section className="relative h-[400vh] md:h-[250vh]">
        <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center">
          {/* Section label (fixed left) */}
          <div className="absolute top-8 md:top-12 left-6 md:left-16 z-20 flex items-center gap-4">
            <span className="w-6 h-px bg-brand-secondary/50" />
            <span className="font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.35em] text-white/40">
              The Voices &mdash; 0{speakerCount} Speakers
            </span>
          </div>

          {/* Mobile: vertical scroll instead */}
          <div className="md:hidden w-full h-full overflow-y-auto no-scrollbar px-6 py-20">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-5%' }}
              className="space-y-6"
            >
              {SPEAKERS.map((speaker, idx) => {
                const segment = SEGMENTS.find((s) => s.id === speaker.segmentId);
                return (
                  <motion.div
                    key={speaker.id}
                    variants={staggerItem}
                    className="group relative border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-500 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-typewriter text-[9px] uppercase tracking-[0.2em] text-brand-secondary/60">
                            0{idx + 1}
                          </span>
                          <span className="w-px h-3 bg-white/10" />
                          <span className={`
                            font-typewriter text-[7px] uppercase tracking-[0.2em]
                            ${segment?.id === 'past' ? 'text-blue-300/50' : ''}
                            ${segment?.id === 'present' ? 'text-brand-secondary/50' : ''}
                            ${segment?.id === 'future' ? 'text-amber-300/50' : ''}
                          `}>
                            {segment?.title || ''}
                          </span>
                        </div>
                        <h3 className="text-xl font-title font-black uppercase tracking-tighter leading-none text-white group-hover:text-brand-secondary transition-colors">
                          {speaker.name}
                        </h3>
                        <p className="font-editorial italic text-sm text-white/40 line-clamp-1">
                          &ldquo;{speaker.topic}&rdquo;
                        </p>
                      </div>
                      <div className="shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-brand-secondary group-hover:border-brand-secondary/50 transition-all duration-500">
                        <ChevronRight size={14} />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="font-sans text-xs text-white/50 leading-relaxed line-clamp-2">
                        {speaker.bio}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Desktop: horizontal scroll track */}
          <motion.div
            ref={horizontalRef}
            style={{ x: xPercent }}
            className="hidden md:flex items-center gap-12 px-16 will-change-transform"
          >
            {SPEAKERS.map((speaker, idx) => {
              const segment = SEGMENTS.find((s) => s.id === speaker.segmentId);
              return (
                <motion.div
                  key={speaker.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.05, ease: [0.25, 1, 0.5, 1] }}
                  className="group relative w-[36vw] h-[60vh] shrink-0 border border-white/10 rounded-3xl p-10 flex flex-col justify-between hover:bg-white/[0.03] transition-all duration-700 cursor-pointer overflow-hidden"
                >
                  {/* Large number watermark */}
                  <span className="absolute -top-8 -right-4 text-[20vw] font-title font-black text-white/[0.03] pointer-events-none select-none leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Top section */}
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="font-typewriter text-[9px] uppercase tracking-[0.2em] text-brand-secondary/60">
                        0{idx + 1}
                      </span>
                      <span className="w-px h-4 bg-white/10" />
                      <span className={`
                        font-typewriter text-[8px] uppercase tracking-[0.2em]
                        ${segment?.id === 'past' ? 'text-blue-300/50' : ''}
                        ${segment?.id === 'present' ? 'text-brand-secondary/50' : ''}
                        ${segment?.id === 'future' ? 'text-amber-300/50' : ''}
                      `}>
                        {segment?.title || ''}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[3.5vw] font-title font-black uppercase leading-[0.85] tracking-tighter text-white group-hover:text-brand-secondary transition-colors duration-500">
                        {speaker.name}
                      </h3>
                      <p className="font-editorial italic text-lg text-white/40">
                        &ldquo;{speaker.topic}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-px bg-brand-secondary/40" />
                    <p className="font-sans text-sm text-white/50 leading-relaxed line-clamp-3">
                      {speaker.bio}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-10 h-10 rounded-full border border-brand-secondary/30 flex items-center justify-center text-brand-secondary">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══ SEGMENTS SECTION ═══ */}
      <section className="border-t border-white/5 py-32 md:py-40 px-6 md:px-16">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="mb-20 md:mb-28"
          >
            <span className="font-typewriter text-[9px] md:text-[11px] uppercase tracking-[0.35em] text-white/30 mb-4 block">
              The Segments
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-title font-black uppercase tracking-tighter leading-[0.85] max-w-4xl">
              Three dimensions of{' '}
              <span className="text-brand-secondary italic font-editorial lowercase not-italic">borrowed time</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {SEGMENTS.map((segment, idx) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.25, 1, 0.5, 1] }}
                className="group relative border border-white/10 rounded-2xl p-8 md:p-10 hover:bg-white/[0.03] transition-all duration-500"
              >
                <span className="text-6xl md:text-7xl font-title font-black text-white/[0.04] absolute top-6 right-6 leading-none select-none">
                  {segment.number}
                </span>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                    <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-brand-secondary/70">
                      {segment.number}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-title font-black uppercase tracking-tighter leading-none text-white group-hover:text-brand-secondary transition-colors duration-500">
                      {segment.title}
                    </h3>
                    <p className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/30">
                      {segment.subtitle}
                    </p>
                  </div>

                  <div className="w-10 h-px bg-white/10" />

                  <p className="font-sans text-sm md:text-[15px] text-white/50 leading-relaxed">
                    {segment.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="border-t border-white/5 py-32 md:py-40 px-6 md:px-16">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
            className="relative bg-brand-secondary/10 border border-brand-secondary/20 rounded-[2.5rem] p-12 md:p-24 lg:p-32 text-center overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <span className="absolute -top-16 -right-16 text-[35vw] md:text-[20vw] font-title font-black text-white/[0.03] leading-none">
                &rsquo;26
              </span>
            </div>

            <div className="relative z-10 space-y-8 md:space-y-10">
              <span className="inline-block font-typewriter text-[9px] md:text-[11px] uppercase tracking-[0.35em] text-brand-secondary/70 border border-brand-secondary/20 px-5 py-2 rounded-full">
                Secure Your Seat
              </span>

              <h2 className="text-5xl md:text-7xl lg:text-8xl font-title font-black uppercase tracking-tighter leading-[0.85] max-w-3xl mx-auto">
                Don't just watch
                <br />
                <span className="italic font-editorial lowercase text-brand-secondary not-italic">be part of it.</span>
              </h2>

              <p className="font-editorial italic text-lg md:text-2xl text-white/50 max-w-xl mx-auto leading-relaxed">
                The clock is ticking. Join us in Dar es Salaam for an unforgettable journey through the dimensions of time.
              </p>

              <motion.a
                href={TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-4 bg-brand-secondary text-white px-10 md:px-14 py-5 md:py-6 rounded-full font-title font-bold text-lg md:text-xl uppercase tracking-widest hover:bg-white hover:text-brand-primary transition-all duration-500 shadow-2xl group"
              >
                Get Tickets
                <ArrowUpRight
                  size={20}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
