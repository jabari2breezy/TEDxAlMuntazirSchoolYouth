import { motion } from 'motion/react';

interface StructuralForegroundProps {
  image?: string;
  segmentColor?: string;
}

/** Layer 3 — architectural frame that sits in front of typography */
export default function StructuralForeground({ image, segmentColor = '#006d38' }: StructuralForegroundProps) {
  return (
    <div className="relative w-full max-w-md md:max-w-xl aspect-[3/4] mx-auto" style={{ perspective: '1200px' }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: [-6, 6, -6], rotateX: [2, -2, 2] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Outer structural ring */}
        <svg
          viewBox="0 0 400 520"
          className="absolute inset-0 w-full h-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
          aria-hidden
        >
          <defs>
            <linearGradient id="structGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={segmentColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000839" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <motion.path
            d="M200 20 L360 120 L360 400 L200 500 L40 400 L40 120 Z"
            fill="none"
            stroke="url(#structGrad)"
            strokeWidth="2.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
          />
          <path d="M200 60 L320 140 L320 380 L200 460 L80 380 L80 140 Z" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.25" />
          <line x1="200" y1="20" x2="200" y2="500" stroke="white" strokeWidth="0.5" strokeOpacity="0.12" />
          <line x1="40" y1="260" x2="360" y2="260" stroke="white" strokeWidth="0.5" strokeOpacity="0.12" />
        </svg>

        {/* Speaker portrait — masks typography behind */}
        <div
          className="absolute inset-[12%] overflow-hidden rounded-sm"
          style={{
            transform: 'translateZ(48px)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {image ? (
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover object-top scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-brand-primary/80 to-brand-secondary/60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/80 via-transparent to-transparent" />
        </div>

        {/* Floating depth slabs */}
        <div
          className="absolute -right-6 top-1/4 w-16 h-32 border border-white/20 bg-white/5 backdrop-blur-md"
          style={{ transform: 'translateZ(72px) rotateY(-18deg)' }}
        />
        <div
          className="absolute -left-4 bottom-1/4 w-12 h-24 border border-white/15 bg-brand-primary/30"
          style={{ transform: 'translateZ(56px) rotateY(14deg)' }}
        />
      </motion.div>
    </div>
  );
}
