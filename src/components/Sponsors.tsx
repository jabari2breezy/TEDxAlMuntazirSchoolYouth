import { motion } from 'motion/react';

const sponsorsList = [
  { name: 'Dar es Salaam Glass Works', src: '/sponsors/dar_es_salaam_glass_works.png', darkBg: false },
  { name: 'AMJAD MOTORS International Limited', src: '/sponsors/amjad_motors.png', darkBg: true },
  { name: 'LETA KAZI LTD', src: '/sponsors/leta_kazi.png', darkBg: false },
  { name: 'JD PHARMACY', src: '/sponsors/jd_pharmacy.png', darkBg: false },
  { name: 'ETG', src: '/sponsors/etg.png', darkBg: false },
];

export default function Sponsors() {
  return (
    <section className="py-24 bg-brand-background border-t border-brand-outline">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center space-y-4 mb-16"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-brand-secondary" />
            <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary">
              Our Partners
            </span>
            <div className="h-[1px] w-12 bg-brand-secondary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-title font-black uppercase tracking-tighter text-brand-primary">
            Proudly Supported By
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {sponsorsList.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.03 }}
              className={`
                group relative rounded-2xl border border-brand-outline overflow-hidden flex items-center justify-center
                h-32 md:h-40 p-4 transition-all duration-300
                ${sponsor.darkBg
                  ? 'bg-[#0a0a0a] hover:border-brand-secondary'
                  : 'bg-brand-surface hover:border-brand-secondary hover:bg-white'
                }
              `}
            >
              <img
                src={sponsor.src}
                alt={`${sponsor.name} logo`}
                className="max-w-[85%] max-h-[75%] object-contain transition-all duration-300 group-hover:scale-105"
                style={{ imageRendering: 'crisp-edges' }}
              />
              {/* Sponsor name tooltip */}
              <div className="absolute bottom-0 left-0 right-0 bg-brand-primary/90 text-brand-background font-typewriter text-[8px] uppercase tracking-widest text-center py-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {sponsor.name}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center font-typewriter text-[9px] uppercase tracking-[0.3em] text-brand-primary/30 mt-10"
        >
          Interested in sponsoring? Contact us to become a partner.
        </motion.p>
      </div>
    </section>
  );
}
