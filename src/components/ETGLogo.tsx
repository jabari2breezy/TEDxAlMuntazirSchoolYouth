import { motion } from 'motion/react';

export default function ETGLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ETG letters */}
      <text
        x="0"
        y="95"
        fontFamily="Inter, sans-serif"
        fontSize="110"
        fontWeight="900"
        fill="white"
        letterSpacing="-5"
      >
        ETG
      </text>
      {/* Black arrow pointing left */}
      <path
        d="M260 30 L230 30 L230 15 L205 40 L230 65 L230 50 L260 50 Z"
        fill="white"
      />
      {/* Red arrow pointing right */}
      <path
        d="M245 55 L275 55 L275 70 L300 45 L275 20 L275 35 L245 35 Z"
        fill="#C0392B"
      />
    </svg>
  );
}

export function ETGLogoDark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="95"
        fontFamily="Inter, sans-serif"
        fontSize="110"
        fontWeight="900"
        fill="#000839"
        letterSpacing="-5"
      >
        ETG
      </text>
      <path
        d="M260 30 L230 30 L230 15 L205 40 L230 65 L230 50 L260 50 Z"
        fill="#000839"
      />
      <path
        d="M245 55 L275 55 L275 70 L300 45 L275 20 L275 35 L245 35 Z"
        fill="#C0392B"
      />
    </svg>
  );
}
