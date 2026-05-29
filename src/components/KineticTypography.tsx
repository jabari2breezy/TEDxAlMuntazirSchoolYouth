import { motion } from 'motion/react';
import { ReactNode } from 'react';

/* ── Luxury ease curve used everywhere ── */
export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;
export const LUXURY_DURATION = 0.85;

/* ── Masked Text Reveal — characters slide up from below ── */
export function MaskedReveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'span',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '110%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-5%' }}
        transition={{
          duration: LUXURY_DURATION,
          delay,
          ease: LUXURY_EASE,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ── Kinetic Hover Text — tracking expands on hover ── */
export function KineticHover({
  children,
  className = '',
  href,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}) {
  const Tag = href ? 'a' : 'button';
  return (
    <motion.span
      className={`inline-block cursor-pointer ${className}`}
      whileHover={{ letterSpacing: '0.08em', scale: 1.02 }}
      transition={{ duration: 0.3, ease: LUXURY_EASE }}
    >
      <Tag href={href} onClick={onClick} className="inherit-color">
        {children}
      </Tag>
    </motion.span>
  );
}

/* ── Stagger Container — children enter sequentially ── */
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-5%' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Stagger Item — wraps children with fade-up ── */
export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: LUXURY_DURATION,
            ease: LUXURY_EASE,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Micro Tag — editorial metadata labels ── */
export function MicroTag({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/25">
        {label}
      </span>
      <div className="h-px w-4 bg-white/10" />
      <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/40">
        {value}
      </span>
    </div>
  );
}

/* ── Index Number — '01', '02', etc. ── */
export function IndexNumber({
  number,
  className = '',
}: {
  number: number | string;
  className?: string;
}) {
  return (
    <span className={`font-title text-[10px] md:text-[11px] font-black text-white/20 tracking-tighter ${className}`}>
      {String(number).padStart(2, '0')}
    </span>
  );
}

/* ── Structural Line ── */
export function StructuralLine({
  orientation = 'horizontal',
  className = '',
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <div
      className={`${
        orientation === 'horizontal'
          ? 'h-px w-full bg-white/8'
          : 'w-px h-full bg-white/8'
      } ${className}`}
    />
  );
}

/* ── Section Header — editorial style ── */
export function SectionHeader({
  tag,
  title,
  subtitle,
  index,
  className = '',
}: {
  tag?: string;
  title: string;
  subtitle?: string;
  index?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        {index !== undefined && <IndexNumber number={index} />}
        {tag && (
          <span className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/30">
            {tag}
          </span>
        )}
        <StructuralLine className="flex-1" />
      </div>
      <div className="overflow-hidden">
        <MaskedReveal>
          <h2 className="font-title text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[0.85]">
            {title}
          </h2>
        </MaskedReveal>
      </div>
      {subtitle && (
        <MaskedReveal delay={0.1}>
          <p className="font-editorial italic text-base md:text-lg text-white/40">
            {subtitle}
          </p>
        </MaskedReveal>
      )}
    </div>
  );
}
