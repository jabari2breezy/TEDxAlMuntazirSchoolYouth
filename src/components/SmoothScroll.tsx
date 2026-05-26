import { useEffect } from 'react';
import Lenis from 'lenis';

const MOBILE_BREAKPOINT = 768;

export default function SmoothScroll() {
  useEffect(() => {
  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  let lenis: Lenis | null = null;
  let rafId = 0;

  const startLenis = () => {
    if (lenis || mediaQuery.matches) return;

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.6,
      infinite: false,
    });

    window.__lenis = lenis;
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);
  };

  const stopLenis = () => {
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
    delete window.__lenis;
    document.documentElement.classList.remove('lenis', 'lenis-smooth');
  };

  const handleBreakpointChange = (event: MediaQueryListEvent | MediaQueryList) => {
    if (event.matches) {
      stopLenis();
    } else {
      startLenis();
    }
  };

  handleBreakpointChange(mediaQuery);
  mediaQuery.addEventListener('change', handleBreakpointChange);

  return () => {
    mediaQuery.removeEventListener('change', handleBreakpointChange);
    stopLenis();
  };
  }, []);

  return null;
}
