import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Clock, MapPin, Calendar, Ticket, CheckCircle2, Zap } from 'lucide-react';

const TUKIIO_URL = 'https://tukiio.com/event/tedxalmuntazirschoolsyouth';

const features = [
  { icon: Clock, label: 'Full Day', detail: '9 Talks across 3 sessions' },
  { icon: MapPin, label: 'AlMuntazir Nursery', detail: 'UN Road, Upanga, Dar es Salaam' },
  { icon: Calendar, label: 'June 14, 2026', detail: 'Doors open 9:30 AM' },
];

const includes = [
  'Your ticket grants you full access to all live speaker sessions, interactive workshop zones, premium networking breaks, official TEDxAlmuntazirSchoolYouth merchandise, and a curated lunch/refreshments experience'
];

const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function HeroNumber({ n }: { n: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="tabular-nums"
    >
      {n}
    </motion.span>
  );
}

export default function Tickets() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = isMobile ? undefined : useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroBgScale = isMobile ? undefined : useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div className="min-h-screen bg-brand-background pt-20">
      <section className="py-24 md:py-40 px-6 md:px-16 max-w-screen-xl mx-auto pt-32 md:pt-48">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24 items-start">
          {/* Left — Ticket card */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Ticket Visual */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Top navy section */}
                <div className="bg-[#000839] px-6 md:px-12 pt-10 md:pt-12 pb-12 md:pb-16">
                  <div className="flex items-start justify-between mb-10 md:mb-12 gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-widest md:tracking-[0.4em] text-white/30 block mb-2 truncate md:overflow-visible md:whitespace-normal">
                        TEDxAlMuntazirSchoolsYouth
                      </span>
                      <h2 className="font-title font-black text-3xl md:text-5xl uppercase text-white tracking-tighter leading-none break-words">
                        Borrowed<br/>Time
                      </h2>
                    </div>
                    <Ticket size={32} className="text-[#006d38] opacity-60 shrink-0 mt-1 md:w-10 md:h-10" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-typewriter text-[9px] uppercase tracking-widest text-white/30 mb-1">Date</p>
                      <p className="font-title font-bold text-white text-lg uppercase">June 14, 2026</p>
                    </div>
                    <div>
                      <p className="font-typewriter text-[9px] uppercase tracking-widest text-white/30 mb-1">Time</p>
                      <p className="font-title font-bold text-white text-lg uppercase">9:30 AM</p>
                    </div>
                    <div>
                      <p className="font-typewriter text-[9px] uppercase tracking-widest text-white/30 mb-1">Venue</p>
                      <p className="font-title font-bold text-white text-base uppercase leading-tight">AlMuntazir<br/>Nursery, Upanga</p>
                    </div>
                    <div>
                      <p className="font-typewriter text-[9px] uppercase tracking-widest text-white/30 mb-1">Type</p>
                      <p className="font-title font-bold text-[#006d38] text-lg uppercase">General</p>
                    </div>
                  </div>
                </div>

                {/* Perforated divider */}
                <div className="bg-[#000839] relative flex items-center">
                  <div className="absolute left-0 w-6 h-12 bg-[#f9f9f9] rounded-r-full -translate-x-1" />
                  <div className="flex-1 mx-6 border-t-2 border-dashed border-white/10" />
                  <div className="absolute right-0 w-6 h-12 bg-[#f9f9f9] rounded-l-full translate-x-1" />
                </div>

                {/* Bottom green section */}
                <div className="bg-[#006d38] px-8 md:px-12 py-8 flex items-center justify-between">
                  <div>
                    <p className="font-typewriter text-[9px] uppercase tracking-widest text-white/50 mb-1">Admission</p>
                    <p className="font-title font-black text-white text-2xl uppercase">TZS 30,000</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-typewriter text-[9px] uppercase tracking-widest text-white/50 mb-1">Category</p>
                    <p className="font-title font-bold text-white text-sm uppercase">Students Only</p>
                  </div>
                </div>
              </div>

              {/* Price note */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 font-typewriter text-[10px] text-[#000839]/40 uppercase tracking-widest text-center"
              >
                Tickets sold exclusively via Tuki.io · Secure checkout
              </motion.p>
            </motion.div>
          </div>

          {/* Right — CTA + includes */}
          <div className="lg:col-span-2 space-y-12">

            {/* What's included */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="font-title font-black text-2xl uppercase tracking-tighter text-[#000839] mb-8">
                What's Included
              </h3>
              <ul className="space-y-5">
                {includes.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 size={18} className="text-[#006d38] mt-0.5 shrink-0" />
                    <span className="font-sans text-[#000839]/70 text-sm leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Buy CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-5"
            >
              <a
                href={TUKIIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="group relative flex items-center justify-between w-full bg-[#000839] text-white px-8 py-6 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,8,57,0.35)]"
              >
                {/* Hover fill */}
                <motion.div
                  className="absolute inset-0 bg-[#006d38]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  style={{ originX: 0 }}
                />
                <div className="relative z-10">
                  <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/50 block mb-1">
                    Buy Now
                  </span>
                  <span className="font-title font-black text-2xl uppercase tracking-tighter">
                    Get Tickets
                  </span>
                </div>
                <motion.div
                  animate={{ x: hovered ? 4 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <ArrowRight size={28} />
                </motion.div>
              </a>

              <p className="flex items-center gap-2 font-typewriter text-[10px] uppercase tracking-widest text-[#000839]/40">
                <Zap size={12} className="text-[#006d38]" />
                Powered by Tuki.io · Secure &amp; Instant
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
