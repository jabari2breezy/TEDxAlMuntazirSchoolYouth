import { motion } from 'motion/react';
import ETGLogo from './ETGLogo';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export default function SponsorsSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-[#050507]">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-secondary/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12 md:mb-20">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
            className="h-px flex-1 bg-white/10 origin-left"
          />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-white/30 shrink-0"
          >
            Our Partners
          </motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.1 }}
            className="h-px flex-1 bg-white/10 origin-right"
          />
        </div>

        {/* ETG Logo — main feature */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.85, ease: LUXURY_EASE }}
          className="flex flex-col items-center"
        >
          <div className="relative group">
            {/* Glow behind logo */}
            <div className="absolute inset-0 bg-white/5 blur-[60px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <ETGLogo className="w-[280px] md:w-[400px] lg:w-[480px] h-auto relative z-10" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 md:mt-8 text-center"
          >
            <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-white/20">
              Title Sponsor
            </span>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: LUXURY_EASE, delay: 0.2 }}
          className="h-px bg-white/8 my-12 md:my-20 max-w-2xl mx-auto origin-center"
        />

        {/* Other sponsors — minimal row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {[
            { src: '/sponsors/asas-hd.png', alt: 'ASAS' },
            { src: '/sponsors/leta-kazi.png', alt: 'LETA KAZI LTD.' },
            { src: '/sponsors/jd-pharmacy.png', alt: 'JD PHARMACY' },
            { src: '/sponsors/smiles-cars.png', alt: 'Smiles Cars' },
            { src: '/sponsors/dar-glass-works.png', alt: 'Dar es Salaam Glass Works' },
            { src: '/sponsors/amjad-motors.png', alt: 'AMJAD MOTORS' },
            { src: '/sponsors/emerson-education.png', alt: 'Emerson Education' },
          ].map((sponsor) => (
            <div
              key={sponsor.alt}
              className="group flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-500"
            >
              <img
                src={sponsor.src}
                alt={sponsor.alt}
                className="h-10 md:h-14 w-auto max-w-[120px] md:max-w-[160px] object-contain brightness-[0.7] group-hover:brightness-100 transition-all duration-500"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 md:mt-16 font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/15"
        >
          We appreciate our partners
        </motion.p>
      </div>
    </section>
  );
}
