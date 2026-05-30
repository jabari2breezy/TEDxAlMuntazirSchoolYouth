import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import * as THREE from 'three';
import { ArrowUpRight, CalendarDays, MapPin, Sparkles, Users } from 'lucide-react';
import { TICKETS_URL } from '../constants';

type SelectedPass = 'standard' | 'supporter' | 'group';

const EASE = [0.16, 1, 0.3, 1] as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function mix(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function segment(value: number, start: number, end: number) {
  return clamp01((value - start) / (end - start));
}

function hashSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number) {
  let value = seed || 1;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function drawFrontTexture(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const rand = seededRandom(hashSeed('tedx-almuntazir-ticket'));

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#f8f4eb');
  grad.addColorStop(0.42, '#f4efe4');
  grad.addColorStop(1, '#e7e0d5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const topGlow = ctx.createRadialGradient(width * 0.24, height * 0.18, 10, width * 0.24, height * 0.18, width * 0.7);
  topGlow.addColorStop(0, 'rgba(0,109,56,0.16)');
  topGlow.addColorStop(1, 'rgba(0,109,56,0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, width, height);

  const bottomGlow = ctx.createRadialGradient(width * 0.78, height * 0.8, 10, width * 0.78, height * 0.8, width * 0.7);
  bottomGlow.addColorStop(0, 'rgba(0,8,57,0.18)');
  bottomGlow.addColorStop(1, 'rgba(0,8,57,0)');
  ctx.fillStyle = bottomGlow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 50; i += 1) {
    const y = (i / 50) * height;
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000839';
    ctx.fillRect(0, y, width, 1);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(width * 0.08, height * 0.16);
  ctx.fillStyle = '#000839';
  ctx.font = '700 42px Inter, sans-serif';
  ctx.fillText('TEDxAlMuntazirSchoolsYouth', 0, 0);
  ctx.fillStyle = '#006d38';
  ctx.font = '700 28px Inter, sans-serif';
  ctx.fillText('ENTRY PASS / BORROWED TIME', 0, 56);
  ctx.restore();

  ctx.save();
  ctx.translate(width * 0.08, height * 0.36);
  ctx.fillStyle = '#000839';
  ctx.font = '900 124px Bricolage Grotesque, sans-serif';
  ctx.fillText('TICKET', 0, 0);
  ctx.font = '900 112px Bricolage Grotesque, sans-serif';
  ctx.fillText('FOR THE', 0, 120);
  ctx.font = '900 104px Bricolage Grotesque, sans-serif';
  ctx.fillText('DAY', 0, 230);
  ctx.restore();

  ctx.save();
  ctx.translate(width * 0.08, height * 0.7);
  ctx.fillStyle = '#000839';
  ctx.font = '600 24px Courier Prime, monospace';
  ctx.fillText('JUNE 14, 2026  /  UPANGA, DAR ES SALAAM  /  09:30 AM', 0, 0);
  ctx.font = '400 18px Courier Prime, monospace';
  ctx.fillStyle = 'rgba(0,8,57,0.55)';
  ctx.fillText('A cinematic ticket experience with priority access, great speakers, and a room built for momentum.', 0, 36);
  ctx.restore();

  const qrX = width * 0.765;
  const qrY = height * 0.505;
  const qrSize = width * 0.165;

  ctx.save();
  ctx.translate(qrX, qrY);
  ctx.fillStyle = '#f7f2e7';
  ctx.fillRect(-16, -16, qrSize + 32, qrSize + 32);
  ctx.strokeStyle = 'rgba(0,8,57,0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-16, -16, qrSize + 32, qrSize + 32);

  ctx.fillStyle = '#000839';
  const cells = 17;
  const cell = qrSize / cells;
  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      const value = rand() > 0.54 || (x < 4 && y < 4) || (x > cells - 5 && y < 4) || (x < 4 && y > cells - 5);
      if (!value) continue;
      if ((x > 1 && x < 5 && y > 1 && y < 5) || (x > cells - 6 && x < cells - 2 && y > 1 && y < 5) || (x > 1 && x < 5 && y > cells - 6 && y < cells - 2)) {
        continue;
      }
      ctx.fillRect(x * cell, y * cell, cell - 1, cell - 1);
    }
  }
  ctx.restore();

  ctx.save();
  ctx.translate(width * 0.765, height * 0.28);
  ctx.fillStyle = '#006d38';
  ctx.font = '700 20px Courier Prime, monospace';
  ctx.fillText('ADMIT ONE', 0, 0);
  ctx.font = '400 14px Courier Prime, monospace';
  ctx.fillStyle = 'rgba(0,8,57,0.6)';
  ctx.fillText('Priority entrance, no waiting at the edge.', 0, 28);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = 'rgba(0,8,57,0.1)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([10, 12]);
  ctx.beginPath();
  ctx.moveTo(width * 0.5, height * 0.88);
  ctx.lineTo(width * 0.92, height * 0.88);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 18; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#000839' : '#006d38';
    ctx.fillRect(width * 0.74 + i * 10, height * 0.82, 4, 54);
  }
  ctx.restore();
}

