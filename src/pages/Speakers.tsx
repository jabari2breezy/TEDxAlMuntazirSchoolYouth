import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio?: string;
  role?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const SEGMENT_COLORS: Record<string, { bg: string; text: string; accent: string; gradient: string }> = {
  past: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    accent: 'bg-amber-200',
    gradient: 'from-amber-100 to-amber-50',
  },
  present: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    accent: 'bg-emerald-200',
    gradient: 'from-emerald-100 to-emerald-50',
  },
  future: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    accent: 'bg-indigo-200',
    gradient: 'from-indigo-100 to-indigo-50',
  },
};

const SEGMENT_MONO_COLORS: Record<string, string> = {
  past: '#92400e',
  present: '#065f46',
  future: '#3730a3',
};

export default function Speakers() {
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    setIsLoading(false);
  }, []);

  const speaker = isTheater && activeIndex !== null ? speakersData[activeIndex] : null;
  const segment = speaker ? SEGMENTS.find(s => s.id === speaker.segmentId) : null;
  const segmentLabel = segment?.title || '';
  const segmentIdx = speaker ? SEGMENTS.findIndex(s => s.id === speaker.segmentId) + 1 : 0;

  const goNext = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % speakersData.length);
  };

  const goPrev = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + speakersData.length) % speakersData.length);
  };

  const goToSpeaker = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <div className={`relative w-full flex flex-col ${isTheater ? 'h-screen overflow-hidden' : 'min-h-screen bg-white'}`}>
      {/* Content Area */}
      <div className={isTheater ? 'flex-1 flex flex-col' : ''}>
        <AnimatePresence mode="wait">
          {!isTheater ? (
            /* ═══ GRID VIEW - TEDxMontmartre Style ═══ */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col overflow-y-auto"
            >
              <div className="max-w-[1280px] mx-auto w-full px-6 md:px-12 py-16 md:py-24">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="mb-16 md:mb-24"
                >
                  <p className="font-typewriter text-[10px] text-brand-secondary tracking-[0.5em] uppercase mb-4">
                    The Speakers
                  </p>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-title font-black uppercase leading-[0.9] tracking-tighter text-brand-primary">
                    Meet the<br />
                    <span className="italic font-editorial lowercase text-brand-secondary">Assembly</span>
                  </h2>
                </motion.div>

                {/* Speaker Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {isLoading ? (
                    <div className="col-span-full py-20 text-center font-typewriter text-brand-primary/20 animate-pulse tracking-[0.5em] uppercase text-sm">
                      Loading...
                    </div>
                  ) : (
                    speakersData.map((s, i) => {
                      const segColors = SEGMENT_COLORS[s.segmentId] || SEGMENT_COLORS.present;
                      const monoColor = SEGMENT_MONO_COLORS[s.segmentId] || '#065f46';
                      const initials = getInitials(s.name);
                      const isHovered = hoveredIndex === i;

                      return (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                          onMouseEnter={() => setHoveredIndex(i)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => setActiveIndex(speakersData.indexOf(s))}
                          className="group cursor-pointer"
                        >
                          {/* Card */}
                          <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white transition-all duration-500"
                            style={{
                              boxShadow: isHovered
                                ? `0 20px 60px -15px ${monoColor}25, 0 0 0 1px ${monoColor}15`
                                : '0 4px 20px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.04)',
                            }}
                          >
                            {/* Hero Block - Initials Monogram (replaces photo) */}
                            <div className={`relative w-full aspect-[4/3] bg-gradient-to-br ${segColors.gradient} flex items-center justify-center overflow-hidden`}>
                              {/* Background decorative circle */}
                              <motion.div
                                className="absolute w-[140%] h-[140%] rounded-full border border-black/5"
                                animate={{
                                  scale: isHovered ? 1.1 : 1,
                                  rotate: isHovered ? 5 : 0,
                                }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                  background: `radial-gradient(circle at 50% 50%, ${monoColor}08 0%, transparent 70%)`,
                                }}
                              />

                              {/* Initials */}
                              <motion.span
                                className={`relative z-10 font-title font-black text-[8rem] md:text-[10rem] leading-none select-none ${segColors.text}`}
                                animate={{
                                  scale: isHovered ? 1.08 : 1,
                                  y: isHovered ? -4 : 0,
                                }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                style={{ opacity: 0.25 }}
                              >
                                {initials}
                              </motion.span>

                              {/* Segment badge - top left */}
                              <div className="absolute top-3 left-3 md:top-4 md:left-4">
                                <div className={`px-2.5 py-1 rounded-full ${segColors.accent} ${segColors.text} font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.2em] font-semibold`}>
                                  {SEGMENTS.find(seg => seg.id === s.segmentId)?.title || 'SEGMENT'}
                                </div>
                              </div>

                              {/* Hover overlay */}
                              <motion.div
                                className="absolute inset-0 bg-black/0 transition-colors duration-500"
                                animate={{ backgroundColor: isHovered ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0)' }}
                              />
                            </div>

                            {/* Info Section */}
                            <div className="p-5 md:p-6 space-y-2">
                              {/* Name */}
                              <h3 className="font-title font-black text-lg md:text-xl uppercase leading-tight tracking-tight text-brand-primary transition-colors duration-300"
                                style={{
                                  color: isHovered ? monoColor : undefined,
                                }}
                              >
                                {s.name}
                              </h3>

                              {/* Topic */}
                              <p className="font-editorial text-sm md:text-base italic text-brand-primary/40 line-clamp-1 leading-snug">
                                {s.topic === 'Topic to be announced' ? (
                                  <span className="font-typewriter not-italic text-[9px] uppercase tracking-[0.3em] text-brand-primary/20">Topic TBA</span>
                                ) : (
                                  `"${s.topic}"`
                                )}
                              </p>

                              {/* Bottom row - number + arrow */}
                              <div className="flex items-center justify-between pt-2">
                                <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/20">
                                  0{i + 1}
                                </span>
                                <motion.div
                                  animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.3 }}
                                  transition={{ duration: 0.3, ease: 'easeOut' }}
                                  className="w-5 h-5 rounded-full border border-brand-primary/20 flex items-center justify-center"
                                >
                                  <svg className="w-2.5 h-2.5 text-brand-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          ) : speaker ? (
            /* ═══ THEATER VIEW - FULL SCREEN ═══ */
            <motion.div
              key={`theater-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 w-full h-screen flex flex-col md:flex-row overflow-hidden z-[200]"
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Left / Top: Editorial Aesthetic (Navy gradient box) */}
              <div className="relative w-full md:w-[48%] h-[50vh] md:h-full bg-gradient-to-br from-brand-primary via-brand-primary to-brand-primary/80 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 overflow-y-auto">
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ rotate: 90 }}
                  onClick={() => setActiveIndex(null)}
                  className="absolute top-4 md:top-8 left-4 md:left-8 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all"
                >
                  <X size={14} className="md:w-4 md:h-4" />
                </motion.button>

                {/* Content */}
                <div className="relative z-10 w-full max-w-lg text-white space-y-4 md:space-y-8">
                  {/* Segment badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="flex items-center gap-2 md:gap-3"
                  >
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-secondary shrink-0" />
                    <span className="font-typewriter text-[7px] md:text-[9px] uppercase tracking-[0.35em] md:tracking-[0.4em] text-brand-secondary/80 font-semibold">
                      0{segmentIdx} / {segmentLabel}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </motion.div>

                  {/* Name with roll-up reveal */}
                  <div className="overflow-hidden">
                    <motion.h2
                      key={`name-${activeIndex}`}
                      initial={{ y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="text-2xl md:text-5xl lg:text-6xl font-title font-black uppercase leading-[0.85] tracking-tighter"
                    >
                      {speaker.name}
                    </motion.h2>
                  </div>

                  {/* Topic quote */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="relative pl-2 md:pl-6">
                      <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-secondary/50 rounded-full" />
                      <p className="font-editorial text-sm md:text-2xl italic text-white/70 leading-snug">
                        "{speaker.topic}"
                      </p>
                    </div>
                  </motion.div>

                  {/* Bio */}
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
                      {speaker.bio || "This speaker will be sharing transformative insights on the intersection of humanity, technology, and the ticking clock of our shared existence."}
                    </p>
                  </motion.div>

                  {/* Navigation (desktop) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="hidden md:flex items-center gap-4 pt-6 md:pt-8 border-t border-white/10"
                  >
                    <button
                      onClick={goPrev}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all active:scale-90"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-white/30">
                      {activeIndex! + 1} / {speakersData.length}
                    </span>
                    <button
                      onClick={goNext}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all active:scale-90"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Right / Bottom: Abstract Content Panel (White) */}
              <div className="relative w-full md:w-[52%] h-[50vh] md:h-full bg-white/95 backdrop-blur-sm flex flex-col justify-center p-6 md:p-12 lg:p-16 overflow-y-auto">
                {/* Decorative accent line */}
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
                        <p className="font-title text-base md:text-xl text-brand-secondary font-black uppercase tracking-tight">
                          {segmentLabel}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-[10px] md:text-sm text-brand-primary/40 mb-1">Position</p>
                        <p className="font-title text-base md:text-xl text-brand-primary font-black uppercase tracking-tight">
                          0{segmentIdx}
                        </p>
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
                      {speaker.bio || "This speaker will be sharing transformative insights on the intersection of humanity, technology, and the ticking clock of our shared existence."}
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

                {/* Mobile navigation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="md:hidden flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-brand-outline/20"
                >
                  <button
                    onClick={goPrev}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-outline/30 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all active:scale-90"
                  >
                    <ChevronLeft size={14} className="md:w-4 md:h-4" />
                  </button>
                  <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-brand-primary/30">
                    {activeIndex! + 1} / {speakersData.length}
                  </span>
                  <button
                    onClick={goNext}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-outline/30 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all active:scale-90"
                  >
                    <ChevronRight size={14} className="md:w-4 md:h-4" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ═══ BOTTOM PAGINATION DOCK ═══ */}
      {!isTheater && (
        <motion.div
          layout
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 border-t border-black/5 bg-white mt-auto"
        >
          <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-4 md:py-6 flex items-center justify-center gap-4">
            <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-black/20 font-semibold">
              {speakersData.length} speakers
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
