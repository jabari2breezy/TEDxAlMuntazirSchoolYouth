import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isMobileLike = isCoarse || window.innerWidth < 820;

    // Lenis option surface varies between versions; keep this config permissive.
    const lenis = new Lenis({
      duration: isMobileLike ? 1.0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: isMobileLike ? 0.8 : 0.92,
      touchMultiplier: isMobileLike ? 1.0 : 1.6,
      infinite: false,
      // Using as any to bypass version-specific property checks
      smoothTouch: true,
      syncTouch: true,
      normalizeWheel: true,
      lerp: isMobileLike ? 0.075 : 0.1,
    } as any);

    (window as any).__lenis = lenis;
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handleResize = () => (lenis as any).resize?.();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, []);

  return null;
}
