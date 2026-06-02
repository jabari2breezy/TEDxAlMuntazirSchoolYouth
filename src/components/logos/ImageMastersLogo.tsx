export default function ImageMastersLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Green dot */}
      <circle cx="148" cy="72" r="28" fill="#8BC34A" />
      {/* Purple 'im' shape */}
      <path
        d="M80 160 C80 120, 100 100, 130 100 C140 100, 145 105, 148 110
           L148 160 L170 160 L170 100 L195 100 L195 160
           C195 200, 170 220, 145 220 C120 220, 105 205, 105 190
           L125 190 C125 200, 135 208, 145 208 C158 208, 170 200, 170 185
           L170 175 L145 175 C130 175, 125 168, 125 160
           L80 160 Z"
        fill="#5B2D8E"
      />
      <path
        d="M200 100 L200 160 C200 200, 225 220, 255 220 C285 220, 310 200, 310 160
           L310 100 L335 100 L335 160 C335 215, 295 240, 255 240
           C215 240, 175 215, 175 160 L175 100 L200 100 Z"
        fill="#5B2D8E"
      />
      {/* 'IMAGE MASTERS' text */}
      <text x="205" y="285" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="bold" letterSpacing="4" fill="#1a1a1a">
        IMAGE MASTERS
      </text>
    </svg>
  );
}
