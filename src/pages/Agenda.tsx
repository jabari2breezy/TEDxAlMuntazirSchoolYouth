import React from 'react';
import { WeatherEffect } from '../components/ui/rain-and-lightning-hero-section';

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
    title: 'Registration',
    speaker: 'Welcome Desk',
    desc: 'Grab your badge, find your seat, and get ready for a day of big ideas.',
    duration: '30M',
    type: 'EXPERIENCE'
  },
  {
    id: '01',
    time: '10:00 AM',
    title: 'Opening Session',
    speaker: 'Your Hosts',
    desc: 'Quick welcome, what TEDx is all about, and the vibe for the day.',
    duration: '20M',
    type: 'SESSION',
    sub: [
      { id: '01a', time: '10:00', title: 'Welcome Address', speaker: 'Hosts', desc: 'Kickoff and what to expect.', duration: '10M', type: 'EXPERIENCE' },
      { id: '01b', time: '10:10', title: 'Intro Video', speaker: 'Screen', desc: 'A short film to set the mood.', duration: '10M', type: 'VIDEO' },
    ]
  },
  {
    id: '02',
    time: '10:20 AM',
    title: 'Session 1',
    speaker: '3 Speakers + Game',
    desc: 'Three speakers, one interactive game. Ideas that hit different.',
    duration: '70M',
    type: 'SESSION',
    sub: [
      { id: '02a', time: '10:20', title: 'Ridhwan Mohammed', speaker: 'Alumni Speaker', desc: 'What school never taught you about time.', duration: '15M', type: 'KEYNOTE' },
      { id: '02b', time: '10:35', title: 'Quick Break', speaker: '', desc: 'Stretch, grab water, reset.', duration: '5M', type: 'BREAK' },
      { id: '02c', time: '10:40', title: 'Anaya Rashid', speaker: 'Culture of Time', desc: 'How different cultures actually treat time — and what we can learn.', duration: '15M', type: 'KEYNOTE' },
      { id: '02d', time: '10:55', title: 'Interactive Game', speaker: 'Audience', desc: 'Get involved. No sitting this one out.', duration: '10M', type: 'GAME' },
      { id: '02e', time: '11:05', title: 'Zahra Datoo', speaker: 'Nostalgia', desc: 'Why we look back, what it costs us, and why it still matters.', duration: '15M', type: 'KEYNOTE' },
    ]
  },
  {
    id: '03',
    time: '11:30 AM',
    title: 'Tea Break',
    speaker: 'Refreshments',
    desc: 'Snacks, drinks, and a chance to chat with people.',
    duration: '20M',
    type: 'BREAK'
  },
  {
    id: '04',
    time: '11:50 AM',
    title: 'Session 2',
    speaker: '3 Speakers + Game',
    desc: 'More talks, more games, more reasons to pay attention.',
    duration: '70M',
    type: 'SESSION',
    sub: [
      { id: '04a', time: '11:50', title: 'Zahra Moledina', speaker: 'The Best Thing Since Sliced Bread', desc: 'Why the next big thing is already here — and why you might be missing it.', duration: '15M', type: 'KEYNOTE' },
      { id: '04b', time: '12:05', title: 'Kahoot / Blooket', speaker: 'Audience', desc: 'Quiz time. Compete, laugh, win.', duration: '10M', type: 'GAME' },
      { id: '04c', time: '12:15', title: 'TBD Speaker', speaker: 'Surprise Guest', desc: 'Someone unexpected. Stay tuned.', duration: '18M', type: 'KEYNOTE' },
      { id: '04d', time: '12:33', title: 'Mini Game', speaker: 'Audience', desc: 'Quick energy boost before the last speaker.', duration: '5M', type: 'GAME' },
      { id: '04e', time: '12:38', title: 'Hassan Abbas Muhammad', speaker: 'Procrastination', desc: 'Why we put things off — and how to actually stop.', duration: '15M', type: 'KEYNOTE' },
      { id: '04f', time: '12:53', title: 'Buffer', speaker: '', desc: 'Quick breather so we stay on schedule.', duration: '7M', type: 'BREAK' },
    ]
  },
  {
    id: '05',
    time: '01:00 PM',
    title: 'Salah & Lunch',
    speaker: 'Prayer + Food',
    desc: 'Prayer break, then food. Come back recharged.',
    duration: '60M',
    type: 'LUNCH'
  },
  {
    id: '06',
    time: '02:00 PM',
    title: 'Session 3',
    speaker: '3 Speakers + 2 Games',
    desc: 'The final stretch. Three speakers, two games, one unforgettable close.',
    duration: '75M',
    type: 'SESSION',
    sub: [
      { id: '06a', time: '02:00', title: 'Yunus Osman', speaker: 'The Art of Scheduling (Alumni)', desc: 'How to actually manage your time without burning out.', duration: '15M', type: 'KEYNOTE' },
      { id: '06b', time: '02:15', title: 'Interactive Game', speaker: 'Audience', desc: 'Reset the room before the next talk.', duration: '10M', type: 'GAME' },
      { id: '06c', time: '02:25', title: 'Sada Mbaruk', speaker: 'End of the World', desc: 'What happens when we run out of time — and why it matters now.', duration: '15M', type: 'KEYNOTE' },
      { id: '06d', time: '02:40', title: 'Imposter Game', speaker: 'Audience', desc: 'Social deduction. Who can you trust with your time?', duration: '10M', type: 'GAME' },
      { id: '06e', time: '02:50', title: 'Liyaan Karbelkar', speaker: 'How to Take Your Wealth With You', desc: 'Building something that lasts longer than you.', duration: '15M', type: 'KEYNOTE' },
      { id: '06f', time: '03:05', title: 'Buffer', speaker: '', desc: 'Final buffer before closing.', duration: '10M', type: 'BREAK' },
    ]
  },
  {
    id: '07',
    time: '03:15 PM',
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
  EXPERIENCE: '#4e5a98',
  LUNCH: '#767681',
  GAME: '#006d38',
  CEREMONY: '#000839',
  VIDEO: '#4e5a98',
};

