import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { X, ChevronLeft, ChevronRight, ArrowUpRight, ChevronDown } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio: string;
  talk_description: string;
}

function RevealText({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <Tag>{children}</Tag>
    </motion.div>
  );
}

function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Speakers() {
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'bio' | 'talk'>('bio');

  const isTheater = activeIndex !== null;

  useEffect(() => {
    setSpeakersData(SPEAKERS as Speaker[]);
  }, []);

  // Body lock
  useEffect(() => {
    if (isTheater) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = Number(document.body.dataset.scrollY || 0);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isTheater]);

  const groupedSpeakers = SEGMENTS.map((segment) => ({
    segment,
    speakers: speakersData.filter((s) => s.segmentId === segment.id),
  }));

  const theaterSpeaker = isTheater && activeIndex !== null ? speakersData[activeIndex] : null;
  const theaterSegment = theaterSpeaker
    ? SEGMENTS.find((s) => s.id === theaterSpeaker.segmentId)
    : null;
  const theaterSegmentLabel = theaterSegment?.title || '';
  const theaterSegmentIdx = theaterSpeaker
    ? SEGMENTS.findIndex((s) => s.id === theaterSpeaker.segmentId) + 1
    : 0;

  const theaterGoNext = useCallback(() => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % speakersData.length);
      setActiveTab('bio');
    }
  }, [activeIndex, speakersData.length]);

  const theaterGoPrev = useCallback(() => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + speakersData.length) % speakersData.length);
      setActiveTab('bio');
    }
  }, [activeIndex, speakersData.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isTheater) {
        if (e.key === 'Escape') setActiveIndex(null);
        if (e.key === 'ArrowRight') theaterGoNext();
        if (e.key === 'ArrowLeft') theaterGoPrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isTheater, theaterGoNext, theaterGoPrev]);

  if (speakersData.length === 0) {
    return (
      <div className="h-screen w-full bg-brand-primary flex items-center justify-center">
        <div className="font-typewriter text-white/20 animate-pulse tracking-[0.5em] uppercase text-sm">
          Loading the assembly...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f7f4ee]">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[90vh] md:min-h-screen bg-brand-primary flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 md:mb-6"
          >
            <span className="font-typewriter text-[10px] md:text-xs tracking-[0.4em] text-brand-secondary/70 uppercase">
              TEDxAlMuntazirSchoolYouth 2026
            </span>
          </motion.div>

          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-title font-black text-[14vw] md:text-[9vw] lg:text-[7vw] uppercase leading-[0.8] tracking-tighter text-white"
            >
              Global
              <br />
              <span className="inline-block mt-1 md:mt-2">
                <span className="text-brand-secondary">Voices</span>
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial italic text-base md:text-xl lg:text-2xl text-white/60 max-w-lg leading-relaxed"
          >
            Nine minds. Three timelines. One stage. Meet the speakers shaping
            our relationship with time.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-typewriter text-[7px] uppercase tracking-[0.4em] text-white/30">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={14} className="text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SEGMENT SECTIONS ═══ */}
      {groupedSpeakers.map(
        ({ segment, speakers }, segIdx) =>
          speakers.length > 0 && (
            <section
              key={segment.id}
              className={`relative px-6 md:px-16 lg:px-24 py-20 md:py-28 lg:py-36 ${
                segIdx % 2 === 0 ? 'bg-[#f7f4ee]' : 'bg-white'
              }`}
            >
              <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-12 md:mb-16 lg:mb-20">
                  <RevealText delay={0}>
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <span className="font-typewriter text-[10px] md:text-xs tracking-[0.3em] text-brand-secondary uppercase">
                        {segment.number} / {segment.subtitle}
                      </span>
                      <div className="h-px flex-1 max-w-[80px] bg-brand-secondary/30" />
                    </div>
                  </RevealText>

                  <RevealText delay={0.1}>
                    <h2 className="font-title font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-brand-primary leading-[0.85]">
                      {segment.title}
                    </h2>
                  </RevealText>

                  <RevealText delay={0.2}>
                    <p className="font-sans text-sm md:text-base text-brand-primary/50 max-w-lg mt-4 md:mt-6 leading-relaxed">
                      {segment.description}
                    </p>
                  </RevealText>
                </div>

                {/* Speaker Portfolio Grid (Lukebaffait.fr style) */}
                <StaggerChildren staggerDelay={0.1}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    {speakers.map((sp) => (
                      <StaggerItem key={sp.id}>
                        <motion.button
                          onClick={() => {
                            setActiveIndex(
                              speakersData.findIndex((s) => s.id === sp.id)
                            );
                            setActiveTab('bio');
                          }}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative w-full text-left bg-white rounded-2xl p-6 md:p-8 border border-brand-primary/5 hover:border-brand-secondary/20 transition-all duration-500 shadow-sm hover:shadow-lg hover:shadow-brand-primary/5"
                        >
                          {/* Segment badge */}
                          <div className="flex items-center gap-2 mb-4 md:mb-6">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                            <span className="font-typewriter text-[7px] uppercase tracking-[0.25em] text-brand-secondary/60">
                              {segment.subtitle}
                            </span>
                          </div>

                          {/* Name — large, like lukebaffait.fr project titles */}
                          <h3 className="font-editorial italic lowercase text-2xl md:text-3xl lg:text-4xl text-brand-primary leading-[0.9] mb-3 transition-colors duration-300 group-hover:text-brand-secondary">
                            {sp.name.toLowerCase()}
                          </h3>

                          {/* Topic */}
                          <p className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-brand-primary/40 mb-3 md:mb-4 line-clamp-1">
                            {sp.topic}
                          </p>

                          {/* Bio preview */}
                          <p className="font-sans text-xs md:text-[13px] text-brand-primary/60 leading-relaxed line-clamp-2 md:line-clamp-3">
                            {sp.bio}
                          </p>

                          {/* View indicator */}
                          <div className="mt-4 md:mt-6 flex items-center gap-2 text-brand-secondary/60 group-hover:text-brand-secondary transition-colors duration-300">
                            <span className="font-typewriter text-[7px] uppercase tracking-[0.25em]">
                              View profile
                            </span>
                            <motion.span
                              className="inline-block"
                              initial={{ x: 0 }}
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowUpRight
                                size={11}
                                className="group-hover:rotate-45 transition-transform duration-300"
                              />
                            </motion.span>
                          </div>

                          {/* Bottom accent line */}
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-secondary/0 group-hover:bg-brand-secondary/40 rounded-b-2xl transition-all duration-500" />
                        </motion.button>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerChildren>
              </div>
            </section>
          )
      )}

      {/* ═══ FOOTER CTA ═══ */}
      <section className="relative bg-brand-primary px-6 md:px-16 lg:px-24 py-20 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <RevealText delay={0}>
            <span className="font-typewriter text-[10px] md:text-xs tracking-[0.4em] text-brand-secondary/70 uppercase block mb-6">
              Be Part of the Moment
            </span>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="font-title font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-white leading-[0.85] mb-8">
              Don&apos;t Waste
              <br />
              <span className="text-brand-secondary italic font-editorial lowercase">
                Your Time
              </span>
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <a
              href="https://tukiio.com/event/tedxalmuntazirschoolsyouth"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-10 md:px-14 py-4 md:py-5 bg-brand-secondary text-white rounded-full hover:bg-brand-secondary/90 transition-all duration-500 hover:scale-105 active:scale-98"
            >
              <span className="font-typewriter text-xs md:text-sm uppercase tracking-[0.25em] font-black">
                Secure Your Seat
              </span>
              <ArrowUpRight
                size={16}
                className="group-hover:rotate-45 transition-transform duration-500"
              />
            </a>
          </RevealText>
        </div>
      </section>

      {/* ═══ THEATER OVERLAY ═══ */}
      <AnimatePresence>
        {isTheater && theaterSpeaker && (
          <motion.div
            key={`theater-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 w-full h-[100dvh] bg-[#f7f4ee] flex flex-col overflow-hidden z-[200] text-[#000839]"
          >
            {/* Thin top border */}
            <div className="w-full h-px bg-[#000839]/10 shrink-0" />

            {/* TOP: Speaker Selection Pill Menu */}
            <div className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-[#000839]/10 bg-[#f7f4ee] shrink-0 relative z-30">
              <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 mr-3 py-0.5">
                {speakersData.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveIndex(idx);
                      setActiveTab('bio');
                    }}
                    className={`px-3 py-1.5 rounded-full text-[8px] md:text-[9px] font-sans font-semibold uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap border ${
                      idx === activeIndex
                        ? 'bg-[#000839] text-[#f7f4ee] border-[#000839]'
                        : 'border-[#000839]/10 text-[#000839]/50 hover:text-[#000839] hover:border-[#000839]/30'
                    }`}
                  >
                    {idx + 1}. {s.name.split(' ')[0].toLowerCase()}
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveIndex(null)}
                className="w-8 h-8 rounded-full border border-[#000839]/10 flex items-center justify-center text-[#000839]/60 hover:text-[#000839] hover:border-[#000839]/30 transition-all duration-300 shrink-0"
              >
                <X size={12} />
              </motion.button>
            </div>

            {/* MAIN BODY */}
            <div className="flex-1 min-h-0 flex flex-col md:flex-row">
              {/* LEFT: Speaker Identity */}
              <div className="w-full md:w-[45%] border-b md:border-b-0 md:border-r border-[#000839]/10 flex flex-col justify-center p-6 md:p-12 lg:p-16 shrink-0">
                <div className="space-y-4 md:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                    <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-[#000839]/50">
                      segment 0{theaterSegmentIdx} /{' '}
                      {theaterSegmentLabel.toLowerCase()}
                    </span>
                  </motion.div>

                  <div className="overflow-hidden">
                    <motion.h2
                      key={`theater-name-${activeIndex}`}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="font-editorial italic lowercase text-3xl md:text-4xl lg:text-5xl text-[#000839] tracking-tight leading-[0.9]"
                    >
                      {theaterSpeaker.name.toLowerCase()}
                    </motion.h2>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="relative pl-4 border-l border-[#000839]/20"
                  >
                    <p className="font-editorial italic text-sm md:text-base lg:text-lg text-[#000839]/75 leading-snug">
                      &ldquo;{theaterSpeaker.topic}&rdquo;
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* RIGHT: Narrative Canvas */}
              <div className="flex-1 flex flex-col justify-between min-h-0 p-6 md:p-12 lg:p-16 bg-[#f5f2eb]">
                {/* Mobile Tab Toggle */}
                <div className="md:hidden flex items-center p-1 bg-[#000839]/5 rounded-full border border-[#000839]/5 mb-5 shrink-0">
                  <button
                    onClick={() => setActiveTab('bio')}
                    className={`flex-1 py-2 text-center text-[9px] font-sans font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 relative ${
                      activeTab === 'bio'
                        ? 'text-[#f7f4ee]'
                        : 'text-[#000839]/60'
                    }`}
                  >
                    {activeTab === 'bio' && (
                      <motion.div
                        layoutId="mobile-speaker-tab-glow"
                        className="absolute inset-0 bg-[#000839] rounded-full z-[-1]"
                        transition={{
                          type: 'spring',
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}
                    the{' '}
                    <span className="font-editorial italic lowercase">
                      biography
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('talk')}
                    className={`flex-1 py-2 text-center text-[9px] font-sans font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 relative ${
                      activeTab === 'talk'
                        ? 'text-[#f7f4ee]'
                        : 'text-[#000839]/60'
                    }`}
                  >
                    {activeTab === 'talk' && (
                      <motion.div
                        layoutId="mobile-speaker-tab-glow"
                        className="absolute inset-0 bg-[#000839] rounded-full z-[-1]"
                        transition={{
                          type: 'spring',
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}
                    about the{' '}
                    <span className="font-editorial italic lowercase">
                      discourse
                    </span>
                  </button>
                </div>

                {/* Desktop: Two-column narrative */}
                <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12 h-full items-start overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#000839]/10 pb-2">
                      <span className="font-typewriter text-[8px] uppercase tracking-[0.25em] text-[#000839]/40">
                        the{' '}
                        <span className="font-editorial italic lowercase">
                          biography
                        </span>
                      </span>
                    </div>
                    <p className="font-sans text-xs lg:text-[13px] text-[#000839]/70 leading-relaxed max-h-[35vh] overflow-y-auto no-scrollbar">
                      {theaterSpeaker.bio}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#000839]/10 pb-2">
                      <span className="font-typewriter text-[8px] uppercase tracking-[0.25em] text-[#000839]/40">
                        about the{' '}
                        <span className="font-editorial italic lowercase">
                          discourse
                        </span>
                      </span>
                    </div>
                    <p className="font-editorial italic text-sm lg:text-[15px] text-[#000839]/85 leading-relaxed max-h-[35vh] overflow-y-auto no-scrollbar">
                      {theaterSpeaker.talk_description}
                    </p>
                  </div>
                </div>

                {/* Mobile: Single tab view */}
                <div className="md:hidden flex-1 min-h-0 relative">
                  <AnimatePresence mode="wait">
                    {activeTab === 'bio' ? (
                      <motion.div
                        key="bio-panel"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2 border-b border-[#000839]/5 pb-1">
                          <span className="font-typewriter text-[7px] uppercase tracking-[0.2em] text-[#000839]/30">
                            curated background
                          </span>
                        </div>
                        <p className="font-sans text-[12px] text-[#000839]/75 leading-relaxed overflow-y-auto no-scrollbar max-h-[22vh]">
                          {theaterSpeaker.bio}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="talk-panel"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2 border-b border-[#000839]/5 pb-1">
                          <span className="font-typewriter text-[7px] uppercase tracking-[0.2em] text-[#000839]/30">
                            presentation synopsis
                          </span>
                        </div>
                        <p className="font-editorial italic text-[13px] text-[#000839]/85 leading-relaxed overflow-y-auto no-scrollbar max-h-[22vh]">
                          {theaterSpeaker.talk_description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="pt-4 border-t border-[#000839]/10 flex items-center justify-between shrink-0 mt-4">
                  <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-[#000839]/30">
                    tedx 2026 / global assembly
                  </span>
                  <div className="flex items-center gap-4 md:gap-6">
                    <button
                      onClick={theaterGoPrev}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-[#000839]/10 flex items-center justify-center text-[#000839]/40 hover:text-[#000839] hover:border-[#000839]/30 transition-all active:scale-90 shrink-0"
                    >
                      <ChevronLeft size={11} />
                    </button>
                    <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-[#000839]/40">
                      {String(activeIndex! + 1).padStart(2, '0')} /{' '}
                      {String(speakersData.length).padStart(2, '0')}
                    </span>
                    <button
                      onClick={theaterGoNext}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-[#000839]/10 flex items-center justify-center text-[#000839]/40 hover:text-[#000839] hover:border-[#000839]/30 transition-all active:scale-90 shrink-0"
                    >
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}