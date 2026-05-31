import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D SCENE COMPONENTS ---

function KineticSpine({ scrollYProgress, isMobile }: { scrollYProgress: any, isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { geometry } = useMemo(() => {
    class SpineCurve extends THREE.Curve<THREE.Vector3> {
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const tx = Math.sin(t * Math.PI * 4) * 2;
        const ty = (t - 0.5) * 20;
        const tz = Math.cos(t * Math.PI * 4) * 2;
        return optionalTarget.set(tx, ty, tz);
      }
    }
    const curve = new SpineCurve();
    const geometry = new THREE.TubeGeometry(curve, 200, 1.2, 8, false);
    return { geometry };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const scroll = scrollYProgress.get();
    meshRef.current.rotation.y = clock.getElapsedTime() * (0.15 + scroll * 1.5);

    let targetX = 0;
    if (scroll > 0.25 && !isMobile) {
      const progress = Math.min((scroll - 0.25) / 0.5, 1);
      targetX = 5 * progress;
    }
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color="#006d38" wireframe transparent opacity={0.5} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function ParticleStorm({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2000;
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      vel[i * 3] = (Math.random() - 0.5) * 1.5;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 1.5 + 3;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    if (active) {
      pointsRef.current.visible = true;
      const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3] += velocities[i * 3] * 0.4;
        arr[i * 3 + 1] += velocities[i * 3 + 1] * 0.4;
        arr[i * 3 + 2] += velocities[i * 3 + 2] * 0.4;
      }
      attr.needsUpdate = true;
    } else {
      pointsRef.current.visible = false;
      const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        attr.array[i * 3] = positions[i * 3];
        attr.array[i * 3 + 1] = positions[i * 3 + 1];
        attr.array[i * 3 + 2] = positions[i * 3 + 2];
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} visible={false}>
      <PointMaterial transparent color="#006d38" size={0.08} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

function SceneCamera({ scrollYProgress }: { scrollYProgress: any }) {
  useFrame(({ camera }) => {
    const scroll = scrollYProgress.get();
    let targetZ = 12;
    if (scroll > 0.25) {
      const p = Math.min((scroll - 0.25) / 0.5, 1);
      targetZ = 12 - 6 * p;
    }
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
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
    const unsub = scrollYProgress.on("change", (v) => setIsFractured(v > 0.78));
    return () => unsub();
  }, [scrollYProgress]);

  const phase1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.28], [1, 1, 0]);
  const phase1Y = useTransform(scrollYProgress, [0, 0.28], [0, -80]);
  const phase2Opacity = useTransform(scrollYProgress, [0.28, 0.36, 0.72, 0.78], [0, 1, 1, 0]);
  const phase3Opacity = useTransform(scrollYProgress, [0.78, 0.88], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div className="bg-[#050507] text-white">
      {/* 400vh Scroll Track */}
      <div ref={containerRef} className="h-[400vh] relative">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <span className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/50">Scroll to Explore</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-brand-secondary to-transparent" />
          </motion.div>

          {/* Phase 1: Massive Title */}
          <motion.div
            style={{ opacity: phase1Opacity, y: phase1Y }}
            className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-center items-center px-6 md:px-16"
          >
            <div className="text-center">
              <span className="font-typewriter text-[9px] uppercase tracking-[0.6em] text-brand-secondary block mb-6">
                [ THEME OVERVIEW ]
              </span>
              <h1 className="text-[14vw] md:text-[12vw] font-title font-black uppercase tracking-tighter leading-[0.85] text-white">
                BORROWED<br />
                <span className="text-brand-secondary">TIME.</span>
              </h1>
            </div>
          </motion.div>

          {/* WebGL Canvas (middle z-index, on top of Phase 1 text) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} style={{ width: '100%', height: '100%' }}>
              <SceneCamera scrollYProgress={scrollYProgress} />
              <KineticSpine scrollYProgress={scrollYProgress} isMobile={isMobile} />
              <ParticleStorm active={isFractured} />
            </Canvas>
          </div>

          {/* Phase 2: Theme Explanation Text (always rendered, opacity controlled) */}
          <motion.div
            style={{ opacity: phase2Opacity }}
            className="absolute inset-0 z-20 flex items-center pointer-events-none"
          >
            <div className={`w-full px-6 md:px-16 ${isMobile ? 'flex flex-col justify-end pb-24 h-full' : 'max-w-2xl'}`}>
              <div className="space-y-6 md:space-y-10">
                <div>
                  <span className="font-typewriter text-[9px] uppercase tracking-[0.6em] text-brand-secondary block mb-4">
                    [ INDEX: 01 // HORIZON ]
                  </span>
                  <h2 className="text-4xl md:text-6xl font-title font-black uppercase tracking-tighter leading-[0.9] text-white">
                    Sustainability,<br />
                    Youth Legacy<br />
                    &amp; Urgency.
                  </h2>
                </div>
                <p className="font-editorial text-xl md:text-3xl italic text-white/60 leading-relaxed max-w-xl">
                  We are borrowing time from our future selves. Navigating systems we didn't build, borrowing against a legacy we must now manage.
                </p>
                <div className="border-t border-white/10 pt-6">
                  <p className="font-sans text-sm text-white/40 leading-relaxed max-w-lg">
                    'Borrowed Time' explores the urgency of the human experience — examining how we navigate finite moments, push boundaries in innovation, and make impactful choices before our window of opportunity closes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Phase 3: Gateway CTA */}
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

      {/* Below-the-fold: Full Theme Breakdown */}
      <div className="relative bg-[#050507] z-10 py-32 px-6 md:px-16 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          <div>
            <span className="font-typewriter text-[9px] uppercase tracking-[0.6em] text-brand-secondary block mb-8">
              [ INDEX: 02 // THE PREMISE ]
            </span>
            <h3 className="text-4xl md:text-5xl font-title font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
              What Does It Mean to Borrow Time?
            </h3>
            <div className="space-y-4 text-white/60 font-editorial text-lg italic leading-relaxed">
              <p>Every generation inherits a world shaped by those who came before. We inherit economies, environments, and systems — many of which were built at our expense.</p>
              <p>The question isn't whether we are borrowing time. The question is what we choose to do with it before it runs out.</p>
            </div>
          </div>
          <div>
            <span className="font-typewriter text-[9px] uppercase tracking-[0.6em] text-brand-secondary block mb-8">
              [ INDEX: 03 // THE STAKES ]
            </span>
            <h3 className="text-4xl md:text-5xl font-title font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
              Three Clocks, One Generation.
            </h3>
            <div className="space-y-4 text-white/60 font-editorial text-lg italic leading-relaxed">
              <p>The environmental clock measures what we have left before irreversible damage. The economic clock tracks the debt we carry forward. The social clock counts the moments we have to build real change.</p>
              <p>Our speakers will explore each of these dimensions — and what young people can do right now.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
