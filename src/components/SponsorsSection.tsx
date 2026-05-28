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
      { src: '/sponsors/etg-hd.png', alt: 'ETG' },
      { src: '/sponsors/asas-hd.png', alt: 'ASAS' },
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
    <div className="group flex items-center justify-center px-6 md:px-10 py-6 md:py-8 transition-all duration-500 hover:scale-[1.04]">
      <img
        src={src}
        alt={alt}
        className={`${heightClass} w-auto ${maxWidth} object-contain object-center opacity-80 group-hover:opacity-100 transition-all duration-500 [image-rendering:auto]`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

export default function SponsorsSection() {
  return (
    <section className="relative py-24 md:py-36 border-t border-brand-outline/30 overflow-hidden bg-[#f8f6f0]">
      {/* Vintage paper grain */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />

      {/* Subtle warm vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,8,57,0.02)_100%)] pointer-events-none" />

      {/* Decorative top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-16">
        {/* Header */}
        <header className="text-center mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px flex-1 max-w-24 bg-brand-primary/15" />
            <span className="font-typewriter text-[8px] uppercase tracking-[0.6em] text-brand-primary/40">
              Our Partners
            </span>
            <div className="h-px flex-1 max-w-24 bg-brand-primary/15" />
          </div>
          <h2 className="text-5xl md:text-7xl font-editorial font-black uppercase text-brand-primary tracking-tight leading-none">
            Sponsors
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3 text-brand-primary/20">
            <span className="text-lg">✦</span>
            <div className="w-12 h-px bg-brand-primary/15" />
            <span className="text-lg">✦</span>
          </div>
        </header>

        {/* Sponsor Tiers */}
        <div className="space-y-0 max-w-6xl mx-auto">
          {SPONSOR_TIERS.map((tier, tierIndex) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.7, delay: tierIndex * 0.06, ease: [0.25, 1, 0.5, 1] }}
              className="border-t border-brand-primary/10 first:border-t-0"
            >
              <div className="py-4 md:py-5">
                <p className="text-center font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.55em] text-brand-primary/40">
                  <span className="text-brand-primary/20 mx-2 select-none">── </span>
                  {tier.name}
                  <span className="text-brand-primary/20 mx-2 select-none"> ──</span>
                </p>
              </div>

              <div
                className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 py-8 md:py-12 ${
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

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="flex items-center justify-center gap-3 text-brand-primary/15 mb-4">
            <div className="h-px flex-1 max-w-32 bg-brand-primary/10" />
            <span className="text-xs">◆</span>
            <div className="h-px flex-1 max-w-32 bg-brand-primary/10" />
          </div>
          <p className="font-editorial italic text-sm md:text-base text-brand-primary/40">
            We appreciate you
          </p>
        </motion.div>
      </div>
    </section>
  );
}
