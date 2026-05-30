import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Calendar, MapPin, ArrowUpRight, Zap, ShieldCheck, Star } from 'lucide-react';
import * as THREE from 'three';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

// Stars backdrop component for spatial texture
function StarsBackdrop({ count = 80, progress }: { count?: number; progress?: any }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      speed: (Math.random() * 0.4 + 0.1),
    })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#020203]">
      {stars.map(s => {
        const y = progress
          ? useTransform(progress, [0, 1], [s.speed * 80, -s.speed * 80])
          : 0;

        return (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              y,
              opacity: 0.3,
              boxShadow: `0 0 4px rgba(255,255,255,0.4)`,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

const INCLUDED_ITEMS = [
  { text: 'Full access to all live speaker sessions', icon: Zap },
  { text: 'Interactive workshop zones', icon: Star },
  { text: 'Premium networking breaks & refreshments', icon: ShieldCheck },
  { text: 'Official TEDxAlMuntazir merch kit', icon: Zap },
  { text: 'Curated lunch & networking session', icon: Star }
];

// Helper to draw realistic finder patterns and pixels on QR code
const drawQRCode = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.fillStyle = '#000839';
  const patternSize = size * 0.28;
  
  const drawPattern = (px: number, py: number) => {
    ctx.fillRect(px, py, patternSize, patternSize);
    ctx.fillStyle = '#f7f4ee';
    ctx.fillRect(px + 10, py + 10, patternSize - 20, patternSize - 20);
    ctx.fillStyle = '#000839';
    ctx.fillRect(px + 20, py + 20, patternSize - 40, patternSize - 40);
  };
  
  drawPattern(x, y); // Top-left
  drawPattern(x + size - patternSize, y); // Top-right
  drawPattern(x, y + size - patternSize); // Bottom-left

  const alignSize = size * 0.12;
  ctx.fillRect(x + size - alignSize - 40, y + size - alignSize - 40, alignSize, alignSize);
  ctx.fillStyle = '#f7f4ee';
  ctx.fillRect(x + size - alignSize - 32, y + size - alignSize - 32, alignSize - 16, alignSize - 16);
  ctx.fillStyle = '#000839';
  ctx.fillRect(x + size - alignSize - 26, y + size - alignSize - 26, alignSize - 28, alignSize - 28);

  const blocksCount = 29;
  const blockSize = size / blocksCount;
  
  for (let r = 0; r < blocksCount; r++) {
    for (let c = 0; c < blocksCount; c++) {
      if (r < 9 && c < 9) continue;
      if (r < 9 && c > blocksCount - 10) continue;
      if (r > blocksCount - 10 && c < 9) continue;
      if (r > blocksCount - 8 && c > blocksCount - 8) continue;
      
      if (Math.random() > 0.45) {
        ctx.fillRect(x + c * blockSize, y + r * blockSize, blockSize + 0.5, blockSize + 0.5);
      }
    }
  }
};

// Canvas drawing texture generation for premium quality renders
const createTicketTexture = (isFront: boolean) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d')!;

  // Rounded pass card clip
  ctx.beginPath();
  const radius = 64;
  ctx.roundRect(0, 0, 1024, 1600, radius);
  ctx.clip();

  if (isFront) {
    // Navy gradient background
    const grad = ctx.createLinearGradient(0, 0, 1024, 1600);
    grad.addColorStop(0, '#00145c');
    grad.addColorStop(0.5, '#000839');
    grad.addColorStop(1, '#020205');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1600);

    // Glowing background mesh blob
    ctx.beginPath();
    const glow = ctx.createRadialGradient(250, 250, 0, 250, 250, 700);
    glow.addColorStop(0, 'rgba(0, 109, 56, 0.45)');
    glow.addColorStop(1, 'rgba(0, 109, 56, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1024, 1600);

    // Abstract graphic grids
    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 110);
      ctx.lineTo(1024, i * 110 + 350);
      ctx.stroke();
    }

    // Border Frame
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 1010, 1586);

    // Perforated line divider stub
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(50, 1100);
    ctx.lineTo(974, 1100);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cutouts
    ctx.fillStyle = '#050507';
    ctx.beginPath();
    ctx.arc(0, 1100, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1024, 1100, 60, 0, Math.PI * 2);
    ctx.fill();

    // Typography
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = 'bold 22px Courier Prime, Courier, monospace';
    ctx.letterSpacing = '8px';
    ctx.fillText("TEDXALMUNTAZIR", 120, 180);

    ctx.fillStyle = '#006d38';
    ctx.font = 'bold italic 52px Cormorant Garamond, serif';
    ctx.fillText("Borrowed Time", 120, 260);

    // Pass details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '18px Courier Prime, monospace';
    ctx.fillText("ACCESS LEVEL", 120, 480);
    ctx.fillStyle = '#ECEBE8';
    ctx.font = 'bold 36px Bricolage Grotesque, sans-serif';
    ctx.fillText("FULL EXPERIENCE PASS", 120, 530);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '18px Courier Prime, monospace';
    ctx.fillText("DATE / VENUE", 120, 680);
    ctx.fillStyle = '#ECEBE8';
    ctx.font = 'bold 32px Bricolage Grotesque, sans-serif';
    ctx.fillText("JUNE 14, 2026 / UPANGA", 120, 730);

    // Stub section
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 24px Courier Prime, monospace';
    ctx.fillText("ADMISSION PASS", 120, 1220);

    ctx.fillStyle = '#006d38';
    ctx.font = 'bold 88px Bricolage Grotesque, sans-serif';
    ctx.fillText("Tsh 30,000", 120, 1340);
  } else {
    // Back card - Off white premium paper surface
    ctx.fillStyle = '#f7f4ee';
    ctx.fillRect(0, 0, 1024, 1600);

    // Frame
    ctx.strokeStyle = 'rgba(0, 8, 57, 0.08)';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 1010, 1586);

    // Cutouts
    ctx.fillStyle = '#050507';
    ctx.beginPath();
    ctx.arc(0, 1100, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1024, 1100, 60, 0, Math.PI * 2);
    ctx.fill();

    // Stub divider
    ctx.strokeStyle = 'rgba(0, 8, 57, 0.06)';
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(50, 1100);
    ctx.lineTo(974, 1100);
    ctx.stroke();
    ctx.setLineDash([]);

    // QR Code
    drawQRCode(ctx, 362, 350, 300);

    // Metadata
    ctx.fillStyle = '#000839';
    ctx.font = 'bold 22px Courier Prime, monospace';
    ctx.textAlign = 'center';
    ctx.fillText("TICKET PASS ID: #TEDX-2026-8942", 512, 720);
    ctx.fillStyle = 'rgba(0, 8, 57, 0.5)';
    ctx.font = '16px Courier Prime, monospace';
    ctx.fillText("PLEASE SCAN QR CODE AT REGISTRATION DESK", 512, 780);

    // Guidelines
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(0, 8, 57, 0.65)';
    ctx.font = '22px Bricolage Grotesque, sans-serif';
    ctx.fillText("1. Present this QR code on arrival.", 120, 1200);
    ctx.fillText("2. Full pass includes all materials & lunch.", 120, 1250);
    ctx.fillText("3. Seating is allocated on first-come basis.", 120, 1300);
    ctx.fillText("4. Non-refundable. Keep your ticket private.", 120, 1350);
  }

  return canvas;
};

