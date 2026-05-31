"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface RainDrop {
  id: number
  left: number
  animationDuration: number
  opacity: number
  size: number
  delay: number
}

interface LightningBolt {
  id: number
  intensity: number
  duration: number
}

interface WeatherEffectProps {
  rainIntensity?: number
  rainSpeed?: number
  rainColor?: string
  rainAngle?: number
  rainDropSize?: { min: number; max: number }
  lightningEnabled?: boolean
  lightningFrequency?: number
  lightningHue?: number
  lightningXOffset?: number
  lightningSpeed?: number
  lightningIntensity?: number
  lightningSize?: number
  thunderEnabled?: boolean
  thunderVolume?: number
  thunderDelay?: number
  className?: string
  children?: React.ReactNode
}

export const WeatherEffect: React.FC<WeatherEffectProps> = ({
  rainIntensity = 50,
  rainSpeed = 0.2,
  rainColor = "rgba(0, 200, 100, 0.5)",
  rainAngle = 10,
  rainDropSize = { min: 1, max: 2 },
  lightningEnabled = true,
  lightningFrequency = 4,
  lightningHue = 140,
  lightningXOffset = 0,
  lightningSpeed = 1,
  lightningIntensity = 1,
  lightningSize = 1,
  thunderEnabled = false,
  thunderVolume = 0.5,
  thunderDelay = 2,
  className,
  children,
}) => {
  const [raindrops, setRaindrops] = useState<RainDrop[]>([])
  const [lightning, setLightning] = useState<LightningBolt | null>(null)
  const lightningTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Generate raindrops
  useEffect(() => {
    const drops: RainDrop[] = Array.from({ length: rainIntensity }).map(
      (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: (Math.random() * 1 + 0.5) / rainSpeed,
        opacity: Math.random() * 0.5 + 0.2,
        size:
          Math.random() * (rainDropSize.max - rainDropSize.min) +
          rainDropSize.min,
        delay: Math.random() * 2,
      })
    )
    setRaindrops(drops)
  }, [rainIntensity, rainSpeed, rainDropSize])

  // Lightning trigger logic
  const triggerLightning = useCallback(() => {
    if (!lightningEnabled) return

    const newLightning: LightningBolt = {
      id: Date.now(),
      intensity: Math.random() * 0.6 + 0.3,
      duration: 150 + Math.random() * 200,
    }

    setLightning(newLightning)

    setTimeout(() => {
      setLightning(null)
    }, newLightning.duration)

    const nextStrike =
      (lightningFrequency + Math.random() * lightningFrequency) * 1000
    lightningTimeoutRef.current = setTimeout(triggerLightning, nextStrike)
  }, [lightningEnabled, lightningFrequency])

  // Start the lightning cycle
  useEffect(() => {
    if (lightningEnabled) {
      const initialDelay = Math.random() * lightningFrequency * 1000
      lightningTimeoutRef.current = setTimeout(triggerLightning, initialDelay)
    }
    return () => {
      if (lightningTimeoutRef.current) {
        clearTimeout(lightningTimeoutRef.current)
      }
    }
  }, [lightningEnabled, triggerLightning, lightningFrequency])

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* Screen Flash Effect - Green tinted */}
      {lightning && (
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background: `radial-gradient(circle, rgba(0, 200, 100, ${lightning.intensity * 0.3}) 0%, transparent 70%)`,
            animation: `lightning-flash ${lightning.duration}ms ease-out forwards`,
          }}
        />
      )}

      {/* Rain Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          transform: `rotate(${rainAngle}deg)`,
          transformOrigin: "center center",
        }}
      >
        {raindrops.map(drop => (
          <div
            key={drop.id}
            className="absolute top-[-20px]"
            style={{
              left: `${drop.left}%`,
              width: `${drop.size}px`,
              height: `${drop.size * 10}px`,
              background: `linear-gradient(to bottom, transparent, ${rainColor})`,
              borderRadius: `${drop.size}px`,
              animation: `rain-fall ${drop.animationDuration}s linear infinite`,
              animationDelay: `${drop.delay}s`,
              opacity: drop.opacity,
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-40 flex h-full items-center justify-center">
        {children}
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes rain-fall {
          0% { transform: translateY(-20px); }
          100% { transform: translateY(calc(100vh + 20px)); }
        }
        @keyframes lightning-flash {
          0%, 100% { opacity: 0; }
          10%, 30% { opacity: 1; }
          20% { opacity: 0.3; }
          40% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

WeatherEffect.displayName = "WeatherEffect"
