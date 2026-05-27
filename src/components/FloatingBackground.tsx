import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Clock, Hourglass } from 'lucide-react';

const isMobile = typeof window !== 'undefined' &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

interface FloatingItemProps {
  icon: any;
  top: string;
  left: string;
  speed: number;
  size: number;
  rotate?: number;
}

const FloatingItem = ({ icon: Icon, top, left, speed, size, rotate = 0 }: FloatingItemProps) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 600]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.04, 0.08, 0.08, 0.04]);
  const blur = Math.abs(speed) * 30;

  return (
    <motion.div
      className="absolute pointer-events-none z-0 text-brand-primary"
      style={{ top, left, y, opacity, rotate, filter: `blur(${blur}px)`, willChange: 'transform, opacity' }}
    >
      <Icon size={size} strokeWidth={0.5} />
    </motion.div>
  );
};

export default function FloatingBackground() {
  // On mobile, render nothing — saves scroll listener + 17 motion values
  if (isMobile) return null;

  const items = [
    { icon: Clock,    top: '18%', left: '15%', speed: -0.08, size: 100, rotate: 0 },
    { icon: Hourglass,top: '25%', left: '75%', speed:  0.14, size: 32,  rotate: 45 },
    { icon: Clock,    top: '62%', left: '82%', speed:  0.12, size: 80,  rotate: -10 },
    { icon: Hourglass,top: '78%', left: '95%', speed:  0.06, size: 40,  rotate: 15 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {items.map((item, i) => (
        <FloatingItem key={i} {...item} />
      ))}
    </div>
  );
}
