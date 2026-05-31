import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function FloatingCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'text'>('default');
  const isCoarsePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  // Ultra-smooth buttery spring config
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isCoarsePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, .interactive');
      const text = target.closest('h1, h2, h3, p, span');

      if (interactive) {
        setHoverType('button');
      } else if (text) {
        setHoverType('text');
      } else {
        setHoverType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isCoarsePointer, mouseX, mouseY]);

  return (
    <>
      {/* 
        The Inverted Magnetic Blob 
        mix-blend-difference on a pure white circle creates an X-Ray inversion effect
      */}
      <motion.div 
        className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="bg-white rounded-full flex items-center justify-center"
          animate={{
            width: hoverType === 'button' ? 80 : hoverType === 'text' ? 120 : 40,
            height: hoverType === 'button' ? 80 : hoverType === 'text' ? 120 : 40,
            scale: hoverType === 'button' ? 1.2 : 1,
            opacity: hoverType === 'text' ? 0.3 : 1
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.8 }}
        >
          {/* Subtle inner dot for precision */}
          <motion.div 
            className="w-1 h-1 bg-black rounded-full"
            animate={{
              opacity: hoverType === 'default' ? 1 : 0
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
