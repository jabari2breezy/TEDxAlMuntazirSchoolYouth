import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform, AnimatePresence, useScroll } from 'motion/react';

const AGENDA_ITEMS = [
  {
    id: '01',
    time: '08:00 AM',
    title: 'THE ARRIVAL',
    desc: 'Enter the monolithic space and receive credentials.',
    duration: '60M',
    type: 'EXPERIENCE'
  },
  {
    id: '02',
    time: '09:00 AM',
    title: 'THE INHERITORS',
    desc: 'Exploring the systems we must now manage.',
    duration: '90M',
    type: 'KEYNOTE'
  },
  {
    id: '03',
    time: '10:30 AM',
    title: 'LIQUIDITY BREAK',
    desc: 'Networking and ambient experiences.',
    duration: '30M',
    type: 'BREAK'
  },
  {
    id: '04',
    time: '11:00 AM',
    title: 'THE PRESENT TENSE',
    desc: 'Dissecting procrastination and time economics.',
    duration: '90M',
    type: 'KEYNOTE'
  },
  {
    id: '05',
    time: '12:30 PM',
    title: 'MID-DAY PAUSE',
    desc: 'Curated lunch and partner activations.',
    duration: '60M',
    type: 'LUNCH'
  },
  {
    id: '06',
    time: '01:30 PM',
    title: 'FUTURE LEGACIES',
    desc: 'Designing the architecture of tomorrow.',
    duration: '90M',
    type: 'KEYNOTE'
  },
];

// Infinite list by tripling the items
const EXTENDED_ITEMS = [...AGENDA_ITEMS, ...AGENDA_ITEMS, ...AGENDA_ITEMS].map((item, index) => ({
  ...item,
  uniqueId: `${item.id}-${index}`
}));