// 3D Ticket Mesh using Back-to-Back planes with R3F Lerp Springs
interface TicketMeshProps {
  targets: {
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
    scale: number;
  };
}

function TicketMesh({ targets }: TicketMeshProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Generate high-resolution canvas textures on mount
  const textures = useMemo(() => {
    const front = createTicketTexture(true);
    const back = createTicketTexture(false);
    
    const fTex = new THREE.CanvasTexture(front);
    const bTex = new THREE.CanvasTexture(back);
    
    fTex.colorSpace = THREE.SRGBColorSpace;
    bTex.colorSpace = THREE.SRGBColorSpace;
    
    return { front: fTex, back: bTex };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Elegant creative-hover cursor interactive tilt
    const pointerX = state.pointer.x * 0.35;
    const pointerY = state.pointer.y * 0.35;

    // High damping linear interpolations for silky smooth movements
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targets.x, 0.08);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targets.y, 0.08);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targets.z, 0.08);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targets.rx - pointerY, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targets.ry + pointerX, 0.08);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targets.rz, 0.08);

    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targets.scale, 0.08);
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={meshRef}>
      {/* Front Face of Ticket Pass */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[3.0, 4.68, 32, 32]} />
        <meshPhysicalMaterial 
          map={textures.front} 
          roughness={0.12} 
          metalness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          side={THREE.FrontSide}
          transparent={true}
        />
      </mesh>

      {/* Back Face of Ticket Pass */}
      <mesh position={[0, 0, -0.005]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.0, 4.68, 32, 32]} />
        <meshPhysicalMaterial 
          map={textures.back} 
          roughness={0.25} 
          metalness={0.05}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          side={THREE.FrontSide}
          transparent={true}
        />
      </mesh>
    </group>
  );
}

