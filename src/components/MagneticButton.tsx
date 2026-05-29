import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? 'a' : 'div';

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={`inline-block ${className}`}
    >
      <Tag
        href={href}
        onClick={onClick}
        className="inline-block"
        {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
