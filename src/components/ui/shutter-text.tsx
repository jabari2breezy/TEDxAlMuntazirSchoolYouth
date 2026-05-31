"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ShutterTextProps {
  text?: string;
  className?: string;
  /** Tailwind text size class for each character */
  sizeClass?: string;
}

/**
 * ShutterText — cinematic slice-reveal animation for hero text.
 * Each character gets three overlapping slice layers that wipe across
 * on mount (and on re-trigger), creating a premium shutter camera effect.
 */
export default function ShutterText({
  text = "TEDx AL MUNTAZIR",
  className = "",
  sizeClass = "text-[clamp(2rem,6vw,5.5rem)]",
}: ShutterTextProps) {
  const [count, setCount] = useState(0);
  const characters = text.split("");

  return (
    <div className={`relative flex flex-col items-center justify-center w-full ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          className="flex flex-wrap justify-center items-center w-full"
        >
          {characters.map((char, i) => (
            <div key={i} className="relative overflow-hidden" style={{ padding: '0 0.05em' }}>
              {/* Main character */}
              <motion.span
                initial={{ opacity: 0, filter: "blur(12px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: i * 0.032 + 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`font-title font-black tracking-tighter uppercase leading-none text-white ${sizeClass}`}
                style={{ display: 'block' }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>

              {/* Slice 1 — top third, sweeps left→right */}
              <motion.span
                initial={{ x: "-110%", opacity: 0 }}
                animate={{ x: "110%", opacity: [0, 1, 0] }}
                transition={{ duration: 0.55, delay: i * 0.032, ease: "easeInOut" }}
                className={`absolute inset-0 font-title font-black tracking-tighter uppercase leading-none text-brand-secondary pointer-events-none z-10 ${sizeClass}`}
                style={{ clipPath: "polygon(0 0,100% 0,100% 33%,0 33%)", display: 'block' }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>

              {/* Slice 2 — middle third, sweeps right→left */}
              <motion.span
                initial={{ x: "110%", opacity: 0 }}
                animate={{ x: "-110%", opacity: [0, 1, 0] }}
                transition={{ duration: 0.55, delay: i * 0.032 + 0.08, ease: "easeInOut" }}
                className={`absolute inset-0 font-title font-black tracking-tighter uppercase leading-none text-white/80 pointer-events-none z-10 ${sizeClass}`}
                style={{ clipPath: "polygon(0 33%,100% 33%,100% 66%,0 66%)", display: 'block' }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>

              {/* Slice 3 — bottom third, sweeps left→right */}
              <motion.span
                initial={{ x: "-110%", opacity: 0 }}
                animate={{ x: "110%", opacity: [0, 1, 0] }}
                transition={{ duration: 0.55, delay: i * 0.032 + 0.16, ease: "easeInOut" }}
                className={`absolute inset-0 font-title font-black tracking-tighter uppercase leading-none text-brand-secondary pointer-events-none z-10 ${sizeClass}`}
                style={{ clipPath: "polygon(0 66%,100% 66%,100% 100%,0 100%)", display: 'block' }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