function drawBackTexture(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const rand = seededRandom(hashSeed('tedx-almuntazir-ticket-back'));

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#09111f');
  grad.addColorStop(1, '#00060f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const sheen = ctx.createRadialGradient(width * 0.2, height * 0.2, 10, width * 0.2, height * 0.2, width * 0.8);
  sheen.addColorStop(0, 'rgba(0,109,56,0.18)');
  sheen.addColorStop(1, 'rgba(0,109,56,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 90; i += 1) {
    const x = rand() * width;
    const y = rand() * height;
    const w = 120 + rand() * 120;
    ctx.strokeStyle = i % 3 === 0 ? '#006d38' : '#ffffff';
    ctx.strokeRect(x, y, w, 2);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(width * 0.1, height * 0.18);
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.font = '700 44px Inter, sans-serif';
  ctx.fillText('BACK OF PASS', 0, 0);
  ctx.font = '400 18px Courier Prime, monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('Keep this card close to the light. The details become the experience.', 0, 40);
  ctx.restore();

  ctx.save();
  ctx.translate(width * 0.1, height * 0.38);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '400 15px Courier Prime, monospace';
  const lines = [
    'ENTRY CONDITIONS: valid ticket, clear QR code, and a sense of time well spent.',
    'DOORS OPEN: 09:30 AM',
    'VENUE: AL MUNTAZIR NURSERY CAMPUS',
    'DRESS CODE: SHARP / COMFORTABLE / READY TO MOVE',
    'NOTE: line breaks are part of the choreography.'
  ];
  lines.forEach((line, index) => {
    ctx.fillText(line, 0, index * 34);
  });
  ctx.restore();

  ctx.save();
  ctx.translate(width * 0.1, height * 0.72);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width * 0.8, 0);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  for (let i = 0; i < 24; i += 1) {
    ctx.fillRect(i * 12, 18, 6, 60 + (i % 5) * 5);
  }
  ctx.restore();
}

function useTicketTexture() {
  return useMemo(() => {
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 2048;
    frontCanvas.height = 1280;
    drawFrontTexture(frontCanvas);

    const backCanvas = document.createElement('canvas');
    backCanvas.width = 2048;
    backCanvas.height = 1280;
    drawBackTexture(backCanvas);

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;
    frontTexture.anisotropy = 8;
    frontTexture.needsUpdate = true;

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;
    backTexture.anisotropy = 8;
    backTexture.needsUpdate = true;

    return { frontTexture, backTexture };
  }, []);
}

function TicketLights() {
  const haloA = useRef<THREE.Mesh>(null);
  const haloB = useRef<THREE.Mesh>(null);
  const ribbon = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (haloA.current) {
      haloA.current.rotation.z = t * 0.12;
      haloA.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    }
    if (haloB.current) {
      haloB.current.rotation.z = -t * 0.08;
      haloB.current.rotation.y = Math.cos(t * 0.24) * 0.08;
    }
    if (ribbon.current) {
      ribbon.current.rotation.y = t * 0.08;
    }
  });

  return (
    <>
      <mesh ref={haloA} position={[0, 0.06, -2.8]}>
        <torusGeometry args={[1.8, 0.045, 16, 120]} />
        <meshBasicMaterial color="#006d38" transparent opacity={0.28} />
      </mesh>
      <mesh ref={haloB} position={[-0.2, -0.15, -2.6]}>
        <torusGeometry args={[1.25, 0.022, 16, 120]} />
        <meshBasicMaterial color="#f7f1e4" transparent opacity={0.16} />
      </mesh>
      <mesh ref={ribbon} position={[1.2, 0.45, -2.0]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshBasicMaterial color="#80ffbf" transparent opacity={0.12} />
      </mesh>
    </>
  );
}

