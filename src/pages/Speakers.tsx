import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Menu } from 'lucide-react';
import FloatingBackground from '../components/FloatingBackground';

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio?: string;
}

const AUTO_INTERVAL = 5000;

export default function Speakers() {
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [theaterMenuOpen, setTheaterMenuOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isTheater = activeIndex !== null;

  useEffect(() => { setSpeakersData(SPEAKERS); }, []);

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
    if (activeIndex !== null) setActiveIndex((activeIndex + 1) % speakersData.length);
  }, [activeIndex, speakersData.length]);
  const theaterGoPrev = useCallback(() => {
    if (activeIndex !== null) setActiveIndex((activeIndex - 1 + speakersData.length) % speakersData.length);
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

  const openTheater = () => setActiveIndex(currentIndex);

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
  const segmentIdx = speaker ? SEGMENTS.findIndex(s => s.id === speaker.segmentId) + 1 : 0;

  const theaterSpeaker = isTheater && activeIndex !== null ? speakersData[activeIndex] : null;
  const theaterSegment = theaterSpeaker ? SEGMENTS.find(s => s.id === theaterSpeaker.segmentId) : null;
  const theaterSegmentLabel = theaterSegment?.title || '';
  const theaterSegmentIdx = theaterSpeaker ? SEGMENTS.findIndex(s => s.id === theaterSpeaker.segmentId) + 1 : 0;

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
    <div className="relative w-full h-screen overflow-hidden bg-brand-primary">
      <FloatingBackground />

      {/* ═══ MAIN HERO ═══ */}
      <div
        className="relative z-10 w-full h-screen flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 md:px-16 lg:px-24 pt-5 md:pt-10 lg:pt-14 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-secondary" />
            <span className="font-typewriter text-[6px] md:text-[9px] text-white/30 tracking-[0.4em] md:tracking-[0.5em] uppercase">
              {segmentLabel}
            </span>
          </div>
          <span className="font-typewriter text-[6px] md:text-[8px] text-white/15 tracking-[0.3em] md:tracking-[0.4em] uppercase">
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

           {/* Speaker name - Roulette style */}
           <div className="relative w-full text-center overflow-hidden px-2 md:px-0" style={{ minHeight: 'clamp(80px, 22vw, 200px)' }}>
             <div className="relative w-full h-full flex items-center justify-center">
               <div className="relative w-full" style={{ perspective: '1000px' }}>
                 <AnimatePresence mode="wait" custom={direction}>
                   <motion.div
                     key={currentIndex}
                     custom={direction}
                     initial={{ rotateX: direction > 0 ? 90 : -90, opacity: 0 }}
                     animate={{ rotateX: 0, opacity: 1 }}
                     exit={{ rotateX: direction > 0 ? -90 : 90, opacity: 0 }}
                     transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                     style={{ transformOrigin: 'center' }}
                     className="w-full"
                   >
                     <h1 className="text-[clamp(32px,16vw,160px)] md:text-[10vw] lg:text-[8.5vw] font-title font-black uppercase leading-[0.8] tracking-tighter text-white max-w-full">
                       {speaker?.name || ''}
                     </h1>
                   </motion.div>
                 </AnimatePresence>
               </div>
             </div>
           </div>

          {/* Topic */}
          <div className="relative w-full text-center overflow-hidden mt-2 md:mt-6" style={{ minHeight: 'clamp(28px, 7vw, 60px)' }}>
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.p
                key={`topic-${currentIndex}`}
                custom={direction}
                initial={{ y: direction > 0 ? '110%' : '-110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? '-110%' : '110%', opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}
                className="font-editorial text-[5vw] md:text-[2.5vw] lg:text-[2vw] italic text-white/45 leading-snug"
              >
                &ldquo;{speaker?.topic || ''}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Bio */}
          <div className="relative w-full text-center overflow-hidden mt-3 md:mt-8 max-w-xl mx-auto" style={{ minHeight: 'clamp(48px, 10vw, 80px)' }}>
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.p
                key={`bio-${currentIndex}`}
                custom={direction}
                initial={{ y: direction > 0 ? '110%' : '-110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? '-110%' : '110%', opacity: 0 }}
                transition={{ duration: 0.45, delay: 0.16, ease: [0.76, 0, 0.24, 1] }}
                className="font-sans text-[3.5vw] md:text-[1.1vw] lg:text-[0.95vw] text-white/55 leading-[1.6] md:leading-[1.7] line-clamp-2 md:line-clamp-3"
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
            className="mt-4 md:mt-10 group relative inline-flex items-center gap-2 md:gap-3 px-5 md:px-8 py-2.5 md:py-4 border border-white/15 rounded-full hover:border-brand-secondary/50 hover:bg-brand-secondary/10 transition-all duration-500"
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

       {/* ═══ THEATER OVERLAY ═══ */}
       <AnimatePresence>
         {isTheater && theaterSpeaker && (
           <motion.div
             key={`theater-${activeIndex}`}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
             className="fixed inset-0 w-full h-screen flex flex-col md:flex-row overflow-hidden z-[200]"
           >
             {/* Menu Pill (Top center) */}
             <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4, duration: 0.5 }}
               className="absolute top-6 left-1/2 -translate-x-1/2 z-30 md:hidden"
             >
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setTheaterMenuOpen(!theaterMenuOpen)}
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/50 hover:bg-brand-secondary/20 transition-all duration-300"
               >
                 <Menu size={16} className="text-brand-secondary" />
                 <span className="font-typewriter text-[7px] uppercase tracking-[0.2em] text-brand-secondary font-semibold">Menu</span>
               </motion.button>

               {/* Menu Panel (horizontal dropdown) */}
               <AnimatePresence>
                 {theaterMenuOpen && (
                   <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.3 }}
                     className="absolute top-14 left-1/2 -translate-x-1/2 w-56 bg-brand-primary border border-white/10 rounded-lg p-4 shadow-2xl"
                   >
                     <div className="flex flex-col gap-3">
                       <button
                         onClick={() => {
                           setActiveIndex(null);
                           setTheaterMenuOpen(false);
                         }}
                         className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded transition-all"
                       >
                         Close Theater
                       </button>
                       <div className="h-px bg-white/10" />
                       <button
                         onClick={() => setTheaterMenuOpen(false)}
                         className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded transition-all"
                       >
                         Settings
                       </button>
                       <button
                         onClick={() => setTheaterMenuOpen(false)}
                         className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded transition-all"
                       >
                         Share Speaker
                       </button>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </motion.div>
            {/* Left / Top: Navy */}
            <div className="relative w-full md:w-[45%] h-[55vh] md:h-full bg-brand-primary flex flex-col justify-center px-6 md:px-16 lg:px-20 overflow-y-auto">
              {/* Close */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={() => setActiveIndex(null)}
                className="absolute top-5 md:top-10 left-5 md:left-10 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white transition-all duration-300"
              >
                <X size={14} />
              </motion.button>

              {/* Watermark */}
              <div className="absolute bottom-8 md:bottom-16 left-6 md:left-16 lg:left-20 right-6 md:right-16 pointer-events-none select-none overflow-hidden">
                <motion.span
                  key={`theater-watermark-${activeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.06 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-[18vw] md:text-[10vw] font-title font-black uppercase leading-none tracking-tighter text-white whitespace-nowrap block"
                >
                  {theaterSpeaker.name}
                </motion.span>
              </div>

              <div className="relative z-10 space-y-5 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                  <span className="font-typewriter text-[7px] md:text-[9px] uppercase tracking-[0.35em] text-brand-secondary/70 font-semibold">
                    0{theaterSegmentIdx} / {theaterSegmentLabel}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </motion.div>

                <div className="overflow-hidden">
                  <motion.h2
                    key={`theater-name-${activeIndex}`}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
                    className="text-3xl md:text-5xl lg:text-6xl font-title font-black uppercase leading-[0.85] tracking-tighter text-white"
                  >
                    {theaterSpeaker.name}
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  <div className="relative pl-4 md:pl-5 border-l-[1.5px] border-brand-secondary/50">
                    <p className="font-editorial text-sm md:text-xl lg:text-2xl italic text-white/50 leading-snug">
                      &ldquo;{theaterSpeaker.topic}&rdquo;
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="pt-4 md:pt-6 border-t border-white/8"
                >
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <span className="font-typewriter text-[6px] md:text-[8px] uppercase tracking-[0.3em] text-white/25">The Narrative</span>
                    <div className="h-px flex-1 bg-white/8" />
                  </div>
                  <p className="font-sans text-xs md:text-sm text-white/45 leading-[1.7] line-clamp-3 md:line-clamp-5">
                    {theaterSpeaker.bio || 'This speaker will be sharing transformative insights on the intersection of humanity and time.'}
                  </p>
                </motion.div>
              </div>
            </div>

             {/* Right / Bottom: White panel */}
             <div className="relative w-full md:w-[55%] h-[45vh] md:h-full bg-[#f8f8f6] flex flex-col px-6 md:px-16 lg:px-20 overflow-y-auto">
               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent" />

               {/* Close button (mobile only) */}
               <motion.button
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.3 }}
                 whileHover={{ scale: 1.1, rotate: 90 }}
                 onClick={() => setActiveIndex(null)}
                 className="md:hidden absolute top-5 right-5 z-20 w-8 h-8 rounded-full border border-brand-primary/15 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all duration-300"
               >
                 <X size={14} />
               </motion.button>

               <div className="space-y-5 md:space-y-8 py-6 md:py-8">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3, duration: 0.5 }}
                 >
                   <p className="font-typewriter text-[7px] md:text-[9px] uppercase tracking-[0.35em] text-brand-primary/25 mb-3 md:mb-5">
                     Speaker Information
                   </p>
                   <div className="grid grid-cols-2 gap-6 md:gap-10">
                     <div>
                       <p className="font-sans text-[10px] md:text-xs text-brand-primary/35 mb-1">Segment</p>
                       <p className="font-title text-lg md:text-2xl text-brand-secondary font-black uppercase tracking-tight">{theaterSegmentLabel}</p>
                     </div>
                     <div>
                       <p className="font-sans text-[10px] md:text-xs text-brand-primary/35 mb-1">Position</p>
                       <p className="font-title text-lg md:text-2xl text-brand-primary font-black uppercase tracking-tight">0{theaterSegmentIdx}</p>
                     </div>
                   </div>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.45, duration: 0.5 }}
                   className="pt-5 md:pt-8 border-t border-brand-outline/15"
                 >
                   <p className="font-typewriter text-[7px] md:text-[9px] uppercase tracking-[0.35em] text-brand-primary/25 mb-3 md:mb-5">
                     Full Narrative
                   </p>
                   <p className="font-editorial text-xs md:text-sm text-brand-primary/40 italic leading-relaxed mb-3 md:mb-4">
                     Presentation Overview
                   </p>
                   <p className="font-sans text-xs md:text-sm text-brand-primary/55 leading-[1.7] md:leading-[1.8]">
                     {theaterSpeaker.bio || 'This speaker will be sharing transformative insights on the intersection of humanity and time.'}
                   </p>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.55, duration: 0.5 }}
                   className="pt-5 md:pt-8 border-t border-brand-outline/15 flex items-center justify-between"
                 >
                   <span className="font-typewriter text-[6px] md:text-[8px] uppercase tracking-[0.25em] text-brand-primary/15">
                     TEDxAlMuntazirSchoolYouth 2026
                   </span>
                   <span className="font-typewriter text-[6px] md:text-[8px] uppercase tracking-[0.25em] text-brand-primary/15">
                     [ {activeIndex! + 1} / {speakersData.length} ]
                   </span>
                 </motion.div>

                 {/* Desktop nav in white panel */}
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.5 }}
                   className="hidden md:flex items-center gap-4 pt-5 border-t border-brand-outline/15"
                 >
                   <button onClick={theaterGoPrev} className="w-10 h-10 rounded-full border border-brand-outline/20 flex items-center justify-center text-brand-primary/30 hover:text-brand-primary transition-all active:scale-90">
                     <ChevronLeft size={14} />
                   </button>
                   <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/20">
                     {activeIndex! + 1} / {speakersData.length}
                   </span>
                   <button onClick={theaterGoNext} className="w-10 h-10 rounded-full border border-brand-outline/20 flex items-center justify-center text-brand-primary/30 hover:text-brand-primary transition-all active:scale-90">
                     <ChevronRight size={14} />
                   </button>
                 </motion.div>

                 {/* Mobile nav */}
                 <div className="md:hidden flex items-center justify-center gap-4 pt-4 pb-4">
                   <button onClick={theaterGoPrev} className="w-9 h-9 rounded-full border border-brand-outline/20 flex items-center justify-center text-brand-primary/30 active:scale-90 transition-all">
                     <ChevronLeft size={14} />
                   </button>
                   <span className="font-typewriter text-[7px] uppercase tracking-[0.2em] text-brand-primary/20">
                     {activeIndex! + 1} / {speakersData.length}
                   </span>
                   <button onClick={theaterGoNext} className="w-9 h-9 rounded-full border border-brand-outline/20 flex items-center justify-center text-brand-primary/30 active:scale-90 transition-all">
                     <ChevronRight size={14} />
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
