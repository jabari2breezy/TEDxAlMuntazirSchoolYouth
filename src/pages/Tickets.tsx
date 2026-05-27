import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import MaskReveal from '../components/MaskReveal';
import { Lock, MapPin, Calendar, Clock } from 'lucide-react';
import { TICKETS_URL } from '../constants';

const ease = [0.25, 1, 0.5, 1] as const;

function ComingSoonPulse() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 100), 80);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-typewriter text-[9px] tracking-[0.5em] text-brand-secondary tabular-nums">
      [{String(tick).padStart(2, '0')}.LOCKED]
    </span>
  );
}

function TicketStub() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMove = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((clientX - rect.left) / rect.width - 0.5);
    y.set((clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative w-full max-w-lg mx-auto perspective-[1200px]"
    >
      <div
        className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-brand-primary/40 backdrop-blur-3xl shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
        style={{ transform: 'translateZ(24px)' }}
      >
        {/* Holographic sheen */}
        <motion.div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 35%, rgba(0,109,56,0.35) 50%, transparent 65%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />

        <div className="p-8 md:p-10 space-y-8">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="font-typewriter text-[8px] uppercase tracking-[0.45em] text-white/40 block mb-2">
                Admission Class
              </span>
              <h3 className="font-title text-3xl md:text-4xl font-black uppercase text-white tracking-tighter">
                General
              </h3>
            </div>
            <div className="text-right">
              <span className="font-typewriter text-[8px] uppercase tracking-[0.35em] text-white/40 block mb-1">
                Rate
              </span>
              <p className="font-title text-2xl font-black text-brand-secondary">TZS 30K</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-white/70">
            {[
              { icon: Calendar, label: 'Date', value: '14 JUN 2026' },
              { icon: MapPin, label: 'Venue', value: 'NURSERY CAMPUS' },
              { icon: Clock, label: 'Doors', value: '09:30 AM' },
              { icon: Lock, label: 'Status', value: 'COMING SOON' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="space-y-1 border-l border-white/10 pl-4">
                <Icon size={14} className="text-brand-secondary/80 mb-1" strokeWidth={1.5} />
                <span className="font-typewriter text-[7px] uppercase tracking-[0.35em] text-white/35 block">
                  {label}
                </span>
                <span className="font-sans text-xs font-bold uppercase tracking-wide text-white/90">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <ul className="space-y-2 border-t border-dashed border-white/15 pt-6">
            {[
              'Full day — all sessions',
              'Networking lunch',
              'Attendee gift bag',
              'Digital certificate',
            ].map((perk) => (
              <li
                key={perk}
                className="font-typewriter text-[9px] uppercase tracking-[0.25em] text-white/50 flex items-center gap-3"
              >
                <span className="w-1 h-1 rounded-full bg-brand-secondary" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Perforation */}
        <div className="relative h-6 bg-[#050507]/60">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-white/20" />
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#050507]"
              style={{ left: `${(i / 23) * 100}%`, transform: 'translate(-50%, -50%)' }}
            />
          ))}
        </div>

        <div className="p-8 md:p-10 bg-[#050507]/50 flex flex-col items-center gap-6 text-center">
          <ComingSoonPulse />
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-5 rounded-full border border-brand-secondary/40 bg-brand-secondary/15 text-brand-secondary font-typewriter text-[10px] uppercase tracking-[0.45em] flex items-center justify-center gap-3 hover:bg-brand-secondary hover:text-white hover:border-brand-secondary transition-all active:scale-[0.99]"
          >
            Get Tickets (Tukiio)
          </a>
          <p className="font-typewriter text-[8px] uppercase tracking-[0.4em] text-white/30">
            Students only · Valid ID required at door
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Tickets() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const titleX = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.4], [0.15, 0.05]);

  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 30 });
  const lineScale = useTransform(progress, [0, 0.5], [0, 1]);

  return (
    <div ref={sectionRef} className="min-h-screen bg-brand-background text-brand-primary overflow-hidden">
      {/* Ambient grid */}
      <motion.div
        style={{ opacity: gridOpacity }}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,8,57,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,8,57,0.07) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>

      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[560px] h-[560px] rounded-full bg-brand-secondary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[720px] h-[520px] rounded-full bg-brand-primary/20 blur-[120px]" />
      </motion.div>

      {/* Hero */}
      <section className="relative z-10 pt-36 md:pt-44 pb-20 px-6 md:px-16 max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-20">
          <div className="max-w-4xl">
            <MaskReveal>
              <span className="font-typewriter text-[10px] uppercase tracking-[1em] text-brand-secondary block mb-6">
                Access Protocol / 07
              </span>
            </MaskReveal>
            <MaskReveal delay={0.08}>
              <h1 className="text-[14vw] md:text-[9vw] font-title font-black uppercase leading-[0.78] tracking-tighter">
                <motion.span style={{ x: titleX }} className="inline-block">
                  Secure
                </motion.span>
                <br />
                <span className="text-brand-secondary italic font-editorial lowercase text-[12vw] md:text-[7vw] -ml-2">
                  your seat.
                </span>
              </h1>
            </MaskReveal>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease }}
            className="lg:max-w-xs space-y-4"
          >
            <p className="font-editorial text-2xl md:text-3xl text-white/45 italic leading-snug">
              Secure your seat via Tukiio — fast checkout, instant confirmation, QR verification at the door.
            </p>
            <motion.div
              style={{ scaleX: lineScale }}
              className="h-px bg-brand-secondary origin-left w-full"
            />
          </motion.div>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <TicketStub />
          </div>

          <div className="lg:col-span-5 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease }}
              className="border border-white/10 rounded-[1.5rem] p-8 md:p-10 bg-white/[0.03] backdrop-blur-xl"
            >
              <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/35 block mb-6">
                Release Window
              </span>
              <p className="font-title text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                Coming
                <br />
                <span className="text-brand-secondary">Soon</span>
              </p>
              <p className="font-sans text-sm text-brand-primary/60 leading-relaxed mb-8">
                Checkout happens on Tukiio. You’ll receive a digital pass with QR verification at the door.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Selcom', 'Airtel Money', 'HaloPesa', 'Mastercard'].map((method) => (
                  <span
                    key={method}
                    className="px-4 py-2 rounded-full border border-brand-outline/40 font-typewriter text-[8px] uppercase tracking-[0.3em] text-brand-primary/45 bg-white/50"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Capacity', value: 'Limited' },
                { label: 'Eligibility', value: 'Students' },
                { label: 'Format', value: 'Digital QR' },
                { label: 'Price', value: 'TZS 30K' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 border-t border-white/15 overflow-hidden group hover:border-brand-secondary/50 transition-colors"
                >
                  <MaskReveal>
                    <span className="font-typewriter text-[8px] uppercase tracking-[0.4em] text-white/30 block mb-2">
                      {stat.label}
                    </span>
                    <span className="font-title text-xl font-black uppercase text-white group-hover:text-brand-secondary transition-colors">
                      {stat.value}
                    </span>
                  </MaskReveal>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                to="/agenda"
                className="flex-1 text-center py-4 rounded-full border border-white/20 font-typewriter text-[9px] uppercase tracking-[0.35em] text-white/70 hover:border-brand-secondary hover:text-brand-secondary transition-all"
              >
                View Agenda
              </Link>
              <Link
                to="/faq"
                className="flex-1 text-center py-4 rounded-full bg-brand-secondary/20 border border-brand-secondary/40 font-typewriter text-[9px] uppercase tracking-[0.35em] text-brand-secondary hover:bg-brand-secondary hover:text-white transition-all"
              >
                Read FAQ
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <section className="relative z-10 border-y border-white/10 py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-16 font-typewriter text-[9px] uppercase tracking-[0.6em] text-white/25">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex gap-16 shrink-0 items-center">
              <span>Tickets launching soon</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
              <span>Students only</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
              <span>June 14 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
              <span>Borrowed time — don&apos;t wait</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
            </span>
          ))}
        </div>
      </section>

      {/* Bottom CTA band */}
      <section className="relative z-10 py-32 px-6 md:px-16 text-center">
        <MaskReveal>
          <p className="font-editorial text-3xl md:text-5xl italic text-white/40 max-w-2xl mx-auto leading-tight mb-10">
            &ldquo;The clock is already running. Your seat is being held in the queue.&rdquo;
          </p>
        </MaskReveal>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/15 bg-white/5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary" />
          </span>
          <span className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-white/60">
            Sales activate shortly — check back
          </span>
        </motion.div>
      </section>
    </div>
  );
}
