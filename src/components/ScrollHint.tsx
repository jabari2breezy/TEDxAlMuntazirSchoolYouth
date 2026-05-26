import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { smoothScrollTo } from '../lib/smoothScroll';

interface ScrollHintProps {
  show: boolean;
  target?: string | HTMLElement;
  label?: string;
  className?: string;
  delay?: number;
}

export default function ScrollHint({
  show,
  target,
  label = 'Scroll',
  className = '',
  delay = 0,
}: ScrollHintProps) {
  const handleClick = () => {
    if (target) {
      smoothScrollTo(target, { offset: -24, duration: 1.5 });
    } else {
      smoothScrollTo(window.innerHeight * 0.92, { duration: 1.5 });
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
      transition={{ duration: 0.65, delay, ease: [0.25, 1, 0.5, 1] }}
      className={`absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/50 rounded-full px-4 py-2 ${className} ${
        show ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-label={label}
    >
      <span className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-[0.45em] text-brand-primary/45 group-hover:text-brand-secondary transition-colors">
        {label}
      </span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary/15 bg-white/40 backdrop-blur-md group-hover:border-brand-secondary/40 group-hover:bg-brand-secondary/10 transition-colors"
      >
        <ChevronDown
          size={18}
          className="text-brand-primary/50 group-hover:text-brand-secondary transition-colors"
          strokeWidth={2}
        />
      </motion.span>
    </motion.button>
  );
}
