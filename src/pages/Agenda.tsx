import React, { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

type AgendaItem = {
  id: string;
  time: string;
  title: string;
  speaker: string;
  desc: string;
  duration: string;
  type:
    | "KEYNOTE"
    | "BREAK"
    | "EXPERIENCE"
    | "LUNCH"
    | "GAME"
    | "SESSION"
    | "CEREMONY"
    | "VIDEO";
  sub?: AgendaItem[];
};

const AGENDA_ITEMS: AgendaItem[] = [
  {
    id: "00",
    time: "09:30 AM",
    title: "REGISTRATION",
    speaker: "Welcome Desk",
    desc: "Enter the monolithic space and receive your credentials. Access the primary viewing arrays and prepare for the temporal shift.",
    duration: "30M",
    type: "EXPERIENCE",
  },
  {
    id: "01",
    time: "10:00 AM",
    title: "INTRO SESSION",
    speaker: "Opening",
    desc: "The beginning of the end. An orientation to the systems and structures of Borrowed Time.",
    duration: "20M",
    type: "SESSION",
    sub: [
      {
        id: "01a",
        time: "10:00",
        title: "Welcome Address",
        speaker: "Hosts",
        desc: "Opening welcome to all attendees and a framing of the day ahead.",
        duration: "10M",
        type: "EXPERIENCE",
      },
      {
        id: "01b",
        time: "10:10",
        title: "Intro Video",
        speaker: "Screen",
        desc: "A cinematic video setting the tone for the Borrowed Time theme.",
        duration: "10M",
        type: "VIDEO",
      },
    ],
  },
  {
    id: "02",
    time: "10:20 AM",
    title: "SESSION 1",
    speaker: "3 Speakers + Game",
    desc: "The first block of ideas worth spreading, featuring three transformative speakers and an interactive game.",
    duration: "70M",
    type: "SESSION",
    sub: [
      {
        id: "02a",
        time: "10:20",
        title: "Speaker 1: Ridhwan Mohammed",
        speaker: "Alumni Speaker",
        desc: "An alumni perspective on borrowed time and life beyond school walls.",
        duration: "15M",
        type: "KEYNOTE",
      },
      {
        id: "02b",
        time: "10:35",
        title: "Short Break",
        speaker: "",
        desc: "A brief reset between speakers.",
        duration: "5M",
        type: "BREAK",
      },
      {
        id: "02c",
        time: "10:40",
        title: "Speaker 2: Anaya Rashid",
        speaker: "Culture of Time",
        desc: "Exploring how different cultures perceive, value, and manage their time differently across the globe.",
        duration: "15M",
        type: "KEYNOTE",
      },
      {
        id: "02d",
        time: "10:55",
        title: "Interactive Game",
        speaker: "Audience",
        desc: "A fast-paced interactive game connecting the audience to the theme.",
        duration: "10M",
        type: "GAME",
      },
      {
        id: "02e",
        time: "11:05",
        title: "Speaker 3: Zahra Datoo",
        speaker: "Nostalgia",
        desc: "A deep exploration of nostalgia — why we look back, what it costs us, and what it can teach us.",
        duration: "15M",
        type: "KEYNOTE",
      },
    ],
  },
  {
    id: "03",
    time: "11:30 AM",
    title: "TEA BREAK",
    speaker: "Refreshments",
    desc: "Curated refreshments and ambient networking. Recharge, connect, and exchange ideas.",
    duration: "20M",
    type: "BREAK",
  },
  {
    id: "04",
    time: "11:50 AM",
    title: "SESSION 2",
    speaker: "3 Speakers + Game",
    desc: "The second block of ideas — exploring innovation, urgency, and the cost of procrastination.",
    duration: "70M",
    type: "SESSION",
    sub: [
      {
        id: "04a",
        time: "11:50",
        title: "Speaker 4: Zahra Moledina",
        speaker: "The Best Thing Since Sliced Bread",
        desc: "How breakthroughs happen, why we miss them, and why the next big thing is already here.",
        duration: "15M",
        type: "KEYNOTE",
      },
      {
        id: "04b",
        time: "12:05",
        title: "Kahoot / Blooket",
        speaker: "Audience",
        desc: "An energizing quiz game to test and celebrate knowledge from the sessions so far.",
        duration: "10M",
        type: "GAME",
      },
      {
        id: "04c",
        time: "12:15",
        title: "Speaker 5: TBD",
        speaker: "Speaker",
        desc: "A surprise talk from a yet-to-be-announced speaker — the unknown is part of the borrowed time experience.",
        duration: "18M",
        type: "KEYNOTE",
      },
      {
        id: "04d",
        time: "12:33",
        title: "Mini Game",
        speaker: "Audience",
        desc: "A short interactive game before the final speaker of the session.",
        duration: "5M",
        type: "GAME",
      },
      {
        id: "04e",
        time: "12:38",
        title: "Speaker 6: Hassan Abbas Muhammad",
        speaker: "Procrastination",
        desc: "Dissecting the procrastination paradox — why we borrow against our own future and how to finally stop.",
        duration: "15M",
        type: "KEYNOTE",
      },
      {
        id: "04f",
        time: "12:53",
        title: "[ Buffer ]",
        speaker: "",
        desc: "Schedule buffer to ensure the session finishes on time.",
        duration: "7M",
        type: "BREAK",
      },
    ],
  },
  {
    id: "05",
    time: "01:00 PM",
    title: "SALAH & LUNCH",
    speaker: "Prayer + Food",
    desc: "Salah break followed by a curated lunch experience and partner activations. Refuel for the final session.",
    duration: "60M",
    type: "LUNCH",
  },
  {
    id: "06",
    time: "02:00 PM",
    title: "SESSION 3",
    speaker: "3 Speakers + 2 Games",
    desc: "The grand finale — three visionary speakers and two games bring the Borrowed Time theme to its crescendo.",
    duration: "75M",
    type: "SESSION",
    sub: [
      {
        id: "06a",
        time: "02:00",
        title: "Speaker 7: Yunus Osman",
        speaker: "The Art of Scheduling (Alumni)",
        desc: "An alumni master-class on how to design your time intentionally and build systems that work.",
        duration: "15M",
        type: "KEYNOTE",
      },
      {
        id: "06b",
        time: "02:15",
        title: "Interactive Game",
        speaker: "Audience",
        desc: "An audience game to reset energy before the next speaker.",
        duration: "10M",
        type: "GAME",
      },
      {
        id: "06c",
        time: "02:25",
        title: "Speaker 8: Sada Mbaruk",
        speaker: "End of the World",
        desc: "A provocative exploration of what happens when we run out of borrowed time — individually and globally.",
        duration: "15M",
        type: "KEYNOTE",
      },
      {
        id: "06d",
        time: "02:40",
        title: "Imposter Game",
        speaker: "Audience",
        desc: "The iconic imposter social deduction game — who can you trust with your time?",
        duration: "10M",
        type: "GAME",
      },
      {
        id: "06e",
        time: "02:50",
        title: "Speaker 9: Liyaan Karbelkar",
        speaker: "How to Take Your Wealth With You",
        desc: "How to build legacy, purpose, and impact that outlasts the finite window of your borrowed time.",
        duration: "15M",
        type: "KEYNOTE",
      },
      {
        id: "06f",
        time: "03:05",
        title: "[ Buffer ]",
        speaker: "",
        desc: "Schedule buffer to ensure clean handoff to closing.",
        duration: "10M",
        type: "BREAK",
      },
    ],
  },
  {
    id: "07",
    time: "03:15 PM",
    title: "CLOSING CEREMONY",
    speaker: "All",
    desc: "The temporal window closes. Awards, acknowledgements, and the final message — make the most of your borrowed time.",
    duration: "45M",
    type: "CEREMONY",
  },
];

const TYPE_COLORS: Record<string, string> = {
  KEYNOTE: "#006d38",
  SESSION: "#000839",
  BREAK: "#767681",
  EXPERIENCE: "#4e5a98",
  LUNCH: "#767681",
  GAME: "#006d38",
  CEREMONY: "#000839",
  VIDEO: "#4e5a98",
};

// 3D Shader Background Component
function KineticSpine({ scrollYProgress, isMobile }: { scrollYProgress: any, isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { geometry } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 2, 1),
      new THREE.Vector3(2, 4, 0),
      new THREE.Vector3(3, 6, -1),
      new THREE.Vector3(4, 8, 0),
    ]);
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

