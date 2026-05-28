import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS, SPEAKERS as FALLBACK_SPEAKERS } from '../constants';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import InteractiveBackground from '../components/InteractiveBackground';
import FloatingBackground from '../components/FloatingBackground';
import MaskReveal from '../components/MaskReveal';

// A calm cinematic easing used across reveals
const CINEMA_EASE = [0.16, 1, 0.3, 1] as const;

interface Speaker {
  id: string;
  name: string;
  title?: string;
  topic: string;
  segmentId: string;
  bio?: string;
  image?: string;
}

export default function Speakers(): JSX.Element {
  const [speakers, setSpeakers] = useState<Speaker[]>(FALLBACK_SPEAKERS || []);
  const [isLoading, setIsLoading] = useState<boolean>(!FALLBACK_SPEAKERS?.length);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<string>('all');

  const containerRef = useRef<HTMLDivElement | null>(null);

  const isTheater = activeIndex !== null;

  useEffect(() => {
    // Fetch speakers in background; fall back to constants already imported
    if (FALLBACK_SPEAKERS?.length) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    fetch('/api/speakers')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error('Fetch failure')))
      .then((data) => mounted && setSpeakers(data))
      .catch(() => {
        // fallback already wired
      })
      .finally(() => mounted && setIsLoading(false));
    return () => { mounted = false; };
  }, []);

  // Body / global viewport locking when theater is active
  useEffect(() => {
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      touchAction: document.body.style.touchAction,
    };
    if (isTheater) {
      const scrollY = window.scrollY || 0;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const prevY = Number(document.body.dataset.scrollY || 0);
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      document.body.style.touchAction = prev.touchAction;
      window.scrollTo(0, prevY);
    }
    return () => {
      const prevY = Number(document.body.dataset.scrollY || 0);
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      document.body.style.touchAction = prev.touchAction;
      window.scrollTo(0, prevY);
    };
  }, [isTheater]);

  // Prevent touchmove/pass-through on the container when theater active
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onTouchMove(e: TouchEvent) {
      // block to avoid rubber-banding and scroll chaining
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    }

    if (isTheater) {
      el.addEventListener('touchmove', onTouchMove, { passive: false });
    }
    return () => {
      el.removeEventListener('touchmove', onTouchMove as EventListener, { passive: false } as any);
    };
  }, [isTheater]);

  // Keyboard navigation inside theater
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isTheater) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i === null ? 0 : (i + 1) % speakers.length));
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i === null ? speakers.length - 1 : (i - 1 + speakers.length) % speakers.length));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isTheater, speakers.length]);

  const filtered = speakers.filter((s) => {
    const matchesSegment = segment === 'all' || s.segmentId === segment;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q);
    return matchesSegment && matchesSearch;
  });

  const openSpeaker = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? 0 : (i + 1) % speakers.length));
  }, [speakers.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? Math.max(0, speakers.length - 1) : (i - 1 + speakers.length) % speakers.length));
  }, [speakers.length]);

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <InteractiveBackground />
      <FloatingBackground />

      <div className="absolute inset-0 max-w-7xl mx-auto px-4 md:px-8 lg:px-0 h-full">
        <AnimatePresence mode="wait">
          {activeIndex === null ? (
            // GRID VIEW (State A)
            <motion.section
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              <header className="pt-6 pb-4 flex items-end justify-between">
                <div>
                  <div className="font-typewriter text-[10px] text-brand-secondary tracking-[0.8em] uppercase">The Guest List</div>
                  <h1 className="mt-2 text-4xl md:text-6xl font-title font-black tracking-tight leading-[0.9] uppercase">
                    <MaskReveal delay={0.05}>The</MaskReveal>
                    <MaskReveal delay={0.18} className="italic font-editorial lowercase -ml-3 text-brand-secondary">Assembly.</MaskReveal>
                  </h1>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <input
                    aria-label="Search speakers"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Find a talk..."
                    className="bg-transparent border border-neutral-800 px-3 py-2 rounded text-sm text-white/80 placeholder:text-white/30"
                  />
                </div>
              </header>

              <main className="flex-1 overflow-auto pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  {isLoading ? (
                    <div className="col-span-1 md:col-span-3 text-center py-20">Loading…</div>
                  ) : (
                    filtered.map((s, i) => (
                      <article
                        key={s.id}
                        className="relative group bg-white/3 rounded-lg p-4 md:p-6 flex flex-col gap-3 overflow-hidden"
                      >
                        <button
                          onClick={() => openSpeaker(speakers.indexOf(s))}
                          className="absolute inset-0 z-10 aria-hidden"
                          aria-hidden
                        />
                        <div className="relative h-44 md:h-56 w-full overflow-hidden rounded-md grayscale hover:grayscale-0 transition-all duration-700 ease-out">
                          {s.image ? (
                            // Keep plain img for predictable behavior across browsers
                            <img src={s.image} alt={s.name} className="w-full h-full object-cover" draggable={false} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                              <span className="text-6xl font-title text-white/10">{s.name[0]}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold leading-snug tracking-tight">{s.name}</h3>
                            <p className="text-sm text-white/60 mt-1">{s.topic}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); openSpeaker(speakers.indexOf(s)); }}
                            className="ml-4 w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-white/90 hover:bg-white/6 transition"
                            aria-label={`Open ${s.name}`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </main>
            </motion.section>
          ) : (
            // THEATER VIEW (State B)
            <motion.section
              key={`theater-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: CINEMA_EASE }}
              className="h-full flex flex-col md:flex-row"
            >
              {/** Left / Top media area */}
              <div className="w-full md:w-1/2 h-[45vh] md:h-full relative overflow-hidden bg-neutral-900">
                <motion.div
                  key={`media-${activeIndex}`}
                  initial={{ scale: 1.15, filter: 'blur(12px)' }}
                  animate={{ scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: CINEMA_EASE }}
                  className="w-full h-full"
                >
                  {speakers[activeIndex!].image ? (
                    <img src={speakers[activeIndex!].image} alt={speakers[activeIndex!].name} className="w-full h-full object-cover" draggable={false} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                      <span className="text-9xl font-title text-white/8">{speakers[activeIndex!].name[0]}</span>
                    </div>
                  )}
                </motion.div>

                <button
                  onClick={() => setActiveIndex(null)}
                  className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/** Right / Bottom editorial area */}
              <div className="w-full md:w-1/2 h-[45vh] md:h-full bg-white text-black flex items-center px-6 md:px-12 overflow-hidden">
                <div className="w-full">
                  <div className="overflow-hidden">
                    <motion.h2
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.6, ease: CINEMA_EASE }}
                      className="text-3xl md:text-5xl lg:text-6xl font-title font-black uppercase tracking-tight leading-[0.9]"
                    >
                      {speakers[activeIndex!].name}
                    </motion.h2>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.5, ease: CINEMA_EASE }}
                    className="mt-4 italic text-lg text-black/70"
                  >
                    "{speakers[activeIndex!].topic}"
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: CINEMA_EASE }}
                    className="mt-6 text-sm text-black/80 leading-relaxed line-clamp-4 md:line-clamp-6"
                  >
                    {speakers[activeIndex!].bio || 'No description available.'}
                  </motion.div>

                  <div className="hidden md:flex items-center gap-3 mt-6">
                    <button onClick={goPrev} className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center">
                      <ChevronLeft />
                    </button>
                    <button onClick={goNext} className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center">
                      <ChevronRight />
                    </button>
                    <div className="ml-3 font-typewriter text-xs text-neutral-600">{activeIndex! + 1} / {speakers.length}</div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/** Bottom Dock — persistent */}
      <div className="fixed left-0 right-0 bottom-6 z-40 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-3xl mx-auto px-4 pointer-events-auto bg-black/60 backdrop-blur-md border border-white/6 rounded-full py-3 flex items-center justify-between gap-4">
          <div className="text-xs font-typewriter text-white/60 pl-3">TEDx</div>

          <div className="flex items-center gap-2">
            {speakers.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Select ${s.name}`}
                className={`rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>

          <div className="text-xs font-typewriter text-white/60 pr-3">[ 2026 INDEX ]</div>
        </div>
      </div>
    </div>
  );
}