function TicketMesh({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { frontTexture, backTexture } = useTicketTexture();
  const { viewport } = useThree();

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  useEffect(() => {
    return () => {
      frontTexture.dispose();
      backTexture.dispose();
    };
  }, [frontTexture, backTexture]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const p = progress.get();
    const mobile = viewport.width < 6.5;

    const hero = segment(p, 0, 0.25);
    const split = segment(p, 0.25, 0.6);
    const transact = segment(p, 0.6, 1);

    const stage2X = mobile ? 1.15 : 1.95;
    const stage3X = mobile ? 0.18 : 0.1;

    const xTarget = p < 0.25
      ? 0
      : p < 0.6
        ? mix(0, stage2X, split)
        : mix(stage2X, stage3X, transact);

    const yTarget = p < 0.25
      ? mix(0.05, -0.05, hero)
      : p < 0.6
        ? mix(-0.05, 0.18, split)
        : mix(0.18, 0.02, transact);

    const zTarget = p < 0.25
      ? mix(0, 0.2, hero)
      : p < 0.6
        ? mix(0.2, 0.65, split)
        : mix(0.65, 1.55, transact);

    const baseRotationY = p < 0.25
      ? mix(0, Math.PI * 2, hero)
      : p < 0.6
        ? mix(Math.PI * 2, Math.PI * 2.32, split)
        : mix(Math.PI * 2.32, 0, transact);

    const rotationXTarget = p < 0.25
      ? mix(-0.12, 0.1, hero)
      : p < 0.6
        ? mix(0.1, 0.03, split)
        : mix(0.03, 0, transact);

    const rotationZTarget = p < 0.25
      ? mix(-0.04, 0.08, hero)
      : p < 0.6
        ? mix(0.08, -0.08, split)
        : mix(-0.08, 0, transact);

    const scaleTarget = p < 0.25
      ? mix(0.95, 1.05, hero)
      : p < 0.6
        ? mix(1.05, mobile ? 0.88 : 0.94, split)
        : mix(mobile ? 0.88 : 0.94, mobile ? 1.02 : 1.14, transact);

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, xTarget, 1 - Math.pow(0.001, delta));
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, yTarget, 1 - Math.pow(0.001, delta));
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, zTarget, 1 - Math.pow(0.001, delta));
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, baseRotationY, 1 - Math.pow(0.002, delta));
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rotationXTarget, 1 - Math.pow(0.001, delta));
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, rotationZTarget, 1 - Math.pow(0.001, delta));
    group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, scaleTarget, 1 - Math.pow(0.001, delta));
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, scaleTarget, 1 - Math.pow(0.001, delta));
    group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, scaleTarget, 1 - Math.pow(0.001, delta));

    if (shadow.current) {
      const shadowScale = mix(1, 1.35, transact);
      shadow.current.scale.setScalar(shadowScale);
      shadow.current.position.y = -1.52 - transact * 0.18;
      const shadowMaterial = shadow.current.material as THREE.MeshBasicMaterial;
      shadowMaterial.opacity = mix(0.5, 0.7, transact);
    }

    const targetTiltX = pointer.current.y * 0.08;
    const targetTiltY = pointer.current.x * 0.08;
    group.current.rotation.x += (targetTiltX - group.current.rotation.x) * 0.03;
    group.current.rotation.y += (targetTiltY - group.current.rotation.y) * 0.02;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, mix(5.6, 4.2, transact), 1 - Math.pow(0.001, delta));
  });

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
      <mesh ref={shadow} position={[0, -1.55, -0.72]} rotation={[-Math.PI / 2, 0, 0]} scale={1}>
        <planeGeometry args={[5.1, 1.9]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      <mesh position={[0, 0, -0.12]}>
        <RoundedBox args={[4.6, 2.75, 0.18]} radius={0.2} smoothness={10}>
          <meshPhysicalMaterial
            color="#f5f0e7"
            roughness={0.28}
            metalness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            reflectivity={0.55}
          />
        </RoundedBox>
      </mesh>

      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[4.48, 2.58]} />
        <meshBasicMaterial map={frontTexture} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, -0.095]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[4.48, 2.58]} />
        <meshBasicMaterial map={backTexture} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[4.46, 2.56]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>

      <mesh position={[-1.72, 0.98, 0.14]}>
        <planeGeometry args={[0.24, 1.94]} />
        <meshBasicMaterial color="#000839" transparent opacity={0.08} />
      </mesh>

      <mesh position={[1.7, -0.82, 0.14]} rotation={[0, 0, -0.04]}>
        <planeGeometry args={[0.8, 0.08]} />
        <meshBasicMaterial color="#006d38" transparent opacity={0.35} />
      </mesh>

      <TicketLights />
    </group>
  );
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      <color attach="background" args={['#050507']} />
      <fog attach="fog" args={['#050507', 7, 16]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 5, 5]} intensity={2.3} color="#ffffff" />
      <directionalLight position={[-3, -2, 4]} intensity={1.2} color="#006d38" />
      <pointLight position={[0, 1.5, 2]} intensity={1.6} color="#80ffbf" />
      <spotLight position={[0, 8, 4]} angle={0.3} penumbra={1} intensity={2.4} color="#ffffff" />
      <TicketMesh progress={progress} />
      <mesh position={[0, -0.6, -4.3]}>
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial color="#000839" transparent opacity={0.28} />
      </mesh>
    </>
  );
}

