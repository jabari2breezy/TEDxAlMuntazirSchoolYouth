import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'tedx' | 'school';
  theme?: 'dark' | 'light';
}

export default function Logo({ className = '', variant = 'tedx', theme = 'light' }: LogoProps) {
  const subTextColor = theme === 'dark' ? 'text-white' : 'text-[#000839]';

  if (variant === 'tedx') {
    return (
      <div className={`flex items-end gap-1 ${className}`}>
        <div className="flex items-baseline font-sans font-black tracking-tighter leading-none text-[32px] md:text-[40px]">
          <span className="text-[#e62b1e]">TED</span>
          <span className="text-[#e62b1e] text-[0.8em] ml-[1px]">x</span>
        </div>
        <div className={`font-sans font-normal tracking-tight pb-[3px] md:pb-[4px] leading-none text-[15px] md:text-[19px] ${subTextColor}`}>
          Al Muntazir<br />Schools Youth
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 md:gap-4 ${className} ${subTextColor}`}>
      <svg width="40" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 md:w-12 h-auto flex-shrink-0">
        <path d="M5 25 Q 30 35 50 60 Q 70 35 95 25 L 95 35 Q 70 45 50 70 Q 30 45 5 35 Z" fill="#000839" />
        <path d="M5 45 Q 30 55 50 80 Q 70 55 95 45 L 95 55 Q 70 65 50 90 Q 30 65 5 55 Z" fill="#006d38" />
      </svg>

      <div className="w-[1.5px] h-8 md:h-10 bg-current opacity-30" />

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
