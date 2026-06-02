export default function MetlLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* M */}
      <path d="M30 80 L30 200 L55 200 L55 130 L80 170 L105 130 L105 200 L130 200 L130 80 L105 80 L80 130 L55 80 Z" fill="#1A3C8F" />
      {/* e (yellow) */}
      <path d="M140 140 C140 115, 170 105, 195 115 C215 123, 220 140, 220 155 L140 155 C140 180, 165 195, 195 195 C215 195, 225 188, 230 180" stroke="#F9C74F" strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* T */}
      <path d="M245 80 L315 80 M280 80 L280 200" stroke="#1A3C8F" strokeWidth="22" strokeLinecap="round" />
      {/* L */}
      <path d="M330 80 L330 185 L385 185" stroke="#1A3C8F" strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* GROUP */}
      <text x="200" y="240" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="32" fontWeight="bold" fill="#1A3C8F" letterSpacing="8">
        GROUP
      </text>
      {/* Divider lines */}
      <line x1="50" y1="252" x2="155" y2="252" stroke="#333" strokeWidth="1.5" />
      <line x1="245" y1="252" x2="350" y2="252" stroke="#333" strokeWidth="1.5" />
      {/* Tagline */}
      <text x="200" y="278" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fill="#555" letterSpacing="1">
        The People&apos;s Brand
      </text>
    </svg>
  );
}
