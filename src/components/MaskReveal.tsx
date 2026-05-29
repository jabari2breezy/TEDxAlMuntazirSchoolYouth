import { motion } from 'motion/react';
import React from 'react';

interface MaskRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const revealEase = [0.16, 1, 0.3, 1] as const;

export default function MaskReveal({ children, delay = 0, className = '' }: MaskRevealProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, margin: '-5%' }}
        transition={{ delay, duration: 0.85, ease: revealEase }}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
