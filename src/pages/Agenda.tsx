import React, { useRef } from 'react';
import { motion } from 'motion/react';

type AgendaItem = {
  id: string;
  time: string;
  title: string;
  speaker: string;
  desc: string;
  duration: string;
  type: 'KEYNOTE' | 'BREAK' | 'EXPERIENCE' | 'LUNCH' | 'GAME' | 'SESSION' | 'CEREMONY' | 'VIDEO';
  sub?: AgendaItem[];
};

const AGENDA_ITEMS: AgendaItem[] = [
  {
    id: '00',
    time: '09:30 AM',
    title: 'REGISTRATION',
    speaker: 'Welcome Desk',
    desc: 'Enter the monolithic space and receive your credentials. Access the primary viewing arrays and prepare for the temporal shift.',
    duration: '30M',
    type: 'EXPERIENCE'
  },
  {
    id: '01',
    time: '10:00 AM',
    title: 'INTRO SESSION',
    speaker: 'Opening',
    desc: 'The beginning of the end. An orientation to the systems and structures of Borrowed Time.',
    duration: '20M',
    type: 'SESSION',
    sub: [
      { id: '01a', time: '10:00', title: 'Welcome Address', speaker: 'Hosts', desc: 'Opening welcome to all attendees and a framing of the day ahead.', duration: '10M', type: 'EXPERIENCE' },
      { id: '01b', time: '10:10', title: 'Intro Video', speaker: 'Screen', desc: 'A cinematic video setting the tone for the Borrowed Time theme.', duration: '10M', type: 'VIDEO' },
    ]
  },
  {
    id: '02',
    time: '10:20 AM',
    title: 'SESSION 1',
    speaker: '3 Speakers + Game',
    desc: 'The first block of ideas worth spreading, featuring three transformative speakers and an interactive game.',
    duration: '70M',
    type: 'SESSION',
    sub: [
      { id: '02a', time: '10:20', title: 'Speaker 1: Ridhwan Mohammed', speaker: 'Alumni Speaker', desc: 'An alumni perspective on borrowed time and life beyond school walls.', duration: '15M', type: 'KEYNOTE' },
      { id: '02b', time: '10:35', title: 'Short Break', speaker: '', desc: 'A brief reset between speakers.', duration: '5M', type: 'BREAK' },
      { id: '02c', time: '10:40', title: 'Speaker 2: Anaya Rashid', speaker: 'Culture of Time', desc: 'Exploring how different cultures perceive, value, and manage their time differently across the globe.', duration: '15M', type: 'KEYNOTE' },
      { id: '02d', time: '10:55', title: 'Interactive Game', speaker: 'Audience', desc: 'A fast-paced interactive game connecting the audience to the theme.', duration: '10M', type: 'GAME' },
      { id: '02e', time: '11:05', title: 'Speaker 3: Zahra Datoo', speaker: 'Nostalgia', desc: 'A deep exploration of nostalgia — why we look back, what it costs us, and what it can teach us.', duration: '15M', type: 'KEYNOTE' },
    ]
  },
  {
    id: '03',
    time: '11:30 AM',
    title: 'TEA BREAK',
    speaker: 'Refreshments',
    desc: 'Curated refreshments and ambient networking. Recharge, connect, and exchange ideas.',
    duration: '20M',
    type: 'BREAK'
  },
  {
    id: '04',
    time: '11:50 AM',
    title: 'SESSION 2',
    speaker: '3 Speakers + Game',
    desc: 'The second block of ideas — exploring innovation, urgency, and the cost of procrastination.',
    duration: '70M',
    type: 'SESSION',
    sub: [
      { id: '04a', time: '11:50', title: 'Speaker 4: Zahra Moledina', speaker: 'The Best Thing Since Sliced Bread', desc: 'How breakthroughs happen, why we miss them, and why the next big thing is already here.', duration: '15M', type: 'KEYNOTE' },
      { id: '04b', time: '12:05', title: 'Kahoot / Blooket', speaker: 'Audience', desc: 'An energizing quiz game to test and celebrate knowledge from the sessions so far.', duration: '10M', type: 'GAME' },
      { id: '04c', time: '12:15', title: 'Speaker 5: TBD', speaker: 'Speaker', desc: 'A surprise talk from a yet-to-be-announced speaker — the unknown is part of the borrowed time experience.', duration: '18M', type: 'KEYNOTE' },
      { id: '04d', time: '12:33', title: 'Mini Game', speaker: 'Audience', desc: 'A short interactive game before the final speaker of the session.', duration: '5M', type: 'GAME' },
      { id: '04e', time: '12:38', title: 'Speaker 6: Hassan Abbas Muhammad', speaker: 'Procrastination', desc: 'Dissecting the procrastination paradox — why we borrow against our own future and how to finally stop.', duration: '15M', type: 'KEYNOTE' },
      { id: '04f', time: '12:53', title: '[ Buffer ]', speaker: '', desc: 'Schedule buffer to ensure the session finishes on time.', duration: '7M', type: 'BREAK' },
    ]
  },
  {
    id: '05',
    time: '01:00 PM',
    title: 'SALAH & LUNCH',
    speaker: 'Prayer + Food',
    desc: 'Salah break followed by a curated lunch experience and partner activations. Refuel for the final session.',
    duration: '60M',
    type: 'LUNCH'
  },
  {
    id: '06',
    time: '02:00 PM',
    title: 'SESSION 3',
    speaker: '3 Speakers + 2 Games',
    desc: 'The grand finale — three visionary speakers and two games bring the Borrowed Time theme to its crescendo.',
    duration: '75M',
    type: 'SESSION',
    sub: [
      { id: '06a', time: '02:00', title: 'Speaker 7: Yunus Osman', speaker: 'The Art of Scheduling (Alumni)', desc: 'An alumni master-class on how to design your time intentionally and build systems that work.', duration: '15M', type: 'KEYNOTE' },
      { id: '06b', time: '02:15', title: 'Interactive Game', speaker: 'Audience', desc: 'An audience game to reset energy before the next speaker.', duration: '10M', type: 'GAME' },
      { id: '06c', time: '02:25', title: 'Speaker 8: Sada Mbaruk', speaker: 'End of the World', desc: 'A provocative exploration of what happens when we run out of borrowed time — individually and globally.', duration: '15M', type: 'KEYNOTE' },
      { id: '06d', time: '02:40', title: 'Imposter Game', speaker: 'Audience', desc: 'The iconic imposter social deduction game — who can you trust with your time?', duration: '10M', type: 'GAME' },
      { id: '06e', time: '02:50', title: 'Speaker 9: Liyaan Karbelkar', speaker: 'How to Take Your Wealth With You', desc: 'How to build legacy, purpose, and impact that outlasts the finite window of your borrowed time.', duration: '15M', type: 'KEYNOTE' },
      { id: '06f', time: '03:05', title: '[ Buffer ]', speaker: '', desc: 'Schedule buffer to ensure clean handoff to closing.', duration: '10M', type: 'BREAK' },
    ]
  },
  {
    id: '07',
    time: '03:15 PM',
    title: 'CLOSING CEREMONY',
    speaker: 'All',
    desc: 'The temporal window closes. Awards, acknowledgements, and the final message — make the most of your borrowed time.',
    duration: '45M',
    type: 'CEREMONY'
  },
];

