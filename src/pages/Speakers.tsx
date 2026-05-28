import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'motion/react';
import { SEGMENTS } from '../constants';
import { Search, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import MaskReveal from '../components/MaskReveal';
import InteractiveBackground from '../components/InteractiveBackground';
import FloatingBackground from '../components/FloatingBackground';

const transition = { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const };

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio?: string;
  image?: string;
  role?: string;
}

function SpeakerRow({ speaker, i, onOpen }: { speaker: Speaker; i: number; onOpen: () => void }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [plusHovered, setPlusHovered] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      ref={rowRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
      className={`group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-16 border-b border-brand-outline px-6 -mx-6 rounded-[2rem] items-center overflow-hidden cursor-pointer ${
        speaker.name === 'Speaker TBA' ? 'opacity-75' : ''
      }`}
      whileHover={{ scale: 1.01, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(235, 0, 40, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="md:col-span-1 font-typewriter text-[11px] text-brand-primary/20 relative z-10 hidden md:block">
        0{i + 1}
      </div>
      <div className="md:col-span-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12">
          <div className="flex items-center justify-between md:block">
            <h3 className="text-3xl md:text-6xl font-title font-black tracking-tighter text-brand-primary uppercase flex flex-wrap gap-x-3 md:gap-x-4 overflow-hidden">
              {speaker.name.split(' ').map((word, wordIndex) => (
                <div key={wordIndex} className="flex">
                  {word.split('').map((char, index) => (
                    <motion.span
                      key={`${wordIndex}-${index}`}
                      className="inline-block"
                      animate={{ y: isHovered ? [0, -40, 40, 0] : 0, opacity: isHovered ? [1, 0, 0, 1] : 1 }}
                      transition={{ duration: 0.6, delay: (wordIndex * 5 + index) * 0.02, ease: "easeInOut" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              ))}
            </h3>
            <span className="md:hidden font-typewriter text-[10px] text-brand-primary/20">0{i + 1}</span>
          </div>
          <p className="font-editorial text-xl md:text-3xl text-brand-primary/40 italic leading-tight pr-4">
            "{speaker.topic}"
          </p>
        </div>
      </div>
      <div className="md:col-span-1 flex justify-start md:justify-end relative z-10 mt-4 md:mt-0">
        <Magnetic strength={0.4}>
          <motion.button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            onMouseEnter={() => setPlusHovered(true)}
            onMouseLeave={() => setPlusHovered(false)}
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
            animate={plusHovered ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 rounded-full border-2 border-brand-outline flex items-center justify-center text-brand-primary hover:bg-brand-secondary hover:border-brand-secondary hover:text-white transition-colors"
          >
            <Plus size={24} />
          </motion.button>
        </Magnetic>
      </div>
    </motion.div>
  );
}

export default function Speakers() {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isTheater = activeIndex !== null;

  const hapticTick = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

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
      window.scrollTo(0, scrollY);
    };
  }, [isTheater]);

  useEffect(() => {
    fetch('/api/speakers')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setSpeakersData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn('Error fetching speakers, using fallback data:', err);
        import('../constants').then(m => {
          setSpeakersData(m.SPEAKERS);
          setIsLoading(false);
        });
      });
  }, []);

  const filteredSpeakers = speakersData.filter(speaker => {
    const matchesSegment = selectedSegment === 'all' || speaker.segmentId === selectedSegment;
    const matchesSearch = speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         speaker.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSegment && matchesSearch;
  });

  const speaker = isTheater ? speakersData[activeIndex] : null;
  const segment = speaker ? SEGMENTS.find(s => s.id === speaker.segmentId) : null;
  const segmentLabel = segment?.title || '';
  const segmentIdx = speaker ? SEGMENTS.findIndex(s => s.id === speaker.segmentId) + 1 : 0;
  const isTBA = speaker ? (speaker.name === 'Speaker TBA' || speaker.topic === 'Topic to be announced') : false;

  function goNext() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % speakersData.length);
  }

  function goPrev() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + speakersData.length) % speakersData.length);
  }

  function goToSpeaker(idx: number) {
    setActiveIndex(idx);
    hapticTick();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative ${isTheater ? 'h-screen overflow-hidden' : 'min-h-screen pt-40 pb-32'}`}
    >
      <InteractiveBackground />
      <FloatingBackground />

      {/* ─── CONTENT AREA ─── */}
      <div className={isTheater ? 'h-full flex flex-col' : ''}>
        <div className={isTheater ? 'flex-1 flex flex-col' : ''}>
          <AnimatePresence mode="wait">
            {!isTheater ? (
              /* ═══ GRID VIEW ═══ */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="px-6 md:px-16 max-w-screen-2xl mx-auto relative z-10">
                  <header className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={transition}
                      className="max-w-4xl"
                    >
                      <div className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase mb-12">The Guest List</div>
                      <h1 className="text-8xl md:text-[12vw] font-title font-black tracking-tighter leading-[0.75] uppercase flex flex-col text-brand-primary">
                        <MaskReveal delay={0.2}>The</MaskReveal>
                        <MaskReveal delay={0.4} className="italic font-editorial lowercase -ml-6 text-brand-secondary">Assembly.</MaskReveal>
                      </h1>
                    </motion.div>
                    <div className="max-w-xs font-editorial text-2xl text-brand-primary/40 italic leading-tight">
                      Meet the people asking: What are you doing with the time you've got?
                    </div>
                  </header>

                  <div className="flex flex-col lg:flex-row gap-12 mb-20 border-y border-brand-outline py-12 px-8 -mx-8 bg-white/5 backdrop-blur-sm rounded-xl relative z-20">
                    <div className="flex flex-wrap gap-8">
                      {['all', ...SEGMENTS.map(s => s.id)].map(id => (
                        <button
                          key={id}
                          onClick={() => {
                            setSelectedSegment(id);
                            hapticTick();
                          }}
                          className={`py-3 font-typewriter text-[11px] uppercase tracking-[0.4em] transition-all relative ${
                            selectedSegment === id ? 'text-brand-secondary' : 'text-brand-primary/40 hover:text-brand-primary'
                          }`}
                        >
                          {id === 'all' ? 'Everything' : SEGMENTS.find(s => s.id === id)?.title}
                          {selectedSegment === id && (
                            <motion.div layoutId="filter-underline" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-brand-secondary" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="relative flex-grow max-w-md border-l border-brand-outline pl-12 hidden lg:block">
                      <Search className="absolute left-16 top-1/2 -translate-y-1/2 text-brand-primary/20" size={16} />
                      <input
                        type="text"
                        placeholder="Find a talk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none py-4 px-12 font-sans text-brand-primary focus:outline-none placeholder:text-brand-primary/20 placeholder:font-typewriter placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.4em]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="py-20 text-center font-typewriter text-brand-primary/20 animate-pulse tracking-[0.5em] uppercase">
                        Retrieving the Assembly...
                      </div>
                    ) : (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        <div className="space-y-4">
                          {filteredSpeakers.map((s, i) => (
                            <SpeakerRow
                              key={s.id}
                              speaker={s}
                              i={i}
                              onOpen={() => { setActiveIndex(speakersData.indexOf(s)); hapticTick(); }}
                            />
                          ))}
                        </div>
                      </motion.div>
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
                className="flex-1 flex flex-col"
              >
                {/* Split layout */}
                <div className="flex-1 flex flex-col md:flex-row items-stretch">
                  {/* Left / Top: Image */}
                  <div className="relative w-full md:w-[52%] overflow-hidden">
                    <motion.div
                      key={`img-${activeIndex}`}
                      initial={{ scale: 1.15, filter: 'blur(12px)' }}
                      animate={{ scale: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full"
                    >
                      {speaker.image && !isTBA ? (
                        <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" draggable={false} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 flex items-center justify-center">
                          <span className="font-title text-[200px] md:text-[300px] text-brand-primary/10">{speaker.name[0]}</span>
                        </div>
                      )}
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 md:bg-gradient-to-r md:from-transparent md:to-black/20 pointer-events-none" />

                    {/* Close button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ rotate: 90 }}
                      onClick={() => setActiveIndex(null)}
                      className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
                    >
                      <X size={16} />
                    </motion.button>

                    {/* Segment badge (mobile) */}
                    <div className="absolute top-5 right-5 md:hidden">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                        <span className="font-typewriter text-[7px] uppercase tracking-[0.3em] text-white/80 font-semibold">
                          0{segmentIdx} / {segmentLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right / Bottom: Content */}
                  <div className="relative w-full md:w-[48%] bg-white/90 backdrop-blur-sm flex flex-col justify-center px-8 md:px-14 py-8 md:py-0 overflow-hidden">
                    {/* Segment badge (desktop) */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                      className="hidden md:flex items-center gap-3 mb-6"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-secondary shrink-0" />
                      <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-brand-secondary/70 font-semibold">
                        0{segmentIdx} / {segmentLabel}
                      </span>
                      <div className="h-px flex-1 bg-brand-outline/30" />
                    </motion.div>

                    {/* Name */}
                    <div className="overflow-hidden mb-2">
                      <motion.h2
                        key={`name-${activeIndex}`}
                        initial={{ y: '110%' }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl lg:text-7xl font-title font-black uppercase text-brand-primary leading-[0.85] tracking-tighter"
                      >
                        {speaker.name.split(' ').map((word, i) => (
                          <span key={i} className="inline-block mr-3 md:mr-4">{word}</span>
                        ))}
                      </motion.h2>
                    </div>

                    {/* Topic */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-5"
                    >
                      <div className="relative pl-4 md:pl-6">
                        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-secondary/35 rounded-full" />
                        <p className="font-editorial text-lg md:text-2xl lg:text-3xl italic text-brand-primary/55 leading-snug">
                          "{speaker.topic}"
                        </p>
                      </div>
                    </motion.div>

                    {/* Bio — clamped */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-typewriter text-[7px] uppercase tracking-[0.35em] text-brand-primary/25">The Narrative</span>
                        <div className="h-px flex-1 bg-brand-outline/20" />
                      </div>
                      <p className="font-sans text-xs md:text-sm text-brand-primary/55 leading-[1.7] line-clamp-4 md:line-clamp-6">
                        {speaker.bio || "This speaker will be sharing transformative insights on the intersection of humanity, technology, and the ticking clock of our shared existence."}
                      </p>
                    </motion.div>

                    {/* Chevron nav (desktop) */}
                    <div className="hidden md:flex items-center gap-3 mt-6">
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        onClick={(e) => { e.stopPropagation(); goPrev(); hapticTick(); }}
                        className="w-10 h-10 rounded-full border border-brand-outline/40 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary hover:border-brand-primary/40 transition-all active:scale-90"
                      >
                        <ChevronLeft size={16} />
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={(e) => { e.stopPropagation(); goNext(); hapticTick(); }}
                        className="w-10 h-10 rounded-full border border-brand-outline/40 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary hover:border-brand-primary/40 transition-all active:scale-90"
                      >
                        <ChevronRight size={16} />
                      </motion.button>
                      <span className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/20 ml-2">
                        {activeIndex + 1} / {speakersData.length}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* ═══ BOTTOM DOCK ═══ */}
        <motion.div
          layout
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-20 border-t border-brand-outline/20 bg-white/60 backdrop-blur-md ${
            isTheater ? 'shrink-0' : 'mt-20'
          }`}
        >
          <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-4 md:py-5 flex items-center justify-between">
            <div className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-brand-primary/30 font-semibold">
              {isTheater ? (
                <motion.span
                  key={`name-${activeIndex}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {speaker?.name || 'TEDxAlMuntazirSchoolYouth'}
                </motion.span>
              ) : (
                'TEDxAlMuntazirSchoolYouth'
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {speakersData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSpeaker(idx)}
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
                    activeIndex === idx
                      ? 'w-6 md:w-8 bg-brand-secondary'
                      : 'w-1.5 md:w-2 bg-brand-outline/40 hover:bg-brand-outline/70'
                  }`}
                  aria-label={`Go to speaker ${idx + 1}`}
                />
              ))}
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

            <div className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-brand-primary/20 font-semibold">
              {isTheater
                ? `[ ${activeIndex! + 1} / ${speakersData.length} ]`
                : `[ ${filteredSpeakers.length} Speaker${filteredSpeakers.length !== 1 ? 's' : ''} ]`
              }
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
