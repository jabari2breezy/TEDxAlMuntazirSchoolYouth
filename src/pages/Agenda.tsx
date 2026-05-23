import { motion } from 'motion/react';

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

export default function Agenda() {
  const agendaItems = [
    { time: '09:30 - 10:00', title: 'Registration', sub: 'Arrival & Check-in', theme: 'past' },
    { time: '10:00 - 10:20', title: 'Introduction', sub: 'Welcome (7m) & Video (10m)', theme: 'past' },
    
    // Session 1
    { time: '10:20 - 10:38', title: 'Ridhwan Mohammed (Alum)', sub: 'Speaker 1', theme: 'past' },
    { time: '10:38 - 10:43', title: 'Activity', sub: 'Audience Engagement', theme: 'past' },
    { time: '10:43 - 11:01', title: 'Anaya Rashid', sub: 'Culture of time', theme: 'past' },
    { time: '11:01 - 11:11', title: 'Game', sub: 'Interactive Session', theme: 'past' },
    { time: '11:11 - 11:30', title: 'Zahra Datoo', sub: 'Nostalgia', theme: 'past' },
    
    { time: '11:30 - 11:50', title: 'Tea Break', sub: 'Refreshments & Networking', theme: 'present' },
    
    // Session 2
    { time: '11:50 - 12:08', title: 'Zahra Moledina', sub: 'The best thing since sliced bread', theme: 'present' },
    { time: '12:08 - 12:18', title: 'Kahoot / Blooket', sub: 'Interactive Challenge', theme: 'present' },
    { time: '12:18 - 12:36', title: 'Faizaan (Emerson) (Alumni)', sub: 'Speaker 5', theme: 'present' },
    { time: '12:36 - 12:41', title: 'Game', sub: 'Mini Activity', theme: 'present' },
    { time: '12:41 - 13:00', title: 'Hassan Abbas Muhammad', sub: 'Procrastination', theme: 'present' },
    
    { time: '13:00 - 14:00', title: 'Salah & Food Break', sub: 'Nourishment & Reflection', theme: 'present' },

    // Session 3
    { time: '14:00 - 14:18', title: 'Yunus Osman (Alumni)', sub: 'Art of scheduling', theme: 'future' },
    { time: '14:18 - 14:28', title: 'Game', sub: 'Audience Engagement', theme: 'future' },
    { time: '14:28 - 14:46', title: 'Sada Mbaruk', sub: 'End of the world', theme: 'future' },
    { time: '14:46 - 14:56', title: 'Game', sub: 'Interactive Session', theme: 'future' },
    { time: '14:56 - 15:15', title: 'Liyaan Karblekar', sub: 'How to take your wealth with you', theme: 'future' },
    
    { time: '15:15 - 15:40', title: 'Closing Ceremony', sub: 'Borrowed Time: The Beginning', theme: 'future' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="pt-40 pb-32"
    >
      <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
        <header className="mb-24">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <span className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase">The assembly</span>
            <h1 className="text-7xl md:text-[10vw] font-title font-black tracking-tighter uppercase leading-[0.8] text-brand-primary">
              Agenda.<br /><span className="italic font-editorial lowercase text-brand-secondary">Time Unfolding.</span>
            </h1>
          </motion.div>
        </header>

        <div className="space-y-48">
          {[
            { label: 'Past', title: 'Echoes & Foundations', items: agendaItems.filter(i => i.theme === 'past') },
            { label: 'Present', title: 'Presence & Power', items: agendaItems.filter(i => i.theme === 'present') },
            { label: 'Future', title: 'Reimagining Systems', items: agendaItems.filter(i => i.theme === 'future') }
          ].map((section, sIndex) => (
            <div key={section.label} className="space-y-16">
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                <span className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase shrink-0">Section {sIndex + 1} / {section.label}</span>
                <div className="h-px bg-brand-outline flex-grow" />
                <h2 className="text-3xl md:text-4xl font-title font-black uppercase text-brand-primary tracking-tighter shrink-0">{section.title}</h2>
              </div>

              <div className="py-10 space-y-32">
                {section.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                    className="relative group"
                  >
                    <div className="space-y-6">
                      <span className="font-typewriter text-2xl md:text-4xl text-brand-primary/20 group-hover:text-brand-secondary transition-colors duration-500">
                        {item.time}
                      </span>
                      <div className="space-y-2">
                         <h3 className="text-4xl md:text-7xl font-title font-black uppercase text-brand-primary tracking-tight">
                           {item.title}
                         </h3>
                         <p className="font-editorial text-2xl md:text-3xl text-brand-primary/40 italic leading-tight">
                           {item.sub}
                         </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