const TYPE_COLORS: Record<string, string> = {
  KEYNOTE: '#006d38',
  SESSION: '#000839',
  BREAK: '#767681',
  EXPERIENCE: '#4e5a98',
  LUNCH: '#767681',
  GAME: '#006d38',
  CEREMONY: '#000839',
  VIDEO: '#4e5a98',
};

export default function Agenda() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative bg-brand-primary min-h-screen text-white overflow-hidden">
      {/* Simple gradient background - no heavy shader */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg, #000839 0%, #001a0d 50%, #050507 100%)'
      }} />

      {/* Subtle radial accents */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30" style={{
        background: 'radial-gradient(circle at 20% 30%, rgba(0,109,56,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,8,57,0.5) 0%, transparent 50%)'
      }} />

      <div ref={containerRef} className="relative z-10">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-brand-primary/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-8">
            <span className="font-typewriter text-[10px] text-brand-secondary tracking-[0.5em] uppercase block mb-2">The Timeline</span>
            <h1 className="text-5xl md:text-7xl font-title font-black uppercase tracking-tighter text-white leading-none">
              Full Agenda
            </h1>
          </div>
        </div>

        {/* Agenda Cards Grid - simplified for performance */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENDA_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className="relative rounded-3xl overflow-hidden agenda-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  willChange: 'transform',
                  contain: 'layout style',
                }}
              >
                {/* Type color accent */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: TYPE_COLORS[item.type] }} />

                <div className="p-6 md:p-8 space-y-4">
                  {/* Time & Duration */}
                  <div className="flex items-center justify-between">
                    <span className="font-title font-black text-3xl md:text-4xl tracking-tighter uppercase text-white leading-none">
                      {item.time}
                    </span>
                    <span className="font-typewriter text-[9px] uppercase tracking-widest text-white/40">
                      {item.duration}
                    </span>
                  </div>

                  {/* Type badge */}
                  <div className="inline-block">
                    <span 
                      className="font-typewriter text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-full"
                      style={{ 
                        color: TYPE_COLORS[item.type],
                        backgroundColor: `${TYPE_COLORS[item.type]}20`,
                        border: `1px solid ${TYPE_COLORS[item.type]}40`
                      }}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-title font-black text-xl md:text-2xl uppercase tracking-tight text-white leading-tight">
                    {item.title}
                  </h3>

                  {/* Speaker */}
                  {item.speaker && (
                    <p className="font-editorial text-base italic text-white/60">
                      {item.speaker}
                    </p>
                  )}

                  {/* Description */}
                  <p className="font-sans text-sm text-white/50 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Sub-items */}
                  {item.sub && item.sub.length > 0 && (
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      {item.sub.map((sub) => (
                        <div key={sub.id} className="flex items-start gap-3">
                          <span className="font-typewriter text-[9px] text-white/30 shrink-0 mt-1">
                            {sub.time}
                          </span>
                          <div>
                            <p className="font-sans text-sm text-white/80 font-medium">{sub.title}</p>
                            {sub.speaker && (
                              <p className="font-editorial text-xs italic text-white/40">{sub.speaker}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16 pb-20">
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-typewriter text-[10px] text-white/30 uppercase tracking-widest">
              June 14, 2026 — Al Muntazir Nursery Campus
            </span>
            <span className="font-typewriter text-[10px] text-white/30 uppercase tracking-widest">
              Doors Open 9:30 AM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
