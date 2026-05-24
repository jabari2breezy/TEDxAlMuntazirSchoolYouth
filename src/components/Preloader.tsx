import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
  borrowedTimeRef: React.RefObject<HTMLElement | null>;
  mainTitleRef: React.RefObject<HTMLElement | null>;
}

export default function Preloader({ onComplete, borrowedTimeRef, mainTitleRef }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const bluePanelRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !bluePanelRef.current || !clusterRef.current) return;

    let gsapCtx: gsap.Context | null = null;

    const frame = requestAnimationFrame(() => {
      const cluster = clusterRef.current!;
      const target = borrowedTimeRef.current;
      let morphX = 0;
      let morphY = 0;
      let morphScale = 0.35;

      if (target) {
        const clusterRect = cluster.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        morphScale =
          Math.min(targetRect.width / clusterRect.width, targetRect.height / clusterRect.height) *
          0.92;
        morphX =
          targetRect.left + targetRect.width / 2 - (clusterRect.left + clusterRect.width / 2);
        morphY =
          targetRect.top + targetRect.height / 2 - (clusterRect.top + clusterRect.height / 2);
      }

      if (mainTitleRef.current) {
        gsap.set(mainTitleRef.current, { y: 72, opacity: 0 });
      }

      gsapCtx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsMounted(false);
            onComplete();
          },
        });

        gsap.to('.loading-percentage', {
          innerHTML: 100,
          duration: 2.2,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          onUpdate: function () {
            const targets = this.targets();
            if (targets[0]) targets[0].innerHTML = Math.round(Number(targets[0].innerHTML)) + '%';
          },
        });

        tl.from('.hero-text-anim', {
          yPercent: 120,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.1,
        })
          .to(
            bluePanelRef.current,
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.2,
              ease: 'power4.inOut',
            },
            '-=0.6'
          )
          .from(
            '.data-string',
            {
              yPercent: 100,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
            },
            '-=0.8'
          )
          .to(
            cluster,
            {
              x: morphX,
              y: morphY,
              scale: morphScale,
              duration: 1.35,
              ease: 'power4.inOut',
            },
            '+=0.35'
          )
          .to(
            bluePanelRef.current,
            { opacity: 0, duration: 0.9, ease: 'power2.inOut' },
            '-=0.85'
          )
          .to('#preloader-base-layer', { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.75')
          .to(
            mainTitleRef.current,
            { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
            '-=0.55'
          )
          .fromTo(
            '.hero-text-reveal',
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.09,
              duration: 0.85,
              ease: 'power3.out',
            },
            '-=0.85'
          )
          .to(
            containerRef.current,
            {
              opacity: 0,
              duration: 0.65,
              ease: 'power2.inOut',
              pointerEvents: 'none',
            },
            '+=0.55'
          );
      }, containerRef);
    });

    return () => {
      cancelAnimationFrame(frame);
      gsapCtx?.revert();
    };
  }, [onComplete, borrowedTimeRef, mainTitleRef]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      id="preloader-overlay"
      className="fixed inset-0 z-[9999] bg-[#050507] overflow-hidden flex flex-col justify-center pointer-events-auto"
    >
      <div
        id="preloader-base-layer"
        className="absolute inset-0 flex flex-col justify-center px-6 md:px-24 pointer-events-none"
      >
        <div ref={clusterRef} id="preloader-morph-cluster" className="will-change-transform">
          <div className="overflow-hidden">
            <h1 className="hero-text-anim text-[16vw] md:text-[14vw] font-title font-black uppercase text-white leading-[0.8] tracking-tighter">
              BORROWED
            </h1>
          </div>
          <div className="overflow-hidden flex justify-end">
            <h1 className="hero-text-anim text-[16vw] md:text-[14vw] font-title font-black uppercase text-brand-secondary leading-[0.8] tracking-tighter">
              TIME
            </h1>
          </div>
        </div>
      </div>

      <div
        ref={bluePanelRef}
        className="absolute inset-0 bg-brand-primary flex flex-col justify-center px-6 md:px-24 overflow-hidden pointer-events-none will-change-transform"
        style={{ clipPath: 'inset(0% 100% 0% 0%)' }}
      >
        <div className="absolute top-12 right-12 md:right-24 overflow-hidden">
          <span className="data-string block font-typewriter text-xs tracking-widest text-white/50 uppercase">
            DAR ES SALAAM / 2026
          </span>
        </div>
        <div className="absolute bottom-12 left-12 md:left-24 overflow-hidden">
          <span className="data-string loading-percentage block font-typewriter text-4xl font-bold tracking-widest text-white">
            0%
          </span>
        </div>

        <div className="overflow-hidden">
          <h1 className="text-[16vw] md:text-[14vw] font-title font-black uppercase text-white leading-[0.8] tracking-tighter">
            BORROWED
          </h1>
        </div>
        <div className="overflow-hidden flex justify-end">
          <h1 className="text-[16vw] md:text-[14vw] font-title font-black uppercase text-[#0c1012] leading-[0.8] tracking-tighter">
            TIME
          </h1>
        </div>
      </div>
    </div>
  );
}
