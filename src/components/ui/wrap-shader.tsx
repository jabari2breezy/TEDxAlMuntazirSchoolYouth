import { Warp } from "@paper-design/shaders-react";

interface WarpShaderBackgroundProps {
  className?: string;
}

/** Full-bleed warp shader — background only, no demo copy */
export function WarpShaderBackground({ className = "" }: WarpShaderBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <Warp
        style={{ height: "100%", width: "100%" }}
        proportion={0.45}
        softness={1}
        distortion={0.25}
        swirl={0.8}
        swirlIterations={10}
        shape="checks"
        shapeScale={0.1}
        scale={1}
        rotation={0}
        speed={0.85}
        colors={[
          "hsl(200, 100%, 20%)",
          "hsl(160, 100%, 75%)",
          "hsl(180, 90%, 30%)",
          "hsl(170, 100%, 80%)",
        ]}
      />
      <div className="absolute inset-0 bg-brand-primary/55 mix-blend-multiply" />
    </div>
  );
}
