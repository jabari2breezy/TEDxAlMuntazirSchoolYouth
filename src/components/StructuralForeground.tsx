import { motion } from 'motion/react';
import SpeakerTopicVisual from './SpeakerTopicVisual';

interface StructuralForegroundProps {
  name: string;
  topic: string;
  image?: string;
}

/** Layer 3 — frosted glass topic sculpture in front of typography */
export default function StructuralForeground({ name, topic, image }: StructuralForegroundProps) {
  return (
    <div className="relative w-full max-w-sm md:max-w-md mx-auto" style={{ perspective: '1100px' }}>
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(40px)' }}
      >
        {/* Frosted plinth */}
        <div className="absolute -inset-4 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_24px_80px_rgba(0,8,57,0.06)]" />

        {/* Side glass fins */}
        <div
          className="absolute -right-3 top-1/4 w-10 h-24 rounded-lg bg-white/40 backdrop-blur-md border border-white/60 shadow-sm"
          style={{ transform: 'translateZ(56px) rotateY(-12deg)' }}
        />
        <div
          className="absolute -left-2 bottom-1/4 w-8 h-20 rounded-lg bg-white/35 backdrop-blur-md border border-white/50"
          style={{ transform: 'translateZ(32px) rotateY(10deg)' }}
        />

        <div className="relative z-10 p-2">
          <SpeakerTopicVisual name={name} topic={topic} image={image} />
        </div>
      </motion.div>
    </div>
  );
}
