import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface PrecisionButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'light' | 'dark' | 'outline';
}

export default function PrecisionButton({
  children,
  to,
  href,
  target,
  rel,
  onClick,
  className = '',
  disabled = false,
  variant = 'light',
}: PrecisionButtonProps) {
  const [active, setActive] = useState(false);
  const [coord, setCoord] = useState('00.00');
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (active) {
      let tick = 0;
      intervalRef.current = setInterval(() => {
        tick += 1;
        const x = Math.floor(Math.random() * 99);
        const y = Math.floor(Math.random() * 99);
        setCoord(`${String(x).padStart(2, '0')}.${String(y).padStart(2, '0')}`);
        if (tick > 8) {
          clearInterval(intervalRef.current);
          setCoord('47.26');
        }
      }, 35);
    } else {
      clearInterval(intervalRef.current);
      setCoord('00.00');
    }
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const variants = {
    light: 'bg-white text-brand-primary hover:bg-brand-secondary hover:text-white border-white/20',
    dark: 'bg-brand-primary text-white hover:bg-brand-secondary border-brand-primary/20',
    outline: 'bg-transparent text-white border-white/30 hover:border-brand-secondary hover:text-brand-secondary',
  };

  const inner = (
    <motion.span
      className={`relative block rounded-full border font-typewriter text-[10px] uppercase tracking-[0.3em] transition-colors duration-500 ${variants[variant]} ${className}`}
      onHoverStart={() => !disabled && setActive(true)}
      onHoverEnd={() => setActive(false)}
      onTapStart={() => !disabled && setActive(true)}
      onTap={() => setActive(false)}
      animate={{ padding: active ? '16px 44px' : '20px 48px' }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      style={{ willChange: 'transform, padding' }}
    >
      {children}
      <motion.span
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-typewriter text-[7px] tracking-[0.4em] text-brand-secondary/60 whitespace-nowrap"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        [{coord}]
      </motion.span>
    </motion.span>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block interactive" onClick={onClick}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block interactive" onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} onClick={onClick} className="inline-block interactive disabled:opacity-50 disabled:cursor-not-allowed">
      {inner}
    </button>
  );
}
