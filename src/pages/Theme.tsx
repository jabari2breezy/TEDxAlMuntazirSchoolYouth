import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D SCENE COMPONENTS ---

// Generates abstract sand/particle geometry
function ParticleField({ count = 2000, scrollYProgress, isFractured }: { count?: number; scrollYProgress: any, isFractured: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Random positions in a cylinder/hourglass shape
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Abstract dispersion around center
      const theta = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 4 + (Math.random() > 0.5 ? 0 : 2); // outer or inner ring
      const y = (Math.random() - 0.5) * 10;
      
      pos[i * 3] = radius * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = radius * Math.sin(theta);
    }
    return pos;
  }, [count]);

  const velocities = useMemo(() => {
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      vel[i * 3] = (Math.random() - 0.5) * 0.1;
      vel[i * 3 + 1] = Math.random() * 0.2; // float up
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return vel;
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const scroll = scrollYProgress.get();
    
    // Reverse gravity based on scroll
    const floatSpeed = scroll * 2;
    
    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = positionsAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      if (isFractured) {
        // Explosion! fly past camera
        posArray[i * 3] += velocities[i * 3] * 5;
        posArray[i * 3 + 1] += velocities[i * 3 + 1] * 5;
        posArray[i * 3 + 2] += 0.5; // fly towards camera (Z axis)
      } else {
        // Subtle floating up (reverse gravity)
        posArray[i * 3 + 1] += velocities[i * 3 + 1] * floatSpeed * 0.1;
        // Wrap around
        if (posArray[i * 3 + 1] > 5) posArray[i * 3 + 1] = -5;
      }
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial transparent color="#ffffff" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
    </Points>
  );
}

