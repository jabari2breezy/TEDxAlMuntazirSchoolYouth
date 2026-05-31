"use client";
import React from "react";
import { motion } from "motion/react";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 10 * position} -${189 + i * 12}C-${380 - i * 10 * position} -${189 + i * 12} -${312 - i * 10 * position} ${216 - i * 12} ${152 - i * 10 * position} ${343 - i * 12}C${616 - i * 10 * position} ${470 - i * 12} ${684 - i * 10 * position} ${875 - i * 12} ${684 - i * 10 * position} ${875 - i * 12}`,
    color: `rgba(0,109,56,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.04,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.15 + path.id * 0.025}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={{
              pathLength: 1,
              opacity: [0.35, 0.7, 0.35],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + (path.id % 5) * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