function TicketStageCard({
  eyebrow,
  title,
  copy,
  detail,
  className = '',
}: {
  eyebrow: string;
  title: string;
  copy: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,0.35)] ${className}`}>
      <div className="p-6 md:p-8 space-y-4">
        <p className="font-typewriter text-[10px] uppercase tracking-[0.45em] text-white/35">{eyebrow}</p>
        <h3 className="text-3xl md:text-5xl font-title font-black uppercase tracking-tighter leading-[0.85]">{title}</h3>
        <p className="font-editorial text-lg md:text-xl italic text-white/70 leading-relaxed">{copy}</p>
        {detail && <p className="font-sans text-sm text-white/45 leading-relaxed">{detail}</p>}
      </div>
    </div>
  );
}

export default function TicketScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);
  const [selectedPass, setSelectedPass] = useState<SelectedPass>('standard');
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 18, mass: 0.9 });

  const heroOpacity = useTransform(smoothProgress, [0, 0.18, 0.28], [1, 0.9, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.25], [0, -80]);
  const ticketX = useTransform(smoothProgress, [0, 0.22, 0.6, 0.82, 1], ['0vw', '0vw', '24vw', '10vw', '0vw']);
  const ticketY = useTransform(smoothProgress, [0, 0.25, 0.6, 1], ['0px', '0px', '-24px', '-14px']);
  const ticketScale = useTransform(smoothProgress, [0, 0.25, 0.6, 0.85, 1], [0.88, 0.98, 0.84, 1.02, 1.08]);
  const ticketRotateY = useTransform(smoothProgress, [0, 0.25, 0.6, 1], [0, 165, 10, 0]);
  const ticketRotateX = useTransform(smoothProgress, [0, 0.25, 0.6, 1], [8, 2, 0, 0]);
  const ticketRotateZ = useTransform(smoothProgress, [0, 0.25, 0.6, 1], [-2, 1, 0, 0]);
  const ticketOpacity = useTransform(smoothProgress, [0, 0.04, 0.14, 1], [0, 1, 1, 1]);

  const splitOpacity = useTransform(smoothProgress, [0.18, 0.28, 0.52, 0.65], [0, 1, 1, 0]);
  const splitX = useTransform(smoothProgress, [0.18, 0.3], [-30, 0]);
  const splitScale = useTransform(smoothProgress, [0.18, 0.38], [0.92, 1]);

  const formOpacity = useTransform(smoothProgress, [0.58, 0.7, 0.88], [0, 1, 1]);
  const formY = useTransform(smoothProgress, [0.58, 0.75], [40, 0]);
  const footerOpacity = useTransform(smoothProgress, [0.82, 0.95], [0, 1]);

  useMotionValueEvent(smoothProgress, 'change', (value) => {
    setInteractive(value >= 0.74);
  });

  const ticketMeta = useMemo(() => {
    switch (selectedPass) {
      case 'supporter':
        return {
          price: '45,000',
          label: 'Supporter Pass',
          note: 'Best for people who want a louder room, a better seat, and more room to move.',
        };
      case 'group':
        return {
          price: '120,000',
          label: 'Group Table',
          note: 'For four people coming together. Share the room and keep the story moving.',
        };
      default:
        return {
          price: '30,000',
          label: 'Standard Pass',
          note: 'The core experience. Clean entry, premium seating, and the full agenda journey.',
        };
    }
  }, [selectedPass]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-[#050507] text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,109,56,0.12),transparent_35%),radial-gradient(circle_at_15%_80%,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,#050507_0%,#06080f_48%,#040405_100%)]" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      </div>

      <div
        className="fixed inset-0 z-10"
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      >
        <Canvas
          camera={{ position: [0, 0, 5.6], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Scene progress={smoothProgress} />
        </Canvas>
      </div>

      <motion.div
        className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center px-6 md:px-16"
        style={{
          opacity: ticketOpacity,
          x: ticketX,
          y: ticketY,
          scale: ticketScale,
          rotateY: ticketRotateY,
          rotateX: ticketRotateX,
          rotateZ: ticketRotateZ,
          transformStyle: 'preserve-3d',
          perspective: 1400,
        }}
      >
        <div className="relative w-[min(84vw,560px)]">
          <div className="absolute -inset-8 rounded-[3rem] bg-brand-secondary/10 blur-[70px]" />
          <div className="absolute inset-0 translate-y-5 scale-[1.04] rounded-[2.5rem] bg-black/45 blur-[18px]" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/12 bg-[#f5f0e7] text-[#000839] shadow-[0_45px_130px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(0,109,56,0.12),transparent_28%),radial-gradient(circle_at_78%_70%,rgba(0,8,57,0.12),transparent_32%)]" />
            <div className="relative flex items-start justify-between gap-6 border-b border-dashed border-[#000839]/10 px-6 py-5 md:px-8">
              <div className="space-y-1">
                <p className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-[#000839]/35">TEDxAlMuntazirSchoolsYouth</p>
                <h3 className="text-3xl md:text-5xl font-title font-black uppercase tracking-tighter leading-[0.85]">
                  Borrowed <span className="text-brand-secondary italic font-editorial lowercase">Time.</span>
                </h3>
              </div>
              <div className="rounded-full border border-[#000839]/10 bg-white/60 px-4 py-3 text-right">
                <p className="font-typewriter text-[9px] uppercase tracking-[0.35em] text-[#000839]/30">Admit one</p>
                <p className="font-title text-xl md:text-2xl font-black tracking-tighter">Tsh 30,000</p>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5 px-6 py-6 md:px-8 md:py-8">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-[#000839]/35">Date</span>
                    <span className="h-px flex-1 bg-[#000839]/10" />
                    <span className="font-title text-lg font-black uppercase tracking-tight">June 14, 2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-[#000839]/35">Venue</span>
                    <span className="h-px flex-1 bg-[#000839]/10" />
                    <span className="font-title text-lg font-black uppercase tracking-tight">Upanga, Dar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-[#000839]/35">Access</span>
                    <span className="h-px flex-1 bg-[#000839]/10" />
                    <span className="font-title text-lg font-black uppercase tracking-tight">All sessions</span>
                  </div>
                </div>

                <p className="max-w-xl font-editorial text-lg italic text-[#000839]/70 leading-relaxed">
                  A physical-feeling ticket with a luxury finish, warm paper tone, and the same scrollytelling energy that shapes the page around it.
                </p>
              </div>

              <div className="border-t border-dashed border-[#000839]/10 md:border-l md:border-t-0">
                <div className="grid h-full gap-0 md:grid-rows-[1fr_auto]">
                  <div className="flex items-center justify-center p-6 md:p-8">
                    <div className="rounded-[1.5rem] border border-[#000839]/10 bg-white/70 p-4 shadow-inner">
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 49 }).map((_, index) => (
                          <span
                            key={index}
                            className={`block h-3 w-3 ${index % 3 === 0 || index % 5 === 0 ? 'bg-[#000839]' : 'bg-transparent'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-dashed border-[#000839]/10 px-6 py-4 md:px-8">
                    <div>
                      <p className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-[#000839]/35">Admit</p>
                      <p className="font-title text-2xl font-black uppercase tracking-tighter">One entry</p>
                    </div>
                    <div className="text-right">
                      <p className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-[#000839]/35">Status</p>
                      <p className="font-title text-2xl font-black uppercase tracking-tighter text-brand-secondary">Ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-20">
        <section className="sticky top-0 h-screen px-6 md:px-16">
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="h-full max-w-screen-2xl mx-auto flex flex-col justify-center"
          >
            <div className="max-w-4xl space-y-8">
              <p className="font-typewriter text-[10px] md:text-[11px] uppercase tracking-[0.8em] text-white/30">
                STEP INTO THE PASS
              </p>
              <h1 className="text-[15vw] md:text-[10vw] font-title font-black uppercase leading-[0.78] tracking-tighter">
                Ticket
                <span className="block text-brand-secondary italic font-editorial lowercase">Journey.</span>
              </h1>
              <p className="max-w-2xl font-editorial text-xl md:text-3xl italic text-white/65 leading-relaxed">
                A scrolling registration story where the ticket stays centered, rotates like a physical object, and slowly becomes the interface itself.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {['cinematic movement', '3D realism', 'scroll-bound reveal'].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-typewriter text-[9px] uppercase tracking-[0.35em] text-white/55"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="sticky top-0 h-screen px-6 md:px-16">
          <motion.div
            style={{ opacity: splitOpacity, x: splitX, scale: splitScale }}
            className="h-full max-w-screen-2xl mx-auto flex items-center"
          >
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center w-full">
              <div className="space-y-8 max-w-2xl">
                <p className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary">
                  THE STORY OPENS
                </p>
                <h2 className="text-5xl md:text-8xl font-title font-black uppercase tracking-tighter leading-[0.82]">
                  The ticket
                  <span className="block text-white/50 italic font-editorial lowercase">takes the stage.</span>
                </h2>
                <p className="font-editorial text-xl md:text-2xl italic text-white/65 leading-relaxed">
                  The ticket drifts to the right, the story opens on the left, and the page begins to feel like a live editorial spread instead of a static sales page.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <TicketStageCard
                    eyebrow="EVENT SNAPSHOT"
                    title="One day."
                    copy="A full-room experience with speaker moments, live transitions, and a ticket that feels like a collectible."
                  />
                  <TicketStageCard
                    eyebrow="DESIGN DIRECTION"
                    title="More motion."
                    copy="Everything moves with intention: the ticket, the copy, and the background atmosphere all respond to scroll depth."
                  />
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="w-full max-w-md rounded-[2.25rem] border border-white/10 bg-black/25 backdrop-blur-2xl p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-white/35">Premium pass</span>
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-brand-secondary">Live now</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: CalendarDays, label: 'June 14, 2026', value: 'Doors open at 9:30 AM' },
                      { icon: MapPin, label: 'Upanga, Dar Es Salaam', value: 'Al Muntazir Nursery Campus' },
                      { icon: Sparkles, label: 'Atmosphere', value: 'Editorial, cinematic, premium' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-4 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/15 text-brand-secondary">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-title text-lg font-black uppercase tracking-tight text-white">{label}</p>
                          <p className="font-sans text-sm text-white/50">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 font-sans text-sm leading-relaxed text-white/55">
                    The scene is intentionally restrained here so the ticket continues to dominate the frame as the page evolves.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="sticky top-0 h-screen px-6 md:px-16">
          <motion.div
            style={{ opacity: formOpacity, y: formY }}
            className="h-full max-w-screen-2xl mx-auto flex items-center"
          >
            <div className="grid lg:grid-cols-[0.98fr_1.02fr] gap-10 items-center w-full">
              <div className="space-y-8 max-w-xl">
                <p className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary">
                  INTERACTIVE TRANSACTION MODE
                </p>
                <h2 className="text-5xl md:text-8xl font-title font-black uppercase tracking-tighter leading-[0.82]">
                  Select your
                  <span className="block text-white/50 italic font-editorial lowercase">pass type.</span>
                </h2>
                <p className="font-editorial text-xl md:text-2xl italic text-white/65 leading-relaxed">
                  The ticket now sits face-forward, close enough to feel tangible, while the selection panel becomes the functional layer for your registration decision.
                </p>
                <div className="grid gap-4">
                  <button onClick={() => setSelectedPass('standard')} className={`rounded-[1.5rem] border px-5 py-4 text-left transition-all ${selectedPass === 'standard' ? 'border-brand-secondary bg-brand-secondary/15' : 'border-white/10 bg-white/5 hover:bg-white/8'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-title text-xl font-black uppercase tracking-tight">Standard Pass</p>
                        <p className="font-sans text-sm text-white/45">The core experience, designed to feel clean and direct.</p>
                      </div>
                      <span className="font-typewriter text-[10px] uppercase tracking-[0.35em] text-brand-secondary">Tsh 30,000</span>
                    </div>
                  </button>
                  <button onClick={() => setSelectedPass('supporter')} className={`rounded-[1.5rem] border px-5 py-4 text-left transition-all ${selectedPass === 'supporter' ? 'border-brand-secondary bg-brand-secondary/15' : 'border-white/10 bg-white/5 hover:bg-white/8'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-title text-xl font-black uppercase tracking-tight">Supporter Pass</p>
                        <p className="font-sans text-sm text-white/45">For a slightly louder seat and a slightly bigger presence.</p>
                      </div>
                      <span className="font-typewriter text-[10px] uppercase tracking-[0.35em] text-brand-secondary">Tsh 45,000</span>
                    </div>
                  </button>
                  <button onClick={() => setSelectedPass('group')} className={`rounded-[1.5rem] border px-5 py-4 text-left transition-all ${selectedPass === 'group' ? 'border-brand-secondary bg-brand-secondary/15' : 'border-white/10 bg-white/5 hover:bg-white/8'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-title text-xl font-black uppercase tracking-tight">Group Table</p>
                        <p className="font-sans text-sm text-white/45">Best for friends arriving together and sitting as a unit.</p>
                      </div>
                      <span className="font-typewriter text-[10px] uppercase tracking-[0.35em] text-brand-secondary">Tsh 120,000</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 shadow-[0_35px_120px_rgba(0,0,0,0.45)]">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-white/35">Current selection</p>
                      <h3 className="mt-2 text-3xl md:text-5xl font-title font-black uppercase tracking-tighter">{ticketMeta.label}</h3>
                    </div>
                    <div className="rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-4 py-3">
                      <p className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-brand-secondary">Tsh</p>
                      <p className="font-title text-2xl font-black tracking-tighter">{ticketMeta.price}</p>
                    </div>
                  </div>
                  <p className="mt-6 max-w-2xl font-editorial text-xl italic text-white/70 leading-relaxed">{ticketMeta.note}</p>
                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                      <p className="font-typewriter text-[9px] uppercase tracking-[0.35em] text-white/35">What you get</p>
                      <ul className="mt-4 space-y-3 text-sm text-white/55">
                        <li>• Reserved entry and premium ticket styling</li>
                        <li>• Full agenda access with smooth transitions</li>
                        <li>• A registration page that feels physical</li>
                      </ul>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                      <p className="font-typewriter text-[9px] uppercase tracking-[0.35em] text-white/35">Next action</p>
                      <p className="mt-4 text-sm leading-relaxed text-white/55">
                        Keep scrolling for the final CTA and then secure your place from the ticket card itself.
                      </p>
                    </div>
                  </div>

                  <motion.a
                    href={TICKETS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8 inline-flex w-full items-center justify-center gap-4 rounded-full bg-brand-secondary px-8 py-5 font-title text-xl font-black uppercase tracking-[0.25em] text-white shadow-[0_18px_50px_rgba(0,109,56,0.35)]"
                  >
                    Secure Ticket
                    <ArrowUpRight size={20} />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="sticky top-0 h-screen px-6 md:px-16">
          <motion.div
            style={{ opacity: footerOpacity }}
            className="h-full max-w-screen-2xl mx-auto flex items-end pb-16 md:pb-20"
          >
            <div className="w-full grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-end">
              <div>
                <p className="font-typewriter text-[10px] uppercase tracking-[0.8em] text-white/30">CLOSING STATE</p>
                <h2 className="mt-4 text-5xl md:text-[8vw] font-title font-black uppercase tracking-tighter leading-[0.82]">
                  The ticket
                  <span className="block text-brand-secondary italic font-editorial lowercase">is the invitation.</span>
                </h2>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-2xl">
                <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                  <Users size={18} />
                  <span className="font-typewriter text-[9px] uppercase tracking-[0.35em]">Registration-ready</span>
                </div>
                <p className="font-editorial text-lg md:text-xl italic text-white/65 leading-relaxed">
                  The final frame holds the card, the copy, and the CTA together so the whole page ends on a clear, premium conversion moment.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </section>
  );
}
