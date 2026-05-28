import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS } from '../constants';
import { X } from 'lucide-react';
import MaskReveal from '../components/MaskReveal';

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
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setSpeakersData(SPEAKERS);
    setIsLoading(false);
  }, []);

  const filteredSpeakers = speakersData.filter(speaker =>
    (selectedSegment === 'all' || speaker.segmentId === selectedSegment)
  );

  const openBio = (speaker: Speaker) => setActiveSpeaker(speaker);
  const closeBio = () => setActiveSpeaker(null);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <div className="px-5 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto pt-16 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="font-typewriter text-[9px] sm:text-[10px] text-brand-secondary tracking-[0.8em] uppercase mb-5 sm:mb-8">
            The Guest List
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-[10vw] font-title font-black tracking-tighter leading-[0.75] uppercase flex flex-col text-brand-primary">
            <MaskReveal delay={0.2}>The</MaskReveal>
            <MaskReveal delay={0.4} className="italic font-editorial lowercase -ml-2 sm:-ml-4 text-brand-secondary">
              Assembly.
            </MaskReveal>
          </h1>
          <div className="max-w-md font-editorial text-base sm:text-xl text-brand-primary/40 italic leading-snug mt-6 sm:mt-8">
            Meet the people asking: What are you doing with the time you've got?
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap gap-4 sm:gap-6 mt-10 sm:mt-16 pb-6 sm:pb-8 border-b border-brand-outline/20">
          {['all', ...SEGMENTS.map(s => s.id)].map(id => (
            <button
              key={id}
              onClick={() => setSelectedSegment(id)}
              className={`py-2 font-typewriter text-[8px] sm:text-[10px] uppercase tracking-[0.3em] transition-all relative ${
                selectedSegment === id ? 'text-brand-secondary' : 'text-brand-primary/40 hover:text-brand-primary'
              }`}
            >
              {id === 'all' ? 'Everything' : SEGMENTS.find(s => s.id === id)?.title}
              {selectedSegment === id && (
                <motion.div layoutId="filter-line" className="absolute -bottom-[1.5px] left-0 right-0 h-[1px] bg-brand-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Speaker Grid - Editorial Compact Cards */}
      <div className="px-5 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto pb-32">
        {isLoading ? (
          <div className="py-20 text-center font-typewriter text-brand-primary/20 animate-pulse tracking-[0.5em] uppercase text-sm">
            Retrieving the Assembly...
          </div>
        ) : filteredSpeakers.length === 0 ? (
          <div className="py-20 text-center font-typewriter text-brand-primary/30 tracking-[0.3em] uppercase text-xs">
            No speakers found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredSpeakers.map((s, i) => {
              const segIdx = SEGMENTS.findIndex(seg => seg.id === s.segmentId) + 1;
              const isHovered = hoveredId === s.id;

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative aspect-[3/4] sm:aspect-[3/4.5] bg-gradient-to-b from-brand-primary/5 to-brand-primary/10 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border border-brand-outline/15"
                >
                  {/* Background treatment */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-brand-secondary/0 to-brand-secondary/5 pointer-events-none"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(0,8,57,.1) 1px, transparent 1px), linear-gradient(rgba(0,8,57,.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }} />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 lg:p-6">
                    {/* Top: Title info */}
                    <div className="space-y-2 sm:space-y-3">
                      {/* Segment tag */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-brand-secondary shrink-0" />
                        <span className="font-typewriter text-[6px] sm:text-[7px] uppercase tracking-[0.35em] text-brand-secondary/60 font-semibold">
                          0{segIdx}
                        </span>
                      </motion.div>

                      {/* Speaker Name - main focus */}
                      <div>
                        <h3 className="text-sm sm:text-base lg:text-lg font-title font-black uppercase leading-[1.1] tracking-tighter text-brand-primary">
                          {s.name}
                        </h3>
                      </div>

                      {/* Topic - subtle editorial */}
                      <p className="font-editorial text-[10px] sm:text-xs italic text-brand-primary/40 leading-snug line-clamp-2">
                        "{s.topic}"
                      </p>
                    </div>

                    {/* Bottom: Plus trigger */}
                    <div className="flex items-center justify-between">
                      <span className="font-typewriter text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-brand-primary/25">
                        0{segIdx}/{SEGMENTS.find(seg => seg.id === s.segmentId)?.title?.toUpperCase() || ''}
                      </span>

                      <motion.button
                        onClick={(e) => { e.stopPropagation(); openBio(s); }}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full bg-brand-secondary flex items-center justify-center text-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Border hover effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
                    animate={{
                      borderColor: isHovered ? 'rgba(0, 109, 56, 0.4)' : 'rgba(0, 8, 57, 0.08)',
                      boxShadow: isHovered ? 'inset 0 0 30px rgba(0, 109, 56, 0.08)' : 'none',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ border: '1px solid' }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ BIO OVERLAY ═══ */}
      <AnimatePresence>
        {activeSpeaker && (
          <motion.div
            key="bio-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md"
              onClick={closeBio}
            />

            {/* Bio Card */}
            <motion.div
              key={activeSpeaker.id}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '20%', opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full sm:max-w-lg sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Top accent line */}
              <div className="h-px bg-gradient-to-r from-brand-secondary via-brand-secondary/50 to-transparent" />

              {/* Close button */}
              <button
                onClick={closeBio}
                className="absolute top-4 right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
              >
                <X size={14} />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-10 pt-8 sm:pt-10">
                {/* Segment badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0" />
                  <span className="font-typewriter text-[8px] uppercase tracking-[0.35em] text-brand-secondary font-semibold">
                    0{SEGMENTS.findIndex(seg => seg.id === activeSpeaker.segmentId) + 1} / {SEGMENTS.find(seg => seg.id === activeSpeaker.segmentId)?.title || ''}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-black uppercase leading-[0.9] tracking-tighter text-brand-primary mb-3">
                  {activeSpeaker.name}
                </h2>

                {/* Topic */}
                <div className="relative pl-3 sm:pl-4 border-l-2 border-brand-secondary/40 mb-5">
                  <p className="font-editorial text-sm sm:text-base italic text-brand-primary/60 leading-snug">
                    "{activeSpeaker.topic}"
                  </p>
                </div>

                {/* Bio */}
                <p className="font-sans text-xs sm:text-sm text-brand-primary/70 leading-[1.8]">
                  {activeSpeaker.bio || "This speaker will be sharing transformative insights on the intersection of humanity and time."}
                </p>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-brand-outline/20 flex items-center justify-between">
                  <span className="font-typewriter text-[7px] uppercase tracking-[0.25em] text-brand-primary/20">
                    TEDxAlMuntazirSchoolYouth 2026
                  </span>
                  <span className="font-typewriter text-[7px] uppercase tracking-[0.25em] text-brand-primary/20">
                    The Assembly.
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
