import { useRef, useMemo } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    pos.y += sin(pos.x * 10.0 + time) * 0.1 * intensity;
    pos.x += cos(pos.y * 8.0 + time * 1.5) * 0.05 * intensity;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 15.0 + time * 0.8);
    noise += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;
    
    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * intensity * 0.3);
    
    float glow = 1.0 - length(uv - 0.5) * 1.8;
    glow = clamp(pow(glow, 1.5), 0.0, 1.0);
    
    gl_FragColor = vec4(color, glow * 0.95);
  }
`;

function ShaderPlane({
  position,
  color1 = "#006d38",
  color2 = "#000839",
}: {
  position: [number, number, number];
  color1?: string;
  color2?: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      intensity: { value: 1.35 },
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) },
    }),
    [color1, color2]
  );

  useFrame((state) => {
    if (mesh.current) {
      uniforms.time.value = state.clock.elapsedTime * 0.4;
      uniforms.intensity.value = 1.1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.25;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[4, 4, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function EnergyRing({
  radius = 1.2,
  position = [0, 0, 0] as [number, number, number],
  color = "#006d38",
}: {
  radius?: number;
  position?: [number, number, number];
  color?: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.3;
      (mesh.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.07;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <ringGeometry args={[radius * 0.85, radius, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ShaderPlane position={[-1.2, 0.8, 0]} color1="#006d38" color2="#000839" />
      <ShaderPlane position={[1.5, -0.5, -0.5]} color1="#000839" color2="#006d38" />
      <EnergyRing radius={1.2} position={[0, 0, 0]} color="#006d38" />
      <EnergyRing radius={0.7} position={[1.5, 0.8, 0]} color="#004d28" />
      <EnergyRing radius={0.9} position={[-1, -0.6, 0]} color="#006d38" />
    </>
  );
}

export function BackgroundShaders({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