// Pinned Scrollytelling Viewport Canvas
interface ScrollyCanvasProps {
  targets: {
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
    scale: number;
  };
}

function ScrollyCanvas({ targets }: ScrollyCanvasProps) {
  return (
    <div className="fixed inset-0 h-screen w-full z-20 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 6, 6]} intensity={1.8} castShadow />
        <directionalLight position={[-6, 6, -6]} intensity={0.4} />
        <pointLight position={[0, 0, 5]} intensity={1.2} />
        
        <TicketMesh targets={targets} />
      </Canvas>
    </div>
  );
}

export default function Tickets() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [isInteractive, setIsInteractive] = useState(false);

  // Core mesh transform coordinates inside target states
  const [meshTargets, setMeshTargets] = useState({
    x: 0,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    scale: 1
  });

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setIsInteractive(latest >= 0.61);
      const isMobile = window.innerWidth <= 768;

      // Stage 1: The Hero Reveal (0% -> 25%)
      if (latest <= 0.25) {
        const p = latest / 0.25; // progress 0 to 1
        setMeshTargets({
          x: 0,
          y: 0,
          z: 0,
          rx: 0.15,
          ry: p * Math.PI * 2, // Slow Y rotation showing front and back holographic panels
          rz: 0,
          scale: isMobile ? 0.7 : 1.05
        });
      }
      // Stage 2: The Editorial Split Layout (26% -> 60%)
      else if (latest <= 0.60) {
        const p = (latest - 0.25) / 0.35; // progress 0 to 1
        setMeshTargets({
          x: isMobile ? 0 : 1.55, // slide to the right contextually
          y: isMobile ? -0.8 : 0,
          z: 0,
          rx: 0.15,
          ry: Math.PI * 2 + (p * 0.45), // rests at beautiful asymmetrical tilt angle
          rz: -0.12 * p,
          scale: isMobile ? 0.6 : 0.88
        });
      }
      // Stage 3: The Interactive Transaction Mode (61% -> 100%)
      else {
        const p = (latest - 0.60) / 0.40; // progress 0 to 1
        setMeshTargets({
          x: 0, // zoom flat back center
          y: isMobile ? 1.0 : 0.1,
          z: isMobile ? 0.7 : 1.6,
          rx: 0, // perfectly flat face forward
          ry: Math.PI * 2,
          rz: 0,
          scale: isMobile ? 0.8 : 1.15
        });
      }
    });
  }, [scrollYProgress]);

  // Viewport-layered HTML animations
  const headerOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.16], [0, -60]);

  const splitOpacity = useTransform(scrollYProgress, [0.26, 0.36, 0.52, 0.60], [0, 1, 1, 0]);
  const splitY = useTransform(scrollYProgress, [0.26, 0.36, 0.52, 0.60], [40, 0, 0, -40]);

  const formOpacity = useTransform(scrollYProgress, [0.65, 0.78], [0, 1]);
  const formScale = useTransform(scrollYProgress, [0.65, 0.78], [0.92, 1]);

  return (
    <div className="bg-[#050507] text-[#ECEBE8] overflow-x-hidden selection:bg-[#006d38] selection:text-white relative">
      {/* Dynamic 3D Scene viewport canvas */}
      <ScrollyCanvas targets={meshTargets} />

      {/* 400vh master scroll track */}
      <div ref={containerRef} className="h-[400vh] relative z-10">
        
        {/* Stage 1 HTML Layer: Floating Page Header */}
        <motion.div 
          style={{ opacity: headerOpacity, y: headerY }}
          className="sticky top-[15vh] w-full flex flex-col items-center text-center z-30 pointer-events-none"
        >
          <span className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary mb-3 block">
            Limited Release
          </span>
          <h1 className="text-6xl md:text-[8vw] font-title font-black uppercase tracking-tighter leading-none text-white select-none">
            THE <span className="italic font-editorial lowercase text-brand-secondary">Ticket.</span>
          </h1>
        </motion.div>

        {/* Stage 2 HTML Layer: Editorial Inclusions details (slides left) */}
        <motion.div
          style={{ opacity: splitOpacity, y: splitY }}
          className="sticky top-[20vh] h-screen max-w-screen-2xl mx-auto px-6 md:px-16 pointer-events-none flex items-center z-30"
        >
          <div className="w-full md:w-1/2 space-y-10 text-left pointer-events-auto">
            <div className="space-y-4">
              <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary block font-bold">
                The Inclusion
              </span>
              <h2 className="text-4xl md:text-6xl font-title font-black uppercase tracking-tighter leading-[0.8]">
                What's <br /> Inside
              </h2>
            </div>
            <div className="space-y-5">
              {INCLUDED_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center group-hover:bg-brand-secondary/20 group-hover:border-brand-secondary transition-colors duration-500">
                    <item.icon size={16} className="text-brand-secondary" />
                  </div>
                  <span className="font-editorial text-lg md:text-xl italic text-white/60 group-hover:text-white transition-colors duration-500">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stage 3 HTML Layer: Tactile interactive transaction checkout */}
        <motion.div
          style={{ opacity: formOpacity, scale: formScale }}
          className="sticky top-[15vh] w-full flex flex-col items-center justify-center text-center z-40"
        >
          <div className="max-w-xl w-full bg-[#08080c]/85 border border-white/8 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl space-y-8 flex flex-col items-center">
            <div className="space-y-2">
              <span className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary font-bold">
                Secure checkout
              </span>
              <h2 className="text-4xl md:text-5xl font-title font-black uppercase tracking-tighter text-white">
                GET TICKET
              </h2>
            </div>

            <p className="font-editorial text-lg italic text-white/50">
              Admission fee includes full day pass, refreshments, lunch and official event merch.
            </p>

            <motion.a
              href="https://tukiio.com/event/tedxalmuntazirschoolsyouth"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-6 bg-brand-secondary text-white rounded-2xl font-title font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl shadow-brand-secondary/15 hover:bg-[#008746] transition-colors duration-300 pointer-events-auto"
            >
              Secure Seat Now
              <ArrowUpRight size={24} />
            </motion.a>
          </div>
        </motion.div>

      </div>

      {/* Stage 4 Section: Features Grid (Inspired by larevoltosa.es editorial sections) */}
      <section className="py-32 px-6 md:px-16 bg-white text-[#000839] rounded-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] relative z-30">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-3 gap-12 md:gap-24">
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#000839] flex items-center justify-center text-white">
              <Calendar size={22} />
            </div>
            <h4 className="text-2xl md:text-3xl font-title font-black uppercase tracking-tighter text-[#000839]">
              The Date
            </h4>
            <p className="font-editorial text-lg md:text-xl italic opacity-60">
              June 14, 2026. A full day of unfolding ideas, conversations and borrowed moments.
            </p>
          </div>
          
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#000839] flex items-center justify-center text-white">
              <MapPin size={22} />
            </div>
            <h4 className="text-2xl md:text-3xl font-title font-black uppercase tracking-tighter text-[#000839]">
              The Venue
            </h4>
            <p className="font-editorial text-lg md:text-xl italic opacity-60">
              Al Muntazir Nursery Campus, Upanga. Transformed into an immersive cinematic stage.
            </p>
          </div>

          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#000839] flex items-center justify-center text-white">
              <Zap size={22} />
            </div>
            <h4 className="text-2xl md:text-3xl font-title font-black uppercase tracking-tighter text-[#000839]">
              The Vibe
            </h4>
            <p className="font-editorial text-lg md:text-xl italic opacity-60">
              High-end networking, groundbreaking student voices and an award-winning layout.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 5: Final tactual banner call to action */}
      <section className="py-40 text-center relative overflow-hidden bg-[#050507] z-30">
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-12">
          <h2 className="text-5xl md:text-[8vw] font-title font-black uppercase tracking-tighter leading-[0.8] text-white">
            DON'T WAIT FOR <br /> 
            <span className="text-brand-secondary italic font-editorial lowercase">someday.</span>
          </h2>
          
          <motion.a
            href="https://tukiio.com/event/tedxalmuntazirschoolsyouth"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-6 bg-white text-[#000839] px-12 md:px-20 py-8 rounded-full font-title font-black text-2xl uppercase tracking-widest shadow-2xl hover:bg-brand-secondary hover:text-white transition-all duration-300"
          >
            Buy Ticket Now
            <ArrowUpRight size={28} />
          </motion.a>
        </div>
      </section>

      {/* Spatial texture stars backdrop */}
      <StarsBackdrop count={90} progress={scrollYProgress} />
      
      {/* Noise overlay filter */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[100]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
