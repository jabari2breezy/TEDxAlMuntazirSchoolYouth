import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate, useScroll } from 'motion/react';
import { SEGMENTS } from '../constants';
import { Search, Plus, X } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import MaskReveal from '../components/MaskReveal';
import InteractiveBackground from '../components/InteractiveBackground';
import FloatingBackground from '../components/FloatingBackground';
import SpeakerTopicVisual from '../components/SpeakerTopicVisual';

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

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      ref={rowRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-16 border-b border-brand-outline px-6 -mx-6 rounded-[2rem] items-center overflow-hidden transition-colors duration-500 ${
        speaker.name === 'Speaker TBA' ? 'opacity-75' : ''
      }`}
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
          <button 
            onClick={onOpen}
            className="w-16 h-16 rounded-full border-2 border-brand-outline flex items-center justify-center text-brand-primary hover:bg-brand-secondary hover:border-brand-secondary hover:text-white transition-colors"
          >
            <Plus size={24} />
          </button>
        </Magnetic>
      </div>
    </div>
  );
}

function SpeakerModal({ speaker, onClose, SEGMENTS }: { speaker: Speaker; onClose: () => void; SEGMENTS: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  const segment = SEGMENTS.find((s: any) => s.id === speaker.segmentId);
  const segmentLabel = segment?.title || '';
  const segmentNum = segment?.number || '';
  const segmentIdx = SEGMENTS.findIndex((s: any) => s.id === speaker.segmentId) + 1;
  const isTBA = speaker.name === 'Speaker TBA' || speaker.topic === 'Topic to be announced';

  const imgScale = useTransform(scrollYProgress, [0, 0.3], [1.15, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-[#050507] overflow-hidden"
    >
      {/* Close button — always visible, fixed */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.4 }}
        onClick={onClose}
        className="fixed top-4 right-4 md:top-8 md:right-8 z-[60] w-11 h-11 md:w-13 md:h-13 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90 group"
      >
        <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
      </motion.button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain"
        data-lenis-prevent
      >
        {/* Hero Image Section */}
        <div className="relative h-[55vh] md:h-[70vh] lg:h-[80vh] min-h-[320px] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            {speaker.image && !isTBA && (
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            )}
          </motion.div>
          <motion.div className="absolute inset-0" style={{ opacity: overlayOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/50 via-[#050507]/20 to-[#050507]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/40 to-transparent" />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* Segment badge on image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-6 left-6 md:top-10 md:left-10 z-20"
          >
            <span className="font-typewriter text-[8px] md:text-[10px] uppercase tracking-[0.8em] text-white/40 block mb-2">
              {segmentLabel}
            </span>
            <span className="font-title text-6xl md:text-9xl lg:text-[10vw] font-black text-white/10 leading-none tracking-tighter">
              {segmentNum}
            </span>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 md:hidden"
          >
            <span className="font-typewriter text-[7px] uppercase tracking-[0.3em] text-white/20">Scroll</span>
            <div className="w-px h-8 bg-white/10" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-2">
          <div className="px-6 md:px-16 lg:px-24 py-10 md:py-16 lg:py-24 max-w-4xl mx-auto">
            <div className="space-y-12 md:space-y-16">
              {/* Name + Segment */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-white/15 block mb-5">
                  0{segmentIdx} / {segmentLabel?.toUpperCase()}
                </span>
                <h2 className="text-[11vw] md:text-7xl lg:text-8xl font-title font-black uppercase text-white leading-[0.85] tracking-tighter">
                  {speaker.name.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h2>
              </motion.div>

              {/* Topic */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-6 md:pl-10 border-l-2 border-brand-secondary/60"
              >
                <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-white/15 block mb-3">Topic</span>
                <p className="font-editorial text-xl md:text-3xl lg:text-4xl italic text-white/80 leading-tight">
                  "{speaker.topic}"
                </p>
              </motion.div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-typewriter text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-white/15 block mb-5">The Narrative</span>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl md:rounded-3xl p-6 md:p-10 backdrop-blur-sm">
                  <p className="font-sans text-sm md:text-base lg:text-lg text-white/65 leading-[1.8] md:leading-[1.9] first-letter:text-4xl md:first-letter:text-5xl first-letter:font-editorial first-letter:float-left first-letter:mr-3 md:first-letter:mr-4 first-letter:leading-none first-letter:text-brand-secondary">
                    {speaker.bio || "This speaker will be sharing transformative insights on the intersection of humanity, technology, and the ticking clock of our shared existence, challenging us to rethink how we choose to spend the time we possess."}
                  </p>
                </div>
              </motion.div>

              {/* Topic Visual Art */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <SpeakerTopicVisual
                  name={speaker.name}
                  topic={speaker.topic}
                  image={speaker.image}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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
      className="pt-40 pb-32 min-h-screen relative overflow-hidden"
    >
      <InteractiveBackground />
      <FloatingBackground />
      
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
            Meet the people asking: What are you doing with the time you’ve got?
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
