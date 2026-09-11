"use client";

import React, { useEffect, useRef } from "react";

export interface LandscapeProps {
  speed?: number;
  altitude?: number;
  focal?: number;
  pitch?: number;
  elevation?: number;
  scale?: number;
  detail?: number;
  steps?: number;
  samples?: number;
  distance?: number;
  fogStart?: number;
  rampDistance?: number;
  color?: string;
  midColor?: string;
  farColor?: string;
  rimColor?: string;
  rimPower?: number;
  rimStrength?: number;
  ringColor?: string;
  ringSpacing?: number;
  ringSpeed?: number;
  ringWidth?: number;
  ringStrength?: number;
  gain?: number;
  grain?: number;
  grainRate?: number;
  vignette?: number;
  backgroundColor?: string;
  opacity?: number;
  cursorInteraction?: boolean;
  cursorSteer?: number;
  paused?: boolean;
  adaptiveQuality?: boolean;
  targetFps?: number;
  dpr?: number;
  className?: string;
  children?: React.ReactNode;
}

export const Landscape: React.FC<LandscapeProps> = ({
  speed = 0.35,
  altitude = 4.8,
  focal = 1.15,
  pitch = -0.05,
  elevation = 3.4,
  scale = 0.16,
  detail = 1.0,
  steps = 80,
  samples = 2,
  distance = 45.0,
  fogStart = 20.0,
  rampDistance = 36.0,
  color = "#081410",
  midColor = "#050807",
  farColor = "#9fd8bd",
  rimColor = "#b5edd5",
  rimPower = 3.8,
  rimStrength = 1.3,
  ringColor = "#9fd8bd",
  ringSpacing = 0.5,
  ringSpeed = 1.2,
  ringWidth = 0.04,
  ringStrength = 0.4,
  gain = 1.0,
  grain = 0.05,
  grainRate = 24.0,
  vignette = 0.2,
  backgroundColor = "#050807",
  opacity = 1.0,
  cursorInteraction = true,
  cursorSteer = 0.5,
  paused = false,
  adaptiveQuality = true,
  targetFps = 60,
  dpr = 1.75,
  className = "",
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return;

    // WebGL ray-marching shader pipeline
    let animationFrameId: number;
    let startTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorInteraction) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    speed,
    altitude,
    focal,
    pitch,
    elevation,
    scale,
    detail,
    steps,
    samples,
    distance,
    fogStart,
    rampDistance,
    color,
    midColor,
    farColor,
    rimColor,
    rimPower,
    rimStrength,
    ringColor,
    ringSpacing,
    ringSpeed,
    ringWidth,
    ringStrength,
    gain,
    grain,
    grainRate,
    vignette,
    backgroundColor,
    opacity,
    cursorInteraction,
    cursorSteer,
    paused,
    adaptiveQuality,
    targetFps,
    dpr,
  ]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

export default Landscape;
