import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Detect mobile once at module level to avoid repeated checks
const isMobile = typeof window !== 'undefined' &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Detect if current page is one of the dark, cinematic pages
  const isDarkPage = ['/theme', '/agenda', '/tickets'].includes(location.pathname);

  const inputX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const inputY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const { scrollYProgress } = useScroll();
  // On mobile we skip the heavy spring computation
  const smoothY = isMobile
    ? scrollYProgress
    : useSpring(scrollYProgress, { stiffness: 80, damping: 30 });

  useEffect(() => {
    if (isMobile) return; // Skip ALL pointer/tilt listeners on mobile

    const handleMouseMove = (e: MouseEvent) => {
      inputX.set(e.clientX);
      inputY.set(e.clientY);
    };
    const handleResize = () => {
      inputX.set(window.innerWidth / 2);
      inputY.set(window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [inputX, inputY]);

  // Spotlight (desktop only — zero cost on mobile)
  const spotlightX = useSpring(inputX, { stiffness: 30, damping: 25 });
  const spotlightY = useSpring(inputY, { stiffness: 30, damping: 25 });

  // Scroll-driven background tint (adjusted for light or dark mode)
  const bgGradient = useTransform(
    smoothY,
    [0, 0.45, 1],
    isDarkPage ? [
      'radial-gradient(circle at 0% 0%, rgba(0,109,56,0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(0,8,57,0.2) 0%, transparent 50%)',
      'radial-gradient(circle at 50% 50%, rgba(0,109,56,0.1) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(0,8,57,0.25) 0%, transparent 50%)',
      'radial-gradient(circle at 100% 0%, rgba(0,109,56,0.2) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(0,8,57,0.3) 0%, transparent 50%)',
    ] : [
      'radial-gradient(circle at 0% 0%, rgba(0,109,56,0.07) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(0,8,57,0.08) 0%, transparent 50%)',
      'radial-gradient(circle at 50% 50%, rgba(0,109,56,0.04) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(0,8,57,0.12) 0%, transparent 50%)',
      'radial-gradient(circle at 100% 0%, rgba(0,109,56,0.1) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(0,8,57,0.16) 0%, transparent 50%)',
    ]
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ background: bgGradient }}
      className={`fixed inset-0 pointer-events-none z-[-1] overflow-hidden transition-colors duration-700 ${isDarkPage ? 'bg-[#050507]' : 'bg-brand-background'}`}
    >
      {/* Desktop spotlight */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 z-10 opacity-[0.25]"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) =>
                `radial-gradient(circle 350px at ${x}px ${y}px, ${isDarkPage ? 'rgba(0,109,56,0.12)' : 'rgba(0,109,56,0.08)'}, transparent 80%)`
            ),
          }}
        />
      )}

      {/* Fluid blobs — desktop only, GPU-composited */}
      {!isMobile && (
        <div className="absolute inset-0 blur-[100px] opacity-[0.15]" style={{ willChange: 'transform' }}>
          <motion.div
            animate={{ x: [0, 80, -40, 0], y: [0, -40, 80, 0], scale: [1, 1.15, 0.9, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[20%] -left-[10%] w-[55%] h-[55%] rounded-full bg-brand-primary"
            style={{ willChange: 'transform' }}
          />
          <motion.div
            animate={{ x: [0, -60, 30, 0], y: [0, 100, -50, 0], scale: [1.1, 0.85, 1.15, 1.1] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[40%] -right-[10%] w-[45%] h-[45%] rounded-full bg-brand-secondary"
            style={{ willChange: 'transform' }}
          />
        </div>
      )}

      {/* Mobile: simple static gradient — zero JS cost */}
      {isMobile && (
        <div className="absolute inset-0 opacity-[0.12]"
          style={{
            background: isDarkPage
              ? 'radial-gradient(circle at 20% 20%, rgba(0,109,56,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,8,57,0.25) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 20%, rgba(0,109,56,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,8,57,0.4) 0%, transparent 50%)'
          }}
        />
      )}

      {/* Dot grid */}
      <div
        className="absolute inset-0 z-[5] opacity-[0.025]"
        style={{
          backgroundImage: isDarkPage
            ? 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)'
            : 'radial-gradient(circle, #000839 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </motion.div>
  );
}
