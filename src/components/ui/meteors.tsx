import React, { useRef, useEffect, useMemo } from "react";

interface MeteorProps {
  number?: number;
  className?: string;
}

export const Meteors: React.FC<MeteorProps> = ({ number = 20, className = "" }) => {
  const meteors = useMemo(() =>
    Array.from({ length: number }, (_, i) => ({
      id: i,
      left: Math.floor(Math.random() * (400 - -400) + -400),
      delay: (Math.random() * (0.8 - 0.2) + 0.2).toFixed(2),
      duration: Math.floor(Math.random() * (10 - 2) + 2),
    })),
    [number]
  );

  return (
    <>
      {meteors.map((m) => (
        <span
          key={m.id}
          className={`animate-meteor absolute top-0 h-0.5 w-0.5 rounded-full rotate-[215deg] ${className}`}
          style={{
            left: m.left + "px",
            animationDelay: m.delay + "s",
            animationDuration: m.duration + "s",
            background: "rgba(0,109,56,0.6)",
            boxShadow: "0 0 0 1px rgba(0,109,56,0.1)",
          }}
        >
          <span
            style={{
              content: "''",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50px",
              height: "1px",
              background: "linear-gradient(to right, rgba(0,109,56,0.8), transparent)",
            }}
          />
        </span>
      ))}
    </>
  );
};