function HourglassGeometry({ scrollYProgress, isMobile }: { scrollYProgress: any, isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current) return;
    const scroll = scrollYProgress.get();
    
    // Phase 2: Tilt and Slide
    // Scroll 0.25 to 0.7:
    let targetX = 0;
    let targetY = 0;
    let targetRotateZ = 0;
    let targetRotateX = 0;
    
    if (scroll > 0.25) {
      const progress = Math.min((scroll - 0.25) / 0.45, 1); // 0 to 1 over Phase 2
      if (isMobile) {
        targetY = -3 * progress;
        targetRotateX = (Math.PI / 4) * progress; // tilt back
      } else {
        targetX = 4 * progress; // slide right
        targetRotateZ = -(Math.PI / 2) * progress; // tilt on side
      }
    }
    
    // Phase 3: Fracture (Hide or explode the geometry)
    if (scroll > 0.7) {
      const p3 = Math.min((scroll - 0.7) / 0.3, 1);
      groupRef.current.scale.setScalar(1 - p3); // shrink to nothing while particles explode
    } else {
      groupRef.current.scale.setScalar(1);
    }
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotateZ, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotateX, 0.05);
  });

  return (
    <group ref={groupRef}>
      {/* Top Cone */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[2, 3, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Bottom Cone */}
      <mesh position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2, 3, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Structural Rings */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial color="#006d38" roughness={0.4} metalness={0.8} emissive="#006d38" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, -3, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial color="#006d38" roughness={0.4} metalness={0.8} emissive="#006d38" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function SceneCamera({ scrollYProgress }: { scrollYProgress: any }) {
  useFrame(({ camera }) => {
    const scroll = scrollYProgress.get();
    
    // Phase 1: Low angle, looking up
    // Scroll 0 to 0.25
    let targetY = -4;
    let targetZ = 8;
    let targetLookY = 0;
    
    // Phase 2: Crane shot high bird's eye
    if (scroll > 0.2) {
      const progress = Math.min((scroll - 0.2) / 0.5, 1);
      targetY = -4 + (progress * 14); // move up to y=10
      targetZ = 8 + (progress * 6);   // move back to z=14
      targetLookY = progress * -2;    // look down
    }
    
    // Phase 3: Pull back aggressively
    if (scroll > 0.7) {
      const progress = Math.min((scroll - 0.7) / 0.3, 1);
      targetZ = 14 + (progress * 20); // pull way back
    }
    
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    
    const lookAtPos = new THREE.Vector3(0, targetLookY, 0);
    camera.lookAt(lookAtPos);
  });
  return null;
}

// --- MAIN PAGE COMPONENT ---

export default function Theme() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFractured, setIsFractured] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setIsFractured(v > 0.75); // trigger explosion
    });
    return () => unsub();
  }, [scrollYProgress]);

  // DOM Opacities mapping
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  
  const phase2Opacity = useTransform(scrollYProgress, [0.2, 0.25, 0.65, 0.7], [0, 1, 1, 0]);
  const phase2Y = useTransform(scrollYProgress, [0.2, 0.3], [50, 0]);

  const phase3Opacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);

  return (
    <div className="bg-[#050507] text-white">
      {/* 300vh Scroll Track */}
      <div ref={containerRef} className="h-[400vh] relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* WebGL Canvas Background */}
          <div className="absolute inset-0 z-0 bg-[#050507]">
            <Canvas camera={{ position: [0, -4, 8], fov: 45 }}>
              <SceneCamera scrollYProgress={scrollYProgress} />
              <ambientLight intensity={0.2} />
              <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
              <spotLight position={[-5, 5, 5]} angle={0.5} penumbra={1} intensity={1} color="#006d38" />
              <HourglassGeometry scrollYProgress={scrollYProgress} isMobile={isMobile} />
              <ParticleField scrollYProgress={scrollYProgress} isFractured={isFractured} />
              <Environment preset="city" />
            </Canvas>
          </div>

          {/* Phase 1 Overlay (0% - 25%) */}
          <motion.div 
            style={{ opacity: phase1Opacity }}
            className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center px-6 md:px-16"
          >
            <div className="absolute top-40 left-6 md:left-16">
              <span className="font-typewriter text-[10px] tracking-widest text-white/40 uppercase">
                [ THEME OVERVIEW ]
              </span>
            </div>
            
            <div className="w-full flex justify-center items-center">
              <h1 className="text-[18vw] md:text-[15vw] font-title font-black uppercase tracking-tighter leading-[0.8] text-center mix-blend-overlay opacity-80">
                BORROWED <br/> TIME.
              </h1>
            </div>
          </motion.div>

          {/* Phase 2 Overlay (26% - 70%) */}
          <motion.div 
            style={{ opacity: phase2Opacity, y: phase2Y }}
            className={`absolute z-10 w-full px-6 md:px-16 pointer-events-none ${isMobile ? 'top-[15%]' : 'left-0 top-1/2 -translate-y-1/2 max-w-2xl'}`}
          >
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary block">The Thesis</span>
                <h2 className="text-4xl md:text-6xl font-title font-black uppercase tracking-tighter leading-none">
                  Sustainability, <br/> Youth Legacy & <br/> Urgency.
                </h2>
              </div>
              <p className="font-editorial text-xl md:text-3xl italic text-white/60 leading-relaxed max-w-xl">
                We are borrowing time from our future selves. Navigating systems we didn't build, borrowing against a legacy we must now manage.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                <div>
                  <span className="font-title font-bold text-3xl md:text-4xl block text-white">01</span>
                  <span className="font-typewriter text-[9px] uppercase tracking-widest text-white/40">The Past</span>
                </div>
                <div>
                  <span className="font-title font-bold text-3xl md:text-4xl block text-white">02</span>
                  <span className="font-typewriter text-[9px] uppercase tracking-widest text-white/40">The Present</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Phase 3 Overlay (71% - 100%) */}
          <motion.div 
            style={{ opacity: phase3Opacity }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <Link 
              to="/speakers"
              className="pointer-events-auto flex flex-col items-center gap-6 group"
            >
              <h2 className="text-4xl md:text-6xl font-title font-black uppercase tracking-tighter text-white">
                THE LINEUP IS WAITING
              </h2>
              <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-brand-secondary transition-all shadow-[0_0_40px_rgba(0,109,56,0.5)]">
                <ArrowRight size={24} />
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
