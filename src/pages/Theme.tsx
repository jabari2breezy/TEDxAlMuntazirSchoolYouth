import { useRef, type ComponentType } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Clock, MoveRight, Orbit, Sparkles, Zap } from 'lucide-react';
import { TICKETS_URL } from '../constants';

const EASE = [0.16, 1, 0.3, 1] as const;

function KineticStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-2xl">
      <p className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-white/35">{label}</p>
      <p className="mt-4 text-4xl md:text-6xl font-title font-black uppercase tracking-tighter">{value}</p>
      <p className="mt-4 font-sans text-sm md:text-base leading-relaxed text-white/55">{detail}</p>
    </div>
  );
}

function MotionCard({
  title,
  copy,
  icon: Icon,
}: {
  title: string;
  copy: string;
  icon: ComponentType<{ size?: number }>;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="rounded-[2rem] border border-white/10 bg-black/20 p-6 md:p-8 backdrop-blur-2xl shadow-[0_24px_90px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/15 text-brand-secondary">
          <Icon size={20} />
        </div>
        <h3 className="text-2xl md:text-3xl font-title font-black uppercase tracking-tighter">{title}</h3>
      </div>
      <p className="mt-5 font-editorial text-lg italic text-white/65 leading-relaxed">{copy}</p>
    </motion.div>
  );
}

export default function Theme() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 18, mass: 0.9 });

  const heroScale = useTransform(progress, [0, 0.22], [1, 0.96]);
  const heroY = useTransform(progress, [0, 0.24], [0, -60]);
  const orbitRotate = useTransform(progress, [0, 1], [0, 360]);
  const splitOpacity = useTransform(progress, [0.18, 0.3, 0.52], [0, 1, 1]);
  const splitX = useTransform(progress, [0.18, 0.3], [-28, 0]);
  const bottomOpacity = useTransform(progress, [0.52, 0.72, 1], [0, 1, 1]);

  return (
    <div ref={containerRef} className="relative bg-[#050507] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,109,56,0.13),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(255,255,255,0.05),transparent_28%),linear-gradient(180deg,#050507_0%,#070b12_55%,#040405_100%)]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[90vw] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8"
          style={{ rotate: orbitRotate }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[64vw] w-[64vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-secondary/20"
          style={{ rotate: useTransform(progress, [0, 1], [0, -360]) }}
        />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
      </div>

      <section className="min-h-screen sticky top-0 px-6 md:px-16">
        <motion.div
          style={{ scale: heroScale, y: heroY }}
          className="mx-auto flex h-screen max-w-screen-2xl items-center"
        >
          <div className="grid w-full gap-16 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div className="space-y-8">
              <p className="font-typewriter text-[10px] md:text-[11px] uppercase tracking-[0.8em] text-white/30">
                THEME / BORROWED TIME
              </p>
              <h1 className="text-[16vw] md:text-[10vw] font-title font-black uppercase leading-[0.76] tracking-tighter">
                BORROWED
                <span className="block text-brand-secondary italic font-editorial lowercase">Time.</span>
              </h1>
              <p className="max-w-2xl font-editorial text-xl md:text-3xl italic text-white/60 leading-relaxed">
                The page is designed as a slow, premium reveal: a central visual anchor, soft circular movement, and sections that glide into place rather than snapping in.
              </p>
              <div className="flex flex-wrap gap-3">
                {['fluid motion', 'editorial layout', 'scroll-linked atmosphere'].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-typewriter text-[9px] uppercase tracking-[0.35em] text-white/55">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <motion.div
                className="relative flex aspect-square w-[84vw] max-w-[560px] items-center justify-center"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="absolute inset-[14%] rounded-full border border-brand-secondary/25 bg-brand-secondary/8 backdrop-blur-2xl"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-[28%] rounded-full border border-white/10 bg-white/4 backdrop-blur-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <Orbit size={72} className="text-brand-secondary" />
                  <p className="font-typewriter text-[10px] uppercase tracking-[0.45em] text-white/40">
                    A single idea, turned into motion
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-24 md:py-40 px-6 md:px-16">
        <motion.div
          style={{ opacity: splitOpacity, x: splitX }}
          className="mx-auto max-w-screen-2xl"
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-center">
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary">
                  THE FLOW
                </p>
                <h2 className="text-5xl md:text-8xl font-title font-black uppercase tracking-tighter leading-[0.82]">
                  The movement
                  <span className="block text-white/50 italic font-editorial lowercase">does the explaining.</span>
                </h2>
                <p className="font-editorial text-xl md:text-2xl italic text-white/65 leading-relaxed">
                  Like the best award-site experiences, the copy, visuals, and spacing all work as one large motion system instead of separate blocks competing for attention.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <MotionCard
                  icon={Clock}
                  title="Slow reveal"
                  copy="The most important element emerges first, and the rest of the page responds to it."
                />
                <MotionCard
                  icon={Sparkles}
                  title="Cinematic polish"
                  copy="Every section uses motion to reinforce hierarchy rather than decorate it."
                />
              </div>
            </div>

            <div className="grid gap-4">
              <KineticStat
                label="Experience"
                value="Immersive"
                detail="The theme page now reads like a full-screen visual statement: dark, smooth, and deliberately paced."
              />
              <KineticStat
                label="Motion system"
                value="Orbital"
                detail="Circular movement, floating depth, and deliberate scroll-linked easing keep the page alive."
              />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 md:px-16 py-24 md:py-36">
        <div className="mx-auto max-w-screen-2xl grid gap-8 lg:grid-cols-3">
          <MotionCard
            icon={Zap}
            title="The pulse"
            copy="A premium rhythm of impact words, soft glows, and highly controlled transitions."
          />
          <MotionCard
            icon={MoveRight}
            title="The drift"
            copy="Objects slide in from the edges instead of appearing all at once, so the eye always has a next destination."
          />
          <MotionCard
            icon={ArrowUpRight}
            title="The call"
            copy="The CTA is positioned like a conclusion, not a generic button, so the final move feels earned."
          />
        </div>
      </section>

      <section className="px-6 md:px-16 pb-24 md:pb-40">
        <motion.div
          style={{ opacity: bottomOpacity }}
          className="mx-auto max-w-screen-2xl"
        >
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-2xl shadow-[0_40px_140px_rgba(0,0,0,0.4)]">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] items-end">
              <div className="max-w-4xl space-y-6">
                <p className="font-typewriter text-[10px] uppercase tracking-[0.8em] text-white/30">FINAL CTA</p>
                <h2 className="text-5xl md:text-[8vw] font-title font-black uppercase tracking-tighter leading-[0.82]">
                  Join the
                  <span className="block text-brand-secondary italic font-editorial lowercase">moment.</span>
                </h2>
                <p className="max-w-2xl font-editorial text-xl md:text-2xl italic text-white/65 leading-relaxed">
                  The theme page now ends with the same premium momentum it starts with: a clear visual system, meaningful movement, and an obvious next action.
                </p>
              </div>

              <motion.a
                href={TICKETS_URL}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-5 rounded-full bg-brand-secondary px-10 py-5 font-title text-xl font-black uppercase tracking-[0.25em] text-white shadow-[0_18px_50px_rgba(0,109,56,0.35)]"
              >
                Secure seat
                <ArrowUpRight size={20} />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
