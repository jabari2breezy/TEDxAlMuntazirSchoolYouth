import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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

function KineticMarquee({ text, direction = 'left' }: { text: string; direction?: 'left' | 'right' }) {
  return (
    <div className={`relative w-full overflow-hidden whitespace-nowrap ${direction === 'right' ? 'text-right' : ''}`}>
      <motion.div
        className="inline-block"
        initial={{ x: direction === 'left' ? '0%' : '-50%' }}
        animate={{ x: direction === 'left' ? '-50%' : '0%' }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="inline-block mx-12 md:mx-16 text-[14vw] md:text-[10vw] font-title font-black text-brand-primary/[0.04] tracking-tighter select-none leading-none">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Speakers() {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const filteredSpeakers = speakersData.filter(speaker => {
    const matchesSegment = selectedSegment === 'all' || speaker.segmentId === selectedSegment;
    return matchesSegment;
  });

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
    <div className={`relative w-full ${isTheater ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <InteractiveBackground />
      <FloatingBackground />

      <div className={isTheater ? 'flex-1 flex flex-col' : ''}>
        <AnimatePresence mode="wait">
          {!isTheater ? (
            /* ═══ M2 STUDIO - INSPIRED GRID ═══ */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-y-auto pb-32"
            >
              {/* Hero Section */}
              <section className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
                {/* Kinetic background marquees */}
                <div className="absolute inset-0 flex flex-col justify-center gap-4 md:gap-6 opacity-60 pointer-events-none select-none">
                  <KineticMarquee text="MEET THE ASSEMBLY" direction="left" />
                  <KineticMarquee text="WHO MOVES THE ROOM" direction="right" />
                  <KineticMarquee text="MEET THE ASSEMBLY" direction="left" />
                  <KineticMarquee text="WHO MOVES THE ROOM" direction="right" />
                </div>

                {/* Hero content */}
                <div className="relative z-10">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <div className="font-typewriter text-[9px] md:text-[10px] text-brand-secondary tracking-[1em] uppercase mb-6 md:mb-8">
                      The Assembly
                    </div>
                    <h1 className="text-[15vw] md:text-[10vw] font-title font-black tracking-tighter leading-[0.75] uppercase text-brand-primary">
                      Speakers
                    </h1>
                    <p className="max-w-md font-editorial text-base md:text-xl text-brand-primary/40 italic leading-snug mt-6 md:mt-8">
                      Meet the people asking: What are you doing with the time you've got?
                    </p>
                  </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="absolute bottom-8 md:bottom-12 left-6 md:left-12 lg:left-20 flex items-center gap-3"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-px h-8 md:h-10 bg-brand-primary/20"
                  />
                  <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-brand-primary/20">
                    Scroll
                  </span>
                </motion.div>
              </section>

              {/* Filter Bar - M2 style minimal */}
              <div className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-brand-outline/10">
                <div className="px-6 md:px-12 lg:px-20 py-4 md:py-5 flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar">
                  {['all', ...SEGMENTS.map(s => s.id)].map(id => (
                    <button
                      key={id}
                      onClick={() => setSelectedSegment(id)}
                      className="relative py-1 font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.4em] transition-all whitespace-nowrap shrink-0"
                    >
                      <span className={selectedSegment === id ? 'text-brand-primary' : 'text-brand-primary/25 hover:text-brand-primary/50'}>
                        {id === 'all' ? 'All' : SEGMENTS.find(s => s.id === id)?.title}
                      </span>
                      {selectedSegment === id && (
                        <motion.div layoutId="filter-bar" className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-brand-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speaker List - M2 Studio style minimal rows */}
              <div className="px-6 md:px-12 lg:px-20 py-10 md:py-16">
                {isLoading ? (
                  <div className="py-20 text-center font-typewriter text-brand-primary/20 animate-pulse tracking-[0.5em] uppercase text-sm">
                    Retrieving the Assembly...
                  </div>
                ) : filteredSpeakers.length === 0 ? (
                  <div className="py-20 text-center font-typewriter text-brand-primary/30 tracking-[0.3em] uppercase text-xs">
                    No speakers found
                  </div>
                ) : (
                  <div className="divide-y divide-brand-outline/10">
                    {filteredSpeakers.map((s, i) => {
                      const segTitle = SEGMENTS.find(seg => seg.id === s.segmentId)?.title || '';
                      const isHovered = hoveredId === s.id;
                      const segColor = s.segmentId === 'past' ? 'text-brand-primary' : s.segmentId === 'present' ? 'text-brand-secondary' : 'text-brand-primary';

                      return (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true, margin: '-50px' }}
                          transition={{ duration: 0.5 }}
                          onMouseEnter={() => setHoveredId(s.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() => setActiveIndex(speakersData.indexOf(s))}
                          className="group relative grid grid-cols-[1fr_auto] md:grid-cols-[1fr_1fr_auto] gap-4 md:gap-8 items-center py-6 md:py-8 cursor-pointer transition-colors duration-300 hover:bg-brand-primary/[0.02] -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20"
                        >
                          {/* Number */}
                          <div className="hidden md:block font-typewriter text-[9px] tracking-[0.2em] text-brand-primary/15 font-semibold">
                            {(i + 1).toString().padStart(2, '0')}
                          </div>

                          {/* Name + meta */}
                          <div className="flex flex-col gap-1 md:gap-1.5 min-w-0">
                            <div className="flex items-center gap-2 md:gap-3">
                              {/* Segment indicator dot */}
                              <motion.div
                                animate={{
                                  scale: isHovered ? 1.4 : 1,
                                  backgroundColor: isHovered 
                                    ? (s.segmentId === 'present' ? '#006d38' : '#000839')
                                    : (s.segmentId === 'present' ? '#006d38' : '#000839'),
                                }}
                                transition={{ duration: 0.3 }}
                                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0 ${segColor}`}
                              />
                              <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] text-brand-primary/25 font-medium">
                                {segTitle}
                              </span>
                            </div>
                            <h3 className="font-title text-xl md:text-2xl lg:text-3xl font-black text-brand-primary tracking-tight leading-tight">
                              {s.name.split(' ').map((word, wi, arr) => (
                                <span key={wi}>
                                  <motion.span
                                    className="inline-block"
                                    animate={{ y: isHovered ? -2 : 0 }}
                                    transition={{ duration: 0.2, delay: wi * 0.03 }}
                                  >
                                    {word}
                                  </motion.span>
                                  {wi < arr.length - 1 && ' '}
                                </span>
                              ))}
                            </h3>
                            <p className="font-editorial text-sm md:text-base text-brand-primary/35 italic leading-snug line-clamp-1 max-w-xl">
                              {s.topic}
                            </p>
                          </div>

                          {/* CTA */}
                          <div className="flex items-center gap-3 md:gap-4 shrink-0">
                            <motion.div
                              animate={{
                                opacity: isHovered ? 1 : 0.4,
                                x: isHovered ? 0 : 6,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-primary/15 group-hover:border-brand-secondary/40 flex items-center justify-center transition-all duration-300">
                                <motion.svg
                                  className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-primary/30 group-hover:text-brand-secondary transition-colors duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <motion.path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    animate={{ x: isHovered ? [0, 3, 0] : 0 }}
                                    transition={{ duration: 1, repeat: isHovered ? Infinity : 0, ease: 'easeInOut' }}
                                  />
                                </motion.svg>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
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
              {/* Left / Top: Editorial Aesthetic (Navy) */}
              <div className="relative w-full md:w-[48%] h-[50vh] md:h-full bg-gradient-to-br from-brand-primary via-brand-primary to-brand-primary/80 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 overflow-y-auto">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />

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

                <div className="relative z-10 w-full max-w-lg text-white space-y-4 md:space-y-8">
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

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="hidden md:flex items-center gap-4 pt-6 md:pt-8 border-t border-white/10"
                  >
                    <button onClick={goPrev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all active:scale-90">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-white/30">
                      {activeIndex! + 1} / {speakersData.length}
                    </span>
                    <button onClick={goNext} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all active:scale-90">
                      <ChevronRight size={16} />
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Right / Bottom: White Panel */}
              <div className="relative w-full md:w-[52%] h-[50vh] md:h-full bg-white/95 backdrop-blur-sm flex flex-col justify-center p-6 md:p-12 lg:p-16 overflow-y-auto">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />

                <div className="relative z-10 space-y-4 md:space-y-8">
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                    <p className="font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.35em] md:tracking-[0.4em] text-brand-primary/30 mb-2 md:mb-3">
                      Speaker Information
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                      <div>
                        <p className="font-sans text-[10px] md:text-sm text-brand-primary/40 mb-1">Segment</p>
                        <p className="font-title text-base md:text-xl text-brand-secondary font-black uppercase tracking-tight">{segmentLabel}</p>
                      </div>
                      <div>
                        <p className="font-sans text-[10px] md:text-sm text-brand-primary/40 mb-1">Position</p>
                        <p className="font-title text-base md:text-xl text-brand-primary font-black uppercase tracking-tight">0{segmentIdx}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="border-t border-brand-outline/20 pt-4 md:pt-8">
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

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="border-t border-brand-outline/20 pt-4 md:pt-8 flex items-center justify-between">
                    <p className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-brand-primary/20">
                      TEDxAlMuntazirSchoolYouth 2026
                    </p>
                    <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-brand-primary/20">
                      [ {activeIndex! + 1} / {speakersData.length} ]
                    </span>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="md:hidden flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-brand-outline/20">
                  <button onClick={goPrev} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-outline/30 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all active:scale-90">
                    <ChevronLeft size={14} className="md:w-4 md:h-4" />
                  </button>
                  <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-brand-primary/30">
                    {activeIndex! + 1} / {speakersData.length}
                  </span>
                  <button onClick={goNext} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-outline/30 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all active:scale-90">
                    <ChevronRight size={14} className="md:w-4 md:h-4" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Bottom pagination - always visible in grid */}
      {!isTheater && (
        <motion.div
          layout
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 border-t border-brand-outline/10 bg-white/80 backdrop-blur-lg mt-auto"
        >
          <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-4 md:py-6 flex items-center justify-between gap-4">
            <div className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-brand-primary/25 font-semibold whitespace-nowrap">
              TEDxAlMuntazirSchoolYouth
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              {speakersData.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => goToSpeaker(idx)}
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
                    activeIndex === idx ? 'w-6 md:w-8 bg-brand-secondary' : 'w-1.5 md:w-2 bg-brand-outline/40 hover:bg-brand-outline/70'
                  }`}
                  aria-label={`Go to speaker ${idx + 1}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
            <div className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-brand-primary/20 font-semibold whitespace-nowrap">
              [ {filteredSpeakers.length} ]
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
