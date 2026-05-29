import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { ChevronLeft, ChevronRight, ArrowUpRight, X } from 'lucide-react';
import FloatingBackground from '../components/FloatingBackground';

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio: string;
  talk_description: string;
}

const AUTO_INTERVAL = 5000;

export default function Speakers() {
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % speakersData.length);
  }, [speakersData.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + speakersData.length) % speakersData.length);
  }, [speakersData.length]);

  // Auto-play with progress bar
  useEffect(() => {
    if (!isAutoPlaying || isTheater || speakersData.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }
    setProgress(0);
    const step = 50;
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (step / AUTO_INTERVAL) * 100;
      });
    }, step);
    intervalRef.current = setInterval(goNext, AUTO_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isAutoPlaying, isTheater, goNext, speakersData.length]);

  // Keyboard nav
  const theaterGoNext = useCallback(() => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % speakersData.length);
    }
  }, [activeIndex, speakersData.length]);
  
  const theaterGoPrev = useCallback(() => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + speakersData.length) % speakersData.length);
    }
  }, [activeIndex, speakersData.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isTheater) {
        if (e.key === 'Escape') setActiveIndex(null);
        if (e.key === 'ArrowRight') theaterGoNext();
        if (e.key === 'ArrowLeft') theaterGoPrev();
        return;
      }
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isTheater, goNext, goPrev, theaterGoNext, theaterGoPrev]);

  const goToSpeaker = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const openTheater = () => {
    setActiveIndex(currentIndex);
  };

  // Swipe
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
  };

  const speaker = speakersData[currentIndex];
  const nextSpeaker = speakersData[(currentIndex + 1) % speakersData.length];
  const segment = speaker ? SEGMENTS.find(s => s.id === speaker.segmentId) : null;
  const segmentLabel = segment?.title || '';

  const theaterSpeaker = isTheater && activeIndex !== null ? speakersData[activeIndex] : null;
  const theaterSegment = theaterSpeaker ? SEGMENTS.find(s => s.id === theaterSpeaker.segmentId) : null;
  const theaterSegmentLabel = theaterSegment?.title || '';
  const theaterSegmentIdx = theaterSpeaker ? SEGMENTS.findIndex(s => s.id === theaterSpeaker.segmentId) + 1 : 0;

  if (speakersData.length === 0) {
    return (
      <div className="h-[100dvh] w-full bg-brand-primary flex items-center justify-center">
        <div className="font-typewriter text-white/20 animate-pulse tracking-[0.5em] uppercase text-sm">
          Loading the assembly...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-brand-primary">
      <FloatingBackground />

      {/* ═══ MAIN HERO ═══ */}
      <div
        className="relative z-10 w-full h-[100dvh] flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top bar offset to avoid collision with logo and nav */}
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 pt-24 md:pt-28 shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-secondary" />
            <span className="font-typewriter text-[7px] md:text-[9px] text-white/30 tracking-[0.4em] md:tracking-[0.5em] uppercase">
              {segmentLabel}
            </span>
          </div>
          <span className="font-typewriter text-[7px] md:text-[8px] text-white/15 tracking-[0.3em] md:tracking-[0.4em] uppercase">
            {String(currentIndex + 1).padStart(2, '0')} / {String(speakersData.length).padStart(2, '0')}
          </span>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col justify-center items-center px-5 md:px-16 lg:px-24 relative min-h-0">
          {/* Watermark of next speaker */}
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={`watermark-${currentIndex}`}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.06 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            >
              <span className="text-[28vw] md:text-[18vw] lg:text-[14vw] font-title font-black uppercase leading-none tracking-tighter text-white whitespace-nowrap -translate-y-[10%]">
                {nextSpeaker?.name || ''}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Speaker name - Vertical Roulette Roll Animation */}
          <div className="relative w-full text-center overflow-hidden flex items-center justify-center" style={{ minHeight: 'clamp(80px, 18vw, 180px)' }}>
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.h1
                key={currentIndex}
                custom={direction}
                initial={{ y: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className="text-[10vw] md:text-[8vw] lg:text-[7vw] font-title font-black uppercase leading-[0.85] tracking-tighter text-white break-words w-full"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word',
                  overflow: 'hidden'
                }}
              >
                {speaker?.name || ''}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Topic */}
          <div className="relative w-full text-center overflow-hidden mt-2 md:mt-4" style={{ minHeight: 'clamp(28px, 6vw, 50px)' }}>
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.p
                key={`topic-${currentIndex}`}
                custom={direction}
                initial={{ y: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
                className="font-editorial text-[5vw] md:text-[2.2vw] lg:text-[1.8vw] italic text-white/45 leading-snug"
              >
                &ldquo;{speaker?.topic || ''}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Bio */}
          <div className="relative w-full text-center overflow-hidden mt-3 md:mt-6 max-w-xl mx-auto" style={{ minHeight: 'clamp(48px, 8vw, 70px)' }}>
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.p
                key={`bio-${currentIndex}`}
                custom={direction}
                initial={{ y: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="font-sans text-[3.5vw] md:text-[1.1vw] lg:text-[0.95vw] text-white/55 leading-[1.6] md:leading-[1.7] line-clamp-2"
              >
                {speaker?.bio || 'This speaker will be sharing transformative insights on the intersection of humanity and time.'}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* View Profile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openTheater}
            className="mt-6 md:mt-10 group relative inline-flex items-center gap-2 md:gap-3 px-5 md:px-8 py-2.5 md:py-4 border border-white/15 rounded-full hover:border-brand-secondary/50 hover:bg-brand-secondary/10 transition-all duration-500"
          >
            <span className="font-typewriter text-[7px] md:text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white/80 transition-colors duration-500">
              View Profile
            </span>
            <ArrowUpRight size={11} className="md:w-3.5 md:h-3.5 text-white/30 group-hover:text-brand-secondary group-hover:rotate-45 transition-all duration-500" />
          </motion.button>
        </div>

        {/* Progress bar */}
        {isAutoPlaying && (
          <div className="px-5 md:px-16 lg:px-24 pb-3 md:pb-5 shrink-0">
            <div className="h-[1px] bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-secondary/60 rounded-full"
                style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
              />
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className="flex items-center justify-center gap-4 md:gap-6 pb-5 md:pb-10 lg:pb-14 shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/15 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-300"
          >
            <ChevronLeft size={14} />
          </motion.button>

          <div className="flex items-center gap-1.5 md:gap-2">
            {speakersData.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => goToSpeaker(idx)}
                className={`rounded-full transition-all duration-500 ${
                  idx === currentIndex
                    ? 'w-5 md:w-8 h-[2px] bg-brand-secondary'
                    : 'w-[2px] h-[2px] bg-white/25 hover:bg-white/50'
                }`}
                whileTap={{ scale: 0.8 }}
                aria-label={`Go to speaker ${idx + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/15 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-300"
          >
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* ═══ THEATER OVERLAY (LUKE BAFF_AIT & SITE THEME INTEGRATION) ═══ */}
      <AnimatePresence>
        {isTheater && theaterSpeaker && (
          <motion.div
            key={`theater-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 w-full h-[100dvh] bg-brand-primary flex flex-col overflow-hidden z-[200] text-white"
          >
            {/* Glowing background highlights in Luke Baffait style */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <motion.div 
                className="absolute w-[40vw] h-[40vw] bg-brand-secondary/15 rounded-full blur-[100px] -top-10 -left-10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute w-[50vw] h-[50vw] bg-brand-secondary/10 rounded-full blur-[150px] -bottom-20 -right-10"
                animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/20 via-brand-primary/80 to-brand-primary pointer-events-none" />
            </div>

            {/* Top Bar - Lowered/Pushed down by pt-24 on mobile to prevent any collision with site logo */}
            <div className="w-full flex items-center justify-between px-6 md:px-16 py-4 border-b border-white/10 bg-brand-primary/40 backdrop-blur-md shrink-0 relative z-30 pt-28 md:pt-32">
              <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-3 py-1">
                {speakersData.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveIndex(idx);
                    }}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap border ${
                      idx === activeIndex
                        ? 'bg-brand-secondary text-white border-brand-secondary shadow-[0_0_20px_rgba(0,109,56,0.4)] scale-[1.03]'
                        : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {idx + 1}. {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveIndex(null)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-brand-secondary hover:bg-brand-secondary/10 transition-all duration-300 shrink-0 ml-4"
              >
                <X size={14} />
              </motion.button>
            </div>

            {/* Main structural grid - Luke Baffait clean digital showcase */}
            <div className="flex-1 min-h-0 flex flex-col p-6 md:p-16 lg:p-20 relative z-10 justify-between">
              
              {/* Speaker Title header section */}
              <div className="space-y-2 md:space-y-4 shrink-0 border-l-2 border-brand-secondary pl-6 py-2">
                {/* Segment Tag */}
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                  <span className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40">
                    segment 0{theaterSegmentIdx} — {theaterSegmentLabel}
                  </span>
                </div>

                {/* Speaker Name: High impact custom layout */}
                <h2 className="font-title font-black uppercase text-3xl md:text-5xl lg:text-6xl text-white tracking-tighter leading-none">
                  {theaterSpeaker.name}
                </h2>

                {/* Topic Line */}
                <p className="font-editorial italic text-base md:text-2xl text-brand-secondary leading-snug">
                  &ldquo;{theaterSpeaker.topic}&rdquo;
                </p>
              </div>

              {/* HIGH-END INTERACTIVE FROSTED GLASS PANEL: Displays both biography and discourse together */}
              <div className="flex-1 min-h-0 my-6 md:my-8 flex flex-col justify-center">
                <div className="w-full max-w-5xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col md:flex-row gap-8 lg:gap-14">
                  {/* Subtle glass overlay highlight */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/[0.05] pointer-events-none" />

                  {/* left: Biography Section */}
                  <div className="flex-1 space-y-4 flex flex-col min-h-0 justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md font-typewriter text-[8px] tracking-[0.25em] text-brand-secondary uppercase mb-3 shrink-0">
                        the speaker
                      </div>
                      <h4 className="font-title font-black uppercase text-lg text-white tracking-tight pb-3 border-b border-white/5">
                        Biography
                      </h4>
                      <p className="font-sans text-xs md:text-[13px] text-white/70 leading-relaxed overflow-y-auto no-scrollbar max-h-[14vh] md:max-h-[22vh] pt-4 pr-2">
                        {theaterSpeaker.bio}
                      </p>
                    </div>
                  </div>

                  {/* Center Split Divider Line */}
                  <div className="hidden md:block w-px bg-white/10 align-stretch self-stretch" />
                  <div className="md:hidden h-px bg-white/10 w-full" />

                  {/* right: Discourse Section */}
                  <div className="flex-1 space-y-4 flex flex-col min-h-0 justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/30 rounded-md font-typewriter text-[8px] tracking-[0.25em] text-brand-secondary uppercase mb-3 shrink-0">
                        the discourse
                      </div>
                      <h4 className="font-title font-black uppercase text-lg text-white tracking-tight pb-3 border-b border-white/5">
                        Talk Overview
                      </h4>
                      <p className="font-editorial italic text-xs md:text-[15px] text-brand-secondary/90 leading-relaxed overflow-y-auto no-scrollbar max-h-[14vh] md:max-h-[22vh] pt-4 pr-2">
                        {theaterSpeaker.talk_description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sleek Bottom navigation bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
                <span className="font-typewriter text-[8px] uppercase tracking-[0.25em] text-white/30">
                  tedxalmuntazir / assembly 2026
                </span>
                
                {/* Navigation controls */}
                <div className="flex items-center gap-5">
                  <button 
                    onClick={theaterGoPrev} 
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-brand-secondary hover:bg-brand-secondary/10 transition-all active:scale-90"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/50">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(speakersData.length).padStart(2, '0')}
                  </span>
                  <button 
                    onClick={theaterGoNext} 
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-brand-secondary hover:bg-brand-secondary/10 transition-all active:scale-90"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}