import { motion } from 'motion/react';
import MaskReveal from './MaskReveal';

interface Sponsor {
  src: string;
  alt: string;
}

interface SponsorTier {
  name: string;
  accent: string;
  logoHeight: string;
  maxWidth: string;
  sponsors: Sponsor[];
}

const SPONSOR_TIERS: SponsorTier[] = [
  {
    name: 'Platinum Sponsors',
    accent: 'from-white/25 via-white/10 to-transparent',
    logoHeight: 'h-28 sm:h-32 md:h-40 lg:h-48',
    maxWidth: 'max-w-[min(100%,520px)]',
    sponsors: [
      { src: '/sponsors/etg.png', alt: 'ETG' },
      { src: '/sponsors/asas@2x.png', alt: 'ASAS' },
    ],
  },
  {
    name: 'Gold Sponsor',
    accent: 'from-amber-200/20 via-white/5 to-transparent',
    logoHeight: 'h-24 sm:h-28 md:h-36 lg:h-44',
    maxWidth: 'max-w-[min(100%,560px)]',
    sponsors: [{ src: '/sponsors/leta-kazi.png', alt: 'LETA KAZI LTD.' }],
  },
  {
    name: 'Silver Sponsor',
    accent: 'from-slate-300/15 via-white/5 to-transparent',
    logoHeight: 'h-16 sm:h-20 md:h-24 lg:h-28',
    maxWidth: 'max-w-[min(100%,400px)]',
    sponsors: [{ src: '/sponsors/jd-pharmacy.png', alt: 'JD PHARMACY' }],
  },
  {
    name: 'Bronze Sponsors',
    accent: 'from-orange-300/15 via-white/5 to-transparent',
    logoHeight: 'h-14 sm:h-16 md:h-20 lg:h-24',
    maxWidth: 'max-w-[min(100%,360px)]',
    sponsors: [
      { src: '/sponsors/smiles-cars.png', alt: 'Smiles Cars' },
      { src: '/sponsors/dar-glass-works.png', alt: 'Dar es Salaam Glass Works' },
      { src: '/sponsors/amjad-motors.png', alt: 'AMJAD MOTORS International Limited' },
    ],
  },
];

function SponsorLogo({
  src,
  alt,
  heightClass,
  maxWidth,
}: {
  src: string;
  alt: string;
  heightClass: string;
  maxWidth: string;
}) {
  return (
    <div className="group flex items-center justify-center px-6 md:px-10 py-6 md:py-8 transition-transform duration-500 hover:scale-[1.04]">
      <img
        src={src}
        alt={alt}
        className={`${heightClass} w-auto ${maxWidth} object-contain object-center drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:drop-shadow-[0_16px_40px_rgba(0,0,0,0.55)] [image-rendering:auto]`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

export default function SponsorsSection() {
  return (
    <section className="relative py-24 md:py-36 border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050507]" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/30 via-transparent to-brand-secondary/10 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(220,38,38,0.35) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(220,38,38,0.2) 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-16">
        <header className="text-center mb-16 md:mb-24">
          <MaskReveal>
            <span className="font-typewriter text-[10px] uppercase tracking-[1em] text-brand-secondary block mb-4">
              Our Partners
            </span>
          </MaskReveal>
          <MaskReveal delay={0.08}>
            <h2 className="text-4xl md:text-6xl font-title font-black uppercase text-white tracking-tighter">
              Sponsors
            </h2>
          </MaskReveal>
        </header>

        <div className="space-y-0">
          {SPONSOR_TIERS.map((tier, tierIndex) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.7, delay: tierIndex * 0.06, ease: [0.25, 1, 0.5, 1] }}
              className="border-t border-white/15 first:border-t-0"
            >
              <div className={`py-3 md:py-4 bg-gradient-to-r ${tier.accent}`}>
                <p className="text-center font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.55em] text-white/70">
                  {tier.name}
                </p>
              </div>

              <div
                className={`flex flex-wrap items-center justify-center gap-10 md:gap-16 lg:gap-24 py-12 md:py-16 ${
                  tier.sponsors.length === 1 ? 'max-w-3xl mx-auto' : ''
                } ${tier.sponsors.length === 2 ? 'max-w-5xl mx-auto' : ''}`}
              >
                {tier.sponsors.map((sponsor) => (
                  <SponsorLogo
                    key={sponsor.alt}
                    src={sponsor.src}
                    alt={sponsor.alt}
                    heightClass={tier.logoHeight}
                    maxWidth={tier.maxWidth}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16 font-typewriter text-[10px] uppercase tracking-[0.45em] text-white/50"
        >
          We appreciate you
        </motion.p>
      </div>
    </section>
  );
}
