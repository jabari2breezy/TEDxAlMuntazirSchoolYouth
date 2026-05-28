import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import InteractiveBackground from '../components/InteractiveBackground';
import FloatingBackground from '../components/FloatingBackground';

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio?: string;
  role?: string;
}

export default function Speakers() {
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isTheater = activeIndex !== null;

  useEffect(() => {
    if (isTheater) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = Number(document.body.dataset.scrollY || 0);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      const scrollY = Number(document.body.dataset.scrollY || 0);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
    };
  }, [isTheater]);

  useEffect(() => {
    setSpeakersData(SPEAKERS);
  }, []);

  const speaker = speakersData[currentIndex];
  const segment = speaker ? SEGMENTS.find(s => s.id === speaker.segmentId) : null;
  const segmentLabel = segment?.title || '';
  const segmentIdx = speaker ? SEGMENTS.findIndex(s => s.id === speaker.segmentId) + 1 : 0;

  const goNext = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % speakersData.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + speakersData.length) % speakersData.length);
  };

  const goToSpeaker = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const openTheater = (idx: number) => {
    setActiveIndex(idx);
  };

  const theaterSpeaker = isTheater && activeIndex !== null ? speakersData[activeIndex] : null;
  const theaterSegment = theaterSpeaker ? SEGMENTS.find(s => s.id === theaterSpeaker.segmentId) : null;
  const theaterSegmentLabel = theaterSegment?.title || '';
  const theaterSegmentIdx = theaterSpeaker ? SEGMENTS.findIndex(s => s.id === theaterSpeaker.segmentId) + 1 : 0;

  const theaterGoNext = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % speakersData.length);
  };
  const theaterGoPrev = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + speakersData.length) % speakersData.length);
  };

  const variants = {
    enter: (d: number) => ({
      y: d > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      y: d > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-primary">
      <InteractiveBackground />
      <FloatingBackground />

      {/* ═══ SHUFFLE HERO ═══ */}
      <div className="relative z-10 w-full h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24">
        {/* Top label */}
        <div className="absolute top-24 md:top-32 left-6 md:left-16 lg:left-24">
          <div className="font-typewriter text-[8px] md:text-[10px] text-brand-secondary/60 tracking-[0.5em] uppercase mb-1">
            TEDxAlMuntazirSchoolYouth 2026
          </div>
          <div className="font-typewriter text-[7px] md:text-[9px] text-white/20 tracking-[0.5em] uppercase">
            The Assembly
          </div>
        </div>

        {/* Segment badge */}
        <div className="absolute top-24 md:top-32 right-6 md:right-16 lg:right-24 text-right">
          <div className="font-typewriter text-[7px] md:text-[9px] text-white/30 tracking-[0.4em] uppercase">
            0{segmentIdx} / {segmentLabel}
          </div>
          <div className="w-8 md:w-12 h-px bg-brand-secondary/40 ml-auto mt-2" />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center max-w-screen-2xl mx-auto w-full relative">
          {/* Subtle context line */}
          <div className="font-typewriter text-[7px] md:text-[8px] text-white/20 tracking-[0.5em] uppercase mb-6 md:mb-8">
            Speaker {currentIndex + 1} / {speakersData.length}
          </div>

          {/* Huge shuffling name */}
          <div className="overflow-hidden relative h-[20vw] md:h-[12vw] mb-4 md:mb-6">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.h1
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="text-[16vw] md:text-[10vw] lg:text-[9vw] font-title font-black uppercase leading-[0.85] tracking-tighter text-white"
              >
                {speaker?.name || ''}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Topic */}
          <div className="overflow-hidden h-[6vw] md:h-[3.5vw] mb-8 md:mb-12">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.p
                key={`topic-${currentIndex}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="font-editorial text-[4vw] md:text-[2.5vw] lg:text-[2vw] italic text-white/40 leading-snug"
              >
                "{speaker?.topic || ''}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* View profile button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openTheater(currentIndex)}
              className="group relative inline-flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-brand-secondary text-white font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.4em] rounded-full overflow-hidden transition-all"
            >
              <span className="relative z-10">View Profile</span>
              <ArrowUpRight size={14} className="md:w-4 md:h-4 relative z-10 group-hover:rotate-45 transition-transform duration-300" />
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.span
                className="absolute inset-0 z-10 flex items-center justify-center text-brand-primary font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.4em]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                View Profile
              </motion.span>
            </motion.button>

            {/* View all speakers button */}
            <button
              onClick={() => openTheater(0)}
              className="font-typewriter text-[7px] md:text-[9px] text-white/30 hover:text-white tracking-[0.3em] uppercase transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/30"
            >
              All Speakers
            </button>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between gap-4 md:gap-6 pb-12 md:pb-16">
          {/* Prev / Next */}
          <div className="flex items-center gap-3 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goPrev}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all"
            >
              <ChevronLeft size={16} className="md:w-5 md:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all"
            >
              <ChevronRight size={16} className="md:w-5 md:h-5" />
            </motion.button>
          </div>

          {/* Dot navigation */}
          <div className="flex items-center gap-2 md:gap-3">
            {speakersData.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => goToSpeaker(idx)}
                className={`rounded-full transition-all duration-500 ${
                  idx === currentIndex
                    ? 'w-6 md:w-10 h-1.5 md:h-2 bg-brand-secondary'
                    : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-white/20 hover:bg-white/40'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to speaker ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="font-typewriter text-[8px] md:text-[10px] text-white/20 tracking-[0.3em]">
            {String(currentIndex + 1).padStart(2, '0')} / {String(speakersData.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* ═══ THEATER OVERLAY ═══ */}
      <AnimatePresence>
        {isTheater && theaterSpeaker && (
          <motion.div
            key={`theater-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 w-full h-screen flex flex-col md:flex-row overflow-hidden z-[200]"
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Left / Top: Navy panel */}
            <div className="relative w-full md:w-[48%] h-[50vh] md:h-full bg-gradient-to-br from-brand-primary via-brand-primary to-brand-primary/80 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 overflow-y-auto">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ rotate: 90 }}
                onClick={() => setActiveIndex(null)}
                className="absolute top-4 md:top-8 left-4 md:left-8 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all"
              >
                <X size={14} className="md:w-4 md:h-4" />
              </motion.button>

              <div className="relative z-10 w-full max-w-lg text-white space-y-4 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="flex items-center gap-2 md:gap-3"
                >
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-secondary shrink-0" />
                  <span className="font-typewriter text-[7px] md:text-[9px] uppercase tracking-[0.35em] md:tracking-[0.4em] text-brand-secondary/80 font-semibold">
                    0{theaterSegmentIdx} / {theaterSegmentLabel}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </motion.div>

                <div className="overflow-hidden">
                  <motion.h2
                    key={`name-${activeIndex}`}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl md:text-5xl lg:text-6xl font-title font-black uppercase leading-[0.85] tracking-tighter"
                  >
                    {theaterSpeaker.name}
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative pl-2 md:pl-6">
                    <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-secondary/50 rounded-full" />
                    <p className="font-editorial text-sm md:text-2xl italic text-white/70 leading-snug">
                      "{theaterSpeaker.topic}"
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="font-typewriter text-[6px] md:text-[7px] uppercase tracking-[0.3em] md:tracking-[0.35em] text-white/30">The Narrative</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <p className="font-sans text-xs md:text-base text-white/60 leading-[1.7] md:leading-[1.8] line-clamp-3 md:line-clamp-6">
                    {theaterSpeaker.bio || "This speaker will be sharing transformative insights."}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="hidden md:flex items-center gap-4 pt-6 md:pt-8 border-t border-white/10"
                >
                  <button onClick={theaterGoPrev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-white/30">
                    {activeIndex! + 1} / {speakersData.length}
                  </span>
                  <button onClick={theaterGoNext} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90">
                    <ChevronRight size={16} />
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Right / Bottom: White panel */}
            <div className="relative w-full md:w-[52%] h-[50vh] md:h-full bg-white/95 backdrop-blur-sm flex flex-col justify-center p-6 md:p-12 lg:p-16 overflow-y-auto">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />

              <div className="relative z-10 space-y-4 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <p className="font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.35em] md:tracking-[0.4em] text-brand-primary/30 mb-2 md:mb-3">
                    Speaker Information
                  </p>
                  <div className="grid grid-cols-2 gap-4 md:gap-8">
                    <div>
                      <p className="font-sans text-[10px] md:text-sm text-brand-primary/40 mb-1">Segment</p>
                      <p className="font-title text-base md:text-xl text-brand-secondary font-black uppercase tracking-tight">{theaterSegmentLabel}</p>
                    </div>
                    <div>
                      <p className="font-sans text-[10px] md:text-sm text-brand-primary/40 mb-1">Position</p>
                      <p className="font-title text-base md:text-xl text-brand-primary font-black uppercase tracking-tight">0{theaterSegmentIdx}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="border-t border-brand-outline/20 pt-4 md:pt-8"
                >
                  <p className="font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.35em] md:tracking-[0.4em] text-brand-primary/30 mb-2 md:mb-4">
                    Full Narrative
                  </p>
                  <p className="font-editorial text-xs md:text-base text-brand-primary/50 italic leading-relaxed mb-3 md:mb-4">
                    Presentation Overview
                  </p>
                  <p className="font-sans text-[11px] md:text-sm text-brand-primary/60 leading-[1.6] md:leading-[1.8]">
                    {theaterSpeaker.bio || "This speaker will be sharing transformative insights."}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="border-t border-brand-outline/20 pt-4 md:pt-8 flex items-center justify-between"
                >
                  <p className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-brand-primary/20">
                    TEDxAlMuntazirSchoolYouth 2026
                  </p>
                  <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-brand-primary/20">
                    [ {activeIndex! + 1} / {speakersData.length} ]
                  </span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="md:hidden flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-brand-outline/20"
              >
                <button onClick={theaterGoPrev} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-outline/30 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all active:scale-90">
                  <ChevronLeft size={14} className="md:w-4 md:h-4" />
                </button>
                <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-brand-primary/30">
                  {activeIndex! + 1} / {speakersData.length}
                </span>
                <button onClick={theaterGoNext} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-outline/30 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all active:scale-90">
                  <ChevronRight size={14} className="md:w-4 md:h-4" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
