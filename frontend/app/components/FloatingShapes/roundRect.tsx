"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface RoundedRectangleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  motion?: { x?: number; y?: number; duration?: number };
}

export default function RoundedRectangle({
  x,
  y,
  width,
  height,
  radius = 14,
  stroke = "#fb923c",
  strokeWidth = 2,
  opacity = 0.45,
  motion = { x: 10, y: -20, duration: 3 },
}: RoundedRectangleProps) {
  const rectRef = useRef<SVGRectElement | null>(null);

  useEffect(() => {
    if (!rectRef.current) return;

    gsap.to(rectRef.current, {
      x: motion.x,
      y: motion.y,
      duration: motion.duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [motion]);

  return (
    <svg
      width={width+100}
      height={height+100}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none", // so it doesn't block clicks
      }}
    >
      <rect
        ref={rectRef}
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    </svg>
  );
}