export default function Agenda() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a massive scroll container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Apply heavy friction to the scroll via spring
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 50, 
    damping: 30,
    mass: 2
  });

  // Map 0-1 progress to an angle. 
  // We have 18 items. Let's space them 20 degrees apart. Total 360 degrees.
  const angleOffset = useTransform(smoothProgress, [0, 1], [0, 360]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDuration, setActiveDuration] = useState(0);

  // We need to continuously track the active index based on current angle
  useEffect(() => {
    let lastTime = Date.now();
    
    const unsub = angleOffset.on("change", (v) => {
      // Each item is 20 degrees.
      // the front item is when itemAngle - v ≈ 0
      const currentIndex = Math.round(v / 20) % EXTENDED_ITEMS.length;
      
      if (currentIndex !== activeIndex) {
        setActiveIndex(currentIndex);
        setActiveDuration(0); // reset duration
      } else {
        // Accumulate hold duration
        const now = Date.now();
        setActiveDuration(prev => prev + (now - lastTime));
      }
      lastTime = Date.now();
    });

    return () => unsub();
  }, [angleOffset, activeIndex]);

  // If scroll stops for 1 second, activeDuration keeps growing? 
  // No, the "change" event only fires when moving.
  // We need a timer that ticks when activeIndex settles.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDuration(prev => prev + 100);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const showMetadata = activeDuration > 1000; // 1 second threshold

  return (
    <div className="bg-[#050507] text-white overflow-hidden relative">
      
      {/* 1. Background Layer (Velvet Red Mist + Grain + Blur) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050507] z-0" />
        
        {/* The Pooling Mist - Jumps to center when settled */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-[120vw] md:w-[60vw] h-[40vh] bg-[#E02229] rounded-[100%] opacity-40 mix-blend-screen"
          style={{ 
            filter: 'blur(100px)',
            // When moving fast, scale down and fade out slightly. When settled, pool big.
            scale: showMetadata ? 1.2 : 0.8,
            opacity: showMetadata ? 0.6 : 0.2,
            top: '50%',
            y: '-50%'
          }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Heavy Frosted Glass & Grain */}
        <div className="absolute inset-0 backdrop-blur-3xl z-10" />
        <div className="absolute inset-0 z-20 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* 2. The Cylinder Wheel Scroll Container */}
      {/* Massive height to allow extensive scrolling. */}
      <div ref={containerRef} className="h-[500vh] relative z-30">
        
        {/* Sticky viewport for the 3D wheel */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1000px] md:perspective-[2000px]">
          
          <div className="relative w-full max-w-7xl h-full flex items-center justify-center transform-style-3d">
            
            {EXTENDED_ITEMS.map((item, i) => {
              // Base angle for this item
              const itemAngle = i * 20;

              return (
                <CylinderRow 
                  key={item.uniqueId} 
                  item={item} 
                  itemAngle={itemAngle}
                  angleOffset={angleOffset}
                  isActive={i === activeIndex}
                  showMetadata={showMetadata && i === activeIndex}
                />
              );
            })}

          </div>

          {/* Fixed center X-Ray Lens (Emerges when settled) */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[40vw] h-[25vh] rounded-full border border-white/20 pointer-events-none transition-all duration-1000 ease-[0.16,1,0.3,1] flex items-center justify-center z-0 mix-blend-overlay
            ${showMetadata ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `}>
            {/* Structural clock vector outline */}
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="opacity-30">
              <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="20" stroke="white" strokeWidth="1" />
              <line x1="50" y1="50" x2="70" y2="50" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponent for each row to handle its own complex 3D math and interpolation
function CylinderRow({ item, itemAngle, angleOffset, isActive, showMetadata }: any) {
  
  // Calculate relative angle distance from the current camera view (angleOffset)
  // We want to wrap around 360 to keep the cylinder continuous
  const relativeAngle = useTransform(angleOffset, (currentOffset: number) => {
    let diff = (itemAngle - currentOffset) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  });

  // Transform angle to 3D CSS
  const rotateX = useTransform(relativeAngle, (v: number) => `${v}deg`);
  
  // Visibility: Only render if within +/- 40 degrees (3 rows visible)
  const opacity = useTransform(relativeAngle, [-40, -20, 0, 20, 40], [0, 0.2, 1, 0.2, 0]);
  const scale = useTransform(relativeAngle, [-40, -20, 0, 20, 40], [0.4, 0.5, 1, 0.5, 0.4]);
  const color = useTransform(relativeAngle, [-20, 0, 20], ['#666666', '#ffffff', '#666666']);
  const letterSpacing = useTransform(relativeAngle, [-20, 0, 20], ['0.2em', '0em', '0.2em']);

  // Move it out on the Z axis to form a cylinder
  const translateZ = 400; // Radius of the cylinder

  // When inactive, we can apply blur
  const filter = useTransform(relativeAngle, [-20, 0, 20], ['blur(4px)', 'blur(0px)', 'blur(4px)']);

  return (
    <motion.div
      className="absolute w-full flex flex-col items-center justify-center text-center transform-style-3d pointer-events-none"
      style={{
        rotateX,
        translateZ,
        opacity,
        scale,
        color,
        letterSpacing,
        filter
      }}
    >
      <div className="font-typewriter text-[10px] md:text-sm uppercase tracking-widest text-[#E02229] mb-4">
        {item.time}
      </div>
      
      <h2 className="text-4xl md:text-[8vw] font-title font-black uppercase leading-none tracking-tighter whitespace-nowrap">
        {item.title}
      </h2>

      {/* The Zero-Jump Accordion Rollout */}
      {/* Absolute positioning ensures zero layout shifting to the massive text */}
      <div className="relative w-full h-0 flex justify-center">
        <motion.div 
          className="absolute top-8 overflow-hidden flex flex-col items-center gap-2"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: showMetadata ? 'auto' : 0, 
            opacity: showMetadata ? 1 : 0 
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-editorial text-xl md:text-3xl italic text-white/80 mt-4 max-w-2xl">
            {item.desc}
          </p>
          <div className="flex gap-6 mt-4 font-typewriter text-[9px] md:text-[11px] uppercase tracking-widest text-white/50 border-t border-white/10 pt-4">
            <span>[ SPEAKER: TBA ]</span>
            <span>[ DURATION: {item.duration} ]</span>
            <span>[ STAGE: 01 ]</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
