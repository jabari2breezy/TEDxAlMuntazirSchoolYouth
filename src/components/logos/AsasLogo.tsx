export default function AsasLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Stylized ASAS text - red decorative font */}
      <text
        x="200" y="145"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="160"
        fontWeight="bold"
        fontStyle="italic"
        fill="#D32F2F"
        letterSpacing="-8"
      >
        ASAS
      </text>
      {/* Decorative underline */}
      <path
        d="M60 165 Q200 180 340 165"
        stroke="#D32F2F"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}
