import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import MaskReveal from '../components/MaskReveal';
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
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isTheater = activeIndex !== null;

  // Global viewport lock + touch prevention
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

  // Initialize speakers data
  useEffect(() => {
    setSpeakersData(SPEAKERS);
    setIsLoading(false);
  }, []);

  const filteredSpeakers = speakersData.filter(speaker => {
    const matchesSegment = selectedSegment === 'all' || speaker.segmentId === selectedSegment;
    const matchesSearch = speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         speaker.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSegment && matchesSearch;
  });

  const speaker = isTheater && activeIndex !== null ? speakersData[activeIndex] : null;
  const segment = speaker ? SEGMENTS.find(s => s.id === speaker.segmentId) : null;
  const segmentLabel = segment?.title || '';
  const segmentIdx = speaker ? SEGMENTS.findIndex(s => s.id === speaker.segmentId) + 1 : 0;
  const isTBA = speaker ? (speaker.name === 'Speaker TBA' || speaker.topic === 'Topic to be announced') : false;

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
    <div className={`relative w-full flex flex-col ${isTheater ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <InteractiveBackground />
      <FloatingBackground />

      {/* Content Area */}
      <div className={isTheater ? 'flex-1 flex flex-col' : ''}>
        <AnimatePresence mode="wait">
          {!isTheater ? (
            /* ═══ GRID VIEW ═══ */
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col overflow-y-auto pb-32"
            >
              <div className="px-6 md:px-16 max-w-screen-2xl mx-auto w-full relative z-10 pt-16 md:pt-32">
                {/* Header */}
                <header className="mb-24 md:mb-32">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    className="max-w-4xl"
                  >
                    <div className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase mb-8 md:mb-12">
                      The Guest List
                    </div>
                    <h1 className="text-6xl md:text-[12vw] font-title font-black tracking-tighter leading-[0.75] uppercase flex flex-col text-brand-primary">
                      <MaskReveal delay={0.2}>The</MaskReveal>
                      <MaskReveal delay={0.4} className="italic font-editorial lowercase -ml-4 md:-ml-6 text-brand-secondary">
                        Assembly.
                      </MaskReveal>
                    </h1>
                  </motion.div>
                  <div className="max-w-xs font-editorial text-lg md:text-2xl text-brand-primary/40 italic leading-tight mt-12">
                    Meet the people asking: What are you doing with the time you've got?
                  </div>
                </header>

                {/* Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12 mb-16 md:mb-24 border-y border-brand-outline py-8 md:py-12 px-6 -mx-6 bg-white/3 backdrop-blur-sm rounded-xl relative z-20">
                  <div className="flex flex-wrap gap-6 md:gap-8">
                    {['all', ...SEGMENTS.map(s => s.id)].map(id => (
                      <button
                        key={id}
                        onClick={() => setSelectedSegment(id)}
                        className={`py-2 font-typewriter text-[10px] md:text-[11px] uppercase tracking-[0.4em] transition-all relative ${
                          selectedSegment === id ? 'text-brand-secondary' : 'text-brand-primary/40 hover:text-brand-primary'
                        }`}
                      >
                        {id === 'all' ? 'Everything' : SEGMENTS.find(s => s.id === id)?.title}
                        {selectedSegment === id && (
                          <motion.div layoutId="filter-underline" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brand-secondary" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-grow max-w-md border-l border-brand-outline pl-8 md:pl-12 hidden lg:block">
                    <Search className="absolute left-12 md:left-16 top-1/2 -translate-y-1/2 text-brand-primary/20" size={14} />
                    <input
                      type="text"
                      placeholder="Find a talk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none py-3 md:py-4 px-8 md:px-12 font-sans text-sm md:text-base text-brand-primary focus:outline-none placeholder:text-brand-primary/20 placeholder:font-typewriter placeholder:text-[9px] md:text-[10px] placeholder:uppercase placeholder:tracking-[0.4em]"
                    />
                  </div>
                </div>

                {/* Speaker Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {isLoading ? (
                    <div className="col-span-full py-20 text-center font-typewriter text-brand-primary/20 animate-pulse tracking-[0.5em] uppercase text-sm">
                      Retrieving the Assembly...
                    </div>
                  ) : filteredSpeakers.length === 0 ? (
                    <div className="col-span-full py-20 text-center font-typewriter text-brand-primary/30 tracking-[0.3em] uppercase text-xs">
                      No speakers found
                    </div>
                  ) : (
                    filteredSpeakers.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setActiveIndex(speakersData.indexOf(s))}
                        className="group relative border border-brand-outline/30 bg-gradient-to-br from-brand-primary/5 to-transparent backdrop-blur-sm rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-500 hover:border-brand-secondary/50 hover:bg-brand-secondary/5"
                      >
                        {/* Glow on hover */}
                        <motion.div
                          className="absolute -inset-px rounded-2xl opacity-0 blur-xl pointer-events-none"
                          animate={{ opacity: 0 }}
                          whileHover={{ opacity: 0.1 }}
                          transition={{ duration: 0.3 }}
                          style={{ background: 'linear-gradient(135deg, #006d38, #000839)' }}
                        />

                        {/* Content */}
                        <div className="relative z-10 space-y-4">
                          {/* Segment badge */}
                          <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-brand-secondary" />
                            <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-brand-secondary/60">
                              0{SEGMENTS.findIndex(seg => seg.id === s.segmentId) + 1} / {segment?.title || 'SEGMENT'}
                            </span>
                          </div>

                          {/* Name */}
                          <div>
                            <h3 className="text-2xl md:text-3xl font-title font-black uppercase text-brand-primary leading-tight tracking-tighter">
                              {s.name}
                            </h3>
                          </div>

                          {/* Topic */}
                          <p className="font-editorial text-base md:text-lg text-brand-primary/50 italic leading-snug">
                            "{s.topic}"
                          </p>

                          {/* Bio preview */}
                          <p className="font-sans text-xs md:text-sm text-brand-primary/40 leading-relaxed line-clamp-2">
                            {s.bio || "Transformative insights on the intersection of humanity and time."}
                          </p>

                          {/* Arrow indicator */}
                          <div className="flex items-center gap-2 pt-3 md:pt-4">
                            <div className="h-px flex-1 bg-brand-outline/20 group-hover:bg-brand-secondary/30 transition-all" />
                            <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/30 group-hover:text-brand-secondary transition-all">
                              Expand
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          ) : speaker ? (
            /* ═══ THEATER VIEW ═══ */
            <motion.div
              key={`theater-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col md:flex-row overflow-hidden"
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Left / Top: Editorial Aesthetic (Navy gradient box) */}
              <div className="relative w-full md:w-[48%] bg-gradient-to-br from-brand-primary via-brand-primary to-brand-primary/80 flex flex-col justify-center items-center p-8 md:p-12 md:p-16">
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
                  className="absolute top-6 md:top-8 left-6 md:left-8 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all"
                >
                  <X size={16} />
                </motion.button>

                {/* Content */}
                <div className="relative z-10 w-full max-w-lg text-white space-y-6 md:space-y-8">
                  {/* Segment badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-secondary shrink-0" />
                    <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-brand-secondary/80 font-semibold">
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
                      className="text-4xl md:text-5xl lg:text-6xl font-title font-black uppercase leading-[0.85] tracking-tighter"
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
                    <div className="relative pl-4 md:pl-6">
                      <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-secondary/50 rounded-full" />
                      <p className="font-editorial text-lg md:text-2xl italic text-white/70 leading-snug">
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
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-typewriter text-[7px] uppercase tracking-[0.35em] text-white/30">The Narrative</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <p className="font-sans text-sm md:text-base text-white/60 leading-[1.8] line-clamp-4 md:line-clamp-6">
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
              <div className="relative w-full md:w-[52%] bg-white/95 backdrop-blur-sm flex flex-col justify-center p-8 md:p-12 lg:p-16 overflow-hidden">
                {/* Decorative accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />

                {/* Secondary details grid */}
                <div className="relative z-10 space-y-6 md:space-y-8">
                  {/* Role / Speaker title */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <p className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-brand-primary/30 mb-2">
                      Speaker Information
                    </p>
                    <div className="grid grid-cols-2 gap-6 md:gap-8">
                      <div>
                        <p className="font-sans text-xs md:text-sm text-brand-primary/40 mb-1">Segment</p>
                        <p className="font-title text-lg md:text-xl text-brand-secondary font-black uppercase tracking-tight">
                          {segmentLabel}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-xs md:text-sm text-brand-primary/40 mb-1">Position</p>
                        <p className="font-title text-lg md:text-xl text-brand-primary font-black uppercase tracking-tight">
                          0{segmentIdx}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Extended bio section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="border-t border-brand-outline/20 pt-6 md:pt-8"
                  >
                    <p className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-brand-primary/30 mb-3 md:mb-4">
                      Full Narrative
                    </p>
                    <p className="font-editorial text-sm md:text-base text-brand-primary/50 italic leading-relaxed mb-4">
                      Presentation Overview
                    </p>
                    <p className="font-sans text-xs md:text-sm text-brand-primary/60 leading-[1.8] line-clamp-5 md:line-clamp-8">
                      {speaker.bio || "This speaker will be sharing transformative insights on the intersection of humanity, technology, and the ticking clock of our shared existence. Their perspective challenges us to rethink how we choose to spend the time we possess."}
                    </p>
                  </motion.div>

                  {/* Event metadata */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="border-t border-brand-outline/20 pt-6 md:pt-8 flex items-center justify-between"
                  >
                    <p className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/20">
                      TEDxAlMuntazirSchoolYouth 2026
                    </p>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/20">
                      [ {activeIndex! + 1} / {speakersData.length} ]
                    </span>
                  </motion.div>
                </div>

                {/* Mobile navigation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="md:hidden flex items-center justify-center gap-4 mt-8 pt-6 border-t border-brand-outline/20"
                >
                  <button
                    onClick={goPrev}
                    className="w-10 h-10 rounded-full border border-brand-outline/30 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all active:scale-90"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/30">
                    {activeIndex! + 1} / {speakersData.length}
                  </span>
                  <button
                    onClick={goNext}
                    className="w-10 h-10 rounded-full border border-brand-outline/30 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary transition-all active:scale-90"
                  >
                    <ChevronRight size={16} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ═══ BOTTOM PAGINATION DOCK ═══ */}
      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-30 border-t border-brand-outline/20 bg-white/80 backdrop-blur-lg ${
          isTheater ? 'shrink-0' : 'mt-auto'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-4 md:py-6 flex items-center justify-between gap-4">
          {/* Left: Brand / Name */}
          <div className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-brand-primary/25 font-semibold whitespace-nowrap">
            {isTheater ? (
              <motion.span
                key={`dock-name-${activeIndex}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {speaker?.name || 'TEDx'}
              </motion.span>
            ) : (
              'TEDxAlMuntazirSchoolYouth'
            )}
          </div>

          {/* Center: Dot Navigation */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {speakersData.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => goToSpeaker(idx)}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
                  activeIndex === idx
                    ? 'w-6 md:w-8 bg-brand-secondary'
                    : 'w-1.5 md:w-2 bg-brand-outline/40 hover:bg-brand-outline/70'
                }`}
                aria-label={`Go to speaker ${idx + 1}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}

            {/* Reset button */}
            {isTheater && (
              <motion.button
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                onClick={() => setActiveIndex(null)}
                className="ml-2 md:ml-3 font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-brand-primary/30 hover:text-brand-secondary transition-colors whitespace-nowrap"
              >
                Close
              </motion.button>
            )}
          </div>

          {/* Right: Counter */}
          <div className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-brand-primary/20 font-semibold whitespace-nowrap">
            {isTheater
              ? `[ ${activeIndex! + 1} / ${speakersData.length} ]`
              : `[ ${filteredSpeakers.length} ]`
            }
          </div>
        </div>
      </motion.div>
    </div>
  );
}
