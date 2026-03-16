"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DottedCircleProps {
  cx: number;
  cy: number;
  r: number;
  color?: string;
  opacity?: number;
  dotSize?: number;
  gap?: number;
  strokeWidth?: number;
  motion?: {
    x?: number;
    y?: number;
    rotate?: number;
    duration?: number;
  };
  className?: string;
}

export default function DottedCircle({
  cx,
  cy,
  r,
  color = "white",
  opacity = 0.6,
  dotSize = 1,
  gap = 6,
  strokeWidth = 2,
  motion = { x:20, y: 45, rotate: 360, duration: 20 },
  className = "",
}: DottedCircleProps) {
  const circleRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    if (!circleRef.current) return;

    gsap.to(circleRef.current, {
      x: motion.x ?? 0,
      y: motion.y ?? 0,
      rotation: motion.rotate ?? 360,
      duration: motion.duration,
      repeat: -1,
      ease: "linear",
      transformOrigin: "50% 50%",
    });
  }, [motion]);

  const size = (cx + r) * 2;


  return (
    <svg
      width={size + 400}
      height={size + 400}
      className={className}
      style={{
        position: "absolute",
        top: cy,
        left: cx ,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <circle
        ref={circleRef}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dotSize} ${gap}`}
        opacity={opacity}
      />
    </svg>
  );
}
