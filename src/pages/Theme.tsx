import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D SCENE COMPONENTS ---

// The Kinetic Spine (Line-Matrix Ribbon)
function KineticSpine({ scrollYProgress, isMobile, isFractured }: { scrollYProgress: any, isMobile: boolean, isFractured: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a dynamic, twisting spine using a TubeGeometry
  const { geometry, curve } = useMemo(() => {
    // A complex twisting curve
    class SpineCurve extends THREE.Curve<THREE.Vector3> {
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const tx = Math.sin(t * Math.PI * 4) * 2;
        const ty = (t - 0.5) * 30; // 30 units long vertically
        const tz = Math.cos(t * Math.PI * 4) * 2;
        return optionalTarget.set(tx, ty, tz);
      }
    }
    const curve = new SpineCurve();
    const geometry = new THREE.TubeGeometry(curve, 200, 1.5, 8, false);
    return { geometry, curve };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const scroll = scrollYProgress.get();
    
    // The ripple effect based on time and scroll
    // Faster rippling when scrolled further
    meshRef.current.rotation.y = clock.getElapsedTime() * (0.2 + scroll * 2);
    
    // Phase 2: Wormhole Curve Shift
    let targetX = 0;
    let targetY = 0;
    
    if (scroll > 0.25) {
      const progress = Math.min((scroll - 0.25) / 0.5, 1);
      if (isMobile) {
        // Swoop to upper 35% on mobile (camera is looking down, so move mesh up/forward relative to camera)
        targetY = 10 * progress; 
      } else {
        targetX = 6 * progress; // Slide right
      }
    }
    
    // If fractured, shrink the ribbon to 0
    if (isFractured) {
      meshRef.current.scale.lerp(new THREE.Vector3(0,0,0), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1,1,1), 0.1);
    }

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color="#006d38" wireframe={true} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// Particle Explosion for Phase 3
function ParticleStorm({ isFractured }: { isFractured: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = 3000;
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Start them tightly packed in the center
      pos[i * 3] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      // Explosion velocities outward
      vel[i * 3] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2 + 5; // Strong bias towards camera (Z axis)
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    
    if (isFractured) {
      pointsRef.current.visible = true;
      const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = positionsAttr.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        posArray[i * 3] += velocities[i * 3] * 0.5;
        posArray[i * 3 + 1] += velocities[i * 3 + 1] * 0.5;
        posArray[i * 3 + 2] += velocities[i * 3 + 2] * 0.5; // Flying towards screen
      }
      positionsAttr.needsUpdate = true;
    } else {
      pointsRef.current.visible = false;
      // Reset particles when not fractured
      const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        positionsAttr.array[i * 3] = positions[i * 3];
        positionsAttr.array[i * 3 + 1] = positions[i * 3 + 1];
        positionsAttr.array[i * 3 + 2] = positions[i * 3 + 2];
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} visible={false}>
      <PointMaterial transparent color="#ffffff" size={0.1} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

function SceneCamera({ scrollYProgress }: { scrollYProgress: any }) {
  useFrame(({ camera }) => {
    const scroll = scrollYProgress.get();
    
    // Phase 1: Locked Center
    let targetY = 0;
    let targetZ = 12;
    
    // Phase 2: Camera Wormhole Dive (26% - 75%)
    if (scroll > 0.25) {
      const progress = Math.min((scroll - 0.25) / 0.5, 1);
      // Dive down the Y axis (since the spine is vertical)
      targetY = -20 * progress; 
      // Move closer Z to simulate going "into" the wormhole
      targetZ = 12 - (8 * progress); 
    }
    
    // Phase 3: Hold position while particles fly past
    if (scroll > 0.75) {
      targetY = -20;
      targetZ = 4;
    }
    
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(new THREE.Vector3(0, targetY, 0));
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
      setIsFractured(v > 0.76); // Phase 3 trigger
    });
    return () => unsub();
  }, [scrollYProgress]);

  // DOM Opacities mapping
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const phase1Y = useTransform(scrollYProgress, [0, 0.25], [0, -100]);
  
  const phase2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.7, 0.75], [0, 1, 1, 0]);
  
  const phase3Opacity = useTransform(scrollYProgress, [0.76, 0.85], [0, 1]);

  return (
    <div className="bg-[#050507] text-white overflow-hidden">
      {/* 400vh Scroll Track */}
      <div ref={containerRef} className="h-[400vh] relative">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          >
            <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/50">Scroll to Explore</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-brand-secondary to-transparent" />
          </motion.div>

          {/* Text Layer (Behind the Ribbon for Phase 1 effect) */}
          <motion.div 
            style={{ opacity: phase1Opacity, y: phase1Y }}
            className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-center px-6 md:px-16"
          >
            <div className="w-full flex justify-center items-center">
              <h1 className="text-[18vw] md:text-[15vw] font-title font-black uppercase tracking-tighter leading-[0.8] text-center opacity-80">
                BORROWED <br/> TIME.
              </h1>
            </div>
          </motion.div>

          {/* WebGL Canvas (Sits ON TOP of Phase 1 text to slice through it) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} style={{ width: '100%', height: '100%' }}>
              <SceneCamera scrollYProgress={scrollYProgress} />
              <KineticSpine scrollYProgress={scrollYProgress} isMobile={isMobile} isFractured={isFractured} />
              <ParticleStorm isFractured={isFractured} />
            </Canvas>
          </div>

          {/* Phase 2 Overlay (26% - 75%) */}
          <motion.div 
            style={{ opacity: phase2Opacity }}
            className={`absolute z-20 w-full px-6 md:px-16 pointer-events-none h-full flex flex-col ${isMobile ? 'justify-end pb-[15%]' : 'justify-center max-w-2xl'}`}
          >
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4">
                <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary block">
                  [ INDEX: 01 // HORIZON ]
                </span>
                <h2 className="text-3xl md:text-6xl font-title font-black uppercase tracking-tighter leading-none">
                  Sustainability, <br/> Youth Legacy & <br/> Urgency.
                </h2>
              </div>
              <p className="font-editorial text-lg md:text-3xl italic text-white/60 leading-relaxed max-w-xl">
                We are borrowing time from our future selves. Navigating systems we didn't build, borrowing against a legacy we must now manage.
              </p>
            </div>
          </motion.div>

          {/* Phase 3 Gateway (76% - 100%) */}
          <motion.div 
            style={{ opacity: phase3Opacity }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <Link 
              to="/speakers"
              className="pointer-events-auto flex flex-col items-center gap-6 group"
            >
              <div className="w-20 h-20 rounded-full bg-brand-secondary flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-brand-secondary transition-all shadow-[0_0_80px_rgba(0,109,56,0.5)]">
                <ArrowRight size={32} />
              </div>
              <span className="font-typewriter text-[10px] tracking-[0.5em] uppercase text-white/50 group-hover:text-white transition-colors">
                ENTER THE STAGE
              </span>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
