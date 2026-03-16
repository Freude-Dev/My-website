"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface StripedCircleProps {
  size?: number;
  stripeWidth?: number;
  minScale?: number;
  maxScale?: number;
  duration?: number;
  className?: string;
}

export default function StripedCircle({
  size = 220,
  stripeWidth = 2,
  minScale = 0.9,
  maxScale = 1.05,
  duration = 2,
  className = "",
}: StripedCircleProps) {
  const circleRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!circleRef.current) return;

    gsap.fromTo(
      circleRef.current,
      { scale: minScale },
      {
        scale: maxScale,
        duration,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      }
    );
  }, [minScale, maxScale, duration]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
    >
      <defs>
        {/* Orange diagonal stripes */}
        <pattern
          id="orangeStripes"
          patternUnits="userSpaceOnUse"
          width={stripeWidth * 4}
          height={stripeWidth * 2}
          patternTransform="rotate(45)"
        >
          <rect
            width={stripeWidth}
            height={stripeWidth * 2}
            fill="#f97316" // orange-500
          />
        </pattern>
      </defs>

      <g ref={circleRef}>
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="url(#orangeStripes)"
        />
      </g>
    </svg>
  );
}
