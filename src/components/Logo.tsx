import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'tedx' | 'school';
  theme?: 'dark' | 'light';
}

export default function Logo({ className = '', variant = 'tedx', theme = 'light' }: LogoProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#000839]';

  if (variant === 'tedx') {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-baseline leading-none">
          <span className="text-red-600 font-title font-black text-4xl md:text-5xl tracking-tighter">TED</span>
          <span className="text-red-600 font-title font-black text-2xl md:text-3xl tracking-tighter">x</span>
        </div>
        <div className="flex flex-col -mt-1">
          <span className={`font-sans font-bold text-[12px] md:text-[14px] uppercase tracking-widest ${textColor}`}>AlMuntazir Schools</span>
          <span className={`font-sans font-semibold text-[10px] md:text-[11px] uppercase tracking-[0.3em] italic -mt-0.5 ${textColor}`}>Youth</span>
          <span className="font-typewriter text-[7px] uppercase tracking-[0.2em] text-brand-primary/40 mt-1.5">independently organized event</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 md:gap-4 ${className} ${textColor}`}>
      {/* School Vector Logo */}
      <svg width="40" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 md:w-12 h-auto flex-shrink-0">
        <path d="M5 25 Q 30 35 50 60 Q 70 35 95 25 L 95 35 Q 70 45 50 70 Q 30 45 5 35 Z" fill="currentColor" />
        <path d="M5 45 Q 30 55 50 80 Q 70 55 95 45 L 95 55 Q 70 65 50 90 Q 30 65 5 55 Z" fill="#006d38" />
      </svg>
      
      {/* Separator */}
      <div className="w-[1.5px] h-8 md:h-10 bg-current opacity-30" />

      {/* Text */}
      <div className="flex flex-col justify-center pt-1">
        <span className="font-sans font-bold text-[9px] md:text-[11px] leading-none text-current tracking-widest">
          AL MUNTAZIR ISLAMIC
        </span>
        <span className="font-sans font-bold text-[9px] md:text-[11px] leading-tight text-current tracking-widest mt-1">
          INTERNATIONAL SCHOOL
        </span>
      </div>
    </div>
  );
}