export default function Agenda() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900">
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
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-8">
          <span className="font-typewriter text-[10px] text-brand-secondary tracking-[0.5em] uppercase block mb-2">The Timeline</span>
          <h1 className="text-5xl md:text-7xl font-title font-black uppercase tracking-tighter text-gray-900 leading-none">
            Full Agenda
          </h1>
        </div>
      </div>

      {/* Agenda Cards Grid */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENDA_ITEMS.map((item) => (
            <div
              key={item.id}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Type color accent */}
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: TYPE_COLORS[item.type] }} />

              <div className="p-6 md:p-8 space-y-4">
                {/* Time & Duration */}
                <div className="flex items-center justify-between">
                  <span className="font-title font-black text-3xl md:text-4xl tracking-tighter uppercase text-gray-900 leading-none">
                    {item.time}
                  </span>
                  <span className="font-typewriter text-[9px] uppercase tracking-widest text-gray-400">
                    {item.duration}
                  </span>
                </div>

                {/* Type badge */}
                <div className="inline-block">
                  <span 
                    className="font-typewriter text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-full"
                    style={{ 
                      color: TYPE_COLORS[item.type],
                      backgroundColor: `${TYPE_COLORS[item.type]}15`,
                      border: `1px solid ${TYPE_COLORS[item.type]}30`
                    }}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-title font-black text-xl md:text-2xl uppercase tracking-tight text-gray-900 leading-tight">
                  {item.title}
                </h3>

                {/* Speaker */}
                {item.speaker && (
                  <p className="font-editorial text-base italic text-gray-500">
                    {item.speaker}
                  </p>
                )}

                {/* Description */}
                <p className="font-sans text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>

                {/* Sub-items */}
                {item.sub && item.sub.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    {item.sub.map((sub) => (
                      <div key={sub.id} className="flex items-start gap-3">
                        <span className="font-typewriter text-[9px] text-gray-300 shrink-0 mt-1">
                          {sub.time}
                        </span>
                        <div>
                          <p className="font-sans text-sm text-gray-700 font-medium">{sub.title}</p>
                          {sub.speaker && (
                            <p className="font-editorial text-xs italic text-gray-400">{sub.speaker}</p>
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
