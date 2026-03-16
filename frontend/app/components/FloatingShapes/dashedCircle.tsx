"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DashedCircleProps {
  cx: number;
  cy: number;
  r: number;
  width?: number;
  height?: number;
  color?: string;
  dash?: string;
  strokeWidth?: number;
  opacity?: number;
  motion?: {
    x?: number;
    y?: number;
    rotate?: number;
    duration?: number;
  };
  className?: string;
}

export default function DashedCircle({
  cx,
  cy,
  r,
  color = "#ffa500",
  dash = "10",
  opacity = 1,
  width = 200,
  height = 200,
  motion = { x: -20, y: 45, rotate: -8, duration: 7 },
  className = "",
}: DashedCircleProps) {
  const ref = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      x: motion.x,
      y: motion.y,
      rotation: motion.rotate,
      duration: motion.duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [motion]);

  return (
    <svg
      width={width}
      height={height}
      className={className}
      >
        <circle
      ref={ref}
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={color}
      color={color}
      strokeWidth="2"
      strokeDasharray={dash}
      opacity={opacity}
    />
      </svg>
    
  );
}
