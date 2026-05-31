import { motion } from 'motion/react';

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 pointer-events-none"
    >
      <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/50">
        Scroll
      </span>
      <div className="relative w-5 h-8">
        <div className="absolute inset-0 border border-white/30 rounded-full" />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 bg-white/60 rounded-full"
        />
      </div>
    </motion.div>
  );
}
