import React, { useRef, useEffect, useMemo } from "react";

interface MeteorProps {
  number?: number;
  className?: string;
}

export const Meteors: React.FC<MeteorProps> = ({ number = 20, className = "" }) => {
  const meteors = useMemo(() =>
    Array.from({ length: number }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: (Math.random() * 8 + 0.1).toFixed(2),
      duration: (Math.random() * 4 + 2).toFixed(1),
      tailLength: Math.floor(Math.random() * 40) + 40,
    })),
    [number]
  );

  return (
    <>
      {meteors.map((m) => (
        <span
          key={m.id}
          className={`animate-meteor absolute h-0.5 w-0.5 rounded-full rotate-[215deg] ${className}`}
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            background: "rgba(0,109,56,0.75)",
            boxShadow: "0 0 2px 1px rgba(0,109,56,0.25)",
          }}
        >
          <span
            style={{
              content: "''",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              width: `${m.tailLength}px`,
              height: "1px",
              background: "linear-gradient(to right, rgba(0,109,56,0.9), transparent)",
            }}
          />
        </span>
      ))}
    </>
  );
};
