import { motion } from 'motion/react';
import MaskReveal from '../components/MaskReveal';

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

const TEAM_GROUPS = [
  {
    category: 'Executive Team',
    members: [
      { name: 'Syed Ataa Abbas Abdi', year: '', lead: true, title: 'Lead' },
      { name: 'Naiyl Othman', year: '', lead: true, title: 'Executive Lead' },
      { name: 'Maryam Sheriff', year: '', lead: true, title: 'Executive Lead' }
    ]
  },
  {
    category: 'Curation',
    members: [
      { name: 'Zahra Karim', year: '12' },
      { name: 'TJ Franklin', year: '12' },
      { name: 'Khairoon Rizwan', year: '11' },
      { name: 'Aliyah Jusabani', year: '12', lead: true, title: 'Team Lead' }
    ]
  },
  {
    category: 'Production',
    members: [
      { name: 'Muhammed Omar', year: '12', lead: true, title: 'Team Lead' },
      { name: 'Husseinali Sharif', year: '12' },
      { name: 'Nayah Gangi', year: '12' },
      { name: 'Dhara Gajjar', year: '11' },
      { name: 'Mohammed Datoo', year: '12' }
    ]
  },
  {
    category: 'Marketing',
    members: [
      { name: 'Mehreen Akthar', year: '12', lead: true, title: 'Team Lead' },
      { name: 'Malka Khalid', year: '10' },
      { name: 'Kazim sherzaman', year: '12' }
    ]
  },
  {
    category: 'Logistics',
    members: [
      { name: 'Sahal Harunani', year: '12', lead: true, title: 'Team Lead' },
      { name: 'Caliana Hasham', year: '11' },
      { name: 'Deeva Bhograthania', year: '10' },
      { name: 'Maria Bhaijee', year: '' },
      { name: 'Sakina Dhirani', year: '10' },
      { name: 'Umar Malik', year: '12' }
    ]
  },
  {
    category: 'Finance',
    members: [
      { name: 'Falak Mawji', year: '12', lead: true, title: 'Team Lead' },
      { name: 'Amaan Sheriff', year: '12' },
      { name: 'Mohammad raza muraj', year: '11' }
    ]
  }
];

export default function Team() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-32"
    >
      <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
        <header className="mb-32 flex flex-col items-center text-center mt-12 md:mt-24 overflow-hidden">
          <motion.div
            initial={{ scale: 0.9, y: 100, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase mb-8"
            >
              The Assembly / Crew
            </motion.div>
            <h1 className="text-[16vw] md:text-[14vw] font-title font-black tracking-tighter leading-[0.8] uppercase text-brand-primary flex flex-col items-center">
              <span>The</span>
              <span className="italic font-editorial lowercase text-brand-secondary">Architects.</span>
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {TEAM_GROUPS.map((group) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-6"
            >
              <h4 className="font-title text-3xl uppercase text-brand-primary border-b border-brand-outline pb-4 flex justify-between items-baseline">
                {group.category}
                <span className="font-typewriter text-[9px] text-brand-secondary opacity-50 tracking-widest">{group.members.length} Units</span>
              </h4>
              <div className="space-y-3">
                {group.members.map((m) => (
                  <div key={m.name} className="flex justify-between items-baseline hover:pl-2 transition-all duration-300">
                    <div className="flex gap-2 items-center text-brand-primary">
                      <span className={`font-sans text-lg ${m.lead ? 'font-bold' : 'opacity-60'}`}>{m.name}</span>
                      {m.lead && <span className="text-[10px] bg-brand-secondary text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter shrink-0">{m.title || 'Lead'}</span>}
                    </div>
                    <span className="font-typewriter text-[10px] text-brand-primary/20 shrink-0">{m.year ? `Year ${m.year}` : ''}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
