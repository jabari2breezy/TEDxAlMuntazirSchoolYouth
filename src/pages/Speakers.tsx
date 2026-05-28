import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from 'motion/react';
import { SEGMENTS } from '../constants';
import { Search, Plus, X } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import MaskReveal from '../components/MaskReveal';
import InteractiveBackground from '../components/InteractiveBackground';
import FloatingBackground from '../components/FloatingBackground';

const transition = { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

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
      className={`group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-16 border-b border-brand-outline px-6 -mx-6 rounded-[2rem] items-center overflow-hidden ${
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
            onClick={onOpen}
            onMouseEnter={() => setPlusHovered(true)}
            onMouseLeave={() => setPlusHovered(false)}
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
            animate={plusHovered ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 rounded-full border-2 border-brand-outline flex items-center justify-center text-brand-primary hover:bg-brand-secondary hover:border-brand-secondary hover:text-white transition-colors"
          >
            <motion.div
              animate={plusHovered ? { rotate: 0 } : { rotate: 0 }}
            >
              <Plus size={24} />
            </motion.div>
          </motion.button>
        </Magnetic>
      </div>
    </motion.div>
  );
}

function SpeakerModal({ speaker, onClose, SEGMENTS }: { speaker: Speaker; onClose: () => void; SEGMENTS: any[] }) {
  const segment = SEGMENTS.find((s: any) => s.id === speaker.segmentId);
  const segmentLabel = segment?.title || '';
  const segmentIdx = SEGMENTS.findIndex((s: any) => s.id === speaker.segmentId) + 1;
  const isTBA = speaker.name === 'Speaker TBA' || speaker.topic === 'Topic to be announced';

  const nameWords = speaker.name.split(' ');

  return (
    <>
      {/* Frosted backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-40"
      />

      {/* Side drawer — dark brutalist */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        onTouchMove={(e) => e.stopPropagation()}
        className="fixed top-0 right-0 h-full w-[85vw] sm:w-[65vw] md:w-[440px] bg-neutral-950/90 backdrop-blur-3xl z-50 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header — structural CT-ID */}
        <div className="flex items-center justify-between shrink-0 px-7 pt-7 pb-4 border-b border-neutral-800">
          <span className="font-typewriter text-[9px] tracking-[0.25em] text-neutral-500 font-medium">
            [ CT-ID // {speaker.id.padStart(3, '0')} ]
          </span>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ opacity: 0.6 }}
            onClick={onClose}
            className="flex items-center gap-2 group"
          >
            <span className="font-typewriter text-[9px] tracking-[0.3em] text-neutral-500 group-hover:text-neutral-300 transition-colors">CLOSE</span>
            <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors group-hover:rotate-90 transition-transform duration-300 inline-block">
              <X size={12} />
            </span>
          </motion.button>
        </div>

        {/* Content — no scroll */}
        <div className="flex-1 flex flex-col justify-center px-7 py-8 gap-6 overflow-hidden">
          {/* Parallax image */}
          <motion.div
            initial={{ scale: 1.05, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ scale: 1, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full aspect-[4/3] max-h-[200px] overflow-hidden bg-neutral-900"
          >
            {speaker.image && !isTBA ? (
              <motion.img
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                src={speaker.image}
                alt={speaker.name}
                className="w-full h-full object-cover origin-bottom grayscale contrast-125"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-title text-7xl text-neutral-700">{speaker.name[0]}</span>
              </div>
            )}
          </motion.div>

          {/* Segment badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-brand-secondary shrink-0" />
              <span className="font-typewriter text-[7px] uppercase tracking-[0.35em] text-brand-secondary/60 font-semibold">
                0{segmentIdx} / {segmentLabel}
              </span>
            </div>
          </motion.div>

          {/* Name — staggered word reveal */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-title font-black uppercase text-white leading-[0.9] tracking-tighter flex flex-wrap gap-x-3 overflow-hidden">
              {nameWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h2>
          </motion.div>

          {/* Topic */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative pl-4">
              <div className="absolute left-0 top-1 bottom-1 w-px bg-brand-secondary/40" />
              <p className="font-editorial text-base md:text-lg italic text-neutral-400 leading-snug">
                "{speaker.topic}"
              </p>
            </div>
          </motion.div>

          {/* Bio — clamped */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-typewriter text-[6px] uppercase tracking-[0.35em] text-neutral-600">The Narrative</span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>
            <p className="font-sans text-xs md:text-sm text-neutral-400 leading-[1.7] line-clamp-5 sm:line-clamp-6">
              {speaker.bio || "This speaker will be sharing transformative insights on the intersection of humanity, technology, and the ticking clock of our shared existence."}
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="shrink-0 text-[8px] font-typewriter tracking-[0.4em] text-neutral-700 text-center border-t border-neutral-800 py-4 px-7">
          TEDxAlMuntazirSchoolYouth
        </div>
      </motion.div>
    </>
  );
}

export default function Speakers() {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const hapticTick = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  useEffect(() => {
    if (selectedSpeaker) {
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
  }, [selectedSpeaker]);

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
        // Fallback to constants if API fails
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative bg-black"
    >
      <motion.main
        animate={{
          scale: selectedSpeaker ? 0.95 : 1,
          x: selectedSpeaker ? '-4%' : '0%',
          borderRadius: selectedSpeaker ? '24px' : '0px',
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="origin-right min-h-screen overflow-hidden will-change-transform"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <InteractiveBackground />
        <FloatingBackground />
        
        <div className="pt-40 pb-32 px-6 md:px-16 max-w-screen-2xl mx-auto relative z-10">
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
          
          {/* Dynamic Filter / Search */}
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

          {/* Typographic List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-20 text-center font-typewriter text-brand-primary/20 animate-pulse tracking-[0.5em] uppercase">
                Retrieving the Assembly...
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="space-y-4">
                  {filteredSpeakers.map((speaker, i) => (
                    <SpeakerRow
                      key={speaker.id}
                      speaker={speaker}
                      i={i}
                      onOpen={() => {
                        setSelectedSpeaker(speaker);
                        hapticTick();
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.main>

      <AnimatePresence>
        {selectedSpeaker && (
          <SpeakerModal 
            speaker={selectedSpeaker} 
            onClose={() => setSelectedSpeaker(null)} 
            SEGMENTS={SEGMENTS} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
