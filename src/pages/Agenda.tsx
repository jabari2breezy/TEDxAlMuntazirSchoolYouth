import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, X } from 'lucide-react';
import { WeatherEffect } from '../components/ui/rain-and-lightning-hero-section';

type AgendaItem = {
  id: string;
  time: string;
  endTime: string;
  title: string;
  speaker: string;
  desc: string;
  duration: string;
  type: 'KEYNOTE' | 'BREAK' | 'SESSION' | 'CEREMONY' | 'GAME' | 'REGISTRATION' | 'INTRO';
  sub?: { id: string; time: string; title: string; speaker: string; desc: string; duration: string }[];
};

const AGENDA_ITEMS: AgendaItem[] = [
  {
    id: '00',
    time: '09:30',
    endTime: '10:00',
    title: 'Registration',
    speaker: 'Welcome Desk',
    desc: 'Grab your badge, find your seat, and get ready for a day of big ideas.',
    duration: '30M',
    type: 'REGISTRATION'
  },
  {
    id: '01',
    time: '10:00',
    endTime: '10:20',
    title: 'Opening Session',
    speaker: 'Your Hosts',
    desc: 'Quick welcome, what TEDx is all about, and the vibe for the day.',
    duration: '20M',
    type: 'INTRO',
    sub: [
      { id: '01a', time: '10:00', title: 'Welcome Address', speaker: 'Hosts', desc: 'Kickoff and what to expect.', duration: '10M' },
      { id: '01b', time: '10:10', title: 'Intro Video', speaker: 'Screen', desc: 'A short film to set the mood.', duration: '10M' },
    ]
  },
  {
    id: '02',
    time: '10:20',
    endTime: '11:30',
    title: 'Session 1',
    speaker: '3 Speakers + Game',
    desc: 'Three speakers, one interactive game. Ideas that hit different.',
    duration: '70M',
    type: 'SESSION',
    sub: [
      { id: '02a', time: '10:20', title: 'Ridhwan Mohammed', speaker: 'Alumni Speaker', desc: 'What school never taught you about time.', duration: '15M' },
      { id: '02b', time: '10:35', title: 'Quick Break', speaker: '', desc: 'Stretch, grab water, reset.', duration: '5M' },
      { id: '02c', time: '10:40', title: 'Anaya Rashid', speaker: 'Culture of Time', desc: 'How different cultures actually treat time — and what we can learn.', duration: '15M' },
      { id: '02d', time: '10:55', title: 'Interactive Game', speaker: 'Audience', desc: 'Get involved. No sitting this one out.', duration: '10M' },
      { id: '02e', time: '11:05', title: 'Zahra Datoo', speaker: 'Nostalgia', desc: 'Why we look back, what it costs us, and why it still matters.', duration: '15M' },
    ]
  },
  {
    id: '03',
    time: '11:30',
    endTime: '11:50',
    title: 'Tea Break',
    speaker: 'Refreshments',
    desc: 'Snacks, drinks, and a chance to chat with people.',
    duration: '20M',
    type: 'BREAK'
  },
  {
    id: '04',
    time: '11:50',
    endTime: '13:00',
    title: 'Session 2',
    speaker: '3 Speakers + Games',
    desc: 'More talks, more games, more reasons to pay attention.',
    duration: '70M',
    type: 'SESSION',
    sub: [
      { id: '04a', time: '11:50', title: 'Zahra Moledina', speaker: 'The Best Thing Since Sliced Bread', desc: 'Why the next big thing is already here — and why you might be missing it.', duration: '15M' },
      { id: '04b', time: '12:05', title: 'Kahoot / Blooket', speaker: 'Audience', desc: 'Quiz time. Compete, laugh, win.', duration: '10M' },
      { id: '04c', time: '12:15', title: 'TBA Speaker', speaker: 'Surprise Guest', desc: 'Someone unexpected. Stay tuned.', duration: '15M' },
      { id: '04d', time: '12:30', title: 'Mini Game', speaker: 'Audience', desc: 'Quick energy boost before the last speaker.', duration: '5M' },
      { id: '04e', time: '12:35', title: 'Hassan Abbas Muhammad', speaker: 'Procrastination', desc: 'Why we put things off — and how to actually stop.', duration: '15M' },
    ]
  },
  {
    id: '05',
    time: '13:00',
    endTime: '14:00',
    title: 'Salah & Lunch',
    speaker: 'Prayer + Food',
    desc: 'Prayer break, then food. Come back recharged.',
    duration: '60M',
    type: 'BREAK'
  },
  {
    id: '06',
    time: '14:00',
    endTime: '15:15',
    title: 'Session 3',
    speaker: '3 Speakers + 2 Games',
    desc: 'The final stretch. Three speakers, two games, one unforgettable close.',
    duration: '75M',
    type: 'SESSION',
    sub: [
      { id: '06a', time: '14:00', title: 'Yunus Osman', speaker: 'The Art of Scheduling (Alumni)', desc: 'How to actually manage your time without burning out.', duration: '15M' },
      { id: '06b', time: '14:15', title: 'Interactive Game', speaker: 'Audience', desc: 'Reset the room before the next talk.', duration: '10M' },
      { id: '06c', time: '14:25', title: 'Sada Mbaruk', speaker: 'End of the World', desc: 'What happens when we run out of time — and why it matters now.', duration: '15M' },
      { id: '06d', time: '14:40', title: 'Imposter Game', speaker: 'Audience', desc: 'Social deduction. Who can you trust with your time?', duration: '10M' },
      { id: '06e', time: '14:50', title: 'Liyaan Karbelkar', speaker: 'How to Take Your Wealth With You', desc: 'Building something that lasts longer than you.', duration: '15M' },
    ]
  },
  {
    id: '07',
    time: '15:15',
    endTime: '16:00',
    title: 'Closing Ceremony',
    speaker: 'Everyone',
    desc: 'Awards, shoutouts, and the final word. Make the most of what you have.',
    duration: '45M',
    type: 'CEREMONY'
  },
];