export default function Agenda() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFractured, setIsFractured] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
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
      {/* 400vh Scroll Track - same as Theme page */}
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
                [ AGENDA OVERVIEW ]
              </span>
              <h1 className="text-[14vw] md:text-[12vw] font-title font-black uppercase tracking-tighter leading-[0.85] text-white">
                THE TIMELINE
              </h1>
            </div>
          </motion.div>

          {/* WebGL Canvas (middle z-index) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} style={{ width: '100%', height: '100%' }}>
              <SceneCamera scrollYProgress={scrollYProgress} />
              <KineticSpine scrollYProgress={scrollYProgress} isMobile={isMobile} />
              <ParticleStorm active={isFractured} />
            </Canvas>
          </div>

          {/* Phase 2: Agenda Content */}
          <motion.div
            style={{ opacity: phase2Opacity }}
            className="absolute inset-0 z-20 flex items-center pointer-events-none"
          >
            <div className={`w-full px-6 md:px-16 ${isMobile ? 'flex flex-col justify-end pb-24 h-full' : 'max-w-2xl'}`}>
              <div className="space-y-6 md:space-y-10">
                <div>
                  <span className="font-typewriter text-[9px] uppercase tracking-[0.6em] text-brand-secondary block mb-4">
                    [ INDEX: 01 // EVENT SCHEDULE ]
                  </span>
                  <h2 className="text-4xl md:text-6xl font-title font-black uppercase tracking-tighter leading-[0.9] text-white">
                    Full Day<br />
                    <span className="text-brand-secondary">Agenda.</span>
                  </h2>
                </div>
                <p className="font-editorial text-xl md:text-3xl italic text-white/60 leading-relaxed max-w-xl">
                  A complete timeline of talks, experiences, and moments that explore the urgency of borrowed time.
                </p>
                <div className="border-t border-white/10 pt-6">
                  <p className="font-sans text-sm text-white/40 leading-relaxed max-w-lg">
                    From registration to closing ceremony, each session builds upon the theme of time, legacy, and urgency.
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
            <span className="font-typewriter text-[10px] tracking-[0.5em] uppercase text-white/50">
              Scroll to view full schedule
            </span>
          </motion.div>

        </div>
      </div>

      {/* Below-the-fold: Full Agenda List */}
      <div className="relative bg-[#050507] z-10 py-32 px-6 md:px-16 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-32">
          {AGENDA_ITEMS.map((item) => (
            <div key={item.id} className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="font-title font-black text-3xl md:text-4xl tracking-tighter uppercase text-white">
                  {item.time}
                </span>
                <span 
                  className="font-typewriter text-[10px] uppercase tracking-[0.5em]"
                  style={{ color: TYPE_COLORS[item.type] }}
                >
                  {item.type}
                </span>
              </div>
              <h3 className="font-title font-bold text-xl md:text-2xl uppercase text-white">
                {item.title}
              </h3>
              {item.speaker && (
                <p className="font-editorial text-lg italic text-white/70">
                  {item.speaker}
                </p>
              )}
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                {item.desc}
              </p>
              
              {/* Sub-items */}
              {item.sub && item.sub.length > 0 && (
                <div className="pt-4 space-y-3 border-t border-white/10">
                  {item.sub.map((sub) => (
                    <div key={sub.id} className="pl-4 border-l-2" style={{ borderColor: TYPE_COLORS[sub.type] }}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-typewriter text-[9px] uppercase tracking-widest" style={{ color: TYPE_COLORS[sub.type] }}>
                          {sub.time}
                        </span>
                        <span className="font-typewriter text-[8px] uppercase text-white/40">
                          {sub.type}
                        </span>
                      </div>
                      <p className="font-title font-bold text-base uppercase text-white">
                        {sub.title}
                      </p>
                      {sub.speaker && (
                        <p className="font-editorial text-sm italic text-white/50">
                          {sub.speaker}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
