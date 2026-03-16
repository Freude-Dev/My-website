"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DashedRectangleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  color?: string;
  dash?: string;
  opacity?: number;
  motion?: {
    x?: number;
    y?: number;
    duration?: number;
  };
}

export default function DashedRectangle({
  x,
  y,
  width,
  height,
  radius = 14,
  color = "#fb923c",
  dash = "12 8",
  opacity = 0.45,
  motion = { y: -40, x: -15, duration: 6 },
  
}: DashedRectangleProps) {
  const ref = useRef<SVGRectElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      x: motion.x,
      y: motion.y,
      duration: motion.duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [motion]);

  return (
    <rect
      ref={ref}
      x={x}
      y={y}
      width={width}
      height={height}
      rx={radius}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray={dash}
      opacity={opacity}
    />
  );
}
