export default function RafflesGlobalLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Globe */}
      <circle cx="200" cy="180" r="110" fill="url(#globe-gradient)" />
      {/* Latitude lines */}
      <ellipse cx="200" cy="180" rx="110" ry="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
      <ellipse cx="200" cy="150" rx="95" ry="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
      <ellipse cx="200" cy="210" rx="95" ry="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
      {/* Longitude lines */}
      <ellipse cx="200" cy="180" rx="40" ry="110" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" />
      <ellipse cx="200" cy="180" rx="80" ry="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
      {/* Green swoosh (top-right) */}
      <path
        d="M320 100 C340 80, 370 90, 380 120 C390 150, 370 180, 340 190"
        stroke="#7CB342"
        strokeWidth="28"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blue swoosh (bottom-left) */}
      <path
        d="M80 260 C60 280, 30 270, 20 240 C10 210, 30 180, 60 170"
        stroke="#1E88E5"
        strokeWidth="28"
        strokeLinecap="round"
        fill="none"
      />
      {/* Text */}
      <text x="200" y="330" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="32" fontWeight="bold" fill="rgba(255,255,255,0.7)" letterSpacing="3">
        RAFFLES GLOBAL
      </text>
      <text x="200" y="358" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16" fill="rgba(255,255,255,0.5)" letterSpacing="5">
        EDUCATION SERVICES
      </text>
      <text x="200" y="385" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fontStyle="italic" fill="rgba(255,255,255,0.4)" letterSpacing="4">
        PRIDE IN EXCELLENCE
      </text>
      <defs>
        <radialGradient id="globe-gradient" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#42A5F5" />
          <stop offset="60%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#0D47A1" />
        </radialGradient>
      </defs>
    </svg>
  );
}
