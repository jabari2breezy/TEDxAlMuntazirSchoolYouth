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
  'Full-day access to all 9 speakers',
  'Three interactive activity sessions',
  'Networking lunch & prayer break',
  'Exclusive attendee badge',
  'Digital certificate of attendance',
  'Tea break refreshments',
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
    <div className="min-h-screen bg-[#f9f9f9] text-[#000839] overflow-x-hidden">

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[90vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Layered background */}
        <motion.div
          style={heroBgScale ? { scale: heroBgScale } : {}}
          className="absolute inset-0 bg-[#000839]"
        >
          {/* Grain texture */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Subtle green accent radial */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 15% 60%, rgba(0,109,56,0.25) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 30%, rgba(0,109,56,0.12) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Parallax text layer */}
        <motion.div
          style={heroY ? { y: heroY } : {}}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block font-typewriter text-[10px] uppercase tracking-[0.5em] text-[#006d38] mb-8 px-5 py-1.5 border border-[#006d38]/40 rounded-full bg-[#006d38]/10"
          >
            Secure Your Seat
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[14vw] sm:text-[10vw] md:text-[8vw] font-title font-black uppercase leading-[0.85] tracking-tighter text-white mb-8"
          >
            Get Your<br />
            <span className="text-[#006d38]">Ticket</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-editorial text-xl md:text-3xl text-white/50 italic max-w-2xl mx-auto"
          >
            "None of us choose our arrival or departure — but we choose what happens in between."
          </motion.p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/30">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-white/20"
          />
        </motion.div>
      </section>

      {/* ─── EVENT INFO STRIP ─────────────────────────────────────────── */}
      <section className="bg-[#000839] border-t border-white/5 py-10 px-6 md:px-16 overflow-hidden">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-10 sm:gap-0 sm:divide-x sm:divide-white/10">
          {features.map((f) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 sm:px-12 first:pl-0 last:pr-0"
            >
              <div className="w-10 h-10 rounded-full bg-[#006d38]/20 flex items-center justify-center shrink-0">
                <f.icon size={18} className="text-[#006d38]" />
              </div>
              <div>
                <p className="font-title font-bold text-white text-sm uppercase tracking-wide">{f.label}</p>
                <p className="font-sans text-white/40 text-xs mt-0.5">{f.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-40 px-6 md:px-16 max-w-screen-xl mx-auto">
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
                <div className="bg-[#000839] px-8 md:px-12 pt-12 pb-16">
                  <div className="flex items-start justify-between mb-12">
                    <div>
                      <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/30 block mb-2">
                        TEDxAlMuntazirSchoolsYouth
                      </span>
                      <h2 className="font-title font-black text-4xl md:text-5xl uppercase text-white tracking-tighter leading-none">
                        Borrowed<br/>Time
                      </h2>
                    </div>
                    <Ticket size={40} className="text-[#006d38] opacity-60 shrink-0 mt-1" />
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

      {/* ─── FULL-BLEED CTA BANNER ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#006d38] py-24 md:py-40 px-6">
        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-title font-black text-[12vw] sm:text-[8vw] md:text-[7rem] uppercase leading-[0.85] tracking-tighter text-white mb-10"
          >
            The Clock<br/>Is Ticking
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-editorial text-xl md:text-2xl italic text-white/70 mb-14 max-w-2xl mx-auto"
          >
            Join us on June 14, 2026, as nine extraordinary minds reshape how we think about time.
          </motion.p>
          <motion.a
            href={TUKIIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-4 bg-white text-[#000839] px-10 md:px-14 py-5 md:py-6 rounded-full font-title font-bold text-lg md:text-2xl uppercase tracking-widest shadow-2xl"
          >
            Buy on Tuki.io <ArrowRight size={24} />
          </motion.a>
        </div>
      </section>
    </div>
  );
}
