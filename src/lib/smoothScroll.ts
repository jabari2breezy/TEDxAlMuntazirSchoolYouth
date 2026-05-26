declare global {
  interface Window {
    __lenis?: {
      scrollTo: (
        target: number | string | HTMLElement,
        options?: { offset?: number; duration?: number; immediate?: boolean }
      ) => void;
    };
  }
}

export function smoothScrollTo(
  target: number | string | HTMLElement,
  options?: { offset?: number; duration?: number }
) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: options?.duration ?? 1.35, ...options });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }

  const el =
    typeof target === 'string'
      ? document.querySelector(target)
      : target;

  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
