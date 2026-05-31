import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    const ctx = gsap.context(() => {
      // Simple fade in
      gsap.set(".pl-content", { opacity: 0, y: 20 });
      
      gsap.to(".pl-content", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Progress bar
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate() {
          const el = document.querySelector(".pl-count");
          if (el) el.textContent = Math.round(counter.val).toString().padStart(3, "0");
          const bar = document.querySelector(".pl-progress-bar") as HTMLElement;
          if (bar) gsap.set(bar, { scaleX: counter.val / 100 });
        },
      });

      // Exit animation
      const tl = gsap.timeline();
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.in",
        delay: 1.3,
      });

      tl.call(
        () => {
          onComplete();
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
          document.body.style.position = "";
          document.body.style.width = "";
          setIsMounted(false);
        },
        [],
        "+=0.1"
      );
    }, containerRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050507]"
    >
      <div className="pl-content flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="font-title font-black text-6xl md:text-8xl uppercase tracking-tighter text-white">
            TED<span className="text-brand-secondary">x</span>
          </h1>
          <p className="font-typewriter text-xs uppercase tracking-[0.5em] text-white/40 mt-2">
            Al Muntazir Youth
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24 h-[1px] bg-white/20 relative overflow-hidden">
            <div className="pl-progress-bar absolute inset-0 bg-brand-secondary h-full" />
          </div>
          <span className="pl-count font-typewriter text-sm text-white/60 tabular-nums">
            000
          </span>
          <span className="font-typewriter text-xs text-white/30">%</span>
        </div>
      </div>
    </div>
  );
}
