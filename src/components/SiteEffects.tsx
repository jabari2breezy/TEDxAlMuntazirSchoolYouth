import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

/* ── Magnetic Button — pulls toward cursor on hover ── */
export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  href,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);

  const reset = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  const Tag = href ? 'a' : 'button';

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="inline-block"
    >
      <Tag
        href={href}
        onClick={onClick}
        className={`inline-block ${className}`}
      >
        {children}
      </Tag>
    </motion.div>
  );
}

/* ── Text Scramble — characters shuffle on hover ── */
export function TextScramble({
  text,
  className = '',
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const startScramble = () => {
    let iteration = 0;
    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (i < iteration) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      if (iteration >= text.length) clearInterval(intervalRef.current!);
      iteration += 1 / 3;
    }, 30);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current!);
    setDisplay(text);
  };

  return (
    <Tag
      className={className}
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
    >
      {display}
    </Tag>
  );
}

/* ── Smooth Counter — animates number from 0 to target ── */
export function SmoothCounter({
  target,
  duration = 2,
  className = '',
  suffix = '',
}: {
  target: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  return (
    <motion.span
      className={className}
      onViewportEnter={() => {
        if (started.current) return;
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = (Date.now() - start) / 1000;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
      viewport={{ once: true, margin: '-20%' }}
    >
      {count}{suffix}
    </motion.span>
  );
}

/* ── Reveal Line — horizontal line draws itself on scroll ── */
export function RevealLine({
  className = '',
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: LUXURY_EASE }}
      className={`h-px bg-brand-outline origin-left ${className}`}
    />
  );
}
