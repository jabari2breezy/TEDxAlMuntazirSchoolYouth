import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import ETGLogo from './ETGLogo';

interface Sponsor {
  src: string;
  alt: string;
  isETG?: boolean;
}

interface SponsorTier {
  name: string;
  accent: string;
  borderColor: string;
  labelColor: string;
  logoHeight: string;
  maxWidth: string;
  sponsors: Sponsor[];
}

const SPONSOR_TIERS: SponsorTier[] = [
  {
    name: 'Platinum Sponsors',
    accent: 'from-white/25 via-white/10 to-transparent',
    borderColor: 'border-white/30',
    labelColor: 'text-white',
    logoHeight: 'h-28 sm:h-32 md:h-40 lg:h-48',
    maxWidth: 'max-w-[min(100%,520px)]',
    sponsors: [
      { src: '/sponsors/etg-hd.png', alt: 'ETG', isETG: true },
      { src: '/sponsors/asas-hd.png', alt: 'ASAS' },
    ],
  },
  {
    name: 'Gold Sponsor',
    accent: 'from-amber-400/20 via-amber-300/5 to-transparent',
    borderColor: 'border-amber-400/40',
    labelColor: 'text-amber-300',
    logoHeight: 'h-24 sm:h-28 md:h-36 lg:h-44',
    maxWidth: 'max-w-[min(100%,560px)]',
    sponsors: [{ src: '/sponsors/leta-kazi.png', alt: 'LETA KAZI LTD.' }],
  },
  {
    name: 'Silver Sponsor',
    accent: 'from-slate-200/20 via-slate-100/5 to-transparent',
    borderColor: 'border-slate-300/40',
    labelColor: 'text-slate-200',
    logoHeight: 'h-16 sm:h-20 md:h-24 lg:h-28',
    maxWidth: 'max-w-[min(100%,400px)]',
    sponsors: [{ src: '/sponsors/jd-pharmacy.png', alt: 'JD PHARMACY' }],
  },
  {
    name: 'Bronze Sponsors',
    accent: 'from-orange-400/20 via-orange-300/5 to-transparent',
    borderColor: 'border-orange-500/40',
    labelColor: 'text-orange-300',
    logoHeight: 'h-14 sm:h-16 md:h-20 lg:h-24',
    maxWidth: 'max-w-[min(100%,360px)]',
    sponsors: [
      { src: '/sponsors/smiles-cars.png', alt: 'Smiles Cars' },
      { src: '/sponsors/dar-glass-works.png', alt: 'Dar es Salaam Glass Works' },
      { src: '/sponsors/amjad-motors.png', alt: 'AMJAD MOTORS International Limited' },
      { src: '/sponsors/emerson-education.png', alt: 'Emerson Education' },
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 1, 0.5, 1] },
  }),
};

function SponsorLogo({
  sponsor,
  heightClass,
  maxWidth,
}: {
  sponsor: Sponsor;
  heightClass: string;
  maxWidth: string;
}) {
  if (sponsor.isETG) {
    return (
      <div className="group flex items-center justify-center px-6 md:px-10 py-6 md:py-8 transition-all duration-500 hover:scale-[1.06]">
        <ETGLogo className={`${heightClass} w-auto ${maxWidth}`} />
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-center px-6 md:px-10 py-6 md:py-8 transition-all duration-500 hover:scale-[1.06]">
      <img
        src={sponsor.src}
        alt={sponsor.alt}
        className={`${heightClass} w-auto ${maxWidth} object-contain object-center opacity-90 group-hover:opacity-100 brightness-[0.85] group-hover:brightness-100 transition-all duration-500 [image-rendering:auto]`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

export default function SponsorsSection() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden bg-[#050507]">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-secondary/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      {/* Site-wide noise */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay rounded-[inherit]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-16">
        {/* Header */}
        <header className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-typewriter text-[10px] uppercase tracking-[1em] text-brand-secondary block mb-4"
          >
            Our Partners
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl font-title font-black uppercase text-white tracking-tighter leading-[0.85]"
          >
            Sponsors
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px bg-white/10 max-w-48 mx-auto mt-6 origin-center"
          />
        </header>

        {/* Sponsor Tiers */}
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          {SPONSOR_TIERS.map((tier, tierIndex) => (
            <motion.div
              key={tier.name}
              custom={tierIndex}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-5%' }}
              variants={cardVariants}
              className={`group relative rounded-2xl md:rounded-3xl border ${tier.borderColor} bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:bg-white/[0.06] transition-all duration-500`}
            >
              {/* Tier accent glow */}
              <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-30 blur-[80px] pointer-events-none bg-gradient-to-b ${tier.accent} group-hover:opacity-50 transition-opacity duration-700`} />

              <div className="relative z-10 px-6 md:px-12 py-8 md:py-12">
                {/* Tier label */}
                <div className="flex items-center gap-4 mb-8">
                  <ChevronRight size={14} className={tier.labelColor} />
                  <span className={`font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.5em] ${tier.labelColor} font-semibold`}>
                    {tier.name}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Logos */}
                <div
                  className={`flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-16 ${
                    tier.sponsors.length === 1 ? 'max-w-3xl mx-auto' : ''
                  } ${tier.sponsors.length === 2 ? 'max-w-5xl mx-auto' : ''}`}
                >
                  {tier.sponsors.map((sponsor) => (
                    <SponsorLogo
                      key={sponsor.alt}
                      sponsor={sponsor}
                      heightClass={tier.logoHeight}
                      maxWidth={tier.maxWidth}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 md:mt-20 font-typewriter text-[10px] uppercase tracking-[0.45em] text-white/40"
        >
          We appreciate you
        </motion.p>
      </div>
    </section>
  );
}
