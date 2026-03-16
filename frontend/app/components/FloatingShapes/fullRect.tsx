"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface RectangleProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
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

export default function Rectangle({
  x = 0,
  y = 0,
  width = 150,
  height = 80,
  radius = 10,
  color = "#3b82f6",
  dash = "10 5",
  opacity = 0.5,
  motion = { x: 50, y: 0, duration: 2 },
}: RectangleProps) {
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
    <svg width={width + 100} height={height + 100}>
      <rect
        ref={rectRef}
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
    </svg>
  );
}