const TYPE_COLORS: Record<string, string> = {
  KEYNOTE: '#006d38',
  SESSION: '#000839',
  BREAK: '#767681',
  REGISTRATION: '#4e5a98',
  INTRO: '#4e5a98',
  CEREMONY: '#000839',
  GAME: '#006d38',
};

export default function Agenda() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Horizontal scroll transform for desktop
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(AGENDA_ITEMS.length - 1) * 100}%`]);

  return (
    <div ref={containerRef} className="relative bg-white text-gray-900 overflow-hidden">
      {/* Rain and Lightning background */}
      <div className="fixed inset-0 z-0">
        <WeatherEffect
          rainIntensity={40}
          rainSpeed={0.15}
          rainAngle={12}
          rainColor="rgba(100, 120, 150, 0.4)"
          lightningEnabled={true}
          lightningFrequency={5}
          lightningHue={140}
          lightningSpeed={0.5}
          lightningIntensity={1.2}
          lightningSize={1.5}
          thunderEnabled={false}
        />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-8">
          <span className="font-typewriter text-[10px] text-brand-secondary tracking-[0.5em] uppercase block mb-2">The Timeline</span>
          <h1 className="text-5xl md:text-7xl font-title font-black uppercase tracking-tighter text-gray-900 leading-none">
            Full Agenda
          </h1>
          <p className="font-editorial text-lg italic text-gray-500 mt-4">June 14, 2026 — Al Muntazir Nursery Campus</p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-gray-400">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} className="text-brand-secondary" />
        </motion.div>
      </motion.div>

      {/* Desktop: Horizontal Scroll */}
      <div className="hidden md:block">
        <div className="h-[400vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
            <motion.div 
              className="flex h-full"
              style={{ x }}
            >
              {AGENDA_ITEMS.map((item, index) => (
                <div
                  key={item.id}
                  className="w-screen h-full flex-shrink-0 flex items-center justify-center p-8 md:p-16"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 60, rotateX: 10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-4xl"
                  >
                    <div 
                      className="relative rounded-3xl p-8 md:p-12 cursor-pointer group"
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                      }}
                      onClick={() => setExpandedPanel(expandedPanel === item.id ? null : item.id)}
                    >
                      {/* Time badge */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="font-typewriter text-sm font-bold tracking-wider text-brand-secondary bg-brand-secondary/10 px-4 py-2 rounded-full">
                          {item.time} — {item.endTime}
                        </span>
                        <span className="font-typewriter text-[10px] uppercase tracking-widest text-gray-400">
                          {item.duration}
                        </span>
                      </div>

                      {/* Type badge */}
                      <div className="inline-block mb-4">
                        <span 
                          className="font-typewriter text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full"
                          style={{ 
                            color: TYPE_COLORS[item.type],
                            backgroundColor: `${TYPE_COLORS[item.type]}12`,
                            border: `1px solid ${TYPE_COLORS[item.type]}25`
                          }}
                        >
                          {item.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-title font-black text-4xl md:text-5xl uppercase tracking-tight text-gray-900 leading-tight mb-4">
                        {item.title}
                      </h3>

                      {/* Speaker */}
                      {item.speaker && (
                        <p className="font-editorial text-xl italic text-gray-500 mb-4">
                          {item.speaker}
                        </p>
                      )}

                      {/* Description */}
                      <p className="font-sans text-base text-gray-500 leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>

                      {/* Expand indicator */}
                      {item.sub && item.sub.length > 0 && (
                        <div className="mt-6 flex items-center gap-2 text-brand-secondary">
                          <span className="font-typewriter text-[10px] uppercase tracking-widest">
                            {expandedPanel === item.id ? 'Click to collapse' : 'Click for details'}
                          </span>
                          <motion.div
                            animate={{ rotate: expandedPanel === item.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                        </div>
                      )}

                      {/* Expanded sub-items */}
                      {expandedPanel === item.id && item.sub && item.sub.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-8 pt-8 border-t border-gray-200"
                        >
                          <div className="grid gap-4">
                            {item.sub.map((sub) => (
                              <div key={sub.id} className="flex items-start gap-6 p-4 rounded-xl bg-gray-50/50">
                                <span className="font-typewriter text-sm font-bold text-brand-secondary shrink-0">
                                  {sub.time}
                                </span>
                                <div className="flex-1">
                                  <p className="font-sans text-base text-gray-800 font-semibold">{sub.title}</p>
                                  {sub.speaker && (
                                    <p className="font-editorial text-sm italic text-gray-500 mt-1">{sub.speaker}</p>
                                  )}
                                  <p className="font-sans text-sm text-gray-400 mt-2">{sub.desc}</p>
                                </div>
                                <span className="font-typewriter text-[10px] text-gray-400 shrink-0">
                                  {sub.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile: Sticky Stack */}
      <div className="md:hidden">
        <div className="relative">
          {AGENDA_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="sticky top-16 z-10 mb-4"
              style={{ 
                top: index === 0 ? 80 : 80 + (index * 20),
                zIndex: AGENDA_ITEMS.length - index 
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="mx-4 rounded-2xl p-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-typewriter text-xs font-bold tracking-wider text-brand-secondary bg-brand-secondary/10 px-3 py-1 rounded-full">
                    {item.time} — {item.endTime}
                  </span>
                  <span className="font-typewriter text-[9px] uppercase tracking-widest text-gray-400">
                    {item.duration}
                  </span>
                </div>

                <div className="inline-block mb-2">
                  <span 
                    className="font-typewriter text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-full"
                    style={{ 
                      color: TYPE_COLORS[item.type],
                      backgroundColor: `${TYPE_COLORS[item.type]}12`,
                      border: `1px solid ${TYPE_COLORS[item.type]}25`
                    }}
                  >
                    {item.type}
                  </span>
                </div>

                <h3 className="font-title font-black text-2xl uppercase tracking-tight text-gray-900 leading-tight mb-2">
                  {item.title}
                </h3>

                {item.speaker && (
                  <p className="font-editorial text-base italic text-gray-500 mb-2">
                    {item.speaker}
                  </p>
                )}

                <p className="font-sans text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>

                {item.sub && item.sub.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {item.sub.map((sub) => (
                      <div key={sub.id} className="flex items-start gap-3 py-2">
                        <span className="font-typewriter text-[10px] font-bold text-brand-secondary shrink-0 mt-0.5">
                          {sub.time}
                        </span>
                        <div className="flex-1">
                          <p className="font-sans text-sm text-gray-800 font-medium">{sub.title}</p>
                          {sub.speaker && (
                            <p className="font-editorial text-xs italic text-gray-400 mt-0.5">{sub.speaker}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20 max-w-screen-2xl mx-auto px-6 md:px-16 pb-20 pt-16">
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-typewriter text-[10px] text-gray-400 uppercase tracking-widest">
            June 14, 2026 — Al Muntazir Nursery Campus
          </span>
          <span className="font-typewriter text-[10px] text-gray-400 uppercase tracking-widest">
            Doors Open 9:30 AM
          </span>
        </div>
      </div>
    </div>
  );
}
