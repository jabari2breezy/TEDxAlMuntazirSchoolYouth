import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  text?: string;
  className?: string;
}

export default function ScrollIndicator({ 
  text = "Scroll to Explore", 
  className = "" 
}: ScrollIndicatorProps) {
  return (
    <motion.div 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-white/60">
        {text}
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={24} className="text-brand-secondary" />
      </motion.div>
    </motion.div>
  );
}
